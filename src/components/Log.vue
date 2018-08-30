<template>
  <div class="log mb-3 pt-4" @mouseover="animated = true" @mouseout="animated = false">
    <div class="flex">
      <div class="w-16">
        <img class="avatar select-none" :src="getAvatarURL(log)">
      </div>
      <div class="flex-1">
        <p class="mb-3">
          <User class="font-semibold mr-2" :user="log.user_name" :reply="log.type === 4"/>
          <span class="timestamp">{{formattedTime}}</span>
        </p>
          <div v-for="msg in log.messages" class="mt-2"
            :key="msg.id">
            <div class="flex">
              <div class="message flex-1" v-html="msg.body"></div>
              <div v-if="settings.devMode && msg.dm_id" class="pl-3">
                <code class="id">{{ msg.dm_id }}</code>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import User from './User.vue'

export default {
  components: {
    User
  },
  props: {
    log: { type: Object, required: true },
    settings: { type: Object, required: true },
  },
  data () {
    return {
      formattedTime: null,
      animated: false
    }
  },
  methods: {
    getAvatarURL (log) {
      let id = this.settings.daveAvi && !(log.type === 4)
        ? botID
        : log.user_id
      let url = `${baseURL}/avatars/${id}`
      if (this.animated)
        url += '?format=gif'
      return url
    },
    updateFormattedTime () {
      if (this.settings.timeRelative)
        this.formattedTime = moment.utc(this.log.created_at).fromNow()
      else
        this.formattedTime = moment.utc(this.log.created_at).local().format(this.settings.timeFormat)
      setTimeout(this.updateFormattedTime, 10000)
    },
  },
  created () {
    this.updateFormattedTime()
  }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.avatar {
  border-radius: 50%;
  height: 2.5rem;
  width: 2.5rem;
  margin-top: .25rem;
}
.timestamp {
  @include themify {
    // background: themed('bg-dark-2');
    color: mix(themed('bg'), themed('text'), 20%)
  }
  // border-radius: .25rem;
  // padding: .125rem .5rem;
}
.log {
  & + & {
    @include themify {
      border-top: 1px solid if(
        $theme == 'light',
        darken(themed('bg-dark-1'), 10%),
        lighten(themed('bg-dark-1'), 10%)
      );
    }
  }
  &:last-child {
    margin-bottom: 1.5rem;
  }
  & .id {
    @include themify {
      color: themed('text-muted');
    }
  }
}
</style>
