<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        to="/search"
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
      >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <!-- 1、通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签
    2、通过 animated 属性可以开启切换标签内容时的转场动画
    3、通过 swipeable 属性可以开启滑动切换标签页-->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab v-for="channel in channels" :key="channel.id" :title="channel.name">
        <!-- 文章列表 -->
        <article-list :channel="channel"/>
        <!-- /文章列表 -->
      </van-tab>
      <!--这个是用来占位的，防止最后的标签被汉堡按钮给遮住了-->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 汉堡按钮 三 -->
      <div slot="nav-right" class="humburger-btn" @click="isChennelEditShow = true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChennelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <channel-edit @update-active="onUpdateActive" :my-channelss="channels" :active="active"/>
      <!-- my-channels="channels 把频道列表数据传过去-->
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>

<script>
import { getUserChannels } from "@/api/user";
import ArticleList from "./components/article-list";
import ChannelEdit from "./components/channel-edit";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage";

export default {
  name: "HomeIndex",
  components: {
    ArticleList,
    ChannelEdit
  },

  data () {
    return {
      active: 0,
      channels: [], // 频道列表数据
      isChennelEditShow: false // 控制编辑频道弹出层的显示状态
    };
  },

  computed: {
    ...mapState(["user"])
  },

  created () {
    this.loadChannels();
  },

  mounted () {},

  methods: {
    async loadChannels () {
      try {
        // const { data } = await getUserChannels();
        // // console.log(data);
        // this.channels = data.data.channels;
        let channels = [];
        if (this.user) {
          // 已登录，请求获取用户频道列表
          const { data } = await getUserChannels();
          channels = data.data.channels;
        } else {
          // 未登录，判断是否有本地的频道列表数据
          const localChannels = getItem("TOUTIAO_CHANNELS");
          if (localChannels) {
            // 有的话，直接拿来用
            channels = localChannels;
          } else {
            // 没有的话，使用默认
            const { data } = await getUserChannels();
            channels = data.data.channels;
          }
        }
        this.channels = channels;
      } catch (err) {
        this.$toast("获取频道数据失败");
      }
    },
    onUpdateActive (index, isChennelEditShow = true) {
      this.active = index;
      this.isChennelEditShow = isChennelEditShow;
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  .van-nav-bar__title {
    max-width: unset; // 把原来设置的取消掉
  }

  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs {
    .van-tabs__wrap {
      height: 82px;
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
    }
    .van-tab {
      // 这个类名是通过 f12 得知每个标签都带有的类名
      min-width: 200px; // 设置不了宽度，一个父级带了flex布局，所以设置了最小宽度
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }

    .placeholder {
      flex-shrink: 0; // 0：不参与 flex 布局的范围
      width: 66px;
      height: 82px;
    }

    .humburger-btn {
      position: fixed;
      display: flex;
      justify-content: center;
      align-items: center;
      right: 0px;
      width: 66px;
      height: 86px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url("~@/assets/gradient-gray-line.png");
        background-size: contain;
      }
    }
  }
}
</style>
