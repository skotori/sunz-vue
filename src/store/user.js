const user = {
  state: {
    user: undefined
  },
  getters: {
    getUser (state) {
      if (!state.user) {
        state.user = JSON.parse(window.localStorage.getItem('user'))
      }
      return state.user
    }
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      window.localStorage.setItem('user', JSON.stringify(user))
    },
    removeUser (state) {
      state.user = undefined
      window.localStorage.removeItem('user')
    }
  },
  actions: {
  }
}

export default user
