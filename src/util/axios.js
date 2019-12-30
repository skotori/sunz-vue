import axios from 'axios'
import store from '../store'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: 'http://localhost:8888',
  timeout: 5000
})

// request拦截器
service.interceptors.request.use(config => {
  if (config.url !== '/auth') {
    config.headers.Authorization = 'Bearer ' + store.getters.getToken
  }
  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(response => {
  const res = response.data
  if (res.code !== 1) {
    Message({
      message: res.msg,
      type: 'error',
      duration: 5 * 1000
    })
  } else {
    return res
  }
}, error => {
  Message({
    message: error,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
})

export default service
