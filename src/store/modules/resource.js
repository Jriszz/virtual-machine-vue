import { getResourceList, addResource, getResourceDetail, editResource, deleteResource, getResourceRoleList, resourceJoinRole, resourceLeaveRole, getResourceEnum } from '@/api/resources'

const resources = {
  state: {
    // 选中资源
    selectResource: '',
    // 资源列表
    resourceList: [],
    // 资源枚举
    resourceEnum: [],
    // 资源详情、修改、新建页
    resourceFormVisable: false,
    resourceFormType: 'info',
    // 资源角色页
    resourceRoleFormVisable: false
  },

  mutations: {
    SET_RESOURCE_LIST: (state, resourceList) => {
      state.resourceList = resourceList
    },
    SET_RESOURCE_ENUM: (state, resourceEnum) => {
      state.resourceEnum = resourceEnum
    },
    OPEN_RESOURCE_FORM: (state, payload) => {
      state.selectResource = payload.resource
      state.resourceFormType = payload.type
      state.resourceFormVisable = true
    },
    CLOSE_RESOURCE_FORM: (state) => {
      state.resourceFormVisable = false
    },
    OPEN_RESOURCE_ROLE_FORM: (state, resource) => {
      state.selectResource = resource
      state.resourceRoleFormVisable = true
    },
    CLOSE_RESOURCE_ROLE_FORM: (state) => {
      state.resourceRoleFormVisable = false
    }
  },

  actions: {
    // 获取资源列表
    GetResourceList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getResourceList(params).then(response => {
          if (response.error_code === 0) {
            commit('SET_RESOURCE_LIST', response.data.resources)
          } else {
            reject('获取资源列表失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取资源枚举
    GetResourceEnum({ commit }) {
      return new Promise((resolve, reject) => {
        getResourceEnum().then(response => {
          if (response.error_code !== 0) {
            reject('获取资源列表失败')
          } else {
            commit('SET_RESOURCE_ENUM', response.data)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 添加资源
    AddResource({ commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        addResource(data).then(response => {
          if (response.error_code === 0) {
            commit('CLOSE_RESOURCE_FORM')
            dispatch('GetResourceList')
          } else {
            reject('添加资源失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取资源列表
    GetResourceDetail({ commit }, resource_id) {
      return new Promise((resolve, reject) => {
        getResourceDetail(resource_id).then(response => {
          if (response.error_code !== 0) {
            reject('获取资源详情失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 修改资源
    EditResource({ state, commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        editResource(data.id, data).then(response => {
          if (response.error_code === 0) {
            commit('CLOSE_RESOURCE_FORM')
            dispatch('GetResourceList')
          } else {
            reject('修改资源失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 删除资源
    DeleteResource({ commit, dispatch }, resource_id) {
      return new Promise((resolve, reject) => {
        deleteResource(resource_id).then(response => {
          if (response.error_code === 0) {
            dispatch('GetResourceList')
          } else {
            reject('删除资源失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取资源角色列表
    GetResourceRoleList({ commit }, resource_id) {
      return new Promise((resolve, reject) => {
        getResourceRoleList(resource_id).then(response => {
          if (response.error_code !== 0) {
            reject('获取资源角色列表失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 资源加入角色
    ResourceJoinRole({ commit, dispatch }, { resource_id, role_id }) {
      return new Promise((resolve, reject) => {
        resourceJoinRole(resource_id, role_id).then(response => {
          if (response.error_code !== 0) {
            reject(response.msg)
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 资源离开角色
    ResourceLeaveRole({ commit }, { resource_id, role_id }) {
      return new Promise((resolve, reject) => {
        resourceLeaveRole(resource_id, role_id).then(response => {
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

export default resources
