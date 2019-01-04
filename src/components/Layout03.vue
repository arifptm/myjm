<template>	
	<v-container fluid text-xs-center class="pa-0">
		
		<v-layout row wrap class="topbar px-0" :style="`background:url('`+$store.state.baseUrl+`/static/images/topbg.jpg') top center no-repeat; width:100%;background-size:100%;height:20vh;`">			
			<v-flex xs10 offset-xs1>
		    <v-container fluid fill-height style="position: absolute;top:0;left:0;padding: 0px;margin:0px;" >
		      <v-layout align-center justify-center>
		        <v-flex xs12 class="text-xs-center cpb-2">
		          <div :class="settings.mos_font+ ' mosname yellow--text text--lighten-4 ma-0 black-shadow2'" v-html="settings.mos_name"></div>
						<span class="mosaddress white--text cpb-3 ma-0 font-weight-bold" v-html="settings.mos_address"></span>
						<span class="moscontact font-weight-bold yellow--text text--lighten-3" v-if="settings.mos_contact" v-html="settings.mos_contact"></span>
		        </v-flex>
		      </v-layout>
		    </v-container>				
			</v-flex>
		</v-layout>
		
		<v-layout row wrap class="pa-0 ma-0" style="width:100%;position: absolute;top:20vh;height: 61vh" v-if="$store.state.jumbotron === false">      
				<v-flex xs8 class="cmy-1 pl-0 cpr-1">
					<v-img v-if="backgroundSlides ==''" :src="$store.state.baseUrl+'/static/images/jbbg.jpg'" ></v-img>

          <vue-flux style="z-index:0;" v-if="showFlux === true && backgroundSlides !=''"
            :options="fluxOptions"
            :images="backgroundSlides"
            :transitions="backgroundTransition" 
            :transitionOptions="fluxTransitionOptions"
            ref="slider"         
          ></vue-flux> 
				</v-flex>

				<v-flex xs4 class="cmt-1 cmb-0 cpx-0">					
						<v-layout row wrap class="pa-0 ma-0 orange darken-2">	
							<v-flex xs5 class="cpt-1 cpx-1">
								<v-card height= "9.5vh">
									<div class="mday">{{ $moment().locale(this.$store.state.locale).format('dddd') }}</div>	  
								</v-card>
							</v-flex>

							<v-flex xs7 class="cpt-1 cpr-1">
								<v-card height= "9.5vh">
									<div class="clock red--text"><b>{{ clock.locale(this.$store.state.locale).format('HH:mm:ss') }}</b></div>	  
								</v-card>
							</v-flex>

							<v-flex xs12 class="cmx-1 cpt-1">
								<v-card height= "15vh">
									<div class="mdatem blue--text font-weight-bold text--darken-3">{{ $moment().locale(this.$store.state.locale).format('DD MMMM YYYY') }}<span style="font-size:3vh;color:#4386d1;" >M</span></div>
									<v-divider class="blue lighten-5 "></v-divider>
									<div v-if="settings.arabic_hijri_calendar == 1" class="mdateharb  blue--text text--darken-3 font-weight-bold">								
                    {{ $moment().add(hijriTurnOver, 'minutes').locale('ar_SA').format('dddd,') }}
                    {{ $hijri().add(hijriTurnOver, 'minutes').add(settings.hijri_correction, 'days').locale('ar_SA').format('iDD  iMMM  iYYYY') }}
									</div>

									<div v-else class="mdateh blue--text text--darken-3 font-weight-bold">
                    {{ $hijri().locale($store.state.locale).add(hijriTurnOver, 'minutes').add(settings.hijri_correction, 'days').format('iDD') }}
                    {{ $t($hijri().locale($store.state.locale).add(hijriTurnOver, 'minutes').add(settings.hijri_correction, 'days').format('iMMMM')) }}
                    {{ $hijri().locale($store.state.locale).add(hijriTurnOver, 'minutes').add(settings.hijri_correction, 'days').format('iYYYY') }}<span style="font-size:3vh;color:#4386d1;" >H</span></div>
								</v-card>
							</v-flex>

							<v-flex xs12 class="cpa-1">
								<v-card color="black" height="33vh" class="" flat>
									<v-container fluid fill-height style="position: absolute;top:0;right:0;padding: 0px;margin:0px;" v-if="$store.state.jumbotron === false">
      							<v-layout align-center justify-center>
        							<v-flex xs12 class="text-xs-center cpa-1">
                        <swiper v-if="showTicker === true" :options="swiperOption" ref="mySwiper" >    
                          <swiper-slide v-for="(ticker,i) in tickers" :key="i" class="ticker"><div>{{ ticker.text }}</div></swiper-slide>
                        </swiper>
        							</v-flex>
      							</v-layout>
    							</v-container>
								</v-card>
							</v-flex>

						</v-layout>
					
				</v-flex>

			</v-layout>
	

		<div class="bottombar">          	
      <v-layout row wrap  >
				<v-flex xs4 class="cmb-1" v-if="toDate">
					<div class="whiteopc display-holiday white-shadow1 font-weight-bold" v-if="toDate && toDate.dateh.diff($hijri().add(settings.hijri_correction, 'days'), 'days') <= settings.holiday">
						<div v-if="toDate.dateh.diff($hijri().add(settings.hijri_correction, 'days'), 'seconds') < 0
    					&& toDate.dateh.diff($hijri().add(settings.hijri_correction, 'days'), 'seconds') > -86400">
							<span class="holiday-count green--text text--darken-4" >Hari ini: </span>
							<span class="holiday-name black--text" > {{ $t(toDate.name) }}</span>
						</div>
						
						<div v-else>
							<span class="holiday-name" >{{ $t(toDate.name) }} </span>
							<span class="holiday-count green--text text--darken-4" >{{ remainingHoliday }}</span>							
						</div>
					</div>
				</v-flex>

				<v-flex xs4 class="cpr-1 cmb-1">
					<div class="whiteopc display-timer white-shadow1 font-weight-bold" v-if="generatedTimer && nextSchedule && settings.show_next_schedule == 1">
						<span v-if="settings.arabic_next_schedule == 1" class="display-timer-arb">{{ nextSchedule.ar_name }} - </span>
						<span v-else class="display-timer-ind">{{ $t(nextSchedule.name) }} - </span>
						<span class="display-timer-counter green--text text--darken-4 font-weight-bold">
              {{ ('000' + generatedTimer.toward.hours).slice(-2) }}:{{ ('000'+generatedTimer.toward.minutes).slice(-2) }}:{{ ('000'+generatedTimer.toward.seconds).slice(-2) }}
					 	</span>						
					</div>
				</v-flex>
        
      </v-layout>		        

			<v-layout row wrap class="orange darken-2 cpy-1">
				<v-flex xs2 text-xs-center v-for="item, k in filteredSchedule" :key="item.index">
					<v-card flat class="opc0 cpx-1">
						<div class="sc_name_arb yellow--text" v-if="settings.arabic_sc_name == 1">
              {{ item.ar_name }}
						</div>
						<div v-else class="sc_name yellow--text text--lighten-3" ><b>{{ $t(item.name) }}</b></div>	

						<div class="sc_time blue--text text--darken-4 font-weight-bold">{{ $moment(item.time.date).locale($store.state.locale).format('HH:mm') }}</div>
					</v-card>
				</v-flex>          				
			</v-layout>          
		</div>

		<v-dialog v-model="toAdzan" fullscreen persistent :overlay="false" transition="dialog-transition" >
			<div class="absolute" style="background-color: rgba(0, 0, 0, 0.65)">
				<v-container fill-height class="pa-0">
					<v-flex xs12 class="text-xs-center" v-if="generatedTimer">
						<v-progress-circular :rotate="360" :size="progressSize" :width="progressWidth" :value="100-(generatedTimer.toward.seconds * 1.666666667)" color="orange" >
			              	<div class="counter-adzan font-weight-bold white--text">{{ generatedTimer.toward.seconds }}</div>
			            </v-progress-circular>  
					</v-flex>
				</v-container>            
			</div>       
		</v-dialog>
		

	</v-container>
</template>

<script >

  import { VueFlux, Transitions } from 'vue-flux';

  import 'swiper/dist/css/swiper.css'
  import { swiper, swiperSlide } from 'vue-awesome-swiper'

  export default{
    props:['settings', 'clock', 'timerDisplay','generatedTimer','schedule','fetched_tickers', 'toAdzan', 'backgrounds', 'holidays', 'nextKhotbah'],

    components: { VueFlux, swiper, swiperSlide },
    
    data(){
      return{
        test:false,
        showFlux: false,
        showTicker: false,
        
        swiperOption: {},
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
        },
      }
    },

    mounted(){      
      this.setFlux()
      this.setTicker()
      this.startFlux()
      this.startTicker()
      // this.swiper.autoplay.start();
    },

    computed:{
      swiper() {
        return this.$refs.mySwiper.swiper
      },

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
        var _0xa265=["license_not_match","state","$store","Lisensi alat tidak sesuai dengan nomor seri.","Silakan hubungi reseller/customer service","WhatsApp: 0812.2806.2725 / jasmadigital@gmail.com","no_license","Tidak ditemukan kode lisensi pada mesin ini.","nextKhotbah","fetched_tickers","city","khotib","","Khotib Jumat (","DD-MMM-YY","format","locale","date","): ","name"," dari ",".","ticker","concat","license","demo","Demo jam sholat masjid menggunakan TV"];if(this[_0xa265[2]][_0xa265[1]][_0xa265[0]]=== true){return [{text:_0xa265[3]},{text:_0xa265[4]},{text:_0xa265[5]}]};if(this[_0xa265[2]][_0xa265[1]][_0xa265[6]]=== true){return [{text:_0xa265[7]},{text:_0xa265[4]},{text:_0xa265[5]}]};var nk=this[_0xa265[8]];var t=this[_0xa265[9]];if(nk){if(nk[_0xa265[11]][_0xa265[10]]!= _0xa265[12]){var ktext=_0xa265[13]+ this.$moment(nk[_0xa265[17]])[_0xa265[16]](this[_0xa265[2]][_0xa265[1]][_0xa265[16]])[_0xa265[15]](_0xa265[14])+ _0xa265[18]+ nk[_0xa265[11]][_0xa265[19]]+ _0xa265[20]+ nk[_0xa265[11]][_0xa265[10]]+ _0xa265[21]}else {var ktext=_0xa265[13]+ this.$moment(nk[_0xa265[17]])[_0xa265[16]](this[_0xa265[2]][_0xa265[1]][_0xa265[16]])[_0xa265[15]](_0xa265[14])+ _0xa265[18]+ nk[_0xa265[11]][_0xa265[19]]}};if(nk[_0xa265[22]]== 1){t= t[_0xa265[23]]({text:ktext})};if(this[_0xa265[2]][_0xa265[1]][_0xa265[24]]== _0xa265[25]){t= t[_0xa265[23]]({text:_0xa265[26]})};return t

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

      startTicker(){ this.showTicker = true },
      stopTicker(){ this.showTicker = false },
      startFlux(){ this.showFlux = true},      
      stopFlux(){ this.showFlux = false },

      setTicker(){
        this.swiperOption = {
          effect: this.settings.ticker_transition.split(' ')[0],
          autoHeight: true,
          direction: this.settings.ticker_transition.split(' ')[1],
          speed:1500,
          loop:true,
          autoplay:{            
            delay: this.settings.ticker_time * 1000
          }
        }        
      },

      setFlux(){
        this.fluxOptions = { autoplay: true, delay: this.settings.carousel_time * 1000 }        
        
        if (this.settings.background_transition == 'all'){
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

        if (this.settings.background_transition == 'fade'){
          this.backgroundTransition = {            
            transitionFade: Transitions.transitionFade,
          }
        }

        if (this.settings.background_transition == 'slide'){
          this.backgroundTransition = {            
            transitionSlide: Transitions.transitionSlide,
          }
        }        
      },
      
    }
  }
</script>

<style scoped>

.aladin.mosname{ font-family: Aladin; font-size: 7vh; line-height: 7vh;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}
.eczar.mosname{ font-family: Eczar; font-size: 7vh; line-height: 7vh;font-weight: 500;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}
.roboto.mosname{ font-family: Roboto; font-size: 7vh; line-height: 7vh;font-weight: 500;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}
.oleo.mosname{ font-family: "Oleo Script"; font-size: 6vh; line-height: 7vh;font-weight: 500;}

.topbar{position: absolute;top:0;background: rgba(0,0,0,0.5);width: 100%;}
.bottombar{position: absolute;bottom:0; width: 100%; }

.mday{ font-size: 6vh; line-height:9.5vh;text-transform: uppercase;letter-spacing: -0.25vh;}
.mdatem{ font-size: 5vh; line-height:7vh}
.mdateh{ font-size: 4.5vh; line-height:7vh}
.mdateharb {  font-family: 'Uthmanic';font-size: 4.75vh; line-height:7vh} /*calendar*/

.mosaddress {font-size:3.5vh; line-height: 5vh;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}
.moscontact {font-size:3.5vh; line-height: 4vh;text-shadow: 0px 0px 1vh #000,0px 0px 1vh #000,0px 0px 1vh #000,0px 0px 1vh #000;}

.clock{ font-size: 7.5vh;line-height:9.5vh;}

.display-timer, .display-holiday{height:8vh;}

.holiday-name{font-size: 4.5vh;line-height: 8vh;}
.holiday-count{font-size: 4vh;line-height: 8vh;}

.display-timer-arb{ font-family: 'Uthmanic'; font-size:6vh; line-height: 8vh;} /*nextschedule*/
.display-timer-ind{font-size: 5vh;line-height: 8vh;}
.display-timer-counter { font-size: 5vh;}



.v-card > *:first-child:not(.v-btn):not(.v-chip).sc_name{font-size:4.5vh;line-height:7vh; border-radius: 4vh 4vh 0 0; background-color:#4e36ff; border-width: 0.75vh 0.75vh 0 0.75vh;border-color:#FFFFFF;border-style:solid;}
.v-card > *:last-child:not(.v-btn):not(.v-chip).sc_time{font-size:7.5vh;line-height:8.5vh;border-width:0 0.75vh 0.75vh 0.75vh;border-color:#FFFFFF;border-style:solid;border-radius:0 0 4vh 4vh;background-color:#ebe8fd;}

.v-card > *:first-child:not(.v-btn):not(.v-chip).sc_name_arb{
  font-size:6vh;line-height:7.5vh; padding-top:0.5vh; border-radius: 4vh 4vh 0 0; background-color:#4e36ff; border-width: 0.75vh 0.75vh 0 0.75vh;border-color:#FFFFFF;border-style:solid;font-weight: bold;font-family: 'Uthmanic';}

/*.ticker-container{ height:31.5vh;}*/
.ticker{color:#fbfde5;line-height:5.5vh;font-size:5vh; max-height:31.5vh;overflow:hidden; }

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

</style>