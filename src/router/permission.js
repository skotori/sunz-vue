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
      let cacheUser = JSON.parse(window.sessionStorage.getItem('user'))
      let cacheMenu = JSON.parse(window.sessionStorage.getItem('menu'))
      let storeMenu = store.state.menu.menu
      if (cacheUser && !cacheMenu && !storeMenu) { // 缓存里有user，但是没有menu，并且vuex里也没有menu，说明才登录，需要从后端获取目录，然后再添加路由
        store.dispatch('getMenu').then(menu => {
          let routes = generateRoutes(menu)
          router.addRoutes(routes)
          next({ ...to, replace: true })
        })
      } else if (cacheUser && cacheMenu && !storeMenu) { // 缓存里有user和menu，但是vuex里没有menu，说明页面刷新了，需要从缓存获取目录，然后再添加路由
        let routes = generateRoutes(store.getters.getMenu)
        router.addRoutes(routes)
        next({ ...to, replace: true })
      } else if (!cacheUser && !cacheMenu && !storeMenu) { // 缓存里没有user，也没有menu，并且vuex里也没有menu，说明页面关闭后重启了，需要从后端获取用户信息和目录，然后再添加路由
        store.dispatch('getUser').then(() => {
          store.dispatch('getMenu').then(menu => {
            let routes = generateRoutes(menu)
            router.addRoutes(routes)
            next({ ...to, replace: true })
          })
        })
      } else if (cacheUser && cacheMenu && storeMenu) { // 都在，正常放行
        if (to.name === 'notFound') { // 404页面不添加进标签页
          NProgress.done()
          next()
        } else { // 其他页面添加进标签页
          let tab = {
            title: to.meta.chineseName,
            name: to.path
          }
          store.dispatch('addTab', tab).then(() => { // 添加标签页
            NProgress.done()
            next()
          })
        }
      }
    }
  } else { // 缓存里没有token，说明没有登录
    if (to.path === '/login') { // 登录路由放行
      NProgress.done()
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
    routes.push({
      path: item.path,
      name: item.code,
      component: require('../views' + item.path + '/index.vue').default,
      meta: {
        chineseName: item.name
      }
    })
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
  let menus = []
  menu.forEach(item => {
    if (item.children) {
      menus.concat(findChildren(item.children))
    } else {
      menus.push(item)
    }
  })
  return menus
}
