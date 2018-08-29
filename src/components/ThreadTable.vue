<template>
  <div class="scroller px-16 pt-4 h-full">
    <p class="text-center text-4xl">Threads</p>
    <table cellspacing="0" class="my-4 w-full">
      <thead class="select-none">
        <th class="flex-inline items-center justify-center">
          <div class="sort" @click="sortTime">
            <span>Created At</span>
            <div class="ml-2 inline-block">
              <i v-if="sort !== 'created_at'"
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
        <ThreadRow v-for="thread in threads" :key="thread.id"
          :thread="thread" :settings="settings" @open="openThread"/>
        <tr v-if="!threads.length" class="loader">
          <td colspan="4" :style="{ height: `${settings.pageSize * 2}rem` }">
            <Loader/>
          </td>
        </tr>
      </tbody>
    </table>
    <Paginator v-if="pageCount > 1" :pageCount="pageCount"
      :page="page" @select="selectPage"/>
    <p class="result-count font-semibold text-center">{{ threads.length }} out of {{ threadCount }} results</p>
  </div>
</template>

<script>
import ThreadRow from './ThreadRow.vue'
import Paginator from './Paginator.vue'
import Loader from './Loader.vue'

export default {
  components: {
    ThreadRow, Paginator, Loader
  },
  props: {
    user: String,
    settings: { type: Object, required: true }
  },
  data () {
    return {
      threads: [],
      page: 1,
      pageCount: 1,
      reverse: true,
      sort: 'status',
      threadCount: 0
    }
  },
  watch: {
    user () {
      this.page = 1
      this.refreshThreads()
    }
  },
  methods: {
    openThread (thread) {
      this.$emit('openThread', thread)
    },
    selectPage (page) {
      this.page = page
      this.refreshThreads()
    },
    sortTime () {
      if (this.sort !== 'created_at')
        this.sort = 'created_at'
      else
        this.reverse = !this.reverse
      this.refreshThreads()
    },
    sortStatus () {
      if (this.sort !== 'status')
        this.sort = 'status'
      else
        this.reverse = !this.reverse
      this.refreshThreads()
    },
    refreshThreads (soft) {
      if (!soft)
        this.threads = []
      let q = `?limit=${this.settings.pageSize}&page=${this.page-1}`
        + `&sort_by=${this.sort}`
      if (this.user)
        q += `&user=${this.user}`
      if (this.reverse)
        q += '&reverse'
      superagent.get(`${baseURL}/threads${q}`).end((err, res) => {
        if (err) {
          console.log(err)
        } else {
          this.pageCount = Math.ceil(res.body.total / this.settings.pageSize)
          this.threads = res.body.threads
          this.threadCount = res.body.total
        }
      })
    }
  },
  created () {
    this.refreshThreads()
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
  border-top-left-radius: $spacing * .5rem;
}
th:last-child {
  border-top-right-radius: $spacing * .5rem;
}
.loader {
  & td {
    @include themify {
      background: themed('bg-dark-2');
    }
    border-bottom-left-radius: $spacing * .5rem;
    border-bottom-right-radius: $spacing * .5rem;
    padding: 0;
  }
}
.result-count {
  @include themify {
    color: themed('text-muted');
  }
}
</style>
