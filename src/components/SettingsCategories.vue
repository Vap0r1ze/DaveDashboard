<template>
  <div>
    <router-link v-for="d in categories" :key="d[1]" :to="`/settings/${d[1]}`"
      class="category">
      <Category :category="d"
        :selected="category === d[1]" @select="select"/>
    </router-link>
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
.category {
  color: inherit;
  text-decoration: none;
}
</style>
