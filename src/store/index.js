import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import users from './modules/user'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    users
  },
  getters
})

export default store
