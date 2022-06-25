<template>
  <div class="my-container">
    <!-- 已登录头部 -->
    <div v-if="user" class="header user-info">
      <!-- 头像、姓名等区域 -->
      <div class="base-info">
        <div class="left">
          <van-image class="avatar" fit="cover" round :src="userInfo.photo"/>
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button size="mini" round to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <!-- 关注、粉丝等区域 -->
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- /已登录头部 -->

    <!-- 未登录头部 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt>
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- /未登录头部 -->

    <!-- 导航 -->
    <van-grid class="grid-nav" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
        <!-- 必须给span加上具名插槽，不然会被当成默认插槽，把图标覆盖了 -->
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- /导航 -->

    <!-- 消息通知，小智同学，退出登录 -->
    <van-cell title="消息通知" is-link class="md8"/>
    <van-cell title="小智同学" is-link class="md9"/>
    <van-cell v-if="user" clickable title="退出登录" class="lgout-cell" @click="onLogout"/>
    <!-- /消息通知，小智同学，退出登录 -->
  </div>
</template>

<script>
import { mapState } from "vuex"; // 1.从vuex中按需导入mapState函数
import { getUserInfo } from "@/api/user";

export default {
  name: "MyIndex",

  data () {
    return {
      userInfo: {} // 用户信息
    };
  },

  computed: {
    ...mapState(["user"]) // 2.将user，映射为当前组件的计算属性
  },

  created () {
    // 如果用户登录了，则请求加载用户信息数据
    if (this.user) {
      this.loadUserInfo();
    }
  },

  mounted () {},

  methods: {
    // 退出提示
    onLogout () {
      // 在组件中需要使用 this.$dialog 来调用 Dialog 组件
      this.$dialog
        .confirm({
          title: "确认退出吗？"
        })
        .then(() => {
          // on confirm
          // console.log("点击确认会执行这里");
          this.$store.commit("setUser", null); // 把容器里的 user 设置为null
        })
        .catch(() => {
          // on cancel
          // console.log("点击取消会执行这里");
        });
      // 确认退出：清除登录状态（容器中的 user + 本地存储中的 user）
    },

    async loadUserInfo () {
      try {
        const { data } = await getUserInfo(); // data 是返回来的一个对象，里面有很多属性
        this.userInfo = data.data;
      } catch (err) {
        this.$toast("获取数据失败，请稍后重试");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png"); // 样式好像也可以用@ 跳转到 src 文件夹，但是前面要加一个 ~
    background-size: cover;
  }

  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between; // 水平两边撑开
      align-items: center; // 垂直居中显示
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: 4px solid #fff;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
    .data-stats {
      // height: 130px;
      display: flex;
      .data-item {
        height: 130px; // 父级不要给高度了，直接给子高度，让其水平居中
        flex: 1;
        display: flex;
        flex-direction: column; // 垂直分布
        justify-content: center; // 水平居中
        align-items: center; // 垂直居中
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }

  .lgout-cell {
    text-align: center;
    color: #d86262;
  }
  .md8 {
    margin-top: 9px;
  }
  .md9 {
    margin-top: 4px;
    margin-bottom: 9px;
  }
}
</style>
