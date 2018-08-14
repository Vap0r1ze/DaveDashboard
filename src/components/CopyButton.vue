<template>
  <button class="copyBtn w-16" :data-clipboard-text="text" :class="{ done }"
    @click="finish">
    <span v-if="done">Copied</span>
    <span v-else>Copy</span>
  </button>
</template>

<script>
export default {
  props: {
    text: String
  },
  data () {
    return {
      done: false
    }
  },
  methods: {
    revert () {
      this.done = false
    },
    finish () {
      this.done = true
      setTimeout(this.revert, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

button {
  @include themify {
    &.done, &:hover { background: themed('primary-dark-1'); }
    background: themed('primary');
  }
  &.done { cursor: default; }
  border-radius: $spacing * .25rem;
  color: #fff;
  font-family: $sans-serif;
  outline: none;
  padding: $spacing * .25rem 0;
}
</style>

