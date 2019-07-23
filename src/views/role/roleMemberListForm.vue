<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="60%"
      @close="closeDialog">
      <div class="formTitle">
        <span>角色成员维护</span>
      </div>
      <el-form
        v-loading="loading"
        ref="form"
        :label-width="labelWidth"
        :disabled="!isSuperAdmin"
        :model="form"
        size="small">
        <el-form-item v-show="false" label="角色ID">
          <el-input v-model="role_id" />
        </el-form-item>
        <el-form-item label="选择人员">
          <user-select :inituserid="user_id" @change="user_id=$event" />
        </el-form-item>
        <el-form-item>
          <el-button @click="submit('form')">提交</el-button>
          <el-button @click="closeDialog">关闭</el-button>
        </el-form-item>
      </el-form>

      <el-card>
        <el-table
          :data="userList"
          :stripe="true"
          :border="true"
          :height="500">
          <el-table-column
            prop="username"
            width="150"
            label="用户名"/>
          <el-table-column
            prop="name"
            width="150"
            label="用户姓名"/>
          <el-table-column
            prop="phone"
            width="110"
            label="手机号码"/>
          <el-table-column
            prop="email"
            label="邮箱"/>
          <el-table-column
            prop="join_time"
            width="200"
            label="加入时间"/>
          <el-table-column
            v-if="isSuperAdmin"
            width="80"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="danger" plain @click="removeMember(scope.row)">离开</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import userSelect from '@/components/userSelect'
export default {
  name: 'RoleMemberListForm',
  components: { userSelect, Message },

  data() {
    return {
      form: {},
      user_id: '',
      userList: [],
      labelWidth: this.config.labelWidth,
      loading: false,
      errorflag: false,
      errorinfo: ''
    }
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.$store.state.roles.roleMemberFormVisable
      },
      set: function() {
      }
    },
    role_id: function() {
      return this.$store.state.roles.selectRole.id
    },
    isSuperAdmin: function() {
      if (this.$store.state.users.sessionUser.super_admin === 1) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    dialogVisible: function(newValue, oldValue) {
      if (newValue) {
        this.user_id = ''
        this.getCurrentRoleMemberList()
      }
    }
  },
  methods: {
    submit(form) {
      this.loading = true
      if (this.user_id && this.user_id > 0) {
        const params = { 'user_id': this.user_id, 'role_id': this.role_id }
        this.$store.dispatch('AddUserToRole', params).then((response) => {
          this.$store.dispatch('GetRoleMemberList', this.role_id).then(response => {
            this.userList = response.data
          })
          this.loading = false
        }).catch((err) => {
          this.loading = false
          console.log(err)
        })
      } else {
        this.loading = false
        Message({
          message: '请先选择角色再提交',
          type: 'error',
          duration: 5 * 1000
        })
        return false
      }
    },
    getCurrentRoleMemberList() {
      this.loading = true
      console.log(this.role_id)
      this.$store.dispatch('GetRoleMemberList', this.role_id).then((response) => {
        this.userList = response.data
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
      })
    },
    closeDialog() {
      this.$store.commit('CLOSE_ROLE_MEMBER_FORM')
    },
    removeMember(user) {
      const params = { 'role_id': this.role_id, 'user_id': user.id }
      this.$store.dispatch('RemoveUserfromRole', params).then(() => {
        this.loading = false
        this.userList = this.userList.filter(item => item.id !== user.id)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
