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
          <el-col :span="6">
            <el-form-item label="任务结果">
              <el-radio-group v-model="form.result">
                <el-radio label="">全部</el-radio>
                <el-radio :label="1">运行成功</el-radio>
                <el-radio :label="0">运行失败</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="同步状态">
              <el-radio-group v-model="form.sync">
                <el-radio label="">全部</el-radio>
                <el-radio :label="1">已同步</el-radio>
                <el-radio :label="0">未同步</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务状态">
              <el-radio-group v-model="form.status">
                <el-radio label="">全部</el-radio>
                <el-radio label="deploying">部署中</el-radio>
                <el-radio label="running">运行中</el-radio>
                <el-radio label="finished">已完成</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="错误类型">
              <el-select v-model="form.error_type" clearable placeholder="请选择">
                <el-option
                  v-for="item in error_type_enum"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务编号">
              <el-input v-model="form.task_id" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="dateRangeCreate"
                type="datetimerange"
                range-separator="至"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="setQueryDateCreate"/>
            </el-form-item>
            <!-- <el-form-item label="部门名称">
              <el-input v-model="form.dep_name" clearable/>
            </el-form-item> -->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="流程名称">
              <el-input v-model="form.flow_name" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Worker">
              <el-input v-model="form.worker_name" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运行时间">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                @change="setQueryDate"/>
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
            @click="taskSync('')">批量同步</el-button>
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
          :border="true"
          size="small">
          <el-table-column
            prop="task_id"
            width="140"
            label="任务编号"/>
          <el-table-column
            prop="worker_name"
            width="140"
            label="Worker"/>
          <el-table-column
            prop="flow_name"
            min-width="250"
            label="流程名称"/>
          <el-table-column
            prop="dep_name"
            min-width="180"
            label="部门名称"/>
          <el-table-column
            width="150"
            label="起止时间">
            <template slot-scope="scope">
              <div>
                <span style="display: block; line-height: 1">{{ scope.row.start_time }}</span>
                <span style="display: block; line-height: 1">{{ scope.row.end_time }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="elapsed"
            width="80"
            label="耗时(秒)"/>
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
            width="80"
            label="任务结果">
            <template slot-scope="scope">
              <span v-if="scope.row.result===true">成功</span>
              <span v-else-if="scope.row.result===false">失败</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="error_type"
            width="100"
            label="错误类型">
            <template slot-scope="scope">
              <span v-if="scope.row.error_type===0">运行成功</span>
              <span v-else-if="scope.row.error_type===1">找不到子EXE</span>
              <span v-else-if="scope.row.error_type===2">找不到子流程</span>
              <span v-else-if="scope.row.error_type===3">加载流程失败</span>
              <span v-else-if="scope.row.error_type===4">运行流程超时</span>
              <span v-else-if="scope.row.error_type===9">运行流程出错</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sync"
            width="80"
            label="是否同步">
            <template slot-scope="scope">
              <span v-if="scope.row.sync===true">已同步</span>
              <span v-else-if="scope.row.sync===false">末同步</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="260">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="taskSync(scope.row.task_id)">同步</el-button>
              <el-button size="mini" type="primary" plain @click="openTaskDetail(scope.row.task_id)">详情</el-button>
              <el-button size="mini" type="primary" plain @click="openLogPage(scope.row.task_id)">日志</el-button>
              <el-button size="mini" type="primary" plain @click="taskRestart(scope.row.task_id)">克隆</el-button>
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
  </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'
import { taskRestart } from '@/api/tasks'

export default {
  name: 'TaskList',
  components: { MessageBox, Message },

  data() {
    return {
      labelWidth: this.config.labelWidth,
      loading: false,
      errorflag: false,
      errorinfo: '',
      form: this.initForm(),
      logUrl: '',
      detailUrl: '',
      totals: 0,
      error_type_enum: [{
        value: 0,
        label: '运行成功'
      }, {
        value: 1,
        label: '找不到子EXE'
      }, {
        value: 2,
        label: '找不到子流程'
      }, {
        value: 3,
        label: '加载流程失败'
      }, {
        value: 4,
        label: '运行流程超时'
      }, {
        value: 5,
        label: 'Worker运行崩溃'
      }, {
        value: 9,
        label: '运行流程出错'
      }],
      dateRange: null,
      dateRangeCreate: null
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
        status: '',
        result: '',
        sync: '',
        dep_id: '',
        worker_id: '',
        error_type: null,
        flow_name: '',
        start_date: null,
        end_date: null,
        create_time_s: null,
        create_time_e: null,
        page: 1,
        pageSize: 10
      }
      return _form
    },
    setQueryDate() {
      if (this.dateRange === null) {
        this.form.start_date = null
        this.form.end_date = null
      } else {
        this.form.start_date = this.dateRange[0]
        this.form.end_date = this.dateRange[1]
      }
    },
    setQueryDateCreate() {
      if (this.dateRangeCreate === null) {
        this.form.create_time_s = null
        this.form.create_time_e = null
      } else {
        this.form.create_time_s = this.dateRangeCreate[0]
        this.form.create_time_e = this.dateRangeCreate[1]
      }
    },
    async getTaskList() {
      this.resetResult()
      this.loading = true
      this.errorflag = false
      const params = this.tools.cleanObjNullProperty(this.form)
      const res = await this.$store.dispatch('GetTaskList', params)
      if (res.error_code === 0) {
        this.logUrl = res.data.log_url
        this.detailUrl = res.data.detail_url
        this.totals = res.data.totals
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
    async taskSync(task_id) {
      this.loading = true
      this.errorflag = false
      const res = await this.$store.dispatch('TaskSync', task_id)
      Message({
        message: res.msg,
        type: 'success',
        duration: 5 * 1000
      })
      await this.getTaskList()
      this.loading = false
    },
    async taskRestart(task_id) {
      this.loading = true
      this.errorflag = false
      const res = await taskRestart({ 'task_id': task_id })
      if (res && res.error_code === 0) {
        Message({
          message: res.msg + '，生成新任务' + res.data.taskId,
          type: 'success',
          duration: 5 * 1000
        })
        await this.getTaskList()
      }
      this.loading = false
    },
    async openTaskDetail(task_id) {
      await this.taskSync(task_id)
      window.open(this.detailUrl + '?task_id=' + task_id, '_blank')
    },
    openLogPage(task_id) {
      window.open(this.logUrl + '?task_id=' + task_id, '_blank')
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
      this.dateRange = null
      this.dateRangeCreate = null
      this.resetResult()
    },
    resetResult() {
      this.errorflag = false
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
