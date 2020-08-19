import { getTaskList, getTaskDetail, taskSync, taskLog } from '@/api/tasks'

const tasks = {
  state: {
    // 刷新列表页
    refresh: false,
    // 选中任务
    selectTask: '',
    // 任务列表
    taskList: [],
    // 任务详情、修改、新建页
    taskFormVisable: false,
    taskFormType: 'info'
  },

  mutations: {
    SET_TASK_LIST: (state, taskList) => {
      state.taskList = taskList
    },
    OPEN_TASK_FORM: (state, payload) => {
      state.selectTask = payload.task
      state.taskFormType = payload.type
      state.taskFormVisable = true
    },
    CLOSE_TASK_FORM: (state) => {
      state.taskFormVisable = false
    },
    TRIGGER_REFRESH: (state) => {
      state.refresh = true
    },
    FINISH_REFRESH: (state) => {
      state.refresh = false
    }
  },

  actions: {
    // 获取任务列表
    async GetTaskList({ commit }, params) {
      const res = await getTaskList(params)
      if (res.error_code === 0) {
        commit('SET_TASK_LIST', res.data.tasks)
      }
      return res
    },

    // 获取任务详情
    async GetTaskDetail({ commit }, id) {
      return await getTaskDetail(id)
    },

    // 任务结果同步
    async TaskSync({ commit }, task_id) {
      return await taskSync({ task_id: task_id })
    },

    // 任务日志
    async TaskLog({ commit }, task_id) {
      return await taskLog({ task_id: task_id })
    }

  }
}

export default tasks
