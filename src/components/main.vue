<template>
  <div class="cj-main">
    <div class="wrap cj">
      <p
        v-show="cjList.length <= 0"
        style="margin-top: 120px; text-align: center; color: rgb(193, 193, 193); font-size: 14px;"
      >暂无抽奖活动</p>
      <van-panel
        class="cj-card"
        :title="item.title"
        :desc="item.desc"
        :status="item.status === 0 ? '未开奖' : item.zjUser.length + '人中奖'"
        v-for="(item, index) in cjList"
        :key="index"
      >
        <div
          slot="default"
          class="content-wrap"
        >
          <ul class="jp-list">
            <li
              v-for="(jp, index) in item.jpList"
              :key="index"
            >
              <div class="i-span i-title">{{ jp.title }}</div>
              <div class="i-span i-count">
                <span>x{{ jp.count }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div
          slot="footer"
          class="footer-wrap"
        >
          <span class="people-count">{{ item.user.length }}人参与</span>
          <van-button
            @click="viewInfo(item.title)"
            size="small"
          > 查看详情 </van-button>
          <van-button
            @click="viewInfo(item.title)"
            size="small"
            color="linear-gradient(to right, #4bb0ff, #6149f6)"
            v-show="item.status === 0"
            style="margin-left: 6px;"
          > 立即开奖 </van-button>
        </div>
      </van-panel>

      <p class="setting">
        <!-- <span>共{{ cjList.length }}个活动，</span> -->
        <a
          @click="output()"
          v-show="cjList.length > 0"
          href="javascript:void(0)"
          class="btn"
        >共{{ cjList.length }}个抽奖活动</a>
      </p>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'
export default {
  data() {
    return {
      cjList: []
    }
  },
  methods: {
    viewInfo(title) {
      this.$router.push({
        name: 'info',
        query: {
          t: title
        }
      })
    },
    openJiang() {
      // ...
    },
    input() {
      // 导入数据
      // ...
    },
    output() {
      // 导出数据
      // const setting = window.localStorage.getItem('cjList')
      // this.$copyText(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(setting))).then(
      //   res => {
      //     this.$toast.success('导出成功')
      //   },
      //   err => {
      //     this.$toast.fail('导出成功')
      //   }
      // )
    }
  },
  mounted() {
    this.$vlf
      .getItem('cjl')
      .then(value => {
        this.cjList = value.cjList
      })
      .catch(err => {
        this.cjList = []
      })
  }
}
</script>

<style lang="scss">
.cj-main {
  // padding: 0 2rem;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.wrap {
  // margin-top: 2rem;
  &.cj {
    // padding: 0 1rem;
    .cj-card {
      margin: 1rem 0;
      .content-wrap {
        padding: 8px 16px;
        .jp-list {
          list-style: none;
          li {
            display: flex;
            padding: 4px 0;
            // line-height: 19px;
            .i-span {
              font-size: 14px;
              &.i-title {
                flex: 1;
                // max-width: calc(100% - 40px);
                text-align: justify;
                color: #666;
              }
              &.i-count {
                padding-left: 10px;
                box-sizing: border-box;
                min-width: 40px;
                text-align: right;
                // margin-top: 1px;
                // float: right;
                font-weight: bold;
                span {
                  display: block;
                  position: relative;
                  top: 50%;
                  margin-top: -10px;
                }
              }
            }
          }
        }
      }
      .footer-wrap {
        text-align: right;
        .people-count {
          float: left;
          font-size: 12px;
          color: #969799;
          margin-top: 7px;
        }
      }
    }
    p.setting {
      // display: block;
      margin: 2rem;
      text-align: center;
      font-size: 12px;
      color: #ccc;
      a.btn {
        color: inherit;
        // text-decoration: underline;
      }
    }
  }
  &.list {
    padding: 0;
  }
}

.card {
  // margin: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 8px 12px #ebedf0;
  p.title {
    margin-top: 0;
    margin-bottom: 1rem;
  }
}
</style>