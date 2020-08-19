<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>在线打包队列</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :model="form"
        :label-width="labelWidth"
        size="small">
        <el-form-item>
          <el-button
            type="info"
            plain
            @click="getPackageList">刷新队列</el-button>
        </el-form-item>
      </el-form>

      <el-alert
        v-show="errorflag"
        :description="errorinfo"
        title="获取打包队列失败！"
        type="error"
        show-icon
        @close="errorflag=false"/>

      <el-card>
        <el-table
          :data="packageList"
          :stripe="true"
          :border="true">
          <el-table-column
            prop="ver"
            width="60"
            label="版本"/>
          <el-table-column
            prop="sub_type"
            width="100"
            label="子版本"/>
          <el-table-column
            prop="pack_type"
            width="80"
            label="产品"/>
          <el-table-column
            prop="arch"
            width="50"
            label="平台"/>
          <el-table-column
            prop="language"
            width="60"
            label="语言"/>
          <el-table-column
            prop="channel"
            width="80"
            label="渠道"/>
          <el-table-column
            prop="stage_type"
            width="80"
            label="测试阶段">
            <template slot-scope="scope">
              <span v-if="scope.row.stage_type==='module'">模块测试</span>
              <span v-else-if="scope.row.stage_type==='integration'">集成测试</span>
              <span v-else-if="scope.row.stage_type==='release'">发布阶段</span>
              <span v-else-if="scope.row.stage_type==='patch'">补丁阶段</span>
              <span v-else>出错</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="beta"
            width="80"
            label="beta版"/>
          <el-table-column
            prop="receiver"
            width="100"
            label="消息接收群">
            <template slot-scope="scope">
              <span v-if="scope.row.receiver==='all'">长研日常群</span>
              <span v-else-if="scope.row.receiver==='test'">长研测试群</span>
              <span v-else-if="scope.row.receiver==='debug'">开发调试群</span>
              <span v-else>出错</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="branch"
            width="120"
            label="打包脚本分支"/>
          <el-table-column
            prop="debug"
            width="50"
            label="调试">
            <template slot-scope="scope">
              <span v-if="scope.row.debug===''">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="removePackage(scope.row.key)">删除</el-button>
              <el-button size="mini" type="primary" plain @click="getPackageDetail(scope.row.key)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'

export default {
  name: 'PackageList',
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
    packageList: function() {
      return this.$store.state.packages.packageList
    },
    isSuperAdmin: function() {
      if (this.$store.state.users.sessionUser.super_admin === 1) {
        return true
      } else {
        return false
      }
    },
    refresh: function() {
      return this.$store.state.packages.refresh
    }
  },
  watch: {
    refresh: function(newValue, oldValue) {
      if (newValue === true) {
        this.getPackageList()
        this.$store.commit('FINISH_REFRESH')
      }
    }
  },
  mounted() {
    this.getPackageList()
  },
  methods: {
    async getPackageList() {
      this.resetResult()
      this.loading = true
      this.errorflag = false
      const res = await this.$store.dispatch('GetPackageList')
      if (res.error_code === 0) {
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
    async getPackageDetail(key) {
      this.loading = true
      this.errorflag = false
      await this.$store.dispatch('GetPackageDetail', key)
      this.loading = false
    },
    async removePackage(key) {
      const opt = await MessageBox.confirm(
        '此操作将删除此打包请求，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }
      ).catch(() => {
      })
      if (opt === 'confirm') {
        this.loading = true
        this.errorflag = false
        const res = await this.$store.dispatch('RemovePackage', key)
        if (res.error_code === 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 5 * 1000
          })
          this.$store.commit('TRIGGER_REFRESH')
        }
        this.loading = false
      }
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
