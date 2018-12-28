<template>
	<v-container fluid text-xs-center class="pa-0">   		
		
		<v-layout row wrap>
			<v-flex xs12>
				<v-carousel  v-if="backgrounds" hide-controls hide-delimiters class="black" :interval="settings.carousel_time * 1000" height="100vh">
      				<v-carousel-item v-for="(background,i) in backgrounds.aktif" :key="i" :src="$store.state.baseUrl+'/images/'+background.image" transition="slideleft-transition">        
      				</v-carousel-item>
    			</v-carousel>
			</v-flex>		  
		</v-layout>

		<v-layout row wrap class="topbar">
			<v-flex xs3 text-xs-left class="cpt-2 cpl-2 font-weight-bold black-shadow1">
				<div class="mday blue--text text--lighten-5 pa-0 ma-0">{{ $moment().format('dddd') }},</div>
				<div class="mdatem blue--text text--lighten-4">{{ $moment().format('DD MMMM YYYY') }}<span style="font-size:3vh;color:#eee;" >M</span></div>
				<v-divider class="blue lighten-5"></v-divider>
				
				<div v-if="settings.arabic_hijri_calendar == 1" class="mdateh-arb  blue--text text--lighten-3">
					{{ $moment().add(hijriTurnOver, 'minutes').locale('ar_SA').format('dddd,') }}
					{{ $hijri().add(hijriTurnOver, 'minutes').add(settings.hijri_correction, 'days').locale('ar_SA').format('iDD  iMMM  iYYYY') }}
				</div>
				<div v-else class="mdateh-ind blue--text text--lighten-3 pa-0 ma-0">
					{{ $hijri().add(hijriTurnOver, 'minutes').add(settings.hijri_correction, 'days').format('iDD iMMMM iYYYY') }}<span style="font-size:3vh;color:#eee;">H</span>
				</div>

			</v-flex> 
			<v-flex xs6 class="cpt-1">
				<div :class="settings.mos_font+ ' mosname yellow--text text--lighten-4 ma-0 black-shadow2'" v-html="settings.mos_name"></div>
				<span class="mosaddress white--text pb-3 ma-0 font-weight-bold black-shadow2" v-html="settings.mos_address"></span>
				<span class="mosphone font-weight-bold yellow--text text--lighten-3 black-shadow2" v-if="settings.mos_contact" v-html="settings.mos_contact"></span>
			</v-flex>
			<v-flex xs3 text-xs-right class="cpr-2">
				<div class="clock red--text pa-0 ma-0 black-shadow1"><b>{{ clock.format('HH:mm:ss') }}</b></div>
			</v-flex>
		</v-layout>

		<div class="bottombar">
			<v-layout row wrap class="cpx-05">

				<v-flex xs5>
					<div class="greyopc display-timer white-shadow1 font-weight-bold" v-if="nextSchedule && generatedTimer && settings.show_next_schedule == 1">
						<span class="display-timer-arb" v-if="settings.arabic_next_schedule == 1">
							{{ nextSchedule.ar_name }}
						</span>
						<span v-else class="display-timer-ind">{{ nextSchedule.name }}</span>
						<span class="display-timer-counter">
							- {{ ('000' + generatedTimer.toward.hours).slice(-2) }}:{{ ('000'+generatedTimer.toward.minutes).slice(-2) }}:{{ ('000'+generatedTimer.toward.seconds).slice(-2) }}
						</span>						
					</div>
				</v-flex>
				
				<v-flex xs5 offset-xs2>
					<div class="greyopc display-holiday white-shadow1 font-weight-bold" v-if="toDate && toDate.dateh.diff($hijri().add(settings.hijri_correction, 'days'), 'days') <= settings.holiday">
						<div v-if="toDate.dateh.diff($hijri().add(settings.hijri_correction, 'days'), 'seconds') == 0">
							<span class="holiday-count " >Hari ini: </span>
							<span class="holiday-name green--text text--darken-4" >{{ toDate.name }}</span>
						</div>
						
						<div v-else>
							<span class="holiday-name green--text text--darken-4" >{{ toDate.name }} </span>
							<span class="holiday-count" > {{ toDate.dateh.to($hijri().add(settings.hijri_correction, 'days'), true) }} lagi</span>							
						</div>
					</div>
				</v-flex>			

			</v-layout>          

			<v-layout row wrap class="blackopc" v-if="nextSchedule">
				<v-flex xs2 text-xs-center class="cpx-05" v-for="item, k in filteredSchedule" :key="item.index">
					<v-card :class="'cmy-1 ' + color[k]" >
						<div class="sc_name_arb yellow--text black_shadow2 font-weight-bold" v-if="settings.arabic_sc_name == 1">{{ item.ar_name }}</div>
	            		<div v-else class="sc_name yellow--text black_shadow2 font-weight-bold">{{ item.name }}</div>
	            		<div class="sc_time white--text font-weight-medium black_shadow2">{{  $moment(item.time.date).format('HH:mm') }}</div>
	          		</v-card>
	          	</v-flex>           
			</v-layout>          
		
			<v-layout class="black">
				<v-flex xs12>
					<v-card class="blackopc ma-0 cpy-1">						
							<v-carousel row v-if="tickers.length > 0" hide-controls hide-delimiters :interval="settings.ticker_time * 1000" height="6.4vh">
								<v-carousel-item
								class="ticker"
								v-for="(ticker,i) in tickers"
								:key="i"
								
								v-text="ticker.text"
								></v-carousel-item>
							</v-carousel>
						
					</v-card>
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
	export default{
		props:['settings', 'clock', 'timerDisplay','generatedTimer','schedule','fetched_tickers', 'toAdzan', 'backgrounds', 'holidays', 'nextKhotbah', 'no_license', 'license_not_match'],	
		
		data(){
			return{
				test:true,
				//toDate: {},
				color:['tealopc', 'redopc', 'orangeopc', 'greenopc', 'purpleopc',' blueopc', 'greyopc'],
			}
		},

		computed:{
			prevSchedule(){
    		let p = this.schedule.filter(item=> this.$moment(item.time.date).isBefore() && item.name != 'Syuruq' && item.name != 'Imsak')
    		return p[p.length-1]
  		},

  		nextSchedule(){
    		let n = this.schedule.filter(item=>this.$moment(item.time.date).isAfter() && item.name != 'Syuruq' && item.name != 'Imsak')
      		return n[0]
  		},


  		tickers(){
      //   if(this.license_not_match === true){
      //     return [{text: 'Lisensi alat tidak sesuai dengan nomor seri.'},{text: 'Silakan hubungi reseller/customer service'}]          
      //   }

      //   if(this.no_license === true){
      //     return [{text: 'Tidak ditemukan kode lisensi pada mesin ini.'},{text: 'Silakan hubungi reseller/customer service'}]          
      //   }

      //   var nk = this.nextKhotbah
      //   var t = this.fetched_tickers

      //   if(nk){
      //     if (nk.khotib.city != ""){
      //       var ktext = "Khotib Jumat ("+this.$moment(nk.date).format('DD-MMM-YY')+"): "+nk.khotib.name + " dari "+nk.khotib.city+"."
      //     } else {
      //       var ktext = "Khotib Jumat ("+this.$moment(nk.date).format('DD-MMM-YY')+"): "+nk.khotib.name
      //     }
      //   }
    
      //   if(nk.ticker == 1)  {
      //     t = t.concat({text: ktext})
      //   }
    
      //   if ( this.$root.license == 'demo'){	              
      //     t = t.concat({ text:'Demo jam sholat masjid menggunakan TV' })                            
      //   }

    	// return t

    	var _0xe68e=["license_not_match","Lisensi alat tidak sesuai dengan nomor seri.","Silakan hubungi reseller/customer service","no_license","Tidak ditemukan kode lisensi pada mesin ini.","nextKhotbah","fetched_tickers","city","khotib","","Khotib Jumat (","DD-MMM-YY","format","date","): ","name"," dari ",".","ticker","concat","license","$root","demo","Demo jam sholat masjid menggunakan TV"];if(this[_0xe68e[0]]=== true){return [{text:_0xe68e[1]},{text:_0xe68e[2]}]};if(this[_0xe68e[3]]=== true){return [{text:_0xe68e[4]},{text:_0xe68e[2]}]};var nk=this[_0xe68e[5]];var t=this[_0xe68e[6]];if(nk){if(nk[_0xe68e[8]][_0xe68e[7]]!= _0xe68e[9]){var ktext=_0xe68e[10]+ this.$moment(nk[_0xe68e[13]])[_0xe68e[12]](_0xe68e[11])+ _0xe68e[14]+ nk[_0xe68e[8]][_0xe68e[15]]+ _0xe68e[16]+ nk[_0xe68e[8]][_0xe68e[7]]+ _0xe68e[17]}else {var ktext=_0xe68e[10]+ this.$moment(nk[_0xe68e[13]])[_0xe68e[12]](_0xe68e[11])+ _0xe68e[14]+ nk[_0xe68e[8]][_0xe68e[15]]}};if(nk[_0xe68e[18]]== 1){t= t[_0xe68e[19]]({text:ktext})};if(this[_0xe68e[21]][_0xe68e[20]]== _0xe68e[22]){t= t[_0xe68e[19]]({text:_0xe68e[23]})};return t

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
		},

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
.eczar.mosname{ font-family: 'Eczar'; font-size: 7.5vh; line-height: 8vh;font-weight: 500;}
.roboto.mosname{ font-family: Roboto; font-size: 7vh; line-height: 8vh;font-weight: 700;}
.oleo.mosname{ font-family: "Oleo Script"; font-size: 7vh; line-height: 8vh;font-weight: 500;}
.mosaddress {font-size:3.5vh; line-height: 4.75vh;}
.mosphone {font-size:3.5vh; line-height: 4.75vh;}


	.clock{ font-size: 10vh;line-height:19.5vh;}
	
	.display-timer{height:9vh;}
	.display-timer-arb{ font-family: 'Uthmanic'; font-size:7vh } /*nextschedule*/
	.display-timer-ind{font-size: 5.5vh;}
	.display-timer-counter{font-size: 6vh;}

	.display-holiday{height:9vh;}
	.holiday-name{font-size: 5.5vh;}
	.holiday-count{font-size: 5vh;}
	
	.sc_name{font-size:5vh;line-height:6vh;}
	.sc_name_arb{ font-family: 'Uthmanic'; font-size: 6.5vh;line-height:6vh;padding-top:0.5vh;} /*sholat-name*/
	.sc_time{font-size:9vh;line-height:9vh;}
	
	
	.ticker{ white-space: nowrap; overflow: hidden; color:#fefefe;font-size:5.4vh;line-height:6.4vh;}

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

.fader-enter-active, .fader-leave-active, .fader-leave-to{transition: 1s ease-out;position: absolute;top: 0;left: 0;}
.fader-enter, .fader-leave, .fader-leave-to{opacity: 0;}

.slideleft-transition-enter-active, .slideleft-transition-leave-active, .slideleft-transition-leave-to{transition: 0.5s;position: absolute;top: 0;left: 0;}
.slideleft-transition-leave-to {transform: translate3d(-100%, 0, 0)}
.slideleft-transition-enter, .slideleft-transition-leave{transform: translate3d(100%, 0, 0); }

.slideup-enter-active, .slideup-leave-active{transition: 0.5s;position: absolute;top: 0;left: 0;} 
.slideup-leave-to{transform: translate3d(0, -100%,0); opacity: 0;}
.slideup-enter{transform: translate3d(0, 100%,0); opacity: 0;} 

</style>