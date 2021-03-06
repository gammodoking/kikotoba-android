var test = {};
$(function() {
    var ListeningTest = function() {
    };

    // ############ オーディオ
    ListeningTest.prototype.execAll = function execAll() {
        this.testBuildArticle();
        this.testAudio();
    };
    
    ListeningTest.prototype.testBuildArticle = function testBuildArticle() {
        web.addSentence('aaa', 1, 2, 1);
        web.addSentence('bbb', 2, 4, 2);
        web.addSentence('ccc', 4, 6, 2);
        web.flushParagraph();
        web.addSentence('ddd', 7, 10, 3);
        web.addSentence('eee', 11, 14, 4);
        web.addSentence('fff', 15, 18, 5);
        web.flushParagraph();
        
        web.setPhotoSrc('https://gdb.voanews.com/E5D3FE73-172C-4B29-A3BF-8A01452547AE_cx0_cy13_cw0_w250_r1_s.jpg');
        web.setTitle('title');
        web.setSubTitle('sub title');
        
        web.popup('sadf');
        web.popup();
        
        web.setCurrentSentenceIndex(0);
    };

    ListeningTest.prototype.testAudio = function testAudio(src) {
        web.setAudioSrc(src);
        web.setVolume(0.1);
        web.setSpeed(0.8);
        web.play();
    };

    ListeningTest.prototype.buildControls = function(src) {
        var audio = $('audio').get(0);
        audio.volume = 0.8;
        audio.playbackRate = 0.8;
        audio.src = src;

        var $audio = $('audio');
        $audio.css('width', '100%')
                .attr('controls', 'controls');
        var $play = $('<button>再生</button>').on('click', function(){audio.play()});
        var $pause = $('<button>停止</button>').on('click', function(){audio.pause()});
        var $back = $('<button>1秒戻る</button>').on('click', function(){
                audio.currentTime = audio.currentTime - 1;
                audio.play();
            });
        var $backHalf = $('<button>0.3秒戻る</button>').on('click', function(){
                audio.currentTime = audio.currentTime - 0.3;
                audio.pause();
            });
        var $toSeconds = $('<input type="text"></div>');
        var $jamp = $('<button>ジャンプ</button>').on('click', function(){
                audio.currentTime = $toSeconds.val();
            });
        var $seconds = $('<input type="text"></div>');
        $audio
            .after($toSeconds)
            .after($jamp)
            .after($play)
            .after($back)
            .after($pause)
            .after($seconds)
            .on('timeupdate', $.throttle(20, function(){
                var sec = Math.round(audio.currentTime * 10)/10;
                $seconds.val(sec);
            }));


$('audio').on('abort', function(){console.log('abort')});
$('audio').on('canplay', function(){console.log('canplay')});
$('audio').on('canplaythrough', function(){console.log('canplaythrough')});
$('audio').on('durationchange', function(){console.log('durationchange:' + this.duration)});
$('audio').on('emptied', function(){console.log('emptied')});
$('audio').on('encrypted ', function(){console.log('encrypted ')});
$('audio').on('ended', function(){console.log('ended')});
$('audio').on('error', function(){console.log('error')});
$('audio').on('interruptbegin', function(){console.log('interruptbegin')});
$('audio').on('interruptend', function(){console.log('interruptend')});
$('audio').on('loadeddata', function(){console.log('loadeddata')});
$('audio').on('loadedmetadata', function(){console.log('loadedmetadata')});
$('audio').on('loadstart', function(){console.log('loadstart')});
$('audio').on('mozaudioavailable', function(){console.log('mozaudioavailable')});
$('audio').on('pause', function(){console.log('pause')});
$('audio').on('play', function(){console.log('play')});
$('audio').on('playing', function(){console.log('playing')});
$('audio').on('progress', function(){console.log('progress')});
$('audio').on('ratechange', function(){console.log('ratechange')});
$('audio').on('seeked', function(){console.log('seeked')});
$('audio').on('seeking', function(){console.log('seeking')});
$('audio').on('stalled', function(){console.log('stalled')});
$('audio').on('suspend', function(){console.log('suspend')});
$('audio').on('timeupdate', function(){console.log('timeupdate')});
$('audio').on('volumechange', function(){console.log('volumechange')});
$('audio').on('waiting', function(){console.log('waiting')});

    }

    window.test = new ListeningTest();
});
