<template>
  <div>
    <el-card class="box-card" style="margin:10px 10px 10px 0px; height: 400px; ">
      <div slot="header" class="header floatLeft">
        <strong>统计用例成功率——按作者</strong>
      </div>
      <div slot="header" class="floatRight">
        <el-button class="customButton" size="mini" type="text" @click="exportData">导出CSV</el-button>
      </div>
      <ve-histogram :data="reportByAuthor" :settings="chartSettings"/>
    </el-card>
  </div>
</template>

<script>
import VeHistogram from 'v-charts/lib/histogram'
import { MessageBox, Message } from 'element-ui'

export default {
  name: 'ReportByAuthor',
  components: { MessageBox, Message, VeHistogram },

  data() {
    return {
      chartSettings: {
        axisSite: { right: ['success_rate'] },
        yAxisType: ['KMB', 'percent'],
        yAxisName: ['用例数', '成功率'],
        dimension: ['author'],
        metrics: ['success_rate', 'task_total', 'task_success'],
        // xAxisType: 'time',
        area: true,
        // itemStyle: { color: '#3298f0' },
        labelMap: {
          success_rate: '用例成功率',
          task_total: '用例总数',
          task_success: '用例成功数'
        }
      }
    }
  },
  computed: {
    reportByAuthor: function() {
      return this.$store.state.reports.reportByAuthor
    }
  },
  watch: {},
  mounted() {},
  methods: {
    exportData() {
      this.tools.JSONToCSVConvertor({ data: this.reportByAuthor.rows, title: 'reportByAuthor.csv', showLabel: true })
    }
  }
}
</script>
