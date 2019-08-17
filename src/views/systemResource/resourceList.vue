<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>资源列表</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :model="form"
        :label-width="labelWidth"
        size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属站点">
              <system-select v-model="form.site_code" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="权限校验">
              <el-radio-group v-model="form.check">
                <el-radio label="all">全部</el-radio>
                <el-radio label="yes">校验</el-radio>
                <el-radio label="no">不校验</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="资源路径">
              <el-input v-model="form.api_url" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源名称">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="info"
            plain
            @click="getResourceList">查询</el-button>
          <el-button
            type="info"
            plain
            @click="reset('form')">重置</el-button>
          <el-button
            type="primary"
            plain
            @click="openResourceForm(null, 'Add')">新增</el-button>
        </el-form-item>
      </el-form>

      <el-alert
        v-show="errorflag"
        :description="errorinfo"
        title="获取资源列表失败！"
        type="error"
        show-icon
        @close="errorflag=false"/>

      <el-card>
        <el-table
          :data="resourceList"
          :stripe="true"
          :border="true">
          <el-table-column
            prop="site_code"
            width="120"
            label="所属站点代号"/>
          <el-table-column
            prop="site_name"
            width="200"
            label="所属站点名称"/>
          <el-table-column
            prop="name"
            width="250"
            label="资源名称"/>
          <el-table-column
            prop="check"
            width="80"
            label="权限校验">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.check"
                active-color="#13ce66"
                inactive-color="#999999"
                @change="enableResourceCheck(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="method"
            width="80"
            label="资源方法"/>
          <el-table-column
            prop="api_url"
            label="资源路径"/>
          <el-table-column
            label="操作"
            width="220">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="openResourceRoleForm(scope.row)">角色</el-button>
              <el-button v-if="isSuperAdmin" size="mini" type="primary" plain @click="openResourceForm(scope.row, 'Edit')">修改</el-button>
              <el-button v-if="isSuperAdmin" size="mini" type="danger" plain @click="deleteResource(scope.row)">删除</el-button>
            </template>
          </el-table-column>
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
    <resource-form />
    <resource-role-list-form />
  </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'
import resourceForm from './resourceForm'
import resourceRoleListForm from './resourceRoleListForm'
import systemSelect from '@/components/systemSelect'

export default {
  name: 'ResourceList',
  components: { resourceForm, MessageBox, Message, systemSelect, resourceRoleListForm },

  data() {
    return {
      labelWidth: this.config.labelWidth,
      loading: false,
      errorflag: false,
      errorinfo: '',
      form: this.initForm(),
      totals: 0
    }
  },
  computed: {
    resourceList: function() {
      return this.$store.state.resources.resourceList
    },
    isSuperAdmin: function() {
      if (this.$store.state.users.sessionUser.super_admin === 1) {
        return true
      } else {
        return false
      }
    },
    refresh: function() {
      return this.$store.state.resources.refresh
    }
  },
  watch: {
    refresh: function(newValue, oldValue) {
      if (newValue === true) {
        this.getResourceList()
        this.$store.commit('FINISH_REFRESH')
      }
    }
  },
  mounted() {
    this.getResourceList()
  },
  methods: {
    initForm() {
      const _form = {
        name: '',
        site_code: '',
        api_url: '',
        check: 'yes',
        page: 1,
        pageSize: 10
      }
      return _form
    },
    async getResourceList() {
      this.resetResult()
      this.loading = true
      this.errorflag = false
      const params = this.tools.cleanObjNullProperty(this.form)
      const res = await this.$store.dispatch('GetResourceList', params)
      if (res.error_code === 0) {
        this.totals = res.data.totals
      } else {
        console.log(res)
      }
      this.loading = false
    },
    // 启用资源权限校验
    async enableResourceCheck(record) {
      const params = this.tools.cleanObjNullProperty(record)
      const res = await this.$store.dispatch('EditResource', params)
      if (res.error_code === 0) {
        Message({
          message: res.msg,
          type: 'success',
          duration: 5 * 1000
        })
      } else {
        record.check = !record.check
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
      }
    },
    openResourceForm(resource, type) {
      this.$store.commit('OPEN_RESOURCE_FORM', { type, resource })
    },
    openResourceRoleForm(resource) {
      this.$store.commit('OPEN_RESOURCE_ROLE_FORM', resource)
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
    addResource() {
      this.$store.commit('OPEN_RESOURCE_FORM', { type: 'Add', resource: null })
    },
    editResource(resource) {
      this.$store.commit('OPEN_RESOURCE_FORM', { type: 'Edit', resource })
    },
    async deleteResource(resource) {
      const opt = await MessageBox.confirm(
        '此操作将删除资源【' + resource.name + '】，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }
      ).catch(() => {
      })
      if (opt === 'confirm') {
        const res = await this.$store.dispatch('DeleteResource', resource.id)
        if (res.error_code === 0) {
          this.getResourceList()
          Message({
            message: res.msg,
            type: 'success',
            duration: 5 * 1000
          })
        } else {
          console.log(res)
        }
      }
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
      this.getResourceList()
    },
    changeCurrentPage(val) {
      this.form.page = val
      this.getResourceList()
    }
    // 分页相关的方法
  }
}
</script>
