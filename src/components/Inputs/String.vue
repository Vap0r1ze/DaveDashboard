<template>
  <div class="inline-block">
    <input class="rounded" :class="{ invalid }" type="text" v-model="value" @input="change" spellcheck="false">
  </div>
</template>

<script>
export default {
  props: {
    setting: { type: String, required: true },
    pattern: RegExp,
    initial: String
  },
  data () {
    return {
      value: this.initial || '',
      invalid: false
    }
  },
  methods: {
    isValid (s) {
      return this.pattern
        ? Boolean(s.match(this.pattern))
        : true
    },
    change () {
      this.invalid = !this.isValid(this.value)
      if (!this.invalid) {
        this.$emit('change', this.setting, this.value)
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
  width: 14em;
  outline: none;
}
</style>
