<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>用户列表</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :model="form"
        :label-width="labelWidth"
        size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="用户姓名">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登陆名">
              <el-input v-model="form.username" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否管理员">
              <el-radio-group v-model="form.super_admin">
                <el-radio :label="999">全部</el-radio>
                <el-radio :label="1">管理员</el-radio>
                <el-radio :label="0">非管理员</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="手机号码">
              <el-input v-model="form.phone"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户邮箱">
              <el-input v-model="form.email"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="info"
            plain
            @click="getUserList('form')">查询</el-button>
          <el-button
            type="info"
            plain
            @click="reset('form')">重置</el-button>
          <el-button
            v-if="isSuperAdmin"
            type="primary"
            plain
            @click="openUserForm(null, 'Add')">新增</el-button>
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
          :data="userList"
          :stripe="true"
          :border="true">
          <el-table-column
            prop="username"
            width="120"
            label="用户名"/>
          <el-table-column
            prop="name"
            width="120"
            label="姓名"/>
          <el-table-column
            width="60"
            label="性别">
            <template slot-scope="scope">
              <span v-if="scope.row.gender===1">男</span>
              <span v-else-if="scope.row.gender===2">女</span>
              <span v-else>未知</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            width="120"
            label="手机"/>
          <el-table-column
            prop="email"
            width="200"
            label="邮箱"/>
          <el-table-column
            width="100"
            label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status===1">在职</span>
              <span v-else-if="scope.row.gender===0">离职</span>
              <span v-else>冻结</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="job_no"
            width="100"
            label="工号"/>
          <el-table-column
            prop="department_name"
            width="200"
            label="部门"/>
          <el-table-column
            prop="alias"
            width="120"
            label="花名"/> -->
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="openUserRoleForm(scope.row)">角色</el-button>
              <el-button v-if="isSuperAdmin" size="mini" type="primary" plain @click="resetPassword(scope.row)">重置密码</el-button>
              <el-button size="mini" type="primary" plain @click="openUserForm(scope.row, 'Edit')">修改</el-button>
              <el-button size="mini" type="primary" plain @click="openUserForm(scope.row, 'Info')">详情</el-button>
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
    <user-form />
    <reset-password-form />
    <user-role-list-form />
  </div>
</template>

<script>
import { MessageBox } from 'element-ui'
import userForm from './userForm'
import resetPasswordForm from './resetPasswordForm'
import userRoleListForm from './userRoleListForm'

export default {
  name: 'UserList',
  components: { userForm, resetPasswordForm, MessageBox, userRoleListForm },

  data() {
    return {
      labelWidth: this.config.labelWidth,
      loading: false,
      errorflag: false,
      errorinfo: '',
      form: this.initform(),
      totals: 0
    }
  },
  computed: {
    userList: function() {
      return this.$store.state.users.userList
    },
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
    this.getUserList('form')
  },
  methods: {
    initform() {
      const _form = {
        name: '',
        phone: '',
        email: '',
        username: '',
        super_admin: 999,
        page: 1,
        pageSize: 10
      }
      return _form
    },
    getUserList(form) {
      this.resetResult()
      this.loading = true
      this.errorflag = false
      this.$refs[form].validate(valid => {
        const params = this.tools.cleanObjNullProperty(this.form)
        this.$store.dispatch('GetUserList', params).then((response) => {
          this.loading = false
          this.totals = response.data.totals
        }).catch(() => {
          this.loading = false
        })
      })
    },
    resetPassword(user) {
      this.$store.commit('OPEN_RESET_PASSWORD_FORM', user)
    },
    openUserRoleForm(user) {
      this.$store.commit('OPEN_USER_ROLE_FORM', user)
    },
    openUserForm(user, type) {
      this.$store.commit('OPEN_USER_FORM', { type, user })
    },
    reset() {
      this.form = this.initform()
      this.resetResult()
      this.totals = 0
    },
    resetResult() {
      this.errorflag = false
      this.result = []
    },
    addUser() {
      this.$store.commit('OPEN_USER_FORM', { type: 'Add', user: null })
    },
    editUser(user) {
      this.$store.commit('OPEN_USER_FORM', { type: 'Edit', user })
    },
    deleteUser(user) {
      MessageBox.confirm(
        '此操作将删除注册中心【' + user.address + '】，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }
      ).then(() => {
        this.$store.dispatch('DeleteUser', user.id).then(() => {
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }).catch(action => {})
    },
    switchStatus(user) {
      this.$store.dispatch('SwitchStatus', user.id).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    clearup(user) {
      MessageBox.confirm(
        '此操作将清空注册中心【' + user.address + '】下的所有服务，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '清空',
          cancelButtonText: '取消'
        }
      ).then(() => {
        this.$store.dispatch('Clearup', user.address).then(() => {
        }).catch(action => {})
      })
    },
    discoverServer(user) {
      MessageBox.confirm(
        '此操作将探测注册中心【' + user.address + '】下的所有服务，耗时大约30秒，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '探测',
          cancelButtonText: '取消'
        }
      ).then(() => {
        this.$store.dispatch('DiscoverServer', user.address).then(() => {
        }).catch(action => {})
      })
    },
    refreshMappingRole() {
      this.$store.dispatch('RefreshMappingRole').then(() => {
      }).catch(action => {})
    },
    openPasswordForm(user) {
      this.$store.commit('OPEN_PASSWORD_FORM', user)
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
      this.getUserList('form')
    },
    changeCurrentPage(val) {
      this.form.page = val
      this.getUserList('form')
    }
    // 分页相关的方法
  }
}
</script>
