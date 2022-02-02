<template>
  <div class="container max-w-5xl px-4 mx-auto">
    <div class="flex flex-col justify-between min-h-screen text-yellow-500">
      <div class="flex justify-between items-center py-4">
        <div class="text-2xl">House Of Tez</div>
        <sync-button class="border-4 border-yellow-500 rounded-3xl px-4 py-2"/>
      </div>
      <div class="border-4 border-yellow-500 rounded-2xl px-4 py-2 mt-6 place-self-start">
        <p>Welcome to houseoftez.xyz where you can safely trade. Enjoy trust and comfort using this tool as a middle man to trade NFT's or Coin OTC without the worry of being rugged!</p>
      </div>
      <div class="py-8">
        <slot />
      </div>
      <div class="border-4 border-yellow-500 rounded-2xl px-4 py-2 my-8">
        <p>***Double check all contract address along with I.D *** <br>
          ***Don't Trust Anyone***
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import config from "../config.js"
import SyncButton from "../components/SyncButton.vue"
import { mapState } from "vuex"

export default {
  data () {
    return {
      menu: false,
      name: config.projectName
    }
  },
  computed: {
    ...mapState(['pool'])
  },
  components: { SyncButton }
}
</script>

<style>
 .topdiv {
   display: flex;
   width: 100%;
   justify-content: space-between;
   align-items: center;
   color: #fff;
 }
</style>