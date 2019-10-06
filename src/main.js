import Vue from 'vue'
import VueRouter from 'vue-router'
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import Vant from 'vant'
import 'vant/lib/index.css'
import VueClipboard from 'vue-clipboard2'
// import CryptoJS from 'crypto-js'
import App from './App.vue'
import router from './router/index'

import './assets/style/iconfont/iconfont.scss'
import './assets/style/global.scss'

Vue.config.productionTip = false
Vue.use(VueRouter)
// Vue.use(ElementUI)
Vue.use(Vant)
Vue.use(VueClipboard)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
