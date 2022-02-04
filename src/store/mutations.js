export default {
  frontendStorage (state, storage) {
    state.swapsCreated = storage.last_id.toNumber()
    state.loading = false
  },
  userAddress (state, address) {
    state.userAddress = address || ''
  },
  loading (state, payload) {
    state.loading = payload
  }
}
