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

// Tippy
// import { delegate } from 'tippy.js'
// window.tippy = delegate
// delegate('#app', {
//   target: '.tippy'
// })
// delegate('#app', {
//   target: '.tippy-r',
//   placement: 'right'
// })
// delegate('#app', {
//   target: '.tippy-l',
//   placement: 'left'
// })
// delegate('#app', {
//   target: '.tippy-b-lg',
//   placement: 'bottom',
//   size: 'large'
// })

import web from './web'
web()

window.es = new EventSource('/stream')
Vue.config.productionTip = false

Vue.use(VueVirtualScroller)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
