<template>
  <div class="flex flex-col gap-4">
      <div v-for="(item, n) in items" :key="n + 'x'" class="flex flex-col md:flex-row flex-wrap gap-4">
          <label class="w-max">
              <div class="w-20 inline-block">Contract</div>
              <input type="text" v-model="item.kt" @focus="onFocus(n)" @blur="onBlur" :class="{ 'bg-red-200 text-red-800 placeholder-red-300': errors[n].kt }" class="inline px-2 rounded text-black" placeholder="KT..." >
          </label>
          <div class="flex flex-col md:flex-row gap-4">
            <label>
                <div class="w-20 inline-block">Token id</div>
                <input type="text" v-model="item.id"
                  
                  @focus="onFocus(n)" @blur="onBlur"
                  :class="{ 'bg-red-200 text-red-800  placeholder-red-400': errors[n].id }"
                  class="inline px-2 rounded text-black" >
            </label>
            <label>
                <div class="w-20 inline-block">Amount</div>
                <div class="inline">
                    <input type="number" v-model="item.amount" @focus="onFocus(n)" @blur="onBlur"  :class="{ 'bg-red-200 text-red-800  placeholder-red-400': errors[n].amount }" class="w-20 inline px-2 rounded text-black">
                    <button v-if="items.length > 1" @click="onDelete(n)" class="ml-2 w-10 border-2 border-yellow-500 rounded py-0">&times;</button>
                </div>
            </label>
          </div>
      </div>
      <button @click="onAdd" class="w-8 border-2 border-yellow-500 rounded">&plus;</button>
  </div>
</template>
<script>
import { validateContractAddress } from '@taquito/utils'
const EMPTY_ITEM = { kt: '', id: '', amount: '' }
export default {
  props: {
    value: {
      type: Array,
      default: () => [{ ...EMPTY_ITEM }],
      validator: v => Array.isArray(v) && v.length === 0 || v.every(item => typeof item === 'object' && item.kt && item.id && item.amount)
    }
  },
  data () {
    return {
      items: this.value.length > 0 ? this.value : [{ ...EMPTY_ITEM }],
      focus: -1
    }
  },
  computed: {
    errors () {
      const focus = this.focus
      return this.items.map(({ kt, id, amount }, n) => (
        {
          amount: focus !== n && !Number(amount) > 0,
          id: focus !== n && !((typeof id === 'string' && id !== '') || (typeof id === 'number' && id >= 0)),
          kt: focus !== n && !((typeof kt === 'string') && validateContractAddress(kt) === 3)
        }
      ))
    }
  },
  methods: {
    onDelete (n) {
      if (this.items.length <= 1) return
      this.items.splice(n, 1)
      this.emit()
    },
    onAdd () {
      if (!this.validate()) return
      this.items.push({ ...EMPTY_ITEM })
      this.emit()
    },
    onFocus (n) {
      this.focus = n
    },
    onBlur () {
      this.focus = -1
    },
    emit () {
      this.$emit('input', this.items.filter(item => item.kt))
    },
    validate () {
      this.focus = -1
      return this.errors.every(({ id, kt, amount }) => !id && !kt && !amount)
    }
  }
}
</script>

<style>

</style>