import { getReortByFlow, getReortByDate, getReortByApp, getReortByVersion, getReortByOS } from '@/api/report'

const reports = {
  state: {
    // 报表数据
    reportByFlow: [],
    reportByDate: null,
    reportByApp: [],
    reportByVersion: [],
    reportByOS: []
  },

  mutations: {
    // 设置报表数据
    SET_FLOW_REPORT: (state, reportByFlow) => {
      state.reportByFlow = {
        columns: ['flow_id', 'flow_name', 'task_total', 'task_success', 'success_rate'],
        rows: reportByFlow
      }
    },
    SET_DATE_REPORT: (state, reportByDate) => {
      state.reportByDate = {
        columns: ['run_date', 'task_total', 'task_success', 'success_rate'],
        rows: reportByDate
      }
    },
    SET_APP_REPORT: (state, reportByApp) => {
      state.reportByApp = reportByApp
    },
    SET_VERSION_REPORT: (state, reportByVersion) => {
      state.reportByVersion = {
        columns: ['package', 'version', 'task_total', 'task_success', 'success_rate'],
        rows: reportByVersion
      }
    },
    SET_OS_REPORT: (state, reportByOS) => {
      state.reportByOS = {
        columns: ['os_name', 'task_total', 'task_success', 'success_rate'],
        rows: reportByOS
      }
    }
  },

  actions: {
    // 获取所有报表数据
    getAllReport({ dispatch }, queryCondition) {
      dispatch('GetReportByFlow', queryCondition)
      dispatch('GetReortByDate', queryCondition)
      dispatch('GetReortByApp', queryCondition)
      dispatch('GetReortByVersion', queryCondition)
      dispatch('GetReortByOS', queryCondition)
    },
    // 统计报表——按流程
    async GetReportByFlow({ commit }, queryCondition) {
      const res = await getReortByFlow(queryCondition)
      if (res.error_code === 0) {
        commit('SET_FLOW_REPORT', res.data)
      }
      return res
    },

    // 统计报表——按日期，需要特殊处理，非连续的的日期需要补全，相应值全为0
    async GetReortByDate({ commit }, queryCondition) {
      const res = await getReortByDate(queryCondition)
      if (res.error_code === 0) {
        const results = []
        // 用于查漏补坑
        let dateVar = null
        for (let i = 0; i < res.data.length; i++) {
          // 当前迭代中的日期
          const itemDate = new Date(res.data[i].run_date.replace(/-/, '/'))

          // 首次迭代时直接赋值
          if (!dateVar) {
            dateVar = new Date(itemDate.valueOf())
          }

          // 后续判断日期是否连续，连续时直接追加到数据中，不连续时补齐中间的缺失日期
          if (itemDate - dateVar === 0) {
            results.push(res.data[i])
            dateVar.setDate(dateVar.getDate() + 1)
          } else {
            while (itemDate - dateVar !== 0) {
              results.push({
                'run_date': dateVar.toLocaleDateString().replace(/\//g, '-'),
                'task_total': 0,
                'task_success': 0,
                'success_rate': 0
              })
              dateVar = new Date(dateVar.setDate(dateVar.getDate() + 1))
            }
            results.push(res.data[i])
            dateVar.setDate(dateVar.getDate() + 1)
          }
        }
        commit('SET_DATE_REPORT', results)
      }
      return res
    },

    // 统计报表——按应用
    async GetReortByApp({ commit }, queryCondition) {
      const res = await getReortByApp(queryCondition)
      if (res.error_code === 0) {
        commit('SET_APP_REPORT', res.data)
      }
      return res
    },

    // 统计报表——按版本
    async GetReortByVersion({ commit }, queryCondition) {
      const res = await getReortByVersion(queryCondition)
      if (res.error_code === 0) {
        commit('SET_VERSION_REPORT', res.data)
      }
      return res
    },

    // 统计报表——按操作系统
    async GetReortByOS({ commit }, queryCondition) {
      const res = await getReortByOS(queryCondition)
      if (res.error_code === 0) {
        commit('SET_OS_REPORT', res.data)
      }
      return res
    }
  }
}

export default reports
