<template>
  <div class="dashboard-container">
    <div class="dashboard-text">姓名: {{ user.name }}</div>
    <!-- <div class="dashboard-text">
      角色:
      <span v-for="role in user.roles" :key="role">
        <span v-if="role==='team_manager'">团队领队</span>
        <span v-else>普通用户</span>
      </span>
    </div> -->
    <div class="dashboard-text">部门: {{ user.department_name }}</div>
    <div class="dashboard-text">工号: {{ user.job_no }}</div>
    <div class="dashboard-text">手机: {{ user.phone }}</div>
    <div class="dashboard-text">邮箱: {{ user.email }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ]),
    user: function() {
      return this.$store.state.user.userOBJ
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px auto auto 80px;
  }
  &-text {
    font-size: 20px;
    line-height: 46px;
    color: #555555;
  }
}
</style>
