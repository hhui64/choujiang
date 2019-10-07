<template>
  <div id="app">
    <TopNav></TopNav>
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import TopNav from './components/TopNav.vue'

export default {
  name: 'app',
  components: {
    TopNav
  },
  data() {
    return {
      transitionName: ''
    }
  },
  watch: {
    // 使用 watch 监听 $router 的变化
    $route(to, from) {
      // 如果 to.meta.index 大于 from.meta.index，判断为前进状态，反之则为后退状态
      if (to.meta.index > from.meta.index) {
        this.transitionName = 'slide-left' // 设置动画名称-左边
      } else {
        this.transitionName = 'slide-right' // 设置动画名称-右边
      }
    }
  },
  mounted() {
    // 初始化时判断是否为旧版的储存方式（即使用 localStorage 储存的数据）
    const cjl = window.localStorage.getItem('cjList'),
      cjlF = null
    if (cjl) {
      // 迁移至 localForage 设置的默认储存位置
      this.$vlf
        .setItem('cjl', JSON.parse(cjl))
        .then(value => {
          // 清空原来的数据
          window.localStorage.removeItem('cjList')
        })
        .catch(err => {
          this.$toast.fail('初始化失败')
        })
    } else {
      // 首次打开时写入本地储存一个初始值
      this.$vlf
        .setItem('cjl', { cjList: [] })
        .then(value => {
          // ...
        })
        .catch(err => {
          this.$toast.fail('初始化失败')
        })
    }
  }
}
</script>
