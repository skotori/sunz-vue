const tabs = {
  state: {
    tabs: []
  },
  getters: {
    getTabs (state) {
      if (!tabs.length) {
        state.tabs = JSON.parse(window.sessionStorage.getItem('tabs'))
      }
      return state.tabs
    }
  },
  mutations: {
    setTabs (state, tab) {
      state.tabs = tab
      window.sessionStorage.setItem('tabs', JSON.stringify(tab))
    },
    removeTabs (state) {
      state.tabs = []
      window.sessionStorage.removeItem('tabs')
    }
  },
  actions: {
    addTab (context, tab) {
      return new Promise(resolve => {
        let cacheTabs = JSON.parse(window.sessionStorage.getItem('tabs'))
        if (cacheTabs) {
          let flag = cacheTabs.find(item => item.name === tab.name)
          if (!flag) {
            cacheTabs.push(tab)
            context.commit('setTabs', cacheTabs)
          }
        } else {
          cacheTabs = [tab]
          context.commit('setTabs', cacheTabs)
        }
        resolve()
      })
    },
    removeTab (context, name) {
      return new Promise(resolve => {
        let cacheTabs = JSON.parse(window.sessionStorage.getItem('tabs'))
        let tabs = cacheTabs.filter(item => item.name !== name)
        context.commit('setTabs', tabs)
        resolve(tabs)
      })
    }
  }
}

export default tabs
