<template>
  <div>
    <package-list/>
    <package-add/>
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
