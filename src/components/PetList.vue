<template>
  <div class="row d-flex justify-content-center">
      <div v-for="item in grouped" :key="item.id + item.nextFeed" class="col-md-4 col-sm-6 col-12 m-4" style="width: 215px; height: 230px;">
        <pet-card :item="item" @special="onPetSpecial" />
      </div>
  </div>
</template>

<script>
import PetCard from './PetCard.vue'
export default {
  components: { PetCard },
  name: "Pet-List",
  props: {
    items: Array
  },
  computed: {
    grouped () {
      const frozen = {}
      const ids = []
      this.items.forEach(it => {
        it.num = 1
        if (it.level === 0 && it.deadline.getTime() < Date.now()) {
          ids.push(it.id)
          if (!frozen[it.kind]) {
            it.num = 0
            frozen[it.kind] = it
          }
          frozen[it.kind].num = frozen[it.kind].num + 1
        }
      })
      return [ ...this.items.filter(it => !ids.includes(it.id)), ...Object.values(frozen) ]
    }
  },
  methods: {
    onPetSpecial (petId) {
      this.$emit('special', petId)
    }
  }
}
</script>
