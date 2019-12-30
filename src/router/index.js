import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 解决router push报错问题
const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

export const routes = [
  {
    path: '/login',
    name: 'login',
    component: require('../views/login/index.vue').default
  }
]

const router = new Router({
  routes: routes
})

export default router
