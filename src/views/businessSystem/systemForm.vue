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
        <el-form-item label="站点名称" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="站点描述" prop="desc">
          <el-input v-model="form.desc"/>
        </el-form-item>
        <el-form-item label="站点代号" prop="code">
          <el-input v-model="form.code"/>
        </el-form-item>
        <el-form-item label="接入令牌" prop="token">
          <el-input v-model="form.token"/>
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
  name: 'SystemForm',
  components: {},

  data() {
    return {
      labelWidth: '120px',
      loading: false,
      errorflag: false,
      errorinfo: '',
      title: '业务系统详情',
      isEditScene: false,
      isDetailScene: false,
      isAddScene: false,
      form: this.initForm(),
      rules: {
        name: [{ required: true, message: '姓名必填', trigger: 'blur' }],
        code: [{ required: true, message: '代号必填', trigger: 'blur' }],
        token: [{ required: true, message: '令牌必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.$store.state.systems.systemFormVisable
      },
      set: function() {
      }
    }
  },
  watch: {
    dialogVisible: function(old_value, new_value) {
      // this.form 赋值
      if (this.$store.state.systems.systemFormType === 'Add') {
        this.form = this.initForm()
        this.isAddScene = true
      } else {
        this.form = this.$store.state.systems.selectSystem
        this.isAddScene = false
      }
      // this.isDetailScene 赋值
      if (this.$store.state.systems.systemFormType === 'Info') {
        this.isDetailScene = true
      } else {
        this.isDetailScene = false
      }
      // this.isEditScene 赋值
      if (this.$store.state.systems.systemFormType === 'Edit') {
        this.isEditScene = true
      } else {
        this.isEditScene = false
      }
      // this.title 赋值
      this.title = this.getTitle()
      // 获取站点详情
      if (old_value && this.$store.state.systems.systemFormType !== 'Add') {
        this.getSystemDetail()
      }
    }
  },
  methods: {
    initForm() {
      const _form = {
        name: '',
        code: '',
        desc: '',
        token: ''
      }
      return _form
    },
    getSystemDetail() {
      this.loading = true
      this.errorflag = false
      this.$store.dispatch('GetSystemDetail', this.form.id).then((response) => {
        this.form = response.data
      })
      this.loading = false
    },
    submit(form) {
      this.loading = true
      let submitType
      if (this.$store.state.systems.systemFormType === 'Add') {
        submitType = 'AddSystem'
      } else {
        submitType = 'EditSystem'
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
      this.$store.commit('CLOSE_SYSTEM_FORM')
    },
    getTitle() {
      if (this.$store.state.systems.systemFormType === 'Add') return '新增业务系统'
      else if (this.$store.state.systems.systemFormType === 'Edit') return '编辑业务系统'
      else return '业务系统详情'
    }
  }
}
</script>
