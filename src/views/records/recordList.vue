<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>用例执行记录列表</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :model="form"
        :label-width="labelWidth"
        size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="用例名称">
              <el-input v-model="form.name" clearable placeholder="模糊查询"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流程名称">
              <el-input v-model="form.flow_name" clearable placeholder="精确查询"/>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="被测命令">
              <el-input v-model="form.command" clearable placeholder="模糊查询"/>
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="所属模块">
              <el-input v-model="form.module" clearable placeholder="模糊查询"/>
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
            <el-form-item label="流程作者">
              <el-input v-model="form.author" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
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
        <el-row>
          <el-col :span="8">
            <el-form-item label="用例结果">
              <el-radio-group v-model="form.result">
                <el-radio label="">全部</el-radio>
                <el-radio :label="1">成功</el-radio>
                <el-radio :label="0">失败</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="流程版本">
              <el-input v-model="form.flow_version" clearable placeholder="精确查询"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="IP地址">
              <el-input v-model="form.ip_address" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="info"
            plain
            @click="getRecordList">查询</el-button>
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
          :data="recordList"
          :stripe="false"
          :border="true"
          :cell-class-name="getClassName"
          size="small">
          <el-table-column type="expand">
            <template slot-scope="record">
              <el-row>
                <el-col :span="14">
                  <el-form label-position="left" class="demo-table-expand">
                    <el-form-item label="用例名称">
                      <span>{{ record.row.name }}</span>
                    </el-form-item>
                    <el-form-item label="用例描述">
                      <span>{{ record.row.desc }}</span>
                    </el-form-item>
                    <el-form-item label="预期结果">
                      <span>{{ record.row.expect }}</span>
                    </el-form-item>
                    <el-form-item label="实际结果">
                      <span>{{ record.row.actual }}</span>
                    </el-form-item>
                    <el-form-item label="是否通过">
                      <span v-if="record.row.result===true" class="backGreen">成功</span>
                      <span v-if="record.row.result===false" class="backRed">失败</span>
                      <span v-else class="backYellow"/>
                    </el-form-item>
                    <el-form-item label="执行消息">
                      <span>{{ record.row.message }}</span>
                    </el-form-item>
                    <el-form-item label="执行时间">
                      <span>{{ record.row.create_time }}</span>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="10">
                  <el-form label-position="left" class="demo-table-expand">
                    <el-form-item label="软件包">
                      <span>{{ record.row.package }}-{{ record.row.edition }}-{{ record.row.version }}-{{ record.row.arch }}</span>
                    </el-form-item>
                    <el-form-item label="宿主地址">
                      <span>{{ record.row.ip_address }}</span>
                    </el-form-item>
                    <el-form-item label="宿主名称">
                      <span>{{ record.row.host_name }}</span>
                    </el-form-item>
                    <el-form-item label="操作系统">
                      <span>{{ record.row.os_name }}</span>
                    </el-form-item>
                    <el-form-item label="系统架构">
                      <span>{{ record.row.os_arch }}</span>
                    </el-form-item>
                    <el-form-item label="系统版本">
                      <span>{{ record.row.os_version }}</span>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="task_id"
            width="140"
            label="任务编号"/>
          <el-table-column
            prop="flow_name"
            width="200"
            label="流程名称"/>
          <el-table-column
            prop="flow_version"
            width="80"
            label="流程版本"/>
          <el-table-column
            prop="author"
            width="80"
            label="流程作者"/>
          <el-table-column
            prop="module"
            min-width="150"
            label="所属模块"/>
          <el-table-column
            prop="command"
            min-width="150"
            label="被测命令"/>
          <el-table-column
            prop="name"
            min-width="200"
            label="用例名称"/>
          <el-table-column
            prop="result"
            width="70"
            label="通过状态">
            <template slot-scope="scope">
              <span v-if="scope.row.result===true">成功</span>
              <span v-else-if="scope.row.result===false">失败</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            width="150"
            label="完成时间"/>
          <el-table-column
            prop="ip_address"
            width="120"
            label="运行机器"/>
          <el-table-column
            prop="os_name"
            width="200"
            label="运行系统"/>
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
import * as tasks from '@/api/tasks'

export default {
  name: 'RecordList',
  components: { MessageBox, Message },

  data() {
    return {
      labelWidth: this.config.labelWidth,
      loading: false,
      errorflag: false,
      errorinfo: '',
      form: this.initForm(),
      recordList: [],
      totals: 0,
      dateRange: null
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
    this.getRecordList()
  },
  methods: {
    initForm() {
      const _form = {
        module: '',
        command: '',
        name: '',
        result: '',
        author: '',
        create_time_s: '',
        create_time_e: '',
        task_id: '',
        flow_name: '',
        flow_version: '',
        ip_address: '',
        page: 1,
        pageSize: 10
      }
      return _form
    },
    getClassName({ row, column, rowIndex, columnIndex }) {
      if (column['label'] === '通过状态') {
        if (row.result === true) {
          return 'colorSuccess'
        } else if (row.result === false) {
          return 'colorFail2'
        } else {
          return 'colorFail1'
        }
      }
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
    async getRecordList() {
      this.resetResult()
      this.loading = true
      this.errorflag = false
      const params = this.tools.cleanObjNullProperty(this.form)
      const res = await tasks.getRecordList(params)
      if (res.error_code === 0) {
        this.totals = res.data.totals
        this.recordList = res.data.records
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
      this.dateRange = null
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
      this.getRecordList()
    },
    changeCurrentPage(val) {
      this.form.page = val
      this.getRecordList()
    }
    // 分页相关的方法
  }
}
</script>

<style>
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
