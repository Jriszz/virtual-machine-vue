import { getRoleList, addRole, getRoleDetail, editRole, deleteRole, getRoleEnumList, getRoleMemberList, addUserToRole, removeUserfromRole, getRoleResourceList, addResourceToRole, removeResourcefromRole } from '@/api/roles'

const roles = {
  state: {
    // 选中角色
    selectRole: '',
    // 角色列表
    roleList: [],
    // 角色枚举
    roleEnum: [],
    // 角色详情、修改、新建页
    roleFormVisable: false,
    roleFormType: 'info',
    // 角色成员维护页
    roleMemberFormVisable: false,
    // 角色资源维护页
    roleResourceFormVisable: false
  },

  mutations: {
    SET_ROLE_LIST: (state, roleList) => {
      state.roleList = roleList
    },
    SET_ROLE_ENUM_LIST: (state, roleEnum) => {
      state.roleEnum = roleEnum
    },
    OPEN_ROLE_FORM: (state, payload) => {
      state.selectRole = payload.role
      state.roleFormType = payload.type
      state.roleFormVisable = true
    },
    CLOSE_ROLE_FORM: (state) => {
      state.roleFormVisable = false
    },
    OPEN_ROLE_MEMBER_FORM: (state, payload) => {
      state.roleMemberFormVisable = true
      state.selectRole = payload.role
    },
    CLOSE_ROLE_MEMBER_FORM: (state) => {
      state.roleMemberFormVisable = false
    },
    OPEN_ROLE_RESOURCE_FORM: (state, payload) => {
      state.roleResourceFormVisable = true
      state.selectRole = payload.role
    },
    CLOSE_ROLE_RESOURCE_FORM: (state) => {
      state.roleResourceFormVisable = false
    }
  },

  actions: {
    // 获取角色列表
    GetRoleList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getRoleList(params).then(response => {
          if (response.error_code === 0) {
            commit('SET_ROLE_LIST', response.data.roles)
          } else {
            reject('获取角色列表失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 添加角色
    AddRole({ commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        addRole(data).then(response => {
          if (response.error_code === 0) {
            commit('CLOSE_ROLE_FORM')
            dispatch('GetRoleList')
          } else {
            reject('添加角色失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取角色列表
    GetRoleDetail({ commit }, role_id) {
      return new Promise((resolve, reject) => {
        getRoleDetail(role_id).then(response => {
          if (response.error_code !== 0) {
            reject('获取角色详情失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 修改角色
    EditRole({ state, commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        editRole(data.id, data).then(response => {
          if (response.error_code === 0) {
            commit('CLOSE_ROLE_FORM')
            dispatch('GetRoleList')
          } else {
            reject('修改角色失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 删除角色
    DeleteRole({ commit, dispatch }, role_id) {
      return new Promise((resolve, reject) => {
        deleteRole(role_id).then(response => {
          if (response.error_code === 0) {
            dispatch('GetRoleList')
          } else {
            reject('删除角色失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取角色列表
    GetRoleEnumList({ commit }) {
      return new Promise((resolve, reject) => {
        getRoleEnumList().then(response => {
          if (response.error_code === 0) {
            commit('SET_ROLE_ENUM_LIST', response.data)
          } else {
            reject('获取角色枚举列表失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取角色成员列表
    GetRoleMemberList({ commit }, role_id) {
      console.log(role_id)
      return new Promise((resolve, reject) => {
        getRoleMemberList(role_id).then(response => {
          if (response.error_code !== 0) {
            reject('获取角色成员列表失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 将用户加入到角色中
    AddUserToRole({ commit, dispatch }, { user_id, role_id }) {
      return new Promise((resolve, reject) => {
        addUserToRole(user_id, role_id).then(response => {
          if (response.error_code !== 0) {
            reject(response.msg)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 将用户从角色中移除
    RemoveUserfromRole({ commit }, { user_id, role_id }) {
      return new Promise((resolve, reject) => {
        removeUserfromRole(user_id, role_id).then(response => {
          if (response.error_code !== 0) {
            reject(response.msg)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取角色资源列表
    GetRoleResourceList({ commit }, role_id) {
      return new Promise((resolve, reject) => {
        getRoleResourceList(role_id).then(response => {
          if (response.error_code !== 0) {
            reject('获取角色资源列表失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 将资源加入到角色中
    AddResourceToRole({ commit, dispatch }, { role_id, resource_id }) {
      return new Promise((resolve, reject) => {
        addResourceToRole(role_id, resource_id).then(response => {
          if (response.error_code !== 0) {
            reject(response.msg)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 将资源从角色中移除
    RemoveResourcefromRole({ commit }, { role_id, resource_id }) {
      return new Promise((resolve, reject) => {
        removeResourcefromRole(role_id, resource_id).then(response => {
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

export default roles
