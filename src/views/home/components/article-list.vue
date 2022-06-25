<template>
  <div class="article-list">
    <!-- 用下拉刷新组件把内容包含在里面 -->
    <van-pull-refresh
      v-model="isreFreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item v-for="(article, index) in list" :key="index" :article="article"/>
        <!-- <van-cell v-for="(article, index) in list" :key="index" :title="article.title"/> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "@/api/article";
import ArticleItem from "@/components/article-item";

export default {
  name: "ArticleList",
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中的 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isreFreshLoading: false, // 控制下拉刷新的 loading 状态
      refreshSuccessText: "刷新成功" // 下拉刷新成功提示文本
    };
  },
  computed: {},
  watch: {},
  methods: {
    async onLoad () {
      try {
        // 1、请求获取数据(需要传参数)
        const { data } = await getArticles({
          // 频道 id,
          channel_id: this.channel.id,
          // timestamp 时间戳, 就是请求数据的页码，请求第一页的数据：当前最新时间戳
          timestamp: this.timestamp || Date.now()
          //   with_top: 1
        });
        // console.log(data);

        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse("dadjdduufu");
        // }

        // 2、把请求结果数据放到 list 数组中
        const { results } = data.data;
        // 因为是要把数据添加上去，... 是数组的展开运算符，会把数组一个个拿出来
        this.list.push(...results);

        // 3、本次数据加载结束之后要把加载状态设置为结束
        this.loading = false;

        // 4、判断数据全部加载完成
        if (results.length) {
          // 更新获取下一页数据的事件戳
          this.timestamp = data.data.pre_timestamp;
        } else {
          // 没有数据了，将 finished 设置为 true ,不再 load 加载更多
          this.finished = true;
        }
      } catch (err) {
        // 展示错误提示状态
        this.error = true;
        // 请求失败了，loading 也需要关闭
        this.loading = false;
      }
    },

    // 当下拉刷新的时候回触发调用该函数
    async onRefresh () {
      try {
        // 1、请求获取数据
        const { data } = await getArticles({
          // 频道 id,
          channel_id: this.channel.id,
          // 下拉刷新，，每次请求获取最新数据，所以传递当前最新的时间戳
          timestamp: Date.now()
          //   with_top: 1
        });
        // 2、将数据追加到列表的顶部
        const { results } = data.data;
        this.list.unshift(...results);
        // 3、关闭下拉刷新的 loading 状态
        this.isreFreshLoading = false;

        // 更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`;
      } catch (err) {
        this.isreFreshLoading = false;
        this.refreshSuccessText = "刷新失败";
      }
    }

    // onLoad() {
    //   // 初始化或滚动到底部的时候回触发调用 onLoad
    //   // 1、请求获取数据
    //   // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    //   setTimeout(() => {
    //     // 2、把请求结果数据放到 list 数组中
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1);
    //     }

    //     // 3、本次数据加载结束之后要把加载状态设置为结束
    //     // loading 关闭以后才能触发下一次的加载更多
    //     this.loading = false;

    //     // 判断数据全部加载完成
    //     if (this.list.length >= 40) {
    //       // 把 finished 设置为 true ，之后不再触发加载更多
    //       this.finished = true;
    //     }
    //   }, 1000);
    // }
  },
  created () {},
  mounted () {}
};
</script>

<style lang='less' scoped>
.article-list {
  // 百分比单位是相对于父元素,太麻烦了,所以使用视口单位
  height: 79vh;
  overflow-y: auto; // 超出指定高度，出现滚动条
}
</style>
