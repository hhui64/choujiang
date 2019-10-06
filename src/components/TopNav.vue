<template>
  <van-sticky>
    <van-nav-bar
      :title="titleText"
      :right-text="buttonText"
      :left-arrow="$route.path !== '/'"
      :left-text="$route.path !== '/' ? '返回' : null"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <!-- {{ buttonText }} -->
      <van-icon v-if="$route.path === '/'" name="plus" size="16px" slot="right" />
    </van-nav-bar>
  </van-sticky>
</template>

<script>
export default {
  data() {
    return {
      titleText: '',
      buttonText: ''
    }
  },
  watch: {
    $route(to, from) {
      this.routerSwitch(to, from)
    }
  },
  methods: {
    routerSwitch(to, from) {
      switch (to.path) {
        case '/':
          this.titleText = '奶灵抽奖助手'
          this.buttonText = '新建'
          break
        case '/info':
          this.titleText = '活动详情'
          this.buttonText = '编辑'
          break
        case '/info/add':
          this.titleText = this.$route.query.t ? '编辑活动' : '新建活动'
          this.buttonText = null // this.$route.query.t ? '保存' : '确定'
          break
      }
    },
    onClickLeft() {
      // this.$route.path !== '/' ? this.$router.go(-1) : null
      this.$router.go(-1)
    },
    onClickRight() {
      switch (this.$route.path) {
        case '/':
          this.$router.push({
            name: 'info-add',
            query: {
              m: 'add'
            }
          })
          break
        case '/info':
          this.$router.push({
            name: 'info-add',
            query: {
              m: 'edit',
              t: this.$route.query.t
            }
          })
          break
        case '/info/add':
          // this.$router.push('/')
          break
      }
    }
  },
  mounted() {
    this.routerSwitch({ path: this.$route.path })
  }
}
</script>