import { getRoleList, addRole, getRoleDetail, editRole, deleteRole } from '@/api/roles'

const roles = {
  state: {
    // 选中角色
    selectRole: '',
    // 角色列表
    roleList: [],
    // 角色详情、修改、新建页
    roleFormVisable: false,
    roleFormType: 'info'
  },

  mutations: {
    SET_ROLE_LIST: (state, roleList) => {
      state.roleList = roleList
    },
    OPEN_ROLE_FORM: (state, payload) => {
      state.selectRole = payload.role
      state.roleFormType = payload.type
      state.roleFormVisable = true
    },
    CLOSE_ROLE_FORM: (state) => {
      state.roleFormVisable = false
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
    }
  }
}

export default roles
