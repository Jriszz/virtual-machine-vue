<template>
  <div>
    <package-add/>
    <package-list/>
  </div>
</template>

<script>
import packageList from './packageList'
import packageAdd from './packageAdd'

export default {
  name: 'Package',
  components: {
    packageList,
    packageAdd
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>
