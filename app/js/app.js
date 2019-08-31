const player = new VideoPlayer({
    videoUrl: './video/banana.mp4',
    videoContainer: '.slider__item',
    volume: 0.5,
});

console.log(player);


player.init()