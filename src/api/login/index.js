import axios from '../../util/axios'

export function login (user) {
  return axios({
    url: '/auth',
    method: 'post',
    data: user
  })
}

export function getUser () {
  return axios({
    url: '/sysUser/userInfo',
    method: 'get'
  })
}

export function getMenu () {
  return axios({
    url: '/sysPower/menuTreeList',
    method: 'get'
  })
}
