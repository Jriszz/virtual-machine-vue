<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>个人信息</span>
      </div>
      <el-row>
        <el-col :span="12">
          <el-form
            v-loading="loading"
            ref="form"
            :label-width="labelWidth"
            :model="form"
            :disabled="actionType==='Info'"
            :rules="rules"
            width="800px"
            size="small">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name"/>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input :disabled="true" v-model="form.username"/>
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
            <el-form-item label="工号" prop="job_no">
              <el-input :disabled="!isSuperAdmin" v-model="form.job_no"/>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
                <el-radio :label="0">末知</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="actionType==='Info'" label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">在职</el-radio>
                <el-radio :label="2">离职</el-radio>
                <el-radio :label="0">冻结</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="部门" prop="phone">
          <el-input v-model="form.phone"/>
        </el-form-item> -->
            <el-form-item v-if="actionType==='Info'" label="是否管理员" prop="super_admin">
              <el-radio-group v-model="form.super_admin">
                <el-radio :label="1">管理员</el-radio>
                <el-radio :label="0">普通用户</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="actionType==='Info'" label="注册时间">
              <el-input v-model="form.create_time"/>
            </el-form-item>
            <el-form-item v-if="actionType==='Info'" label="修改时间">
              <el-input v-model="form.update_time"/>
            </el-form-item>
            <el-form-item v-if="actionType==='Info'" label="最近一次登陆">
              <el-input v-model="form.last_login_time"/>
            </el-form-item>
            <el-form-item v-if="actionType==='Info'" label="最近修改密码">
              <el-input v-model="form.last_modify_password_time"/>
            </el-form-item>
            <el-form-item v-if="actionType==='Info'" label="最近重置密码">
              <el-input v-model="form.last_reset_password_time"/>
            </el-form-item>
            <el-form-item v-if="actionType==='Edit'">
              <el-button @click="submit('form')">提交</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="changeType">
            <span v-if="actionType==='Info'">修改用户信息</span>
            <span v-if="actionType==='Edit'">切换为详情模式</span>
          </el-button>
          <el-button type="primary" @click="modifyPassword">修改密码</el-button>
        </el-col>
      </el-row>
    </el-card>
    <modify-password-form/>
  </div>
</template>

<script>
import modifyPasswordForm from '@/views/user/modifyPasswordForm'
import { Message } from 'element-ui'
export default {
  name: 'Dashboard',
  components: { modifyPasswordForm },

  data() {
    return {
      labelWidth: '120px',
      loading: false,
      errorflag: false,
      errorinfo: '',
      actionType: 'Info',
      form: this.initForm(),
      rules: {
        name: [{ required: true, message: '姓名必填', trigger: 'blur' }],
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        phone: [{ required: true, message: '手机必填', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    isSuperAdmin: function() {
      if (this.$store.state.users.sessionUser.roles.indexOf('super_admin') !== -1) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    actionType: function() {
      this.form = this.initForm()
    }
  },
  methods: {
    submit(form) {
      this.loading = true
      this.$refs[form].validate(valid => {
        if (!valid) {
          this.loading = false
          return false
        }
        const params = this.tools.cleanObjNullProperty(this.form)
        this.$store.dispatch('EditUser', params).then((response) => {
          this.loading = false
          this.form = this.initForm()
          this.changeType()
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
      console.log('reset')
      this.form = {}
      const new_form = this.initForm()
      console.log(new_form)
      this.form = new_form
    },
    changeType() {
      if (this.actionType === 'Info') {
        this.actionType = 'Edit'
      } else {
        this.actionType = 'Info'
      }
    },
    modifyPassword() {
      this.$store.commit('OPEN_MODIFY_PASSWORD_FORM')
    },
    initForm() {
      console.log('initForm')
      const _form = this.$store.state.users.sessionUser
      return _form
    }
  }
}
</script>

<style lang="less">
.el-input.is-disabled .el-input__inner {
  color: #666666;
  cursor: pointer;
}
</style>

