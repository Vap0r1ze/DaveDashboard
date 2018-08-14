<template>
  <div class="section">
    <p class="section-title">{{ category[0] }}</p>
    <div class="settings">
      <div v-for="setting in category[2]" :key="setting[1]" class="setting m-5">
        <p class="setting-title text-lg">{{ setting[0] }}</p>
        <p class="setting-desc mt-1" v-html="setting[2]"></p>
        <div class="mt-4">
          <NumberInput v-if="setting[3].type === Number" :initial="settings[setting[1]]" :setting="setting[1]"
            :min="setting[3].min" :max="setting[3].max" @change="changeSetting"/>
          <StringInput v-if="setting[3].type === String" :initial="settings[setting[1]]" :setting="setting[1]"
            :min="setting[3].min" :max="setting[3].max" @change="changeSetting"/>
          <BooleanInput v-if="setting[3].type === Boolean" :initial="settings[setting[1]]" :setting="setting[1]"
            @change="changeSetting"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NumberInput from './Inputs/Number.vue'
import StringInput from './Inputs/String.vue'
import BooleanInput from './Inputs/Boolean.vue'

export default {
  components: {
    NumberInput, StringInput, BooleanInput
  },
  props: {
    category: { type: Array, required: true },
    settings: { type: Object, required: true }
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

.setting-desc {
  @include themify {
    color: themed('text-muted');
  }
}
</style>
