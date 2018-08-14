<template>
  <div class="scroller px-16 pt-4 h-full">
    <p class="text-center text-4xl">Threads</p>
    <table cellspacing="0" class="my-4 w-full" :class="{ empty: !pages[0] }">
      <thead class="select-none">
        <th class="flex-inline items-center justify-center">
          <div class="sort" @click="sortTime">
            <span>Created At</span>
            <div class="ml-2 inline-block">
              <i v-if="sort !== 'time'"
                class="compare fa fa-sort"></i>
              <i v-else-if="reverse" class="compare fa fa-sort-asc"></i>
              <i v-else class="compare fa fa-sort-desc"></i>
            </div>
          </div>
        </th>
        <th class="flex-inline items-center justify-center">
          <div class="sort" @click="sortStatus">
            <span>Status</span>
            <div class="ml-2 inline-block">
              <i v-if="sort !== 'status'"
                class="compare fa fa-sort"></i>
              <i v-else-if="reverse" class="compare fa fa-sort-asc"></i>
              <i v-else class="compare fa fa-sort-desc"></i>
            </div>
          </div>
        </th>
        <th>User</th>
        <th>Closed By</th>
      </thead>
      <tbody>
        <ThreadRow v-for="thread in threads" v-if="isSelected(thread)"
          :key="thread.id" :thread="thread" :settings="settings"
          @open="openThread"/>
      </tbody>
    </table>
    <Paginator v-if="pageCount > 1" :pageCount="pageCount"
        :page="page" @select="selectPage"/>
  </div>
</template>

<script>
import ThreadRow from './ThreadRow.vue'
import Paginator from './Paginator.vue'

export default {
  components: {
    ThreadRow, Paginator
  },
  props: {
    threads: { type: Array, required: true },
    user: String,
    settings: { type: Object, required: true }
  },
  data () {
    return {
      page: 1,
      reverse: true,
      sort: 'status'
    }
  },
  watch: {
    user () {
      this.page = 1
    },
    sort () {
      this.sortThreads()
    },
    reverse () {
      this.sortThreads()
    }
  },
  computed: {
    selectedThreads () {
      return this.threads.filter(thread =>
        thread.user_id === this.user || !this.user
      )
    },
    pageCount () {
      return Math.ceil(this.selectedThreads.length / this.settings.pageSize)
    },
    pages () {
      let { pageSize } = this.settings
      let pageCount = this.pageCount
      let pages = Array(pageCount).fill(0).map(()=>[])
      for (let i = 0; i < this.selectedThreads.length; i++) {
        pages[Math.floor(i / pageSize)].push(this.selectedThreads[i])
      }
      return pages
      // return [this.selectedThreads]
    }
  },
  methods: {
    openThread (id) {
      this.$emit('openThread', id)
    },
    isSelected (thread) {
      return this.pages[this.page-1]
        && this.pages[this.page-1].some(t => t.id === thread.id)
    },
    selectPage (page) {
      this.page = page
    },
    sortTime () {
      if (this.sort !== 'time')
        this.sort = 'time'
      else
        this.reverse = !this.reverse
    },
    sortStatus () {
      if (this.sort !== 'status')
        this.sort = 'status'
      else
        this.reverse = !this.reverse
    },
    sortThreads () {
      let threads = this.threads
      threads.sort((a, b) => {
        if (moment(a.created_at).unix() > moment(b.created_at).unix())
          return 1
        if (moment(a.created_at).unix() < moment(b.created_at).unix())
          return -1
        return 0
      })
      switch (this.sort) {
        case 'status':
          if (this.reverse)
            threads.reverse()
          let open = []
          threads.reverse()
          for (let openThread of threads.filter(thread => thread.status === 1)) {
            threads.splice(threads.indexOf(openThread), 1)
            open.push(openThread)
          }
          threads.push(...open)
      }
      if (this.reverse)
        threads.reverse()
    }
  },
  created () {
    this.sortThreads()
  }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

table {
  border-collapse: separate;
}
th {
  @include themify {
    background: themed('primary');
  }
  & .sort { cursor: pointer; }
  color: #fff;
  padding: $spacing * .5rem $spacing * .5rem;
}
th:first-child {
  table.empty & { border-bottom-left-radius: $spacing * .5rem; }
  border-top-left-radius: $spacing * .5rem;
}
th:last-child {
  table.empty & { border-bottom-right-radius: $spacing * .5rem; }
  border-top-right-radius: $spacing * .5rem;
}
</style>
