import Vue from 'vue'
import Router from 'vue-router'
import main from '../components/main.vue'
import info from '../components/info.vue'
import add from '../components/add.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    meta: {
      index: 0
    },
    component: main
  }, {
    path: '/info',
    name: 'info',
    meta: {
      index: 1
    },
    component: info
  }, {
    path: '/info/add',
    name: 'info-add',
    meta: {
      index: 2
    },
    component: add
  }],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})