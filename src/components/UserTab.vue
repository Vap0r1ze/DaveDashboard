<template>
  <div class="user font-medium select-none my-2" :class="{ selected }" @click="select">
    <User :user="user.name" :selected="selected"/>
  </div>
</template>

<script>
import User from './User.vue'

export default {
  components: {
    User
  },
  props: {
    user: { type: Object, required: true },
    selected: { type: Boolean, required: true }
  },
  methods: {
    select () {
      this.$emit('selectUser', this.selected
        ? null
        : this.user.id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.user {
  cursor: pointer;
  border-radius: $spacing * .25rem;
  padding: $spacing * .5rem $spacing * .725rem;
  transition: padding 0.3s ease, border-radius 0.3s ease;
}
.user:hover:not(.selected) {
  @include themify {
    background: mix(
      if($theme == 'light', black, white),
      themed('bg-dark-1'), 10%);
  }
}
.user.selected {
  @include themify {
    background: themed('primary');
  }
  color: #fff;
}
.username {
  font-weight: 600;
}
</style>

