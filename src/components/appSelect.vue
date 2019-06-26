<template>
  <el-select
    v-model="applicationID"
    :filterable="true"
    :remote="true"
    :remote-method="searchApplication"
    :loading="loading"
    :clearable="true"
    placeholder="请选择应用，支持模糊搜索"
    @clear="resetApplications"
    @focus="resetApplications"
    @change="sendSelectApplication">
    <el-option
      v-for="application in applications"
      :key="application.name + application.center"
      :label="application.name"
      :value="application.name">
      <span style="float: left">{{ application.name }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ application.center }}</span>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'AppSelect',
  components: {},
  model: {
    prop: 'initapplicationid',
    event: 'change'
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['initapplicationid'],
  data() {
    return {
      loading: false,
      applications: [],
      applicationID: this.initapplicationid
    }
  },
  computed: {
    allApplications: function() {
      return this.$store.state.applications.applicationList || []
    }
  },
  watch: {
    allApplications: function() {
      this.resetApplications()
    },
    initapplicationid: function() {
      this.applicationID = this.initapplicationid
    }
  },
  created() {
    this.getApplicationList()
  },
  methods: {
    getApplicationList() {
      this.$store.dispatch('GetAllApp', { detail: true }).then(() => {
      }).catch(() => {
      })
    },
    searchApplication(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.applications = this.allApplications.filter(item => {
            if (item.name.indexOf(query) >= 0) {
              return item
            }
          })
        }, 200)
      }
    },
    resetApplications() {
      this.applications = this.allApplications
    },
    sendSelectApplication() {
      this.$emit('change', this.applicationID)
    }
  }
}
</script>
