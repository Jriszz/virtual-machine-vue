<template>
  <div>
    <el-card class="box-card" style="margin:10px 10px 10px 0px;">
      <div slot="header" class="header">
        <strong>统计任务成功率——按应用</strong>
      </div>
      <el-table
        :data="reportByApp"
        :stripe="true"
        :border="true"
        height="250px"
        size="small">
        <el-table-column
          prop="package"
          label="名称"/>
        <el-table-column
          prop="edition"
          label="版本"/>
        <el-table-column
          prop="version"
          label="版本"/>
        <el-table-column
          prop="arch"
          label="架构"/>
        <el-table-column
          prop="task_total"
          label="任务总数"/>
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
  </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'

export default {
  name: 'ReportByApp',
  components: { MessageBox, Message },

  data() {
    return {
    }
  },
  computed: {
    reportByApp: function() {
      return this.$store.state.reports.reportByApp
    }
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>
