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
import i18n from './i18n'

Vue.use(VueCarousel);
Vue.use(VueSweetalert2);

require('typeface-aladin')
require('typeface-eczar')
require('moment-precise-range-plugin')

Vue.prototype.$moment = moment
Vue.prototype.$hijri = hijri



Vue.config.productionTip = false

new Vue({
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

// i18n.locale = ''
