<template>
  <div class="myEditor">
    <div id="monacoEditorContainer" ref="monacoEditorContainer" :style="'height:' + height"/>
  </div>
</template>
<script>
import * as monaco from 'monaco-editor'
export default {
  props: {
    height: {
      type: String,
      default: '600px'
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    codes: {
      type: String,
      default: function() {
        return '<div>请编辑html内容</div>'
      }
    },
    theme: {
      type: String,
      default: 'vs'
    },
    language: {
      type: String,
      default: function() {
        return 'json'
      }
    },
    editorOptions: {
      type: Object,
      default: function() {
        return {
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: this.readOnly,		// 只读
          cursorStyle: 'line',		// 光标样式
          automaticLayout: true,	// 自动布局
          glyphMargin: true, // 字形边缘
          useTabStops: false,
          fontSize: 28,		// 字体大小
          autoIndent: true // 自动布局
          // quickSuggestionsDelay: 500,	//代码提示延时
        }
      }
    }
  },
  data() {
    return {
      localCodes: this.codes
    }
  },
  watch: {
    codes: function() {
      this.localCodes = this.codes
      this.initEditor()
    }
  },
  mounted() {
    this.initEditor()
    const initEditor = this.initEditor.bind(this)
    window.addEventListener('resize', initEditor)
  },
  methods: {
    initEditor: function() {
      console.log('initEditor......')
      this.$refs.monacoEditorContainer.innerHTML = ''
      this.monacoEditor = monaco.editor.create(this.$refs.monacoEditorContainer, {
        value: this.localCodes,
        language: this.language,
        theme: this.theme, // vs, hc-black, or vs-dark
        editorOptions: this.editorOptions
      })
      this.$emit('onMounted', this.monacoEditor)
    }
  }
}
</script>
<style scoped>
    #monacoEditorContainer{
        height:100%;
        text-align: left;
    }
</style>
