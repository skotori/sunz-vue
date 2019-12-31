import { getUser } from '../api/login'

const user = {
  state: {
    user: undefined
  },
  getters: {
    getUser (state) {
      if (!state.user) {
        state.user = JSON.parse(window.sessionStorage.getItem('user'))
      }
      return state.user
    }
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      window.sessionStorage.setItem('user', JSON.stringify(user))
    },
    removeUser (state) {
      state.user = undefined
      window.sessionStorage.removeItem('user')
    }
  },
  actions: {
    getUser (context) {
      return new Promise(resolve => {
        getUser().then(res => {
          if (res.data) {
            context.commit('setUser', res.data)
            resolve()
          }
        })
      })
    }
  }
}

export default user
