<template>
  <div class="section">
    <p class="section-title">Themes</p>
    <div class="theme-selector">
      <div v-for="theme in themes" class="inline-block justify-center px-8 mb-4"
        :key="theme[1]" :class="themeName(theme[1])">
        <div class="theme text-center inline-block" @click="selectTheme(theme[1])"
          :class="{ current: current === theme[1] }">
          <div class="theme-preview w-48 rounded-lg h-32 mb-4 mx-auto flex select-none">
            <div class="sidebar rounded-l-lg h-full w-12"></div>
            <div class="content px-4 h-full flex-1 flex flex-col py-2">
              <div>
                <div class="title w-1/2 h-4 mx-auto rounded"></div>
              </div>
              <div class="table mt-2 h-full flex-1 flex flex-col">
                <div class="table-header h-3"></div>
                <div class="row flex-1" v-for="n in 6" :key="n"></div>
              </div>
            </div>
          </div>
          <span class="text-lg">{{theme[0]}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    current: { type: String, required: true }
  },
  data () {
    return {
      themes: [
        ['Discord', 'discord'],
        ['Dark', 'dark'],
        ['Light', 'light'],
        ['Monokai', 'monokai'],
        ['Monokai Sublime', 'monokai-sublime'],
        ['Coder Dark', 'dark-coder'],
        ['Cobalt', 'cobalt'],
        ['Pastels on Dark', 'dark-pastels'],
        ['Tek', 'tek'],
        ['VS Dark', 'dark-vscode'],
        ['Dracula', 'dracula'],
        ['Black', 'black']
      ]
    }
  },
  methods: {
    selectTheme (theme) {
      this.$emit('changeSetting', 'theme', theme)
    },
    themeName (theme) {
      return {
        [`theme-preview-${theme}`]: true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.theme {
  cursor: pointer;
}
.current .theme-preview {
  @include themify {
    box-shadow: 0 0 0 4px themed('primary');
  }
}
.table-header {
  border-top-left-radius: .25rem;
  border-top-right-radius: .25rem;
}
.table .row:last-child {
  border-bottom-left-radius: .25rem;
  border-bottom-right-radius: .25rem;
}

@include theme-previews () {
  .sidebar {
    background: themed('bg-dark-1');
  }
  .title {
    background: themed('text');
  }
  .table-header {
    background: themed('primary');
  }
  .table .row {
    &:nth-child(2n) { background: themed('bg-dark-2'); }
    background: themed('bg-dark-1');
  }
  background: themed('bg');
}
</style>
