<template>
  <div>
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      @close="closeDialog">
      <div class="formTitle">
        <span>修改用户密码</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :label-width="labelWidth"
        :model="form"
        :rules="rules"
        :disabled="isDetailScene"
        size="small">
        <el-form-item label="旧密码" prop="password">
          <el-input v-model="form.password" show-password/>
        </el-form-item>
        <el-form-item label="新密码" prop="password_new">
          <el-input v-model="form.password_new" show-password/>
        </el-form-item>
        <el-form-item label="新密码2" prop="password_new2">
          <el-input v-model="form.password_new2" show-password/>
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
import { Message } from 'element-ui'
export default {
  name: 'ModifyPasswordForm',
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
        password: [{ required: true, message: '旧密码必填', trigger: 'blur' }],
        password_new: [{ required: true, message: '新密码必填', trigger: 'blur' }],
        password_new2: [{ required: true, message: '新密码2必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.$store.state.users.modifyPasswordFormVisable
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
        password: '',
        password_new: '',
        password_new2: ''
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
        this.$store.dispatch('ModifyUserPassword', params).then((response) => {
          this.loading = false
          this.form = this.initForm()
          if (response.error_code === 0) {
            Message({
              message: response.msg,
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('LogOut').then(() => {
              Message({
                message: '密码修改成功，请重新登陆',
                type: 'success',
                duration: 5 * 1000
              })
            })
          }
        }).catch(() => {
          this.loading = false
        })
      })
    },
    closeDialog() {
      this.$store.commit('CLOSE_MODIFY_PASSWORD_FORM')
    }
  }
}
</script>
