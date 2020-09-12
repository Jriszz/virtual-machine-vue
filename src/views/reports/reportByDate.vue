<template>
  <div>
    <el-card class="box-card" style="margin:10px 10px 10px 0px; height: 400px; ">
      <div slot="header" class="header floatLeft">
        <strong>统计任务成功率——按日期</strong>
      </div>
      <div slot="header" class="floatRight">
        <el-button class="customButton" size="mini" type="text" @click="exportData">导出CSV</el-button>
      </div>
      <ve-line :data="reportByDate" :settings="chartSettings"/>
    </el-card>
  </div>
</template>

<script>
import VeLine from 'v-charts/lib/line'
import { MessageBox, Message } from 'element-ui'

export default {
  name: 'ReportByDate',
  components: { MessageBox, Message, VeLine },

  data() {
    return {
      chartSettings: {
        axisSite: { right: ['success_rate'] },
        yAxisType: ['KMB', 'percent'],
        yAxisName: ['任务数', '成功率'],
        dimension: ['run_date'],
        metrics: ['success_rate', 'task_total', 'task_success'],
        xAxisType: 'time',
        area: true,
        // itemStyle: { color: '#3298f0' },
        labelMap: {
          success_rate: '任务成功率',
          task_total: '任务总数',
          task_success: '任务成功数'
        }
      }
    }
  },
  computed: {
    reportByDate: function() {
      return this.$store.state.reports.reportByDate
    }
  },
  watch: {},
  mounted() {},
  methods: {
    exportData() {
      this.tools.JSONToCSVConvertor({ data: this.reportByDate.rows, title: 'reportByDate.csv', showLabel: true })
    }
  }
}
</script>
