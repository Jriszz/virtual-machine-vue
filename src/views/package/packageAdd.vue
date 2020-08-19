<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>在线打包</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :label-width="labelWidth"
        :model="form"
        :rules="rules"
        size="small">
        <el-row>
          <el-col :span="6">
            <el-form-item label="版本编号" prop="ver">
              <el-input v-model="form.ver"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="运行平台">
              <el-radio-group v-model="form.arch">
                <el-radio label="all">所有</el-radio>
                <el-radio label="x86">32位</el-radio>
                <el-radio label="x64">64位</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品名称">
              <el-radio-group v-model="form.pack_type">
                <el-radio label="creator">Creator</el-radio>
                <el-radio label="worker">Worker</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Beta版本">
              <el-radio-group v-model="form.beta">
                <el-radio label="beta">是</el-radio>
                <el-radio label="">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="渠道代码" prop="channel">
              <el-input v-model="form.channel"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="软件语言">
              <el-radio-group v-model="form.language">
                <el-radio label="zh-cn">中文</el-radio>
                <el-radio label="en-us">英文</el-radio>
                <el-radio label="ja-jp">日文</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="子版本号">
              <el-radio-group v-model="form.sub_type">
                <el-radio label="enterprise">企业版</el-radio>
                <el-radio label="community">社区版</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="打包分支">
              <el-input v-model="form.branch"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="消息接收">
              <el-radio-group v-model="form.receiver">
                <el-radio label="all">长研群</el-radio>
                <el-radio label="test">测试群</el-radio>
                <el-radio label="debug">调试群</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="测试阶段">
              <el-radio-group v-model="form.stage_type">
                <el-radio label="module">模块测试</el-radio>
                <el-radio label="integration">集成测试</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="源码分支">
              <el-input :rows="2" v-model="form.tags" type="textarea" placeholder="形如：BotScript:BRANCH:release-5.1.1;extends:BRANCH:product-5.1.2"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button @click="addPackage('form')">提交</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="refreshList">刷新队列</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { Message } from 'element-ui'

export default {
  name: 'PackageAdd',
  components: {},

  data() {
    return {
      labelWidth: '120px',
      loading: false,
      errorflag: false,
      errorinfo: '',
      title: '在线打包',
      isEditScene: false,
      isAddScene: false,
      form: this.initForm(),
      rules: {
        ver: [{ required: true, message: '版本编号必填', trigger: 'blur' }],
        channel: [{ required: true, message: '渠道代码必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    initForm() {
      const _form = {
        secret: 'aead5f0b9a1bf24b62036bbe16daabcd',
        ver: '5.3.0',
        tag_name: '',
        tags: '',
        branch: 'master',
        stage_type: 'module',
        arch: 'all',
        beta: 'beta',
        pack_type: 'worker',
        sub_type: 'enterprise',
        language: 'zh-cn',
        channel: 'official',
        debug: '',
        receiver: 'all'
      }
      return _form
    },
    async addPackage(form) {
      this.loading = true
      this.$refs[form].validate(async valid => {
        if (!valid) {
          return false
        }
        const params = this.tools.cleanObjNullProperty(this.form)
        const res = await this.$store.dispatch('AddPackage', params)
        if (res.error_code === 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 5 * 1000
          })
          this.$store.commit('TRIGGER_REFRESH')
        }
      })
      this.loading = false
    },
    async refreshList() {
      this.$store.commit('TRIGGER_REFRESH')
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
