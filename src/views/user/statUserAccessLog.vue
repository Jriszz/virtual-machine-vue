<template>
  <div class="statPanel">
    <el-row :gutter="5">
      <el-col :span="8">
        <el-card class="box-card" style="margin:10px 10px 10px 0px; height: 400px; ">
          <div slot="header" class="header">
            <strong>统计条件</strong>
          </div>
          <div style="width: 300px; height: 300px; margin: 5px 20px;">
            <div style="float:left">
              <p v-if="conditions && conditions.start_date">起始日期：{{ conditions.start_date }}</p>
              <p v-else>起始日期：不限</p>
              <p v-if="conditions && conditions.end_date">截止日期：{{ conditions.end_date }}</p>
              <p v-else>截止日期：不限</p>
              <p v-if="conditions && conditions.site_name">涉及站点：{{ conditions.site_name }}</p>
              <p v-else>涉及站点：不限</p>
              <p v-if="conditions && conditions.method">统计行为：{{ conditions.method }}</p>
              <p v-else>统计行为：不限</p>
              <p v-if="conditions && conditions.api_desc">接口描述：{{ conditions.api_desc }}</p>
              <p v-if="conditions && conditions.api_url">接口地址：{{ conditions.api_url }}</p>
              <p v-else>统计接口：不限</p>
              <p v-if="conditions && conditions.username">调用人员：{{ conditions.username }}</p>
              <p v-else-if="conditions && conditions.name">调用人员：{{ conditions.name }}</p>
              <p v-else>调用人员：不限</p>
              <p v-if="conditions && conditions.status==='all'">请求结果：所有</p>
              <p v-if="conditions && conditions.status==='success'">请求结果：成功</p>
              <p v-if="conditions && conditions.status==='failed'">请求结果：失败</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" style="margin:10px 10px 10px 0px; height: 400px;">
          <div slot="header" class="header">
            <strong>按调用结果</strong>
          </div>
          <ve-pie :data="statResultByStatus" :settings="byStatusSettings" :loading="byStatusLoading" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card" style="margin:10px 10px 10px 0px; height: 400px;">
          <div slot="header" class="header">
            <strong>按站点</strong>
          </div>
          <ve-pie :data="statResultBySite" :settings="bySiteSettings" :loading="bySiteLoading" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-card class="box-card" style="margin:10px 10px 10px 0px; height: 400px; ">
          <div slot="header" class="header">
            <strong>调用日期</strong>
          </div>
          <ve-line :data="statResultByDate" :settings="byDateSettings" :loading="byDateLoading" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-card class="box-card" style="margin:10px 10px 10px 0px; height: 400px; ">
          <div slot="header" class="header">
            <strong>被调用接口</strong>
          </div>
          <ve-histogram :data="statResultByInterface" :settings="byInterfaceSettings" :loading="byInterfaceLoading" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-card class="box-card" style="margin:10px 10px 10px 0px; height: 400px; ">
          <div slot="header" class="header">
            <strong>调用人员</strong>
          </div>
          <ve-histogram :data="statResultByUser" :settings="byUserSetting" :loading="byUserLoading" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import 'v-charts/lib/style.css'
import VePie from 'v-charts/lib/pie'
import VeLine from 'v-charts/lib/line'
import VeHistogram from 'v-charts/lib/histogram'
import * as statAPI from '../../api/stat'
export default {
  name: 'StatUserAccessLog',
  components: { VePie, VeLine, VeHistogram },
  props: {
    conditions: { type: [Object, null], default: function() { return {} } }
  },
  data() {
    return {
      byStatusLoading: false,
      byUserLoading: false,
      byDateLoading: false,
      byInterfaceLoading: false,
      bySiteLoading: false,
      statResultByUser: { columns: ['name', 'success', 'failed', 'errorRate'], rows: [] },
      statResultByInterface: { columns: ['api_desc', 'success', 'failed', 'errorRate'], rows: [] },
      statResultByDate: { columns: ['access_date', 'success', 'failed', 'errorRate'], rows: [] },
      statResultBySite: { columns: ['site_code', 'count'], rows: [] },
      statResultByStatus: { columns: ['status', 'count'], rows: [] },
      byInterfaceSettings: {
        stack: { '调用量': ['success', 'failed', 'errorRate'] },
        labelMap: {
          'success': '请求成功',
          'failed': '请求失败',
          'errorRate': '失败百分比'
        }
      },
      byUserSetting: {
        labelMap: {
          'success': '请求成功',
          'failed': '请求失败',
          'errorRate': '失败百分比'
        },
        stack: { '调用量': ['success', 'failed', 'errorRate'] }
      },
      byDateSettings: {
        labelMap: {
          'success': '请求成功',
          'failed': '请求失败',
          'errorRate': '失败百分比'
        },
        xAxisType: 'time'
      },
      byStatusSettings: {
        dimension: 'status',
        metrics: 'count'
      },
      bySiteSettings: {
        dimension: 'site_code',
        metrics: 'total'
      }
    }
  },
  computed: {},
  watch: {
    conditions: function(newValue, oldValue) {
      if (newValue !== null) {
        console.log(newValue)
        this.getStatisResult()
      }
    }
  },
  mounted() {
    this.getStatisResult()
  },
  created() {
  },
  methods: {
    getStatisResult() {
      console.log(JSON.stringify(this.conditions))
      this.getStatByUser()
      this.getStatByInterface()
      this.getStatByDate()
      this.getStatBySite()
      this.getStatByStatus()
    },
    getStatByUser() {
      this.byUserLoading = true
      statAPI.statByUser(this.conditions).then(res => {
        this.statResultByUser.rows = res.data
        this.byUserLoading = false
      }).catch(error => {
        console.log(error)
        this.byUserLoading = false
      })
    },
    getStatByInterface() {
      this.byInterfaceLoading = true
      statAPI.statByInterface(this.conditions).then(res => {
        this.statResultByInterface.rows = res.data
        this.byInterfaceLoading = false
      }).catch(error => {
        console.log(error)
        this.byInterfaceLoading = false
      })
    },
    getStatByDate() {
      this.byDateLoading = true
      statAPI.statByDate(this.conditions).then(res => {
        const result = []
        let dateVar = null
        for (let i = 0; i < res.data.length; i++) {
          // 当前迭代中的日期
          const itemDate = new Date(res.data[i].access_date.replace(/-/, '/'))

          // 首次迭代时直接赋值
          if (!dateVar) {
            dateVar = new Date(itemDate.valueOf())
          }

          // 后续判断日期是否连续，连续时直接追回到数据中，不连续中补齐中间的缺失日期
          if (itemDate - dateVar === 0) {
            result.push(res.data[i])
            dateVar.setDate(dateVar.getDate() + 1)
          } else {
            while (itemDate - dateVar !== 0) {
              result.push({ 'access_date': dateVar.toLocaleDateString().replace(/\//g, '-'), 'success': 0, 'failed': 0, 'errorRate': 0 })
              dateVar = new Date(dateVar.setDate(dateVar.getDate() + 1))
            }
            result.push(res.data[i])
            dateVar.setDate(dateVar.getDate() + 1)
          }
        }
        this.statResultByDate.rows = result
        this.byDateLoading = false
      }).catch(error => {
        console.log(error)
        this.byDateLoading = false
      })
    },
    getStatBySite() {
      this.bySiteLoading = true
      statAPI.statBySite(this.conditions).then(res => {
        this.statResultBySite.rows = res.data
        this.bySiteLoading = false
      }).catch(error => {
        console.log(error)
        this.bySiteLoading = false
      })
    },
    getStatByStatus() {
      this.byStatusLoading = true
      statAPI.statByStatus(this.conditions).then(res => {
        this.statResultByStatus.rows = res.data
        this.byStatusLoading = false
      }).catch(error => {
        this.byStatusLoading = false
        console.log(error)
      })
    }
  }
}
</script>

<style rel="stylesheet/css" lang="css" scoped>
.statPanel {
  margin: 0px;
}
</style>
