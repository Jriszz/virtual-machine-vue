<template>
  <div>
    <el-dialog
      :visible.sync="localHistoryDialogVisible"
      width="60%"
      @close="closeDialog">
      <div class="formTitle">
        <span>{{ title }}</span>
      </div>

      <el-card>
        <el-table
          v-loading="loading"
          :data="result"
          :stripe="true"
          :border="true">
          <el-table-column
            width="80"
            label="参数复用">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="selectHistory(scope.row.raw_params)">复用</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="invoke_time"
            width="110"
            label="调用时间"/>
          <el-table-column
            label="请求参数">
            <template slot-scope="scope">
              <pre>{{ scope.row.raw_params | json }}</pre>
            </template>
          </el-table-column>
          <el-table-column
            label="响应内容">
            <template slot-scope="scope">
              <pre>{{ scope.row.responses | json }}</pre>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'InvokeHistory',
  components: {},
  model: {
    prop: 'historyDialogVisible',
    event: 'change'
  },
  props: {
    historyDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      result: [],
      localHistoryDialogVisible: this.historyDialogVisible
    }
  },
  computed: {
    form: function() {
      const service = this.$store.state.services.currentService
      const method = this.$store.state.services.currentMethod
      const form = {}
      if (service && method) {
        form['service'] = service.name
        form['method'] = method.name
      }
      return form
    },
    title: function() {
      const method = this.$store.state.services.currentMethod
      if (method) {
        return method.name + '方法调用历史记录'
      }
      return 'Dubbo调用历史记录'
    }
  },
  watch: {
    historyDialogVisible: function() {
      this.localHistoryDialogVisible = this.historyDialogVisible
      if (this.historyDialogVisible) {
        this.getInvokeHistory()
      }
    }
  },
  methods: {
    closeDialog() {
      this.localHistoryDialogVisible = false
      this.$emit('change', this.localHistoryDialogVisible)
    },
    getInvokeHistory() {
      this.loading = true
      if (Object.keys(this.form).length > 0) {
        this.result = []
        this.$store.dispatch('InvokeHistory', this.form).then((result) => {
          this.loading = false
          this.result = result
        }).catch(() => {
          this.loading = false
        })
      }
    },
    selectHistory(params) {
      this.$emit('select', params)
      this.closeDialog()
    }
  }
}
</script>

<style scoped>
.helpBody {
  padding-left: 30px;
  padding-right: 30px;
  color:dimgray;
}
.helpBlack {
  margin-bottom: 50px;
}
.helpContent {
  text-indent:2em;
  line-height: 150%
}
</style>
