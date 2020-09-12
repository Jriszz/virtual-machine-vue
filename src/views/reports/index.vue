<template>
  <div class="cs-model">
    <el-card class="box-card el-menu-demo" shadow="hover">
      <div slot="header">
        <span>统计报表</span>
      </div>

      <el-form
        :label-width="labelWidth"
        size="small">
        <el-col>
          <div class="queryType">
            <el-radio-group v-model="lastDay" @change="setQueryDate">
              <el-radio-button :label="-1">全部</el-radio-button>
              <el-radio-button :label="7">最近7天</el-radio-button>
              <el-radio-button :label="15">最近15天</el-radio-button>
              <el-radio-button :label="30">最近30天</el-radio-button>
              <el-radio-button :label="0">自选时间</el-radio-button>
            </el-radio-group>
          </div>
          <div class="querySelectDate">
            <el-date-picker
              v-if="selectRange"
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="setQueryDate"/>
          </div>
        </el-col>
      </el-form>
      <report-by-date/>
      <report-by-flow/>
      <report-by-o-s/>
      <el-row>
        <el-col :span="12">
          <div style="float: left; width: 800px">
            <report-by-app/>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="float: right; width: 800px">
            <report-by-version/>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import ReportByDate from './reportByDate'
import ReportByFlow from './reportByFlow'
import ReportByApp from './reportByApp'
// import ReportByVersion from './reportByVersion'
import ReportByVersion from './reportByVersionTable'
import ReportByOS from './reportByOS'

export default {
  name: 'Report',
  components: {
    ReportByDate,
    ReportByFlow,
    ReportByApp,
    ReportByVersion,
    ReportByOS
  },
  data() {
    return {
      labelWidth: this.config.labelWidth,
      loading: false,
      errorflag: false,
      errorinfo: '',
      lastDay: 15,
      dateRange: []
    }
  },
  computed: {
    selectRange: function() {
      if (this.lastDay === 0) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    this.setQueryDate()
  },
  methods: {
    setQueryDate() {
      const queryCondition = {}
      if (this.lastDay >= 0) {
        queryCondition.date_type = this.lastDay
      }
      if (this.lastDay === 0) {
        if (this.dateRange.length === 2) {
          queryCondition.start_date = this.dateRange[0]
          queryCondition.end_date = this.dateRange[1]
          this.$store.dispatch('getAllReport', queryCondition)
        }
      } else {
        this.$store.dispatch('getAllReport', queryCondition)
      }
    }
  }
}
</script>

<style scoped>
  .queryType {
    float: left;
  }
  .querySelectDate {
    width: 500px;
    margin-left: 30px;
    float: left;
  }
</style>
