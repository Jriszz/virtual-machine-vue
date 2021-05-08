<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>兼容性修改记录列表</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :model="form"
        :label-width="labelWidth"
        size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="代码库名称">
              <el-input v-model="form.repo_name" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="修改作者">
              <el-input v-model="form.author" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提交描述">
              <el-input v-model="form.commit_msg" clearable placeholder="支持模糊查找"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button
            type="info"
            plain
            @click="getCompatibleRecordList">查询</el-button>
          <el-button
            type="info"
            plain
            @click="reset('form')">重置</el-button>
        </el-form-item>
      </el-form>

      <el-alert
        v-show="errorflag"
        :description="errorinfo"
        title="获取兼容性修改记录列表失败！"
        type="error"
        show-icon
        @close="errorflag=false"/>

      <el-card>
        <el-table
          :data="compatibleRecordList"
          :stripe="true"
          :border="true"
          size="small">
          <el-table-column
            width="300"
            label="代码仓库">
            <template slot-scope="scope">
              <el-link :href="scope.row.html_url" target="_blank">{{ scope.row.full_name }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="author"
            width="150"
            label="作者"/>
          <el-table-column
            label="修改描述">
            <template slot-scope="scope">
              <el-link :href="scope.row.commit_url" target="_blank">{{ scope.row.commit_msg }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            width="200"
            label="合入master大致时间"/>
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
import * as compatibles from '@/api/compatibles.js'

export default {
  name: 'PackageRecordList',
  components: { MessageBox, Message },

  data() {
    return {
      labelWidth: this.config.labelWidth,
      loading: false,
      errorflag: false,
      errorinfo: '',
      form: this.initForm(),
      compatibleRecordList: [],
      totals: 0
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
    this.getCompatibleRecordList()
  },
  methods: {
    initForm() {
      const _form = {
        repo_name: null,
        author: null,
        commit_msg: null,
        page: 1,
        pageSize: 10
      }
      return _form
    },
    async getCompatibleRecordList() {
      this.resetResult()
      this.loading = true
      this.errorflag = false
      const params = this.tools.cleanObjNullProperty(this.form)
      const res = await compatibles.getCompatibleList(params)
      if (res.error_code === 0) {
        this.totals = res.data.totals
        this.compatibleRecordList = res.data.records
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
      this.getCompatibleRecordList()
    },
    changeCurrentPage(val) {
      this.form.page = val
      this.getCompatibleRecordList()
    }
    // 分页相关的方法
  }
}
</script>
