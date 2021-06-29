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

      <div v-if="!hasServiceOnline">
        <h1 style="color: red">当前没有打包服务在线，无法提供打包服务！</h1>
        <h1 style="color: green">打包服务1启动指南</h1>
        <ol>
          <li class="startServiceSetp">以uibot用户远程登录192.168.0.138，密码UiBot2020;</li>
          <li class="startServiceSetp">按【Win + Q】打开系统搜索框，输入Terminal，选择“以管理员身份运行”;</li>
          <li class="startServiceSetp">输入：【cmd】，从powershell切换到cmd——注意检查启动时是否已经是cmd模式；</li>
          <li class="startServiceSetp">输入：【cd C:\Users\uibot\online_agent】，切换到在线打包工程目录；</li>
          <li class="startServiceSetp">运行：【set_env.bat】脚本；</li>
          <li class="startServiceSetp">输入：【cls && python agent.py】，运行在线打包守护进程；</li>
          <li class="startServiceSetp">观察：确认日志中显示日志【打包守护进程启动成功，工作目录切换到C:\Users\uibot\bin-generator】，代表服务启动成功；</li>
          <li class="startServiceSetp">输入：按【F5】刷新当前页面，即可看在刚才启动的打包服务</li>
        </ol>
        <h1 style="color: green">打包服务2启动指南</h1>
        <ol>
          <li class="startServiceSetp">以uibot用户远程登录192.168.0.138，密码UiBot2020;</li>
          <li class="startServiceSetp">按【Win + Q】打开系统搜索框，输入Terminal，选择“以管理员身份运行”;</li>
          <li class="startServiceSetp">输入：【cmd】，从powershell切换到cmd——注意检查启动时是否已经是cmd模式；</li>
          <li class="startServiceSetp">输入：【d: && cd d:\02-package\online_agent】，切换到在线打包工程目录；</li>
          <li class="startServiceSetp">运行：【set_env.bat】脚本；</li>
          <li class="startServiceSetp">输入：【cls && python agent.py】，运行在线打包守护进程；</li>
          <li class="startServiceSetp">观察：确认日志中显示日志【打包守护进程启动成功，工作目录切换到D:\02-package\bin-generator】，代表服务启动成功；</li>
          <li class="startServiceSetp">输入：按【F5】刷新当前页面，即可看在刚才启动的打包服务</li>
        </ol>
      </div>
      <el-table
        v-if="hasServiceOnline"
        :data="serviceList"
        :row-class-name="tableRowClassName">
        <el-table-column
          prop="address"
          width="200"
          label="打包服务"/>
        <el-table-column
          label="任务状态"
          width="200">
          <template slot-scope="scope">
            <span v-if="Object.keys(scope.row.task).length>0">打包中</span>
            <span v-else>空闲中</span>
          </template>
        </el-table-column>
        <el-table-column
          label="当前任务"
          width="200">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="viewTask(scope.row.task)">查看当前任务</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="查看日志"
          width="200">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="viewLog(scope.row.onlineLog)">查看实时日志</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="启用状态">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="switchServiceStatus(scope.row.address)">切换</el-button>
            <span v-if="scope.row.enable_status==='off'">已禁用，禁用后不会参与在线打包，相当于停止服务</span>
            <span v-else>已启用</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="packageShowTask" width="35%" title="当前正在打包的任务信息">
      <el-input
        :rows="22"
        v-model="currentTask"
        type="textarea"/>
    </el-dialog>
  </div>
</template>

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
    hasServiceOnline: function() {
      if (this.$store.state.packages.serviceList.length > 0) {
        return true
      } else {
        return false
      }
    },
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
      if (row.enable_status === 'off') {
        return 'error-row'
      }
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
            duration: 3 * 1000
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
    async switchServiceStatus(host) {
      const res = await this.$store.dispatch('SwitchServiceStatus', { 'host': host })
      if (res.error_code === 0) {
        Message({
          message: res.msg,
          type: 'success',
          duration: 3 * 1000
        })
      } else {
        console.log(res)
      }
      this.getServiceList()
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

<style>
  .el-table .error-row {
    background: rgb(250, 64, 64);
  }
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
  .startServiceSetp {
    line-height: 1.5;
    font-size: 15px;
    font-weight: bold;
  }
</style>
