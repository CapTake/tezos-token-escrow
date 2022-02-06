<template>
  <div>
    <div v-for="(c, i) in contracts" :key="i">
      <span class="kbd kbd-sm mr-1">{{ c.name }}</span>
      <span v-for="(t, j) in c.tokens" :key="t.token_id">
        <a :href="`https://objkt.com/asset/${c.name}/${t.token_id}`" title="Check on Objkt.com" target="_blank" rel="noopener nofollow">
          <span class="kbd kbd-sm"> #{{t.token_id}}{{ t.amount > 1 ? ` (${t.amount})`: '' }}</span>
        </a>
        {{ (c.tokens.length - j) > 1 ? ',' : '' }}
      </span>{{ (contracts.length - i) > 1 ? ';' : '.' }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bundle: Object
  },
  computed: {
    contracts () {
      return Object.entries(this.bundle).filter(([, tokens]) => Array.isArray(tokens)).map(([name, tokens]) => ({ name, tokens }))
    }
  }
}
</script>

<style>

</style>