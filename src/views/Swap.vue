<template>
<div class="flex flex-col justify-center">
  <h1 class="text-3xl">Swap #{{ swapId }}</h1>
  <div v-if="swap" class="py-6">
    <div class="flex flex-col items-start md:flex-row gap-6">
      <div class="p-10 card bg-base-200">
        <h2 class="text-2xl mb-4">Receive</h2>
        <token-bundle :bundle="offer" />
      </div>
      <div class="p-10 card bg-base-200">
        <h2 class="text-2xl mb-4">Offer</h2>
        <token-bundle :bundle="want" />
      </div>
    </div>
    <button @click="acceptOffer" :class="{loading: working}" type="button" class="w-40 mt-6 btn">Accept swap</button>
  </div>
  <div v-show="modal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
    <div class="modal-box">
      <p>Check Contract Address, ID and amount before any swap. Use with caution.</p> 
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

export default {
  components: { TokenBundle },
  props: {
    swapId: [Number, String] 
  },
  name: 'Swap',
  data () {
    return {
      timer: null,
      working: false,
      loading: false,
      modal: true,
      swap: null
    }
  },
  mounted () {
    this.loadOffer()
  },
  computed: {
    ...mapState(['userAddress']),
    want () {
      return this.swap ? this.swap.wants : false
    },
    offer () {
      return this.swap ? this.swap.gives : false
    }
  },
  methods: {
    async acceptOffer () {
      try {
        if (this.working) return
        this.working = true
        await this.$store.dispatch('acceptOffer', { id: this.swapId, bundle: this.want })
      } catch (e) {
        const data = e.data?.find(it => !!it.with)
        console.log(data)
        this.$toast.error(data?.with?.string || e.message)
      } finally {
        this.working = false
      }
    },
    async loadOffer () {
      try {
        this.loading = true
        this.swap = await this.$store.dispatch('getSwap', this.swapId)
        if (!this.swap) throw new Error(`Swap #${this.swapId} is not available any more`)
        console.log(this.swap)
      } catch (e) {
        const data = e.data?.find(it => !!it.with)
        console.log(data)
        this.$toast.error(data?.with?.string || e.message)
      } finally {
        this.loading = false
      }
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

