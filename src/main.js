import Vue from 'vue'
import App from './App.vue'
import router from './router'

import "vue-virtual-scroller/dist/vue-virtual-scroller.css"
import VueVirtualScroller from "vue-virtual-scroller"

// twemoji
import twemoji from 'twemoji'
twemoji.base = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/2.4/2/'

// Clipboard.js
import ClipboardJS from 'clipboard'
new ClipboardJS('.copyBtn', {
  text: (trigger) => {
    return trigger.dataset.clipboardText;
  }
})

import tippy from 'tippy.js'
new tippy('body', {
  target: '.tippy'
})
new tippy('body', {
  target: '.tippy-r',
  placement: 'right'
})
new tippy('body', {
  target: '.tippy-l',
  placement: 'left'
})
new tippy('body', {
  target: '.tippy-b-lg',
  placement: 'bottom',
  size: 'large'
})

import web from './web'
web()

window.es = new EventSource(process.env.VUE_APP_BASE + '/stream')
Vue.config.productionTip = false

Vue.use(VueVirtualScroller)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
