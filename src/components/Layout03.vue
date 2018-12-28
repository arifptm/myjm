<template>	
	<v-container fluid text-xs-center class="pa-0">
		<v-layout row wrap class="topbar px-0" style="background:url('./static/images/topbg.jpg') top center no-repeat; width:100%;background-size:100%;height:18vh;">
			
			<v-flex xs10 offset-xs1 class="cpt-2">
				<div :class="settings.mos_font+ ' mosname yellow--text text--lighten-4 ma-0'" v-html="settings.mos_name"></div>
				<span class="mosaddress white--text cpb-3 ma-0 font-weight-bold" v-html="settings.mos_address"></span>
				<span class="mosaddress font-weight-bold yellow--text text--lighten-3" v-if="settings.mos_contact" v-html="settings.mos_contact"></span>
			</v-flex>

		</v-layout>
		
		<v-layout row wrap class="pa-0 ma-0" style="width:100%;position: absolute;top:18vh;height: 65vh">

				<v-flex xs8 class="cpy-1 pl-0 cpr-1">
					<v-carousel  v-if="backgrounds.length > 0" hide-controls hide-delimiters :interval="settings.carousel_time * 1000" style="height:100%;">
	      				<v-carousel-item v-for="(background,i) in backgrounds" :key="i" :src="$store.state.baseUrl+'/images/'+background.image" transition="fader">        
	      				</v-carousel-item>
	    			</v-carousel>
				</v-flex>

				<v-flex xs4 class="cpy-1 cpx-0">
					<v-card color="orange darken-2" flat height="100%">
						<v-layout row wrap class="pa-0 ma-0">
							
							<v-flex xs5 class="cpy-1 cpx-1">
								<v-card height= "9.5vh">
									<div class="mday">{{ $moment().format('dddd') }}</div>	  
								</v-card>
							</v-flex>

							<v-flex xs7 class="cpy-1 cpr-1">
								<v-card height= "9.5vh">
									<div class="clock red--text"><b>{{ clock.format('HH:mm:ss') }}</b></div>	  
								</v-card>
							</v-flex>

							<v-flex xs12 class="cpx-1 cpb-1">
								<v-card height= "14vh">
									<div class="mdatem blue--text font-weight-bold text--darken-3">{{ $moment().format('DD MMMM YYYY') }}<span style="font-size:3vh;color:#aaf;" >M</span></div>
									<v-divider class="blue lighten-5 "></v-divider>
									<div v-if="settings.arabic_hijri_calendar == 1" class="mdateharb  blue--text text--darken-3 font-weight-bold">
									{{ $hijri().locale('ar-SA').format('dddd,') }}
									{{ $hijri().locale('ar-SA').add(settings.hijri_correction, 'days').format('iDD  iMMM  iYYYY') }}
									</div>

									<div v-else class="mdateh blue--text text--darken-3 font-weight-bold">{{ $hijri().add(settings.hijri_correction, 'days').format('iDD iMMMM iYYYY') }}<span style="font-size:3vh;color:#aaf;" >H</span></div>
								</v-card>
							</v-flex>

							<v-flex xs12 class="cpx-1">
								<v-card color="black" height="35.5vh" class="cpa-1">
									<v-carousel v-if="tickers.length > 0" hide-controls hide-delimiters :interval="settings.ticker_time * 1000" class="ticker-container">
										<v-carousel-item
										v-for="(ticker,i) in tickers"
										:key="i"
										transition="slideup"										
										v-text="ticker.text"
										></v-carousel-item>
									</v-carousel>
								</v-card>
							</v-flex>
						</v-layout>

					</v-card>
				</v-flex>

			</v-layout>
		


		<div class="bottombar">
			<v-layout row wrap v-if="timerDisplay === true ">
				
				<v-flex xs4 class="cpb-1" v-if="toDate">
					<v-card class="whiteopc" flat v-if="settings.holiday != 0 && toDate.dateh.diff($hijri(), 'days') < settings.holiday">
						<v-card-text class="px-0">
							<div class="display-holiday"><span class="black--text display-timer">{{ toDate.name }}</span> <span class="font-weight-bold red--text text--darken-4">{{ toDate.dateh.fromNow(true) }} lagi</span></div>
						</v-card-text>
					</v-card>            
				</v-flex>

				<v-flex xs4 class="cpb-1 cpr-1">
					<v-card class="greyopc " flat v-if="generatedTimer && nextSchedule && settings.show_next_schedule == 1">
						<v-card-text>
							<div class="display-timer">
								<span class="display-timer-arb" v-if="settings.arabic_next_schedule == 1">{{ nextSchedule.ar_name }}</span>
								<span v-else>{{ nextSchedule.name }}</span>
							 - {{ ('000' + generatedTimer.toward.hours).slice(-2) }}:{{ ('000'+generatedTimer.toward.minutes).slice(-2) }}:{{ ('000'+generatedTimer.toward.seconds).slice(-2) }}</b></div>
						</v-card-text>
					</v-card>            
				</v-flex>
			</v-layout>          

			<v-layout row wrap class="orange darken-2 cpy-1">
				<v-flex xs2 text-xs-center v-for="item, k in filteredSchedule" :key="item.index">
					<v-card flat class="opc0 cpx-1">
						<div class="sc_name_arb yellow--text" v-if="settings.arabic_sc_name == 1">{{ item.ar_name }}
						</div>
						<div v-else class="sc_name yellow--text text--lighten-3" ><b>{{ item.name }}</b></div>	

						<div class="sc_time blue--text text--darken-4 font-weight-bold">{{ $moment(item.time.date).format('HH:mm') }}</div>
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
	export default{
	props:['settings', 'clock', 'timerDisplay','generatedTimer','schedule','fetched_tickers', 'toAdzan', 'backgrounds', 'holidays', 'nextKhotbah', 'no_license', 'license_not_match'],   
    
    data(){
      return{
        test:true,
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
	              return [{text: 'Lisensi alat tidak sesuai dengan nomor seri'},{text: 'Silakan hubungi reseller/customer service'}]      
	            } else {
	              var nk = this.nextKhotbah
	              var t = this.fetched_tickers              

	              if(nk.ticker == 1 && this.$root.license == 'pro') {
	              	return this.fetched_tickers.concat({text: 'Khotib Jumat ('+this.$moment(nk.date).format('DD/MMM/YY')+'): '+nk.khotib.name+' dari '+nk.khotib.city+'.'})
	              	} else { return t }
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

.aladin.mosname{ font-family: Aladin; font-size: 7vh; line-height: 8vh;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}
.eczar.mosname{ font-family: Eczar; font-size: 7vh; line-height: 8vh;font-weight: 500;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}
.roboto.mosname{ font-family: Roboto; font-size: 7vh; line-height: 8vh;font-weight: 500;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}

.topbar{position: absolute;top:0;background: rgba(0,0,0,0.5);width: 100%;}
.bottombar{position: absolute;bottom:0; width: 100%; }

.mday{ font-size: 6vh; line-height:9.5vh;text-transform: uppercase;letter-spacing: -0.25vh;}
.mdatem{ font-size: 5vh; line-height:7vh}
.mdateh{ font-size: 4.5vh; line-height:7vh}

.mosaddress {font-size:3.5vh; line-height: 4vh;text-shadow: 0px 0px 2vh #000,0px 0px 1vh #000;}

.clock{ font-size: 7.5vh;line-height:9.5vh;}

.display-timer{font-size:5.5vh;line-height:4vh;height: 4vh; font-weight: bold;}
.display-holiday{font-size:4.5vh;line-height:4vh;height: 4vh;}

.v-card > *:first-child:not(.v-btn):not(.v-chip).sc_name{font-size:4.5vh;line-height:7vh; border-radius: 4vh 4vh 0 0; background-color:#4e36ff; border-width: 0.75vh 0.75vh 0 0.75vh;border-color:#FFFFFF;border-style:solid;}
.v-card > *:last-child:not(.v-btn):not(.v-chip).sc_time{font-size:7.5vh;line-height:8.5vh;border-width:0 0.75vh 0.75vh 0.75vh;border-color:#FFFFFF;border-style:solid;border-radius:0 0 4vh 4vh;background-color:#ebe8fd;}

.ticker-container{line-height:6.5vh;font-size:6vh; color:#fbfde5;height:33.5vh}
.ticker{color:#fefefe;}

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

.v-card > *:first-child:not(.v-btn):not(.v-chip).sc_name_arb{font-size:4.5vh;line-height:7.5vh; padding-top:0.5vh; border-radius: 4vh 4vh 0 0; background-color:#4e36ff; border-width: 0.75vh 0.75vh 0 0.75vh;border-color:#FFFFFF;border-style:solid;font-weight: bold;font-family: 'Arabic';font-size: 9.5vh;}
.mdateharb {  font-family: 'Arabic';font-size: 7vh; line-height:7vh} /*calendar*/
.display-timer-arb{ font-family: 'Arabic'; font-size:9.5vh }  /*next pray*/

</style>