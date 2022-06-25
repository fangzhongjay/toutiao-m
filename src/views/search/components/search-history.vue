<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories')">全部删除</span>
        &nbsp;
        <span @click="isDeleteShow =  false">完成</span>
      </div>

      <van-icon @click="isDeleteShow =  true" v-else name="delete"/>
    </van-cell>

    <van-cell
      @click="onSearchItemClick(item,index)"
      v-for="(item, index) in searchHistories"
      :key="index"
      :title="item"
    >
      <van-icon v-show="isDeleteShow" name="close"/>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "SearchHistory",
  props: {
    // props 里的数据
    // 普通数据：例如，数字、字符串、布尔值，绝对不能修改，即使改了也不会传导给父组件
    // 引用数据类型：例如，数组、对象，这些可以修改，例如：[].push , 但是不能重新赋值， xxx = []
    searchHistoriess: {
      type: Array,
      required: false
    }
  },
  data () {
    return {
      isDeleteShow: false, // 控制删除显示状态
      searchHistories: this.searchHistoriess
    };
  },
  computed: {},
  watch: {},
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 删除状态，删除历史记录数据
        this.searchHistories.splice(index, 1);
      } else {
        // 非删除状态，直接进入搜索
        this.$emit("search", item);
      }
    }
  },
  created () {},
  mounted () {}
};
</script>

<style lang='less' scoped>
</style>
