<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>角色列表</span>
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
            <el-form-item label="角色名称">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="角色代码">
              <el-input v-model="form.code" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="info"
            plain
            @click="getRoleList('form')">查询</el-button>
          <el-button
            type="info"
            plain
            @click="reset('form')">重置</el-button>
          <el-button
            type="primary"
            plain
            @click="openRoleForm(null, 'Add')">新增</el-button>
        </el-form-item>
      </el-form>

      <el-alert
        v-show="errorflag"
        :description="errorinfo"
        title="获取角色列表失败！"
        type="error"
        show-icon
        @close="errorflag=false"/>

      <el-card>
        <el-table
          :data="roleList"
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
            width="200"
            label="角色名称"/>
          <el-table-column
            prop="code"
            width="200"
            label="角色代号"/>
          <el-table-column
            prop="desc"
            label="角色描述"/>
          <el-table-column
            label="操作"
            width="300">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="openMemberForm(scope.row)">成员</el-button>
              <el-button size="mini" type="primary" plain @click="openResourceForm(scope.row)">资源</el-button>
              <el-button size="mini" type="primary" plain @click="openRoleForm(scope.row, 'Edit')">修改</el-button>
              <el-button size="mini" type="danger" plain @click="deleteRole(scope.row)">删除</el-button>
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
    <role-form />
    <role-member-list-form />
    <role-resource-list-form />
  </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'
import roleForm from './roleForm'
import systemSelect from '@/components/systemSelect'
import roleMemberListForm from './roleMemberListForm'
import roleResourceListForm from './roleResourceListForm'

export default {
  name: 'RoleList',
  components: { roleForm, MessageBox, Message, systemSelect, roleMemberListForm, roleResourceListForm },

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
    roleList: function() {
      return this.$store.state.roles.roleList
    }
  },
  mounted() {
    this.getRoleList('form')
  },
  methods: {
    initForm() {
      const _form = {
        name: '',
        code: '',
        site_code: '',
        page: 1,
        pageSize: 10
      }
      return _form
    },
    getRoleList(form) {
      this.resetResult()
      this.loading = true
      this.errorflag = false
      this.$refs[form].validate(valid => {
        const params = this.tools.cleanObjNullProperty(this.form)
        this.$store.dispatch('GetRoleList', params).then((response) => {
          this.loading = false
          this.totals = response.data.totals
        }).catch(() => {
          this.loading = false
        })
      })
    },
    openRoleForm(role, type) {
      this.$store.commit('OPEN_ROLE_FORM', { type, role })
    },
    openMemberForm(role) {
      this.$store.commit('OPEN_ROLE_MEMBER_FORM', { role })
    },
    openResourceForm(role) {
      this.$store.commit('OPEN_ROLE_RESOURCE_FORM', { role })
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
    addRole() {
      this.$store.commit('OPEN_ROLE_FORM', { type: 'Add', role: null })
    },
    editRole(role) {
      this.$store.commit('OPEN_ROLE_FORM', { type: 'Edit', role })
    },
    deleteRole(role) {
      MessageBox.confirm(
        '此操作将删除角色【' + role.name + '】，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }
      ).then(() => {
        this.$store.dispatch('DeleteRole', role.id).then((response) => {
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
    enableRole(role) {
      MessageBox.confirm(
        '此操作将允许角色【' + role.name + '】接入用户中心，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '允许',
          cancelButtonText: '取消'
        }
      ).then(() => {
        this.$store.dispatch('EnableRole', role.id).then((response) => {
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
      this.getRoleList('form')
    },
    changeCurrentPage(val) {
      this.form.page = val
      this.getRoleList('form')
    }
    // 分页相关的方法
  }
}
</script>
