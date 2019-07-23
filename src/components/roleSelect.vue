<template>
  <el-select
    v-model="roleID"
    :filterable="true"
    :remote="true"
    :remote-method="searchRole"
    :loading="loading"
    :clearable="true"
    placeholder="请选择角色，可搜索"
    @clear="resetRoles"
    @change="sendSelectRole"
    @focus="resetRoles"
  >
    <el-option
      v-for="role in roles"
      :key="role.id"
      :label="role.name"
      :value="role.id">
      <span style="float: left">{{ role.name }}</span>
      <span style="float: right; color: #8492a6; font-size: 13px">{{ role.code }}</span>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'RoleSelect',
  components: {},
  model: {
    prop: 'initroleid',
    event: 'change'
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['initroleid'],
  data() {
    return {
      loading: false,
      roles: [],
      roleID: this.initroleid
    }
  },
  computed: {
    allRoles: function() {
      return this.$store.state.roles.roleEnum || []
    }
  },
  watch: {
    allRoles: function() {
      this.resetRoles()
    },
    initroleid: function() {
      this.roleID = this.initroleid
    }
  },
  created() {
    this.getRoleEnumList()
  },
  methods: {
    getRoleEnumList() {
      this.$store.dispatch('GetRoleEnumList').then(() => {
      }).catch(() => {
      })
    },
    searchRole(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this.roles = this.allRoles.filter(item => {
            if (item.name.startsWith(query)) {
              return item
            }
          })
        }, 200)
      }
    },
    resetRoles() {
      this.roles = this.allRoles
    },
    sendSelectRole() {
      this.$emit('change', this.roleID)
    }
  }
}
</script>
