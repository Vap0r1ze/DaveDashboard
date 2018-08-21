<template>
  <div id="app-root" :class="themeName">
    <div class="app">
      <Loader class="h-screen" v-if="!connected"/>
      <NoThreads v-else-if="!this.threads.length"/>
      <div v-else class="flex">
        <Sidebar :users="users" :selected="user" :area="area"
          :settingsCategory="settingsCategory" @selectUser="selectUser"
          @open="open" @selectCategory="selectCategory" ref="sidebar"/>
        <div class="flex-1 h-screen">
          <Settings v-if="area === 'settings'" :settings="settings"
            @changeSetting="changeSetting" :category="settingsCategory"/>
          <Thread v-else-if="thread" :thread="this.threads.find(thread => thread.id === this.thread)"
            :settings="settings" @close="openThread(null)" ref="thread"/>
          <ThreadTable v-else-if="area === 'threads'" :threads="threads" :user="user"
            :settings="settings" @openThread="openThread" ref="threads"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoThreadsPage from './components/NoThreadsPage.vue'
import Sidebar from './components/Sidebar.vue'
import Settings from './components/Settings.vue'
import ThreadTable from './components/ThreadTable.vue'
import Thread from './components/Thread.vue'
import Loader from './components/Loader.vue'

export default {
  components: {
    NoThreadsPage, Sidebar, Settings, ThreadTable, Thread, Loader
  },
  data () {
    return {
      threads: [],
      user: null,
      thread: null,
      connected: false,
      theme: JSON.parse(localStorage.theme || '0') || 'dark',
      pageSize: JSON.parse(localStorage.pageSize || '15'),
      timeFormat: JSON.parse(localStorage.timeFormat || '"YYYY-MM-DD HH:mm:ss"'),
      timeRelative: JSON.parse(localStorage.timeRelative || 'false'),
      daveAvi: JSON.parse(localStorage.daveAvi || 'false'),
      devMode: JSON.parse(localStorage.devMode || 'false'),
      area: localStorage.area || 'threads',
      settingsCategory: localStorage.settingsCategory || 'themes',
      guildRoles: [],
      guildUsers: [
        { id: '1', name: 'Clyde', discriminator: '0000' }
      ]
    }
  },
  watch: {
    user () {
      if (this.thread)
        this.thread = null
    }
  },
  computed: {
    users () {
      let allUsers = this.threads.map(thread => ({ id: thread.user_id, name: thread.user_name }))
      let uniqUsers = allUsers.filter((u, i) => allUsers.findIndex(_ => _.id === u.id) === i)
      return uniqUsers.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase())
          return -1
        if (a.name.toLowerCase() > b.name.toLowerCase())
          return 1
        return 0
      })
    },
    themeName () {
      return {
        [`theme-${this.theme}`]: true
      }
    },
    settings () {
      return {
        theme: this.theme,
        pageSize: this.pageSize,
        timeFormat: this.timeFormat,
        timeRelative: this.timeRelative,
        daveAvi: this.daveAvi,
        devMode: this.devMode
      }
    }
  },
  methods: {
    selectUser (id) {
      this.user = id
    },
    connect () {
      superagent.get(`${baseURL}/threads`).end((err, res) => {
        if (err) {
          setTimeout(this.connect, 8000)
        } else {
          this.threads.push(...res.body)
          this.connected = true
        }
      })
    },
    changeSetting (setting, value) {
      localStorage[setting] = JSON.stringify(value)
      this[setting] = value
    },
    open (area) {
      localStorage.area = area
      this.area = area
    },
    selectCategory (category) {
      localStorage.settingsCategory = category
      this.settingsCategory = category
    },
    openThread (id) {
      this.thread = id
    },
    removeHash () {
      if (window.location.hash)
        history.pushState("", document.title, location.pathname + location.search)
    }
  },
  created () {
    // Initial threads
    this.connect()

    // Events
    es.addEventListener('threadOpen', ev => {
      let data = JSON.parse(ev.data)
			let { thread } = data
      this.threads.push(thread)
      if (this.$refs.threads)
        this.$refs.threads.sortThreads()
    })
    es.addEventListener('threadClose', ev => {
      let data = JSON.parse(ev.data)
			let { thread } = data
      let oldThread = this.threads.find(t => t.id === thread.id)
      this.threads.splice(this.threads.indexOf(oldThread), 1, thread)
      if (this.$refs.threads)
        this.$refs.threads.sortThreads()
    })
    es.addEventListener('newMessage', ev => {
      let data = JSON.parse(ev.data)
      let { message } = data
      if (this.$refs.thread && message.thread_id === this.thread)
        this.$refs.thread.addMessage(message)
    })

    // Resource hyperlinks
    let value = location.hash.slice(1).split(':')[1]
    switch (location.hash.slice(1).split(':')[0]) {
      case 'user':
        this.user = value
        this.removeHash()
        break
      case 'thread':
        this.thread = value
        break
    }
    this.removeHash()
  }
}
</script>

<style lang="scss">
@import './variables.scss';

.app {
  @include themify {
    background: themed('bg');
    color: themed('text');
  }
  font-family: $sans-serif;
  overflow: hidden;
}
#app-root :not(.global-trans-ignore) {
  transition: background .2s ease-in-out, border-color .3s ease-in-out !important;
}
code {
  @include themify {
    background: themed('bg-dark-2');
  }
  border-radius: .25rem;
  font-family: $mono;
  font-weight: 600;
  letter-spacing: -.05em;
  padding: .125rem .325rem;
}
.message {
  & pre {
    @include themify {
      background: darken(themed('bg-dark-1'), 1%);
      border: 2px solid darken(themed('bg-dark-1'), 3%);
      color: themed('text-muted');
    }
    border-radius: .25rem;
    font-family: $mono;
    font-weight: 600;
    letter-spacing: -.05em;
    min-height: 2rem;
    padding: .325rem;
    white-space: pre-wrap;
  }
  & .tag {
    @include themify {
      background: rgba(themed('primary'), .1);
      color: themed('primary');
    }
  }
  & .paragraph {
    margin-top: .125rem;
  }
}
.scroller, .scroller-small {
  overflow-y: scroll;
}
.scroller::-webkit-scrollbar { width: 10px; height: 10px; }
.scroller::-webkit-scrollbar-thumb {
  @include themify {
    background: darken(themed('bg-dark-3'), 5%);
  }
  border-radius: 5px;
}
.scroller::-webkit-scrollbar-track {
  @include themify {
    background: themed('bg-dark-2');
  }
}
.scroller::-webkit-scrollbar-corner {
  @include themify {
    background: themed('bg-dark-2');
  }
}
.scroller-small::-webkit-scrollbar { width: 10px; height: 10px; }
.scroller-small::-webkit-scrollbar-thumb {
  @include themify {
    background: darken(themed('bg-dark-3'), 5%);
    border: 3px solid themed('bg-dark-1');
  }
  border-radius: 5px;
}
.scroller-small::-webkit-scrollbar-track { background: transparent; }
.scroller-small::-webkit-scrollbar-corner { background: transparent; }
.scroller-small:not(:hover)::-webkit-scrollbar-thumb { background: transparent; }
.w-20 { width: 5rem; }
.h-20 { height: 5rem; }
.user.selected .emoji {
  filter: saturate(0) brightness(10);
}
.emoji {
  .username & {
    .text-4xl & { height: 2rem; }
    height: .875rem;
    padding-left: 2px;
  }
  height: 1.75rem;
}
.section-title {
  font-size: 2rem;
  margin: 1rem 0;
}
a {
  @include themify {
    color: themed('primary');
  }
  &:not(:hover) { text-decoration: none; }
  outline: none;
}
.tippy-popper .tippy-backdrop {
  @include themify-root {
    background: if(
      $theme == 'light',
      darken(themed('bg-dark-1'), 60%),
      lighten(themed('bg-dark-1'), 10%)
    );
  }
}
</style>