<template>
	<v-container fluid text-xs-center class="pa-0">
		<div class="green lighten-2" style="height:100vh;">
		<v-layout row wrap>
			<v-flex xs12>
				<v-carousel  v-if="backgrounds.length > 0" hide-controls hide-delimiters class="black" :interval="settings.carousel_time * 1000" style="height:82vh;margin-top: 18vh">
      				<v-carousel-item v-for="(background,i) in backgrounds" :key="i" :src="$store.state.baseUrl+'/images/'+background.image" transition="slideleft" gradient="to top right, rgba(67,160,71,.33), rgba(67,160,71,0)">
      				</v-carousel-item>
    			</v-carousel>
			</v-flex>		  
		</v-layout>

		<v-layout row wrap class="topbar">
			<v-flex xs6 class="cpt-1 text-xs-left cpx-2">
				<div :class="settings.mos_font+ ' mosname white--text cpt-1'" v-html="settings.mos_name"></div>
				<div class="cmb-1">
					<span class="mosaddress white--text ma-0 font-weight-bold" v-html="settings.mos_address"></span>
					<span class="mosaddress font-weight-bold green--text text--lighten-4" v-if="settings.mos_contact" v-html="settings.mos_contact"></span>
				</div>
			</v-flex>
			<v-flex xs6>			 
				<v-layout row wrap>			
					<v-flex xs6 text-xs-right class="cpt-2" v-if="toDate">						
						<div class="display-holiday" v-if="settings.holiday != 0 && toDate.dateh.diff($hijri(), 'days') < settings.holiday">
							<div class="green--text text--lighten-4 font-weight-bold holiday-name" >
								<span style="border-bottom: 2px solid #fff;">
									{{ toDate.name }}
									<span class="white--text holiday-count" >{{ toDate.dateh.fromNow(true) }} lagi</span>
								</span>
							</div>
						</div>  						
					</v-flex>				

					<v-flex xs6 text-xs-right class="cpr-2">
						<div class="clock green--text text--lighten-4 cpt-1"><b>{{ clock.format('HH:mm:ss') }}</b></div>
					</v-flex>	

					<v-flex xs12 class="text-xs-right cpr-2">
					 	<div class="mdatem white--text pa-0 ma-0 font-weight-bold">
					 		{{ $moment().format('dddd') }}, {{ $moment().format('DD MMM YYYY') }}<span style="font-size:3vh;color:#ccc;" >M</span> / 
							<span v-if="settings.arabic_hijri_calendar == 1" class="mdateharb">
								{{ $hijri().locale('ar-SA').add(settings.hijri_correction, 'days').format('iDD  iMMM  iYYYY') }}
							</span>							
							<span v-else class="mdateh blue--text text--lighten-5 pa-0 ma-0">{{ $hijri().add(settings.hijri_correction, 'days').format('iDD iMMMM iYYYY') }}<span style="font-size:3vh;color:#ccc;" >H</span>
							</span>
					</div>
					</v-flex>
				</v-layout>
			</v-flex>

			<v-layout row wrap class="blackopc" v-if="nextSchedule">
				<v-flex text-xs-center class="cpx-05" v-for="item, k in filteredSchedule" :key="item.index">
					<v-card class="cmy-1 teal" style="transform: skewX(-15deg);">
						<div class="sc_name white--text" v-if="settings.arabic_sc_name === 1"><div class="arb">{{ item.ar_name }}</div></div>
	            		<div v-else class="sc_name white--text font-weight-bold">{{ item.name }}</div>
	            		<div class="sc_time yellow--text text--lighten-2 font-weight-bold">{{  $moment(item.time.date).format('HH:mm') }}</div>
	          		</v-card>
	          	</v-flex>           			
	          	<v-flex xs2 text-xs-center class="cpx-05" v-if="nextSchedule && generatedTimer && settings.show_next_schedule == 1 && timerDisplay === true">
					<v-card class="cmy-1 grey darken-3" style="transform: skewX(-15deg);">
						<div class="sc_name green--text text--lighten-3" v-if="settings.arabic_next_schedule == 1 ">
							<div class="arb">{{ nextSchedule.ar_name }}</div></div>
	            		<div v-else class="sc_name grey--text lighten-2 font-weight-black">{{ nextSchedule.name }}</div>
	            		<div class="sc_time white--text font-weight-bold">{{ ('000' + generatedTimer.toward.hours).slice(-2) }}:{{ ('000'+generatedTimer.toward.minutes).slice(-2) }}<span style="font-size:4vh;line-height: 2vh">:{{ ('000'+generatedTimer.toward.seconds).slice(-2) }}</span></div>
	          		</v-card>
	          	</v-flex>           			
			</v-layout>  
		</v-layout>
  		

		<div class="bottombar">             
			<v-layout class="green darken-3">
				<v-flex xs12>
					<v-card class="blackopc" flat>
							<v-carousel row v-if="tickers.length > 0" hide-controls hide-delimiters :interval="settings.ticker_time * 1000" class="ticker-container">
								<v-carousel-item
								class="ticker green--text text--lighten-4"
								v-for="(ticker,i) in tickers"
								:key="i"
								transition="slideup"
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
	</div>
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
      			if (this.$root.demo === false ){
	      			if(this.no_license === true){
	      				return [{text: 'Tidak ditemukan kode lisensi pada mesin ini.'},{text: 'Silakan hubungi reseller/customer service'}]
	      			} else if(this.license_not_match === true){
	      				return [{text: 'Lisensi alat tidak sesuai dengan nomor seri.'},{text: 'Silakan hubungi reseller/customer service'}]      
	      			} else {
	      				var nk = this.nextKhotbah
	      				var t = this.fetched_tickers      				

	      				if(nk.ticker == 1 && this.$root.license == 'pro') {
	      					return this.fetched_tickers.concat({text: 'Khotib Jumat ('+this.$moment(nk.date).format('DD/MMM/YY')+'): '+nk.khotib.name+' dari '+nk.khotib.city+'.'})
	      				} else {
	      					return t
	      				}
	      			}
	      		} else {
	      			var nk = this.nextKhotbah
      				var t = this.fetched_tickers      				

      				if(nk.ticker == 1 && this.$root.license == 'pro') {
      					return this.fetched_tickers.concat({text: 'Khotib Jumat ('+this.$moment(nk.date).format('DD/MMM/YY')+'): '+nk.khotib.name+' dari '+nk.khotib.city+'.'})
      				} else { return t }
	      		}
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
		    	if(this.holidays !== 0 && this.settings){
			    	var td = this.holidays.map(d=>{
			    		return {name: d.name, dateh: this.$hijri(d.dateh, 'iYYYY-iMM-iDD')}
			    	})
			    	.filter(c => {
	            		return c.dateh.subtract(this.settings.hijri_correction, 'iDays').isAfter(this.$hijri())
	            	})
	            	.sort((a,b) => { 
	            		a.dateh.diff(b.dateh)
	            	})[0]
	       			return td
	             }
       			
		    }
		},

	}
</script>

<style scoped>

.aladin.mosname{ font-family: Aladin; font-size: 6vh; line-height: 7vh;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}
.eczar.mosname{ font-family: 'Eczar'; font-size: 6.5vh; line-height: 7vh;font-weight: 500;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}
.roboto.mosname{ font-family: Roboto; font-size: 6vh; line-height: 7vh;font-weight: 500;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}

	.topbar{position: absolute;top:0;background: rgba(0,0,0,0.5);width: 100%;}
	.bottombar{position: absolute;bottom:0; width: 100%; }

	.mday{ font-size: 5vh; line-height:5vh;}
	.mdatem{ font-size: 4.25vh; line-height:5vh;padding-bottom: 0.5vh;}
	.mdateh{ font-size: 4.25vh; line-height:5vh;}	

	.mosaddress {font-size:3vh; line-height: 4vh;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}
	
	.clock{ font-size: 9vh;line-height:9vh}
	
	.display-timer{font-size:6vh;line-height:4vh;height: 4vh;font-weight: bold}
	.display-holiday{font-size:4vh;line-height:7vh;height: 7vh;}
	.holiday-name{font-size: 4vh;}
	.holiday-count{font-size: 3vh;}
	
	.sc_name{font-size:5vh;line-height:6vh;}
	.sc_time{font-size:7vh;line-height:7vh;}
	
	.ticker-container{line-height:8vh;font-size:5.4vh;height:8vh;}	
	.ticker{ white-space: nowrap; overflow: hidden; color:#fefefe;}

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

.slideleft-enter-active, .slideleft-leave-active, .slideleft-leave-to{transition: 0.5s;position: absolute;top: 0;left: 0;}
.slideleft-leave-to {transform: translate3d(-100%, 0, 0)}
.slideleft-enter, .slideleft-leave{transform: translate3d(100%, 0, 0); }

.slideup-enter-active, .slideup-leave-active{transition: 0.5s;position: absolute;top: 0;left: 0;} 
.slideup-leave-to{transform: translate3d(0, -100%,0); opacity: 0;}
.slideup-enter{transform: translate3d(0, 100%,0); opacity: 0;} 

.arb{ font-family: 'Arabic'; font-size: 7.5vh; font-weight: bold;line-height:5.5vh;padding-top:1vh;} /*sholat-name*/
.display-timer-arb{ font-family: 'Arabic'; font-size:9.5vh } /*nextschedule*/
.mdateharb {  font-family: 'Arabic';font-size: 6.5vh; line-height:5vh;margin-top: 1vh;} /*top date*/

</style>