<template>
  <div class="searchbar h-16 p-3">
    <div class="search px-3 rounded h-full flex items-center justify-center">
      <input class="w-full text-xl" type="text" spellcheck="false"
      placeholder="Search" v-model="search" @input="update">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      search: ''
    }
  },
  methods: {
    update () {
      this.$emit('update', this.search)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.searchbar {
  @include themify {
    background: themed('bg-dark-2');
  }
  overflow-x: hidden;
  transition: width .3 ease-in-out, padding .3 ease-in-out;
}
.search {
  @include themify {
    &:focus-within {
      border-color: lighten(themed('primary'), 10%);
    }
    &:hover:not(:focus-within) { border-color: darken(themed('bg-dark-3'), 30%); }
    background: themed('bg-dark-3');
    border: 1px solid themed('bg-dark-3');
  }
  // transition: .2s border-color ease-in-out;
}
input {
  @include themify {
    color: themed('text');
  }
  border: none;
  outline: none;
  background: transparent;
}
</style>
