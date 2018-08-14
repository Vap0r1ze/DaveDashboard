<template>
  <div class="select-none" :class="{ selected }" @click="select">
    <p>{{ category[0] }}</p>
  </div>
</template>

<script>
export default {
  props: {
    category: { type: Array, required: true },
    selected: Boolean
  },
  methods: {
    select () {
      this.$emit('select', this.category[1])
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

div {
  @include themify {
    &.selected {
      background: mix(
      if($theme == 'light', black, white),
      themed('bg-dark-1'), 30%);
      @if $theme == 'light' {
        color: #eaeaea;
      }
    }
    &:hover:not(.selected) {
      background: mix(
      if($theme == 'light', black, white),
      themed('bg-dark-1'), 10%);
    }
  }
  cursor: pointer;
  padding: .5rem 1rem;
}
</style>
