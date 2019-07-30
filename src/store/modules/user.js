import { openSignup, signup, addUser, editUser, login, logout, getSessionInfo, getUserList, modifyUserPassword, resetUserPassword, getUserAccessLogList, getUserRoleList, userJoinRole, userLeaveRole, getUserEnumList } from '@/api/users'
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
    // 用户枚举列表
    userEnum: [],
    // 修改密码页
    modifyPasswordFormVisable: false,
    // 重置密码页
    resetPasswordFormVisable: false,
    // 用户详情、修改、新建页
    userFormVisable: false,
    userFormType: 'info',
    // 用户注册页
    userSignUpVisable: false,
    // 服务端是否开放用户注册
    isOpenSignUp: false,
    // 用户角色维护页
    userRoleFormVisable: false,
    // 当前选择用户
    currentSelectUser: ''
  },

  mutations: {
    SET_SIGNUP_STATUS: (state, isOpen) => {
      state.isOpenSignUp = isOpen
    },
    SET_USER_LIST: (state, userList) => {
      state.userList = userList
    },
    SET_USER_ENUM_LIST: (state, userEnum) => {
      state.userEnum = userEnum
    },
    SET_SESSION_USER: (state, user) => {
      state.sessionUser = user
    },
    CLEAN_SESSION_USER: (state) => {
      state.sessionUser = {}
    },
    OPEN_SIGNUP_FORM: (state) => {
      state.userSignUpVisable = true
    },
    CLOSE_SIGNUP_FORM: (state) => {
      state.userSignUpVisable = false
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
    },
    OPEN_MODIFY_PASSWORD_FORM: (state) => {
      state.modifyPasswordFormVisable = true
    },
    CLOSE_MODIFY_PASSWORD_FORM: (state) => {
      state.modifyPasswordFormVisable = false
    },
    OPEN_USER_ROLE_FORM: (state, user) => {
      state.userRoleFormVisable = true
      state.currentSelectUser = user
    },
    CLOSE_USER_ROLE_FORM: (state) => {
      state.userRoleFormVisable = false
    }
  },

  actions: {
    // 查询是否开放注册
    OpenSignup({ commit }) {
      return new Promise((resolve, reject) => {
        openSignup().then(response => {
          commit('SET_SIGNUP_STATUS', response.data.signup)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 注册
    Signup({ commit }, loginForm) {
      return new Promise((resolve, reject) => {
        signup(loginForm).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登录
    Login({ commit }, loginForm) {
      return new Promise((resolve, reject) => {
        login(loginForm).then(response => {
          resolve(response)
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
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ dispatch }) {
      console.log('前端后端一起退出')
      return new Promise((resolve, reject) => {
        logout().then(response => {
          dispatch('FedLogOut')
          resolve(response)
          window.location.reload()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      console.log('前端退出')
      return new Promise(resolve => {
        commit('CLEAN_SESSION_USER')
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

    // 获取用户列表
    GetUserEnumList({ commit }) {
      return new Promise((resolve, reject) => {
        getUserEnumList().then(response => {
          if (response.error_code === 0) {
            commit('SET_USER_ENUM_LIST', response.data)
          } else {
            reject('获取用户枚举列表失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 修改用户密码
    ModifyUserPassword({ commit }, params) {
      return new Promise((resolve, reject) => {
        modifyUserPassword(params).then(response => {
          if (response.error_code === 0) {
            commit('CLOSE_MODIFY_PASSWORD_FORM')
          } else {
            reject('修改用户密码失败')
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

    // 修改用户
    EditUser({ state, commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        editUser(data.id, data).then(response => {
          if (response.error_code === 0) {
            commit('CLOSE_USER_FORM')
            if (state.sessionUser.super_admin === 1) {
              dispatch('GetUserList')
            }
            if (data.id === state.sessionUser.id) {
              dispatch('GetSessionInfo')
            }
          } else {
            reject('修改用户失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户列表
    GetUserAccessLogList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getUserAccessLogList(params).then(response => {
          if (response.error_code !== 0) {
            reject('获取用户列表失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户角色列表
    GetUserRoleList({ commit }, user_id) {
      return new Promise((resolve, reject) => {
        getUserRoleList(user_id).then(response => {
          if (response.error_code !== 0) {
            reject('获取用户角色列表失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 用户加入角色
    UserJoinRole({ commit, dispatch }, { user_id, role_id }) {
      return new Promise((resolve, reject) => {
        userJoinRole(user_id, role_id).then(response => {
          if (response.error_code !== 0) {
            reject(response.msg)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 用户离开角色
    UserLeaveRole({ commit }, { user_id, role_id }) {
      return new Promise((resolve, reject) => {
        userLeaveRole(user_id, role_id).then(response => {
          if (response.error_code !== 0) {
            reject(response.msg)
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
