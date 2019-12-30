import Vue from 'vue'
import Vuex from 'vuex'
import token from './token'
import user from './user'
import menu from './menu'
import tabs from './tabs'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    token,
    user,
    menu,
    tabs
  }
})
