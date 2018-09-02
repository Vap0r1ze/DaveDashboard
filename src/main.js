import Vue from 'vue'
import App from './App.vue'
import "vue-virtual-scroller/dist/vue-virtual-scroller.css"
import VueVirtualScroller from "vue-virtual-scroller"
import router from './router'

import config from './config.js'
import web from './web.js'

Vue.config.productionTip = false
Object.assign(window, config)
web()

Vue.use(VueVirtualScroller)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
