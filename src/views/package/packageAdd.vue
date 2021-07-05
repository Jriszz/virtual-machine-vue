<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>在线打包</span>
        <el-link href="https://wiki.laiye.com/pages/viewpage.action?pageId=36906838" target="_blank" type="success" style="float: right;">使用帮助</el-link>
        <span width="100px" style="float: right">----</span>
        <el-link href="https://wiki.laiye.com/pages/viewpage.action?pageId=36906840" target="_blank" type="success" style="float: right;">打包原理</el-link>
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
            <el-form-item label="预置版本">
              <el-select v-model="builtin_version_id" clearable placeholder="请选择" @change="selectBuiltinVersion">
                <el-option
                  v-for="item in builtin_versions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
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
              <el-select v-model="form.pack_type" placeholder="请选择" @change="changePackageType">
                <el-option
                  v-for="item in pack_type_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="签名证书">
              <el-select v-model="form.sign" placeholder="请选择">
                <el-option
                  v-for="item in sign_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"/>
              </el-select>
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
                <el-radio label="zh-cn">中文版</el-radio>
                <el-radio label="en-us">国际版</el-radio>
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
              <el-input v-model="form.beta" :disabled="!beta" placeholder="留空或如beta,beta2......beta9"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="打包工程分支" prop="branch">
              <el-input v-model="form.branch" :disabled="!branch"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="消息接收">
              <el-radio-group v-model="form.receiver" :disabled="!receiver">
                <el-radio label="all">CI群</el-radio>
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
          <el-col :span="6">
            <el-form-item label="源库默认分支" prop="default_branch">
              <el-input v-model="form.default_branch" :disabled="!default_branch" placeholder="源码分支中没有指定分支时默认采用此分支"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="启用缓存">
              <el-radio-group v-model="form.cache">
                <el-radio label="yes">启用</el-radio>
                <el-radio label="no">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="源码分支">
              <el-input :rows="3" :disabled="!tags" v-model="form.tags" type="textarea" placeholder="如：BotScript:BRANCH:release-5.1.1;extends:BRANCH:product-5.1.2"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="打包请求操作">
          <el-button type="primary" @click="addPackage('form')">提交</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
          <el-button type="success" @click="refreshList">刷新队列</el-button>
          <el-button type="success" @click="refreshServiceList">刷新服务</el-button>
        </el-form-item>
        <el-form-item label="预置版本操作">
          <el-button type="primary" @click="openBuiltinVersionForm">另存为新预置版本</el-button>
          <el-button v-if="builtin_version_id!==null" type="primary" @click="saveBuiltinVersion">保存当前预置版本</el-button>
          <el-button v-if="builtin_version_id!==null" type="primary" @click="setDefault">将当前预置版本设置为默认</el-button>
          <el-button v-if="builtin_version_id!==null" type="danger" @click="archiving">归档当前预置版本</el-button>
          <el-button v-if="builtin_version_id!==null" type="danger" @click="deleteBuiltinVersion">删除当前预置版本</el-button>
        </el-form-item>
        <el-form-item v-if="builtin_version_id!==null && builtin_version.desc" label="当前版本说明">
          <span style="color: #999999">{{ builtin_version.desc }}</span>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog v-if="addBuiltinVersionVisable" :visible.sync="addBuiltinVersionVisable" width="40%" title="增加预置版本">
      <el-form
        ref="addBuiltinVersionForm"
        :label-width="labelWidth"
        :model="addBuiltinVersionForm"
        :rules="addBuiltinVersionFormRules"
        size="small">
        <el-form-item label="预置版本名称" prop="name">
          <el-input v-model="addBuiltinVersionForm.name"/>
        </el-form-item>
        <el-form-item label="预置版本描述" prop="desc">
          <el-input v-model="addBuiltinVersionForm.desc"/>
        </el-form-item>
        <el-form-item label="预置版本参数" prop="params">
          <MonacoEditor
            :code="addBuiltinVersionForm.params"
            :change-throttle="500"
            :options="options"
            language="json"
            height="400"
            @mounted="onMountedResult"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="addBuiltinVersion('addBuiltinVersionForm')">提交</el-button>
          <el-button @click="addBuiltinVersionVisable=false">返回修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import MonacoEditor from 'vue-monaco-editor'
import * as packages from '@/api/packages.js'

export default {
  name: 'PackageAdd',
  components: {
    MonacoEditor
  },

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
      sign: true,
      ver: true,
      tag_name: true,
      tags: true,
      branch: true,
      default_branch: true,
      stage_type: true,
      arch: true,
      beta: true,
      pack_type: true,
      sub_type: true,
      language: true,
      channel: true,
      receiver: true,
      cache: true,
      sign_list: [{
        value: 'laiye',
        label: '来也'
      }, {
        value: 'laiye_h',
        label: '来也硬件KEY'
      }, {
        value: '',
        label: '不签——OEM包通常不签名'
      }],
      pack_type_list: [{
        value: 'creator',
        label: 'creator'
      }, {
        value: 'worker',
        label: 'worker'
      }, {
        value: 'oneKernel',
        label: 'oneKernel'
      }],
      builtin_version_id: null,
      builtin_version: null,
      builtin_versions: [],
      addBuiltinVersionVisable: false,
      addBuiltinVersionForm: { 'name': '', 'desc': '', params: {}},
      addBuiltinVersionFormRules: {
        name: [{ required: true, message: '预置版本名称必填', trigger: 'blur' }]
      },
      options: {
        selectOnLineNumbers: true,
        lineNumbers: 'off',
        lineDecorationsWidth: 0,
        roundedSelection: false,
        readOnly: true,
        cursorStyle: 'line',
        automaticLayout: true,
        glyphMargin: true,
        useTabStops: false,
        fontSize: 11,
        quickSuggestionsDelay: 500
      },
      form: this.initForm(),
      // 打包表单字段必填校验
      rules: {
        beta: [{ validator: checkBetaFormat, message: 'beta参数格式错误,可选的值有: beta,beta2,beta3......beta9', trigger: 'blur' }],
        ver: [{ required: true, message: '版本编号必填', trigger: 'blur' }],
        channel: [{ required: true, message: '渠道代码必填', trigger: 'blur' }],
        branch: [{ required: true, message: 'bin-generator项目分支必须', trigger: 'blur' }],
        default_branch: [{ required: true, message: '源代码项目采用默认分支必须', trigger: 'blur' }]
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
  watch: {},
  mounted() {
    this.getPackageRequestList()
  },
  methods: {
    initForm() {
      this.builtin_version_id = null
      const _form = {
        ver: '5.5.0',
        tag_name: '',
        tags: '',
        branch: 'master',
        default_branch: 'master',
        stage_type: 'module',
        arch: 'all',
        beta: '',
        pack_type: 'oneKernel',
        sub_type: 'enterprise',
        language: 'zh-cn',
        channel: 'official',
        sign: 'laiye',
        receiver: 'all',
        cache: 'yes'
      }
      return _form
    },
    selectBuiltinVersion: function(value) {
      for (let index = 0; index < this.builtin_versions.length; index++) {
        if (this.builtin_versions[index].id === this.builtin_version_id) {
          this.builtin_version = this.builtin_versions[index]
          this.form = JSON.parse(JSON.stringify(this.builtin_version.params))
          return
        }
      }
    },
    async getPackageRequestList() {
      const res = await packages.getPackageRequestList()
      if (res.error_code === 0) {
        this.builtin_versions = res.data
        Message({
          message: res.msg,
          type: 'success',
          duration: 3 * 1000
        })
        for (let index = 0; index < this.builtin_versions.length; index++) {
          if (this.builtin_versions[index].is_default === true) {
            this.builtin_version_id = this.builtin_versions[index].id
            this.builtin_version = this.builtin_versions[index]
            this.form = JSON.parse(JSON.stringify(this.builtin_version.params))
            return
          }
        }
      }
    },
    openBuiltinVersionForm() {
      this.addBuiltinVersionForm['params'] = JSON.stringify(this.form, null, 4)
      this.addBuiltinVersionVisable = true
    },
    async addBuiltinVersion(form) {
      this.$refs[form].validate(async valid => {
        if (!valid) {
          return false
        }
        const res = await packages.addPackageRequest(this.addBuiltinVersionForm)
        if (res.error_code === 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
          this.addBuiltinVersionVisable = false
          this.getPackageRequestList()
        }
      })
    },
    async saveBuiltinVersion() {
      const data = { 'name': this.builtin_version.name, 'desc': this.builtin_version.desc, 'params': this.form }
      const res = await packages.updatePackageRequest(this.builtin_version.id, data)
      if (res.error_code === 0) {
        Message({
          message: res.msg,
          type: 'success',
          duration: 3 * 1000
        })
        this.getPackageRequestList()
      }
    },
    async deleteBuiltinVersion() {
      MessageBox.confirm(
        '此操作将删除预置版本【' + this.builtin_version.name + '】，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }
      ).then(async() => {
        const res = await packages.deletePackageRequest(this.builtin_version.id)
        if (res.error_code === 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
          this.getPackageRequestList()
          this.form = this.initForm()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    async setDefault() {
      const res = await packages.setDefault(this.builtin_version.id)
      if (res.error_code === 0) {
        Message({
          message: res.msg,
          type: 'success',
          duration: 3 * 1000
        })
      }
    },
    async archiving() {
      MessageBox.confirm(
        '此操作将归档预置版本【' + this.builtin_version.name + '】，归档后此版本将不再显示，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '归档',
          cancelButtonText: '取消'
        }
      ).then(async() => {
        const res = await packages.archiving(this.builtin_version.id)
        if (res.error_code === 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
          this.getPackageRequestList()
          this.form = this.initForm()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    onMountedResult(editor) {
      this.editorResult = editor
    },
    async addPackage(form) {
      this.loading = true
      this.$refs[form].validate(async valid => {
        if (!valid) {
          return false
        }
        const params = this.tools.cleanObjNullProperty(this.form)
        params['from'] = this.$store.state.users.sessionUser.name || this.$store.state.users.sessionUser.username
        const res = await this.$store.dispatch('AddPackage', params)
        if (res.error_code === 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
          this.$store.commit('TRIGGER_REFRESH')
          this.$store.commit('TRIGGER_SERVICE_REFRESH')
        }
      })
      this.loading = false
    },
    changePackageType(value) {
      if (value === 'worker' || value === 'newWorker') {
        this.form.sub_type = 'enterprise'
        this.sub_type = false
      } else {
        this.sub_type = true
      }

      if (value === 'newWorker') {
        this.form.ver = '6.0.0'
      }
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
