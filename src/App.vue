<template>
  <v-app id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <Jasma/>
  </v-app>
</template>

<script>
import Jasma from './components/Jasma.vue'

export default {
  name: 'app',
  components: { Jasma },



	methods: {
	      onDeviceReady: function () {
	        // Handle the device ready event.
	        this.cordova.on('pause', this.onPause, false)
	        this.cordova.on('resume', this.onResume, false)
	        if (this.cordova.device.platform === 'Android') {
	          document.addEventListener('backbutton', this.onBackKeyDown, false)
	        }
	        this.cordova.plugins.autoStart.disable();
	        console.log('YES')
	      },
	      onPause () {
	        // Handle the pause lifecycle event.
	        console.log('pause')
	      },
	      onResume () {
	        // Handle the resume lifecycle event.
	        // SetTimeout required for iOS.
	        setTimeout(function () {
	          console.log('resume')
	        }, 0)
	      },
	      onBackKeyDown () {
	        // Handle the back-button event on Android. By default it will exit the app.
	        navigator.app.exitApp()
	      }
	}
}	
    



</script>