<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>流程列表</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :model="queryForm"
        :label-width="labelWidth"
        size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="流程类型">
              <el-radio-group v-model="queryForm.type">
                <el-radio :label="null">全部</el-radio>
                <el-radio :label="0">本地流程</el-radio>
                <el-radio :label="1">在线流程</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流程名称">
              <el-input
                :clearable="true"
                v-model="queryForm.flow_name"
                placeholder="支持模糊查询"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流程作者">
              <el-input
                :clearable="true"
                v-model="queryForm.author"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="运行模式">
              <el-radio-group v-model="queryForm.run_mode">
                <el-radio :label="null">全部</el-radio>
                <el-radio :label="0">普通流程</el-radio>
                <el-radio :label="1">自测流程</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流程版本">
              <el-input
                :clearable="true"
                v-model="queryForm.flow_version"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="info"
            plain
            @click="getFlowList">查询</el-button>
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
            min-width="350">
            <template slot-scope="scope">
              <el-button v-if="scope.row.flow_id>0" size="mini" type="primary" plain @click="openCreateTaskForm('s', scope.row.id, '创建任务')">创建任务</el-button>
              <el-button v-if="scope.row.flow_id>0" size="mini" type="primary" plain @click="switchPlanStatus(0, scope.row.flow_name)">停止计划</el-button>
              <el-button v-if="scope.row.flow_id>0" size="mini" type="primary" plain @click="switchPlanStatus(1, scope.row.flow_name)">开启计划</el-button>
              <el-button v-if="isSuperAdmin" size="mini" type="danger" plain @click="deleteFlow(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            :current-page="queryForm.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="queryForm.pageSize"
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
import * as flows from '@/api/flows'
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
      totals: 0,
      createTaskFormVisable: false,
      form: { worker_id: null },
      queryForm: { run_mode: null, type: null, flow_name: '', flow_verson: '', author: '' },
      formTitle: '创建任务',
      selectFlowIds: null
    }
  },
  computed: {
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
        this.getFlowList()
        this.$store.commit('FINISH_REFRESH')
      }
    }
  },
  mounted() {
    this.getFlowList()
  },
  methods: {
    async getFlowList() {
      this.resetResult()
      this.errorflag = false
      const params = this.tools.cleanObjNullProperty(this.queryForm)
      const res = await flows.getFlowList(params)
      if (res && res.error_code === 0) {
        this.totals = res.data.totals
        this.flowList = res.data.flows
        Message({
          message: res.msg,
          type: 'success',
          duration: 5 * 1000
        })
      } else {
        console.log(res)
      }
      this.loading = false
    },
    async deleteFlow(id) {
      MessageBox.confirm(
        '此操作将删除流程及流程下的任务，日志，用例，错误等信息，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }
      ).then(async() => {
        const res = await flows.deleteFlow(id)
        if (res && res.error_code === 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 5 * 1000
          })
          await this.getFlowList()
        }
      }).catch(action => {})
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
        const res = await flows.createTaskByFlow(this.form)
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
      const res = await flows.switchPlanStatus({ status: status, plan_name: plan_name })
      if (res && res.error_code === 0) {
        Message({
          message: res.msg,
          type: 'success',
          duration: 5 * 1000
        })
        this.getFlowList()
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
      this.queryForm.page += 1
    },
    getPrevPage() {
      this.queryForm.page -= 1
    },
    changePageSize(val) {
      this.queryForm.pageSize = val
      this.queryForm.page = 1
      this.getFlowList()
    },
    changeCurrentPage(val) {
      this.queryForm.page = val
      this.getFlowList()
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
