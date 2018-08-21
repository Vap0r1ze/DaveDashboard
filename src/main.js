import Vue from 'vue'
import App from './App.vue'
import config from './config.js'
import web from './web.js'

Vue.config.productionTip = false
Object.assign(window, config)
web()

new Vue({
  render: h => h(App)
}).$mount('#app')
