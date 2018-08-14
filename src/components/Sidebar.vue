<template>
  <div class="sidebar global-trans-ignore flex flex-col h-screen w-64" :class="{ collapsed }">
    <div class="flex">
      <div class="flex flex-col select-none">
        <div class="btn-collapse flex flex-1 items-center justify-center w-8 h-8"
          @click="collapse">
          <i class="text-xl global-trans-ignore fa fa-arrow-left"></i>
        </div>
        <div v-if="area === 'settings'"
          class="btn-threads flex flex-1 items-center justify-center w-8 h-8"
          @click="openThreads">
          <i class="fa fa-users"></i>
        </div>
        <div v-else
          class="btn-threads flex flex-1 items-center justify-center w-8 h-8"
          @click="openSettings">
          <i class="text-xl fa fa-cog"></i>
        </div>
      </div>
      <UserSearch v-if="area === 'threads'" @update="updateSearch"/>
      <div v-else-if="area === 'settings'" class="area-title flex-1 flex justify-center items-center">
        <p class="text-3xl select-none">Settings</p>
      </div>
    </div>
    <div v-if="collapsed"></div>
    <SettingsCategories v-else-if="area === 'settings'" :category="settingsCategory"
      @select="selectCategory"/>
    <NoUsers v-else-if="!this.searchedUsers.length"/>
    <div v-else class="scroller-small flex-1 px-2">
        <UserTab v-for="user in searchedUsers" :key="user.id"
          :selected="selected === user.id" :user="user" @selectUser="selectUser"/>
    </div>
  </div>
</template>

<script>
import UserTab from './UserTab.vue'
import UserSearch from './UserSearch.vue'
import NoUsers from './NoUsers.vue'
import SettingsCategories from './SettingsCategories.vue'

export default {
  components: {
    UserTab, UserSearch, NoUsers, SettingsCategories
  },
  props: {
    users: { type: Array, required: true },
    selected: String,
    area: { type: String, required: true },
    settingsCategory: { type: String, required: true }
  },
  data () {
    return {
      search: '',
      collapsed: false
    }
  },
  computed: {
    searchedUsers () {
      return this.users.filter(user => {
        return user.name.toLowerCase().includes(this.search.toLowerCase())
          || user.id.includes(this.search)
      })
    }
  },
  methods: {
    selectUser (id) {
      this.$emit('selectUser', id)
    },
    updateSearch (search) {
      this.search = search
    },
    collapse () {
      this.collapsed = !this.collapsed
    },
    openSettings () {
      this.$emit('open', 'settings')
    },
    openThreads () {
      this.$emit('open', 'threads')
    },
    selectCategory (category) {
      this.$emit('selectCategory', category)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.sidebar {
  @include themify {
    background: themed('bg-dark-1');
  }
  transition: width .3s ease-in-out, background .3s ease-in-out;
}
.btn-collapse {
  @include themify {
    background: themed('primary');
  }
  & i { transition: transform .3s ease; }
  cursor: pointer;
  color: #fff;
}
.btn-settings, .btn-threads {
  @include themify {
    background: themed('bg-dark-3');
  }
  cursor: pointer;
}
.area-title {
  overflow: hidden;
}

.collapsed {
  & .btn-collapse i {
    transform: rotateZ(180deg);
  }
  & .searchbar {
    // display: none;
    width: 0px;
    padding: 0px;
  }
  width: 2rem;
}
</style>
