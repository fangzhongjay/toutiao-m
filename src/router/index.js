import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login') // 这种写法是路由懒加载
  },
  {
    path: '/',
    // name: 'layout',  // 如果父路由有默认子路由，那么他的 name 没有意义
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // 里面为空，为默认子路由，默认显示
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my')
      },
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search') // 这种写法是路由懒加载
  },
  {
    path: '/article/:articleId', // 动态路由，根据拿过来的ID 显示对应的文章
    name: 'article',
    component: () => import('@/views/article'),
    props: true // 开启 props 传参，说白了就是把路由参数映射到组件的props 数据中
  },
  {
    path: '/user/profile', // 动态路由，根据拿过来的ID 显示对应的文章
    name: 'user-profile',
    component: () => import('@/views/user-profile'),
  },
]

const router = new VueRouter({
  routes
})

export default router
