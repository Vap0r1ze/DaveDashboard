<template>
  <div class="settings scroller h-full px-16 pt-4">
    <SettingsThemes v-if="$route.params.category === 'themes'" :current="settings.theme"
      @changeSetting="changeSetting"/>
    <SettingsValues v-for="d in categories" v-if="d[1] === $route.params.category" :key="d[1]"
      :settings="settings" :category="d" @changeSetting="changeSetting"/>
  </div>
</template>

<script>
import SettingsThemes from './SettingsThemes.vue'
import SettingsValues from './SettingsValues.vue'

export default {
  components: {
    SettingsThemes, SettingsValues
  },
  props: {
    settings: { type: Object, required: true },
    category: { type: String, required: true }
  },
  data () {
    return {
      categories: [
        [ 'General', 'general', [
          [ 'Page Size', 'pageSize', 'Amount of threads to show per page', {
            type: Number,
            min: 5,
            max: 100
          } ],
          [ 'Timestamp Format', 'timeFormat', '<a href="https://momentjs.com/docs/#/parsing/string-format/" target="_blank">Moment Format</a> to use with timestamps', {
            type: String
          } ],
          [ 'Relative Time', 'timeRelative', 'Make timestamps relative to now', {
            type: Boolean
          } ],
          [ 'Dave Avatar', 'daveAvi', 'Show Dave\'s avatar for non-staff messages', {
            type: Boolean
          } ],
          [ 'Developer Mode', 'devMode', 'Show message IDs', {
            type: Boolean
          } ]
        ] ]
      ]
    }
  },
  methods: {
    changeSetting (setting, value) {
      this.$emit('changeSetting', setting, value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';
</style>
