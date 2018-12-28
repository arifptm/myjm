<<template>
	<v-container fluid text-xs-center class="pa-0">   		
		
		<v-layout row wrap>
			<v-flex xs12>
				<v-carousel  v-if="backgrounds.length > 0" hide-controls hide-delimiters class="black" :interval="settings.carousel_time * 1000" style="height:100vh;">
      				<v-carousel-item v-for="(background,i) in backgrounds" :key="i" :src="$root.baseUrl+'/images/'+background.image" transition="slideleft">        
      				</v-carousel-item>
    			</v-carousel>
			</v-flex>		  
		</v-layout>

<!-- 		<v-layout row wrap class="topbar">
			<v-flex xs3 text-xs-left class="cpt-2 cpl-2 font-weight-bold">            
				<div class="mday blue--text text--lighten-5 pa-0 ma-0">{{ $moment().format('dddd') }},</div>
				<div class="mdatem blue--text text--lighten-4 pa-0 ma-0">{{ $moment().format('DD MMMM YYYY') }}</div>
				<v-divider class="blue lighten-5"></v-divider>
				<div class="mdateh blue--text text--lighten-3 pa-0 ma-0">{{ $hijri().add(settings.hijri_correction, 'days').format('iDD iMMMM iYYYY') }}</div>
			</v-flex>
			<v-flex xs6 class="cpt-1">
				<p class="mosname yellow--text text--lighten-4 ma-0" v-html="settings.mos_name"></p>
				<span class="mosaddress white--text pb-3 ma-0 font-weight-bold" v-html="settings.mos_address"></span>
				<span class="mosaddress font-weight-bold yellow--text text--lighten-3" v-if="settings.mos_contact" v-html="settings.mos_contact"></span>
			</v-flex>
			<v-flex xs3 text-xs-right class="cpr-2">
				<div class="clock red--text pa-0 ma-0"><b>{{ clock.format('HH:mm:ss') }}</b></div>
			</v-flex>
		</v-layout>

		<div class="bottombar">
			<v-layout row wrap v-if="timerDisplay === true" class="cpx-05 cpy-05">
				<v-flex xs4>
					<v-card class="greyopc" flat>
						<v-card-text v-if="nextSchedule != ''" >
							<div class="display-timer"><b>{{ nextSchedule.name }} - {{ ('000' + generatedTimer.toward.hours).slice(-2) }}:{{ ('000'+generatedTimer.toward.minutes).slice(-2) }}:{{ ('000'+generatedTimer.toward.seconds).slice(-2) }}</b></div>
						</v-card-text>
					</v-card>            
				</v-flex>
				
				<v-flex xs4 offset-xs4>
					<v-card class="whiteopc" flat>
						<v-card-text class="px-0">
							<div class="display-holiday"><span class="black--text display-timer">{{ toDate.name }}</span> <span class="font-weight-bold red--text text--darken-4">{{ toDate.dateh.fromNow(true) }} lagi</span></div>
						</v-card-text>
					</v-card>            
				</v-flex>				
			</v-layout>          

			<v-layout row wrap class="blackopc">
				<v-flex xs2 text-xs-center class="cpx-05">
					<v-card class="purpleopc" v-if="schedule[1]">
						<div class="sc_name yellow--text"><b>Imsyak</b></div>
						<div class="sc_time white--text bold">{{ $moment(schedule[1].time.date).subtract(10,'minutes').format('hh:mm') }}</div>
					</v-card>
				</v-flex>

				<v-flex xs2 text-xs-center class="cpx-05">
					<v-card class="tealopc" v-if="schedule[1]">
						<div class="sc_name yellow--text"><b>Shubuh</b></div>
						<div class="sc_time white--text bold">{{ $moment(schedule[1].time.date).format('HH:mm') }}</div>
					</v-card>
				</v-flex>

				<v-flex xs2 text-xs-center class="cpx-05">
					<v-card class="orangeopc" v-if="schedule[2]">
						<div class="sc_name yellow--text"><b>Dzuhur</b></div>
						<div class="sc_time white--text bold">{{ $moment(schedule[2].time.date).format('HH:mm') }}</div>
					</v-card>
				</v-flex>

				<v-flex xs2 text-xs-center class="cpx-05">
					<v-card class="greenopc" v-if="schedule[3]">
						<div class="sc_name yellow--text"><b>Ashar</b></div>
						<div class="sc_time white--text bold">{{ $moment(schedule[3].time.date).format('HH:mm') }}</div>
					</v-card>
				</v-flex>

				<v-flex xs2 text-xs-center class="cpx-05">
					<v-card class="redopc" v-if="schedule[4]">
						<div class="sc_name yellow--text"><b>Maghrib</b></div>
						<div class="sc_time white--text bold">{{ $moment(schedule[4].time.date).format('HH:mm') }}</div>
					</v-card>
				</v-flex>

				<v-flex xs2 text-xs-center class="cpx-05">
					<v-card class="blueopc" v-if="schedule[5]">
						<div class="sc_name yellow--text sol"><b>Isya</b></div>
						<div class="sc_time white--text bold">{{ $moment(schedule[5].time.date).format('HH:mm') }}</div>
					</v-card>
				</v-flex>              
			</v-layout>          
		
			<v-layout class="black" >
				<v-flex xs12>
					<v-card class="blackopc ma-0 cpy-2">
						
							<v-carousel row v-if='tickers.length > 0' hide-controls hide-delimiters :interval="settings.ticker_time * 1000" class="ticker-container">
								<v-carousel-item
								class="ticker"
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
			<div class="absolute" style="background-color: rgba(0, 0, 0, 0.65)">
				<v-container fill-height class="pa-0">
					<v-flex xs12 class="text-xs-center">
						<v-progress-circular :rotate="360" :size="progressSize" :width="progressWidth" :value="100-(generatedTimer.toward.seconds * 1.666666667)" color="orange" >
			              	<div class="counter-adzan font-weight-bold white--text">{{ generatedTimer.toward.seconds }}</div>
			            </v-progress-circular>  
					</v-flex>
				</v-container>            
			</div>       
		</v-dialog> -->

	</v-container>
</template>

<script >
	export default{
		props:['settings', 'clock', 'timerDisplay','prevSchedule','nextSchedule','generatedTimer','schedule','tickers', 'toAdzan', 'backgrounds', 'holidays'],	
		
		data(){
			return{
				test:true,
				toDate: {}
			}
		},

		created(){
			this.setToDate()
		},

		computed:{
			progressSize(){
				return window.innerHeight * 0.7
			},
			progressWidth(){
				return window.innerHeight * 0.16
			}
		},

		methods:{
			setToDate(){
				let td = this.holidays.filter(c => {
						return c.dateh.isAfter(this.$moment())
						}).sort((a,b) => { 
						a.dateh.diff(b.dateh)
						})
				this.toDate.name = td[0].name
				this.toDate.dateh = td[0].dateh.subtract(this.settings.hijri_correction, 'days')
			}
		}
	}
</script>

<style scoped>
	.topbar{position: absolute;top:0;background: rgba(0,0,0,0.5);width: 100%;}
	.bottombar{position: absolute;bottom:0; width: 100%; }

	.mday{ font-size: 5vh; line-height:5vh;}
	.mdatem{ font-size: 4.25vh; line-height:5vh;}
	.mdateh{ font-size: 4.25vh; line-height:5vh;}
	
	.mosname{ font-family: Aladin; font-size: 7vh; line-height: 8vh;}
	.mosaddress {font-size:3.5vh; line-height: 4.2vh;}
	
	.clock{ font-size: 10vh;line-height:19.5vh}
	
	.display-timer{font-size:6vh;line-height:4vh;height: 4vh;}
	.display-holiday{font-size:5vh;line-height:4vh;height: 4vh;}
	
	.sc_name{font-size:5vh;line-height:6vh;}
	.sc_time{font-size:9vh;line-height:9vh;}
	
	.ticker-container{line-height:6.4vh;font-size:5.4vh;height:6.4vh;}	
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

</style>