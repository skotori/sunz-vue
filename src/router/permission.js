import router from './index'
import store from '../store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach((to, from, next) => {
  NProgress.start()
  let cacheToken = window.localStorage.getItem('token')
  if (cacheToken) { // 缓存里有token，说明已经登录
    if (to.path === '/login') { // 已经登录的不准跳转登录页面
      next('/')
    } else {
      let cacheMenu = JSON.parse(window.localStorage.getItem('menu'))
      let storeMenu = store.state.menu.menu
      if (cacheMenu && storeMenu) { // 缓存和vuex里都有routes，放行
        if (to.name === 'notFound') {
          next()
        } else {
          let tab = {
            title: to.meta.chineseName,
            name: to.name
          }
          store.dispatch('addTab', tab).then(() => { // 添加标签页
            NProgress.done()
            next()
          })
        }
      } else if (!cacheMenu && !storeMenu) { // 缓存和vuex里都没有routes，先请求后端拿到目录，然后再添加路由
        store.dispatch('getMenu').then(menu => {
          let routes = generateRoutes(menu)
          router.addRoutes(routes)
          next({ ...to, replace: true })
        })
      } else if (cacheMenu && !storeMenu) { // 缓存里有routes，vuex里没有routes，说明页面刷新了，重新添加一次路由
        let routes = generateRoutes(store.getters.getMenu)
        router.addRoutes(routes)
        next({ ...to, replace: true })
      }
    }
  } else { // 缓存里没有token，说明没有登录
    if (to.path === '/login') { // 登录路由放行
      next()
    } else { // 其他路由跳转到登录页面
      next('/login')
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

/**
 * 生成动态路由
 * @param {Array} menu menu树
 */
function generateRoutes (menu) {
  let menus = []
  menu.forEach(item => {
    if (item.children) {
      menus = menus.concat(findChildren(item.children))
    } else {
      menus.push(item)
    }
  })
  let routes = []
  menus.forEach(item => {
    let route = {
      id: item.id,
      path: item.path,
      name: item.code,
      component: undefined,
      icon: item.icon,
      meta: {
        chineseName: item.name
      }
    }
    if (item.component) {
      route.component = require('../views' + item.component + '.vue').default
    }
    routes.push(route)
  })
  routes = [{
    path: '/',
    name: 'layout',
    redirect: '/dashboard',
    component: require('../views/layout/index.vue').default,
    children: routes
  }, {
    path: '*',
    name: 'notFound',
    component: require('../views/errorPage/notFound/index.vue').default
  }]
  return routes
}

/**
 * 递归查找menu树的子集
 * @param {Array} menu menu树
 */
function findChildren (menu) {
  let routes = []
  menu.forEach(item => {
    if (item.children) {
      routes.concat(findChildren(item.children))
    } else {
      routes.push(item)
    }
  })
  return routes
}
