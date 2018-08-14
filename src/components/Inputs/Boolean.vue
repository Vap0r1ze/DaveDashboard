<template>
  <div class="toggle global-trans-ignore rounded-full inline-block w-16 h-8"
    :class="{ on: value }" @click="change">
    <div class="toggleSwitch global-trans-ignore h-8 w-8 rounded-full"
      :class="{ 'ml-8': value }"></div>
  </div>
</template>

<script>
export default {
  props: {
    setting: { type: String, required: true },
    initial: Boolean
  },
  data () {
    return {
      value: this.initial || false,
      invalid: false
    }
  },
  methods: {
    change () {
      this.value = !this.value
      this.$emit('change', this.setting, this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../variables.scss';

.toggle {
  @include themify {
    &.on { background: themed('primary'); }
    background: themed('bg-dark-2');
  }
  cursor: pointer;
  transition: .3s background ease-in-out;
}
.toggleSwitch {
  .on & {
    @include themify {
      border-color: themed('primary');
    }
  }
  @include themify {
    border: 4px solid themed('bg-dark-2');
  }
  background: #fff;
  transition: .3s margin-left ease-in-out, .3s border-color ease-in-out;
}
</style>
