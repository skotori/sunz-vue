import axios from '../../util/axios'

export function login (user) {
  return axios({
    url: '/auth',
    method: 'post',
    data: user
  })
}

export function getMenu () {
  return axios({
    url: '/sysPower/menuTree',
    method: 'get'
  })
}
