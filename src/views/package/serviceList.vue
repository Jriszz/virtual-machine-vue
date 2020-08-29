<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>打包服务在线列表</span>
      </div>

      <!-- <el-form
        v-loading="loading"
        ref="form"
        :model="form"
        :label-width="labelWidth"
        size="small">
        <el-form-item>
          <el-button
            type="info"
            plain
            @click="getServiceList">刷新队列</el-button>
        </el-form-item>
      </el-form> -->

      <el-alert
        v-show="errorflag"
        :description="errorinfo"
        title="获取打包服务在线列表失败！"
        type="error"
        show-icon
        @close="errorflag=false"/>

      <el-table
        :data="serviceList"
        :row-class-name="tableRowClassName">
        <el-table-column
          prop="address"
          width="200"
          label="打包服务"/>
        <el-table-column
          label="当前状态"
          width="200">
          <template slot-scope="scope">
            <span v-if="Object.keys(scope.row.task).length>0">打包中</span>
            <span v-else>空闲中</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="viewTask(scope.row.task)">查看当前任务</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="viewLog(scope.row.onlineLog)">查看实时日志</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="packageShowTask" width="40%" title="当前正在打包的任务信息">
      <el-input
        :rows="16"
        v-model="currentTask"
        type="textarea"/>
    </el-dialog>
  </div>
</template>

<style>
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

<script>
import { MessageBox, Message } from 'element-ui'

export default {
  name: 'ServiceList',
  components: { MessageBox, Message },

  data() {
    return {
      labelWidth: this.config.labelWidth,
      loading: false,
      errorflag: false,
      errorinfo: '',
      packageShowTask: false,
      currentTask: '',
      form: {}
    }
  },
  computed: {
    serviceList: function() {
      return this.$store.state.packages.serviceList
    },
    refresh: function() {
      return this.$store.state.packages.refreshService
    }
  },
  watch: {
    refresh: function(newValue, oldValue) {
      if (newValue === true) {
        this.getServiceList()
        this.$store.commit('FINISH_SERVICE_REFRESH')
      }
    }
  },
  mounted() {
    this.getServiceList()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (Object.keys(row.task).length > 0) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    },
    async getServiceList() {
      this.resetResult()
      this.loading = true
      this.errorflag = false
      const res = await this.$store.dispatch('GetServiceList')
      if (res.error_code === 0) {
        if (res.data.length > 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 5 * 1000
          })
        } else {
          Message({
            message: '没有打包服务在线，无法提供打包服务！',
            type: 'error',
            duration: 0,
            showClose: true
          })
        }
      } else {
        console.log(res)
      }
      this.loading = false
    },
    viewTask(task) {
      if (Object.keys(task).length > 0) {
        this.currentTask = JSON.stringify(task, null, 4)
      } else {
        this.currentTask = '当前没有任务在运行……'
      }
      this.packageShowTask = true
    },
    viewLog(url) {
      window.open(url, '_blank')
    },
    reset() {
      this.form = this.initForm()
      this.resetResult()
      this.totals = 0
    },
    resetResult() {
      this.errorflag = false
      this.result = []
    }
  }
}
</script>
