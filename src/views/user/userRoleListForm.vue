<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="60%"
      @close="closeDialog">
      <div class="formTitle">
        <span>用户角色维护</span>
      </div>
      <el-form
        v-loading="loading"
        ref="form"
        :label-width="labelWidth"
        :disabled="!isSuperAdmin"
        :model="form"
        size="small">
        <el-form-item v-show="false" label="用户ID">
          <el-input v-model="user_id" />
        </el-form-item>
        <el-form-item label="加入角色">
          <role-select :initroleid="role_id" @change="role_id=$event" />
        </el-form-item>
        <el-form-item>
          <el-button @click="submit('form')">提交</el-button>
          <el-button @click="closeDialog">关闭</el-button>
        </el-form-item>
      </el-form>

      <el-card>
        <el-table
          :data="roleList"
          :stripe="true"
          :border="true"
          :height="500">
          <el-table-column
            prop="site_code"
            width="100"
            label="站点代码"/>
          <el-table-column
            prop="site_name"
            width="150"
            label="站点名称"/>
          <el-table-column
            prop="name"
            width="150"
            label="角色名称"/>
          <el-table-column
            prop="code"
            width="150"
            label="角色代码"/>
          <el-table-column
            prop="desc"
            label="角色描述"/>
          <el-table-column
            prop="join_time"
            width="150"
            label="加入时间"/>
          <el-table-column
            v-if="isSuperAdmin"
            width="80"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="danger" plain @click="leaveRole(scope.row)">离开</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import roleSelect from '@/components/roleSelect'
export default {
  name: 'UserRoleListForm',
  components: { roleSelect, Message },

  data() {
    return {
      form: {},
      role_id: '',
      roleList: [],
      labelWidth: this.config.labelWidth,
      loading: false,
      errorflag: false,
      errorinfo: ''
    }
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.$store.state.users.userRoleFormVisable
      },
      set: function() {
      }
    },
    user_id: function() {
      return this.$store.state.users.currentSelectUser.id
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
        this.role_id = ''
        this.getCurrentUserRoleList()
      }
    }
  },
  methods: {
    submit(form) {
      this.loading = true
      if (this.role_id && this.role_id > 0) {
        const params = { 'user_id': this.user_id, 'role_id': this.role_id }
        this.$store.dispatch('UserJoinRole', params).then((response) => {
          this.$store.dispatch('GetUserRoleList', this.user_id).then(response => {
            this.roleList = response.data
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
    getCurrentUserRoleList() {
      this.loading = true
      this.$store.dispatch('GetUserRoleList', this.user_id).then((response) => {
        this.roleList = response.data
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
      })
    },
    closeDialog() {
      this.$store.commit('CLOSE_USER_ROLE_FORM')
    },
    leaveRole(role) {
      const params = { 'user_id': this.user_id, 'role_id': role.id }
      this.$store.dispatch('UserLeaveRole', params).then(() => {
        this.loading = false
        this.roleList = this.roleList.filter(item => item.id !== role.id)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
