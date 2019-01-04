<template>
	<v-container fluid text-xs-center class="pa-0">

    <v-layout row wrap  v-if="$store.state.jumbotron === false">
      <v-flex xs12 class="black">        
          <v-img v-if="backgroundSlides ==''" :src="$store.state.baseUrl+'/static/images/jbbg.jpg'" ></v-img>
          <vue-flux style="z-index:0;" v-if="showFlux === true && backgroundSlides !=''"
            :options="fluxOptions"
            :images="backgroundSlides"
            :transitions="backgroundTransition" 
            :transitionOptions="fluxTransitionOptions"            
          ></vue-flux> 
      </v-flex>
    </v-layout>

		<v-layout row wrap class="topbar">
			<v-flex xs3 text-xs-left class="cpt-2 cpl-2 font-weight-bold black-shadow1">
				
        <div class="mday blue--text text--lighten-5 pa-0 ma-0">{{ $moment().locale($store.state.locale).format('dddd') }},</div>
				<div class="mdatem blue--text text--lighten-4">{{ $moment().locale($store.state.locale).format('DD MMMM YYYY') }}<span style="font-size:3vh;color:#eee;" >M</span>
        </div>
				<v-divider class="blue lighten-5"></v-divider>				

				<div v-if="settings.arabic_hijri_calendar == 1" class="mdateh-arb  blue--text text--lighten-3">
					{{ $moment().add(hijriTurnOver, 'minutes').locale('ar_SA').format('dddd,') }}
					{{ $hijri().add(hijriTurnOver, 'minutes').add(settings.hijri_correction, 'days').locale('ar_SA').format('iDD  iMMM  iYYYY') }}
				</div>

				<div v-else class="mdateh-ind blue--text text--lighten-3 pa-0 ma-0">
          {{ $hijri().locale($store.state.locale).add(hijriTurnOver, 'minutes').add(settings.hijri_correction, 'days').format('iDD') }}
          {{ $t($hijri().locale($store.state.locale).add(hijriTurnOver, 'minutes').add(settings.hijri_correction, 'days').format('iMMMM')) }}
          {{ $hijri().locale($store.state.locale).add(hijriTurnOver, 'minutes').add(settings.hijri_correction, 'days').format('iYYYY') }}<span style="font-size:3vh;color:#eee;">H</span>
				</div>

			</v-flex> 

			<v-flex xs6 class="cpt-1">
				<div :class="settings.mos_font+ ' mosname yellow--text text--lighten-4 ma-0 black-shadow2'" v-html="settings.mos_name"></div>
				<span class="mosaddress white--text pb-3 ma-0 font-weight-bold black-shadow2" v-html="settings.mos_address"></span>
				<span class="mosphone font-weight-bold yellow--text text--lighten-3 black-shadow2" v-if="settings.mos_contact" v-html="settings.mos_contact"></span>
			</v-flex>
			
      <v-flex xs3 text-xs-right class="cpr-2">
				<div class="clock red--text lighten-1 pa-0 ma-0 black-shadow1"><b>{{ clock.locale($store.state.locale).format('HH:mm:ss') }}</b></div>
			</v-flex>

		</v-layout>

		<div class="bottombar">
			<v-layout row wrap class="cpx-05">

				<v-flex xs5>
					<div class="whiteopc display-timer white-shadow1 font-weight-bold" v-if="nextSchedule && generatedTimer && settings.show_next_schedule == 1">
						<span v-if="settings.arabic_next_schedule == 1" class="display-timer-arb">
							{{ nextSchedule.ar_name }} - 
						</span>
						<span v-else class="display-timer-ind">{{ $t(nextSchedule.name) }} - </span>
						  <span class="display-timer-counter green--text text--darken-4">
                {{ ('000' + generatedTimer.toward.hours).slice(-2) }}:{{ ('000'+generatedTimer.toward.minutes).slice(-2) }}:{{ ('000'+generatedTimer.toward.seconds).slice(-2) }}
              </span>
						
					</div>
				</v-flex>
				
				<v-flex xs5 offset-xs2>
					<div class="whiteopc display-holiday white-shadow1 font-weight-bold" v-if="toDate && toDate.dateh.diff($hijri().add(settings.hijri_correction, 'days'), 'days') <= settings.holiday">
						<div v-if="toDate.dateh.diff($hijri().add(settings.hijri_correction, 'days'), 'seconds') < 0
            && toDate.dateh.diff($hijri().add(settings.hijri_correction, 'days'), 'seconds') > -86400">
							<span class="holiday-count green--text text--darken-4" >Hari ini:  </span>
							<span class="holiday-name" > {{ $t(toDate.name) }}</span>
						</div>
						
						<div v-else>
							<span class="holiday-name" >{{ $t(toDate.name) }} </span>
							<span class="holiday-count green--text text--darken-4" >{{ remainingHoliday }}</span>							
						</div>
					</div>
				</v-flex>			
			</v-layout>          

			<v-layout row wrap class="blackopc" v-if="nextSchedule">
				<v-flex xs2 text-xs-center class="cpx-05" v-for="item, k in filteredSchedule" :key="item.index">
					<v-card :class="'cmy-1 ' + color[k]" >
						<div class="sc_name_arb yellow--text black_shadow2 font-weight-bold" v-if="settings.arabic_sc_name == 1">{{ item.ar_name }}</div>
              <div v-else class="sc_name yellow--text black_shadow2 font-weight-bold">{{ $t(item.name) }}</div>
	            <div class="sc_time white--text font-weight-medium black_shadow2">{{  $moment(item.time.date).locale($store.state.locale).format('HH:mm') }}</div>
	        </v-card>
        </v-flex>           
			</v-layout>          
		
			<v-layout v-if="$store.state.jumbotron === false">
				<v-flex xs12>					
          <swiper v-if="showTicker === true" :options="swiperOption" ref="mySwiper" class="black ticker-container">    
            <swiper-slide v-for="(ticker,i) in tickers" :key="i" class="ticker"><div>{{ ticker.text }}</div></swiper-slide>
          </swiper>
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
        
        fluxOptions: {},
        swiperOption: {},

        color:['tealopc', 'redopc', 'orangeopc', 'greenopc', 'purpleopc',' blueopc', 'greyopc'],        
        
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
        // if(this.$store.state.license_not_match === true){
        //     return [
        //       {text: 'Lisensi alat tidak sesuai dengan nomor seri.'},
        //       {text: 'Silakan hubungi reseller/customer service'},
        //       {text: 'WhatsApp: 0812.2806.2725 / jasmadigital@gmail.com'}
        //     ]
        //   }

        //   if(this.$store.state.no_license === true){
        //     return [
        //       {text: 'Tidak ditemukan kode lisensi pada mesin ini.'},
        //       {text: 'Silakan hubungi reseller/customer service'},
        //       {text: 'WhatsApp: 0812.2806.2725 / jasmadigital@gmail.com'}
        //     ]
        //   }

        //   var nk = this.nextKhotbah
        //   var t = this.fetched_tickers

        //   if(nk){
        //     if (nk.khotib.city != ""){
        //       var ktext = "Khotib Jumat ("+this.$moment(nk.date).locale(this.$store.state.locale).format('DD-MMM-YY')+"): "+nk.khotib.name + " dari "+nk.khotib.city+"."
        //     } else {
        //       var ktext = "Khotib Jumat ("+this.$moment(nk.date).locale(this.$store.state.locale).format('DD-MMM-YY')+"): "+nk.khotib.name
        //     }
        //   }
      
        //   if(nk.ticker == 1)  {
        //     t = t.concat({text: ktext})
        //   }
      
        //   if ( this.$store.state.license == 'demo'){                
        //     t = t.concat({ text:'Demo jam sholat masjid menggunakan TV' })                            
        //   }

        // return t
      
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
        this.fluxOptions = { autoplay: true, delay: this.settings.carousel_time * 1000}
        
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

.topbar{position: absolute;top:0;background: rgba(0,0,0,0.5);width: 100%;}
.bottombar{position: absolute;bottom:0; width: 100%; }

.mday{ font-size: 5vh; line-height:5vh;}
.mdatem{ font-size: 4.25vh; line-height:5vh;}
.mdateh-ind{ font-size: 4vh; line-height:5vh;}	
.mdateh-arb {  font-family: 'Uthmanic';font-size: 4vh; line-height:5vh;margin-top: 1vh;} /*top date*/

.aladin.mosname{ font-family: Aladin; font-size: 8vh; line-height: 8vh;}
.eczar.mosname{ font-family: 'Eczar'; font-size: 6.5vh; line-height: 8vh;font-weight: 500;}
.roboto.mosname{ font-family: Roboto; font-size: 6.75vh; line-height: 8vh;font-weight: 700;}
.oleo.mosname{ font-family: "Oleo Script"; font-size: 7vh; line-height: 8vh;font-weight: 500;}
.mosaddress {font-size:3.5vh; line-height: 4.75vh;}
.mosphone {font-size:3.5vh; line-height: 4.75vh;}


	.clock{ font-size: 10vh;line-height:19.5vh;}
	
	.display-timer{height:8vh;}
	.display-timer-arb{ font-family: 'Uthmanic'; font-size:7vh; line-height: 7vh;} /*nextschedule*/
	.display-timer-ind{font-size: 5.5vh;line-height: 8vh;}
	.display-timer-counter{font-size: 6vh;line-height: 8vh;}

	.display-holiday{height:8vh;}
	.holiday-name{font-size: 5.5vh;}
	.holiday-count{font-size: 5vh;}
	
	.sc_name{font-size:5vh;line-height:6vh;}
	.sc_name_arb{ font-family: 'Uthmanic'; font-size: 6.5vh;line-height:6vh;padding-top:0.5vh;} /*sholat-name*/
	.sc_time{font-size:9vh;line-height:9vh;}
	
	.ticker-container {height: 8vh;}
	.ticker{ white-space: nowrap; overflow: hidden; color:#fefefe;font-size:5.4vh;line-height:8vh;}

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