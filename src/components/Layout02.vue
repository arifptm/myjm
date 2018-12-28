<template>
  <v-container fluid text-xs-center class="pa-0">     
  
    <v-layout row wrap>
      <v-flex xs12>        
          <v-img v-if="backgroundSlides ==''" :src="$store.state.baseUrl+'/static/images/jbbg.jpg'" ></v-img>

          <vue-flux v-else style="z-index:0;"
            :options="fluxOptions"
            :images="backgroundSlides"
            :transitions="backgroundTransition" 
            :transitionOptions="fluxTransitionOptions"
          ></vue-flux> 

      </v-flex>     
    </v-layout>  

    <v-layout row class="abs-top-left">
        <v-flex xs2 class="text-xs-center blackopc cpx-1 cpt-1">            
          <v-card :class="'cmy-1 ' + color[k]" v-for="item, k in filteredSchedule" :key="item.index">
            <div class="sc_name_arb yellow--text" v-if="settings.arabic_sc_name == 1 ">{{ item.ar_name }}</div>
            <div class="sc_name yellow--text" v-else><b>{{ item.name }} </b></div>
            <div class="sc_time white--text font-weight-medium">{{  $moment(item.time.date).format('HH:mm') }}</div>
          </v-card>
        </v-flex>        
    </v-layout>

    <v-layout row class="abs-top-right">
      <v-flex xs12>
        <v-layout row wrap>
          <v-flex offset-xs4 xs8 class="cpa-2 text-xs-right"> 
            <div :class="settings.mos_font+ ' mosname yellow--text text--lighten-4 ma-0 black-shadow2'" v-html="settings.mos_name"></div>
            <span class="mosaddress white--text pa-0 ma-0 font-weight-bold black-shadow2" v-html="settings.mos_address"></span> 
            <span class="mosphone font-weight-bold yellow--text darken-2 black-shadow2" v-if="settings.mos_contact" v-html="settings.mos_contact"></span>
          </v-flex>
        </v-layout>

        <v-layout row wrap>
          <v-flex xs3 offset-xs9 class="cpr-1 whiteopc cmy-05 white-shadow2">
              <div class="mday grey--text text--darken-3 font-weight-bold">{{ $moment().format('dddd,') }}</div>
              <div class="mdatem black--text font-weight-bold">{{ $moment().format('DD MMMM YYYY') }}<span style="font-size:3vh;color:#666;" >M</span></div>

              <div v-if="settings.arabic_hijri_calendar == 1" class="mdateh-arb black--text font-weight-bold">
                {{ $moment().add(hijriTurnOver, 'minutes').locale('ar_SA').format('dddd,') }}
                {{ $hijri().add(hijriTurnOver, 'minutes').add(settings.hijri_correction, 'days').locale('ar_SA').format('iDD  iMMM  iYYYY') }}
              </div>    

              <div v-else class="mdateh-ind  black--text font-weight-bold">
                {{ $hijri().add(hijriTurnOver, 'minutes').add(settings.hijri_correction, 'days').format('iDD iMMMM iYYYY') }}<span style="font-size:3vh;color:#666;">H</span>
              </div>    

          </v-flex>
          <v-flex xs3 offset-xs9 class="cpr-1 opc7">
            <div class="clock red--text font-weight-bold white-shadow2">{{ clock.format('HH:mm:ss') }}</div>
          </v-flex>
        </v-layout>  

      </v-flex>          
    </v-layout>              

    <div class="bottombar">
      <v-layout row wrap >
        <v-flex xs5 offset-xs2>
          <div class="greyopc display-timer font-weight-bold white-shadow1" v-if="nextSchedule && generatedTimer && settings.show_next_schedule == 1">
            <span class="display-timer-arb " v-if="settings.arabic_next_schedule == 1">{{ nextSchedule.ar_name }}</span>
            <span v-else class="display-timer-ind">{{ nextSchedule.name }}</span>
            <span class="display-timer-counter">- {{ ('000' + generatedTimer.toward.hours).slice(-2) }}:{{ ('000'+generatedTimer.toward.minutes).slice(-2) }}:{{ ('000'+generatedTimer.toward.seconds).slice(-2) }}
            </span>
          </div>
        </v-flex>        
        
        <v-flex xs5>
          <div class="greyopc display-holiday" v-if="toDate && toDate.dateh.diff($hijri().add(settings.hijri_correction, 'days'), 'days') <= settings.holiday">
            <div class="white-shadow1 font-weight-bold" v-if="toDate.dateh.diff($hijri().add(settings.hijri_correction, 'days'), 'seconds') == 0">
              <span class="holiday-count " >Hari ini: </span>
              <span class="holiday-name green--text text--darken-4" >{{ toDate.name }}</span>
            </div>
            
            <div  class="white-shadow1 font-weight-bold">
              <span class="holiday-name green--text text--darken-4" >{{ toDate.name }} </span>
              <span class="holiday-count " > {{ toDate.dateh.to($hijri().add(settings.hijri_correction, 'days'), true) }} lagi</span>  
            </div>
          </div>
        </v-flex>       

      </v-layout>   

      <v-layout class="black">
        <v-flex xs12>
          
          <v-card class="blackopc ma-0 cpy-2">              
              <v-carousel row v-if="tickers.length > 0" hide-controls hide-delimiters :interval="settings.ticker_time * 1000" height="6.4vh">
                <v-carousel-item class="ticker" v-text="ticker.text" v-for="(ticker,i) in tickers" :key="i"
                :transition="settings.ticker_transition"
                ></v-carousel-item>
              </v-carousel>   
              

                <!-- <span class="ticker" v-for="(ticker,i) in tickers" :key="i"> {{ ticker.text }} 
                  <span v-if="i < tickers.length-1">
                    <v-icon color="yellow" size="6vh">star</v-icon>
                  </span>  
                </span> -->
              

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
import { createSimpleTransition } from 'vuetify/es5/util/helpers'

  export default{
    props:['settings', 'clock', 'timerDisplay','generatedTimer','schedule','fetched_tickers', 'toAdzan', 'backgrounds', 'holidays', 'nextKhotbah', 'no_license', 'license_not_match'],   

    components: { VueFlux },
    
    data(){
      return{
        test:true,
        tr: 'slideleft',        
        backgroundAnimation: 'simple',
        color:['tealopc', 'redopc', 'orangeopc', 'greenopc', 'purpleopc',' blueopc', 'greyopc'],
        fluxOptions: { autoplay: true, delay: this.settings.carousel_time * 1000 },
        
        // allFluxTransitions: {
        //   transitionWaterfall: Transitions.transitionWaterfall,
        //   transitionFade: Transitions.transitionFade,
        //   transitionSwipe: Transitions.transitionSwipe,
        //   transitionBlocks1: Transitions.transitionBlocks1,
        //   transitionSlide: Transitions.transitionSlide,
        //   transitionKenburn: Transitions.transitionKenburn,
        //   transitionZip: Transitions.transitionZip,
        //   transitionBlinds2d: Transitions.transitionBlinds2d,
        //   transitionCamera: Transitions.transitionCamera,
        //   transitionWarp: Transitions.transitionWarp,
        //   transitionRound2: Transitions.transitionRound2,
        //   transitionBlocks2: Transitions.transitionBlocks2,
        //   transitionExplode: Transitions.transitionExplode
        // },
        slideFluxTransitions: {
          transitionSlide: Transitions.transitionSlide
        },
        fadeFluxTransitions: {
          transitionFade: Transitions.transitionFade
        },
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
    },

    computed:{

      backgroundSlides(){        
        if(this.backgrounds.length > 0 ){
          return this.backgrounds.map(item => this.$store.state.baseUrl+'/images/'+item.image)
        } else {
          return []
        }        
      },

      backgroundTransition(){
        if (this.settings.background_transition == 'allFluxTransition'){
          return  {
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
        if(this.license_not_match === true){
          return [{text: 'Lisensi alat tidak sesuai dengan nomor seri.'},{text: 'Silakan hubungi reseller/customer service'},{text: 'Terakhir Lisensi alat tidak sesuai dengan nomor seri.'}]          
        }

        if(this.no_license === true){
          return [{text: 'Tidak ditemukan kode lisensi pada mesin ini.'},{text: 'Silakan hubungi reseller/customer service'}]          
        }

        var nk = this.nextKhotbah
        var t = this.fetched_tickers

        if(nk){
          if (nk.khotib.city != ""){
            var ktext = "Khotib Jumat ("+this.$moment(nk.date).format('DD-MMM-YY')+"): "+nk.khotib.name + " dari "+nk.khotib.city+"."
          } else {
            var ktext = "Khotib Jumat ("+this.$moment(nk.date).format('DD-MMM-YY')+"): "+nk.khotib.name
          }
        }
    
        if(nk.ticker == 1)  {
          t = t.concat({text: ktext})
        }
    
        if ( this.$store.state.license == 'demo'){                
          t = t.concat({ text:'Demo jam sholat masjid menggunakan TV' })                            
        }

      return t

      // var _0xe68e=["license_not_match","Lisensi alat tidak sesuai dengan nomor seri.","Silakan hubungi reseller/customer service","no_license","Tidak ditemukan kode lisensi pada mesin ini.","nextKhotbah","fetched_tickers","city","khotib","","Khotib Jumat (","DD-MMM-YY","format","date","): ","name"," dari ",".","ticker","concat","license","$store.state","demo","Demo jam sholat masjid menggunakan TV"];if(this[_0xe68e[0]]=== true){return [{text:_0xe68e[1]},{text:_0xe68e[2]}]};if(this[_0xe68e[3]]=== true){return [{text:_0xe68e[4]},{text:_0xe68e[2]}]};var nk=this[_0xe68e[5]];var t=this[_0xe68e[6]];if(nk){if(nk[_0xe68e[8]][_0xe68e[7]]!= _0xe68e[9]){var ktext=_0xe68e[10]+ this.$moment(nk[_0xe68e[13]])[_0xe68e[12]](_0xe68e[11])+ _0xe68e[14]+ nk[_0xe68e[8]][_0xe68e[15]]+ _0xe68e[16]+ nk[_0xe68e[8]][_0xe68e[7]]+ _0xe68e[17]}else {var ktext=_0xe68e[10]+ this.$moment(nk[_0xe68e[13]])[_0xe68e[12]](_0xe68e[11])+ _0xe68e[14]+ nk[_0xe68e[8]][_0xe68e[15]]}};if(nk[_0xe68e[18]]== 1){t= t[_0xe68e[19]]({text:ktext})};if(this[_0xe68e[21]][_0xe68e[20]]== _0xe68e[22]){t= t[_0xe68e[19]]({text:_0xe68e[23]})};return t

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
              var maghrib = this.$moment(this.schedule[5].time.date).format('HH:mm')
              return  1440 - (parseInt((maghrib.split(':')[0] * 60)) + parseInt(maghrib.split(':')[1]))
            }
      }    
    }


  }
</script>

<style scoped>

.abs-top-left{ position: absolute; top:0; left:0; width:100%; height:100%; }
.abs-top-right{ position: absolute; top:0; right:0; width:100%; height:100%; }

.topbar{position: absolute;top:0;background: rgba(0,0,0,0.5);width: 100%;}
.bottombar{position: absolute;bottom:0; width: 100%; }

.sc_name{font-size:4.5vh;line-height:6vh;}
.sc_name_arb{ font-family: 'Uthmanic'; font-size: 6vh; font-weight: bold;padding-top:1vh;line-height: 5vh} /*praytime*/
.sc_time{font-size:7.5vh;line-height:7.75vh;}

.aladin.mosname{ font-family: Aladin; font-size: 8vh; line-height: 8vh;}
.eczar.mosname{ font-family: Eczar; font-size: 8vh; line-height: 9vh;font-weight: 500;}
.roboto.mosname{ font-family: Roboto; font-size: 7vh; line-height: 8vh;font-weight: 700;}
.oleo.mosname{ font-family: "Oleo Script"; font-size: 8vh; line-height: 9vh;font-weight: 500;}
.mosaddress {font-size:3.8vh; line-height: 5vh;}
.mosphone {font-size:3.8vh; line-height: 5vh;}

.mday{ font-size: 5vh; line-height:5vh;}
.mdatem{ font-size: 4.25vh; line-height:5vh;}
.mdateh-ind{ font-size: 4.25vh; line-height:5vh;text-shadow: 0px 0px 2vh #FFF;}  
.mdateh-arb {  font-family: 'Uthmanic';font-size: 4.25vh; line-height:6 vh; margin-bottom:1vh; } /*calendar*/
.clock{ font-size: 10vh;line-height:12vh;}
  
.display-timer{height:9vh;}
.display-timer-arb{ font-family: 'Uthmanic'; font-size:7vh;line-height: 9vh; } /*next pray*/
.display-timer-ind{font-size: 5.5vh;line-height: 9vh}
.display-timer-counter{font-size:6vh;line-height: 9vh}

.display-holiday{height: 9vh;}
.holiday-name{font-size: 5.5vh;line-height: 9vh;}
.holiday-count{font-size: 5vh;line-height: 9vh;}

.ticker{ white-space: nowrap; overflow: hidden; color:#fefefe;line-height:6.4vh;font-size:5.4vh; position: relative;}

.counter-adzan{font-size:22vh; text-shadow:0 0 45px #000000; }

.opc0, .opc0.v-card {background-color: transparent;}
.blackopc, .blackopc.v-card{background-color: rgba(0, 0, 0, 0.5);text-shadow: 0px 0px 25px #000;}
.whiteopc, .whiteopc.v-card{background-color: rgba(255, 255, 255, 0.6);}
.greyopc, .greyopc.v-card{background-color: rgba(155, 155, 155, 0.7);}

.purpleopc, .purpleopc.v-card{background-color: rgba(156, 39, 176, 0.5);text-shadow: 0px 0px 25px #000;}
.tealopc,  .tealopc.v-card{background-color: rgba(0, 150, 136, 0.5);text-shadow: 0px 0px 25px #000;}
.orangeopc, .orangeopc.v-card{background-color: rgba(255, 152, 0, 0.5);text-shadow: 0px 0px 25px #000;}
.redopc, .redopc.v-card{background-color: rgba(244, 67, 54, 0.5);text-shadow: 0px 0px 25px #000;}
.greenopc, .greenopc.v-card{background-color: rgba(76, 175, 80, 0.5);text-shadow: 0px 0px 25px #000;}
.blueopc, .blueopc.v-card{background-color: rgba(33, 150, 243, 0.5); text-shadow: 0px 0px 25px #000;}

.slideup-enter-active, .slideup-leave-active{transition: 0.6s;position: absolute;top: 0;right: 0;} 
.slideup-leave-to{transform: translate3d(0, -100%,0); opacity: 0;}
.slideup-enter{transform: translate3d(0, 100%,0); opacity: 0;} 

.slideleft-enter-active, .slideleft-leave-active{transition: 0.6s;position: absolute;top: 0;right: 0;}
.slideleft-leave-to{transform: translate3d(-100%,0,0);}
.slideleft-enter{transform: translate3d(100%,0,0);}

.fade-enter-active, .fade-leave-active{transition: 1s;}
.fade-leave-to{opacity: 0;}
.fade-enter{opacity: 0;}

</style>
