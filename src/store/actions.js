import config from '@/config'
import { TezosToolkit, MichelCodecPacker, OpKind, MichelsonMap } from '@taquito/taquito'
import { BeaconWallet } from '@taquito/beacon-wallet'
import api from '../app/api'

const tezos = new TezosToolkit(config.endpoint)
tezos.setPackerProvider(new MichelCodecPacker())
const wallet = new BeaconWallet(config.walletOptions)
tezos.setWalletProvider(wallet)

const subscribeOperation = tezos.stream.subscribeOperation({
  and: [
    { destination: config.kt }, // must be our action contract
    { kind: OpKind.TRANSACTION }
  ]
})

const pool = {}

async function getContract (kt) {
  if (!pool[kt]) {
    pool[kt] = tezos.wallet.at(kt)
  }
  return await pool[kt]
}

export default {

  async init ({ commit }) {
    if (await wallet.client.getActiveAccount()) {
      const address = await wallet.getPKH()
      commit('userAddress', address)
    }
    const contract = await getContract(config.kt)
    const poll = async () => {
      const storage = await contract.storage()
      commit('frontendStorage', storage)
      // console.log(storage)
      setTimeout(poll, config.pollInterval)
    }
    poll()
    subscribeOperation.on('data', data => {
      console.log('accept_swap:', data.parameters?.entrypoint === 'accept_swap')
    })
  },

  onTransactionStream (_, cb) {
    subscribeOperation.on('data', cb)
  },

  offTransactionStream (_, cb) {
    subscribeOperation.off('data', cb)
  },

  async connectWallet ({ state, commit, dispatch }) {
    let activeAccount = await wallet.client.getActiveAccount()
    try {
      if (!activeAccount) {
        await dispatch('disconnectWallet')
        await wallet.requestPermissions({
          network: {
            type: config.network
          }
        })
        activeAccount = await wallet.client.getActiveAccount()
        if (!activeAccount) {
          throw new Error('Wallet not connected')
        }
      }
      const address = await wallet.getPKH()
      commit('userAddress', address)
    } catch (e) {
      console.log(e)
      await dispatch('disconnectWallet')
    }
    return !!state.userAddress
  },

  async disconnectWallet ({ commit }) {
    await wallet.clearActiveAccount()
    commit('userAddress', null)
  },

  async addOperatorsParam ({ state }, tokens) {
    return tokens.map(({ token_id }) => {
      return {
        add_operator: {
          token_id,
          owner: state.userAddress,
          operator: config.kt
        }
      }
    })
  },

  async createOffer ({ dispatch }, [offerBundle, wantBundle]) {
    try {
      await dispatch('connectWallet')
      const data = Object.entries(offerBundle)
      const contracts = []
      for (let i = 0; i < data.length; i++) {
        contracts.push({
          contract: await getContract(data[i][0]),
          addOpParams: await dispatch('addOperatorsParam', data[i][1])
        })
      }
      console.log(contracts)
      const frontend = await getContract(config.kt)

      const batchParams = contracts.map(({contract, addOpParams}) => ({
        kind: OpKind.TRANSACTION,
        ...contract.methods.update_operators(addOpParams).toTransferParams()
      }))

      const batch = await tezos.wallet.batch([
        ...batchParams,
        {
          kind: OpKind.TRANSACTION,
          ...frontend.methods.create_swap(
            MichelsonMap.fromLiteral(offerBundle),
            MichelsonMap.fromLiteral(wantBundle)
          ).toTransferParams()
        }
      ])
      const batchOp = await batch.send()
      const result = await batchOp.confirmation()
      if (result.completed) {
        return true
      }
      throw new Error('Transaction failed')
    } catch (e) {
      if (e.title === 'Aborted') return false
      else throw e
    }
  },

  async cancelOffer ({ dispatch }, id) {
    try {
      await dispatch('connectWallet')
      const contract = await getContract(config.kt)
      const op = await contract.methods.cancel_swap(id).send()
      const result = await op.confirmation()
      if (result.completed) {
        return true
      }
      throw new Error('Transaction failed')
    } catch (e) {
      if (e.title === 'Aborted') return false
      else throw e
    }
  },

  async acceptOffer ({ dispatch }, { id, bundle }) {
    try {
      await dispatch('connectWallet')

      const data = Object.entries(bundle)
      const contracts = []
      for (let i = 0; i < data.length; i++) {
        contracts.push({
          contract: await getContract(data[i][0]),
          addOpParams: await dispatch('addOperatorsParam', data[i][1])
        })
      }
      console.log(contracts)
      const batchParams = contracts.map(({contract, addOpParams}) => ({
        kind: OpKind.TRANSACTION,
        ...contract.methods.update_operators(addOpParams).toTransferParams()
      }))

      const frontend = await getContract(config.kt)

      const batch = await tezos.wallet.batch([
        ...batchParams,
        {
          kind: OpKind.TRANSACTION,
          ...frontend.methods.accept_swap(id).toTransferParams()
        }
      ])
      const batchOp = await batch.send()
      const result = await batchOp.confirmation()
      if (result.completed) {
        return true
      }
      throw new Error('Transaction failed')
    } catch (e) {
      if (e.title === 'Aborted') return false
      else throw e
    }
  },
  async getSwap (_, id) {
    const params = { 'select.values': 'value', active: true, key: id }
    const [swap] = await api.getBigMapData(config.kt, 'swaps', params, 1000)
    console.log(swap)
    return swap
  },
  async listUserOffers (_, owner) {
    if (!owner) return
    const params = { 'select.values': 'key,value', active: true, 'value.owner': owner, limit: 500 }
    return await api.getBigMapData(config.kt, 'swaps', params, 1000)
  }
}
