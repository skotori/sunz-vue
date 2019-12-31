import { login } from '../api/login'

const token = {
  state: {
    token: undefined
  },
  getters: {
    getToken (state) {
      if (!state.token) {
        state.token = window.localStorage.getItem('token')
      }
      return state.token
    }
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      window.localStorage.setItem('token', token)
    },
    removeToken (state) {
      state.token = undefined
      window.localStorage.removeItem('token')
    }
  },
  actions: {
    login (context, user) {
      return new Promise(resolve => {
        login(user).then(res => {
          if (res.data) {
            context.commit('setToken', res.data.token)
            context.commit('setUser', res.data.user)
            resolve()
          }
        })
      })
    },
    logout (context) {
      return new Promise(resolve => {
        context.commit('removeToken')
        context.commit('removeUser')
        context.commit('removeMenu')
        context.commit('removeTabs')
        resolve()
      })
    }
  }
}

export default token
