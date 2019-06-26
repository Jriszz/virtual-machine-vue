<template>
  <div>
    <iframe id="mobsf" src="https://sy-atf-quality.daojia-inc.com/data/69e9cda33c3d01724d749c0fa9f4bf3c/report/index?sl=77" scrolling="no" frameborder="0" style="position:absolute;top:0px;left: 2px;"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  mounted() {
    /**
      * iframe-宽高自适应显示
      */
    function changeMobsfIframe() {
      const mobsf = document.getElementById('mobsf')
      const deviceWidth = document.body.clientWidth
      const deviceHeight = document.body.clientHeight
      mobsf.style.width = (Number(deviceWidth) - 215) + 'px' // 数字是页面布局宽度差值
      mobsf.style.height = (Number(deviceHeight) - 50) + 'px' // 数字是页面布局高度差
    }

    changeMobsfIframe()

    window.onresize = function() {
      changeMobsfIframe()
    }
  }
}
</script>
