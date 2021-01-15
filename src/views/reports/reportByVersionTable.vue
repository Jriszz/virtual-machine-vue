<template>
  <el-card class="box-card" style="margin:10px 10px 10px 0px;">
    <div slot="header" class="header floatLeft">
      <strong>统计用例成功率——按版本</strong>
    </div>
    <div slot="header" class="floatRight">
      <el-button class="customButton" size="mini" type="text" @click="exportData">导出CSV</el-button>
    </div>
    <el-table
      :data="reportByVersion"
      :stripe="true"
      :border="true"
      height="250px"
      size="small">
      <el-table-column
        prop="version"
        label="版本"/>
      <el-table-column
        prop="task_total"
        label="用例总数"/>
      <el-table-column
        prop="task_success"
        label="成功总数"/>
      <el-table-column
        label="成功率">
        <template slot-scope="scope">
          <span>{{ (scope.row.success_rate * 100).toFixed(2) + "%" }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { MessageBox, Message } from 'element-ui'

export default {
  name: 'ReportByVersion',
  components: { MessageBox, Message },

  data() {
    return {
    }
  },
  computed: {
    reportByVersion: function() {
      return this.$store.state.reports.reportByVersion.rows
    }
  },
  watch: {},
  mounted() {},
  methods: {
    exportData() {
      this.tools.JSONToCSVConvertor({ data: this.reportByVersion, title: 'reportByVersion.csv', showLabel: true })
    }
  }
}
</script>
