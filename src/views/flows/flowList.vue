<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>流程列表</span>
      </div>

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
          size="small">
          <el-table-column type="expand">
            <template slot-scope="record">
              <el-table
                :data="record.row.versions">
                <el-table-column
                  prop="flow_id"
                  width="100"
                  label="流程ID"/>
                <el-table-column
                  prop="flow_name"
                  width="200"
                  label="流程名称"/>
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
            prop="flow_id"
            width="80"
            label="流程ID"/>
          <el-table-column
            prop="flow_name"
            min-width="200"
            label="流程名称"/>
          <el-table-column
            prop="package_id"
            width="100"
            label="流程包ID"/>
          <el-table-column
            prop="flow_package_name"
            min-width="200"
            label="流程包名称"/>
          <el-table-column
            prop="package_version_id"
            width="100"
            label="流程包版本ID"/>
          <el-table-column
            prop="flow_package_version"
            width="120"
            label="流程包版本名称"/>
          <el-table-column
            width="120"
            label="流程包版本数量">
            <template slot-scope="scope">
              <span>{{ scope.row.versions.length }}</span>
            </template>
          </el-table-column>
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
          <el-table-column
            label="操作"
            min-width="100">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="flowSync(scope.row.flow_id)">同步</el-button>
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
  </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'

export default {
  name: 'FlowList',
  components: { MessageBox, Message },

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
      flowVersionList: [],
      totals: 0
    }
  },
  computed: {
    // flowList: function() {
    //   return this.$store.state.flows.flowList
    // },
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
    this.getFlowTaskSummaryList()
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
        this.getCurrentPageFlow()
        Message({
          message: res.msg,
          type: 'success',
          duration: 5 * 1000
        })
      }
    },
    getCurrentPageFlow() {
      const start = (this.page - 1) * this.pageSize
      const end = this.page * this.pageSize
      this.flowList = this.$store.state.flows.flowList.slice(start, end)
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
