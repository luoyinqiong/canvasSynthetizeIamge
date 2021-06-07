import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'selectPhoto',
      component: () => import('@/pages/selectPhoto'),
      meta: {
        title: '选择定制手机壳类型', // 顶部文字
        leftArrow: false // 是否显示返回键
      }
    },
    // {
    //   path: '/',
    //   name: 'home',
    //   component: () => import('@/pages/home'),
    //   meta: {
    //     title: '选择定制手机壳类型', // 顶部文字
    //     leftArrow: false // 是否显示返回键
    //   }
    // },
    {
      path: '/selectModel',
      name: 'selectModel',
      component: () => import('@/pages/selectModel'),
      meta: {
        title: '选择机型', // 顶部文字
        leftArrow: true // 是否显示返回键
      }
    },
    {
      path: '/selectPhoto',
      name: 'selectPhoto',
      component: () => import('@/pages/selectPhoto'),
      meta: {
        title: '选择图片', // 顶部文字
        leftArrow: true // 是否显示返回键
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to, from)
  store.state.navBar.navTitle = to.meta.title || '加载中' // 顶部文案
  store.state.navBar.leftArrow = to.meta.leftArrow // 是否显示返回键
  next()
})

export default router
