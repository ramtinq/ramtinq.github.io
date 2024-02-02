const youtubeButtonPlayText = 'Play';
const youtubeButtonPauseText = 'Pause';
const vimeoButtonPlayText = 'Play';
const vimeoButtonPauseText = 'Pause';
const creativeEffectOptions = {
    prev: {
      shadow: true,
      translate: ["-20%", 0, -1],
    },
    next: {
      translate: ["100%", 0, 0],
    },
};
cubeEffectOptions = {
    shadow: false,
    slideShadows: true,
    shadowOffset: 20,
    shadowScale: 0.94,
};
const allowTouchMove = true;
var youtubeSwipers = document.getElementsByClassName('youtube-swiper');
for(var i = 0; i<youtubeSwipers.length; i++) {
    let swiper = new Swiper(youtubeSwipers[i], {
        effect: youtubeSwipers[i].dataset.effect ?? 'flip',
        grabCursor: true,
        preventInteractionOnTransition: true,
        allowTouchMove: allowTouchMove,
        pagination: {
            el: ".swiper-pagination",
        },
        cubeEffect: cubeEffectOptions,
        creativeEffect: creativeEffectOptions,
        /*
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        */
    });
}

// 2. This code loads the IFrame Player API code asynchronously.
var youtubeScriptTag = document.createElement('script');

youtubeScriptTag.src = "https://www.youtube.com/iframe_api";
var firstYoutubeScriptTag = document.getElementsByTagName('script')[0];
firstYoutubeScriptTag.parentNode.insertBefore(youtubeScriptTag, firstYoutubeScriptTag);

function onYouTubeIframeAPIReady() {
    youtubePlayerContainers = document.getElementsByClassName('youtube-player-container');
    for(let i = 0; i<youtubePlayerContainers.length; i++) {
        let el = youtubePlayerContainers[i].getElementsByClassName('player')[0];
        //console.log('creating player!!!');
        // !important: use let for player or all players would be replaced by the last one!
        let player = new YT.Player(el, {
            videoId: youtubePlayerContainers[i].dataset.ytid,
            playerVars: {
                'playsinline': 1,
                'rel': 0, 'showinfo': 0, 'ecver': 2,
            },
            events: {
                'onReady': function (event) {
                    event.target.playVideo();
                },
                'onStateChange': function (event) {
                    if (event.data == YT.PlayerState.PLAYING) {
                        console.log('playing!');
                    }
                },
            }
        });
    }

    for(let i = 0; i<youtubeSwipers.length; i++) {
        let button = document.getElementById(youtubeSwipers[i].dataset.button);
        let buttonSpan = button.querySelector('span');
        buttonSpan.textContent = youtubeButtonPlayText;
        let swiper = youtubeSwipers[i].swiper;
        let ytContainer = youtubeSwipers[i].getElementsByClassName('swiper-youtube-player-container')[0];
        // !important: use let for player or all players would be replaced by the last one!
        let player = new YT.Player(ytContainer.getElementsByClassName('player')[0], {
            videoId: ytContainer.dataset.ytid,
            playerVars: {
                'playsinline': 1,
                'rel': 0, 'showinfo': 0, 'ecver': 2,
            },
            events: {
                'onReady': function (event) {
                   //event.target.playVideo();
                },
                'onStateChange': function (event) {
                    if (event.data == YT.PlayerState.PLAYING) {
                        swiper.slideTo(1);
                        button.classList.replace('fa-play', 'fa-pause');
                        button.classList.replace('paused', 'playing');
                        buttonSpan.textContent = youtubeButtonPauseText;
                        window.onscroll = null;
                    }
                    else if(event.data == YT.PlayerState.PAUSED) {
                        button.classList.replace('fa-pause', 'fa-play');
                        button.classList.replace('playing', 'paused');
                        buttonSpan.textContent = youtubeButtonPlayText;
                        
                        window.onscroll = function() {
                            youtubeSwipers[i].swiper.slideTo(0);
                            window.onscroll = null;
                        }
                    }
                },
            }
        });
        button.addEventListener('click', function() {
        if(button.classList.contains('paused')) {
            player.playVideo();
        }
        else {
            player.pauseVideo();
        }
    });
    }
}

/// Vimeo
var vimeoSwipers = document.getElementsByClassName('vimeo-swiper');
for(let i = 0; i<vimeoSwipers.length; i++) {
    let swiper = new Swiper(vimeoSwipers[i], {
        effect: vimeoSwipers[i].dataset.effect ?? 'flip',
        grabCursor: true,
        preventInteractionOnTransition: true,
        allowTouchMove: allowTouchMove,
        pagination: {
            el: ".swiper-pagination",
        },
        cubeEffect: cubeEffectOptions,
        creativeEffect: creativeEffectOptions,
        /*
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        */
    });

    const button = document.getElementById(vimeoSwipers[i].dataset.button);
    const buttonSpan = button.querySelector('span');
    buttonSpan.textContent = vimeoButtonPlayText;

    const iframe = vimeoSwipers[i].getElementsByTagName('iframe')[0];
    const player = new Vimeo.Player(iframe);

    player.on('play', function() {
        swiper.slideTo(1);
        button.classList.replace('fa-play', 'fa-pause');
        button.classList.replace('paused', 'playing');
        buttonSpan.textContent = vimeoButtonPauseText;
        
    });
    player.on('pause', function() {
        button.classList.replace('fa-pause', 'fa-play');
        button.classList.replace('playing', 'paused');
        buttonSpan.textContent = vimeoButtonPlayText;
        swiper.slideTo(0);
    });
    player.getVideoTitle().then(function(title) {
        //console.log('title:', title);
    });

    button.addEventListener('click', function() {
        if(button.classList.contains('paused')) {
            player.play();
        }
        else {
            player.pause();
        }
    });
}
