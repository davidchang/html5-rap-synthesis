var Reflux = require('reflux');
var _ = require('lodash');

var Speech = require('lib/Speech');
var Firebase = require('lib/firebaseConnection');

var actions = require('actions/ApplicationActions');

var calibrationPausedLyricIndex;

var videoSpeed;
var rapEventLoopInterval;

module.exports = Reflux.createStore({
  listenables: actions,
  init: function() {
    this.videoId = localStorage.videoId || '';
    this.lyrics = localStorage.lyrics || '';
    this.parsedLyrics = JSON.parse(localStorage.parsedLyrics) || [];

    this.currentLyricIndex = -1;
    this.miscData = {};

    // enum, between stopped and playing
    this.status = 'stopped';

    if (this.videoId) {
      var playerDefinedInterval = setInterval(() => {
        if (!_.isUndefined(player) && _.isFunction(player.loadVideoById)) {
          actions.changeVideo(this.videoId);
          clearInterval(playerDefinedInterval);
        }
      }, 200);
    }
  },

  onLoadSavedSong : function(savedSongId) {
    Firebase.child(`raps/${savedSongId}`).once('value', dataSnapshot => {
      var data = dataSnapshot.val();
      if (data) {
        this.lyrics = data.lyrics;
        this.parsedLyrics = data.parsedLyrics;
        this.videoId = data.videoId;

        actions.changeVideo(this.videoId);
      }
    }, console.error);
  },

  onSaveIntoLocalStorage : function() {
    localStorage.videoId = this.videoId;
    localStorage.lyrics = this.lyrics;
    localStorage.parsedLyrics = JSON.stringify(this.parsedLyrics);
  },

  onChangeVideo : function(videoId) {
    this.videoId = videoId;
    player.loadVideoById(videoId);
    player.pauseVideo();

    this.emitChange();
  },

  onSaveLyrics : function(lyrics) {
    this.lyrics = lyrics;
    this.parsedLyrics = this.lyrics.match(/[^\s]+/g).map(lyric => ({ lyric }));
    this.emitChange();
  },

  onStopSong : function() {
    player.stopVideo();
    player.seekTo(0);
    clearInterval(rapEventLoopInterval);
    this.status = 'stopped';
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

    this.status = 'playing';

    this.emitChange();
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

    var calibrationCache = {};

    var calibrate = () => {
      if (this.status === 'stopped') {
        calibrationPausedLyricIndex = this.currentLyricIndex;
        this.currentLyricIndex = -1;
        this.emitChange();
        return;
      }

      var goToNext = () => {
        this.currentLyricIndex++;
        this.emitChange();
        if (this.currentLyricIndex >= this.parsedLyrics.length) {
          return;
        }
        calibrate();
      };

      var lyric = this.parsedLyrics[this.currentLyricIndex].lyric;

      if (calibrationCache[lyric.toLowerCase()]) {
        _.extend(this.parsedLyrics[this.currentLyricIndex], calibrationCache[lyric.toLowerCase()]);
        return goToNext();
      }

      Speech.calibrate(lyric, timings => {
        calibrationCache[lyric.toLowerCase()] = timings;
        _.extend(this.parsedLyrics[this.currentLyricIndex], timings);
        goToNext();
      });
    };

    this.status = 'playing';
    this.currentLyricIndex = calibrationPausedLyricIndex || 0;
    this.emitChange();

    calibrate();
  },

  onStartRap : function() {
    this.currentLyricIndex = 0;
    this.parsedLyrics.forEach(lyric => {
      lyric.inTransit = false;
    });

    var offset = 30; //milliseconds

    var debugging = true;

    // numbers > 1 will artificially inflate
    var mysteriousFactor = 2;

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

    var startRapInterval = () => {
      rapEventLoopInterval = setInterval(() => {

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
    };

    this.status = 'playing';
    this.emitChange();

    // just going to say the first word to prime speechSynthesis (or else it may be like a 2 second gap)
    Speech.rap({ text : this.parsedLyrics[0].lyric, volume : 0 }, () => {
      player.seekTo(0);
      player.setPlaybackRate(1);
      player.playVideo();

      setTimeout(startRapInterval, 1000);
    });
  },

  onPublish : function() {
    var newRapRef = Firebase.child('raps').push();
    newRapRef.set({
      'lyrics'       : this.lyrics,
      'parsedLyrics' : this.parsedLyrics,
      'videoId'      : this.videoId
    }, (err) => {

      if (err) {
        // didn't work!
        this.miscData = { err : err };
        this.emitChange('publishError');
        return;
      }

      // something like https://rap-synthesis.firebaseio.com/raps/-JjY3_U_zXvytVLtCpyf
      var url = newRapRef.toString();
      var redirectKey = url.substring(url.lastIndexOf('/') + 1);

      // did work! want to redirect
      this.miscData = { key : redirectKey };
      this.emitChange('publishSuccess');
    });
  },

  getExposedData : function() {
    return {
      'lyrics'            : this.lyrics,
      'status'            : this.status,
      'parsedLyrics'      : this.parsedLyrics,
      'currentLyricIndex' : this.currentLyricIndex,
      'videoId'           : this.videoId,
      'miscData'          : this.miscData
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
