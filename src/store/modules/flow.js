import { getFlowList, getFlowVersionList, getFlowTaskSummaryList } from '@/api/flows'

const flows = {
  state: {
    // 刷新列表页
    refresh: false,
    // 选中流程
    selectFlow: '',
    // 流程列表
    flowList: []
  },

  mutations: {
    SET_FLOW_LIST: (state, flowList) => {
      state.flowList = flowList
    },
    TRIGGER_REFRESH: (state) => {
      state.refresh = true
    },
    FINISH_REFRESH: (state) => {
      state.refresh = false
    }
  },

  actions: {
    // 所有流程最新版本列表
    async GetFlowList({ commit }) {
      const res = await getFlowList({ detail: true })
      if (res.error_code === 0) {
        commit('SET_FLOW_LIST', res.data)
      }
      return res
    },

    // 具体某一流程的版本列表
    async GetFlowVersionList({ commit }, flow_id) {
      return await getFlowVersionList({ flow_id: flow_id })
    },

    // 流程及任务概要列表
    async GetFlowTaskSummaryList({ commit }) {
      const res = await getFlowTaskSummaryList()
      if (res.error_code === 0) {
        commit('SET_FLOW_LIST', res.data)
      }
      return res
    }
  }
}

export default flows
