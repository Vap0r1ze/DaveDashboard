<template>
  <div class="log mb-3 pt-4" @mouseover="animated = true" @mouseout="animated = false">
    <div class="flex">
      <div class="w-16">
        <img class="avatar select-none" :src="getAvatarURL(log)">
      </div>
      <div class="flex-1">
        <p class="mb-3">
          <user class="font-semibold mr-2" :user="log.user_name" :reply="log.type === 4"/>
          <span class="timestamp">{{formattedTime}}</span>
        </p>
          <div v-for="msg in log.messages" class="mt-2" :key="msg.id">
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
import { formatDistanceToNow } from 'date-fns'
import { format, utcToZonedTime } from 'date-fns-tz'
import User from '@/components/User.vue'

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

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
      let url = `/avatars/${id}`
      if (this.animated)
        url += '?format=gif'
      return url
    },
    updateRelativeTime () {
      const localDate = utcToZonedTime(new Date(this.log.created_at + 'Z'), timeZone)
      this.formattedTime = formatDistanceToNow(localDate, new Date()) + ' ago'
      setTimeout(this.updateRelativeTime, 10000)
    }
  },
  created () {
    if (this.settings.timeRelative) {
      this.updateRelativeTime()
    } else {
      const localDate = utcToZonedTime(new Date(this.log.created_at + 'Z'), timeZone)
      this.formattedTime = format(localDate, this.settings.timeFormat)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/variables.scss';

.avatar {
  border-radius: 50%;
  height: 2.5rem;
  width: 2.5rem;
  margin-top: .25rem;
}
.timestamp {
  @include themify {
    color: mix(themed('bg'), themed('text'), 20%)
  }
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
