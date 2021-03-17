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
            <el-form-item label="流程名称">
              <el-input v-model="form.flow_name" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务状态">
              <el-select v-model="form.status" clearable placeholder="请选择">
                <el-option
                  v-for="item in status_enum"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
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
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="流程版本">
              <el-input v-model="form.flow_version" clearable/>
            </el-form-item>
          </el-col>
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
            <el-form-item label="操作系统">
              <el-input v-model="form.os_name" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="dateRangeCreate"
                :default-time="['00:00:00', '23:59:59']"
                type="datetimerange"
                range-separator="至"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="setQueryDateCreate"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="流程作者">
              <el-input v-model="form.author" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务编号">
              <el-input v-model="form.task_id" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="宿主地址">
              <el-input v-model="form.ip_address" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="运行时间">
              <el-date-picker
                v-model="dateRange"
                :default-time="['00:00:00', '23:59:59']"
                type="datetimerange"
                range-separator="至"
                value-format="yyyy-MM-dd HH:mm:ss"
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
          :stripe="false"
          :border="true"
          :cell-class-name="getClassName"
          size="small">
          <el-table-column
            prop="task_id"
            width="140"
            label="任务编号"/>
          <el-table-column
            prop="package"
            width="70"
            label="软件包"/>
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
            width="70"
            label="耗时(秒)"/>
          <el-table-column
            prop="status"
            width="70"
            label="任务状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status==='deploying'">部署中</span>
              <span v-else-if="scope.row.status==='running'">运行中</span>
              <span v-else-if="scope.row.status==='finished'">已完成</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            width="70"
            label="任务结果">
            <template slot-scope="scope">
              <span v-if="scope.row.result===true" class="colorGreen">成功</span>
              <span v-else-if="scope.row.result===false" class="colorRed">
                <el-tooltip :content="scope.row.message" class="item" effect="dark" placement="top-start">
                  <span>失败</span>
                </el-tooltip>
              </span>
              <span v-else class="colorYellow">未知</span>
            </template>
          </el-table-column> -->
          <el-table-column
            width="80"
            label="失败率">
            <template slot-scope="scope">
              <span v-if="scope.row.amount===0">100%</span>
              <span v-else>{{ ((1 - scope.row.success_num / scope.row.amount) * 100).toFixed(2) }}%</span>
            </template>
          </el-table-column>
          <el-table-column
            :cell-class-name="getClassName"
            width="230"
            label="用例及错误统计">
            <template slot-scope="scope">
              <el-row>
                <el-col :span="6"><el-button type="text" size="mini" icon="el-icon-s-help" @click="openTaskRecordTable(scope.row.id, null)">{{ scope.row.amount }}</el-button></el-col>
                <el-col :span="6"><el-button type="text" size="mini" icon="el-icon-success" @click="openTaskRecordTable(scope.row.id, true)">{{ scope.row.success_num }}</el-button></el-col>
                <el-col :span="6"><el-button type="text" size="mini" icon="el-icon-error" @click="openTaskRecordTable(scope.row.id, false)">{{ scope.row.fail_num }}</el-button></el-col>
                <el-col v-if="scope.row.error_num!==0" :span="6"><el-button type="text" size="mini" icon="el-icon-warning" @click="openTaskErrorTable(scope.row.task_id)">{{ scope.row.error_num }}</el-button></el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="error_type"
            width="120"
            label="错误类型">
            <template slot-scope="scope">
              <span v-if="scope.row.error_type===0">运行成功</span>
              <span v-else-if="scope.row.error_type===1">找不到子EXE</span>
              <span v-else-if="scope.row.error_type===2">找不到子流程</span>
              <span v-else-if="scope.row.error_type===3">加载流程失败</span>
              <span v-else-if="scope.row.error_type===4">运行流程超时</span>
              <span v-else-if="scope.row.error_type===5">Worker运行崩溃</span>
              <span v-else-if="scope.row.error_type===8">存在失败用例</span>
              <span v-else-if="scope.row.error_type===9">运行流程出错</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sync"
            width="70"
            label="是否同步">
            <template slot-scope="scope">
              <span v-if="scope.row.task_type===0"/>
              <span v-else-if="scope.row.sync===true">已同步</span>
              <span v-else-if="scope.row.sync===false">末同步</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column
            width="280"
            label="宿主信息">
            <template slot-scope="scope">
              <span style="display: block; line-height: 1">{{ scope.row.os_name }}</span>
              <span style="display: block; line-height: 1">{{ scope.row.ip_address }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="450">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="openTaskDetail(scope.row.task_id)">详情</el-button>
              <el-button size="mini" type="primary" plain @click="openLogPage(scope.row.task_id, 'task')">任务日志</el-button>
              <el-button size="mini" type="primary" plain @click="openLogPage(scope.row.task_id, 'extend')">扩展日志</el-button>
              <el-button v-if="scope.row.task_type === 1 && scope.row.sync === false" size="mini" type="primary" plain @click="taskSync(scope.row.task_id)">同步</el-button>
              <el-button v-if="scope.row.task_type === 1" size="mini" type="primary" plain @click="taskRestart(scope.row.task_id)">克隆</el-button>
              <el-button v-if="isSuperAdmin" size="mini" type="danger" plain @click="deleteTask(scope.row.id)">删除</el-button>
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
    <el-dialog :visible.sync="taskRecordTableVisable" :title="currentTaskRecordTitle" width="80%">
      <el-table
        :border="true"
        :fit="true"
        :data="currentTaskRecordList">
        <el-table-column
          type="index"
          width="50"/>
        <el-table-column
          prop="module"
          width="80"
          label="所属模块"/>
        <el-table-column
          prop="command"
          width="120"
          label="测试命令"/>
        <el-table-column
          prop="name"
          width="200"
          label="用例名称"/>
        <el-table-column
          prop="desc"
          width="200"
          label="用例描述"/>
        <el-table-column
          prop="expect"
          width="100"
          label="预期结果"/>
        <el-table-column
          prop="actual"
          width="100"
          label="实际结果"/>
        <el-table-column
          prop="result"
          width="80"
          label="是否通过">
          <template slot-scope="scope">
            <span v-if="scope.row.result===true" class="colorGreen">通过</span>
            <span v-else-if="scope.row.result===false" class="colorRed">失败</span>
            <span v-else class="colorYellow">未知</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="message"
          label="执行消息"/>
      </el-table>
    </el-dialog>
    <el-dialog :visible.sync="taskErrorTableVisable" :title="currentTaskErrorTitle" width="80%">
      <el-table
        :border="true"
        :fit="true"
        :data="currentTaskErrorList">
        <el-table-column
          type="index"
          width="50"/>
        <el-table-column
          label="错误消息">
          <template slot-scope="error">
            <pre>{{ toJson(error.row.message) }}</pre>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { MessageBox, Message } from 'element-ui'
import * as tasks from '@/api/tasks'

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
      taskList: [],
      logUrl: '',
      detailUrl: '',
      totals: 0,
      status_enum: [{
        value: null,
        label: '全部'
      }, {
        value: 'deploying',
        label: '部署中'
      }, {
        value: 'running',
        label: '运行中'
      }, {
        value: 'finished',
        label: '已完成'
      }],
      error_type_enum: [{
        value: null,
        label: '全部'
      }, {
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
        value: 8,
        label: '存在失败用例'
      }, {
        value: 9,
        label: '运行流程出错'
      }],
      dateRange: null,
      dateRangeCreate: null,
      // 当前任务用例展示相关参数
      taskRecordTableVisable: false,
      currentTaskRecordList: [],
      currentTaskRecordTitle: '',
      // 当前任务错误展示相关参数
      taskErrorTableVisable: false,
      currentTaskErrorList: [],
      currentTaskErrorTitle: ''
    }
  },
  computed: {
    // taskList: function() {
    //   return this.$store.state.tasks.taskList
    // },
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
        status: null,
        result: '',
        sync: '',
        dep_id: '',
        ip_address: '',
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
    getClassName({ row, column, rowIndex, columnIndex }) {
      if (column['label'] === '失败率') {
        if (row.error_num > 0 || row.amount === 0) {
          return 'colorError'
        } else if (row.fail_num / row.amount >= 0.2) {
          return 'colorFail2'
        } else if (row.fail_num > 0) {
          return 'colorFail1'
        } else {
          // return ''
          return 'colorSuccess'
        }
      }
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
    async deleteTask(id) {
      MessageBox.confirm(
        '此操作将删除任务及任务下的日志，用例，错误等信息，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }
      ).then(async() => {
        const res = await tasks.deleteTask(id)
        if (res && res.error_code === 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 5 * 1000
          })
          await this.getTaskList()
        }
      }).catch(action => {})
    },
    toJson(message) {
      try {
        return JSON.stringify(JSON.parse(message), null, 2)
      } catch (error) {
        return message
      }
    },
    async openTaskRecordTable(id, type) {
      this.taskRecordTableVisable = true
      if (type === true) {
        this.currentTaskRecordTitle = '当前任务运行成功用例列表'
      } else if (type === false) {
        this.currentTaskRecordTitle = '当前任务运行失败用例列表'
      } else {
        this.currentTaskRecordTitle = '当前任务所有用例列表'
      }
      const res = await tasks.taskRecords(id, { 'result': type })
      if (res.error_code === 0 && res.data.length > 0) {
        this.currentTaskRecordList = res.data
      }
    },
    async openTaskErrorTable(task_id) {
      this.taskErrorTableVisable = true
      this.currentTaskErrorTitle = '当前任务错误列表'
      const res = await tasks.getErrorList({ 'task_id': task_id })
      if (res.error_code === 0 && res.data.errors.length > 0) {
        this.currentTaskErrorList = res.data.errors
      }
    },
    async getTaskRecords(expandedRows, expanded) {
      if (expandedRows.records.length === 0) {
        const res = await tasks.taskRecords(expandedRows['id'])
        if (res.error_code === 0 && res.data.length > 0) {
          expandedRows['records'] = res.data
        }
      }
    },
    async getTaskList() {
      this.resetResult()
      this.loading = true
      this.errorflag = false
      const params = this.tools.cleanObjNullProperty(this.form)
      // const res = await this.$store.dispatch('GetTaskList', params)
      const res = await tasks.getTaskList(params)
      if (res.error_code === 0) {
        this.logUrl = res.data.log_url
        this.detailUrl = res.data.detail_url
        this.totals = res.data.totals
        this.taskList = res.data.tasks
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
      const res = await tasks.taskRestart({ 'task_id': task_id })
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
    openLogPage(task_id, type) {
      window.open(this.logUrl + '?task_id=' + task_id + '&type=' + type, '_blank')
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

<style>
  .colorError {
    color: wheat;
    font-weight: bolder;
    background-color: rgb(120, 0, 0);
  }
  .colorFail2 {
    color: wheat;
    font-weight: bolder;
    background-color: red;
  }
  .colorFail1 {
    color: wheat;
    font-weight: bolder;
    background-color: orange;
  }
  .colorSuccess {
    color: wheat;
    background-color: green;
  }
  .colorGreen {
  color: green;
  }
  .colorYellow {
    color:darkorange
  }
  .colorRed {
    color: red;
  }
  .backGreen {
    color: white;
    font-weight: bold;
    background-color: green;
  }
  .backYellow {
    color: white;
    font-weight: bold;
    background-color:darkorange
  }
  .backRed {
    color: white;
    font-weight: bold;
    background-color: red;
  }
  /* .el-button--text {
    color:darkorange
  } */
</style>
