<template>
  <div class="sidebar global-trans-ignore flex flex-col h-screen w-64" :class="{ collapsed }">
    <div class="flex">
      <div class="flex flex-col select-none">
        <div class="btn-collapse flex flex-1 items-center justify-center w-8 h-8"
          @click="collapse">
          <i class="text-xl global-trans-ignore fa fa-arrow-left"></i>
        </div>
        <div v-if="$route.name === 'settings'" @click="goBack"
          class="btn-threads flex flex-1 items-center justify-center w-8 h-8">
          <i class="fa fa-users"></i>
        </div>
        <div v-else @click="openSettings"
          class="btn-settings flex flex-1 items-center justify-center w-8 h-8">
          <i class="text-xl fa fa-cog"></i>
        </div>
      </div>
      <div v-if="$route.name === 'settings'" class="area-title flex-1 flex justify-center items-center">
        <p class="text-3xl select-none">Settings</p>
      </div>
      <UserSearch v-else :_search="search" @update="updateSearch"/>
    </div>
    <div v-if="collapsed"></div>
    <SettingsCategories v-else-if="$route.name === 'settings'" :category="settingsCategory"
      @select="selectCategory"/>
    <NoUsers v-else-if="!this.searchedUsers.length"/>
    <virtual-scroller v-else :items="searchedUsers" item-height="40"
      class="scroller-small flex-1 px-2">
      <template slot-scope="props">
        <UserTab :selected="selected === props.item.id" :user="props.item"
          @selectUser="selectUser"/>
      </template>
    </virtual-scroller>
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
    selectCategory (category) {
      this.$emit('selectCategory', category)
    },
    openSettings () {
      this.$router.push(`/settings/${this.settingsCategory}`)
    },
    goBack () {
      this.$router.go(-1)
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
    color: themed('text');
  }
  cursor: pointer;
  text-decoration: none;
}
.area-title {
  overflow: hidden;
}

.collapsed {
  & .btn-collapse i {
    transform: rotateZ(180deg);
  }
  & .searchbar {
    width: 0px;
    padding: 0px;
  }
  width: 2rem;
}
.text-3xl.select-none {
  padding: 0 12px;
  margin: 1px;
}
.area-title.flex-1.flex.justify-center.items-center {
  padding: 12px 0;
}
</style>
