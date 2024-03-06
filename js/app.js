const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const playList = $('.playlist')
const cdThumb = $('.image-thumb')
const nameMusic = $('.content .name-music')
const author = $('.content .author')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.next')
const prevBtn = $('.prev')
const btnList = $('.header-list')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat');
const btnVolume = $('.btn-volume');
const volumeBar = $('.volume-bar');
const timeLeft = $('.time-current');
const timeRight = $('.time-end');

const app ={
    currentIndex: 0,
    isPlaying : false,
    isRandom: false,
    isRepeat: false,
    isList: false,
    isVolume: false,
    playedSongs: [],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs:[
        {
            name: "Lời Từ Trái Tim Anh",
            singer: "Phan Mạnh Quỳnh",
            path: "./assets/music/Phan Mạnh Quỳnh _ Lời Từ Trái Tim Anh.mp4",
            image:
              "https://cdn.tuoitre.vn/thumb_w/730/2022/3/18/phan-manh-quynh-2-nvcc-1647595826560676316986.jpg"
          },
          {
            name: "Chờ anh nhé",
            singer: "Hoàng Dũng",
            path: "./assets/music/Chờ Anh Nhé _ Hoàng Dũng Live Session EP.10.mp4",
            image:
              "https://vcdn1-giaitri.vnecdn.net/2022/08/26/273933827514818800519394758596-8098-5243-1661503455.jpg?w=500&h=300&q=100&dpr=2&fit=crop&s=WvcGUDiHgP7arC9A0Alc7Q"
          },
        {
            name: "Anh Tự Do Nhưng Cô Đơn",
            singer: "Đạt G",
            path: "./assets/music/anh tự do nhưng cô đơn.mp4",
            image: "https://cdn.tuoitre.vn/zoom/480_300/1200/900/ttc/r/2021/11/24/dat-g-giong-nhu-tinh-anh-3-1637729276-16x9.jpg"
          },    
          
          {
            name: "Thủy triều",
            singer: "Quang Hùng MasterD",
            path:
              "./assets/music/Thủy triều-Quang Hùng.mp4",
            image: "https://event.mediacdn.vn/257767050295742464/image/hot14/2021/4/25/dinh-dung-1-1619353192958925885443.png"
          },
          {
            name: "Ngôi nhà hạnh phúc - Để em rời xa",
            singer: " Trung Quân",
            path: "./assets/music/NGÔI NHÀ HẠNH PHÚC - ĐỂ EM RỜI XA.mp4",
            image:
              "https://thanhnien.mediacdn.vn/Uploaded/hienht/2021_11_22/trung-quan-idol-2-5958.jpg"
          },
          {
            name: "Tình sâu đậm mưa mịt mù",
            singer: "Trung Quân",
            path: "./assets/music/Tình sâu đậm mưa mịt mù.mp4",
            image:
              "https://i.ytimg.com/vi/8TZdsi6UKJE/hqdefault.jpg"
          },
          {
            name: "Sau này chúng ta giàu",
            singer: "Khắc Việt",
            path: "./assets/music/sau này chúng ta giàu.mp4",
            image:
              "https://phunuvietnam.mediacdn.vn/179072216278405120/2022/9/6/khac-viet-7-16624354726951140329667-1662440063991-16624400641131461878732.jpg"
          },
          {
            name: "Người bình thường",
            singer: "Vũ Cát Tường",
            path: "./assets/music/Người bình thường- Vũ Cát Tường (Lyrics Video).mp4",
            image:
              "https://kenh14cdn.com/203336854389633024/2022/7/10/photo-1-1657413140937694854145.jpg"
          },
    ],
    setConfig: function(key, value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function(){
        const htmls = this.songs.map((song, index) =>{
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                    <div class="image" style="background-image: url('${song.image}')">
                    </div>

                <div class="info">
                    <h3 class="name">${song.name}</h3>
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
                return this.songs[this.currentIndex]
            }
        })
    },

    loadCurrentSong: function(){

        nameMusic.textContent = this.currentSong.name
        author.textContent = this.currentSong.singer
        
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    reRender: function() {
        $$('.song').forEach((song, index) => { // duyệt qua và thêm class active vào bài hát hiện tại
            if (index === this.currentIndex) {
                // Nếu có, thêm vào class "active"
                song.classList.add('active');
            } else {
                // Nếu không, xóa class "active"
                song.classList.remove('active');
            }
        });
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length-1
        }
        this.loadCurrentSong()
    },
    playRandomSong:function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex || this.playedSongs.includes(newIndex))
        console.log(this.playedSongs)
        this.currentIndex = newIndex
        this.playedSongs.push(newIndex);
        this.loadCurrentSong()
        if(this.playedSongs.length == this.songs.length) { // nếu đã phát hết danh sách rồi thì làm mới lại mảng đã phát
            this.playedSongs = [];
            this.playedSongs.push(newIndex);// để tránh lặp bài cuối ta cũng đẩy nó vào danh sách mới
        }
    },
    formatTime: function(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = seconds % 60;
        
        const formattedTime = `${minutes}:${remainderSeconds.toString().padStart(2, '0')}`;
        return formattedTime;
    },

    handleEvent: function(){
        _this = this
        //click hiện danh sách song
        btnList.onclick = function(){
            if(_this.isList){
                _this.isList = false
                playList.classList.remove('hide')
            }else{          
                _this.isList = true
                playList.classList.add('hide')
            }
        }
        //click hiện thanh volume
        btnVolume.onclick = function(){
            if(_this.isVolume){
                _this.isVolume = false
                volumeBar.classList.add('hide')
            }else{
                _this.isVolume = true
                volumeBar.classList.remove('hide')
            }
        }

       // xử lý khi tăng giảm âm lượng
            volumeBar.addEventListener("input", function() {
                // Cập nhật giá trị âm lượng của âm thanh
                audio.volume = volumeBar.value;
                if (audio.volume === 0) {
                    btnVolume.classList.add('hide')
                } else {
                    btnVolume.classList.remove('hide')
                }
            });  

         

        //xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate(
            [
                {
                    transform: 'rotate(360deg)' 
                }
            ],
            {
                duration: 10000, // 10seconds
                iterations: Infinity
            }
        )
        cdThumbAnimate.pause()

        //xử lý khi click play
        playBtn.onclick = function(){           
            if(_this.isPlaying){
                audio.pause()
            }
            else{              
                audio.play()             
            }       
        }
         //Khi song bị pause
         audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Khi song dược play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
                // Hiện time    
                timeLeft.textContent = _this.formatTime(Math.floor(audio.currentTime));
                timeRight.textContent = _this.formatTime(Math.floor(audio.duration));
                progress.style.background = `linear-gradient(to right, var(--primary-color) ${progress.value / progress.max * 100}%, #4d4d4d ${progress.value / progress.max * 100}%)`;
            }
        }
        // xử lý khi tua song
        progress.oninput = function(e){
            const seekTime =  e.target.value / 100 * audio.duration
            audio.currentTime = seekTime
        } 

        //khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.reRender()
            // _this.scrollToActiveSong()
        }

        //khi prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.reRender()
            // _this.scrollToActiveSong()
        } 
          // Xử lý bật / tắt random song
          randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active',_this.isRandom)           
            _this.setConfig('isRandom', _this.isRandom)
            _this.playedSongs.push(_this.currentIndex)
        }

        // // Xử lý phát lại song
        // repeatBtn.onclick = function(e){
        //     _this.isRepeat = !_this.isRepeat
        //     repeatBtn.classList.toggle('active',_this.isRepeat) 
        //     _this.setConfig('isRepeat', _this.isRepeat)
        // }
         //xử lý khi bài hát kết thúc
         audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }
         // Lắng nghe hành vi click vào playList
         playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                // xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.reRender()
                    audio.play()
                    playList.classList.add('hide')
                }

                //xử lý khi click vào option
                if(e.target.closest('.option')){

                }
            }
        }      

    },
    start: function(){  
         this.loadConfig()
        // Đinh nghĩa các thuộc tính cho object
        this.defineProperties()

        // Lắng nghe / xử lý các sự kiện (Dom events)
        this.handleEvent()

        // //tải thông tin bài hát đầu tiên vào ui khi chạy ứng dụng
         this.loadCurrentSong()

        // render playlists
        this.render();

        // Hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle('active', this.isRandom)
    }
}

app.start();