<template>
  <span class="username">
    <span>{{ name }}</span>
    <span v-if="discrim" class="discrim" :class="{ s: selected }">#{{ discrim }}</span>
    <span v-if="replyRole" class="role text-sm ml-2 rounded">{{ replyRole }}</span>
  </span>
</template>

<script>
export default {
  props: {
    user: { type: String, required: true },
    selected: Boolean,
    reply: Boolean
  },
  computed: {
    name () {
      if (this.reply)
        return this.replyName
      if (!this.user.includes('#'))
        return this.user
      return this.user.split('#').slice(0, -1).join('#')
    },
    discrim () {
      if (this.reply)
        return null
      if (!this.user.includes('#'))
        return null
      return this.user.split('#').slice(-1)[0]
    },
    replyName () {
      let match = this.user
        .match(/^(?:\(Anonymous\) )?\((.+)\) (.+)$/)
      if (!match)
        return this.user
      return match[1]
    },
    replyRole () {
      let match = this.user
        .match(/^(?:\(Anonymous\) )?\((.+)\) (.+)$/)
      if (!match)
        return null
      return match[2]
    }
  },
  mounted () {
    twemoji.parse(this.$el)
  }
}
</script>


<style lang="scss" scoped>
@import '../variables.scss';

.discrim {
  @include themify { color: themed('text-muted'); }
  &.s { color: #fff; }
  font-size: 80%;
}
.role {
  @include themify { background: themed('primary'); }
  color: #fff;
  padding: .125rem .25rem;
}
</style>
