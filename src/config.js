import { NetworkType } from '@airgap/beacon-sdk'
const PROJECT_NAME = 'Tez otc'
const NETWORK = NetworkType.MAINNET

export default {
  endpoint: NETWORK === NetworkType.MAINNET ? 'https://mainnet.visualtez.com' : 'https://hangzhounet.api.tez.ie',
  explorer: 'https://tzkt.io',
  tzktapi: NETWORK === NetworkType.MAINNET ? 'https://api.tzkt.io' : 'https://api.hangzhou2net.tzkt.io',
  network: NETWORK, // MAINNET
  kt: 'KT1Ueg6BTYcj2HBqDARuVTMp5KJjfVSyAQzV', // mainnet
  pageSize: 20,
  pollInterval: 15000,
  projectName: PROJECT_NAME,
  walletOptions: {
    name: PROJECT_NAME,
  }
}