<template>

  <div class="app-container">
    <el-container
      v-loading="listLoading"
      style="height:85vh;
    margin-left: -20px;"
      element-loading-text="数据正在加载中..."
    >
      <el-aside width="200px" style="background-color:white;height:100vh;overflow:hidden;border:1px solid #eee;margin-top:-20px;margin-right: 20px;">
        <span style=" margin-left: 10px; color: #303133;"><i class="el-icon-monitor" style="margin-top:15px;"/> 宿主机</span>
        <el-tree
          ref="studentTree"
          :props="defaultProps"
          :data="groupTreeData"
          :highlight-current="true"
          class="filter-tree"
          default-expand-all
          style="top:20px;left:20px;"
          @node-click="handleNodeClick"
        />
      </el-aside>

      <el-table
        :data="tableData"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        height="90vh"
        @expand-change="handle"

      >
        <el-table-column type="expand">
          <template slot-scope="scope" >
            <el-tabs v-model="activeName" >
              <el-tab-pane
                :lazy="true"
                label="已安装应用"
                name="first"
              >
                <el-table
                  v-loading="loading"
                  :data="appData"
                  border
                  style="margin-left: 10%; width: 78%;"
                  height="500"
                  element-loading-text="数据正在加载中..."
                >
                  <el-table-column
                    prop="browser"
                    label="浏览器"
                    width="250"
                  />
                  <el-table-column
                    prop="office"
                    label="office"
                    width="400"/>
                  <el-table-column
                    prop="uibot"
                    label="UiBot应用"
                    width="300"/>
                  <el-table-column
                    prop="other"
                    label="其他应用"
                    width="300"/>

                </el-table>
              </el-tab-pane>
              <el-tab-pane
                label="性能"
                name="second">内存管理
              </el-tab-pane>
            </el-tabs>

          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="ElementName"
          label="机器名称"
          sortable
        />
        <el-table-column prop="EnabledState" label="当前状态" sortable/>
        <el-table-column prop="HealthState" label="机器健康状况"/>
        <el-table-column label="运行时长">
          <template slot-scope="{row}">
            <span>{{ row.Day }}天{{ row.Hour }}小时</span>
          </template>
        </el-table-column>
        <el-table-column prop="InstallDate" label="安装日期"/>
        <el-table-column prop="ipaddress" label="ip地址"/>
        <el-table-column width="400" label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="启动" placement="top-start">
              <el-button
                :loading="scope.row.loading1"
                :disabled="scope.row.EnabledState == '正在运行'"
                size="mini"
                icon="el-icon-switch-button"
                circle
                @click="loadState(scope.row,2,'loading1')"/>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="强行关闭" placement="top-start">
              <el-button
                :loading="scope.row.loading2"
                :disabled="scope.row.EnabledState != '正在运行'"
                size="mini"
                type="info"
                icon="el-icon-circle-close"
                circle
                @click="loadState(scope.row,3,'loading2')"/>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="关闭" placement="top-start">

              <el-button
                :loading="scope.row.loading3"
                :disabled="scope.row.EnabledState != '正在运行'"
                size="mini"
                type="danger"
                icon="el-icon-turn-off"
                circle
                @click="loadState(scope.row, 4,'loading3')"/>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="保存" placement="top-start">
              <el-button
                :loading="scope.row.loading4"
                :disabled="scope.row.EnabledState != '正在运行'"
                size="mini"
                type="warning"
                icon="el-icon-collection"
                circle
                @click="loadState(scope.row,6,'loading4')"/>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="暂停" placement="top-start">
              <el-button
                :loading="scope.row.loading5"
                :disabled="scope.row.EnabledState != '正在运行'"
                size="mini"
                type="primary"
                icon="el-icon-video-pause"
                circle
                @click="loadState(scope.row, 9,'loading5')"/>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="重置" placement="top-start">
              <el-button
                :loading="scope.row.loading6"
                :disabled="scope.row.EnabledState != '正在运行'"
                name="reset"
                size="mini"
                type="success"
                icon="el-icon-refresh-right"
                circle
                @click="loadState(scope.row, 11,'loading6')"/>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="重新启动" placement="top-start">
              <el-button
                :disabled="scope.row.EnabledState != '正在运行'"
                :loading="scope.row.loading7"
                size="mini"
                class="check"
                icon="el-icon-folder-checked"
                circle
                @click="loadState(scope.row, 10,'loading7')"/>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="远程桌面" placement="top-start">
              <el-button
                :disabled="scope.row.EnabledState != '正在运行'"
                :loading="scope.row.loading8"
                style="background-color:#000000;"
                size="mini"
                class="check"
                icon="el-icon-monitor"
                circle
                @click="loadState(scope.row, 12,'loading8')"/>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑机器信息" placement="top-start">
              <el-button
                :loading="scope.row.loading9"
                style="background-color:#b59ad9;"
                size="mini"
                class="check"
                icon="el-icon-edit"
                circle
                @click="loadState(scope.row, 13,'loading9')"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

    </el-container>
    <!-- 弹出框 -->
    <el-dialog
      :visible.sync="centerDialogVisible"
      title="编辑机器信息"
      width="30%"
      center
      @closed = "cancelEdit()">
      <el-input
        v-model="ip"
        placeholder="请输入ip地址，如有必要"
        clearable/>
      <el-input
        v-model="username"
        placeholder="请输入机器账户，如有必要"
        style= "margin-top:15px;"
        clearable/>
      <el-input
        v-model="password"
        placeholder="请输入机器密码，如有必要"
        style= "margin-top:15px;"
        show-password
        clearable/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit()">取 消</el-button>
        <el-button type="primary" @click="editMachineInfo()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style type="text/css">
  .el-aside {
    color: #333;
  }
  .check{
    color: #fff;
    background: #48cbbf;
  }

  *::-webkit-scrollbar {width:7px; height:5px; background-color:transparent;} /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  *::-webkit-scrollbar-track {background-color:#f0f6ff;  } /*定义滚动条轨道 内阴影+圆角*/
  *::-webkit-scrollbar-thumb {background-color:#73abb1; border-radius:6px;} /*定义滑块 内阴影+圆角*/
  .scrollbarHide::-webkit-scrollbar{display: none}
  .scrollbarShow::-webkit-scrollbar{display: block}
</style>

<script>

import { machine_info, machine_take, app_start, get_app, modify_ip, connect_service } from '@/api/virtual-config'

export default {
  name: 'VirtualTable',
  components: {},
  filters: {},

  data() {
    return {
      defaultProps: {
        label: 'label',
        children: 'children',
        id: 'id'
      },
      tableData: [],
      tempData: [],
      groupTreeData: [],
      appData: [],
      loadstate: false,
      count: 5,
      activeName: 'first',
      loading: false,
      listLoading: true,
      expands: [],
      centerDialogVisible: false,
      ip: '',
      username: '',
      password: '',
      row: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.tableData = []

      this.tempData = this.tableData
      this.groupTreeData = []
      var temp = []
      machine_info().then(response => {
        this.tableData = response.data.virtual_machine
        this.tableData = this.tableData.filter(item => item.ElementName !== 'TestPlatform')
        this.tempData = this.tableData
        // 获取虚拟机宿主机
        const host_machine = response.data.host_machine
        host_machine.forEach(function(item, index, arr) {
          var myMap = {}
          myMap.id = index
          myMap.label = item['ipaddress']
          myMap.machine_name = item['Name']
          temp.push(myMap)
        })
        this.groupTreeData = temp
        this.listLoading = false
        return temp
        // Just to simulate the time of the request
        // setTimeout(() => {
        // }, 1.5 * 1000)
      })
    },
    handleNodeClick(data) {
      this.tableData = this.tempData
      this.tableData = this.tableData.filter(item => item.HostIp === data['label'])
      if (this.tableData.indexOf(2) !== -1) {
        alert('检查宿主机是否正常运行！')
      }
    },
    loadState(row, task_type, loading) {
      console.log(row)
      this.$set(row, loading, true)

      if (task_type === 12) {
        const req = {}
        if (row.ipaddress === '') {
          // this.dialogVisible = true
          // this.row = row
          this.$prompt('请输入ip地址', 'ip为空', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            this.confirmInput(value, row)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            })
          })
          return
        }
        req['ip_address'] = row.ipaddress
        connect_service(req).then(response => {
          const error_code = response.error_code
          if (!error_code) {
            const href = `http://192.168.0.138:6060/index?host=${row.ipaddress}&username=${row.username}&password=${row.password}`
            window.open(href, '_blank')
            this.$set(row, loading, false)
            return
          } else {
            this.$notify({
              title: 'Warning',
              message: `目标机器无法访问，检查机器是否正常运行！`,
              type: 'warning',
              duration: 5000
            })
            this.$set(row, loading, false)
            return
          }
        })
      }

      if (task_type === 13) {
        this.row = row
        this.centerDialogVisible = true
        this.$set(row, loading, false)
        return
      }
      var req = {}
      req.machine_name = row.Name
      req.ip_address = row.HostIp
      req.task_type = task_type
      machine_take(req).then(response => {
        const error_code = response.error_code
        if (error_code == null) {
          const req = {}
          req.ip_address = row.HostIp
          req.machine_name = row.Name
          this.timers = setInterval(() => {
            app_start(req).then(response => {
              if (!error_code) {
                row.EnabledState = response.data
                clearInterval(this.timers)
                this.$set(row, loading, false)
              }
            })

            this.count -= 1
          }, 5000)
        }
      })
    },
    handle(row, expandedRows) {
      // 判断是否空数组折叠
      if (expandedRows.length === 0) {
        this.expands = []
        this.loading = false
        console.log('空数组')
        return
      }
      // 判断当前操作是否是折叠

      // 折叠
      const row_exists = expandedRows.indexOf(row)
      if (row_exists === -1) {
        this.expands = []
        this.loading = false
        console.log('折叠')
        return
      }

      // 判断虚拟机状态
      if (row.EnabledState !== '正在运行') {
        this.expands = []
        this.$notify({
          title: 'Warning',
          message: `虚拟机未启动，请开启虚拟机！`,
          type: 'warning',
          duration: 10000
        })

        return
      }
      // 判断ip为空
      if (row.ipaddress === '') {
        this.expands = []
        this.$notify({
          title: 'Warning',
          message: `机器ip地址为空无法访问，请设置机器ip！`,
          type: 'warning',
          duration: 10000
        })
        return
      }

      // 展开当前行
      this.expands = []
      this.expands.push(row.Name)
      // 展开
      this.appData = []
      this.loading = true
      const req = {}
      req.machine_name = row.Name

      get_app(req).then(response => {
        const error_code = response.error_code
        if (!error_code) {
          this.appData = response.data
          setTimeout(function() {

          }, 5 * 1000)
          // this.appData = response.data
        } else {
          this.$notify({
            title: 'Warning',
            message: `${response.msg},请检查虚拟机！`,
            type: 'warning',
            duration: 5000
          })
        }
        this.loading = false
      })
    },
    // 标签页切换
    // tabcut(row){
    //   this.$set(row,'activeName', row.first)
    // },
    // 获取当前行key值
    getRowKeys(row) {
      return row.Name
    },
    confirmInput(value, row) {
      if (value !== '') {
        const req = {}
        req['machine_name'] = row.Name
        req['ip_address'] = value

        modify_ip(req).then(response => {
          const error_code = response.error_code
          if (!error_code) {
            row.ipaddress = value
          } else {
            this.$notify({
              title: 'Warning',
              message: `更新失败，请检查服务器！`,
              type: 'warning',
              duration: 5000
            })
          }
        })
      }
    },

    editMachineInfo() {
      const req = {}
      req['machine_name'] = this.row.Name
      req['ip_address'] = this.ip
      req['username'] = this.username
      req['password'] = this.password

      modify_ip(req).then(response => {
        const error_code = response.error_code
        if (!error_code) {
          if (this.ip !== '') {
            this.row.ipaddress = this.ip
          }
        } else {
          this.$notify({
            title: 'Warning',
            message: `更新失败，请检查服务器！`,
            type: 'warning',
            duration: 5000
          })
        }

        this.cancelEdit()
      })
    },
    cancelEdit() {
      this.centerDialogVisible = false
      this.ip = ''
      this.username = ''
      this.password = ''
    }
  }
}

</script>
