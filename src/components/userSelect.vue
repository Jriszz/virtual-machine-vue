<template>
  <el-select
    v-model="userID"
    :filterable="true"
    :remote="true"
    :remote-method="searchUser"
    :loading="loading"
    :clearable="true"
    placeholder="请选择人员，可搜索"
    @clear="resetUsers"
    @change="sendSelectUser"
    @focus="resetUsers"
  >
    <el-option
      v-for="user in users"
      :key="user.id"
      :label="user.name"
      :value="user.id">
      <span style="float: left">{{ user.name }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ user.username }}</span>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'UserSelect',
  components: {},
  model: {
    prop: 'inituserid',
    event: 'change'
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['inituserid'],
  data() {
    return {
      loading: false,
      users: [],
      userID: this.inituserid
    }
  },
  computed: {
    allUsers: function() {
      return this.$store.state.users.userEnum || []
    }
  },
  watch: {
    allUsers: function() {
      this.resetUsers()
    },
    inituserid: function() {
      this.userID = this.inituserid
    }
  },
  created() {
    this.getUserEnumList()
  },
  methods: {
    getUserEnumList() {
      this.$store.dispatch('GetUserEnumList').then(() => {
      }).catch(() => {
      })
    },
    searchUser(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.users = this.allUsers.filter(item => {
            if (item.name.startsWith(query)) {
              return item
            }
          })
        }, 200)
      }
    },
    resetUsers() {
      this.users = this.allUsers
    },
    sendSelectUser() {
      this.$emit('change', this.userID)
    }
  }
}
</script>
