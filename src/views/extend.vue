<template>
  <div>
    <iframe id="mobsf" src="http://bztest.djtest.cn/#/website" scrolling="yes" frameborder="0" style="position:absolute;top:0px;"/>
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
      mobsf.style.width = (Number(deviceWidth) - 210) + 'px' // 数字是页面布局宽度差值
      mobsf.style.height = (Number(deviceHeight) - 50 + 20) + 'px' // 数字是页面布局高度差
    }

    changeMobsfIframe()

    window.onresize = function() {
      changeMobsfIframe()
    }
  }
}
</script>
