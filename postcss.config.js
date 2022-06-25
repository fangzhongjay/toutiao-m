// postcss.config.js
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // rootValue 应该设置为你设计稿宽度的十分之一，但是建议设置成 37.5 ,因为 Vant 是基于 375 写的
      // 通过查询文档，得知rootValue可以是固定数字或函数，那么我们可以让其 vant 的样式就37.5 ，我们的样式就 75
      // rootValue: 37.5,
      rootValue ({ file }) {
        // 查询路径 file 中是否包含 vant ，如果路径包含 vant,则为 vant 样式
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },

      // 配置要转换的 css 属性，里面可以写要转换的标签名， * 表示所有
      propList: ['*'],

      // 配置不要转换的样式资源
      exclude: 'github-markdown'
    },
  },
};
