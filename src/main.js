import Vue from 'vue'
import './plugins/axios'
import './plugins/vuetify'
import App from './App.vue'

import VueSweetalert2 from 'vue-sweetalert2';
import moment from 'moment'
import hijri  from 'moment-hijri'

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import store from './store'


import VueCarousel from 'vue-carousel';

Vue.use(VueCarousel);


require('typeface-aladin')
require('typeface-eczar')
require('moment-precise-range-plugin')

Vue.prototype.$moment = moment
Vue.prototype.$hijri = hijri



Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
