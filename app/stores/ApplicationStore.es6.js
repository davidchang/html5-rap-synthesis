var Reflux = require('reflux');
var _ = require('lodash');

var Speech = require('lib/Speech');
var Defaults = require('stores/Defaults');

var actions = require('actions/ApplicationActions');

var videoSpeed;

module.exports = Reflux.createStore({
  listenables: actions,
  init: function() {
    this.lyrics = localStorage.lyrics;
    try {
      this.parsedLyrics = JSON.parse(localStorage.parsedLyrics);
    } catch(e) {
      this.parsedLyrics = [];
    }

    this.currentLyricIndex = -1;
  },

  onSaveLyrics : function(lyrics) {
    this.lyrics = lyrics;
    this.parsedLyrics = this.lyrics.match(/[^\s]+/g).map(lyric => ({ 'lyric' : lyric }));
  },

  onSaveToLocalStorage : function() {
    localStorage.lyrics = this.lyrics;
    localStorage.parsedLyrics = JSON.stringify(this.parsedLyrics);
  },

  onRevertToDefaultSong : function() {
    this.lyrics = Defaults.lyrics;
    this.parsedLyrics = JSON.parse(Defaults.parsedLyrics);

    this.emitChange();
  },

  onStartTiming : function(speed) {
    videoSpeed = speed;
    this.currentLyricIndex = 0;
    player.seekTo(0);
    // TODO this should probably be configurable
    // "Playback rates may include values like 0.25, 0.5, 1, 1.5, and 2."
    // https://developers.google.com/youtube/js_api_reference
    player.setPlaybackRate(speed);
    player.playVideo();

    this.emitChange();
  },

  onStopTiming : function() {
    player.stopVideo();
  },

  onLyricTimingTriggered : function() {
    if (this.currentLyricIndex >= this.parsedLyrics.length) {
      return this.emitChange();
    }

    this.parsedLyrics[this.currentLyricIndex].youtubeTiming = player.getCurrentTime();
    this.parsedLyrics[this.currentLyricIndex].timing = (performance.now() - whenSongActuallyStarted) * videoSpeed;
    this.currentLyricIndex++;

    this.emitChange();
  },

  onCrunchLyricDurations : function() {
    this.parsedLyrics.forEach((lyric, index, lyricsArray) => {
      if (index === (lyricsArray.length - 1)) {
        return;
      }

      lyric.expectedDuration = (lyricsArray[index + 1]).timing - lyric.timing;
    });
    this.emitChange();
  },

  onStartCalibration : function() {
    this.currentLyricIndex = 0;
    var calibrate = () => {
      Speech.calibrate(this.parsedLyrics[this.currentLyricIndex].lyric, timings => {
        _.extend(this.parsedLyrics[this.currentLyricIndex], timings);

        this.currentLyricIndex++;

        this.emitChange();

        if (this.currentLyricIndex >= this.parsedLyrics.length) {
          return;
        }

        calibrate();
      });
    };

    calibrate();
  },

  onStartRap : function(options) {
    this.currentLyricIndex = 0;
    this.parsedLyrics.forEach(lyric => {
      lyric.inTransit = false;
    });

    var offset = 30; //milliseconds

    var debugging = true;

    // numbers > 1 will artificially inflate
    var mysteriousFactor = 2; //1.5;

    var rap = () => {
      var rate = 1;
      var currentLyric = this.parsedLyrics[this.currentLyricIndex];

      // figure out the rate, must be capped at 10 (as rate between 0.1 and 10)
      if (currentLyric.expectedDuration && (currentLyric.normalDuration > currentLyric.expectedDuration)) {
        rate = ((currentLyric.normalDuration * mysteriousFactor) / currentLyric.expectedDuration).toFixed(1);
        if (rate > 10) {
          rate = 10;
        }
      }

      debugging && console.log(currentLyric.lyric + ' ' + currentLyric.timing + ' ' + currentLyric.normalDuration + ' ' + currentLyric.expectedDuration + ' ' + rate);

      currentLyric.inTransit = true;
      Speech.rap({ text : currentLyric.lyric, rate }, timing => {

        _.extend(this.parsedLyrics[this.currentLyricIndex], {
          rate,
          actualDuration : timing.normalDuration,
          actualLatencyToStart : timing.expectedLatencyToStart
        });

        this.currentLyricIndex++;
        this.emitChange();
      });
    };

    var rapEventLoopInterval = setInterval(() => {

      if (this.currentLyricIndex >= this.parsedLyrics.length) {
        debugging && console.log('im done!');
        clearInterval(rapEventLoopInterval);
        return;
      }

      var currentLyric = this.parsedLyrics[this.currentLyricIndex];
      var now = performance.now();

      var youtubeTiming = player.getCurrentTime();
      var timing = now - whenSongActuallyStarted;

      // while (((this.currentLyricIndex+1) < this.parsedLyrics.length) && ((this.parsedLyrics[this.currentLyricIndex+1].timing - offset) < (now - whenSongActuallyStarted))) {
      //   console.log('skipping ', this.parsedLyrics[this.currentLyricIndex]);
      //   ++this.currentLyricIndex;
      // }

      if (!currentLyric.inTransit && ((currentLyric.timing - offset) < timing)) {
        currentLyric.eventLoopTiming = timing;
        rap();
      }
    }, Math.floor(Math.random() * (11)) + 10); // random number between 10 and 20

    if (options.withSong) {
      // just going to say the first word to prime speechSynthesis (or else it may be like a 2 second gap)
      Speech.rap({ text : this.parsedLyrics[0].lyric, volume : 0 }, () => {
        player.seekTo(0);
        player.setPlaybackRate(1);
        player.playVideo();
      });
    }
  },

  getExposedData : function() {
    return {
      'lyrics' : this.lyrics,
      'parsedLyrics' : this.parsedLyrics,
      'currentLyricIndex' : this.currentLyricIndex
    };
  },

  emitChange : function(status) {
    var expose = this.getExposedData();

    if (status) {
      expose._status = status;
    }

    this.trigger(expose);
  }

});
