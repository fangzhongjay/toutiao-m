<template>
  <div class="search-suggestion">
    <van-cell
      v-for="(text,index) in suggestions"
      :key="index"
      icon="search"
      @click="$emit('search',text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from "@/api/search";
// 下面是下载的lodash 包，引入debounce来优化防抖
import { debounce } from "lodash";
export default {
  name: "SearchSuggestion",
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    };
  },
  computed: {},
  watch: {
    searchText: {
      // 当 searchText 发生改变的时候就会调用 handler 函数，这个函数名是固定的
      //   handler(value) {
      //     this.loadSearchSuggestions(value);
      //   },

      // 下面是使用防抖优化后的写法
      // debounce 函数 （返回值是一个防抖之后的函数）
      // 参数1：一个函数
      // 参数2：延迟时间，单位是毫秒
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value);
      }, 200),

      immediate: true // 最初绑定值的时候也执行函数，则就需要用到immediate属性
    }
  },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q);
        this.suggestions = data.data.options;
      } catch (err) {
        this.$toast("数据获取失败，请稍后重试");
      }
    },
    highlight (text) {
      const highlighStr = `<span class="active">${this.searchText}</span>`;

      // 正则表达式 // 中间的内容都会仿作匹配字符来使用，而不是数据变量
      // 如果徐亚根据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数，参数1：匹配模式字符串，它会根据曾字符串创建正则对象
      // 2、参数2：匹配模式，要写到的字符串中
      const reg = new RegExp(this.searchText, "gi");
      return text.replace(reg, highlighStr);
    }
  },
  created () {},
  mounted () {}
};
</script>

<style lang='less' scoped>
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
