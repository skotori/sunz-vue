import axios from 'axios'
import store from '../store'
import { Message } from 'element-ui'

const instance = axios.create({
  baseURL: 'http://localhost:8888',
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(config => {
  // 不是登录的请求全部加上authorization头
  if (config.url !== '/auth') {
    config.headers.Authorization = 'Bearer ' + store.getters.getToken
  }

  return config
}, error => {
  console.log(error)

  return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(response => {
  let res = response.data

  // 认证失败
  if (res.status === '70002') {
    store.dispatch('logout').then(() => {
      window.location.reload()
    })
  }

  // 没有成功的返回
  if (res.status !== '1') {
    Message({
      message: res.message,
      type: 'error',
      duration: 5 * 1000
    })
  }

  return res
}, error => {
  Message({
    message: error,
    type: 'error',
    duration: 5 * 1000
  })

  return Promise.reject(error)
})

export default instance
