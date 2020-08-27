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
        :stripe="true">
        <el-table-column
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="viewLog(scope.row.address)">查看实时日志</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="打包服务"/>
      </el-table>
    </el-card>
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
    async viewLog(key) {
      alert('规划中…')
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
