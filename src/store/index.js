import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import users from './modules/user'
import getters from './getters'
import permission from './modules/permission'
import systems from './modules/system'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    users,
    permission,
    systems
  },
  getters
})

export default store
