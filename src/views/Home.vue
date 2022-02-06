<template>
<div class="flex flex-col justify-center">
  <div class="tabs mb-2 mt-8">
    <div @click="tab = 0" class="tab tab-lg tab-lifted" :class="{'tab-active': tab === 0 || swaps.length === 0}">Create swap</div>
    <div v-show="swaps.length > 0" @click="tab = 1" class="tab tab-lg tab-lifted" :class="{'tab-active': tab === 1}">My swaps</div>
    <div class="flex-1 cursor-default tab tab-lifted"></div>
  </div>
  <div v-if="tab === 0" class="py-6">
    <div class="flex flex-col justify-center md:flex-row gap-6">
      <div class="p-10 card bg-base-200">
        <h2 class="text-2xl mb-4">Offer</h2>
        <token-input-group v-model="offer" ref="ioffer" />
      </div>
      <div class="p-10 card bg-base-200">
        <h2 class="text-2xl mb-4">Receive</h2>
        <token-input-group v-model="want" ref="iwant" />
      </div>
    </div>
    <button @click="createOffer" :class="{loading: creating}" type="button" class="w-40 mt-6 btn">Create swap</button>
  </div>
  <div v-if="tab === 1" class="py-6">
    <div class="flex flex-col items-start md:flex-row gap-6 flex-wrap">
      <div v-for="swap in swaps" :key="swap[0]" class="bg-gray-100 rounded-xl p-4 flex-1">
        <div class="relative">
          <button class="btn btn-ghost btn-square btn-xs absolute right-0">
          <svg @click="copySwapUrl(swap[0])" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          </button>
          I give:
          <token-bundle :bundle="swap[1].gives" class="mt-1 mb-4" />
          I want:
          <token-bundle :bundle="swap[1].wants" class="mt-1 mb-4" />
          <button @click="cancelOffer(swap[0])" :class="{ loading: cancelling }" class="btn btn-sm">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  <div v-show="modal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
    <div class="modal-box">
      <p>This is an experimental tool. Use at your own risk</p>
      <div class="modal-action">
        <button @click="modal = false" class="btn">OK</button>
      </div>
  </div>
</div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import TokenBundle from '../components/TokenBundle.vue'
import TokenInputGroup from '../components/TokenInputGroup.vue'
// import PetList from '../components/PetList.vue'

export default {
  components: { TokenInputGroup, TokenBundle },
  // components: { PetList },
  name: 'Home',
  data () {
    return {
      timer: null,
      creating: false,
      cancelling: false,
      tab: 0,
      offer: [],
      want: [],
      showModal: !localStorage.getItem('modalShown'),
      swaps: []
    }
  },
  mounted () {
    this.poll()
    this.$store.dispatch('onTransactionStream', (data) => {
      console.log('>>>>>>', data)
    })
  },
  computed: {
    ...mapState(['swapsCreated', 'userAddress']),
    modal: {
      get () {
        return this.showModal
      },
      set (value) {
        if (value) localStorage.removeItem('modalShown')
        else localStorage.setItem('modalShown', 'yes')
        this.showModal = value
      }
    },
    params () {
      const offer = {}
      const want = {}
      this.offer.forEach(({ kt, id, amount }) => {
        if (!offer[kt]) {
          offer[kt] = []
        }
        offer[kt].push({ token_id: id, amount })
      })
      this.want.forEach(({ kt, id, amount }) => {
        if (!want[kt]) {
          want[kt] = []
        }
        want[kt].push({ token_id: id, amount })
      })
      return [offer, want]
    }
  },
  methods: {
    async createOffer () {
      try {
        if (this.creating) return
        if (!this.userAddress) {
          this.$toast.warning('Connect wallet first')
          return
        }
        if (!this.$refs.ioffer.validate() || !this.$refs.iwant.validate()) throw new Error('Fill in the swap form correctly')
        this.creating = true
        await this.$store.dispatch('createOffer', this.params)
      } catch (e) {
        const data = e.data?.find(it => !!it.with)
        console.log(data)
        this.$toast.error(data?.with?.string || e.message)
      } finally {
        this.creating = false
      }
    },
    async cancelOffer (id) {
      try {
        if (this.cancelling) return
        this.cancelling = true
        await this.$store.dispatch('cancelOffer', id)
      } catch (e) {
        const data = e.data?.find(it => !!it.with)
        console.log(data)
        this.$toast.error(data?.with?.string || e.message)
      } finally {
        this.cancelling = false
      }
    },
    copySwapUrl (id) {
      this.$copyText(`${window.location.origin}/swap/${id}`).then((e) => {
        this.$toast.info('Swap URL copied to clipboard')
        console.log(e)
      }, (e) => {
        this.$toast.error('Could not copy URL to clipboard')
        console.log(e)
      })
    },
    async poll () {
      clearTimeout(this.timer)
      this.timer = null
      const swaps = await this.$store.dispatch('listUserOffers', this.userAddress)
      this.$set(this, 'swaps', swaps || [])
      this.timer = setTimeout(this.poll, 12222)
    }
  }
}
</script>

<style>
.modal-overlay {
  z-index: 10;
  display: flex;
  background-color: rgba(0,0,0,0.33);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: center;
  align-items: center;
}
.modal-content {
  position: relative;
  width: 100%;
  max-width: 360px;
  height: fit-content;
  padding: 32px 0;
  background-color: rgba(44,44,44,1);
  color: #fff;
  display: flex;
  border-radius: 12px;
}
.modal-close {
  position: absolute;
  top: 0px;
  right: 16px;
  color: #000;
  transition: all 0.4s;
  font-size: 32px;
  padding: 4px;
  cursor: pointer;
}
.modal-loader {
  width: 100%;
  overflow: hidden;
  max-width: 360px;
  height: fit-content;
  padding: 0;
  display: flex;
  border-radius: 20px;
}
.modal-close:hover {
  color: #fff;
}
/* Buzz Out */
@-webkit-keyframes vibrate-fx {
  10% {
    -webkit-transform: translateX(3px) rotate(2deg);
    transform: translateX(3px) rotate(2deg);
  }
  20% {
    -webkit-transform: translateX(-3px) rotate(-2deg);
    transform: translateX(-3px) rotate(-2deg);
  }
  30% {
    -webkit-transform: translateX(3px) rotate(2deg);
    transform: translateX(3px) rotate(2deg);
  }
  40% {
    -webkit-transform: translateX(-3px) rotate(-2deg);
    transform: translateX(-3px) rotate(-2deg);
  }
  50% {
    -webkit-transform: translateX(2px) rotate(1deg);
    transform: translateX(2px) rotate(1deg);
  }
  60% {
    -webkit-transform: translateX(-2px) rotate(-1deg);
    transform: translateX(-2px) rotate(-1deg);
  }
  70% {
    -webkit-transform: translateX(2px) rotate(1deg);
    transform: translateX(2px) rotate(1deg);
  }
  80% {
    -webkit-transform: translateX(-2px) rotate(-1deg);
    transform: translateX(-2px) rotate(-1deg);
  }
  90% {
    -webkit-transform: translateX(1px) rotate(0);
    transform: translateX(1px) rotate(0);
  }
  100% {
    -webkit-transform: translateX(-1px) rotate(0);
    transform: translateX(-1px) rotate(0);
  }
}
@keyframes vibrate-fx {
  10% {
    -webkit-transform: translateX(3px) rotate(2deg);
    transform: translateX(3px) rotate(2deg);
  }
  20% {
    -webkit-transform: translateX(-3px) rotate(-2deg);
    transform: translateX(-3px) rotate(-2deg);
  }
  30% {
    -webkit-transform: translateX(3px) rotate(2deg);
    transform: translateX(3px) rotate(2deg);
  }
  40% {
    -webkit-transform: translateX(-3px) rotate(-2deg);
    transform: translateX(-3px) rotate(-2deg);
  }
  50% {
    -webkit-transform: translateX(2px) rotate(1deg);
    transform: translateX(2px) rotate(1deg);
  }
  60% {
    -webkit-transform: translateX(-2px) rotate(-1deg);
    transform: translateX(-2px) rotate(-1deg);
  }
  70% {
    -webkit-transform: translateX(2px) rotate(1deg);
    transform: translateX(2px) rotate(1deg);
  }
  80% {
    -webkit-transform: translateX(-2px) rotate(-1deg);
    transform: translateX(-2px) rotate(-1deg);
  }
  90% {
    -webkit-transform: translateX(1px) rotate(0);
    transform: translateX(1px) rotate(0);
  }
  100% {
    -webkit-transform: translateX(-1px) rotate(0);
    transform: translateX(-1px) rotate(0);
  }
}
.vibrate-fx {
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  ---box-shadow: 0 0 1px rgba(0, 0, 0, 0);
}
.vibrate-fx, .vibrate-fx:focus, .vibrate-fx:active {
  -webkit-animation-name: vibrate-fx;
  animation-name: vibrate-fx;
  -webkit-animation-duration: 0.75s;
  animation-duration: 0.75s;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
}
</style>

