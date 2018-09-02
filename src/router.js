import Vue from 'vue'
import Router from 'vue-router'
import ThreadTable from './components/ThreadTable.vue'

Vue.use(Router)

export default new Router({
  routes: [ {
    path: '/',
    name: 'threads',
    component: ThreadTable
  }, {
    path: '/thread/:id',
    name: 'thread',
    component: () => import(/* webpackChunkName: "thread" */ './components/Thread.vue')
  },{
    path: '/settings/:category',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings" */ './components/Settings.vue')
  } ]
})
