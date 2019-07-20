<template>
  <div>
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      @close="closeDialog">
      <div class="formTitle">
        <span>{{ title }}</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :label-width="labelWidth"
        :model="form"
        :rules="rules"
        :disabled="isDetailScene"
        size="small">
        <el-form-item label="所属站点" prop="site_code">
          <system-select v-model="form.site_code" :is-edit-scene="isEditScene"/>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="角色代码" prop="code">
          <el-input v-model="form.code" :disabled="isEditScene"/>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="form.desc"/>
        </el-form-item>
        <el-form-item v-if="!isDetailScene">
          <el-button @click="submit('form')">提交</el-button>
          <el-button v-if="!isAddScene" @click="closeDialog">关闭</el-button>
          <el-button v-if="isAddScene" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import systemSelect from '@/components/systemSelect'

export default {
  name: 'RoleForm',
  components: { systemSelect },

  data() {
    return {
      labelWidth: '120px',
      loading: false,
      errorflag: false,
      errorinfo: '',
      title: '角色详情',
      isEditScene: false,
      isDetailScene: false,
      isAddScene: false,
      form: this.initForm(),
      rules: {
        name: [{ required: true, message: '角色名称必填', trigger: 'blur' }],
        code: [{ required: true, message: '角色代码必填', trigger: 'blur' }],
        site_code: [{ required: true, message: '所属站点必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.$store.state.roles.roleFormVisable
      },
      set: function() {
      }
    }
  },
  watch: {
    dialogVisible: function(old_value, new_value) {
      // this.form 赋值
      if (this.$store.state.roles.roleFormType === 'Add') {
        this.form = this.initForm()
        this.isAddScene = true
      } else {
        this.form = this.$store.state.roles.selectRole
        this.isAddScene = false
      }
      // this.isDetailScene 赋值
      if (this.$store.state.roles.roleFormType === 'Info') {
        this.isDetailScene = true
      } else {
        this.isDetailScene = false
      }
      // this.isEditScene 赋值
      if (this.$store.state.roles.roleFormType === 'Edit') {
        this.isEditScene = true
      } else {
        this.isEditScene = false
      }
      // this.title 赋值
      this.title = this.getTitle()
      // 获取角色详情
      if (old_value && this.$store.state.roles.roleFormType !== 'Add') {
        this.getRoleDetail()
      }
    }
  },
  methods: {
    initForm() {
      const _form = {
        name: '',
        code: '',
        desc: '',
        site_code: ''
      }
      return _form
    },
    getRoleDetail() {
      this.loading = true
      this.errorflag = false
      this.$store.dispatch('GetRoleDetail', this.form.id).then((response) => {
        this.loading = false
        this.form = response.data
      })
    },
    submit(form) {
      this.loading = true
      let submitType
      if (this.$store.state.roles.roleFormType === 'Add') {
        submitType = 'AddRole'
      } else {
        submitType = 'EditRole'
      }
      this.$refs[form].validate(valid => {
        if (!valid) {
          this.loading = false
          return false
        }
        const params = this.tools.cleanObjNullProperty(this.form)
        this.$store.dispatch(submitType, params).then((response) => {
          this.loading = false
          this.form = this.initForm()
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
      })
    },
    reset() {
      this.form = this.initForm()
    },
    closeDialog() {
      this.$store.commit('CLOSE_ROLE_FORM')
    },
    getTitle() {
      if (this.$store.state.roles.roleFormType === 'Add') return '新增角色'
      else if (this.$store.state.roles.roleFormType === 'Edit') return '编辑角色'
      else return '角色详情'
    }
  }
}
</script>
