// 请求模块
import axios from 'axios'
import store from '@/store'
// import JSONBig from 'json-bigint' // 这个包是来处理超出JavaScript 范围的数字

// JSONBig.parse()  把JSON 格式的字符串转为 JavaScript 对象（返回值是一个对象，需要把属性拿出来并且转成字符串）
// JSONBig.stringify()  把 JavaScript 对象转为 JSON 格式的字符串

// 使用 axios 的 create 方法创造的请求对象，用 request 来接收
const request = axios.create({
  // 接口的基准地址
  baseURL: 'http://toutiao.itheima.net',

  // 自定义后端返回的原始数据
  // data: 后端返回的原始数据，说白了就是 JSON 格式的字符串
  // transformResponse: [function (data) {
  //     // axios 默认会在内部这样来处理后端返回的数据
  //     try {
  //         return JSONBig.parse(data)
  //     } catch (err) {
  //         return data
  //     }
  // }]

})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 请求发起时会经过这里
  // config:本次请求的请求配置对象
  const { user } = store.state // 解构，把user 从容器中拿出来
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 注意：这里必须要返回 config 配置对象，否则请求会停在这里出不去
  return config
}, function (error) {
  // 如果请求出错了（还没有发出去）会进入这里
  return Promise.reject(error)
})

// 响应拦截器

// 导出
export default request
