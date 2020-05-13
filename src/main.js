import Vue from 'vue'
import App from './App.vue'
import '@/element-ui'
import '@/element-ui-theme'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
