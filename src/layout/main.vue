<template>
  <div class="container max-w-5xl px-4 mx-auto">
    <div class="flex flex-col min-h-screen">
      <div class="flex justify-between items-center py-4">
        <div class="text-2xl font-bold tracking-tighter">House of Tez</div>
        <sync-button class="btn btn-outline"/>
      </div>
      <div v-show="welcome" class="alert alert-info">
        <div class="flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2" style="min-width: 24px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <label>Welcome to Tez-otc.xyz. This tool was made for OTC trading. This is an experimental tool. Built by TezHouse and B. Grit! Use with caution! Check all trading contract address to verify authenticity.</label>
          <button @click="welcome = false" class="btn btn-ghost btn-circle btn-xs -mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="py-8">
        <slot />
      </div>
    </div>
    <footer class="p-4 footer bg-base-300 text-base-content footer-center rounded-xl mb-4">
      <div>
        <p>🛠 Built by <a href="http://twitter.com/resilence11" target="_blank" rel="noopener nofollow">Boris Grit ❤</a></p>
      </div>
    </footer>
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
      name: config.projectName,
      welcome: true
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