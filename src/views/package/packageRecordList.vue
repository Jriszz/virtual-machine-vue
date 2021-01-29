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
            <el-form-item label="应用名称">
              <el-radio-group v-model="form.package">
                <el-radio :label="null">全部</el-radio>
                <el-radio label="creator">creator</el-radio>
                <el-radio label="worker">worker</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签名证书">
              <el-radio-group v-model="form.sign">
                <el-radio :label="null">全部</el-radio>
                <el-radio label="aosen">奥森</el-radio>
                <el-radio label="laiye">来也</el-radio>
                <el-radio label="laiye_h">硬件</el-radio>
                <el-radio label="none">不签</el-radio>
              </el-radio-group>
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
                <el-radio label="enterprise">enterprise</el-radio>
                <el-radio label="community">community</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="软件语言">
              <el-radio-group v-model="form.language">
                <el-radio :label="null">全部</el-radio>
                <el-radio label="zh-cn">中文</el-radio>
                <el-radio label="en-us">英文</el-radio>
                <el-radio label="ja-jp">日文</el-radio>
              </el-radio-group>
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
                <el-radio label="x86">x86</el-radio>
                <el-radio label="x64">x64</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否发布">
              <el-radio-group v-model="form.is_release">
                <el-radio :label="null">全部</el-radio>
                <el-radio :label="1">已发布</el-radio>
                <el-radio :label="0">未发布</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安装包名称">
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
          <el-col :span="8">
            <el-form-item label="pdb调试文件">
              <el-input v-model="form.pdb_md5" placeholder="请填入BotScript.dll计算得到的md5值" clearable/>
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
          :stripe="true"
          :border="true"
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
            label="安装包名称"/>
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
            prop="sign"
            width="80"
            label="签名"/>
          <el-table-column
            prop="is_beta"
            width="80"
            label="beta标识"/>
          <el-table-column
            label="正式发布"
            width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.is_release===true" class="colorGreen">已发布</span>
              <span v-else>测试版本</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            width="150"
            label="打包时间"/>
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
            min-width="500">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="download(scope.row.fingerprint_url)">版本信息</el-button>
              <el-button size="mini" type="primary" plain @click="download(scope.row.download_url)">下载</el-button>
              <el-button v-if="!scope.row.is_release" :disabled="!isSuperAdmin" size="mini" type="success" plain @click="openReleasePackageForm(scope.row)">发布</el-button>
              <el-button v-if="!scope.row.oss_download_url" :disabled="!isSuperAdmin" size="mini" type="success" plain @click="uploadOSS(scope.row.id)">上传公网</el-button>
              <el-button size="mini" type="primary" plain @click="deploy(scope.row)">部署</el-button>
              <el-button v-if="!scope.row.is_release && !scope.row.oss_download_url" :disabled="!isSuperAdmin" size="mini" type="danger" plain @click="deletePackageRecord(scope.row.id)">删除</el-button>
              <el-button v-if="scope.row.oss_download_url" size="mini" type="primary" plain @click="download(scope.row.oss_download_url)">公网下载</el-button>
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
      errorflag: false,
      errorinfo: '',
      form: this.initForm(),
      releaseForm: { 'tag_name': '', 'release_title': '', 'release_body': '', 'prerelease': false, 'draft': false },
      packageRecordList: [],
      totals: 0,
      dateRange: null,
      releasePackageFormVisable: false,
      currentPackage: null,
      releaseResult: null,
      rules: {
        tag_name: [{ required: true, message: 'Tag必填', trigger: 'blur' }],
        release_title: [{ required: true, message: 'Release标题必填', trigger: 'blur' }],
        release_body: [{ required: true, message: 'Release内容必填', trigger: 'blur' }]
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
        pdb_md5: null,
        page: 1,
        pageSize: 10
      }
      return _form
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
      }).catch(action => {})
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
    deploy() {
      alert('待联调！')
    },
    async uploadOSS(primary_id) {
      const res = await packages.uploadOSS(primary_id)
      if (res.error_code === 0) {
        Message({
          message: res.msg,
          type: 'success',
          duration: 5 * 1000
        })
      }
    },
    download(url) {
      window.open(url, '_blank')
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
  color: green;
  }
  .colorYellow {
    color:darkorange
  }
  .colorRed {
    color: red;
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
</style>
