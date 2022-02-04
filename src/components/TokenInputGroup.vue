<template>
  <div class="flex flex-col gap-4">
      <div v-for="(item, n) in items" :key="n + 'x'" class="hover:bg-gray-200 rounded-xl p-4 transition duration-500 relative">
          <button v-if="items.length > 1" @click="onDelete(n)" class="btn btn-square btn-ghost btn-xs absolute top-2 right-2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current">   
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>                       
            </svg>
          </button>
          <div class="form-control">
            <label class="label">
              <span class="label-text block">Contract address</span>
            </label>
            <input type="text" v-model="item.kt" @focus="onFocus(n)" @blur="onBlur" :class="{ 'bg-red-100 text-red-800 placeholder-red-300': errors[n].kt }" class="input" placeholder="KT..." >
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text block">Token id</span>
            </label>
            <input type="text" v-model="item.id" @focus="onFocus(n)" @blur="onBlur" :class="{ 'bg-red-100 text-red-800 placeholder-red-300': errors[n].id }" class="input" >
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text block">Amount</span>
            </label>
            <input type="number" v-model="item.amount" @focus="onFocus(n)" @blur="onBlur" :class="{ 'bg-red-100 text-red-800 placeholder-red-300': errors[n].amount }" class="input">
          </div>
      </div>
      <button @click="onAdd" class="ml-4 btn btn-square btn-xs">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
  </div>
</template>
<script>
import { validateContractAddress } from '@taquito/utils'
const EMPTY_ITEM = { kt: '', id: '', amount: 1 }
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
          amount: focus !== n && !(Number(amount) > 0),
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
      this.validate()
    },
    emit () {
      this.$emit('input', this.items.filter(item => item.kt))
    },
    validate () {
      this.focus = -1
      console.log(this.items)
      if (this.errors.every(({ id, kt, amount }) => !id && !kt && !amount)) {
        this.emit()
        return true
      }
      return false
    }
  }
}
</script>

<style>

</style>