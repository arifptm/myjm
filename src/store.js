import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	baseUrl: process.env.VUE_APP_BASEDOMAIN,
    locale: '',
  	license: '',
  },
  
  mutations: {
  	license(state, value){
      state.license = value
    },

    locale(state, value){
      state.locale = value
    },


  },

  actions: {

  }
})
