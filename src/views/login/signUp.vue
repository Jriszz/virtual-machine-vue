<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      @close="closeDialog">
      <div class="formTitle">
        <span>新用户注册</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :label-width="labelWidth"
        :model="form"
        :rules="rules"
        size="big">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" show-password/>
        </el-form-item>
        <el-form-item label="密码2" prop="password2">
          <el-input v-model="form.password2" show-password/>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email"/>
        </el-form-item>
        <el-form-item label="别名" prop="alias">
          <el-input v-model="form.alias"/>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
            <el-radio :label="0">未知</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button @click="submit('form')">提交</el-button>
          <el-button @click="closeDialog">关闭</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UserForm',
  components: {},

  data() {
    return {
      labelWidth: '120px',
      loading: false,
      errorflag: false,
      errorinfo: '',
      form: this.initForm(),
      rules: {
        name: [{ required: true, message: '姓名必填', trigger: 'blur' }],
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        password2: [{ required: true, message: '密码2必填', trigger: 'blur' }],
        phone: [{ required: true, message: '手机必填', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱必填，且只支持@xsyxsc.com后缀邮箱', trigger: 'blur' }]
      }
    }
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.$store.state.users.userSignUpVisable
      },
      set: function() {
      }
    }
  },
  watch: {
  },
  methods: {
    initForm() {
      const _form = {
        name: '',
        username: '',
        phone: '',
        email: '',
        alias: '',
        password: '',
        password2: '',
        gender: 1
      }
      return _form
    },
    submit(form) {
      this.loading = true
      this.$refs[form].validate(valid => {
        if (!valid) {
          this.loading = false
          return false
        }
        const params = this.tools.cleanObjNullProperty(this.form)
        this.$store.dispatch('Signup', params).then(() => {
          this.loading = false
          this.form = this.initForm()
          this.$store.commit('CLOSE_SIGNUP_FORM')
        }).catch(() => {
          this.loading = false
        })
      })
    },
    reset() {
      this.form = this.initForm()
    },
    closeDialog() {
      this.$store.commit('CLOSE_SIGNUP_FORM')
    }
  }
}
</script>
