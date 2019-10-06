<template>
  <div class="wrap add">
    <!-- <h2 class="__title">基本信息</h2> -->
    <van-cell-group title="基本设置">
      <van-field
        v-model="title"
        label="活动名称"
        placeholder="请输入活动名称"
        required
        clearable
      />
      <van-field
        v-model="desc"
        label="活动简介"
        placeholder="请输入活动简介"
        required
        clearable
      />
      <van-cell title="中奖名额">
        <van-stepper
          v-model="quota"
          max="999"
          input-width="30px"
          button-size="22px"
        />
      </van-cell>
    </van-cell-group>
    <!-- <h2 class="__title">奖品信息</h2> -->
    <van-cell-group title="奖品设置">
      <van-swipe-cell
        v-for="(item, index) in jpList"
        :key="index"
        :name="index"
        :ref="'jpItem' + index"
        :on-close="onClose"
        :stop-propagation="true"
        disabled
      >
        <!-- <van-cell :title="item.title">
          <div style="float: right">
            <van-stepper
              v-model="item.count"
              input-width="30px"
              button-size="22px"
            />
          </div>
        </van-cell> -->

        <van-cell style="padding: 0;">
          <van-field
            :ref="'vf' + (index)"
            v-model="item.title"
            center
            clearable
            @focus="$refs['jpItem' + index][0].close()"
            @click-left-icon="clickDel($refs['jpItem' + index])"
            placeholder="请输入奖品名称"
          >
            <van-icon
              class-prefix="iconfont"
              name="icon-ios-remove-circle"
              slot="left-icon"
              color="#ee0a24"
              size="17px"
              style="margin-top: -3px; margin-right: 4px; vertical-align: middle;"
            />
            <van-stepper
              slot="button"
              v-model="item.count"
              max="999"
              input-width="30px"
              button-size="22px"
            />
          </van-field>
        </van-cell>

        <template slot="right">
          <van-button
            square
            type="danger"
            text="删除"
          />
        </template>
      </van-swipe-cell>
      <van-cell
        @click="addJp"
        clickable
      >
        <template slot="title">
          <div
            id="__add"
            class="ios-cell-button"
          >
            <van-icon
              class="b-icon"
              name="add"
            />
            <span class="b-text">添加奖品</span>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group title="参与用户设置">
      <van-field
        v-model="user"
        type="textarea"
        label="参与用户"
        placeholder="请输入参与用户（一行一个）"
        clearable
        rows="1"
        required
        autosize
      />
      <van-cell
        id="_load_user"
        @click="loadCjUser"
        v-if="cjList.length > 0"
        title="从现有活动中导入..."
        :title-style="cjList.length > 0 ? 'color: #1989fa;' : 'color: #ccc;'"
        :clickable="cjList.length > 0"
      />
      <!-- 选择活动弹层 -->
      <van-popup
        v-model="showPicker"
        position="bottom"
      >
        <van-picker
          show-toolbar
          title="选择活动"
          :columns="cjColumns"
          :default-index="0"
          @cancel="closeCjUserPicker"
          @confirm="confirmCjUserPicker"
        >
          <van-cell-group slot="columns-bottom">
            <van-switch-cell
              v-model="isCoverUser"
              @change="isCoverUserChange"
              title="覆盖现有用户"
            />
            <van-switch-cell
              v-model="isFilterZjUser"
              title="过滤中奖用户"
            />
          </van-cell-group>
        </van-picker>
      </van-popup>
    </van-cell-group>
    <!-- <van-cell-group title="抽取设置">
      <van-cell title="中奖名额">
        <van-stepper
          v-model="quota"
          max="999"
          input-width="30px"
          button-size="22px"
        />
      </van-cell>
    </van-cell-group> -->
    <!-- <div style="padding: 1rem;">
      <van-button
        @click="save()"
        color="linear-gradient(to right, #4bb0ff, #6149f6)"
        size="large"
      >确定</van-button>
    </div> -->
    <van-cell-group style="margin: 3rem 0;">
      <van-cell
        @click="save"
        :title="isEdit ? '确认修改' : '确认创建'"
        title-style="color: #1989fa; text-align: center;"
        center
        clickable
      />
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      desc: '',
      jpList: [
        {
          title: '',
          count: 1
        }
      ],
      user: '',
      quota: 1,
      status: 0,
      isEdit: false,
      showPicker: false,
      cjList: [],
      isCoverUser: false,
      isFilterZjUser: true
    }
  },
  computed: {
    cjColumns() {
      return this.cjList.map(item => item.title)
    }
  },
  mounted() {
    let cjl = window.localStorage.getItem('cjList')
    cjl = JSON.parse(cjl) || null
    let cjList = cjl.cjList || []
    this.cjList = cjList
    // 判断是否编辑模式
    if (this.$route.query.t) {
      this.isEdit = true
      if (!cjl) {
        this.$router.push('/')
        return
      } else {
        // cjl = JSON.parse(cjl)
        let cj = cjList.find(item => item.title === this.$route.query.t)
        if (!cj) {
          this.$router.push('/')
        }
        this.title = cj.title
        this.desc = cj.desc
        this.jpList = cj.jpList
        this.user = cj.user.join('\n')
        // this.zjUser = cj.zjUser
        this.quota = cj.quota
        this.status = cj.status
      }
    }
  },
  methods: {
    addJp() {
      this.jpList.push({
        title: '',
        count: 1
      })
      setTimeout(() => {
        // document.getElementById('__add').scrollIntoView()
        this.$refs['vf' + (this.jpList.length - 1)][0].focus()
      }, 10)
      // console.log(this.$refs[Object.keys(this.$refs)[Object.keys().length - 1]])
      // console.log(this.$refs['vf' + (this.jpList.length - 2)])
    },
    clickDel(ref) {
      // console.log(ref[0])
      ref[0].open('right')
    },
    onClose(clickPosition, instance, detail) {
      switch (clickPosition) {
        case 'left':
          break
        case 'cell':
          break
        case 'outside':
          instance.close()
          break
        case 'right':
          // console.log(this.jpList[detail.name])
          instance.close()
          setTimeout(() => {
            this.jpList.splice(detail.name, 1)
          }, 600)
          break
      }
    },
    loadCjUser() {
      if (this.cjList.length <= 0) return
      this.isCoverUser = false
      this.isFilterZjUser = true
      this.showPicker = true
    },
    isCoverUserChange(checked) {
      // 是否覆盖用户开关的开关状态被改变
    },
    closeCjUserPicker() {
      this.showPicker = false
    },
    confirmCjUserPicker(value, index) {
      const cj = this.cjList.find(item => item.title === value),
        user = this.isFilterZjUser ? cj.user.filter(item => !cj.zjUser.includes(item)) : cj.user
      // this.$dialog
      //   .confirm({
      //     title: '确认导入',
      //     message: `确认导入共${user.length}个用户？`
      //   })
      //   .then(() => {
      //     this.user = this.isCoverUser ? this.user + (this.user ? '\n' : '') + user.join('\n') : user.join('\n')
      //     this.showPicker = false
      //     this.$toast.success('导入成功')
      //   })
      //   .catch(() => {
      //     // 取消
      //   })
      this.user = this.isCoverUser ? user.join('\n') : this.user + (this.user ? '\n' : '') + user.join('\n')
      this.showPicker = false
      this.$toast.success('导入成功')
      setTimeout(() => {
        document.getElementById('_load_user').scrollIntoView()
      }, 10)
    },
    save() {
      let jpListPlus = this.jpList.filter(item => item.title) // 过滤空名称奖品
      const _RegExCount = new RegExp(/[x|×|*][\d]+/g), // 判断是否复制模式
        _RegExpNumber = new RegExp(/[\d]+/gi) // 数字
      let u = this.user.split('\n')
      if (u) {
        u = u.filter(item => item)
      }
      let u1 = []
      for (let i = 0; i < u.length; i++) {
        let _count = u[i].match(_RegExCount) || [],
          _countNumber = _count.length > 0 ? _count[0].match(_RegExpNumber) : null
        if (_count && _countNumber) {
          u[i] = u[i].replace(_count[0], '')
          for (let ig = 0; ig < _countNumber[0]; ig++) {
            u1.push(u[i] + ' (' + (ig + 1) + ')')
          }
        } else {
          u1.push(u[i])
          continue
        }
      }
      // console.log(u1)
      if (!this.title) {
        this.$toast('请输入活动名称')
      } else if (!this.desc) {
        this.$toast('请输入活动简介')
      } else if (jpListPlus.length <= 0) {
        this.$toast('请添加奖品信息')
      } else if (!this.user || !u || !u1) {
        this.$toast('请添加参与用户')
      } else if (this.quota > u.length) {
        this.$toast('中奖名额数不能大于参与用户的总数')
      } else {
        let cjl = window.localStorage.getItem('cjList')

        if (!cjl) {
          cjl = {
            cjList: []
          }
        } else {
          cjl = JSON.parse(cjl)
          let cjlIndex = cjl.cjList.findIndex(item => item.title === this.title)
          if (cjlIndex > -1 && !this.isEdit) {
            this.$toast.fail('活动已存在')
            return
          }
        }
        if (this.isEdit) {
          let cjlIndex = cjl.cjList.findIndex(item => item.title === this.$route.query.t)
          if (cjlIndex > -1) {
            cjl.cjList[cjlIndex].title = this.title
            cjl.cjList[cjlIndex].desc = this.desc
            cjl.cjList[cjlIndex].quota = this.quota
            cjl.cjList[cjlIndex].jpList = jpListPlus || this.jpList
            cjl.cjList[cjlIndex].user = u1 || u || []
          } else {
            this.$toast.fail('修改失败')
            return
          }
        } else {
          cjl.cjList.push({
            title: this.title,
            desc: this.desc,
            jpList: jpListPlus || this.jpList,
            user: u1 || u || [],
            zjUser: [],
            quota: this.quota,
            status: this.status
          })
        }
        window.localStorage.setItem('cjList', JSON.stringify(cjl))
        this.$toast.success(this.isEdit ? '修改成功' : '新建成功')
        this.$router.go(-1)
        // if (this.isEdit) {
        //   this.$router.push({
        //     name: 'info',
        //     query: {
        //       t: this.title
        //     }
        //   })
        // } else {
        //   this.$router.push('/')
        // }
      }
    }
  }
}
</script>

<style lang="scss">
.wrap {
  &.add {
    width: 100%;
  }
}
</style>