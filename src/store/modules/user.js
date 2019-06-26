import { addUser, editUser, login, logout, getSessionInfo, getUserList, resetUserPassword } from '@/api/users'
import { removeToken } from '@/utils/auth'

const users = {
  state: {
    roles: [],
    // 会话用户
    sessionUser: '',
    // 选中用户
    selectUser: '',
    // 用户列表
    userList: [],
    // 重置密码页
    resetPasswordFormVisable: false,
    // 用户详情、修改、新建页
    userFormVisable: false,
    userFormType: 'info'
  },

  mutations: {
    SET_USER_LIST: (state, userList) => {
      state.userList = userList
    },
    SET_SESSION_USER: (state, user) => {
      state.sessionUser = user
    },
    OPEN_USER_FORM: (state, payload) => {
      state.selectUser = payload.user
      state.userFormType = payload.type
      state.userFormVisable = true
    },
    CLOSE_USER_FORM: (state) => {
      state.userFormVisable = false
    },
    OPEN_RESET_PASSWORD_FORM: (state, user) => {
      state.selectUser = user
      state.resetPasswordFormVisable = true
    },
    CLOSE_RESET_PASSWORD_FORM: (state) => {
      state.resetPasswordFormVisable = false
    }
  },

  actions: {
    // 登录
    Login({ commit }, loginForm) {
      return new Promise((resolve, reject) => {
        login(loginForm).then(response => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取会话信息
    GetSessionInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getSessionInfo().then(response => {
          const data = response.data
          commit('SET_SESSION_USER', data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        logout().then(response => {
          dispatch('FedLogOut')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        removeToken()
        resolve()
      })
    },

    // 获取用户列表
    GetUserList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getUserList(params).then(response => {
          if (response.error_code === 0) {
            commit('SET_USER_LIST', response.data.users)
          } else {
            reject('获取用户列表失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 重置用户密码
    ResetUserPassword({ commit }, params) {
      return new Promise((resolve, reject) => {
        resetUserPassword(params.id, params).then(response => {
          if (response.error_code === 0) {
            commit('CLOSE_RESET_PASSWORD_FORM')
          } else {
            reject('重置用户密码失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 添加用户密码
    AddUser({ commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        addUser(data).then(response => {
          if (response.error_code === 0) {
            commit('CLOSE_USER_FORM')
            dispatch('GetUserList')
          } else {
            reject('添加用户失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 修改用户密码
    EditUser({ commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        editUser(data.id, data).then(response => {
          if (response.error_code === 0) {
            commit('CLOSE_USER_FORM')
            dispatch('GetUserList')
          } else {
            reject('修改用户失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default users
