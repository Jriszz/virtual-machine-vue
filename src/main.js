import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 引入公用的JS文件
import tools from './utils/tools'
// 引入全局的项目本身配置
import config from './config.vue'
Vue.prototype.tools = tools
Vue.prototype.config = config

Vue.use(ElementUI, { locale })
Vue.filter('json', function(content) {
  return JSON.stringify(content, null, 2)
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
