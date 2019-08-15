<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>业务系统列表</span>
      </div>

      <el-form
        v-loading="loading"
        ref="form"
        :model="form"
        :label-width="labelWidth"
        size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="站点名称">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="站点代号">
              <el-input v-model="form.code" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="info"
            plain
            @click="getSystemList('form')">查询</el-button>
          <el-button
            type="info"
            plain
            @click="reset('form')">重置</el-button>
          <el-button
            type="primary"
            plain
            @click="openSystemForm(null, 'Add')">新增</el-button>
        </el-form-item>
      </el-form>

      <el-alert
        v-show="errorflag"
        :description="errorinfo"
        title="获取站点列表失败！"
        type="error"
        show-icon
        @close="errorflag=false"/>

      <el-card>
        <el-table
          :data="systemList"
          :stripe="true"
          :border="true">
          <el-table-column
            prop="name"
            width="250"
            label="站点名称"/>
          <el-table-column
            prop="code"
            width="120"
            label="站点代号"/>
          <!-- <el-table-column
            prop="token"
            width="200"
            label="站点令牌"/> -->
          <el-table-column
            width="100"
            label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status===1">启用</span>
              <span v-else>禁用</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="desc"
            label="站点描述"/>
          <el-table-column
            label="操作"
            width="250">
            <template v-if="isSuperAdmin" slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="openSystemForm(scope.row, 'Info')">详情</el-button>
              <el-button size="mini" type="primary" plain @click="openSystemForm(scope.row, 'Edit')">修改</el-button>
              <el-button v-if="scope.row.status===1" size="mini" type="danger" plain @click="deleteSystem(scope.row)">禁用</el-button>
              <el-button v-else size="mini" type="danger" plain @click="enableSystem(scope.row)">启用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination
            :current-page="form.page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="form.page_size"
            :total="totals"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="changePageSize"
            @current-change="changeCurrentPage"
            @next-click="getNextPage"
            @prev-click="getPrevPage"/>
        </div>
      </el-card>
    </el-card>
    <system-form />
  </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'
import systemForm from './systemForm'

export default {
  name: 'SystemList',
  components: { systemForm, MessageBox, Message },

  data() {
    return {
      labelWidth: this.config.labelWidth,
      loading: false,
      errorflag: false,
      errorinfo: '',
      form: this.initform(),
      totals: 0
    }
  },
  computed: {
    systemList: function() {
      return this.$store.state.systems.systemList
    },
    isSuperAdmin: function() {
      if (this.$store.state.users.sessionUser.super_admin === 1) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    this.getSystemList('form')
  },
  methods: {
    initform() {
      const _form = {
        name: '',
        code: '',
        page: 1,
        pageSize: 10
      }
      return _form
    },
    getSystemList(form) {
      this.resetResult()
      this.loading = true
      this.errorflag = false
      this.$refs[form].validate(valid => {
        const params = this.tools.cleanObjNullProperty(this.form)
        this.$store.dispatch('GetSystemList', params).then((response) => {
          this.loading = false
          this.totals = response.data.totals
        }).catch(() => {
          this.loading = false
        })
      })
    },
    openSystemForm(system, type) {
      this.$store.commit('OPEN_SYSTEM_FORM', { type, system })
    },
    reset() {
      this.form = this.initform()
      this.resetResult()
      this.totals = 0
    },
    resetResult() {
      this.errorflag = false
      this.result = []
    },
    addSystem() {
      this.$store.commit('OPEN_SYSTEM_FORM', { type: 'Add', system: null })
    },
    editSystem(system) {
      this.$store.commit('OPEN_SYSTEM_FORM', { type: 'Edit', system })
    },
    deleteSystem(system) {
      MessageBox.confirm(
        '此操作将禁止站点【' + system.name + '】接入用户中心，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '禁用',
          cancelButtonText: '取消'
        }
      ).then(() => {
        this.$store.dispatch('DeleteSystem', system.id).then((response) => {
          this.loading = false
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
      }).catch(action => {})
    },
    enableSystem(system) {
      MessageBox.confirm(
        '此操作将允许站点【' + system.name + '】接入用户中心，是否继续？',
        '操作确认',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '允许',
          cancelButtonText: '取消'
        }
      ).then(() => {
        this.$store.dispatch('EnableSystem', system.id).then((response) => {
          this.loading = false
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
      }).catch(action => {})
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
      this.getSystemList('form')
    },
    changeCurrentPage(val) {
      this.form.page = val
      this.getSystemList('form')
    }
    // 分页相关的方法
  }
}
</script>
