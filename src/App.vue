<template>
  <div id="app-root" :class="themeName">
    <div class="app">
      <Loader class="h-screen" v-if="!connected"/>
      <div class="flex" v-else>
        <Sidebar :users="users" :selected="user"
          :settingsCategory="settingsCategory" @selectUser="selectUser"
          @selectCategory="selectCategory" ref="sidebar"/>
        <div class="flex-1 h-screen">
          <router-view :_thread="thread" :settings="settings" :category="settingsCategory"
            :user="user"
            @changeSetting="changeSetting" @close="openThread(null)" @openThread="openThread"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Loader from './components/Loader.vue'

export default {
  components: {
    Sidebar, Loader
  },
  data () {
    return {
      user: null,
      users: [],
      thread: null,
      connected: false,
      theme: JSON.parse(localStorage.theme || '0') || 'dark',
      pageSize: JSON.parse(localStorage.pageSize || '15'),
      timeFormat: JSON.parse(localStorage.timeFormat || '"YYYY-MM-DD HH:mm:ss"'),
      timeRelative: JSON.parse(localStorage.timeRelative || 'false'),
      daveAvi: JSON.parse(localStorage.daveAvi || 'false'),
      devMode: JSON.parse(localStorage.devMode || 'false'),
      settingsCategory: localStorage.settingsCategory || 'themes'
    }
  },
  watch: {
    user () {
      if (this.thread)
        this.thread = null
    }
  },
  computed: {
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
    changeSetting (setting, value) {
      localStorage[setting] = JSON.stringify(value)
      this[setting] = value
    },
    selectCategory (category) {
      localStorage.settingsCategory = category
      this.settingsCategory = category
    },
    openThread (thread) {
      this.thread = thread
      if (thread)
        this.$router.push({ name: 'thread', params: { id: thread.id } })
      else
        this.$router.push('/')
    },
    removeHash () {
      if (window.location.hash)
        history.pushState("", document.title, location.pathname + location.search)
    }
  },
  created () {
    // Initial users
    superagent.get(baseURL + '/users').end((err, res) => {
      if (err) {
        console.log(err)
      } else {
        this.users.push(...res.body)
        this.connected = true
      }
    })
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
