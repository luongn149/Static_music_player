const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist')

const app = {
    currentIndex : 0,
    isPlaying: false,
    isRandom: false,
    isRepeat : false,
    config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [

        {
            name: 'Bad Liar',
            singer : 'Imagine Dragons',
            path : './assets/music/Bad_Liar.mp3',
            image : './assets/img/Bad_Liar.jpg'
        },
        {
            name: 'Blinding Lights',
            singer : 'The Weeknd',
            path : './assets/music/Blinding_Lights.mp3',
            image : './assets/img/Blinding_Lights.jpg'
        },
        {
            name: 'Born To Be Yours',
            singer : 'Imagine Dragons',
            path : './assets/music/Born_To_Be_Yours.mp3',
            image : './assets/img/Born_To_Be_Yours.jpg'
        },
        {
            name: 'Chlorine',
            singer : 'Twenty One Pilots',
            path : './assets/music/Chlorine.mp3',
            image : './assets/img/Chlorine.jpg'
        },
        {
            name: 'Creep',
            singer : 'RadioHead',
            path : './assets/music/Creep.mp3',
            image : './assets/img/Creep.jpg'
        },
        {
            name: 'Demons',
            singer : 'Imagine Dragons',
            path : './assets/music/Demons.mp3',
            image : './assets/img/Demons.jpg'
        },
        {
            name: 'Happier',
            singer : 'Bastille ft. Marshmello',
            path : './assets/music/Happier.mp3',
            image : './assets/img/Happier.jpg'
        },
        {
            name: 'Love The Way You Lie',
            singer : 'Eminem ft. Rihanna',
            path : './assets/music/Love_The_Way_You_Lie.mp3',
            image : './assets/img/Love_The_Way_You_Lie.jpg'
        },
        {
            name: 'Natural',
            singer : 'Imagine Dragons',
            path : './assets/music/Natural.mp3',
            image : './assets/img/Natural.jpg'
        },
        {
            name: 'Not Afraid',
            singer : 'Eminem',
            path : './assets/music/Not_Afraid.mp3',
            image : './assets/img/Not_Afraid.jpg'
        },
        {
            name: 'Whatever It Takes',
            singer : 'Imagine Dragons',
            path : './assets/music/Whatever_It_Takes.mp3',
            image : './assets/img/Whatever_It_Takes.jpg'
        },
        {
            name: 'Wrecked',
            singer : 'Imagine Dragons',
            path : './assets/music/Wrecked.mp3',
            image : './assets/img/Wrecked.jpg'
        }
    
    ],
    setConfig: function(key,value){
            this.config[key] = value;
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render:function(){
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class="song ${index === this.currentIndex ? 'active':''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')" >
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
          `
        })
        playList.innerHTML = htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents : function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;
        //X??? l?? quay v?? d???ng ????a CD 
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}],
            {
            duration: 10000,
            iterations: Infinity
            })
        cdThumbAnimate.pause()
        //X??? l?? dashboard khi scroll list nh???c
        document.onscroll = function(){
            const scrollTop = document.documentElement.scrollTop || window.scrollY
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth/cdWidth;
        }
        //X??? l?? n??t play 

        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
        }

        //Khi ??ang ch???y b??i h??t 
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        //Khi pause b??i h??t 
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause();

        }       
        //Ti???n ????? b??i h??t thay ?????i 
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime*100/audio.duration)
                progress.value = progressPercent;
            }
        }
        //X??? l?? khi tua b??i h??t 
        progress.onchange = function(e){
            const seekTime = audio.duration/100*e.target.value;
            audio.currentTime = seekTime;
        }
        //Khi b???m next 
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.nextRandomSong();
            }else{
            _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        //khi b???m prev
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.nextRandomSong();
            }else{
            _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }
        //Khi b???m repeat 
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
    
        }
        //Khi b???m random
        randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)

        }

        //X??? l?? khi k???t th??c b??i h??t
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
            nextBtn.click();
            }
        }
        //L???ng nghe h??nh vi click v??o playlist\
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            //x??? l?? khi click v??o b??i h??t
            if(songNode || e.target.closest('.option')){
                
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();

                }
            }
            
        }
    },scrollToActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'center',
            })
        },200)
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name + ' - ' + this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path;
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },
    nextRandomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random()* this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function(){
        //G??n c???u h??nh t??? config v??o ???ng d???ng
        this.loadConfig();
        // ?????nh ngh??a c??c thu???c t??nh c???a object
        this.defineProperties();
        //L???ng nghe v?? x??? l?? c??c s??? ki???n DOM events
        this.handleEvents();
        //Load b??i h??t hi???n t???i v??o UI dashboard
        this.loadCurrentSong();
        //render danh s??ch b??i h??t
        this.render();

        //Hi???n th??? c??c setting ???? l??u
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    }
}
app.start();

