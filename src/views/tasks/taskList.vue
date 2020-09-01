<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>任务列表</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :model="form"
        :label-width="labelWidth"
        size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务状态">
              <el-radio-group v-model="form.status">
                <el-radio label="deploying">部署中</el-radio>
                <el-radio label="running">运行中</el-radio>
                <el-radio label="finished">已完成</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务结果">
              <el-radio-group v-model="form.result">
                <el-radio :label="0">运行失败</el-radio>
                <el-radio :label="1">运行成功</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务编号">
              <el-input v-model="form.task_id" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部署ID">
              <el-input v-model="form.dep_id" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="WorkerID">
              <el-input v-model="form.worker_id" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务详情">
              <el-radio-group v-model="form.detail">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="info"
            plain
            @click="getTaskList">查询</el-button>
          <el-button
            type="info"
            plain
            @click="reset('form')">重置</el-button>
          <el-button
            type="primary"
            plain
            @click="taskSync('')">同步</el-button>
        </el-form-item>
      </el-form>

      <el-alert
        v-show="errorflag"
        :description="errorinfo"
        title="获取任务列表失败！"
        type="error"
        show-icon
        @close="errorflag=false"/>

      <el-card>
        <el-table
          :data="taskList"
          :stripe="true"
          :border="true">
          <el-table-column
            prop="task_id"
            width="160"
            label="任务编号"/>
          <el-table-column
            prop="worker_name"
            width="160"
            label="Worker名称"/>
          <el-table-column
            prop="flow_name"
            width="250"
            label="流程名称"/>
          <el-table-column
            prop="dep_name"
            width="200"
            label="部门名称"/>
          <el-table-column
            prop="status"
            width="80"
            label="任务状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status==='deploying'">部署中</span>
              <span v-else-if="scope.row.status==='running'">运行中</span>
              <span v-else-if="scope.row.status==='finished'">已完成</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="result"
            label="任务结果">
            <template slot-scope="scope">
              <span v-if="scope.row.result===true">成功</span>
              <span v-else-if="scope.row.result===false">失败</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sync"
            label="是否同步">
            <template slot-scope="scope">
              <span v-if="scope.row.sync===true">已同步</span>
              <span v-else-if="scope.row.sync===false">末同步</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="220">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="taskSync(scope.row.id)">同步</el-button>
              <el-button size="mini" type="primary" plain @click="getTaskDetail(scope.row.id)">详情</el-button>
              <el-button size="mini" type="primary" plain @click="openLogPage(scope.row.task_id)">日志</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            :current-page="form.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="form.pageSize"
            :total="totals"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="changePageSize"
            @current-change="changeCurrentPage"
            @next-click="getNextPage"
            @prev-click="getPrevPage"/>
        </div>
      </el-card>
    </el-card>
    <!-- <task-form /> -->
    <!-- <task-role-list-form /> -->
  </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'
// import taskForm from './taskForm'
// import taskRoleListForm from './taskRoleListForm'

export default {
  name: 'TaskList',
  components: { MessageBox, Message },
  // components: { taskForm, MessageBox, Message, systemSelect, taskRoleListForm },

  data() {
    return {
      labelWidth: this.config.labelWidth,
      loading: false,
      errorflag: false,
      errorinfo: '',
      form: this.initForm(),
      logUrl: '',
      totals: 0
    }
  },
  computed: {
    taskList: function() {
      return this.$store.state.tasks.taskList
    },
    isSuperAdmin: function() {
      if (this.$store.state.users.sessionUser.super_admin === 1) {
        return true
      } else {
        return false
      }
    },
    refresh: function() {
      return this.$store.state.tasks.refresh
    }
  },
  watch: {
    refresh: function(newValue, oldValue) {
      if (newValue === true) {
        this.getTaskList()
        this.$store.commit('FINISH_REFRESH')
      }
    }
  },
  mounted() {
    this.getTaskList()
  },
  methods: {
    initForm() {
      const _form = {
        task_id: '',
        status: 'finished',
        result: 0,
        dep_id: '',
        worker_id: '',
        detail: 0,
        page: 1,
        pageSize: 10
      }
      return _form
    },
    async getTaskList() {
      this.resetResult()
      this.loading = true
      this.errorflag = false
      const params = this.tools.cleanObjNullProperty(this.form)
      const res = await this.$store.dispatch('GetTaskList', params)
      if (res.error_code === 0) {
        this.logUrl = res.data.log_url
        this.totals = res.data.totals
      } else {
        console.log(res)
      }
      this.loading = false
    },
    async taskSync(task_id) {
      this.loading = true
      this.errorflag = false
      await this.$store.dispatch('TaskSync', task_id)
      this.loading = false
    },
    async getTaskDetail(id) {
      this.loading = true
      this.errorflag = false
      await this.$store.dispatch('GetTaskDetail', id)
      this.loading = false
    },
    openLogPage(task_id) {
      window.open(this.logUrl + "?task_id=" + task_id, "_blank")
    },
    async getTaskLog(task_id) {
      this.loading = true
      this.errorflag = false
      await this.$store.dispatch('TaskLog', task_id)
      this.loading = false
    },
    openTaskForm(task, type) {
      this.$store.commit('OPEN_TASK_FORM', { type, task })
    },
    reset() {
      this.form = this.initForm()
      this.resetResult()
      this.totals = 0
    },
    resetResult() {
      this.errorflag = false
      this.result = []
    },
    // 分页相关的方法
    getNextPage() {
      this.form.page += 1
    },
    getPrevPage() {
      this.form.page -= 1
    },
    changePageSize(val) {
      this.form.pageSize = val
      this.form.page = 1
      this.getTaskList()
    },
    changeCurrentPage(val) {
      this.form.page = val
      this.getTaskList()
    }
    // 分页相关的方法
  }
}
</script>
