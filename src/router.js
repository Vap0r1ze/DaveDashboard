import Vue from 'vue'
import Router from 'vue-router'
import Threads from './views/Threads.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [ {
    path: '/',
    name: 'threads',
    component: Threads
  }, {
    path: '/thread/:id',
    name: 'thread',
    component: () => import(/* webpackChunkName: "thread" */ './views/Thread.vue')
  },{
    path: '/settings/:category',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ './views/Settings.vue')
  } ]
})
