import { getSystemList, addSystem, getSystemDetail, editSystem, deleteSystem, enableSystem } from '@/api/systems'

const systems = {
  state: {
    // 选中用户
    selectSystem: '',
    // 用户列表
    systemList: [],
    // 用户详情、修改、新建页
    systemFormVisable: false,
    systemFormType: 'info'
  },

  mutations: {
    SET_SYSTEM_LIST: (state, systemList) => {
      state.systemList = systemList
    },
    OPEN_SYSTEM_FORM: (state, payload) => {
      state.selectSystem = payload.system
      state.systemFormType = payload.type
      state.systemFormVisable = true
    },
    CLOSE_SYSTEM_FORM: (state) => {
      state.systemFormVisable = false
    }
  },

  actions: {
    // 获取用户列表
    GetSystemList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getSystemList(params).then(response => {
          if (response.error_code === 0) {
            commit('SET_SYSTEM_LIST', response.data.systems)
          } else {
            reject('获取用户列表失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 添加用户
    AddSystem({ commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        addSystem(data).then(response => {
          if (response.error_code === 0) {
            commit('CLOSE_SYSTEM_FORM')
            dispatch('GetSystemList')
          } else {
            reject('添加用户失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户列表
    GetSystemDetail({ commit }, system_id) {
      return new Promise((resolve, reject) => {
        getSystemDetail(system_id).then(response => {
          if (response.error_code !== 0) {
            reject('获取用户详情失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 修改用户
    EditSystem({ state, commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        editSystem(data.id, data).then(response => {
          if (response.error_code === 0) {
            commit('CLOSE_SYSTEM_FORM')
            dispatch('GetSystemList')
          } else {
            reject('修改用户失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 禁用系统
    DeleteSystem({ commit, dispatch }, system_id) {
      return new Promise((resolve, reject) => {
        deleteSystem(system_id).then(response => {
          if (response.error_code === 0) {
            dispatch('GetSystemList')
          } else {
            reject('禁用站点失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 禁用系统
    EnableSystem({ commit, dispatch }, system_id) {
      return new Promise((resolve, reject) => {
        enableSystem(system_id).then(response => {
          if (response.error_code === 0) {
            dispatch('GetSystemList')
          } else {
            reject('启用站点失败')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default systems
