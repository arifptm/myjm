<template>
	<v-container fluid text-xs-center class="pa-0">
		<div class="green lighten-2" style="height:100vh;">
			
			<v-layout row wrap>
				<v-flex xs12 style="margin-top:20vh;height:80vh">
          <v-img v-if="backgroundSlides ==''" :src="$store.state.baseUrl+'/static/images/jbbg.jpg'" ></v-img>
          <vue-flux v-if="showFlux === true && backgroundSlides !=''" style="z-index:0;"
            :options="fluxOptions" :images="backgroundSlides" :transitions="backgroundTransition" 
            :transitionOptions="fluxTransitionOptions">            
          </vue-flux> 
				</v-flex>		  
			</v-layout>

			<v-layout row wrap class="topbar">
				<v-flex xs6 class="cpt-1 text-xs-left cpx-2">
					<div :class="settings.mos_font+ ' black-shadow2 mosname white--text cpt-1'" v-html="settings.mos_name">						
					</div>
					<div class="cmb-1">
						<span class="mosaddress white--text ma-0 font-weight-bold" v-html="settings.mos_address"></span>
						<span class="moscontact font-weight-bold green--text text--lighten-4" v-if="settings.mos_contact" v-html="settings.mos_contact"></span>
					</div>
				</v-flex>
				<v-flex xs6>			 
					<v-layout row wrap>			
						<v-flex xs6 text-xs-right class="cpt-2" v-if="toDate">						
  						<div class="display-holiday green--text text--lighten-4 font-weight-bold" v-if="toDate && toDate.dateh.diff($hijri().add(settings.hijri_correction, 'days'), 'days') <= settings.holiday">
              <span v-if="toDate.dateh.diff($hijri().add(settings.hijri_correction, 'days'), 'seconds') < 0
              && toDate.dateh.diff($hijri().add(settings.hijri_correction, 'days'), 'seconds') > -86400"  style="border-bottom: 2px solid #fff;">
                <span class="holiday-count white--text" >Hari ini:  </span>
                <span class="holiday-name" > {{ $t(toDate.name) }}</span>
              </span>
            
            <div v-else>
              <span class="holiday-name" >{{ $t(toDate.name) }} </span>
              <span class="white--text holiday-count" >{{ remainingHoliday }}</span>              
            </div>
          </div>



<!-- 
              <div class="display-holiday" v-if="settings.holiday != 0 && toDate.dateh.diff($hijri(), 'days') < settings.holiday">
								
                <div class="green--text text--lighten-4 font-weight-bold" >
									<span style="border-bottom: 2px solid #fff;">
										<span class="holiday-name">{{ $t(toDate.name) }} </span>
										<span class="white--text holiday-count" > {{ remainingHoliday }}</span>
									</span>
								</div>
							</div>  --> 						
						</v-flex>				

						<v-flex xs6 text-xs-right class="cpr-2">
							<div class="clock green--text text--lighten-4 cpt-1"><b>{{ clock.locale($store.state.locale).format('HH:mm:ss') }}</b></div>
						</v-flex>	

						<v-flex xs12 class="text-xs-right cpr-2">
					 		<div class="mdatem white--text pa-0 ma-0 font-weight-bold">
					 			{{ $moment().locale($store.state.locale).format('dddd') }}, {{ $moment().locale($store.state.locale).format('DD MMM YYYY') }}<span style="font-size:3vh;color:#ccc;">M</span> / 
					 				<span v-if="settings.arabic_hijri_calendar == 1" class="mdateharb">
										{{ $hijri().locale('ar-SA').add(settings.hijri_correction, 'days').format('iDD  iMMM  iYYYY') }}
									</span>															
									<span v-else class="mdateh blue--text text--lighten-5 pa-0 ma-0">{{ $hijri().locale($store.state.locale).add(settings.hijri_correction, 'days').format('iDD iMMMM iYYYY') }}<span style="font-size:3vh;color:#ccc;" >H
									</span>
								</span>
							</div>
						</v-flex>
					</v-layout>
				</v-flex>

				<v-layout row wrap class="blackopc" v-if="nextSchedule">
					<v-flex text-xs-center class="cpx-05" v-for="item, k in filteredSchedule" :key="item.index">
						<v-card class="cmy-1 teal" style="transform: skewX(-15deg);">
							<div v-if="settings.arabic_sc_name === 1" class="sc_name white--text">
								<div class="arb">{{ item.ar_name }}</div>
							</div>
	          	<div v-else class="sc_name white--text font-weight-bold">{{ $t(item.name) }}</div>
	          	<div class="sc_time yellow--text text--lighten-2 font-weight-bold">{{  $moment(item.time.date).locale($store.state.locale).format('HH:mm') }}</div>
	         	</v-card>
	       	</v-flex>           			
	    		<v-flex xs2 text-xs-center class="cpx-05" v-if="nextSchedule && generatedTimer && settings.show_next_schedule == 1 && timerDisplay === true">
						<v-card class="cmy-1 grey darken-3" style="transform: skewX(-15deg);">
							<div class="sc_name green--text text--lighten-3" v-if="settings.arabic_next_schedule == 1 ">
								<div class="arb">{{ nextSchedule.ar_name }}</div>
							</div>
          		<div v-else class="sc_name grey--text lighten-2 font-weight-black">{{ $t(nextSchedule.name) }}</div>
          		<div class="sc_time white--text font-weight-bold">{{ ('000' + generatedTimer.toward.hours).slice(-2) }}:{{ ('000'+generatedTimer.toward.minutes).slice(-2) }}<span style="font-size:4vh;line-height: 2vh">:{{ ('000'+generatedTimer.toward.seconds).slice(-2) }}</span>
          		</div>
	          </v-card>
	      	</v-flex>           			
				</v-layout>  
			</v-layout>
  		
			<div class="bottombar">
				<v-layout class="green darken-3">
					<v-flex xs12>
						<v-carousel row v-if="tickers.length > 0" hide-controls hide-delimiters :interval="settings.ticker_time * 1000" height="9vh" class="blackopc cpy-2">
							<v-carousel-item class="ticker green--text text--lighten-4"
							v-for="(ticker,i) in tickers" :key="i"
							:transition="settings.ticker_transition"
							v-text="ticker.text"
							></v-carousel-item>
						</v-carousel>						
					</v-flex>
				</v-layout>          			
			</div>

			<v-dialog v-model="toAdzan" fullscreen persistent :overlay="false" transition="dialog-transition" >
				<div class="absolute" style="background-color: rgba(0, 0, 0, 0.65)" v-if="generatedTimer">
					<v-container fill-height class="pa-0">
						<v-flex xs12 class="text-xs-center">
							<v-progress-circular :rotate="360" :size="progressSize" :width="progressWidth" :value="100-(generatedTimer.toward.seconds * 1.666666667)" color="orange" >
			          <div class="counter-adzan font-weight-bold white--text">{{ generatedTimer.toward.seconds }}</div>
			        </v-progress-circular>
						</v-flex>
					</v-container>            
				</div>       
			</v-dialog>
		</div>
	</v-container>
</template>

<script >

  import { VueFlux, Transitions } from 'vue-flux';
  import { createSimpleTransition } from 'vuetify/es5/util/helpers'

  export default{
    props:['settings', 'clock', 'timerDisplay','generatedTimer','schedule','fetched_tickers', 'toAdzan', 'backgrounds', 'holidays', 'nextKhotbah', 'no_license', 'license_not_match'],   

    components: { VueFlux },
    
    data(){
      return{
        test:false,
        showFlux: false,
               
        color:['tealopc', 'redopc', 'orangeopc', 'greenopc', 'purpleopc',' blueopc', 'greyopc'],
        fluxOptions: {},        
        backgroundTransition:{},

        fluxTransitionOptions:{
          transitionWaterfall:{ tileDuration:1800,tileDelay: 240 },
          transitionFade: { totalDuration: 2000 },
          transitionSwipe: { totalDuration: 2000 },
          transitionBlocks1: { tileDuration: 600, tileDelay: 2000 },
          transitionSlide: { totalDuration: 2000 },
          transitionKenburn: { totalDuration: 3000 },
          transitionZip: { tileDuration: 1800, tileDelay: 240 },
          transitionBlinds2d: { tileDuration: 1600, tileDelay:200 },
          transitionCamera: { tileDuration: 2000, tileDelay: 400 },
          transitionWarp: { tileDuration: 1600,tileDelay: 200 },
          transitionRound2: { tileDuration: 1600, tileDelay:200 },
          transitionBlocks2: { tileDuration: 2000, tileDelay:200 },
          transitionExplode: { tileDuration: 1500, tileDelay:500 }
        },
      }
    },

    mounted(){
      this.startTicker = true
      this.setFlux()
      this.startFlux()
    },

    computed:{

      backgroundSlides(){        
        if(this.backgrounds.length > 0 ){
          return this.backgrounds.map(item => this.$store.state.baseUrl+'/images/'+item.image)
        } else {
          return []
        }        
      },

      prevSchedule(){
        let p = this.schedule.filter(item=> this.$moment(item.time.date).isBefore() && item.name != 'Syuruq' && item.name != 'Imsak')
        return p[p.length-1]
      },

      nextSchedule(){
        let n = this.schedule.filter(item=>this.$moment(item.time.date).isAfter() && item.name != 'Syuruq' && item.name != 'Imsak')
          return n[0]
      },

      tickers(){
      var _0x7498=["license_not_match","Lisensi alat tidak sesuai dengan nomor seri.","Silakan hubungi reseller/customer service","WhatsApp: 0812 2806 2725 / jasmadigital@gmail.com","no_license","Tidak ditemukan kode lisensi pada mesin ini.","nextKhotbah","fetched_tickers","city","khotib","","Khotib Jumat (","DD-MMM-YY","format","locale","state","$store","date","): ","name"," dari ",".","ticker","concat","license","demo","Demo jam sholat masjid menggunakan TV"];if(this[_0x7498[0]]=== true){return [{text:_0x7498[1]},{text:_0x7498[2]},{text:_0x7498[3]}]};if(this[_0x7498[4]]=== true){return [{text:_0x7498[5]},{text:_0x7498[2]},{text:_0x7498[3]}]};var nk=this[_0x7498[6]];var t=this[_0x7498[7]];if(nk){if(nk[_0x7498[9]][_0x7498[8]]!= _0x7498[10]){var ktext=_0x7498[11]+ this.$moment(nk[_0x7498[17]])[_0x7498[14]](this[_0x7498[16]][_0x7498[15]][_0x7498[14]])[_0x7498[13]](_0x7498[12])+ _0x7498[18]+ nk[_0x7498[9]][_0x7498[19]]+ _0x7498[20]+ nk[_0x7498[9]][_0x7498[8]]+ _0x7498[21]}else {var ktext=_0x7498[11]+ this.$moment(nk[_0x7498[17]])[_0x7498[14]](this[_0x7498[16]][_0x7498[15]][_0x7498[14]])[_0x7498[13]](_0x7498[12])+ _0x7498[18]+ nk[_0x7498[9]][_0x7498[19]]}};if(nk[_0x7498[22]]== 1){t= t[_0x7498[23]]({text:ktext})};if(this[_0x7498[16]][_0x7498[15]][_0x7498[24]]== _0x7498[25]){t= t[_0x7498[23]]({text:_0x7498[26]})};return t
      },      

      progressSize(){
        return window.innerHeight * 0.7
      },

      progressWidth(){
        return window.innerHeight * 0.16
      },

      filteredSchedule(){        
          let k = this.schedule.filter(item => {
            return this.$moment(item.time.date).format('DD') == this.$moment().format('DD')
            })
          return k
      },  

      toDate(){

        var td = this.holidays.map(d=>{
            return {name: d.name, dateh: this.$hijri(d.dateh, 'iYYYY-iMM-iDD').subtract(this.hijriTurnOver, 'minutes')}
        })

        .filter(c => {
          return c.dateh.isSameOrAfter(this.$hijri().add(this.settings.hijri_correction * 1440, 'minutes').subtract(1, 'days'))
        })

        .sort((a,b) => { 
          a.dateh.diff(b.dateh)
        })[0]

        return td            
      },

      hijriTurnOver(){
        if(this.schedule != ''){
          var maghrib = this.$moment(this.schedule[5].time.date).locale(this.$store.state.locale).format('HH:mm')
          return  1440 - (parseInt((maghrib.split(':')[0] * 60)) + parseInt(maghrib.split(':')[1]))
        }
      },

      remainingHoliday(){
        return this.toDate.dateh.locale(this.$store.state.locale).from(this.$hijri().add(this.settings.hijri_correction, 'days'))        
      }    
    },

    methods:{
      startFlux(){
        this.showFlux = true
      },

      stopFlux(){
        this.showFlux = false
      },

      setFlux(){
        this.fluxOptions = { autoplay: true, delay: this.settings.carousel_time * 1000}
        
        if (this.settings.background_transition == 'allFluxTransition'){
          this.backgroundTransition = {
            transitionWaterfall: Transitions.transitionWaterfall,
            transitionFade: Transitions.transitionFade,
            transitionSwipe: Transitions.transitionSwipe,
            transitionBlocks1: Transitions.transitionBlocks1,
            transitionSlide: Transitions.transitionSlide,
            transitionKenburn: Transitions.transitionKenburn,
            transitionZip: Transitions.transitionZip,
            transitionBlinds2d: Transitions.transitionBlinds2d,
            transitionCamera: Transitions.transitionCamera,
            transitionWarp: Transitions.transitionWarp,
            transitionRound2: Transitions.transitionRound2,
            transitionBlocks2: Transitions.transitionBlocks2,
            transitionExplode: Transitions.transitionExplode
          }
        }

        if (this.settings.background_transition == 'fadeFluxTransition'){
          this.backgroundTransition = {            
            transitionFade: Transitions.transitionFade,
          }
        }

        if (this.settings.background_transition == 'slideFluxTransition'){
          this.backgroundTransition = {            
            transitionSlide: Transitions.transitionSlide,
          }
        }        
      },
      
    }
  }
</script>

<style scoped>

.aladin.mosname{ font-family: Aladin; font-size: 6vh; line-height: 7vh;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}
.eczar.mosname{ font-family: 'Eczar'; font-size: 6.5vh; line-height: 7vh;font-weight: 500;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}
.roboto.mosname{ font-family: Roboto; font-size: 6vh; line-height: 7vh;font-weight: 500;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}
.oleo.mosname{ font-family: "Oleo Script"; font-size: 6vh; line-height: 7vh;font-weight: 500;}

	.topbar{position: absolute;top:0;background: rgba(0,0,0,0.5);width: 100%;}
	.bottombar{position: absolute;bottom:0; width: 100%; }

	.mday{ font-size: 5vh; line-height:5vh;}
	.mdatem{ font-size: 4vh; line-height:5vh;padding-bottom: 0.5vh;}
	.mdateh{ font-size: 4vh; line-height:5vh;}	

	.mosaddress {font-size:3vh; line-height: 4vh;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}
	.moscontact {font-size:3vh; line-height: 4vh;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}
	
	.clock{ font-size: 9vh;line-height:9vh}
	
	.display-timer{font-size:6vh;line-height:4vh;height: 4vh;font-weight: bold}
	.display-holiday{font-size:4vh;line-height:7vh;height: 7vh;}	
	.holiday-name {font-size:3.5vh;}
	.holiday-count{font-size: 3.25vh;}
	
	.sc_name{font-size:5vh;line-height:6vh;}
	.sc_time{font-size:7vh;line-height:7vh;}
		
	.ticker{ white-space: nowrap; overflow: hidden; color:#fefefe;font-size:5.4vh;line-height:5.4vh;}

	.counter-adzan{font-size:22vh; text-shadow:0 0 45px #000000; }

.opc0, .opc0.v-card {background-color: transparent;}
.blackopc, .blackopc.v-card{background-color: rgba(0, 0, 0, 0.5);text-shadow: 0px 0px 25px #000;}
.whiteopc, .whiteopc.v-card{background-color: rgba(255, 255, 255, 0.6);}
.purpleopc, .purpleopc.v-card{background-color: rgba(156, 39, 176, 0.5);text-shadow: 0px 0px 25px #000;}
.tealopc,  .tealopc.v-card{background-color: rgba(0, 150, 136, 0.5);text-shadow: 0px 0px 25px #000;}
.orangeopc, .orangeopc.v-card{background-color: rgba(255, 152, 0, 0.5);text-shadow: 0px 0px 25px #000;}
.redopc, .redopc.v-card{background-color: rgba(244, 67, 54, 0.5);text-shadow: 0px 0px 25px #000;}
.greenopc, .greenopc.v-card{background-color: rgba(76, 175, 80, 0.5);text-shadow: 0px 0px 25px #000;}
.blueopc, .blueopc.v-card{background-color: rgba(33, 150, 243, 0.5); text-shadow: 0px 0px 25px #000;}
.greyopc, .greyopc.v-card{background-color: rgba(155, 155, 155, 0.7);}

.slideup-enter-active, .slideup-leave-active{transition: 0.6s;position: absolute;top: 0;right: 0;} 
.slideup-leave-to{transform: translate3d(0, -100%,0); opacity: 0;}
.slideup-enter{transform: translate3d(0, 100%,0); opacity: 0;} 

.slideleft-enter-active, .slideleft-leave-active{transition: 0.6s;position: absolute;top: 0;right: 0;}
.slideleft-leave-to{transform: translate3d(-100%,0,0);}
.slideleft-enter{transform: translate3d(100%,0,0);}

.fade-enter-active, .fade-leave-active{transition: 1s;}
.fade-leave-to{opacity: 0;}
.fade-enter{opacity: 0;}

.arb{ font-family: 'Arabic'; font-size: 7.5vh; font-weight: bold;line-height:5.5vh;padding-top:1vh;} /*sholat-name*/
.display-timer-arb{ font-family: 'Arabic'; font-size:9.5vh } /*nextschedule*/
.mdateharb {  font-family: 'Arabic';font-size: 6.5vh; line-height:5vh;margin-top: 1vh;} /*top date*/

</style>