var Reflux = require('reflux');
var Speech = require('lib/Speech');
var Defaults = require('stores/Defaults');

var actions = require('actions/ApplicationActions');

// TODO: what is this resetOffset?
var resetOffset = true;

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

  onStartTiming : function() {
    if (resetOffset) {
      this.currentLyricIndex = 0;
    }
    player.seekTo(0);
    player.playVideo();

    this.emitChange();
  },

  onLyricTimingTriggered : function() {
    if (this.currentLyricIndex >= this.parsedLyrics.length) {
      return this.emitChange();
    }

    this.parsedLyrics[this.currentLyricIndex].timing = performance.now() - whenSongActuallyStarted;
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
  },

  onStartCalibration : function() {
    this.currentLyricIndex = 0;
    var calibrate = () => {
      Speech.calibrate(this.parsedLyrics[this.currentLyricIndex].lyric, time => {
        this.parsedLyrics[this.currentLyricIndex].normalDuration = time;
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

    var offset = -750; //options.offset || 0;
    if (!options.withSong) {
      offset = this.parsedLyrics[0].timing - 1000;
    }
    var whenSongActuallyStarted = performance.now();

    var debugging = false;

    var mysteriousFactor = 1.5;

    var rap = () => {
      var rate = 1;
      var currentLyric = this.parsedLyrics[this.currentLyricIndex];
      if (currentLyric.expectedDuration && (currentLyric.normalDuration > currentLyric.expectedDuration)) {
        rate = ((currentLyric.normalDuration * mysteriousFactor) / currentLyric.expectedDuration).toFixed(1);
        if (rate > 10) {
          rate = 10;
        }
      }

      debugging && console.log(currentLyric.lyric + ' ' + currentLyric.timing + ' ' + currentLyric.normalDuration + ' ' + currentLyric.expectedDuration + ' ' + rate);

      currentLyric.inTransit = true;
      Speech.rap(currentLyric.lyric, rate, (time) => {

        debugging && console.log('took ' + time + ' comp to ' + this.parsedLyrics[this.currentLyricIndex].expectedDuration);

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

      debugging && console.log('now - start', now - whenSongActuallyStarted);

      // while (((this.currentLyricIndex+1) < this.parsedLyrics.length) && ((this.parsedLyrics[this.currentLyricIndex+1].timing - offset) < (now - whenSongActuallyStarted))) {
      //   console.log('skipping ', this.parsedLyrics[this.currentLyricIndex]);
      //   ++this.currentLyricIndex;
      // }

      if (!currentLyric.inTransit && (currentLyric.timing - offset) < (now - whenSongActuallyStarted)) {
        debugging && console.log('word', currentLyric.lyric);
        rap();
      }
    }, 100);

    if (options.withSong) {
      player.seekTo(0);
      player.playVideo();
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
