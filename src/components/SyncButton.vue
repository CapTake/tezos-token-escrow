<template>
    <div v-if="userAddress" class="btn-group">
        <button style="text-transform: none;" @click="unsync">{{ shortWallet }} &nbsp;&times;</button> 
    </div> 
    <button v-else type="button" @click="sync">Connect</button>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState(['userAddress']),
    ...mapGetters(['shortWallet'])
  },
  methods: {
    async sync () {
      await this.$store.dispatch('connectWallet')
    },
    async unsync () {
      await this.$store.dispatch('disconnectWallet')
    }
  }
}
</script>
