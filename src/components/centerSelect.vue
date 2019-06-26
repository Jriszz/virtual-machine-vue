<template>
  <el-select
    v-model="centerID"
    :filterable="true"
    :remote="true"
    :remote-method="searchCenter"
    :loading="loading"
    :clearable="true"
    placeholder="请选择注册中心"
    @clear="resetCenters"
    @focus="resetCenters"
    @change="sendSelectCenter">
    <el-option
      v-for="center in centers"
      :key="center.address"
      :label="center.address"
      :value="center.address">
      <span style="float: left">{{ center.address }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ center.desc }}</span>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'CenterSelect',
  components: {},
  model: {
    prop: 'initcenterid',
    event: 'change'
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['initcenterid'],
  data() {
    return {
      loading: false,
      centers: [],
      centerID: this.initcenterid
    }
  },
  computed: {
    allCenters: function() {
      return this.$store.state.centers.centerList || []
    }
  },
  watch: {
    allCenters: function() {
      this.resetCenters()
    },
    initcenterid: function() {
      this.centerID = this.initcenterid
    }
  },
  created() {
    this.getCenterList()
  },
  methods: {
    getCenterList() {
      this.$store.dispatch('GetCenterList').then(() => {
      }).catch(() => {
      })
    },
    searchCenter(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.centers = this.allCenters.filter(item => {
            if (item.name.indexOf(query) >= 0) {
              return item
            }
          })
        }, 200)
      }
    },
    resetCenters() {
      this.centers = this.allCenters
    },
    sendSelectCenter() {
      this.$emit('change', this.centerID)
    }
  }
}
</script>
