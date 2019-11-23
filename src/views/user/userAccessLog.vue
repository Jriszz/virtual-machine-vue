<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>用户访问日志列表</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :model="form"
        :label-width="labelWidth"
        size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="系统站点">
              <system-select v-model="form.site_name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方法">
              <el-select v-model="form.method" clearable placeholder="请选择">
                <el-option value="GET" label="GET" />
                <el-option value="POST" label="POST" />
                <el-option value="PUT" label="PUT" />
                <el-option value="DELETE" label="DELETE" />
                <el-option value="HEAD" label="HEAD" />
                <el-option value="PATCH" label="PATCH" />
                <el-option value="OPTIONS" label="OPTIONS" />
                <el-option value="CONNECT" label="CONNECT" />
                <el-option value="TRACE" label="TRACE" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="接口描述">
              <el-input v-model="form.api_desc"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接口地址">
              <el-input v-model="form.api_url"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始日期">
              <el-date-picker v-model="form.start_date" type="date" value-format="yyyy-MM-dd" placeholder="请选择开始日期" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期">
              <el-date-picker v-model="form.end_date" type="date" value-format="yyyy-MM-dd" placeholder="请选择结束日期" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isSuperAdmin">
          <el-col :span="12">
            <el-form-item label="用户姓名">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名">
              <el-input v-model="form.username" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="info"
            plain
            @click="getUserAccessLogList('form')">查询</el-button>
          <el-button
            type="info"
            plain
            @click="reset('form')">重置</el-button>
        </el-form-item>
      </el-form>

      <el-alert
        v-show="errorflag"
        :description="errorinfo"
        title="获取人员列表失败！"
        type="error"
        show-icon
        @close="errorflag=false"/>

      <el-card>
        <el-table
          :data="userAccessLogList"
          :stripe="true"
          :border="true">
          <el-table-column
            prop="access_time"
            width="170"
            label="访问时间"/>
          <el-table-column
            prop="name"
            width="150"
            label="访问人"/>
          <el-table-column
            prop="username"
            width="170"
            label="用户名"/>
          <el-table-column
            prop="site_name"
            width="80"
            label="站点"/>
          <el-table-column
            prop="domain"
            width="180"
            label="域名"/>
          <el-table-column
            prop="method"
            width="80"
            label="请求类型"/>
          <el-table-column
            prop="api_url"
            min-width="250"
            label="接口路径"/>
          <el-table-column
            prop="api_desc"
            min-width="250"
            label="接口描述"/>
        </el-table>
        <div class="block">
          <el-pagination
            :current-page="form.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="form.page_size"
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
import { MessageBox } from 'element-ui'
import systemSelect from '@/components/systemSelect'

export default {
  name: 'UserList',
  components: { MessageBox, systemSelect },

  data() {
    return {
      labelWidth: this.config.labelWidth,
      loading: false,
      errorflag: false,
      errorinfo: '',
      userAccessLogList: [],
      form: this.initForm(),
      totals: 0
    }
  },
  computed: {
    username: function() {
      return this.$store.state.user.username
    },
    // this.isSuperAdmin 当前用户是否为管理员
    isSuperAdmin: function() {
      if (this.$store.state.users.sessionUser.super_admin === 1) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    this.getUserAccessLogList('form')
  },
  methods: {
    initForm() {
      const _form = {
        username: null,
        site_name: null,
        api_url: null,
        api_desc: null,
        method: null,
        name: null,
        start_date: null,
        end_date: null,
        page: 1,
        pageSize: 10
      }
      return _form
    },
    getUserAccessLogList(form) {
      this.resetResult()
      this.loading = true
      this.errorflag = false
      this.$refs[form].validate(valid => {
        const params = this.tools.cleanObjNullProperty(this.form)
        this.$store.dispatch('GetUserAccessLogList', params).then((response) => {
          this.loading = false
          this.userAccessLogList = response.data.access_logs
          this.totals = response.data.totals
        }).catch(() => {
          this.loading = false
        })
      })
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
      this.getUserAccessLogList('form')
    },
    changeCurrentPage(val) {
      this.form.page = val
      this.getUserAccessLogList('form')
    }
    // 分页相关的方法
  }
}
</script>
