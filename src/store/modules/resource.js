import { getResourceList, addResource, getResourceDetail, editResource, deleteResource, getResourceRoleList, resourceJoinRole, resourceLeaveRole, getResourceEnum } from '@/api/resources'

const resources = {
  state: {
    // 刷新列表页
    refresh: false,
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
    },
    TRIGGER_REFRESH: (state) => {
      state.refresh = true
    },
    FINISH_REFRESH: (state) => {
      state.refresh = false
    }
  },

  actions: {
    // 获取资源列表
    async GetResourceList({ commit }, params) {
      const res = await getResourceList(params)
      if (res.error_code === 0) {
        commit('SET_RESOURCE_LIST', res.data.resources)
      }
      return res
    },

    // 获取资源枚举
    async GetResourceEnum({ commit }) {
      const res = await getResourceEnum()
      if (res.error_code === 0) {
        commit('SET_RESOURCE_ENUM', res.data)
      }
      return res
    },

    // 添加资源
    async AddResource({ commit, dispatch }, data) {
      const res = await addResource(data)
      if (res.error_code === 0) {
        commit('CLOSE_RESOURCE_FORM')
      }
      return res
    },

    // 获取资源列表
    async GetResourceDetail({ commit }, resource_id) {
      return await getResourceDetail(resource_id)
    },

    // 修改资源
    async EditResource({ state, commit, dispatch }, data) {
      const res = await editResource(data.id, data)
      if (res.error_code === 0) {
        commit('CLOSE_RESOURCE_FORM')
      }
      return res
    },

    // 删除资源
    async DeleteResource({ commit, dispatch }, resource_id) {
      return await deleteResource(resource_id)
    },

    // 获取资源角色列表
    async GetResourceRoleList({ commit }, resource_id) {
      return await getResourceRoleList(resource_id)
    },

    // 资源加入角色
    async ResourceJoinRole({ commit, dispatch }, { resource_id, role_id }) {
      return await resourceJoinRole(resource_id, role_id)
    },

    // 资源离开角色
    async ResourceLeaveRole({ commit }, { resource_id, role_id }) {
      return await resourceLeaveRole(resource_id, role_id)
    }
  }
}

export default resources
