<template>
  <div>
    <Category v-for="d in categories" :key="d[1]" :category="d"
      :selected="category === d[1]" @select="select"/>
  </div>
</template>

<script>
import Category from './Category.vue'

export default {
  components: {
    Category
  },
  props: {
    category: { type: String, required: true }
  },
  data () {
    return {
      categories: [
        ['Themes', 'themes'],
        ['General', 'general'],
      ]
    }
  },
  methods: {
    select (category) {
      this.$emit('select', category)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
