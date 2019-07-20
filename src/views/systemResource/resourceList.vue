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
          <el-col :span="8">
            <el-form-item label="所属站点">
              <system-select v-model="form.site_code" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资源名称">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="资源路径">
              <el-input v-model="form.api_url" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="info"
            plain
            @click="getResourceList('form')">查询</el-button>
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
            prop="method"
            width="80"
            label="资源方法"/>
          <el-table-column
            prop="api_url"
            label="资源路径"/>
          <el-table-column
            label="操作"
            width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="openResourceForm(scope.row, 'Edit')">修改</el-button>
              <el-button size="mini" type="danger" plain @click="deleteResource(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'
import resourceForm from './resourceForm'
import systemSelect from '@/components/systemSelect'

export default {
  name: 'ResourceList',
  components: { resourceForm, MessageBox, Message, systemSelect },

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
    }
  },
  mounted() {
    this.getResourceList('form')
  },
  methods: {
    initForm() {
      const _form = {
        name: '',
        site_code: '',
        api_url: '',
        page: 1,
        pageSize: 10
      }
      return _form
    },
    getResourceList(form) {
      this.resetResult()
      this.loading = true
      this.errorflag = false
      this.$refs[form].validate(valid => {
        const params = this.tools.cleanObjNullProperty(this.form)
        this.$store.dispatch('GetResourceList', params).then((response) => {
          this.loading = false
          this.totals = response.data.totals
        }).catch(() => {
          this.loading = false
        })
      })
    },
    openResourceForm(resource, type) {
      this.$store.commit('OPEN_RESOURCE_FORM', { type, resource })
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
    deleteResource(resource) {
      MessageBox.confirm(
        '此操作将删除资源【' + resource.name + '】，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }
      ).then(() => {
        this.$store.dispatch('DeleteResource', resource.id).then((response) => {
          this.loading = false
          if (response.error_code === 0) {
            Message({
              message: response.msg,
              type: 'success',
              duration: 5 * 1000
            })
          }
        }).catch(() => {
          this.loading = false
        })
      }).catch(action => {})
    },
    enableResource(resource) {
      MessageBox.confirm(
        '此操作将允许资源【' + resource.name + '】接入用户中心，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '允许',
          cancelButtonText: '取消'
        }
      ).then(() => {
        this.$store.dispatch('EnableResource', resource.id).then((response) => {
          this.loading = false
          if (response.error_code === 0) {
            Message({
              message: response.msg,
              type: 'success',
              duration: 5 * 1000
            })
          }
        }).catch(() => {
          this.loading = false
        })
      }).catch(action => {})
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
      this.getResourceList('form')
    },
    changeCurrentPage(val) {
      this.form.page = val
      this.getResourceList('form')
    }
    // 分页相关的方法
  }
}
</script>
