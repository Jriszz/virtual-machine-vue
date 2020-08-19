<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="60%"
      @close="closeDialog">
      <div class="formTitle">
        <span>资源所属角色维护</span>
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
        <el-form-item label="选择角色">
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
            width="120"
            label="所属站点代号"/>
          <el-table-column
            prop="site_name"
            width="200"
            label="所属站点名称"/>
          <el-table-column
            prop="name"
            width="250"
            label="角色名称"/>
          <el-table-column
            prop="code"
            width="100"
            label="角色代码"/>
          <el-table-column
            prop="desc"
            label="角色描述"/>
          <el-table-column
            v-if="isSuperAdmin"
            width="80"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="danger" plain @click="removeRole(scope.row)">移除</el-button>
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
  name: 'RoleResourceListForm',
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
        return this.$store.state.resources.resourceRoleFormVisable
      },
      set: function() {
      }
    },
    resource_id: function() {
      return this.$store.state.resources.selectResource.id
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
        this.getCurrentResourceRoleList()
      }
    }
  },
  methods: {
    submit(form) {
      this.loading = true
      if (this.role_id && this.role_id > 0) {
        const params = { 'resource_id': this.resource_id, 'role_id': this.role_id }
        this.$store.dispatch('ResourceJoinRole', params).then((response) => {
          this.$store.dispatch('GetResourceRoleList', this.resource_id).then(response => {
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
          message: '请先选择资源再提交',
          type: 'error',
          duration: 5 * 1000
        })
        return false
      }
    },
    getCurrentResourceRoleList() {
      this.loading = true
      this.$store.dispatch('GetResourceRoleList', this.resource_id).then((response) => {
        this.roleList = response.data
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
      })
    },
    closeDialog() {
      this.$store.commit('CLOSE_RESOURCE_ROLE_FORM')
    },
    removeRole(role) {
      const params = { 'resource_id': this.resource_id, 'role_id': role.id }
      this.$store.dispatch('ResourceLeaveRole', params).then(() => {
        this.loading = false
        this.roleList = this.roleList.filter(item => item.id !== role.id)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
