<template>
  <van-tabs
    color="#258cf7"
    style="width: 100%;"
  >
    <van-tab title="活动信息">
      <van-cell-group title="基本信息">
        <van-cell
          title="活动名称"
          :value="title"
        ></van-cell>
        <van-cell
          title="活动简介"
          :value="desc"
        ></van-cell>
        <van-cell
          title="中奖名额"
          :value="quota"
        ></van-cell>
        <van-cell
          title="开奖状态"
          :value="status === 0 ? '未开奖' : '已开奖，' + zjUser.length + '人中奖'"
        ></van-cell>
      </van-cell-group>
      <van-cell-group
        title="中奖名单"
        v-if="status > 0 && zjUser.length"
      >
        <van-cell
          v-for="(z, i) in zjUser"
          :key="i"
          :title="z"
        ></van-cell>
      </van-cell-group>
      <van-cell
        @click="status === 0 ? openJiang(false) : openJiang(true)"
        :title="status === 0 ? '立即开奖' : '重新开奖'"
        title-style="color: #1989fa; text-align: center;"
        center
        clickable
        style="margin-top: 3rem"
      />
      <van-cell
        @click="deleteCj"
        title="删除活动"
        title-style="color: #ee0a24; text-align: center;"
        center
        clickable
        style="margin-top: 1rem; margin-bottom: 3rem;"
      />
    </van-tab>
    <van-tab :title="'奖品信息 ' + jpList.length">
      <van-list>
        <van-cell
          v-for="(jpItem, index) in jpList"
          :key="index"
          :title="jpItem.title"
          :value="'x' + jpItem.count"
        />
      </van-list>
    </van-tab>
    <van-tab :title="'参与用户 ' + user.length">
      <van-list>
        <van-cell
          v-for="(userItem, index) in user"
          :key="index"
        >
          <div>
            <span style="margin-right: 10px; vertical-align: middle;">{{ userItem }}</span>
            <van-tag
              v-if="status > 0 && zjUser.includes(userItem)"
              type="success"
              plain
            >中奖</van-tag>
          </div>
        </van-cell>
      </van-list>
    </van-tab>
  </van-tabs>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      desc: '',
      jpList: [],
      user: [],
      zjUser: [],
      quota: 0,
      status: 0,
      ing: false
      // cjList: []
    }
  },
  mounted() {
    // 加载活动数据
    let cjList = []
    this.$vlf
      .getItem('cjl')
      .then(value => {
        cjList = value.cjList
        if (cjList.length <= 0 || typeof this.$route.query.t === 'undefined') {
          this.$router.push('/')
          return
        } else {
          let cj = cjList.find(item => item.title === this.$route.query.t)
          if (typeof cj === 'undefined') {
            this.$router.push('/')
            return
          } else {
            // 加载数据
            this.title = cj.title
            this.desc = cj.desc
            this.jpList = cj.jpList
            this.user = cj.user
            this.zjUser = cj.zjUser
            this.quota = cj.quota
            this.status = cj.status
          }
        }
      })
      .catch(err => {
        this.$router.push('/')
      })
  },
  methods: {
    openJiang(re = false) {
      this.$dialog
        .confirm({
          title: re ? '重新开奖确认' : '开奖确认',
          message: re ? '是否要重新开奖？' : '是否要开奖？'
        })
        .then(() => {
          this.status = 0
          this.zjUser = []
          this.ing = true
          const toast = this.$toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: 'circular',
            message: '系统开奖中\n剩余 5 秒'
          })
          let second = 5 // 倒计时秒数
          const timer = setInterval(() => {
            second--
            if (second) {
              toast.message = `系统开奖中\n剩余 ${second} 秒`
            } else {
              clearInterval(timer)
              this.$toast.clear()
              this.oj()
            }
          }, 1000)
        })
        .catch(() => {
          // on cancel
        })
    },
    deleteCj() {
      this.$dialog
        .confirm({
          title: '删除活动',
          message: '是否要删除这个活动？'
        })
        .then(() => {
          let cjList = []
          this.$vlf
            .getItem('cjl')
            .then(value => {
              cjList = value.cjList
              let cjIndex = cjList.findIndex(item => item.title === this.title)
              if (cjIndex > -1) {
                cjList.splice(cjIndex, 1) // 从个列表中删除这个活动
                // 写入本地储存
                this.$vlf
                  .setItem('cjl', { cjList: cjList })
                  .then(value => {
                    this.$toast.success('删除成功')
                    this.$router.push('/') // 路由跳转回首页
                  })
                  .catch(err => {
                    this.$toast.success('删除失败')
                  })
              }
            })
            .catch(err => {
              this.$router.push('/')
            })
        })
        .catch(() => {
          // 取消删除
        })
    },
    oj() {
      this.status = 0
      this.zjUser = []
      // 重复中奖递归重抽方法
      let f = () => {
        if (this.zjUser >= this.quota) return
        for (let i = 0; i < this.quota; i++) {
          let zu = this.user[this.rn(0, this.user.length - 1)]
          if (this.zjUser.includes(zu)) {
            // 判断是否抽重复了，绕回去递归重新抽
            this.zjUser.splice(this.zjUser.findIndex(item => zu), 1) // 删除掉重复中奖的用户
            f() // 重新来过嘤嘤嘤
            break
          } else {
            this.zjUser.push(zu) // 不重复的直接存入数组
          }
        }
        return
      }
      // 调用重抽闭包函数
      f()
      // 写入本地储存
      let cjList = []
      this.$vlf
        .getItem('cjl')
        .then(value => {
          cjList = value.cjList
          let cjIndex = cjList.findIndex(item => item.title === this.title)
          if (cjIndex > -1) {
            // 设置当前活动的开奖状态值
            this.status = 1
            // 修改指定活动的开奖状态和中奖用户
            cjList[cjIndex].status = this.status
            cjList[cjIndex].zjUser = this.zjUser
            // 保存到本地储存
            this.$vlf
              .setItem('cjl', { cjList: cjList })
              .then(value => {
                this.$dialog.alert({
                  message: '恭喜"' + this.zjUser.join('、') + '"中奖！'
                })
              })
              .catch(err => {
                this.$toast.fail('开奖失败')
              })
          }
        })
        .catch(err => {
          this.$toast.fail('开奖失败')
        })
    },
    // 取随机数方法
    rn(lowerValue, upperValue) {
      return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue)
    }
  }
}
</script>