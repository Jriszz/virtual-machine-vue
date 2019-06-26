<template>
  <div>
    <el-dialog
      :visible.sync="localHelpDialogVisible"
      width="60%"
      @close="closeDialog">
      <div class="helpBody">
        <div class="formTitle">
          <span>调用Dubbo接口参数填写格式说明</span>
        </div>
        <div class="helpBlack">
          <h3>1. 接口参数列表</h3>
          <p class="helpContent">调用dubbo的参数必须以json列表格式提交，最外层必然是“[]”，里面每一项代表一个参数。举例说明，如果接口只有一个参数，且参数类型为"java.util.List"时，那么最终提交的参数应该为：[[11215, 11223, 11225]]。<br>
            <img src="../../../static/param2-1.png" ><br>
            <img src="../../../static/param2-2.png" >
          </p>
        </div>
        <div class="helpBlack">
          <h3>2. 接口参数格式</h3>
          <p class="helpContent">当选择好一个方法后，参数列表中会给出此方法的参数列表，每一项代表一个参数，并且以字符串形式标明此项参数的数据类型，调用接口时在相应位置用实际参数替换参数声明。<br>
            <img src="../../../static/param3-1.png" ><br>
            <img src="../../../static/param3-2.png" >
          </p>
        </div>
        <div class="helpBlack">
          <h3>3. 接口枚举参数</h3>
          <p class="helpContent">当参数列表中存在枚举参数时，直接用枚举值替换相应项上的参数声明。注意：枚举值的获取目前必须从源代码中找到相应文件（如：com.frxs.user.service.api.enums.UserTypeEnum.java），查看枚举项定义。<br>
            <img src="../../../static/param4-1.png" ><br>
            <img src="../../../static/param4-2.png" >
          </p>
        </div>
        <div class="helpBlack">
          <h3>4. 接口对象参数</h3>
          <p class="helpContent">当参数列表中存在对象参数时，请用对象的json表现形式替换相应项上的参数声明。注意：对象的获取目前必须从源代码中找到相应文件（如：com.frxs.user.service.api.dto.UserDto.java），查看对象定义。<br>
            <img src="../../../static/param5-1.png" ><br>
            <img src="../../../static/param5-2.png" >
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'InvokeHelp',
  components: {},
  model: {
    prop: 'helpDialogVisible',
    event: 'change'
  },
  props: {
    helpDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localHelpDialogVisible: this.helpDialogVisible
    }
  },
  watch: {
    helpDialogVisible: function() {
      this.localHelpDialogVisible = this.helpDialogVisible
    }
  },
  methods: {
    closeDialog: function() {
      this.localHelpDialogVisible = false
      this.$emit('change', this.localHelpDialogVisible)
    }
  }
}
</script>

<style scoped>
.helpBody {
  padding-left: 30px;
  padding-right: 30px;
  color:dimgray;
}
.helpBlack {
  margin-bottom: 50px;
}
.helpContent {
  text-indent:2em;
  line-height: 150%
}
</style>
