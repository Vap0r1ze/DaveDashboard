<template>
  <tr class="select-none h-8" @click="open">
    <td class="thread-id">
      <code class="text-sm tracking-tight mr-2">{{ formattedTime }}</code>
    </td>
    <td v-if="thread.status === 1">Open</td>
    <td v-else-if="thread.status === 2">
      <span>Closed</span>
    </td>
    <td>
      <span class="mx-auto"><User :user="thread.user_name"/></span>
    </td>
    <td>
      <span v-if="thread.scheduled_close_name">
        <User :user="thread.scheduled_close_name"/>
      </span>
    </td>
  </tr>
</template>

<script>
import User from './User.vue'
import { setInterval } from 'timers';

export default {
  components: {
    User
  },
  props: {
    thread: { type: Object, required: true },
    expanded: Boolean,
    settings: { type: Object, required: true }
  },
  data () {
    return {
      formattedTime: ''
    }
  },
  computed: {
    status () {
      switch (this.thread.status) {
        case 1:
          return 'Open'
        case 2:
          return 'Closed'
      }
    }
  },
  methods: {
    open () {
      this.$emit('open', this.thread)
    },
    updateRelativeTime () {
      this.formattedTime = moment.utc(this.thread.created_at).fromNow()
      setTimeout(this.updateRelativeTime, 10000)
    }
  },
  created () {
    if (this.settings.timeRelative) {
      this.updateRelativeTime()
    } else {
      this.formattedTime = moment.utc(this.thread.created_at).local()
        .format(this.settings.timeFormat)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.thread-id {
  & code {
    @include themify {
      background: rgba(#000, if($theme == 'light', .1, .3));
    }
  }
  white-space: nowrap;
}

tr {
  @include themify {
    &:nth-child(2n) td {
      background: themed('bg-dark-1');
    }
    &:hover td {
      background: mix(
        if($theme == 'light', #000, #fff),
        themed('bg-dark-1'), 20%);
    }
  }
  cursor: pointer;
}
td {
	@include themify {
    background: themed('bg-dark-2');
  }
	padding: 0 $spacing * .75rem;
  &.text-right { text-align: right; }
  transition: padding 0.6s ease;
  text-align: center;
}
tr:last-child td {
  &:first-child { border-bottom-left-radius: $spacing * .5rem; }
  &:last-child { border-bottom-right-radius: $spacing * .5rem; }
}
</style>
