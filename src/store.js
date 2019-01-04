import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	baseUrl: process.env.VUE_APP_BASEDOMAIN,    
    locale: 'en',
  	license: '',
    license_not_match: false,
    no_license: true,
    jumbotron: false,
  },
  
  mutations: {
  	license(state, value){
      state.license = value
    },

    locale(state, value){
      state.locale = value
    },

    jumbotron(state, value){
      state.jumbotron = value
    },

    license_not_match(state, value){
      state.license_not_match = value
    },

    no_license(state, value){
      state.no_license = value
    },

  },

  actions: {

  }
})
