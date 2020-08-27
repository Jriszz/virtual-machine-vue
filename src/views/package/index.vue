<template>
  <div>
    <package-add/>
    <service-list/>
    <package-list/>
  </div>
</template>

<script>
import packageList from './packageList'
import packageAdd from './packageAdd'
import serviceList from './serviceList'

export default {
  name: 'Package',
  components: {
    packageList,
    packageAdd,
    serviceList
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>
