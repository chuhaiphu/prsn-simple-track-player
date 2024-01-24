const MUSIC_LIST = [
    {
        "img": "./images/Faded.jpg",
        "name": "Faded",
        "artist": "Alan Walker",
        "music": "./musics/Fade.mp3"
    },
    {
        "img": "./images/Lily.png",
        "name": "Lily",
        "artist": "Alan Walker",
        "music": "./musics/Lily.mp3"
    },
    {
        "img": "./images/TheNights.jpg",
        "name": "The Night",
        "artist": "Avicii (Cover by AngieN.)",
        "music": "./musics/TheNights.mp3"
    },
    {
        "img": "./images/VuHoiHoaTrang.jpg",
        "name": "假面舞会",
        "artist": "很美味",
        "music": "./musics/VuHoiHoaTrang.mp3"
    }
]

// ? track details
let trackArt = document.querySelector('.track-art');
let trackName = document.querySelector('.track-name');
let trackArtist = document.querySelector('.track-artist');
let nowPlaying = document.querySelector('.now-playing');

// ? track buttons
let playPauseTrack = document.querySelector('.playpause-track');
let nextTrack = document.querySelector('.next-track');
let prevTrack = document.querySelector('.prev-track');

// ? track sliders and motions
let songSlider = document.querySelector('.song_slider');
let volumeSlider = document.querySelector('.volume_slider');
let currentTime = document.querySelector('.current-time');
let totalDuration = document.querySelector('.total-duration');
let wave = document.querySelector('.wave');
// ! tạo ra một element audio trong memory nhưng không gán vào html (document).
let currentTrack = document.createElement('audio');
// * Để gán vào html, ví dụ : document.body.appendChild(currentTrack);

let isPlaying = false;
let isRandom = false;
let trackIndex = 0;
let updateTimer;
loadTrack(trackIndex);

function loadTrack(trackIndex){
    //*clear setInterval base on id (updateTimer)
    clearInterval(updateTimer);

    reset();
    currentTrack.src = MUSIC_LIST[trackIndex].music;
    currentTrack.load();    //load media resource
    trackArt.style.backgroundImage = "url(" + MUSIC_LIST[trackIndex].img + ")";
    trackName.textContent = MUSIC_LIST[trackIndex].name;
    trackArtist.textContent = MUSIC_LIST[trackIndex].artist;
    nowPlaying.textContent = "Playing music " + (trackIndex + 1) + " of " + MUSIC_LIST.length;

    //*setInterval => call setUpdate function for every 1000 miliseconds
    updateTimer = setInterval(setUpdate, 1000);
    randomBackgroundColor();
}   

function reset() {
    currentTime.textContent = "00:00";
    totalDuration.textContent = "00:00";
    songSlider.value = 0;
    volumeSlider.value = 10;
}

function setUpdate(){
    let songPosition = 0;
    if (!isNaN(currentTrack.duration)){
        // ? (100 / currentTrack.duration) => phần độ dài của thanh trackbar ứng với mỗi giây trong currentTrack
        // ? currentTrack.currentTime * (100 / currentTrack.duration) => từ đó, ta suy ra được với số giây hiện tại của bài hát, thì sẽ tìm được độ dài của thanh trackbar tương ứng.
        songPosition = currentTrack.currentTime * (100 / currentTrack.duration);
        // * gán giá trị độ dài vừa tìm được vào slider của thanh trackbar
        songSlider.value = songPosition; 

        let durationMinutes = Math.floor(currentTrack.duration / 60);
        let durationSeconds = Math.floor(currentTrack.duration - durationMinutes * 60);
        let currentMinutes = Math.floor(currentTrack.currentTime / 60);
        let currentSeconds = Math.floor(currentTrack.currentTime - currentMinutes * 60);
        
        // * thêm số 0 trước số phút và số giây nhỏ hơn 10
        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        currentTime.textContent = currentMinutes + ":" + currentSeconds;
        totalDuration.textContent = durationMinutes + ":" + durationSeconds;
    }
}

function playOrPauseTrack(){
    isPlaying ? pauseTrack() : playTrack();
}

function playTrack(){
    console.log("play");
    currentTrack.play();
    isPlaying = true;
    playPauseTrack.innerHTML = '<i class="fa fa-pause-circle fa-3x"></i>';
    trackArt.classList.add('rotate');
    wave.classList.add('loader');
    setVolume();
}

function pauseTrack(){
    console.log("pause");
    currentTrack.pause();
    isPlaying = false;
    playPauseTrack.innerHTML = '<i class="fa fa-play-circle fa-3x"></i>';
    trackArt.classList.remove('rotate');
    wave.classList.remove('loader');
}

function repeatTrack(){
    loadTrack(trackIndex);
    playTrack();
}

// * Phát bài hát kế tiếp
function getNextTrack(){
    console.log("next");
    // nếu bài hát hiện đại đang có số vị trí nhỏ hơn vị trí cuối cùng, và tính năng phát random đang tắt
    if (trackIndex < MUSIC_LIST.length - 1 && isRandom === false){
        trackIndex += 1;
    }
    // nếu tính năng phát random đang BẬT
    else if (trackIndex < MUSIC_LIST.length - 1 && isRandom === true){
        let randomIndex = Number.parseInt(Math.random() * MUSIC_LIST.length);
        trackIndex = randomIndex;
    }else {
        trackIndex = 0;
    }
    loadTrack(trackIndex);
    playTrack();
}

// * Phát bài ở vị trí trước đó
function getPrevTrack(){
    console.log("prev");
    // nếu bài hát ở vị trí đầu danh sách
    if (trackIndex == 0){
        trackIndex = MUSIC_LIST.length - 1;
    }
    else trackIndex -= 1;
    loadTrack(trackIndex);
    playTrack();
}

function seekTo(){
    currentTrack.currentTime = currentTrack.duration * (songSlider.value / 100);
}

function setVolume(){
    currentTrack.volume = volumeSlider.value / 100;
}

function getRandomTrack() {
    isRandom ? pauseRandom() : playRandom();
}

function playRandom() {
    isRandom = true;
    randomIcon.classList.add('randomActive');
}

function pauseRandom() {
    isRandom = false;
    randomIcon.classList.remove('randomActive');
}

function randomBackgroundColor() {
    var colorOne = populate();
    var colorTwo = populate();
    document.body.style.background = 'linear-gradient(to right,' + colorOne + ',' + colorTwo + ")";
    document.querySelector(".song_slider").style.background = 'linear-gradient(to right,' + colorOne + ',' + colorTwo + ")";
    document.querySelector(".volume_slider").style.background = 'linear-gradient(to right,' + colorOne + ',' + colorTwo + ")";
}

function populate() {
    var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e'];
    var colorRandom = "#";
    for (var i = 0; i < 6; i++) {
        var x = Math.round(Math.random() * 14);
        var y = hex[x];
        colorRandom += y;
    }
    return colorRandom;
}