<template>
  <div class="h-screen flex flex-col">
    <div v-if="thread" class="flex-1 flex flex-col">
      <div class="top-bar h-16 flex">
        <div class="btnBack w-8 select-none flex items-center justify-center"
          @click="close">
          <i class="text-xl fa fa-times"></i>
        </div>
        <div class="w-8 select-none flex flex-col">
          <div class="btnMsgToggle tippy-r select-none flex-1 flex items-center justify-center"
            :class="{ on: showMessages }" title="Toggle Channel Messages" @click="toggleMsgs">
            <i class="text-lg fa fa-check"></i>
          </div>
          <div :title="'Copy Thread ID'" :data-clipboard-text="thread.id"
            class="btnOther copyBtn tippy-r flex-1 flex items-center justify-center">
            <i class="fa fa-clone"></i>
          </div>
        </div>
        <div class="flex-1 flex items-center px-4">
          <p class="text-4xl mr-3">
            <User class="tippy-b-lg" :title="`Account Age: ${accountAge || '[ Not Found ]'}`"
              :user="thread.user_name"/>
          </p>
          <div v-if="note" class="note h-12 flex items-center pl-3">
            <p class="text-sm" ref="note">{{ note }}</p>
          </div>
        </div>
        <div v-if="settings.devMode" class="flex flex-col w-8">
          <div class="btnOther copyBtn tippy-l flex-1 w-8 select-none flex items-center justify-center"
            :title="'Copy User ID'" :data-clipboard-text="thread.user_id">
            <i class="text-lg fa fa-user"></i>
          </div>
          <div class="btnOther copyBtn tippy-l flex-1 w-8 select-none flex items-center justify-center"
            :title="'Copy Channel ID'" :data-clipboard-text="thread.dm_channel_id">
            <i class="fa fa-hashtag"></i>
          </div>
        </div>
      </div>
      <div v-if="initialMessages && logs.length" class="flex-1 scroller px-8 flex relative" ref="logs" @scroll="updateScroll">
        <div class="flex-1">
          <Log v-for="log in logs" v-if="showMessages === (log.type === 2)" :key="log.id"
            :log="log" :settings="settings"/>
        </div>
      </div>
      <Loader class="flex-1" v-else-if="!initialMessages"/>
      <NoLogs v-else/>
      <div v-if="!atBottom" :class="{ long: collapsed }" @click="scrollToBottom"
        class="scroll-bottom global-trans-ignore h-6 flex items-center rounded-t select-none">
        <p class="desc text-sm flex-1 px-2">You&apos;re viewing older messages</p>
        <p class="action text-xs font-semibold px-2">Jump to Bottom</p>
      </div>
      <div v-if="unread > 0" :class="{ long: collapsed }"
        class="new-messages global-trans-ignore h-6 flex items-center rounded-b select-none">
        <p class="desc flex-1 px-2" @click="scrollToBottom">{{ unread }} new message{{ unread > 1 ? 's' : ''}}</p>
        <p class="action text-sm font-semibold px-2" @click="unread = 0">Mark as Read</p>
      </div>
    </div>
    <Loader v-else class="h-screen"/>
  </div>
</template>

<script>
import Log from './Log.vue'
import User from './User.vue'
import Loader from './Loader.vue'
import NoLogs from './NoLogs.vue'

export default {
  components: {
    Log, User, Loader, NoLogs
  },
  props: {
    _thread: Object,
    settings: { type: Object, required: true }
  },
  data () {
    return {
      logs: [],
      thread: this._thread,
      note: null,
      accountAge: null,
      initialMessages: false,
      atBottom: true,
      unread: 0,
      showMessages: false
    }
  },
  watch: {
    atBottom () {
      if (this.atBottom)
        this.unread = 0
    }
  },
  computed: {
    link () {
      return `${location.protocol}//${location.host}/#thread:${this.thread.id}`
    },
    collapsed () {
      return this.$parent.$refs.sidebar.collapsed
    }
  },
  methods: {
    close () {
      es.removeEventListener('newMessage', this.newMessage)
      this.$emit('close')
    },
    addMessage (message) {
      switch (message.message_type) {
        case 1:
          let ageMatch = message.body.match(/account age \*\*(.+?)\*\*/i)
          let noteMatch = message.body.match(/\*\*note:\*\* (.+) \- /i)
          if (ageMatch)
            this.accountAge = ageMatch[1]
          if (noteMatch) {
            this.note = noteMatch[1]
            setTimeout(() => {
              twemoji.parse(this.$refs.note)
            }, 0)
          }
          break
        case 2: case 3: case 4:
          if (this.logs.length && (
            this.logs.slice(-1)[0].user_id === message.user_id
            && (this.logs.slice(-1)[0].type === message.message_type)
            && moment.utc(message.created_at).local().format('YYMMDDHH')
              === moment.utc(this.logs.slice(-1)[0].created_at).local().format('YYMMDDHH')
          )) {
            this.logs.slice(-1)[0].messages.push({
              id: message.id,
              dm_id: message.dm_message_id || null,
              body: this.parseMessage(message.body)
            })
          } else {
            this.logs.push({
              id: message.id,
              user_id: message.user_id,
              user_name: message.user_name,
              created_at: message.created_at,
              type: message.message_type,
              messages: [ {
                id: message.id,
                dm_id: message.dm_message_id || null,
                body: this.parseMessage(message.body)
              } ]
            })
          }
          break
      }
      if (this.atBottom && this.initialMessages)
        setTimeout(this.scrollToBottom, 0)
      else if (this.initialMessages)
        this.unread++
    },
    scrollToBottom () {
      if (this.$refs.logs)
        this.$refs.logs.scrollTop = this.$refs.logs.scrollHeight
    },
    toggleAutoscroll () {
      this.autoscroll = !this.autoscroll
    },
    parseMessage (message) {
      if (typeof message != 'string')
        return `${message}`
      message = processMarkdown(message.replace(/\n/g, '\n\n'))
      message = twemoji.parse(message)
      return message.replace(/(<br\/>)+$/, '')
    },
    updateScroll (ev) {
      let el = ev.target
      this.atBottom = el.scrollTop >= (el.scrollHeight - el.offsetHeight - 75)
    },
    toggleMsgs () {
      this.showMessages = !this.showMessages
    },
    getLogs () {
      superagent.get(`${baseURL}/logs/${this.thread.id}`).end((err, res) => {
        if (err) {
          console.log(err)
        } else {
          for (let message of res.body)
            this.addMessage(message)
          this.initialMessages = true
          setTimeout(this.scrollToBottom, 0)
        }
      })
    },
    newMessage (ev) {
      let data = JSON.parse(ev.data)
      let { message } = data
      if (message.thread_id === this.thread.id)
        this.addMessage(message)
    }
  },
  created () {
    es.addEventListener('newMessage', this.newMessage)
    if (this.thread)
      this.getLogs()
    else
      superagent.get(`${baseURL}/threads/${this.$route.params.id}`).end((err, res) => {
        if (err) {
          if (res.status === 404)
            this.$router.push('/')
          else
            console.log(err)
        } else {
          this.thread = res.body
          this.getLogs()
        }
      })
  }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.top-bar {
  @include themify {
    background: themed('bg-dark-1');
  }
}
.btnMsgToggle {
  @include themify {
    &.on i {
      color: themed('primary');
    }
    background: themed('bg-dark-3');
    color: themed('text');
  }
  cursor: pointer;
}
.btnBack {
  background: $red;
  color: #fff;
  cursor: pointer;
}
.btnOther {
  @include themify {
    background: themed('bg-dark-3');
    color: themed('text');
  }
  cursor: pointer;
}
.note {
  @include themify {
    border-left: 2px solid mix(
      if($theme == 'light', black, white),
      themed('bg-dark-1'),
      5%
    );
    color: themed('text-muted');
  }
}
.scroll-bottom {
  @include themify {
    background: rgba(lighten(themed('bg-dark-1'), 40%), .9);
  }
  cursor: pointer;
  position: absolute;
  bottom: 0;
}
.new-messages {
  @include themify {
    background: rgba(themed('primary'), .9);
  }
  color: #fff;
  position: absolute;
  top: 4rem;
}
.scroll-bottom, .new-messages {
  & .desc {
    cursor: pointer;
    color: #fff;
  }
  & .action {
    color: rgba(#fff, .5);
    cursor: pointer;
    text-transform: uppercase;
  }
  &.long { width: calc(100vw - 4rem - (2rem + 10px)); }
  right: calc(2rem + 10px);
  transition: width .3s ease-in-out;
  width: calc(100vw - 18rem - (2rem + 10px));
}
</style>
