<template>
  <div style="height: 100vh">
    <div v-if="settings.layout_id == 1">
      <Layout01 
        :settings="settings" 
        :clock="clock"
        :timerDisplay="timerDisplay"        
        :generatedTimer="generatedTimer"
        :schedule="schedule"
        :fetched_tickers="fetched_tickers"
        :toAdzan="toAdzan"
        :backgrounds="backgrounds"
        :holidays="holidays"
        :nextKhotbah="nextKhotbah"
        :no_license="no_license"
        :license_not_match="license_not_match"
      ></Layout01>      
    </div>    

    <div v-if="settings.layout_id == 2">
      <Layout02 
        :settings="settings" 
        :clock="clock"
        :timerDisplay="timerDisplay"        
        :generatedTimer="generatedTimer"
        :schedule="schedule"
        :fetched_tickers="fetched_tickers"
        :toAdzan="toAdzan"
        :backgrounds="backgrounds"
        :holidays="holidays"
        :nextKhotbah="nextKhotbah"
        :no_license="no_license"
        :license_not_match="license_not_match"
      ></Layout02>      
    </div>  

    <div v-if="settings.layout_id == 3">
      <Layout03 
        :settings="settings" 
        :clock="clock"
        :timerDisplay="timerDisplay"        
        :generatedTimer="generatedTimer"
        :schedule="schedule"
        :fetched_tickers="fetched_tickers"
        :toAdzan="toAdzan"
        :backgrounds="backgrounds"
        :holidays="holidays"
        :nextKhotbah="nextKhotbah"
        :no_license="no_license"
        :license_not_match="license_not_match"
      ></Layout03>      
    </div>   

    <div v-if="settings.layout_id == 4">
      <Layout04 
        :settings="settings" 
        :clock="clock"
        :timerDisplay="timerDisplay"        
        :generatedTimer="generatedTimer"
        :schedule="schedule"
        :fetched_tickers="fetched_tickers"
        :toAdzan="toAdzan"
        :backgrounds="backgrounds"
        :holidays="holidays"
        :nextKhotbah="nextKhotbah"
        :no_license="no_license"
        :license_not_match="license_not_match"
      ></Layout04>      
    </div>   

    <div v-if="settings.layout_id == 5">
      <Layout05 
        :settings="settings" 
        :clock="clock"
        :timerDisplay="timerDisplay"        
        :generatedTimer="generatedTimer"
        :schedule="schedule"
        :fetched_tickers="fetched_tickers"
        :toAdzan="toAdzan"
        :backgrounds="backgrounds"
        :holidays="holidays"
        :nextKhotbah="nextKhotbah"
        :no_license="no_license"
        :license_not_match="license_not_match"
      ></Layout05>      
    </div>  

    <transition name="jb-fade">
      <div v-if="jumbotrons.length > 0 && jumbotron === true ">
        <v-container fluid fill-height class="absolute pa-0" v-if="$store.state.license == 'pro' || $store.state.license == 'demo' || $store.state.license == 'pcmode'">
          <v-layout row wrap align-center justify-center class="jumbotron-text-bg" :style="'background: url(\''+$store.state.baseUrl+'/static/images/jbbg.jpg\') center center no-repeat; background-size: cover;'" >
              
            <img v-if="jumbotrons[jumbotronShown].text && jumbotrons[jumbotronShown].image" style="width:100%;height:auto;" :src="$store.state.baseUrl+'/images/jumbotrons/'+jumbotrons[jumbotronShown].image" class="opc5"/>

            <img v-if="!jumbotrons[jumbotronShown].text && jumbotrons[jumbotronShown].image" style="width:100%;height:auto;" :src="$store.state.baseUrl+'/images/jumbotrons/'+jumbotrons[jumbotronShown].image"/>
            
            <v-container fluid fill-height class="absolute pa-0" >
              <v-layout row wrap align-center justify-center>

              <v-flex xs10>
                <div class="text-xs-center yellow--text font-weight-medium jumbotron-text cpb-4" v-html="jumbotrons[jumbotronShown].text ">
                </div>
              </v-flex>

              <v-flex xs12 class="abs-bottom blackopc">
                <v-layout row wrap align-center justify-center>
                  <v-flex xs6>
                    <div class="jumbotron-clock orange--text px-3"><b>{{ clock.format('HH:mm:ss') }}</b></div>          
                  </v-flex>
                  <v-flex xs6 class="text-xs-right orange--text">
                    <span class="jumbotron-next-name font-weight-bold white--text" v-if="nextSchedule">{{ nextSchedule.name }}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    <v-icon color="blue" size="6vh">alarm</v-icon>&nbsp;
                    <span class="jumbotron-next-time pr-3 " >{{ $moment(nextSchedule.time.date).format('HH:mm') }}</span>
                  </v-flex>
                </v-layout>
              </v-flex> 
            </v-layout>
            </v-container>
          </v-layout>
        </v-container>            
      </div>
    </transition>

<!-- demo container -->
    <v-container fluid fill-height style="position: absolute;top:0;left:0;" v-if="$store.state.license == 'demo'">
      <v-layout align-center justify-center>
        <v-flex xs12 class="text-xs-center">
          <div class="demo1 font-weight-bold" >Demo Jadwal Sholat Digital</div>          
          <div class="demo2 font-weight-bold white--text">{{ settings.demo_name }}</div>
        </v-flex>
      </v-layout>
    </v-container>
        
    <!-- <v-dialog fullscreen class="green lighten-4" v-model="test"> -->
    <v-dialog fullscreen class="green lighten-4" v-model="counterBg">
      <v-layout v-if="settings.toiqomah_bg">
        <v-card width="100vw">          
          <v-img height="100vh" width="100vw" :src="$store.state.baseUrl+'/static/silent_bg/' + this.settings.toiqomah_bg"></v-img>
        </v-card>  
      </v-layout>
      <v-container fluid fill-height class="pa-0 ma-0 absolute">  
        <v-layout row wrap class="align-center justify-center text-xs-center">            
            <div  v-if="toIqomah === true">  
              <div class="display-title grey--text text--darken-2" v-if="prevSchedule"><b>Menjelang Iqomah {{ prevSchedule.name }}</b></div>
              <div class="display-counter red--text font-weight-bold">                
                  {{ ('000'+generatedTimer.iqomahCounter.minutes).slice(-2)+':'+('000'+generatedTimer.iqomahCounter.seconds).slice(-2) }} 
              </div>
            </div>
            <div v-if="goSholat === true && this.strobe === true">
              <div class="display-title grey--text text--darken-2"><b>Waktu Iqomah</b></div>
              <div class="display-sc orange--text font-weight-bold" v-if="prevSchedule">{{ prevSchedule.name }}</div>
            </div>
        </v-layout>
      </v-container>
    </v-dialog>

    <v-dialog fullscreen class="green lighten-4" v-model="sholatNow" v-if="settings.show_sholat_time == 1">      
      <v-layout v-if="settings.sholat_bg">
        <v-card width="100vw" class="teal darken-3">          
          <v-img height="100vh" width="100vw" :src="$store.state.baseUrl+'/static/silent_bg/' + settings.sholat_bg"></v-img>
        </v-card>  
      </v-layout>
      
      <v-container fluid fill-height class="pa-0 ma-0 absolute" v-if="settings.show_sholat_time_text == 1">  
        <v-layout column wrap class="align-right justify-center text-xs-right cpx-4">
            <div class="sholatnow-title grey--text text--lighten-2"><b>Waktu Sholat</b></div>
            <div class="sholatnow-name orange--text text--lighten-1" v-if="prevSchedule"><b>{{ prevSchedule.name }}</b></div>
            <div class="sholatnow-clock font-weight-bold black--text" style="margin-top:8vh;"><span style="background:rgba(200,200,200,0.5);border-radius: 8vh;padding: 0 4vh;margin-top:10vh;">{{ clock.format('HH:mm:ss') }}</span>
            </div>
        </v-layout>
      </v-container>
    </v-dialog>   

    <v-dialog fullscreen class="green lighten-4" v-model="jumatNow">
      <v-layout v-if="settings.jumat_bg">
        <v-card width="100vw" class="teal darken-3">          
          <v-img height="100vh" :src="$store.state.baseUrl+'/static/silent_bg/' + settings.jumat_bg"></v-img>
        </v-card>  
      </v-layout>

      <v-container fluid fill-height class="pa-0 ma-0 absolute">  
        <v-layout column wrap class="align-right justify-center text-xs-right cpx-4">
            <div class="sholatnow-title grey--text text--lighten-2"><b>Waktu Ibadah</b></div>
            <div class="sholatnow-name orange--text text--lighten-1"><b>Jum'at</b></div>
            <div class="sholatnow-clock font-weight-bold black--text" style="margin-top:8vh;">
              <span style="background:rgba(200,200,200,0.5);border-radius: 8vh;padding: 0 4vh;margin-top:10vh;">{{ clock.format('HH:mm:ss') }}</span>
            </div>
        </v-layout>
      </v-container>
    </v-dialog>   
  </div>
</template>

<script>
  import Layout01 from './Layout01'
  import Layout02 from './Layout02'
  import Layout03 from './Layout03'
  import Layout04 from './Layout04'
  import Layout05 from './Layout05'
  import md5 from 'js-md5'
 

  export default {
    components:{ Layout01, Layout02, Layout03, Layout04, Layout05},
    //components:{ Layout01},
    data(){
      return {        
        test:true,
        dialog:true,      
        settings:{
          iqomah_bg:'',
        },
        nextKhotbah:{ khotib:{} },
        fetched_tickers:[],
        fetched_jumbotrons:[],
        backgrounds:[],
        clock:'',
        schedule:[],        
        timerDisplay:true,
        serial:'',
        strobe: true,        
        jumbotronShown: 0,
        jumbotron: false,        
        rawHolidays:[],        
        no_license: true,
        license_not_match: false,

        audioAdzan: new Audio,
        audioIqomah:new Audio,
        audioMurottal: new Audio,
        
        playList: [],
        //murottal_file_index: 0,
        playingIndex: '',        
      }
    },
 
    created(){
      this.getSettings() 
      this.getClock() 
      this.init()
    },

    computed: {
      prevSchedule(){
        let p = this.schedule.filter(item=> this.$moment(item.time.date).isBefore() && item.name != 'Syuruq' && item.name != 'Imsak')
        return p[p.length-1]
      },

      nextSchedule(){
        let n = this.schedule.filter(item=>this.$moment(item.time.date).isAfter() && item.name != 'Syuruq' && item.name != 'Imsak')
        return n[0]
      },

      holidays(){
        return this.rawHolidays.map(item=>{
          var n = item.name
          var d = (item.id == 6) ? (this.$hijri().iYear() + 1) : this.$hijri().iYear()
          return { name: n, dateh: d+'-'+item.date }
        })
      },

      counterBg(){
        if(this.prevSchedule){
          if (this.prevSchedule.slug != 'jumat'){
            return ( this.clock.isSameOrAfter(this.$moment(this.prevSchedule.time.date))  && this.clock.isSameOrBefore(this.$moment(this.prevSchedule.time.date).add((this.prevSchedule.iqomah_pause *60) + 9, 'seconds')) ) ? true : false
          } else {
            return false
          }
        }
      },

      toAdzan(){ 
        if(this.nextSchedule){
          return (this.clock.isSameOrAfter(this.$moment(this.nextSchedule.time.date).subtract(1, 'minutes')) && this.clock.isBefore(this.$moment(this.nextSchedule.time.date))) ? true : false   
        }
      },

      toIqomah(){
        if(this.prevSchedule){   
          return (this.clock.isSameOrAfter(this.$moment(this.prevSchedule.time.date)) && this.clock.isBefore(this.$moment(this.prevSchedule.time.date).add(this.prevSchedule.iqomah_pause, 'minutes')) ) ? true : false
        }
      },

      goSholat(){
        if(this.prevSchedule){
          if (this.prevSchedule.slug != 'jumat'){
            return (this.clock.isAfter(this.$moment(this.prevSchedule.time.date).add(this.prevSchedule.iqomah_pause, 'minutes')) && this.clock.isBefore(this.$moment(this.prevSchedule.time.date).add((this.prevSchedule.iqomah_pause*60) + 9, 'seconds')) ) ? true : false      
          } else {
            return false
          }
        }
      }, 

      sholatNow(){
        if(this.prevSchedule) {  
          if (this.prevSchedule.slug != 'jumat'){
            if( this.$hijri().iMonth() == 9 && this.prevSchedule.name == 'Isya'){
              return (this.clock.isSameOrAfter(this.$moment(this.prevSchedule.time.date).add((this.prevSchedule.iqomah_pause *60) +9, 'seconds')) && this.clock.isBefore(this.$moment(this.prevSchedule.time.date).add((this.prevSchedule.iqomah_pause * 60 ) + 9 + (this.settings.tarawih_duration * 60) , 'seconds')) ) ? true : false
            } else {
            return (this.clock.isSameOrAfter(this.$moment(this.prevSchedule.time.date).add((this.prevSchedule.iqomah_pause *60) +9, 'seconds')) && this.clock.isBefore(this.$moment(this.prevSchedule.time.date).add((this.prevSchedule.iqomah_pause * 60 ) + 9 + (this.settings.sholat_duration * 60) , 'seconds')) ) ? true : false      
            }
          } else {
            return false
          }
        }
      },

      jumatNow(){
        if(this.prevSchedule){
          if (this.prevSchedule.slug == 'jumat'){
            return (this.clock.isSameOrAfter(this.$moment(this.prevSchedule.time.date)) && this.clock.isBefore(this.$moment(this.prevSchedule.time.date).add(this.settings.jumat_duration, 'minutes')) ) ? true : false

          } else {
            return false
          }
        }
      },        

      jumbotrons(){
        
        if (this.$store.state.license == 'std' ) { return '' }

        if(this.license_not_match === true){
            return [{text: 'Lisensi alat tidak sesuai dengan nomor seri.'},{text: 'Silakan hubungi reseller/customer service'}]
        }
        if(this.no_license === true){
          return [{text: 'Tidak ditemukan kode lisensi pada mesin ini.'},{text: 'Silakan hubungi reseller/customer service'}]
        }

        var nk = this.nextKhotbah
        var j = this.fetched_jumbotrons
        var t = this.fetched_tickers
        if(nk){
          if (nk.khotib.city != ""){
            var ktext = "Khotib Jumat ("+this.$moment(nk.date).format('DD-MMM-YY')+"): "+nk.khotib.name + " dari "+nk.khotib.city+"."
          } else {
            var ktext = "Khotib Jumat ("+this.$moment(nk.date).format('DD-MMM-YY')+"): "+nk.khotib.name
          }
        }
        
        if (this.$store.state.license  == 'pro' ){
          if(nk.jumbotron == 1) j = j.concat({text: ktext })
          
          if(t){
            t.filter(item=>item.jumbotron == 1)
            .map(item=>{
              j = j.concat({ text: item.text })
            })
          }          
        }

        if (this.$store.state.license == 'pcmode' ){
          if(nk.jumbotron == 1) j = j.concat({text: ktext })
          
          if(t){
            t.filter(item=>item.jumbotron == 1)
            .map(item=>{
              j = j.concat({ text: item.text })
            })
          }
          
          j = j.concat({ text:'<div class="orange--text text--lighten-5">Demo jam sholat masjid menggunakan TV Jasma Digital.</div> <div style="font-size:8vh; color:orange--text text--lighten-1;">Kunjungi https://www.jasmadigital.com</div><div class="white--text" style="font-size:6vh;">WhatsApp: 0812.2806.2725</div>'})     
        }

        if (this.$store.state.license == 'demo' ){
          if(nk.jumbotron == 1) j = j.concat({text: ktext })
          
          if(t){
            t.filter(item=>item.jumbotron == 1)
            .map(item=>{
              j = j.concat({ text: item.text })
            })
          }

          j = j.concat({ text:'Demo jam sholat masjid menggunakan TV' })
          
        }

        return j
        

      },

      generatedTimer(){
        if(this.prevSchedule && this.nextSchedule){
          let prev = this.$moment(this.prevSchedule.time.date)
          let next = this.$moment(this.nextSchedule.time.date)

          var toward = this.$moment.preciseDiff(this.clock, next, true)
          var away = this.$moment.preciseDiff(this.clock, prev, true)
          var iqomahCounter = this.$moment.preciseDiff(prev.add(this.prevSchedule.iqomah_pause, 'minutes'), this.clock, true)
          return { toward, away, iqomahCounter }
        }
      },
    },

    methods: {
      init(){        
        this.getLicense()
        this.getKhotbah()   
        this.getJumbotrons() 
        this.getSchedule()  
        this.getBg()             
        this.getTickers()
        this.blink()
        this.getHolidays()
        this.getPlayList() 
      },

      checkSettings(){
        this.axios.get('/f/check-settings')
        .then(res=>{          
          var code = res.data
          if (code != 0){            
            this.axios.put("/f/bot/1", { code: 0 })
            .then(res=>{              
              this.getSettings(code)
            })
          }
        })
      },

      getSettings(code = 0){
        this.axios.get('/f/settings')
        .then(res=>{          
          this.axios.get('/set-audio-out/'+res.data.audio_output)

          this.settings = res.data
            // 1 = background
            // 2 = khotbah, ticker, jumbotron
            // 3 = schedule
            // 4 = holiday
            // 5 = playlist
          
          if (code == 1){
            this.getBg()  
          } else if (code == 2){
            this.getKhotbah()
            this.getTickers() 
            this.getJumbotrons()             
          } else if (code == 3){
            this.getSchedule()
          } else if (code == 4){
            this.getHolidays()
          } else if (code == 5){
            this.getPlayList()
          } else if (code == 99){
            // this.init()
            this.getBg() 
            // window.location.replace('/index.html')
          }
            
          if (code != 0 && code != 99){
            this.$swal({
              type: 'success', showConfirmButton: false, timer:  2500 ,
              title: '<span style="font-family:Roboto">Update Pengaturan...SUKSES!.</span>'
            })
          }         
        })
      }, 

      // getMurottal(qid,sid){
      //   this.axios.get('/f/murottal/'+qid+'/'+sid)
      //   .then(res=>{
      //     this.murottal = res.data

      //   })
      // },

      getBg(){
        this.axios.get('/f/backgrounds')
        .then(res=>{
          this.backgrounds = res.data
        })
      }, 

      getSchedule(){
        this.axios.get('/f/schedule')
        .then(res=>{
          this.schedule  = res.data          
        })     
      },

      getKhotbah(){
        this.axios.get('/f/next-khotbah')
        .then(res=>{
          this.nextKhotbah = res.data     
        })
      },

      getTickers(){
        this.axios.get('/f/tickers')
        .then(res=>{          
          this.fetched_tickers = res.data
        })  
      },  

      getLicense(){      
        let lic = [        
          process.env.VUE_APP_LIC_DEMO,
          process.env.VUE_APP_LIC_STD,
          process.env.VUE_APP_LIC_STD_T1,
          process.env.VUE_APP_LIC_STD_T2,
          process.env.VUE_APP_LIC_STD_T3,
          process.env.VUE_APP_LIC_STD_T4,
          process.env.VUE_APP_LIC_PRO,
          process.env.VUE_APP_LIC_PRO_T1,
          process.env.VUE_APP_LIC_PRO_T2,
          process.env.VUE_APP_LIC_PRO_T3,
          process.env.VUE_APP_LIC_PRO_T4
          
        ]
        
        this.axios.get('/f/hwlic')
        .then(res=>{ 
          this.no_license = false
          if(res.data.hw != ''){          
            let hw = md5(res.data.hw)

            let lc_demo = '';let lc_std = '';let lc_pro = ''
            let lc_std_t1 = '';let lc_std_t2 = '';let lc_std_t3 = '';let lc_std_t4 = '';
            let lc_pro_t1 = '';let lc_pro_t2 = '';let lc_pro_t3 = '';let lc_pro_t4 = '';
            
            for (var i = 0; i <= 5; i++) {
              lc_demo += hw.charAt(lic[0].split('')[i])
              lc_std+= hw.charAt(lic[1].split('')[i])
              lc_std_t1 += hw.charAt(lic[2].split('')[i])
              lc_std_t2 += hw.charAt(lic[3].split('')[i])
              lc_std_t3 += hw.charAt(lic[4].split('')[i])
              lc_std_t4 += hw.charAt(lic[5].split('')[i])
              lc_pro += hw.charAt(lic[6].split('')[i])
              lc_pro_t1 += hw.charAt(lic[7].split('')[i])
              lc_pro_t2 += hw.charAt(lic[8].split('')[i])
              lc_pro_t3 += hw.charAt(lic[9].split('')[i])
              lc_pro_t4 += hw.charAt(lic[10].split('')[i])
            }
            
            var code = res.data.set
            
            if(code == lc_demo){                            
              this.$store.commit('license', 'demo')
            } else if( code == lc_std ){              
              this.$store.commit('license', 'std') 
            } else if( code == lc_std_t1 ){
              this.$store.commit('license', 'std')                
              this.axios.put('/f/settings/1', {layout_id: 1})
            } else if( code == lc_std_t2 ){
              this.$store.commit('license', 'std') 
              this.axios.put('/f/settings/1', {layout_id: 2})
            } else if( code == lc_std_t3 ){
              this.$store.commit('license', 'std') 
              this.axios.put('/f/settings/1', {layout_id: 3})
            } else if( code == lc_std_t4 ){
              this.$store.commit('license', 'std') 
              this.axios.put('/f/settings/1', {layout_id: 4})
            } else if( code == lc_pro ){
              this.$store.commit('license', 'pro') 
            } else if( code == lc_pro_t1 ){
              this.$store.commit('license', 'pro') 
              this.axios.put('/f/settings/1', {layout_id: 1})
            } else if( code == lc_pro_t2 ){
              this.$store.commit('license', 'pro') 
              this.axios.put('/f/settings/1', {layout_id: 2})
            } else if( code == lc_pro_t3 ){
              this.$store.commit('license', 'pro') 
              this.axios.put('/f/settings/1', {layout_id: 3})
            } else if( code == lc_pro_t4 ){
              this.$store.commit('license', 'pro') 
              this.axios.put('/f/settings/1', {layout_id: 4})
            } else {
              this.license_not_match = true
            }

          } else {
            this.$store.commit('license', 'pcmode')   
          }

        })
      

      },       

      getJumbotrons(){
        this.axios.get('/f/jumbotrons')
        .then(res=>{          
          this.fetched_jumbotrons = res.data  
        })
      },

      selectJumbotron(){
        var jb = this.jumbotrons[this.jumbotronShown++]
        if (this.jumbotronShown >= this.jumbotrons.length) this.jumbotronShown = 0;
        
        if (this.counterBg === false && this.toAdzan === false) {
          this.jumbotron = true  
          setTimeout(()=>{this.jumbotron = false}, this.settings.jumbotron_duration * 1000);
        }        
      },

      getPlayList(){
        this.axios.get('/f/playlist')
        .then(res=>{
          this.playList = res.data          
        })        
      },   

      getHolidays(){
        this.axios.get('/f/holidays')
        .then(res=>{
          this.rawHolidays = res.data         
        })
      },  

      blink(){
        this.strobe = true
        setTimeout(()=>{this.strobe = false}, 700);
      },     

      getClock(){
        let interval = 1000
        let clk = this.clock = this.$moment()        
        this.checkSettings()        
    
        this.blink()        

        if ( (parseInt(clk.format('X'))+6)/60 % this.settings.jumbotron_pause == 0) {
          this.getLicense()
          this.selectJumbotron()          
        }

        if(this.nextSchedule) {
          var nextSc = this.nextSchedule

          if(clk.format('hh:mm:ss') == this.$moment(nextSc.time.date).format('hh:mm:ss')){                  
            
            if(this.settings.buzzer_adzan !== null) {
              this.axios.get('/f/buzzer/'+this.settings.buzzer_adzan)
              .then(res=>{})
            }

            this.getSchedule()        
            this.getPlayList()
            //this.startIqomahCountdown()
            this.audioAdzan.src = this.$store.state.baseUrl+'/static/adzan/'+ nextSc.adzan.filename
            this.audioAdzan.load()            
            this.audioAdzan.play()

          }

          if(nextSc.start >0){
            if (clk.format('hh:mm:ss') == this.$moment(nextSc.time.date).subtract(nextSc.start, 'minutes').format('hh:mm:ss')){            
              this.playingIndex = this.playList.findIndex(item=> {return item.id == this.nextSchedule.murottal.id})            
              this.audioIqomah.pause()
              this.playMurottal(0)
            }
          }

          if (clk.format('hh:mm:ss') == this.$moment(nextSc.time.date).subtract(nextSc.stop, 'minutes').format('hh:mm:ss')){   
            this.audioMurottal.pause()
          }
        }

        if(this.prevSchedule) {
          var prevSc = this.prevSchedule
          if(clk.format('hh:mm:ss') == this.$moment(prevSc.time.date).add(prevSc.iqomah_pause, 'minutes').format('hh:mm:ss')){
            
            if(this.settings.buzzer_iqomah !== null) {
              this.axios.get('/f/buzzer/'+this.settings.buzzer_iqomah)
              .then(res=>{})
            }
            
            this.audioAdzan.pause()
            if(this.prevSchedule.slug != 'jumat'){
              this.audioIqomah.src = this.$store.state.baseUrl+'/static/iqomah/'+ prevSc.iqomah.filename
              this.audioIqomah.load()            
              this.audioIqomah.play()

              

            }
          }
        }

        this.tm = setTimeout(this.getClock,1000)
      },

      playMurottal(ct){        
        var entry = this.playList[this.playingIndex]      
        if (this.playingIndex >= this.playList.length) this.playingIndex = 0
        
        this.audioMurottal.addEventListener("ended", this.playNextMurottal)
        //this.audioMurottal.currentTime = ct
        this.audioMurottal.src = this.$store.state.baseUrl + '/static/murottals/'+ entry.qori_id +'/'+ entry.filename         
        this.audioMurottal.load()
        this.audioMurottal.play()
      },

      stopMurottal(ct){              
        //this.settings.murottal_current_time = ct.toString()        
        // this.axios.put('/settings/1', this.settings)
        // .then(res=>{
          this.audioMurottal.pause()
          
        // })
      },

      playNextMurottal(){
        if (this.settings.mrt_next == 0){ // stop
          this.audioMurottal.pause()
        } else if (this.settings.mrt_next == 1){ // next
          this.playingIndex =  this.playingIndex + 1        
          this.playMurottal(0)
        } else if (this.settings.mrt_next == 2){ // repeat
          this.playMurottal(0)
        }        
      },

    },

    beforeDestroy(){
      clearTimeout(this.tm);
      clearTimeout(this.ts);
    }
  }  
</script>

<style> 

  .aladin {font-family: Aladin;}
  .eczar {font-family: Eczar;}
  .roboto {font-family: Roboto;}
  .oleo {font-family: "Oleo Script";}

  .blackopc, .blackopc.v-card{background-color: rgba(0, 0, 0, 0.5);text-shadow: 0px 0px 25px #000;}
  .whiteopc, .whiteopc.v-card{background-color: rgba(255, 255, 255, 0.6);}
  .purpleopc, .purpleopc.v-card{background-color: rgba(156, 39, 176, 0.5);text-shadow: 0px 0px 25px #000;}
  .tealopc,  .tealopc.v-card{background-color: rgba(0, 150, 136, 0.5);text-shadow: 0px 0px 25px #000;}
  .orangeopc, .orangeopc.v-card{background-color: rgba(255, 152, 0, 0.5);text-shadow: 0px 0px 25px #000;}
  .redopc, .redopc.v-card{background-color: rgba(244, 67, 54, 0.5);text-shadow: 0px 0px 25px #000;}
  .greenopc, .greenopc.v-card{background-color: rgba(76, 175, 80, 0.5);text-shadow: 0px 0px 25px #000;}
  .blueopc, .blueopc.v-card{background-color: rgba(33, 150, 243, 0.5); text-shadow: 0px 0px 25px #000;}
  .greyopc, .greyopc.v-card{background-color: rgba(155, 155, 155, 0.7);}

  .opc5{background-color: rgba(255, 255, 255, 0.5); } 
  .greenopc8{background-color: rgba(0, 30, 0, 0.8); } 
  .opc7{background-color: rgba(255, 255, 255, 0.7); } 
  .opc0, .opc0.v-card {background-color: transparent;}
  .abs-bottom{position: absolute; bottom:1vh; width:100%; } 
  .absolute{ position: absolute; top:0; left:0; width:100%; height:100%; }

  .jumbotron-text{ text-shadow: 0px 0px 2vh #000;font-size:10vh; line-height:10vh;}
  .jumbotron-clock{font-size:9vh; line-height:9vh; } 
  .jumbotron-next-name{font-size:6vh;line-height:5vh;}
  .jumbotron-next-time{font-size:8vh;line-height:8vh;}
  .jumbotron-text-bg {}

  .display-title{ font-size: 13vh;line-height:13vh; text-shadow: 0 0 2vh #FFD, 0 0 1vh #FFD,0 0 1vh #FFD,0 0 1vh #FFD; }
  .display-counter{ font-size: 50vh; line-height:50vh; text-shadow: 0 0 2vh #222, 0 0 2vh #222,0 0 2vh #222;}
  .display-sc{ font-size: 40vh; line-height:40vh; text-shadow: 0 0 2vh #222, 0 0 2vh #222,0 0 2vh #222;}

  .sholatnow-title{font-size:12vh;line-height: 12vh; text-shadow: 0px 0px 25px #000;}
  .sholatnow-name{font-size:30vh;line-height: 30vh; text-shadow: 0px 0px 25px #000;}
  .sholatnow-clock{font-size:20vh;line-height: 20vh;}

  .demo1{ font-size: 6vh; line-height: 6vh; opacity: 0.5;text-shadow: 0 0 2vh #FFD, 0 0 1vh #FFD,0 0 1vh #FFD,0 0 1vh #FFD;}
  .demo2{ font-size: 12vh; line-height: 12vh; opacity: 0.35;text-shadow: 0 0 2vh #111, 0 0 1vh #111,0 0 1vh #111,0 0 1vh #111; }

  .cmx-05{margin-left:0.5vh;margin-right:0.5vh;}
  .cmx-1{margin-left:1vh;margin-right:1vh;}
  .cmx-2{margin-left:2vh;margin-right:2vh;}
  .cmx-15{margin-left:1.5vh;margin-right:1.5vh;}
  .cmy-05{margin-top:0.5vh;margin-bottom:0.5vh;}
  .cmy-1{margin-top:1vh;margin-bottom:1vh;}
  .cmy-15{margin-top:1.5vh;margin-bottom:1.5vh;}

  .cmt-1{margin-top:1vh;}
  .cmb-1{margin-bottom:1vh;}
  .cmt-2{margin-top:2vh;}
  .cmr-2{margin-right:2vh;}


  .cpa-1{padding:1vh;}
  .cpa-2{padding:2vh;}
  .cpa-3{padding:3vh;}
  .cpa-4{padding:4vh;}

  .cpx-05{ padding-left: 0.5vh; padding-right: 0.5vh;}
  .cpx-1{ padding-left: 1vh; padding-right: 1vh;}
  .cpx-15{ padding-left: 1.5vh; padding-right: 1.5vh;}
  .cpx-2{ padding-left: 2vh; padding-right: 2vh;}
  .cpx-3{ padding-left: 3vh; padding-right: 3vh;}
  .cpx-4{ padding-left: 4vh; padding-right: 4vh;}

  .cpy-05{ padding-top: 0.5vh; padding-bottom: 0.5vh;}
  .cpy-1{ padding-top: 1vh; padding-bottom: 1vh;}
  .cpy-15{ padding-top: 1.5vh; padding-bottom: 1.5vh;}
  .cpy-2{ padding-top: 2vh; padding-bottom: 2vh;}
  .cpy-3{ padding-top: 3vh; padding-bottom: 3vh;}
  .cpy-4{ padding-top: 4vh; padding-bottom: 4vh;}

  .cpt-1{ padding-top: 1vh;}
  .cpt-2{ padding-top: 2vh;}
  .cpt-3{ padding-top: 3vh;}
  .cpt-4{ padding-top: 4vh;}

  .cpb-1{ padding-bottom: 1vh;}
  .cpb-2{ padding-bottom: 2vh;}
  .cpb-3{ padding-bottom: 3vh;}
  .cpb-4{ padding-bottom: 4vh;}

  .cpl-1{ padding-left: 1vh;}
  .cpl-2{ padding-left: 2vh;}
  .cpl-3{ padding-left: 3vh;}
  .cpl-4{ padding-left: 4vh;}

  .cpr-1{ padding-right: 1vh;}
  .cpr-2{ padding-right: 2vh;}
  .cpr-3{ padding-right: 3vh;}
  .cpr-4{ padding-right: 4vh;}

.black-shadow1{text-shadow: 0px 0px 1vh #000}
.black-shadow2{text-shadow: 0px 0px 1vh #000,0px 0px 1vh #000;}
.black-shadow3{text-shadow: 0px 0px 1vh #000,0px 0px 1vh #000,0px 0px 1.5vh #000;}

.white-shadow1{text-shadow: 0px 0px 1vh #FFF}
.white-shadow2{text-shadow: 0px 0px 1vh #FFF,0px 0px 1.5vh #FFF;}
.white-shadow3{text-shadow: 0px 0px 1vh #FFF,0px 0px 1.5vh #FFF,0px 0px 2vh #FFF;}


  /* TRANSITION */
  .jb-fade-enter-active, .jb-fade-leave-active{transition: 2s;}
  .jb-fade-enter, .jb-fade-leave-to{opacity: 0;}

  .slideleft-enter-active, .slideleft-leave-active, .slideleft-leave-to{transition: 0.5s;position: absolute;top: 0;left: 0;}
  .slideleft-leave-to {transform: translate3d(-100%, 0, 0)}
  .slideleft-enter, .slideleft-leave{transform: translate3d(100%, 0, 0); }

  .slideup-enter-active, .slideup-leave-active{transition: 0.5s;position: absolute;top: 0;left: 0;} 
  .slideup-leave-to{transform: translate3d(0, -100%,0); opacity: 0;}
  .slideup-enter{transform: translate3d(0, 100%,0); opacity: 0;} 

  @font-face {
     font-family: 'Uthmanic';font-style: normal;font-weight: 400;     
     src: url('../assets/fonts/Amiri-Regular.ttf') format('truetype');
  }

  @font-face {
    font-family: 'Oleo Script';
    font-style: normal;
    font-weight: 400;
    src: url(../assets/fonts/oleo-script.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

</style>