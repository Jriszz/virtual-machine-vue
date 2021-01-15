<template>
  <div>
    <el-card class="box-card" style="margin:10px 10px 10px 0px; height: 400px; ">
      <div slot="header" class="header">
        <strong>统计用例成功率——按版本</strong>
      </div>
      <ve-histogram :data="reportByVersion" :settings="chartSettings"/>
    </el-card>
  </div>
</template>

<script>
import VeHistogram from 'v-charts/lib/histogram'
import { MessageBox, Message } from 'element-ui'

export default {
  name: 'ReportByVersion',
  components: { MessageBox, Message, VeHistogram },

  data() {
    return {
      chartSettings: {
        axisSite: { right: ['success_rate'] },
        yAxisType: ['KMB', 'percent'],
        yAxisName: ['用例数', '成功率'],
        dimension: ['version'],
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
    reportByVersion: function() {
      return this.$store.state.reports.reportByVersion
    }
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>
