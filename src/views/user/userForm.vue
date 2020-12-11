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
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input :disabled="isEditScene" v-model="form.username"/>
        </el-form-item>
        <el-form-item v-if="isAddScene" label="密码" prop="password">
          <el-input v-model="form.password" show-password/>
        </el-form-item>
        <el-form-item v-if="isAddScene" label="密码2" prop="password2">
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
        <el-form-item label="工号" prop="job_no">
          <el-input :disabled="!isSuperAdmin" v-model="form.job_no"/>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
            <el-radio :label="0">未知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="!isAddScene" label="状态" prop="status">
          <el-radio-group :disabled="!isSuperAdmin" v-model="form.status">
            <el-radio :label="1">在职</el-radio>
            <el-radio :label="2">离职</el-radio>
            <el-radio :label="0">冻结</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="部门" prop="phone">
          <el-input v-model="form.phone"/>
        </el-form-item> -->
        <el-form-item label="是否管理员" prop="super_admin">
          <el-radio-group :disabled="!isSuperAdmin" v-model="form.super_admin">
            <el-radio :label="1">管理员</el-radio>
            <el-radio :label="0">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="isDetailScene" label="注册时间">
          <el-input v-model="form.create_time"/>
        </el-form-item>
        <el-form-item v-if="isDetailScene" label="修改时间">
          <el-input v-model="form.update_time"/>
        </el-form-item>
        <el-form-item v-if="isDetailScene" label="最近一次登录">
          <el-input v-model="form.last_login_time"/>
        </el-form-item>
        <el-form-item v-if="isDetailScene" label="最近修改密码">
          <el-input v-model="form.last_modify_password_time"/>
        </el-form-item>
        <el-form-item v-if="isDetailScene" label="最近重置密码">
          <el-input v-model="form.last_reset_password_time"/>
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
export default {
  name: 'UserForm',
  components: {},

  data() {
    return {
      labelWidth: '120px',
      loading: false,
      errorflag: false,
      errorinfo: '',
      title: '用户详情',
      isEditScene: false,
      isDetailScene: false,
      isAddScene: false,
      isSuperAdmin: false,
      form: this.initForm(),
      rules: {
        name: [{ required: true, message: '姓名必填', trigger: 'blur' }],
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        password2: [{ required: true, message: '密码2必填', trigger: 'blur' }],
        phone: [{ required: true, message: '手机必填', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.$store.state.users.userFormVisable
      },
      set: function() {
      }
    }
  },
  watch: {
    dialogVisible: function() {
      // this.form 赋值
      if (this.$store.state.users.userFormType === 'Add') {
        this.form = this.initForm()
        this.isAddScene = true
      } else {
        this.form = this.$store.state.users.selectUser
        this.isAddScene = false
      }
      // this.isDetailScene 赋值
      if (this.$store.state.users.userFormType === 'Info') {
        this.isDetailScene = true
      } else {
        this.isDetailScene = false
      }
      // this.isEditScene 赋值
      if (this.$store.state.users.userFormType === 'Edit') {
        this.isEditScene = true
      } else {
        this.isEditScene = false
      }
      // this.title 赋值
      this.title = this.getTitle()
      // this.isSuperAdmin 当前用户是否为管理员
      if (this.$store.state.users.sessionUser.super_admin === 1) {
        this.isSuperAdmin = true
      } else {
        this.isSuperAdmin = false
      }
    }
  },
  methods: {
    initForm() {
      const _form = {
        name: '',
        username: '',
        phone: '',
        email: '',
        alias: '',
        job_no: '',
        password: '',
        password2: '',
        gender: 1,
        super_admin: 0
      }
      return _form
    },
    submit(form) {
      this.loading = true
      let submitType
      if (this.$store.state.users.userFormType === 'Add') {
        submitType = 'AddUser'
      } else {
        submitType = 'EditUser'
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
      this.$store.commit('CLOSE_USER_FORM')
    },
    getTitle() {
      if (this.$store.state.users.userFormType === 'Add') return '新增用户'
      else if (this.$store.state.users.userFormType === 'Edit') return '编辑用户'
      else return '用户详情'
    }
  }
}
</script>
