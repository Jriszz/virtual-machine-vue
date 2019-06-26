<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      @close="closeDialog">
      <div class="formTitle">
        <span>重置用户密码</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :label-width="labelWidth"
        :model="form"
        :rules="rules"
        :disabled="isDetailScene"
        size="small">
        <el-form-item v-show="false" label="用户ID">
          <el-input v-model="form.id"/>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="form.password"/>
        </el-form-item>
        <el-form-item label="新密码2" prop="password2">
          <el-input v-model="form.password2"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="submit('form')">提交</el-button>
          <el-button @click="closeDialog">关闭</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ResetPasswordForm',
  components: {},

  data() {
    return {
      labelWidth: '120px',
      loading: false,
      errorflag: false,
      errorinfo: '',
      isEditScene: false,
      isDetailScene: false,
      form: this.initForm(),
      rules: {
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        password2: [{ required: true, message: '密码2必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.$store.state.users.resetPasswordFormVisable
      },
      set: function() {
      }
    }
  },
  watch: {
    dialogVisible: function() {
      // this.form 赋值
      this.form['id'] = this.$store.state.users.selectUser.id
    }
  },
  methods: {
    initForm() {
      const _form = {
        id: '',
        password: '',
        password2: ''
      }
      return _form
    },
    submit(form) {
      this.loading = true
      this.$refs[form].validate(valid => {
        const params = this.tools.cleanObjNullProperty(this.form)
        this.$store.dispatch('ResetUserPassword', params).then(() => {
          this.loading = false
          this.form = this.initForm()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    closeDialog() {
      this.$store.commit('CLOSE_RESET_PASSWORD_FORM')
    }
  }
}
</script>
