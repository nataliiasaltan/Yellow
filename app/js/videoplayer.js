class VideoPlayer{
    constructor(settings) {
        this.__settings = Object.assign(VideoPlayer.getDefaultSettings(), settings);
        this.__videoContainer = null;
        this.__video = null;
        this.__playBtn = null;
        this.__progressBar = null;
        this.__progressContainer = null;
        this.__volumeBar = null;
        this.__playbackRate = null;
        this.__skipGroup = null;
    }

    static getDefaultSettings() { //значения по умолчанию
        return{
            videoUrl: '',
            videoContainer: '.mplayer',
            volume: 1,
        };
    }

    init() {
        //проверить, добавлено ли видео
        if(!this.__settings.videoUrl) {
            return console.error('Передайте адрес видео');
        }
        // передан ли контейнер
        if(!this.__settings.videoContainer) {
            return console.error('Передайте контейнер');
        }

        // добавить разметку на страницу
        this.__addTemplate();

        // найти все элементы управления
        this.__defineElements();

        //установить обработчики событий
        this.__addEvents();
    }
    
    __addTemplate() {
            const template = this.__createVideoTemplate();
            const container = document.querySelector(this.__settings.videoContainer);
            container.insertAdjacentHTML('afterbegin', template);
        }

    __defineElements() {
        this.__videoContainer = document.querySelector(this.__settings.videoContainer)
        this.__video = this.__videoContainer.querySelector('video');
        console.dir(this.__video)
        this.__playBtn = this.__videoContainer.querySelector('.player__button');
        this.__progressBar = this.__videoContainer.querySelector('.progress__filled');
        this.__progressContainer = this.__videoContainer.querySelector('.progress');
        this.__volumeBar = this.__videoContainer.querySelector('[name="volume"]');
        console.dir(this.__volumeBar);
        this.__playbackRate = this.__videoContainer.querySelector('[name="playbackRate"]');
        console.dir(this.__playbackRate);
        this.__skipGroup = this.__videoContainer.querySelector('.skip__group');
    }

    tooglePlay() {
        const method = this.__video.paused ? 'play' : 'pause';
        this.__playBtn.textContent = this.__video.paused ? '❚ ❚' :  '►';
        this.__video[method]();
    }

    __handleProgress() {
        const percent = (this.__video.currentTime/this.__video.duration)*100;
        this.__progressBar.style.flexBasis = `${percent}%`;

    }

    __scrub(e) {
        this.__video.currentTime = (e.offsetX/this.__progressContainer.offsetWidth)*this.__video.duration
    }

    __goToStart() {
        this.__video.currentTime = 0;
        this.__playBtn.textContent = '►';

    }

    editVolume() {
        this.__video.volume = this.__volumeBar.value; //присвоить значение инпута
    }

    
    editSpeed() {
        this.__video.playbackRate = this.__playbackRate.value; ////присвоить значение инпута
    }

    __addEvents() {
        this.__video.addEventListener('click', () => this.tooglePlay());
        this.__playBtn.addEventListener('click', () => this.tooglePlay());

        this.__video.addEventListener('timeupdate', ()=>this.__handleProgress);

        this.__progressContainer.addEventListener('click', e=>this.__scrub(e) );
        this.__progressContainer.addEventListener('mousedown', ()=>this.__mouseDown = true);
        this.__progressContainer.addEventListener('mousemove', e=>this.__mouseDown && this.__scrub(e));
        this.__progressContainer.addEventListener('mouseup', ()=>this.__mouseUp = false);

        this.__video.addEventListener('ended', ()=> this.__goToStart());

        this.__volumeBar.addEventListener('input', ()=>this.editVolume());

        this.__playbackRate.addEventListener('input', ()=>this.editSpeed());

        this.__skipGroup.addEventListener('click', e=>{
            if(e.target.classList.contains('skip__btn')) {
                let data = Number(e.target.dataset.skip);
                this.__video.currentTime += data;
            }
        });


    }
    


    __createVideoTemplate() {
        return `
                <div class="player">
                <video class="player__video viewer" src="${this.__settings.videoUrl}"> </video>
                <div class="player__controls">
                    <div class="progress">
                        <div class="progress__filled"></div>
                    </div>
                    <button class="player__button toggle" title="Toggle Play">►</button>
                    <input type="range" name="volume" class="player__slider" min=0 max="1" step="0.05" value="${this.__settings.volume}">
                    <input type="range" name="playbackRate" class="player__slider" min="0.1" max="2" step="0.1" value="1">
                    <div class="skip__group">
                        <button data-skip="-5" class="player__button skip__btn">« 1s</button>
                        <button data-skip="5" class="player__button skip__btn">1s »</button>
                    </div>
                </div>
                </div>
                `;
    }
}