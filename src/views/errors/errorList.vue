<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>任务执行过程中发生的错误列表——请注意：错误不同与用例失败，所有错误请当天处理</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :model="form"
        :label-width="labelWidth"
        size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="流程名称">
              <el-input v-model="form.flow_name" clearable placeholder="精确查询"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流程版本">
              <el-input v-model="form.flow_version" clearable placeholder="精确查询"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流程作者">
              <el-input v-model="form.author" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="任务编号">
              <el-input v-model="form.task_id" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="IP地址">
              <el-input v-model="form.ip_address" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="错误消息">
              <el-input v-model="form.message" clearable placeholder="模糊查询"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="错误状态">
              <el-select v-model="form.status" clearable placeholder="请选择">
                <el-option
                  v-for="item in error_status_enum"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
            @click="getErrorList">查询</el-button>
          <el-button
            type="info"
            plain
            @click="reset('form')">重置</el-button>
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
          :data="errorList"
          :stripe="true"
          :border="true"
          size="small">
          <el-table-column
            min-width="400"
            label="错误消息">
            <template slot-scope="error">
              <pre>{{ toJson(error.row.message) }}</pre>
            </template>
          </el-table-column>
          <el-table-column
            width="120"
            label="处理错误">
            <template slot-scope="error">
              <div v-if="error.row.status===1">状态：已处理<br>{{ error.row.remark }}</div>
              <div v-else-if="error.row.status===2">状态：已忽略<br>{{ error.row.remark }}</div>
              <div v-else-if="error.row.status===3">状态：已挂起<br>{{ error.row.remark }}</div>
              <div v-else>
                <el-button size="mini" type="text" @click="openHandleForm(error.row.id)">处理错误</el-button><br>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            width="150"
            label="任务信息">
            <template slot-scope="error">
              <span>{{ error.row.task_id }}</span><br>
              <el-button size="mini" type="text" @click="openTaskDetail(error.row.task_id)">任务详情</el-button><br>
              <el-button size="mini" type="text" @click="openLogPage(error.row.task_id, 'task')">任务日志</el-button><br>
              <el-button size="mini" type="text" @click="openLogPage(error.row.task_id, 'extend')">扩展日志</el-button>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="流程名称">
            <template slot-scope="error">
              <span>{{ error.row.flow_name }}</span><br>
              <span>{{ error.row.flow_version }}</span><br>
              <span>{{ error.row.author }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            label="软件包信息">
            <template slot-scope="error">
              <span>{{ error.row.package }}</span><br>
              <span>{{ error.row.edition }}</span><br>
              <span>{{ error.row.arch }}</span><br>
              <span>{{ error.row.version }}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="200"
            label="操作系统">
            <template slot-scope="error">
              <span>{{ error.row.ip_address }}</span><br>
              <span>{{ error.row.os_name }}</span><br>
              <span>{{ error.row.os_arch }}</span><br>
              <span>{{ error.row.os_version }}</span>
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
    <el-dialog :visible.sync="handleErrorVisible" width="40%" title="处理错误">
      <el-form
        v-loading="loading"
        ref="form"
        :model="handleForm"
        :label-width="labelWidth">
        <el-form-item label="错误状态">
          <el-radio-group v-model="handleForm.status">
            <el-radio :label="1">已处理</el-radio>
            <el-radio :label="2">已忽略</el-radio>
            <el-radio :label="3">已挂起</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理备注">
          <el-input v-model="handleForm.remark" clearable />
        </el-form-item>
        <el-form-item>
          <el-button
            type="info"
            plain
            @click="updateErrorStatus">提交</el-button>
          <el-button
            type="info"
            plain
            @click="handleErrorVisible = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'
import * as tasks from '@/api/tasks'

export default {
  name: 'ErrorList',
  components: { MessageBox, Message },

  data() {
    return {
      labelWidth: this.config.labelWidth,
      loading: false,
      errorflag: false,
      errorinfo: '',
      form: this.initForm(),
      handleForm: {},
      errorList: [],
      totals: 0,
      dateRange: this.initQueryDateTime(),
      error_status_enum: [{
        value: null,
        label: '全部'
      }, {
        value: 0,
        label: '未处理'
      }, {
        value: 1,
        label: '已修复'
      }, {
        value: 2,
        label: '已忽略'
      }, {
        value: 3,
        label: '已挂起'
      }],
      handleErrorVisible: false,
      currentHandleErrorId: 0
    }
  },
  computed: {
    isSuperAdmin: function() {
      if (this.$store.state.users.sessionUser.super_admin === 1) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {},
  mounted() {
    this.getErrorList()
  },
  methods: {
    initForm() {
      const _form = {
        status: 0,
        author: '',
        task_id: '',
        flow_name: '',
        flow_version: '',
        ip_address: '',
        message: '',
        page: 1,
        pageSize: 10
      }
      const temp_datetime = this.initQueryDateTime()
      _form['create_time_s'] = temp_datetime[0]
      _form['create_time_e'] = temp_datetime[1]
      return _form
    },
    initQueryDateTime() {
      const now = new Date()
      const before_3_day = new Date(now.getTime() - 6 * 24 * 3600 * 1000)
      const date2 = this.tools.dateToStr(now)
      const date1 = this.tools.dateToStr(before_3_day)
      return [date1 + ' 00:00:00', date2 + ' 23:59:59']
    },
    setQueryDate() {
      if (this.dateRange === null) {
        this.form.create_time_s = null
        this.form.create_time_e = null
      } else {
        this.form.create_time_s = this.dateRange[0]
        this.form.create_time_e = this.dateRange[1]
      }
    },
    toJson(message) {
      try {
        return JSON.stringify(JSON.parse(message), null, 2)
      } catch (error) {
        return message
      }
    },
    openHandleForm(error_id) {
      this.handleErrorVisible = true
      this.currentHandleErrorId = error_id
    },
    async updateErrorStatus(error_id, status) {
      const data = this.tools.cleanObjNullProperty(this.handleForm)
      const res = await tasks.updateError(this.currentHandleErrorId, data)
      if (res.error_code === 0) {
        this.handleErrorVisible = false
        this.handleForm = {}
        Message({
          message: res.msg,
          type: 'success',
          duration: 5 * 1000
        })
        this.getErrorList()
      } else {
        console.log(res)
      }
    },
    openLogPage(task_id, type) {
      window.open(this.logUrl + '?task_id=' + task_id + '&type=' + type, '_blank')
    },
    async openTaskDetail(task_id) {
      await this.taskSync(task_id)
      window.open(this.detailUrl + '?task_id=' + task_id, '_blank')
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
      this.loading = false
    },
    async getErrorList() {
      this.resetResult()
      this.loading = true
      this.errorflag = false
      const params = this.tools.cleanObjNullProperty(this.form)
      const res = await tasks.getErrorList(params)
      if (res.error_code === 0) {
        this.logUrl = res.data.log_url
        this.detailUrl = res.data.detail_url
        this.totals = res.data.totals
        this.errorList = res.data.errors
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
    reset() {
      this.form = this.initForm()
      this.dateRange = this.initQueryDateTime()
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
      this.getErrorList()
    },
    changeCurrentPage(val) {
      this.form.page = val
      this.getErrorList()
    }
    // 分页相关的方法
  }
}
</script>

<style>
  pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
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
</style>
