<template>
  <el-select
    v-model="systemID"
    :filterable="true"
    :remote="true"
    :remote-method="searchSystem"
    :loading="loading"
    :clearable="true"
    :disabled="isEditScene"
    placeholder="请选择业务系统"
    @clear="resetSystems"
    @focus="resetSystems"
    @change="sendSelectSystem">
    <el-option
      v-for="system in systems"
      :key="system.code"
      :label="system.name"
      :value="system.code">
      <span style="float: left">{{ system.code }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ system.name }}</span>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'SystemSelect',
  components: {},
  model: {
    prop: 'initsystemid',
    event: 'change'
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['initsystemid', 'isEditScene'],
  data() {
    return {
      loading: false,
      systems: [],
      systemID: this.initsystemid
    }
  },
  computed: {
    allSystems: function() {
      return this.$store.state.systems.systemEnum || []
    }
  },
  watch: {
    allSystems: function() {
      this.resetSystems()
    },
    initsystemid: function() {
      this.systemID = this.initsystemid
    }
  },
  created() {
    this.getSystemList()
  },
  methods: {
    getSystemList() {
      this.$store.dispatch('GetSystemEnum').then(() => {
      }).catch(() => {
      })
    },
    searchSystem(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.systems = this.allSystems.filter(item => {
            if (item.name.indexOf(query) >= 0) {
              return item
            }
          })
        }, 200)
      }
    },
    resetSystems() {
      this.systems = this.allSystems
    },
    sendSelectSystem() {
      this.$emit('change', this.systemID)
    }
  }
}
</script>
