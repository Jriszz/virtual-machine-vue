<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="60%"
      @close="closeDialog">
      <div class="formTitle">
        <span>角色资源维护</span>
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
        <el-form-item label="选择资源">
          <resource-select :initresourceid="resource_id" @change="resource_id=$event" />
        </el-form-item>
        <el-form-item>
          <el-button @click="submit('form')">提交</el-button>
          <el-button @click="closeDialog">关闭</el-button>
        </el-form-item>
      </el-form>

      <el-card>
        <el-table
          :data="resourceList"
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
            label="资源名称"/>
          <el-table-column
            prop="method"
            width="80"
            label="资源方法"/>
          <el-table-column
            prop="api_url"
            label="资源路径"/>
          <el-table-column
            v-if="isSuperAdmin"
            width="80"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="danger" plain @click="removeResource(scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import resourceSelect from '@/components/resourceSelect'
export default {
  name: 'RoleResourceListForm',
  components: { resourceSelect, Message },

  data() {
    return {
      form: {},
      resource_id: '',
      resourceList: [],
      labelWidth: this.config.labelWidth,
      loading: false,
      errorflag: false,
      errorinfo: ''
    }
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.$store.state.roles.roleResourceFormVisable
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
        this.resource_id = ''
        this.getCurrentRoleResourceList()
      }
    }
  },
  methods: {
    submit(form) {
      this.loading = true
      if (this.resource_id && this.resource_id > 0) {
        const params = { 'role_id': this.role_id, 'resource_id': this.resource_id }
        this.$store.dispatch('AddResourceToRole', params).then((response) => {
          this.$store.dispatch('GetRoleResourceList', this.role_id).then(response => {
            this.resourceList = response.data
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
    getCurrentRoleResourceList() {
      this.loading = true
      console.log(this.role_id)
      this.$store.dispatch('GetRoleResourceList', this.role_id).then((response) => {
        this.resourceList = response.data
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
      })
    },
    closeDialog() {
      this.$store.commit('CLOSE_ROLE_RESOURCE_FORM')
    },
    removeResource(resource) {
      const params = { 'role_id': this.role_id, 'resource_id': resource.id }
      this.$store.dispatch('RemoveResourcefromRole', params).then(() => {
        this.loading = false
        this.resourceList = this.resourceList.filter(item => item.id !== resource.id)
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
