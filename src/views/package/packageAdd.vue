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
            <el-form-item label="预制版本">
              <el-select v-model="builtin_version" placeholder="请选择">
                <el-option
                  v-for="item in builtin_versions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="运行平台">
              <el-radio-group v-model="form.arch" :disabled="!arch">
                <el-radio label="all">所有</el-radio>
                <el-radio label="x86">32位</el-radio>
                <el-radio label="x64">64位</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品名称">
              <el-radio-group v-model="form.pack_type" :disabled="!pack_type">
                <el-radio label="creator">Creator</el-radio>
                <el-radio label="worker">Worker</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="签名证书">
              <el-radio-group v-model="form.sign">
                <el-radio label="laiye">来也</el-radio>
                <el-radio label="aosen">奥森</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="版本编号" prop="ver">
              <el-input v-model="form.ver" :disabled="!ver"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="软件语言">
              <el-radio-group v-model="form.language" :disabled="!language">
                <el-radio label="zh-cn">中文</el-radio>
                <el-radio label="en-us">英文</el-radio>
                <el-radio label="ja-jp">日文</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="子版本号">
              <el-radio-group v-model="form.sub_type" :disabled="!sub_type">
                <el-radio label="enterprise">企业版</el-radio>
                <el-radio label="community">社区版</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="Beta版本" prop="beta">
              <el-input v-model="form.beta" :disabled="!beta" placeholder="留空或如beta2,beta3......beta9"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="打包分支">
              <el-input v-model="form.branch" :disabled="!branch"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="消息接收">
              <el-radio-group v-model="form.receiver" :disabled="!receiver">
                <el-radio label="all">长研群</el-radio>
                <el-radio label="test">测试群</el-radio>
                <el-radio label="debug">调试群</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="测试阶段">
              <el-radio-group v-model="form.stage_type" :disabled="!stage_type">
                <el-radio label="module">模块测试</el-radio>
                <el-radio label="integration">集成测试</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="渠道代码" prop="channel">
              <el-input v-model="form.channel" :disabled="!channel"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item label="源码分支">
              <el-input :rows="2" :disabled="!tags" v-model="form.tags" type="textarea" placeholder="如：BotScript:BRANCH:release-5.1.1;extends:BRANCH:product-5.1.2"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="addPackage('form')">提交</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="success" @click="refreshList">刷新队列</el-button>
          <el-button type="success" @click="refreshServiceList">刷新服务</el-button>
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
    var checkBetaFormat = (rule, value, callback) => {
      const re = /^beta[2-9]{0,1}$/
      if (value === '' || value === undefined || value === null) {
        callback()
      } else if (re.test(value) === true) {
        callback()
      } else {
        callback(new Error('Beta参数格式错误可选的值有: beta,beta2,beta3......beta9'))
      }
    }
    return {
      labelWidth: '120px',
      loading: false,
      errorflag: false,
      errorinfo: '',
      title: '在线打包',
      isEditScene: false,
      isAddScene: false,
      ver: true,
      tag_name: true,
      tags: true,
      branch: true,
      stage_type: true,
      arch: true,
      beta: true,
      pack_type: true,
      sub_type: true,
      language: true,
      channel: true,
      receiver: true,
      builtin_version: 'current',
      builtin_versions: [{
        value: 'current',
        label: '当前迭代'
      }, {
        value: 'hailianxun5.1.1',
        label: '海联讯5.1.1'
      }, {
        value: 'international5.1.2',
        label: '国际版5.1.2'
      }],
      form: this.initForm(),
      rules: {
        beta: [{ validator: checkBetaFormat, message: 'beta参数格式错误,可选的值有: beta,beta2,beta3......beta9', trigger: 'blur' }],
        ver: [{ required: true, message: '版本编号必填', trigger: 'blur' }],
        channel: [{ required: true, message: '渠道代码必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    isSuperAdmin: function() {
      if (this.$store.state.users.sessionUser.super_admin === 1) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    builtin_version: function(newValue, oldValue) {
      if (newValue === 'current') {
        this.form = this.initForm()
        this.form.ver = ''
        this.form.branch = 'master'
        this.ver = true
        this.tag_name = true
        this.tags = true
        this.branch = true
        this.stage_type = true
        this.arch = true
        this.beta = true
        this.pack_type = true
        this.sub_type = true
        this.language = true
        this.channel = true
        this.receiver = true
      } else if (newValue === 'hailianxun5.1.1') {
        this.form = this.initForm()
        this.form.ver = '5.1.1'
        this.form.branch = '海联讯-5.1.1'
        this.form.arch = 'x86'
        this.ver = false
        this.tag_name = false
        this.tags = false
        this.branch = false
        this.stage_type = false
        this.arch = true
        this.beta = false
        this.pack_type = false
        this.sub_type = false
        this.language = false
        this.channel = false
        this.receiver = true
      } else if (newValue === 'international5.1.2') {
        this.form = this.initForm()
        this.form.ver = '5.1.2'
        this.form.branch = 'language-5.1.2'
        this.form.language = 'en-us'
        this.ver = false
        this.tag_name = false
        this.tags = false
        this.branch = false
        this.stage_type = false
        this.arch = true
        this.beta = false
        this.pack_type = true
        this.sub_type = true
        this.language = false
        this.channel = false
        this.receiver = true
      } else {
        this.form = this.initForm()
      }
    }
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
        beta: '',
        pack_type: 'creator',
        sub_type: 'enterprise',
        language: 'zh-cn',
        channel: 'official',
        sign: 'aosen',
        receiver: 'all',
        from: this.$store.state.users.sessionUser.name || this.$store.state.users.sessionUser.username
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
          this.$store.commit('TRIGGER_SERVICE_REFRESH')
        }
      })
      this.loading = false
    },
    async refreshList() {
      this.$store.commit('TRIGGER_REFRESH')
    },
    async refreshServiceList() {
      this.$store.commit('TRIGGER_SERVICE_REFRESH')
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
