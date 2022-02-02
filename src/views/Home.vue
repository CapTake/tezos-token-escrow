<template>
<div class="flex flex-col justify-center">
  <div class="flex flex-col items-center md:flex-row justify-between gap-6">
      <div class="border-4 p-4 border-yellow-500 rounded-2xl">
          <h2 class="text-2xl mb-4">I offer</h2>
          <form action="" class="formStyle">
              <div>
                  <div class="inputStyle1">
                      <input type="text" name="" id="" placeholder="Contact Address">
                  </div>
                  <div class="inputStyle2">
                      <input type="text" name="" id="" placeholder="Token I.D">
                      <input type="text" name="" id="" placeholder="Amount">
                  </div>
                  <div class="imgStyle">
                      <img src="" alt="">
                  </div>
              </div>
              <div>
                  <input class="submitBtn" type="submit" value="Add">
              </div>
          </form>
      </div>
      <div class="border-4 p-4 border-yellow-500 rounded-2xl">
          <h2 class="text-2xl mb-4">For this:</h2>
          <token-input-group :value="want" />
      </div>
  </div>
  <button type="button" class="mt-8 text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:focus:ring-yellow-900">Create offer</button>
</div>
</template>

<script>
import { mapState } from 'vuex'
import TokenInputGroup from '../components/TokenInputGroup.vue'
// import PetList from '../components/PetList.vue'
import config from '../config'

export default {
  components: { TokenInputGroup },
  // components: { PetList },
  name: 'Home',
  data () {
    return {
      publicSaleStarted: false,
      timer: null,
      userPets: [],
      deadPetId: false,
      minting: false,
      maxId: false,
      minted1: false,
      minted2: false,
      minted3: false,
      minted4: false,
      minted5: false,
      offer: [],
      want: []
    }
  },
  mounted () {
    this.poll()
    this.$store.dispatch('onTransactionStream', (data) => {
      console.log('>>>>>>', data)
      if (data?.parameters?.entrypoint === 'mint') {
        const minted = `minted${data?.parameters?.value.int}`
        this[minted] = true
        const clear = function (it, param) {
          return () => { it[param] = false }
        }
        setTimeout(clear(this, minted), 1500)
      }
    })
  },
  computed: {
    ...mapState([
      'mintedTokens',
      'provenanceHash',
      'userAddress',
      'price',
      'specialPrice',
      'foodPrice',
      'levelDuration',
      'leeway',
      'fa2',
      'loading',
      'paused'
    ]),
    name () {
      return config.projectName
    },
    isTestnet () {
      return config.network !== 'mainnet'
    },
    contractLink () {
      return `https://better-call.dev/${config.network}/${this.fa2}`
    },
    currentPrice () {
      return this.publicSaleStarted ? this.price : this.presalePrice
    },
    hasPets () {
      return this.userAddress && this.userPets.length > 0
    }
  },
  methods: {
    async buyToken (petType) {
      try {
        const id = this.deadPetId
        this.deadPetId = false
        this.minting = this.maxId
        const amount = petType < 6 ? this.price : this.specialPrice
        const result = await this.$store.dispatch('buyToken', { petType, amount, id })
        if (!result) {
          this.minting = false
        }
      } catch (e) {
        const data = e.data?.find(it => !!it.with)
        console.log(data)
        this.$toast.error(data?.with?.string || e.message)
        this.minting = false
      }
    },
    async poll () {
      console.log('userPets', this.userPets)
      const pets = await this.$store.dispatch('listPets', { address: this.userAddress })
        .catch(e => console.log(e.message))
        .finally(() => this.$forceUpdate())
      if (pets) {
        this.$set(this, 'userPets', pets)
        this.maxId = pets.reduce((prev, { id }) => id > prev ? id : prev, 0)
      }
      setTimeout(this.poll, config.pollInterval)
    },
    onShowModal (petId) {
      this.deadPetId = petId
    },
    onHideModal () {
      this.deadPetId = false
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

