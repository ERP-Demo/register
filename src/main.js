import Vue from 'vue'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import App from './App.vue'
import '@/element-ui'
import '@/element-ui-theme'

Vue.config.productionTip = false
Vue.prototype.$http = httpRequest // Ajax 请求方法

new Vue({
  render: h => h(App)
}).$mount('#app')
