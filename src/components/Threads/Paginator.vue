<template>
  <div class="paginator select-none flex justify-center my-4">
    <div class="btnPage" :class="{ hidden: page < 2 }" @click="prev">
      <i class="fa fa-chevron-left text-sm"></i>
    </div>
    <div v-for="i in displayedPages" :key="i" class="btnPage global-trans-ignore" :class="{ current: page === i }"
    @click="select(i)">
      <span>{{i}}</span>
    </div>
    <div class="btnPage" :class="{ hidden: page >= pageCount }" @click="next">
      <i class="fa fa-chevron-right text-sm"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageCount: { type: Number, required: true },
    page: { type: Number, required: true }
  },
  computed: {
    displayedPages () {
      let page = this.page
      let count = this.pageCount
      var r = [
        page == 2 ? 1 : (
          page == count - 1
          ? page - 3
          : page - 2
        ),
        page == 2 ? (count < 5 ? count : 5) : (
          page == count - 1
          ? count
          : page + 2
        )
      ]
      if (page == 1)
        r = [1, Math.min(count, 5)]
      if (page == count)
        r = [count - 4, count]
      if (count <= 5)
        r = [1, count]
      let p = []
      for (var i = r[0]; i <= r[1]; i++) {
          p.push(i)
      }
      return p
    }
  },
  methods: {
    select (page) {
      this.$emit('select', page)
    },
    next () {
      if (this.page < this.pageCount)
        this.select(this.page + 1)
    },
    prev () {
      if (this.page > 1)
      this.select(this.page - 1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/variables.scss';

.btnPage {
  @include themify {
    &.current {
      background: themed('primary');
    }
    background: themed('bg-dark-2');
  }
  &.current {
    color: #fff;
  }
  &.hidden {
    cursor: default;
    opacity: 0;
  }
  align-items: center;
  border-radius: .25rem;
  cursor: pointer;
  display: flex;
  height: 2.5rem;
  justify-content: center;
  margin: 0 .5rem;
  width: 2rem;
}
</style>
