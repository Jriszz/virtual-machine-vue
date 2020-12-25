<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search_condition" placeholder="IP地址" style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查找
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange">

      <el-table-column :class-name="getSortClass('id')" label="ID" prop="id" sortable="custom" align="center" width="80" >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="测试环境" min-width="50px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.environ_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址">
        <template slot-scope="{row}">
          <span>{{ row.ip_address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="worker在线状态" min-width="20px">
        <template slot-scope="{row}">
          <span v-if="row.worker_state === 2" style="color:#67C23A">在线</span>
          <span v-else style="color:#909399">离线</span>
        </template>
      </el-table-column>
      <el-table-column label="应用名" min-width="20px">
        <template slot-scope="{row}">
          <span>{{ row.app_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本位数" min-width="20px">
        <template slot-scope="{row}">
          <span>{{ row.version_bit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="left" width="350" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" type="warning" @click="handleModify(row,$index)">
            修改
          </el-button>
          <el-button v-if="row.status!='deleted'" :disabled="isDisabled" size="mini" type="danger" @click="handleDelete(row,$index)" >
            卸载
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="info" @click="handleCopy(row,$index)">
            复制
          </el-button>
          <el-button v-if="row.app_name.includes('Worker')" size="mini" type="primary" @click="refresh(row,$index)">
            刷新worker
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.page_size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px margin-left:50px">
        <el-form-item label="应用名称" prop="app_name" style="width: 600px">
          <el-col :span="8">
            <el-select v-model="temp.app_name" class="filter-item" placeholder="应用">
              <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
          </el-col>

          <el-col :span="8">
            <el-form-item prop="version_bit">
              <el-select v-model="temp.version_bit" class="filter-item" placeholder="版本位数">
                <el-option v-for="item in calendarTypeOptions2" :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="version_id">
              <el-input v-model="temp.version_id" placeholder="版本号" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="环境名称" prop="environ_name">
          <el-input v-model="temp.environ_name" placeholder="环境名称" />
        </el-form-item>
        <el-form-item label="IP地址" prop="ip_address">
          <el-input v-model="temp.ip_address" placeholder="IP地址" />
        </el-form-item>
        <el-form-item label="应用路径" prop="app_path">
          <!-- <el-input v-model="temp.app_path" placeholder="应用路径" /> -->
          <el-select
            v-model="temp.app_path"
            filterable
            allow-create
            placeholder="请选择应用路径">
            <el-option
              v-for="item in options"
              :key="item.value"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <!-- `checked` 为 true 或 false -->
        <el-form-item>
          <el-col :span="6">
            <el-checkbox v-if="textMap[dialogStatus] === &quot;Create&quot;||textMap[dialogStatus] ===&quot;Copy&quot;" v-model="checked" size="medium">是否覆盖安装</el-checkbox>
          </el-col>
        </el-form-item>
      </el-form>
      <el-dialog :title="inner_title" :visible.sync="innerVisible" width="30%" append-to-body>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="updateData()">
            覆盖
          </el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button :disabled="isDisabled" type="primary" @click="dialogStatus==='create'||dialogStatus==='copy'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { environ_info, new_environ_info, put_environ_info, remove_environ_info, refresh_worker } from '@/api/environ-config'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'Creator企业版', display_name: 'Creator企业版' },
  { key: 'Creator社区版', display_name: 'Creator社区版' },
  { key: 'Worker', display_name: 'Worker' }
]

const calendarTypeOptions2 = [
  { key: '64位', display_name: '64位' },
  { key: '32位', display_name: '32位' }
]
// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      isDisabled: false,
      checked: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        page_size: 10,
        search_condition: '',
        sort: '+id'
      },
      options: [],
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      calendarTypeOptions2,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      innerVisible: false,
      inner_title: 'title',
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        app_name: '',
        version_bit: '',
        version_id: '',
        environ_name: '',
        ip_address: '',
        app_path: '',
        status: 'published',
        environ_id: ''

      },
      dialogFormVisible: false,
      dialogStatus: 'create',
      textMap: {
        update: 'Edit',
        create: 'Create',
        copy: 'Copy'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        app_name: [{ required: true, message: '应用名称不能为空', trigger: 'blur' }],
        version_bit: [{ required: true, message: '版本位数不能为空', trigger: 'blur' }],
        version_id: [{ required: true, message: '版本号非法', trigger: 'blur', pattern: /^[0-9].[0-9].[0-9]/ }],
        environ_name: [{ required: true, message: '环境名称不能为空', trigger: 'blur' }],
        ip_address: [{ required: true, message: 'IP地址非法', trigger: 'blur', pattern: /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/ }],
        app_path: [{ required: true, message: '应用路径不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      environ_info(this.listQuery).then(response => {
        this.list = response.data.config_list
        this.total = response.data.total
        this.options = response.data.app_path_option

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let temp_app_name = ''
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          temp_app_name = this.temp.app_name
          this.temp.app_name = this.temp.app_name + '_' + this.temp.version_id

          // 禁用按钮
          this.isDisabled = true
          new_environ_info(this.temp).then(response => {
            this.temp.app_name = temp_app_name
            temp_app_name = ''
            // Just to simulate the time of the request
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
            // this.temp.app_name = this.temp.app_name+'_'+this.temp.version_id
            if (response.msg.indexOf('是否覆盖安装') > -1) {
              // this.innerVisible = true
              // this.inner_title = response.msg
              this.temp.environ_id = response.data

              if (this.checked) {
                this.updateData()
                this.checked = false
              } else {
                this.$notify({
                  message: response.msg,
                  type: 'info',
                  duration: 2000
                })
              }
            } else if (response.msg === '请求成功') {
              this.dialogFormVisible = false
              this.$notify({
                message: response.msg,
                type: 'info',
                duration: 2000
              })
              this.getList()
              this.checked = false
            } else {
              this.$notify({
                message: response.msg,
                type: 'info',
                duration: 2000
              })
              this.getList()
              this.checked = false
              this.checked1 = false

              // Just to simulate the time of the request
              setTimeout(() => {
                this.listLoading = false
              }, 1.5 * 1000)
            }

            // 恢复按钮
            this.isDisabled = false
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      let temp_app_name = ''
      temp_app_name = this.temp.app_name

      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 禁用按钮
          this.isDisabled = true
          this.temp.app_name = this.temp.app_name + '_' + this.temp.version_id
          console.log(this.temp)
          put_environ_info(this.temp).then(response => {
            this.innerVisible = false
            this.temp.app_name = temp_app_name

            if (response.msg === '请求成功') {
              this.dialogFormVisible = false
              this.getList()
              this.$notify({
                message: response.msg,
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify({
                message: response.msg,
                type: 'info',
                duration: 2000
              })
            }

            // 恢复按钮
            this.isDisabled = false
          })
          console.log(temp_app_name)
          // 清除多余数据
          this.temp.app_name = temp_app_name
        }
      })
    },
    handleDelete(row, index) {
      // 禁用按钮
      this.isDisabled = true
      row['environ_id'] = row.id
      remove_environ_info(row).then(response => {
        if (response.msg === '请求成功') {
          this.$notify({
            title: 'Success',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          // 恢复按钮
          this.isDisabled = false
          this.list.splice(index, 1)
        } else if (Object.keys(response.msg).length !== 0) {
          this.$notify({
            title: 'Warning',
            message: response.msg,
            type: 'warning',
            duration: 2000
          })
          this.isDisabled = false
        }
      })
    },
    handleModify(row, index) {
      this.dialogStatus = 'update'

      environ_info(row).then(response => {
        let app_name_list = ''

        app_name_list = (response.data.config_list[0].app_name).split('_')
        this.temp.app_name = app_name_list[0]
        this.temp.version_id = app_name_list[1]
        this.temp.app_path = response.data.config_list[0].app_path
        this.temp.ip_address = response.data.config_list[0].ip_address
        this.temp.version_bit = response.data.config_list[0].version_bit
        this.temp.environ_name = response.data.config_list[0].environ_name
        this.temp.environ_id = response.data.config_list[0].id
        this.dialogFormVisible = true
      })
    },
    handleCopy(row, index) {
      this.dialogStatus = 'copy'

      environ_info(row).then(response => {
        let app_name_list = ''
        app_name_list = (response.data.config_list[0].app_name).split('_')
        this.temp.app_name = app_name_list[0]
        this.temp.version_id = app_name_list[1]
        this.temp.app_path = response.data.config_list[0].app_path
        this.temp.ip_address = response.data.config_list[0].ip_address
        this.temp.version_bit = response.data.config_list[0].version_bit
        this.temp.environ_name = response.data.config_list[0].environ_name
        this.temp.environ_id = response.data.config_list[0].id
        this.dialogFormVisible = true
      })
      this.dialogFormVisible = true
    },
    refresh(row, index) {
      refresh_worker(row).then(response => {
        setTimeout(() => {
          environ_info(this.listQuery).then(response => {
            this.list = response.data.config_list
            this.total = response.data.total
            this.options = response.data.app_path_option
          })
        }, 10000)
      })
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      console.log(sort)
      console.log(key)
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}

</script>
