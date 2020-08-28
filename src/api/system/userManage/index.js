import axios from '../../../util/axios'

export function pageList (pageNum, pageSize, user) {
  return axios({
    url: '/sysUser/pageList?pageNum=' + pageNum + '&pageSize=' + pageSize,
    method: 'post',
    data: user
  })
}

export function userInfoById (id) {
  return axios({
    url: '/sysUser/userInfoById?id=' + id,
    method: 'get'
  })
}

export function deptList () {
  return axios({
    url: '/sysDept/queryList',
    method: 'post',
    data: {}
  })
}

export function roleList () {
  return axios({
    url: '/sysRole/queryList',
    method: 'post',
    data: {}
  })
}

export function accountCheck (account) {
  return axios({
    url: '/sysUser/accountCheck?account=' + account,
    method: 'get'
  })
}

export function add (user) {
  return axios({
    url: '/sysUser/add',
    method: 'post',
    data: user
  })
}

export function update (user) {
  return axios({
    url: '/sysUser/update',
    method: 'post',
    data: user
  })
}

export function deleteById (id) {
  return axios({
    url: '/sysUser/delete?id=' + id,
    method: 'get'
  })
}
