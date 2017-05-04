$(function() {
    var AudioPlayer = function($audio) {
        var _this = this;
        this.$audio = $audio;
        this.audio = $audio.get(0);
        this.onTrackEndedListener = function() {};

        this.playbackRate = 1.5;

        this.$audio.on('ended.AudioPlayer', function() {
            console.log('ended.AudioPlayer');
            _this.onTrackEndedListener();
        });
    }

    /**
     * @param {string} articleId
     * @param {int} trackIndex
     */
    AudioPlayer.prototype.setSrc = function setSrc(articleId, trackIndex) {
        this.$audio.off('timeupdate.AudioPlayer');

        trackIndex++;
        var fileName = ('000' + trackIndex).slice(-3);
        var src = '../../audio/en/' + articleId + '/' + fileName + '.mp3';
        this.audio.src = src;
    };

    AudioPlayer.prototype.setAudioSrc = function setAudioSrc(src) {
        this.$audio.off('timeupdate.AudioPlayer');
        this.audio.src = src;
        var _this = this;
        this.$audio.on('canplaythrough.AudioPlayer', function() {
            // androidのwebviewでaudioの初期化フローの奇妙な動きで発生する問題を回避する
            //
            // durationが408.242のmp3を開いているのにcanplaythroughの段階でなぜかdurationが100を示す
            // その後、初回のsetCurrentTimeSec実行の後に再度durationchangeが発生して実際のdurationである408.242に変わる。
            // このときにcurrentTimeは408.242/100（=4.08）倍される
            // 例えば、１文目の頭出しで27.9秒にsetCurrentTimeSetした場合、4.08倍の113.832秒に変更される。
            // そうすると１度目のtimeupdateでplayDuration()のtoSecを超過するため、何も再生されずスキップされてしまう。
            //
            // ここでは実際のdurationをロードするために初期化と同時にsetCurrentTimeSec()している
            console.log(_this.audio.currentTime);
            _this.setCurrentTimeSec(1);
            console.log(_this.audio.currentTime);
            _this.$audio.off('canplaythrough.AudioPlayer')
        });
    };

    AudioPlayer.prototype.pause = function pause() {
        this.audio.pause();
    }
    
    /**
     * @param Number speed 0-2.0
     */
    AudioPlayer.prototype.setSpeed = function setSpeed(speed) {
        this.playbackRate = speed;
        this.audio.playbackRate = speed;
    }
    
    /**
     * @param Number volume 0-1.0
     */
    AudioPlayer.prototype.setVolume = function setVolume(volume) {
        this.audio.volume = volume;
    }

    AudioPlayer.prototype.play = function play() {
        this.audio.playbackRate = this.playbackRate;
        console.log(this.audio.duration);
        this.audio.play();
    };

    AudioPlayer.prototype.playDuration = function playDuration(fromSec, toSec) {
        this.$audio.off('timeupdate.AudioPlayer');

        this.audio.playbackRate = this.playbackRate;

        // validation
        if (!(fromSec === 0 || Number(fromSec) > 0)) {
            throw new Error('fromSecが正しい数値でない:' + fromSec);
        }
        if (!(toSec === 0 || Number(toSec) > 0)) {
            throw new Error('toSecが正しい数値でない:' + toSec);
        }
        var minDurationSec = 1;
        if (fromSec >= toSec) {
            throw new Error('fromがtoより大きい:' + fromSec + ':' + toSec);
        }

        // 開始
        console.log(this.audio.paused);
        this.setCurrentTimeSec(fromSec);
        console.log(this.audio.paused);
        this.play();
        console.log(this.audio.paused);
        this.stopTo(toSec);
        console.log(this.audio.paused);
    };

    AudioPlayer.prototype.stopTo = function stopTo(toSec) {
        var _this = this;
            console.log([_this.audio.currentTime, toSec]);
        this.$audio.on('timeupdate.AudioPlayer', $.throttle(50, function() {
            console.log([_this.audio.currentTime, toSec]);
            if (_this.audio.currentTime >= toSec) {
                $(this).off('timeupdate.AudioPlayer');
                _this.pause();
                _this.onTrackEndedListener();
            }
//            _this.onTimeupdateListener.call(_this, toSec);
        }));
    };

//    AudioPlayer.prototype.onTimeupdateListener = function onTimeupdateListener(toSec) {
//    };

    AudioPlayer.prototype.pause = function pause() {
        this.audio.pause();
    };

    AudioPlayer.prototype.setCurrentTimeSec = function setCurrentTimeSec(sec) {
        console.log("setCurrentTimeSec:" + sec);
        this.audio.currentTime = sec;
    };

    /**
     * @param {function} onTrackEndedListener
     */
    AudioPlayer.prototype.setOnTrackEndedListener = function setOnTrackEndedListener(onTrackEndedListener) {
        this.onTrackEndedListener = onTrackEndedListener;
    };

    window.sri = window.sri || {};
    window.sri.AudioPlayer = AudioPlayer;
});