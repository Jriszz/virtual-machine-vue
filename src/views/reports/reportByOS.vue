<template>
  <div>
    <el-card class="box-card" style="margin:10px 10px 10px 0px; height: 400px; ">
      <div slot="header" class="header">
        <strong>统计任务成功率——按系统</strong>
      </div>
      <ve-histogram :data="reportByOS" :settings="chartSettings"/>
    </el-card>
  </div>
</template>

<script>
import VeHistogram from 'v-charts/lib/histogram'
import { MessageBox, Message } from 'element-ui'

export default {
  name: 'ReportByOS',
  components: { MessageBox, Message, VeHistogram },

  data() {
    return {
      chartSettings: {
        axisSite: { right: ['success_rate'] },
        yAxisType: ['KMB', 'percent'],
        yAxisName: ['任务数', '成功率'],
        dimension: ['os_name'],
        metrics: ['success_rate', 'task_total', 'task_success'],
        // xAxisType: 'time',
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
    reportByOS: function() {
      return this.$store.state.reports.reportByOS
    }
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>
