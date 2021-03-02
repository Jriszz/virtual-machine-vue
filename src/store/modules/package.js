import { getParamEnum, getPackageList, addPackage, getPackageDetail, removePackage, getServiceList, switchServiceStatus } from '@/api/packages.js'

const packages = {
  state: {
    // 刷新列表页
    refresh: false,
    // 刷新服务列表
    refreshService: false,
    // 任务列表
    packageList: [],
    // 任务详情、修改、新建页
    packageFormVisable: false,
    packageFormType: 'info',
    // 服务列表
    serviceList: []
  },

  mutations: {
    SET_PACKAGE_LIST: (state, packageList) => {
      state.packageList = packageList
    },
    TRIGGER_REFRESH: (state) => {
      state.refresh = true
    },
    FINISH_REFRESH: (state) => {
      state.refresh = false
    },
    TRIGGER_SERVICE_REFRESH: (state) => {
      state.refreshService = true
    },
    FINISH_SERVICE_REFRESH: (state) => {
      state.refreshService = false
    },
    SET_SERVICE_LIST: (state, serviceList) => {
      state.serviceList = serviceList
    }
  },

  actions: {
    async GetParamEnum({ commit }, params) {
      const res = await getParamEnum(params)
      return res
    },

    async GetPackageList({ commit }) {
      const res = await getPackageList()
      if (res.error_code === 0) {
        commit('SET_PACKAGE_LIST', res.data)
      } else {
        console.log(res)
      }
      return res
    },

    async AddPackage({ commit, dispatch }, data) {
      const res = await addPackage(data)
      if (res.error_code !== 0) {
        console.log(res)
      }
      return res
    },

    async RemovePackage({ commit, dispatch }, key) {
      const res = await removePackage(key)
      if (res.error_code !== 0) {
        console.log(res)
      }
      return res
    },

    async GetPackageDetail({ commit, dispatch }, key) {
      const res = await getPackageDetail(key)
      if (res.error_code !== 0) {
        console.log(res)
      }
      return res
    },

    async GetServiceList({ commit }) {
      const res = await getServiceList()
      if (res.error_code === 0) {
        commit('SET_SERVICE_LIST', res.data)
      } else {
        console.log(res)
      }
      return res
    },

    async SwitchServiceStatus({ commit }, data) {
      return await switchServiceStatus(data)
    }
  }
}

export default packages
