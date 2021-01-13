<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>流程列表</span>
      </div>

      <el-form
        :label-width="labelWidth"
        size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="流程类型">
              <el-radio-group v-model="queryForm.flowType" @change="filterFlow">
                <el-radio :label="0">全部</el-radio>
                <el-radio :label="1">自测流程</el-radio>
                <el-radio :label="2">普通流程</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="流程名称">
              <el-input
                :clearable="true"
                v-model="queryForm.flowName"
                placeholder="支持模糊搜索"
                @change="filterFlow"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="info"
            plain
            @click="getFlowTaskSummaryList">刷新流程</el-button>
          <el-button
            type="primary"
            plain
            @click="openCreateTaskForm('a', '', '为所有流程创建任务')">为所有流程创建任务</el-button>
          <el-button
            type="primary"
            plain
            @click="openCreateTaskForm('m', selectFlowIds, '批量创建任务')">批量创建任务</el-button>
          <el-button
            type="primary"
            plain
            @click="switchPlanStatus(0, null)">停止所有计划</el-button>
          <el-button
            type="primary"
            plain
            @click="switchPlanStatus(1, null)">开启所有计划</el-button>
        </el-form-item>
      </el-form>

      <el-alert
        v-show="errorflag"
        :description="errorinfo"
        title="获取流程列表失败！"
        type="error"
        show-icon
        @close="errorflag=false"/>

      <el-card>
        <el-table
          :data="flowList"
          :stripe="true"
          :border="true"
          size="small"
          @selection-change="selectFlow">
          <el-table-column type="expand">
            <template slot-scope="record">
              <el-table
                :data="record.row.versions">
                <el-table-column
                  prop="flow_id"
                  width="80"
                  label="流程ID"/>
                <el-table-column
                  prop="flow_name"
                  width="200"
                  label="流程名称"/>
                <el-table-column
                  prop="author"
                  min-width="80"
                  label="作者"/>
                <el-table-column
                  prop="package_id"
                  min-width="100"
                  label="流程包ID"/>
                <el-table-column
                  prop="flow_package_name"
                  min-width="200"
                  label="流程包名称"/>
                <el-table-column
                  prop="package_version_id"
                  min-width="100"
                  label="流程包版本ID"/>
                <el-table-column
                  prop="flow_package_version"
                  min-width="100"
                  label="流程包版本名称"/>
                <el-table-column
                  prop="task_total"
                  width="120"
                  label="任务总数"/>
                <el-table-column
                  prop="task_success"
                  width="120"
                  label="成功总数"/>
                <el-table-column
                  label="成功率"
                  width="100">
                  <template slot-scope="scope">
                    <span>{{ (scope.row.task_success / scope.row.task_total * 100).toFixed(2) + "%" }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            type="selection"
            width="55"/>
          <el-table-column
            prop="flow_name"
            min-width="200"
            label="流程名称"/>
          <el-table-column
            prop="flow_version"
            min-width="70"
            label="流程版本"/>
          <el-table-column
            prop="author"
            min-width="60"
            label="作者"/>
          <el-table-column
            prop="flow_package_name"
            min-width="200"
            label="流程包名称"/>
          <el-table-column
            prop="flow_package_version"
            width="120"
            label="流程包版本名称"/>
          <el-table-column
            width="80"
            label="版本数量">
            <template slot-scope="scope">
              <span>{{ scope.row.versions.length }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="task_total"
            width="80"
            label="任务总数"/>
          <el-table-column
            prop="task_success"
            width="80"
            label="成功总数"/>
          <el-table-column
            label="成功率"
            width="100">
            <template slot-scope="scope">
              <span>{{ (scope.row.task_success / scope.row.task_total * 100).toFixed(2) + "%" }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="计划状态"
            min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.status===1" class="colorGreen">已启用</span>
              <span v-else-if="scope.row.status===0" class="colorYellow">未启用</span>
              <span v-else class="colorRed">未找到计划</span>
            </template>
          </el-table-column>
          <el-table-column
            label="计划运行配置"
            min-width="120">
            <template slot-scope="scope">
              {{ scope.row.cronExpression }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="300">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="openCreateTaskForm('s', scope.row.id, '创建任务')">创建任务</el-button>
              <el-button size="mini" type="primary" plain @click="switchPlanStatus(0, scope.row.flow_name)">停止计划</el-button>
              <el-button size="mini" type="primary" plain @click="switchPlanStatus(1, scope.row.flow_name)">开启计划</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totals"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="changePageSize"
            @current-change="changeCurrentPage"
            @next-click="getNextPage"
            @prev-click="getPrevPage"/>
        </div>
      </el-card>
    </el-card>
    <el-dialog
      v-if="createTaskFormVisable"
      :visible.sync="createTaskFormVisable"
      width="40%">
      <div class="formTitle">
        <span>{{ formTitle }}</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :label-width="labelWidth"
        :model="form"
        size="small">
        <el-form-item label="Worker">
          <worker-select :initworkerid="form.worker_id" @change="form.worker_id=$event"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="createTask">提交</el-button>
          <el-button @click="createTaskFormVisable=false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'
import { createTaskByFlow, switchPlanStatus } from '@/api/flows'
import WorkerSelect from '@/components/onlineWorkerSelect'

export default {
  name: 'FlowList',
  components: { MessageBox, Message, WorkerSelect },

  data() {
    return {
      labelWidth: this.config.labelWidth,
      loading: false,
      errorflag: false,
      errorinfo: '',
      logUrl: '',
      detailUrl: '',
      page: 1,
      pageSize: 10,
      flowList: [],
      filterFlowList: [],
      flowVersionList: [],
      totals: 0,
      createTaskFormVisable: false,
      form: { worker_id: null },
      queryForm: { flowType: 0, flowName: '' },
      formTitle: '创建任务',
      selectFlowIds: null
    }
  },
  computed: {
    allFlowList: function() {
      return this.$store.state.flows.flowList
    },
    isSuperAdmin: function() {
      if (this.$store.state.users.sessionUser.super_admin === 1) {
        return true
      } else {
        return false
      }
    },
    refresh: function() {
      return this.$store.state.flows.refresh
    }
  },
  watch: {
    refresh: function(newValue, oldValue) {
      if (newValue === true) {
        this.getFlowTaskSummaryList()
        this.$store.commit('FINISH_REFRESH')
      }
    }
  },
  mounted() {
    this.getFlowTaskSummaryList().then(() => {
      this.filterFlow()
    })
  },
  methods: {
    async getFlowList() {
      this.resetResult()
      this.errorflag = false
      const res = await this.$store.dispatch('GetFlowList')
      if (res && res.error_code === 0) {
        this.totals = res.data.length
        this.getCurrentPageFlow()
        Message({
          message: res.msg,
          type: 'success',
          duration: 5 * 1000
        })
      }
    },
    async getFlowTaskSummaryList() {
      this.resetResult()
      this.errorflag = false
      const res = await this.$store.dispatch('GetFlowTaskSummaryList')
      if (res && res.error_code === 0) {
        this.totals = res.data.length
        this.filterFlow()
        Message({
          message: res.msg,
          type: 'success',
          duration: 5 * 1000
        })
      }
    },
    selectFlow(val) {
      console.log(val)
      this.selectFlowList = val
      if (val.length === 0) {
        this.selectFlowIds = null
      } else if (val.length === 1) {
        this.selectFlowIds = val[0].id
      } else {
        this.selectFlowIds = ''
        for (let i = 0; i < val.length; i++) {
          this.selectFlowIds += val[i].id.toString() + ';'
        }
      }
    },
    openCreateTaskForm(number, id, formTitle) {
      if (number === 'm' && (id === null || id.toString().length === 0)) {
        Message({
          message: '请选择相应的流程',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
      this.form['number'] = number
      this.form['id'] = id
      this.formTitle = formTitle
      this.createTaskFormVisable = true
    },
    async createTask() {
      this.loading = true
      try {
        const res = await createTaskByFlow(this.form)
        this.createTaskFormVisable = false
        if (res && res.error_code === 0) {
          let message
          if (res.data instanceof Array) {
            message = '成功创建' + res.data.length + '个任务'
            console.log(res)
          } else {
            message = res.msg + ': ' + res.data.taskId
          }
          Message({
            message,
            type: 'success',
            duration: 5 * 1000
          })
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async switchPlanStatus(status, plan_name) {
      const res = await switchPlanStatus({ status: status, plan_name: plan_name })
      if (res && res.error_code === 0) {
        Message({
          message: res.msg,
          type: 'success',
          duration: 5 * 1000
        })
        this.getFlowTaskSummaryList()
      }
    },
    filterFlow() {
      console.log('开始过滤流程' + this.queryForm)
      this.filterFlowList = this.allFlowList.filter(item => {
        if (this.queryForm.flowType === 2 && item.flow_name.startsWith('自测_')) {
          return
        }
        if (this.queryForm.flowType === 1 && !item.flow_name.startsWith('自测_')) {
          return
        }
        if (this.queryForm.flowName && this.queryForm.flowName.length > 0 && item.flow_name.indexOf(this.queryForm.flowName) < 0) {
          return
        }
        return item
      })
      this.getCurrentPageFlow()
      this.totals = this.filterFlowList.length
    },
    getCurrentPageFlow() {
      const start = (this.page - 1) * this.pageSize
      const end = this.page * this.pageSize
      this.flowList = this.filterFlowList.slice(start, end)
    },
    async getFlowVersionList(row, expandedRows) {
      this.errorflag = false
      console.log(row)
      console.log(expandedRows)
      const res = await this.$store.dispatch('GetFlowVersionList', row.flow_id)
      if (res && res.error_code === 0) {
        this.flowVersionList = res.data
      } else {
        console.log(res)
      }
    },
    reset() {
      this.resetResult()
      this.totals = 0
    },
    resetResult() {
      this.errorflag = false
      this.result = []
    },
    // 分页相关的方法
    getNextPage() {
      this.page += 1
    },
    getPrevPage() {
      this.page -= 1
    },
    changePageSize(val) {
      this.pageSize = val
      this.page = 1
      this.getCurrentPageFlow()
    },
    changeCurrentPage(val) {
      this.page = val
      this.getCurrentPageFlow()
    }
    // 分页相关的方法
  }
}
</script>

<style>
.colorGreen {
  color: green;
}
.colorYellow {
  color:darkorange
}
.colorRed {
  color: red;
}
</style>
