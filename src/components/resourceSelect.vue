<template>
  <el-select
    v-model="resourceID"
    :filterable="true"
    :remote="true"
    :remote-method="searchResource"
    :loading="loading"
    :clearable="true"
    placeholder="请选择资源，可搜索"
    @clear="resetResources"
    @change="sendSelectResource"
    @focus="resetResources"
  >
    <el-option
      v-for="resource in resources"
      :key="resource.id"
      :label="resource.name"
      :value="resource.id">
      <span style="float: left">【{{ resource.site_code }}】{{ resource.name }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ resource.api_url }}【{{ resource.method }}】</span>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ResourceSelect',
  components: {},
  model: {
    prop: 'initresourceid',
    event: 'change'
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['initresourceid'],
  data() {
    return {
      loading: false,
      resources: [],
      resourceID: this.initresourceid
    }
  },
  computed: {
    allResources: function() {
      return this.$store.state.resources.resourceEnum || []
    }
  },
  watch: {
    allResources: function() {
      this.resetResources()
    },
    initresourceid: function() {
      this.resourceID = this.initresourceid
    }
  },
  created() {
    this.getResourceEnumList()
  },
  methods: {
    getResourceEnumList() {
      this.$store.dispatch('GetResourceEnum').then(() => {
      }).catch(() => {
      })
    },
    searchResource(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.resources = this.allResources.filter(item => {
            if (item.name.startsWith(query)) {
              return item
            }
          })
        }, 200)
      }
    },
    resetResources() {
      this.resources = this.allResources
    },
    sendSelectResource() {
      this.$emit('change', this.resourceID)
    }
  }
}
</script>
