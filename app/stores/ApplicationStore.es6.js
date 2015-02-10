var Reflux = require('reflux');
var Speech = require('lib/Speech');
var Defaults = require('stores/Defaults');

var actions = require('actions/ApplicationActions');

// TODO: handleLyricsChange

// TODO: what is this resetOffset?
var resetOffset = true;

module.exports = Reflux.createStore({
  listenables: actions,
  init: function() {
    this.route = localStorage.route || 'lyrics';
    this.lyrics = localStorage.lyrics;
    try {
      this.parsedLyrics = JSON.parse(localStorage.parsedLyrics);
    } catch(e) {
      this.parsedLyrics = [];
    }

    this.currentLyricIndex = -1;
  },

  onChangeRoute : function(action) {
    if (action.newRoute === 'timing') {
      this.parsedLyrics = this.lyrics.match(/[^\s]+/g).map(lyric => {
        return { 'lyric' : lyric };
      });
    } else if (action.newRoute === 'calibration') {
      this.parsedLyrics.forEach((lyric, index, lyricsArray) => {
        if (index === (lyricsArray.length - 1)) {
          return;
        }

        lyric.expectedDuration = (lyricsArray[index + 1]).timing - lyric.timing;
      });
    }
  },

  saveToLocal : function() {
    localStorage.lyrics = this.lyrics;
    localStorage.parsedLyrics = JSON.stringify(this.parsedLyrics);
    localStorage.route = this.route;
  },

  onRevertToDefaultSong : function() {
    this.lyrics = Defaults.lyrics;
    this.parsedLyrics = JSON.parse(Defaults.parsedLyrics);
    this.route = Defaults.route;

    this.emitChange();
  },

  onPlaySong : function() {
    if (resetOffset) {
      this.currentLyricIndex = 0;
    }
    player.seekTo(0);
    player.playVideo();

    this.emitChange();
  },

  onLyricTimingTriggered : function() {
    if (this.currentLyricIndex >= parsedLyrics.length) {
      return storeInstance.emitChange();
    }

    parsedLyrics[this.currentLyricIndex].timing = performance.now() - whenSongActuallyStarted;
    this.currentLyricIndex++;
    this.emitChange();
  },

  onStartCalibration : function() {
    this.currentLyricIndex = 0;
    var calibrate = () => {
      Speech.calibrate(parsedLyrics[this.currentLyricIndex].lyric, time => {
        parsedLyrics[this.currentLyricIndex].normalDuration = time;
        storeInstance.emitChange();

        this.currentLyricIndex++;
        storeInstance.emitChange();
        if (this.currentLyricIndex >= parsedLyrics.length) {
          return;
        }

        calibrate();
      });
    };

    calibrate();
  },

  onRapToMe : function() {
    this.currentLyricIndex = 0;
    parsedLyrics.forEach(lyric => {
      lyric.inTransit = false;
    });

    var offset = -750; //action.offset || 0;
    if (!action.withSong) {
      offset = parsedLyrics[0].timing - 1000;
    }
    var whenSongActuallyStarted = performance.now();

    var debugging = false;

    var mysteriousFactor = 1.5;

    var rap = () => {
      var rate = 1;
      var currentLyric = parsedLyrics[this.currentLyricIndex];
      if (currentLyric.expectedDuration && (currentLyric.normalDuration > currentLyric.expectedDuration)) {
        rate = ((currentLyric.normalDuration * mysteriousFactor) / currentLyric.expectedDuration).toFixed(1);
        if (rate > 10) {
          rate = 10;
        }
      }

      debugging && console.log(currentLyric.lyric + ' ' + currentLyric.timing + ' ' + currentLyric.normalDuration + ' ' + currentLyric.expectedDuration + ' ' + rate);

      currentLyric.inTransit = true;
      Speech.rap(currentLyric.lyric, rate, (time) => {

        debugging && console.log('took ' + time + ' comp to ' + parsedLyrics[this.currentLyricIndex].expectedDuration);

        this.currentLyricIndex++;
        storeInstance.emitChange();
      });
    };

    var rapEventLoopInterval = setInterval(() => {

      if (this.currentLyricIndex >= parsedLyrics.length) {
        debugging && console.log('im done!');
        clearInterval(rapEventLoopInterval);
        return;
      }

      var currentLyric = parsedLyrics[this.currentLyricIndex];
      var now = performance.now();

      debugging && console.log('now - start', now - whenSongActuallyStarted);

      // while (((this.currentLyricIndex+1) < parsedLyrics.length) && ((parsedLyrics[this.currentLyricIndex+1].timing - offset) < (now - whenSongActuallyStarted))) {
      //   console.log('skipping ', parsedLyrics[this.currentLyricIndex]);
      //   ++this.currentLyricIndex;
      // }

      if (!currentLyric.inTransit && (currentLyric.timing - offset) < (now - whenSongActuallyStarted)) {
        debugging && console.log('word', currentLyric.lyric);
        rap();
      }
    }, 100);

    if (action.withSong) {
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
