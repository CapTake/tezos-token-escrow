import { NetworkType } from '@airgap/beacon-sdk'
const PROJECT_NAME = 'Tez pets'
const NETWORK = NetworkType.MAINNET

export default {
  endpoint: NETWORK === NetworkType.MAINNET ? 'https://mainnet.api.tez.ie' : 'https://hangzhounet.api.tez.ie',
  explorer: 'https://tzkt.io',
  tzktapi: NETWORK === NetworkType.MAINNET ? 'https://api.tzkt.io' : 'https://api.hangzhou2net.tzkt.io',
  network: NETWORK, // MAINNET
  crowdsale: 'KT1JxbKT8f1VdPCGkyg9oJH7XDrJF7rK92dU',
  pageSize: 20,
  pollInterval: 15000,
  projectName: PROJECT_NAME,
  walletOptions: {
    name: PROJECT_NAME,
    eventHandlers: {
      PERMISSION_REQUEST_SUCCESS: {
        handler: async (data) => {
          console.log('PERMISSION_REQUEST_SUCCESS', data)
        }
      },
      PERMISSION_REQUEST_SENT: {
        handler: async (data) => {
          console.log('PERMISSION_REQUEST_SENT', data)
        }
      },
      // PERMISSION_REQUEST_ERROR: {
      //   handler: async (data) => {
      //     console.log('PERMISSION_REQUEST_ERROR', data)
      //   }
      // },
      ACKNOWLEDGE_RECEIVED: {
        handler: async (data) => {
          console.log('ACKNOWLEDGE_RECEIVED', data)
        }
      },
      NO_PERMISSIONS: {
        handler: async (data) => {
          console.log('NO_PERMISSIONS', data)
        }
      },
      BROADCAST_REQUEST_SENT: {
        handler: async (data) => {
          console.log('BROADCAST_REQUEST_SENT', data)
        }
      },
      BROADCAST_REQUEST_SUCCESS: {
        handler: async (data) => {
          console.log('BROADCAST_REQUEST_SUCCESS', data)
        }
      },
      BROADCAST_REQUEST_ERROR: {
        handler: async (data) => {
          console.log('BROADCAST_REQUEST_ERROR', data)
        }
      }
    }
  }
}