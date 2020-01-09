import { getMenu } from '../api/login'

const menu = {
  state: {
    menu: undefined
  },
  getters: {
    getMenu (state) {
      if (!state.menu) {
        state.menu = JSON.parse(window.sessionStorage.getItem('menu'))
      }
      return state.menu
    }
  },
  mutations: {
    setMenu (state, menu) {
      state.menu = menu
      window.sessionStorage.setItem('menu', JSON.stringify(menu))
    },
    removeMenu (state) {
      state.menu = undefined
      window.sessionStorage.removeItem('menu')
    }
  },
  actions: {
    getMenu (context) {
      return new Promise(resolve => {
        getMenu().then(res => {
          if (res) {
            context.commit('setMenu', res.data)
            resolve(res.data)
          }
        })
      })
    }
  }
}

export default menu
