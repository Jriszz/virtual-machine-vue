<template>
  <div>
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="40%"
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
        <el-form-item label="站点代号" prop="site_code">
          <system-select v-model="form.site_code" :is-edit-scene="isEditScene"/>
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="资源路径" prop="api_url">
          <el-input v-model="form.api_url"/>
        </el-form-item>
        <el-form-item label="请求方法" prop="method">
          <el-select v-model="form.method" placeholder="请选择">
            <el-option key="GET" value="GET" label="GET" />
            <el-option key="POST" value="POST" label="POST" />
            <el-option key="PUT" value="PUT" label="PUT" />
            <el-option key="HEAD" value="HEAD" label="HEAD" />
            <el-option key="DELETE" value="DELETE" label="DELETE" />
          </el-select>
        </el-form-item>
        <el-form-item label="权限校验" prop="check">
          <el-radio-group v-model="form.check">
            <el-radio :label="true">校验</el-radio>
            <el-radio :label="false">不校验</el-radio>
          </el-radio-group>
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
  name: 'ResourceForm',
  components: { systemSelect },

  data() {
    return {
      labelWidth: '120px',
      loading: false,
      errorflag: false,
      errorinfo: '',
      title: '资源详情',
      isEditScene: false,
      isDetailScene: false,
      isAddScene: false,
      form: this.initForm(),
      rules: {
        name: [{ required: true, message: '资源必填', trigger: 'blur' }],
        site_code: [{ required: true, message: '所属站点代号必填', trigger: 'blur' }],
        api_url: [{ required: true, message: '资源路径必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    dialogVisible: {
      get: function() {
        return this.$store.state.resources.resourceFormVisable
      },
      set: function() {
      }
    }
  },
  watch: {
    dialogVisible: function(old_value, new_value) {
      // this.form 赋值
      if (this.$store.state.resources.resourceFormType === 'Add') {
        this.form = this.initForm()
        this.isAddScene = true
      } else {
        this.form = this.$store.state.resources.selectResource
        this.isAddScene = false
      }
      // this.isDetailScene 赋值
      if (this.$store.state.resources.resourceFormType === 'Info') {
        this.isDetailScene = true
      } else {
        this.isDetailScene = false
      }
      // this.isEditScene 赋值
      if (this.$store.state.resources.resourceFormType === 'Edit') {
        this.isEditScene = true
      } else {
        this.isEditScene = false
      }
      // this.title 赋值
      this.title = this.getTitle()
      // 获取站点详情
      if (old_value && this.$store.state.resources.resourceFormType !== 'Add') {
        this.getResourceDetail()
      }
    }
  },
  methods: {
    initForm() {
      const _form = {
        site_code: '',
        name: '',
        api_url: '',
        method: '',
        check: false
      }
      return _form
    },
    getResourceDetail() {
      this.loading = true
      this.errorflag = false
      this.$store.dispatch('GetResourceDetail', this.form.id).then((response) => {
        this.loading = false
        this.form = response.data
      })
    },
    submit(form) {
      this.loading = true
      let submitType
      if (this.$store.state.resources.resourceFormType === 'Add') {
        submitType = 'AddResource'
      } else {
        submitType = 'EditResource'
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
      this.$store.commit('CLOSE_RESOURCE_FORM')
    },
    getTitle() {
      if (this.$store.state.resources.resourceFormType === 'Add') return '新增资源'
      else if (this.$store.state.resources.resourceFormType === 'Edit') return '编辑资源'
      else return '资源详情'
    }
  }
}
</script>
