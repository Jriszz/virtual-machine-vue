<template>
  <el-select
    v-model="workerId"
    :filterable="true"
    :remote="true"
    :remote-method="searchWorker"
    :loading="loading"
    :clearable="true"
    placeholder="请选择Worker"
    @clear="resetWorkers"
    @change="sendSelectWorker"
    @focus="resetWorkers"
  >
    <el-option
      v-for="worker in workers"
      :key="worker.id"
      :label="worker.label"
      :value="worker.value">
      <span>{{ worker.label }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { onlineWorkerList } from '@/api/flows'

export default {
  name: 'WorkerSelect',
  components: {},
  model: {
    prop: 'initworkerid',
    event: 'change'
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['initworkerid'],
  data() {
    return {
      loading: false,
      workers: [],
      allWorkers: [],
      workerId: this.initworkerid
    }
  },
  computed: {},
  watch: {
    allWorkers: function() {
      this.resetWorkers()
    },
    initworkerid: function() {
      this.workerId = this.initworkerid
    }
  },
  created() {
    this.getOnlineWorkerList()
  },
  methods: {
    async getOnlineWorkerList() {
      const res = await onlineWorkerList()
      if (res.error_code === 0) {
        this.allWorkers = res.data
      } else {
        console.log('获取在线Worker列表失败', res)
      }
    },
    searchWorker(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.workers = this.allWorkers.filter(item => {
            if (item.value.startsWith(query)) {
              return item
            }
          })
        }, 200)
      }
    },
    resetWorkers() {
      this.workers = this.allWorkers
    },
    sendSelectWorker() {
      this.$emit('change', this.workerId)
    }
  }
}
</script>
