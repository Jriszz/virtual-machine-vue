import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import users from './modules/user'
import getters from './getters'
import permission from './modules/permission'
import systems from './modules/system'
import resources from './modules/resource'
import roles from './modules/role'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    users,
    permission,
    systems,
    resources,
    roles
  },
  getters
})

export default store
