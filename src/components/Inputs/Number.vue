<template>
  <div class="inline-block">
    <input class="rounded" :class="{ invalid }" type="text" v-model="value" @input="change" spellcheck="false">
  </div>
</template>

<script>
export default {
  props: {
    setting: { type: String, required: true },
    initial: Number,
    max: Number,
    min: Number
  },
  data () {
    return {
      value: `${this.initial}` || '0',
      invalid: false
    }
  },
  methods: {
    isValid (s) {
      let match = s.match(/^-?\d+$/)
      if (!match) return false
      let n = parseInt(match[0])
      if (this.max && n > this.max)
        return false
      if (this.min && n < this.min)
        return false
      return true
    },
    change () {
      this.invalid = !this.isValid(this.value)
      if (!this.invalid) {
        this.$emit('change', this.setting, parseInt(this.value))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../variables.scss';

input {
  @include themify {
    background: themed('bg-dark-2');
    color: themed('text');
  }
  &.invalid {
    outline: 2px solid $red;
  }
  padding: .5rem .75rem;
  width: 8rem;
  outline: none;
}
</style>
