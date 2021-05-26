<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>版本记录列表</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :model="form"
        :label-width="labelWidth"
        size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否发布">
              <el-radio-group v-model="form.is_release">
                <el-radio :label="null">全部</el-radio>
                <el-radio :label="3">正式发布</el-radio>
                <el-radio :label="1">临时发布</el-radio>
                <el-radio :label="0">未发布</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应用类型">
              <el-select v-model="form.package" clearable placeholder="请选择">
                <el-option
                  v-for="item in pack_type_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="版本编号">
              <el-input v-model="form.version" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="应用版本">
              <el-radio-group v-model="form.edition">
                <el-radio :label="null">全部</el-radio>
                <el-radio label="enterprise">企业版</el-radio>
                <el-radio label="community">社区版</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签名证书">
              <el-select v-model="form.sign" clearable placeholder="请选择">
                <el-option
                  v-for="item in sign_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="打包人员">
              <el-input v-model="form.source" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="运行平台">
              <el-radio-group v-model="form.arch">
                <el-radio :label="null">全部</el-radio>
                <el-radio label="x86">32位</el-radio>
                <el-radio label="x64">64位</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="软件语言">
              <el-select v-model="form.language" clearable placeholder="请选择">
                <el-option
                  v-for="item in language_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应用名称">
              <el-input v-model="form.app_name" clearable/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16">
            <el-form-item label="打包时间">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd"
                @change="setQueryDate"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button
            type="info"
            plain
            @click="getPackageRecordList">查询</el-button>
          <el-button
            type="info"
            plain
            @click="reset('form')">重置</el-button>
          <el-button
            type="primary"
            plain
            @click="downloadPublicKey">下载OpenPGP公钥</el-button>
          <el-button
            type="text"
            @click="packageCheckVisible=true">OpenPGP文件完整性校验帮助</el-button>
          <el-link href="https://wiki.laiye.com/pages/viewpage.action?pageId=36906994" target="_blank" type="success" style="float: right; ">快速开补丁介绍</el-link>
        </el-form-item>
      </el-form>

      <el-alert
        v-show="errorflag"
        :description="errorinfo"
        title="获取任务列表失败！"
        type="error"
        show-icon
        @close="errorflag=false"/>

      <el-card>
        <el-table
          :data="packageRecordList"
          :stripe="false"
          :border="true"
          :cell-class-name="getClassName"
          size="small">
          <el-table-column type="expand">
            <template slot-scope="record">
              <el-table
                :data="record.row.fingerprint_v">
                <el-table-column
                  prop="name"
                  width="250"
                  label="项目名称"/>
                <el-table-column
                  prop="commit"
                  width="370"
                  label="最后一次commit id"/>
                <el-table-column
                  prop="author"
                  width="200"
                  label="最后一次提交作者"/>
                <el-table-column
                  prop="date"
                  width="200"
                  label="提交日期"/>
                <el-table-column
                  label="提交描述">
                  <template slot-scope="scope">
                    <span>{{ scope.row.desc.trim() }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            prop="app_name"
            width="480"
            label="应用名称"/>
          <el-table-column
            width="200"
            label="发布描述">
            <template slot-scope="scope">
              <span v-if="scope.row.release_desc && scope.row.release_desc.length > 16">
                <el-tooltip :content="scope.row.release_desc" class="item" effect="dark" placement="top-start">
                  <span>{{ scope.row.release_desc.substr(0, 16) }}</span>
                </el-tooltip>
              </span>
              <span v-else>{{ scope.row.release_desc }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="package"
            width="100"
            label="应用名称"/>
          <el-table-column
            prop="edition"
            width="100"
            label="应用版本"/>
          <el-table-column
            prop="version"
            width="80"
            label="版本号"/>
          <el-table-column
            prop="arch"
            width="80"
            label="平台"/>
          <el-table-column
            prop="language"
            width="80"
            label="语言"/>
          <el-table-column
            prop="channel"
            width="80"
            label="渠道"/> -->
          <el-table-column
            label="正式发布"
            width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.is_release===7">已发补丁</span>
              <span v-else-if="scope.row.is_release===3">正式版本</span>
              <span v-else-if="scope.row.is_release===1">临时发布</span>
              <span v-else>测试版本</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            width="150"
            label="打包时间"/>
          <el-table-column
            prop="sign"
            width="80"
            label="签名"/>
          <el-table-column
            prop="is_beta"
            width="80"
            label="beta标识"/>
          <el-table-column
            prop="source"
            width="80"
            label="打包人员"/>
          <el-table-column
            prop="ip_address"
            width="110"
            label="打包机器"/>
          <!-- <el-table-column
            prop="version_title"
            width="250"
            label="版本摘要"/> -->
          <!-- <el-table-column
            prop="fingerprint_k"
            width="250"
            label="指纹信息"/> -->
          <el-table-column
            label="操作"
            min-width="480"
            fixed="right">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="版本指纹" placement="top">
                <el-button size="mini" type="primary" class="myico" plain icon="el-icon-info" @click="download(scope.row.fingerprint_url)"/>
              </el-tooltip>
              <el-tooltip v-if="scope.row.is_release !== 7" class="item" effect="dark" content="内网下载" placement="top">
                <el-button size="mini" type="primary" class="myico" plain icon="el-icon-download" @click="download(scope.row.download_url)"/>
              </el-tooltip>
              <el-tooltip v-if="scope.row.is_release < 2" class="item" effect="dark" content="创建gitea release" placement="top">
                <el-button size="mini" type="success" class="myico" plain icon="el-icon-s-flag" @click="openReleasePackageForm(scope.row)"/>
              </el-tooltip>
              <el-tooltip v-if="!scope.row.oss_download_url" class="item" effect="dark" content="上传公网" placement="top">
                <el-button size="mini" type="success" class="myico" plain icon="el-icon-upload" @click="openUpLoadOSSForm(scope.row)"/>
              </el-tooltip>
              <el-tooltip v-else-if="scope.row.oss_download_url === 'uploading'" class="item" effect="dark" content="上传公网中" placement="top">
                <el-button size="mini" type="success" class="myico" plain icon="el-icon-loading"/>
              </el-tooltip>
              <el-tooltip v-if="scope.row.is_release !== 7" class="item" effect="dark" content="版本部署" placement="top">
                <el-button size="mini" type="primary" class="myico" plain icon="el-icon-s-promotion" @click="deploy(scope.row)"/>
              </el-tooltip>
              <el-tooltip v-if="scope.row.is_release===0" class="item" effect="dark" content="删除" placement="top">
                <el-button :disabled="!isSuperAdmin" size="mini" type="danger" class="myico" plain icon="el-icon-delete" @click="deletePackageRecord(scope.row.id)"/>
              </el-tooltip>
              <el-tooltip v-if="scope.row.is_release !== 7 && scope.row.oss_download_url" class="item" effect="dark" content="复制公网下载地址" placement="top">
                <el-button v-clipboard:copy="scope.row.oss_download_url" v-clipboard:success="onCopy" v-clipboard:error="onError" ref="copyButton" size="mini" type="primary" class="myico" plain icon="el-icon-share"/>
              </el-tooltip>
              <el-tooltip v-if="scope.row.is_release !== 7" class="item" effect="dark" content="获取此包OpenPGP签名摘要" placement="top">
                <el-button size="mini" type="primary" class="myico" plain icon="el-icon-circle-check" @click="checkSign(scope.row.id)"/>
              </el-tooltip>
              <el-tooltip v-if="scope.row.params !== null" class="item" effect="dark" content="克隆，采取同样参数再次打包" placement="top">
                <el-button size="mini" type="primary" class="myico" plain icon="el-icon-refresh" @click="clone(scope.row)"/>
              </el-tooltip>
              <el-tooltip v-if="scope.row.is_release===3 && scope.row.patch_status===0" class="item" effect="dark" content="基于此版本创建补丁并拉取补丁分支" placement="top">
                <el-button size="mini" type="primary" class="myico" plain icon="el-icon-folder-add" @click="open_create_patch_form(scope.row)"/>
              </el-tooltip>
              <el-tooltip v-else-if="scope.row.is_release===3 && scope.row.patch_status===1" class="item" effect="dark" content="正在后台创建补丁分支，请注意企业微信CI群中消息" placement="top">
                <el-button size="mini" type="info" class="myico" plain icon="el-icon-loading"/>
              </el-tooltip>
              <el-tooltip v-else-if="scope.row.is_release===3 && scope.row.patch_status===2" class="item" effect="dark" content="补丁正式发布后关闭补丁状态" placement="top">
                <el-button size="mini" type="primary" class="myico" plain icon="el-icon-warning" @click="open_close_patch_form(scope.row)"/>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            :current-page="form.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="form.pageSize"
            :total="totals"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="changePageSize"
            @current-change="changeCurrentPage"
            @next-click="getNextPage"
            @prev-click="getPrevPage"/>
        </div>
      </el-card>
    </el-card>
    <el-dialog
      v-if="releasePackageFormVisable"
      :visible.sync="releasePackageFormVisable"
      width="40%">
      <div class="formTitle">
        <span>发布版本</span>
      </div>

      <el-form
        v-loading="resultLoading"
        ref="form"
        :model="releaseForm"
        :rules="rules"
        label-width="120px"
        size="small">
        <el-form-item label="Tag名称" prop="tag_name">
          <el-input v-model="releaseForm.tag_name" clearable/>
        </el-form-item>
        <el-form-item label="Release标题" prop="release_title">
          <el-input v-model="releaseForm.release_title" clearable/>
        </el-form-item>
        <el-form-item label="Release内容" prop="release_body">
          <el-input v-model="releaseForm.release_body" :rows="2" type="textarea" clearable/>
        </el-form-item>
        <el-form-item label="保存草稿">
          <el-radio-group v-model="releaseForm.draft">
            <el-radio :label="false">正式</el-radio>
            <el-radio :label="true">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否发布">
          <el-radio-group v-model="releaseForm.prerelease">
            <el-radio :label="false">正式发布</el-radio>
            <el-radio :label="true">预发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div>
            <span v-if="currentPackage.sign!='laiye'" class="backYellow">当前签名为：{{ currentPackage.sign }}，请确定是否继续发布？正常情况下只应该对外发布Laiye签名的包！</span>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="releasePackage('form')">提交</el-button>
          <el-button @click="releasePackageFormVisable=false">关闭</el-button>
        </el-form-item>
      </el-form>
      <div v-if="releaseResult">
        <div v-for="(_result, _index) in releaseResult" :key="_index" class="releaseResult">{{ _index + 1 }}: {{ _result }}</div>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="uploadOSSVisible" width="40%" title="上传公网">
      <el-form
        v-loading="uploadLoading"
        ref="form"
        :model="uploadOSSForm"
        :rules="uploadOSSFormRules"
        :label-width="labelWidth">
        <el-form-item label="发布说明" prop="release_desc">
          <el-input v-model="uploadOSSForm.release_desc" clearable />
        </el-form-item>
        <el-form-item>
          <el-button
            type="info"
            plain
            @click="uploadOSS('form')">提交</el-button>
          <el-button
            type="info"
            plain
            @click="uploadOSSVisible = false">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="packageCheckVisible" width="50%" title="OpenPGP文件完整性校验">
      <div>
        <h2>OpenPGP介绍：</h2>
        <ul>
          <li><el-link type="primary" href="https://www.rmnof.com/article/openpgp-gnupg-introduction/" target="_blank">OpenPGP（PGP/GPG）深入浅出，完全入门指南</el-link></li>
          <li><el-link type="primary" href="https://www.rmnof.com/article/gpg4win-gnupg-for-windows/" target="_blank">GPG4Win：一款适用于Windows的GPG文件和电子邮件加密软件</el-link></li>
          <li><el-link type="primary" href="https://files.gpg4win.org/gpg4win-3.1.15.exe" target="_blank">GPG4Win官网下载链接</el-link></li>
        </ul>
        <h2>准备文件</h2>
        <ul>
          <li>laiye公钥</li>
          <li>UiBot exe安装包</li>
          <li>安装包签名摘要文件</li>
        </ul>
        <h2>校验步骤</h2>
        <ol>
          <li>安装gpg4win-3.1.15.exe，默认安装路径为C:\Program Files (x86)\GnuPG</li>
          <li>将C:\Program Files (x86)\GnuPG\bin加入到环境变量PATH中</li>
          <li>导入来也公钥，名称为Beijing Laiye Network Technology Co., Ltd. 密钥指纹为C9DD 4C3D 6E53 83C2 32FD  CDD3 DF9C 2CC7 345B 9D86</li>
          <li>在命令行中运行：gpg --import laiye_public_key.txt</li>
          <li>将安装包与签名摘要文件放置到同一个目录中</li>
          <li>在命令行中运行：gpg --verify UiBot_Worker_official_zh-cn_x64_V5.3.0_2021.02.05.1813.exe.asc</li>
          <li>如果命令输出中没有告警或失败，且using RSA key为C9DD4C3D6E5383C232FDCDD3DF9C2CC7345B9D86则校验通过，否则失败。</li>
        </ol>
      </div>
    </el-dialog>
    <el-dialog v-if="createPatchVisable" :visible.sync="createPatchVisable" width="30%" title="创建补丁">
      <el-form
        ref="createPatchForm"
        :label-width="labelWidth"
        :model="createPatchForm"
        :rules="createPatchFormRules"
        size="small">
        <el-form-item>
          <el-link :underline="false" type="primary">下面是程序自动给出的默认值，可以按实际情况修改</el-link>
        </el-form-item>
        <el-form-item label="补丁名称" prop="patch_name">
          <el-input v-model="createPatchForm.patch_name"/>
        </el-form-item>
        <el-form-item label="补丁分支" prop="branch_name">
          <el-input v-model="createPatchForm.branch_name"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="create_patch('createPatchForm')">提交</el-button>
          <el-button @click="createPatchVisable=false">关闭</el-button>
        </el-form-item>
        <el-form-item>
          <el-link :underline="false" type="danger">此操作会创建一系列新分支，请谨慎操作！</el-link>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog v-if="closePatchVisable" :visible.sync="closePatchVisable" width="30%" title="关闭补丁">
      <el-form
        ref="closePatchForm"
        :label-width="labelWidth"
        :model="closePatchForm"
        :rules="closePatchFormRules"
        size="small">
        <el-form-item label="操作提示">
          <el-link :underline="false" type="danger">1.此操作会关联新的补丁记录，原记录不再提供下载链接</el-link>
          <el-link :underline="false" type="primary">2.下面请填写补丁正式发布后相应的安装包名称</el-link>
        </el-form-item>
        <el-form-item label="应用名称" prop="app_name">
          <el-input v-model="closePatchForm.app_name"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="close_patch('closePatchForm')">提交</el-button>
          <el-button @click="closePatchVisable=false">关闭</el-button>
        </el-form-item>
        <el-form-item label="操作前提">
          <el-link :underline="false" type="danger">确保补丁上修复的代码已经合并到master分支中</el-link>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'
import * as packages from '@/api/packages.js'

export default {
  name: 'PackageRecordList',
  components: { MessageBox, Message },

  data() {
    return {
      labelWidth: this.config.labelWidth,
      loading: false,
      resultLoading: false,
      uploadLoading: false,
      errorflag: false,
      errorinfo: '',
      form: this.initForm(),
      releaseForm: { 'tag_name': '', 'release_title': '', 'release_body': '', 'prerelease': false, 'draft': false },
      pack_type_list: [{
        value: 'oneKernel',
        label: 'oneKernel'
      }, {
        value: 'extension',
        label: 'extension'
      }, {
        value: 'creator',
        label: 'creator'
      }, {
        value: 'worker',
        label: 'worker'
      }],
      sign_list: [{
        value: 'laiye',
        label: '来也'
      }, {
        value: 'laiye_h',
        label: '来也硬件KEY'
      }, {
        value: 'none',
        label: '不签——OEM包通常不签名'
      }],
      language_list: [{
        value: 'zh-cn',
        label: '中文'
      }, {
        value: 'en-us',
        label: '英文'
      }, {
        value: 'zh-tw',
        label: '繁体'
      }, {
        value: 'ja-jp',
        label: '日文'
      }],
      packageRecordList: [],
      totals: 0,
      dateRange: null,
      packageCheckVisible: false,
      releasePackageFormVisable: false,
      currentPackage: null,
      releaseResult: null,
      currentRelease: {},
      uploadOSSVisible: false,
      uploadOSSForm: {},
      uploadOSSFormRules: {
        release_desc: [{ required: true, message: '发布描述必填', trigger: 'blur' }]
      },
      rules: {
        tag_name: [{ required: true, message: 'Tag必填', trigger: 'blur' }],
        release_title: [{ required: true, message: 'Release标题必填', trigger: 'blur' }],
        release_body: [{ required: true, message: 'Release内容必填', trigger: 'blur' }]
      },
      createPatchVisable: false,
      createPatchForm: {},
      createPatchFormRules: {
        patch_name: [{ required: true, message: '补丁名称必填', trigger: 'blur' }],
        branch_name: [{ required: true, message: '补丁分支必填', trigger: 'blur' }]
      },
      closePatchVisable: false,
      closePatchForm: {},
      closePatchFormRules: {
        app_name: [{ required: true, message: '补丁应用名称必填', trigger: 'blur' }]
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
    this.getPackageRecordList()
  },
  methods: {
    initForm() {
      const _form = {
        package: null,
        edition: null,
        arch: null,
        language: null,
        create_time_s: '',
        create_time_e: '',
        version: '',
        sign: null,
        source: '',
        is_release: null,
        page: 1,
        pageSize: 10
      }
      return _form
    },
    getClassName({ row, column, rowIndex, columnIndex }) {
      if (column['label'] === '正式发布') {
        if (row.is_release === 7) {
          return 'colorRed'
        } else if (row.is_release === 3) {
          return 'colorGreen'
        } else if (row.is_release === 1) {
          return 'colorYellow'
        } else {
          return ''
        }
      }
    },
    setQueryDate() {
      if (this.dateRange === null) {
        this.form.create_time_s = null
        this.form.create_time_e = null
      } else {
        this.form.create_time_s = this.dateRange[0]
        this.form.create_time_e = this.dateRange[1]
      }
    },
    async getPackageRecordList() {
      this.resetResult()
      this.loading = true
      this.errorflag = false
      const params = this.tools.cleanObjNullProperty(this.form)
      const res = await packages.getPackageRecordList(params)
      if (res.error_code === 0) {
        this.totals = res.data.totals
        this.packageRecordList = res.data.package_records
        Message({
          message: res.msg,
          type: 'success',
          duration: 5 * 1000
        })
      } else {
        console.log(res)
      }
      this.loading = false
    },
    open_create_patch_form(row) {
      this.createPatchVisable = true
      const current_version = row.version
      const temp_version = current_version.split('.')
      temp_version[2] = (parseInt(temp_version[2]) + 1).toString()
      const next_version = temp_version.join('.')
      this.createPatchForm = {
        'primary_id': row.id,
        'patch_name': next_version,
        'branch_name': 'from_' + current_version + '_to_' + next_version,
        'from': this.$store.state.users.sessionUser.name || this.$store.state.users.sessionUser.username
      }
    },
    async create_patch(form) {
      this.$refs[form].validate(async valid => {
        if (!valid) {
          return false
        }
        const res = await packages.createPatch(this.createPatchForm)
        if (res.error_code === 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
          this.createPatchVisable = false
          this.getPackageRecordList()
        }
      })
    },
    open_close_patch_form(row) {
      this.closePatchVisable = true
      this.closePatchForm = {
        'primary_id': row.id,
        'app_name': ''
      }
    },
    async close_patch(form) {
      this.$refs[form].validate(async valid => {
        if (!valid) {
          return false
        }
        const res = await packages.closePatch(this.closePatchForm)
        if (res.error_code === 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
          this.closePatchVisable = false
          this.getPackageRecordList()
        }
      })
    },
    async clone(row) {
      MessageBox.confirm(
        '此操作将采用同样参数再次打包，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '提交',
          cancelButtonText: '取消'
        }
      ).then(async() => {
        let tags = ''
        for (const key in row.branch) {
          tags += key + ':' + row.branch[key] + ';'
        }
        tags = tags.substring(0, tags.length - 1)
        const params = row.params
        params['tags'] = tags
        params['from'] = this.$store.state.users.sessionUser.name || this.$store.state.users.sessionUser.username
        const res = await this.$store.dispatch('AddPackage', params)
        if (res.error_code === 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 3 * 1000
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },
    async deletePackageRecord(primary_id) {
      MessageBox.confirm(
        '此操作将物理删除此打包版本对应的文件与记录，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }
      ).then(async() => {
        const res = await packages.deletePackageRecord(primary_id)
        if (res.error_code === 0) {
          Message({
            message: res.msg,
            type: 'success',
            duration: 5 * 1000
          })
          this.getPackageRecordList()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    releasePackage(form) {
      this.resultLoading = true
      this.$refs[form].validate(async valid => {
        if (!valid) {
          this.resultLoading = false
          return false
        }
        const params = this.tools.cleanObjNullProperty(this.releaseForm)
        const res = await packages.releasePackage(this.currentPackage.id, params)
        this.releaseResult = res.data
        this.resultLoading = false
      })
    },
    openUpLoadOSSForm(release) {
      this.uploadOSSVisible = true
      this.currentRelease = release
    },
    deploy() {
      alert('待联调！')
    },
    async uploadOSS(form) {
      this.uploadLoading = true
      this.$refs[form].validate(async valid => {
        if (!valid) {
          this.uploadLoading = false
          return false
        }
        const params = this.tools.cleanObjNullProperty(this.uploadOSSForm)
        const res = await packages.uploadOSS(this.currentRelease.id, params)
        Message({
          message: res.msg,
          type: 'success',
          duration: 10 * 1000
        })
        this.uploadOSSVisible = false
        this.uploadLoading = false
        this.getPackageRecordList()
      })
    },
    download(url) {
      window.open(url, '_blank')
    },
    downloadPublicKey() {
      const url = packages.downloadOpenPGPPublicKey()
      this.download(url)
    },
    async checkSign(id) {
      const url = await packages.getPackageSignCheckFile(id)
      this.download(url)
    },
    openReleasePackageForm(obj) {
      this.releaseResult = null
      this.currentPackage = obj
      if (obj.release_data) {
        this.releaseForm = obj.release_data
      }
      this.releasePackageFormVisable = true
    },
    reset() {
      this.form = this.initForm()
      this.dateRange = null
      this.resetResult()
    },
    resetResult() {
      this.errorflag = false
    },
    // 分页相关的方法
    getNextPage() {
      this.form.page += 1
    },
    getPrevPage() {
      this.form.page -= 1
    },
    changePageSize(val) {
      this.form.pageSize = val
      this.form.page = 1
      this.getPackageRecordList()
    },
    changeCurrentPage(val) {
      this.form.page = val
      this.getPackageRecordList()
    }
    // 分页相关的方法
  }
}
</script>

<style>
  .releaseResult {
    line-height: 1.5;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
  .colorGreen {
  color: wheat;
  background-color: green;
  }
  .colorYellow {
    color:wheat;
    background-color: orange;
  }
  .colorRed {
    color: wheat;
    background-color: red;
  }
  .backGreen {
    color: white;
    font-weight: bold;
    background-color: green;
  }
  .backYellow {
    color: white;
    font-weight: bold;
    background-color:darkorange
  }
  .backRed {
    color: white;
    font-weight: bold;
    background-color: red;
  }
  .myico {
    padding: 3px 5px;
    font-size: 25px;
  }
</style>
