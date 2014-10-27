var BaseStore = require('./BaseStore');
var ApplicationConstants = require('constants/ApplicationConstants');

var Speech = require('lib/Speech');

var Defaults = require('stores/Defaults');

var storeInstance;

var route = localStorage.route || 'lyrics';

var lyrics = localStorage.lyrics;
var parsedLyrics = [];
try {
  parsedLyrics = JSON.parse(localStorage.parsedLyrics);
} catch(e) {
  parsedLyrics = [];
}

var currentLyricIndex = -1;

class ExampleStore extends BaseStore {
  get lyrics() {
    return lyrics;
  }

  get parsedLyrics() {
    return parsedLyrics;
  }

  get route() {
    return route;
  }

  get currentLyricIndex() {
    return currentLyricIndex;
  }
}


var resetOffset = true;

var actions = {};

actions[ApplicationConstants.CHANGE_ROUTE] = action => {

  if (action.newRoute === 'timing') {
    parsedLyrics = lyrics.match(/[^\s]+/g).map(lyric => {
      return { 'lyric' : lyric };
    });
  } else if (action.newRoute === 'calibration') {
    parsedLyrics.forEach((lyric, index, lyricsArray) => {
      if (index === (lyricsArray.length - 1)) {
        return;
      }

      lyric.expectedDuration = (lyricsArray[index + 1]).timing - lyric.timing;
    });
  }

  route = action.newRoute;
  storeInstance.emitChange();
};

actions[ApplicationConstants.SAVE_TO_LOCAL] = () => {
  localStorage.lyrics = lyrics;
  localStorage.parsedLyrics = JSON.stringify(parsedLyrics);
  localStorage.route = route;
};

actions[ApplicationConstants.REVERT_TO_DEFAULT_SONG] = () => {
  lyrics = Defaults.lyrics;
  parsedLyrics = JSON.parse(Defaults.parsedLyrics);
  route = Defaults.route;

  storeInstance.emitChange();
};

actions[ApplicationConstants.PLAY_SONG] = () => {
  if (resetOffset) {
    currentLyricIndex = 0;
  }
  player.seekTo(0);
  player.playVideo();
  storeInstance.emitChange();
};

actions[ApplicationConstants.LYRICS_CHANGE] = action => {
  lyrics = action.newValue;
  storeInstance.emitChange();
};

actions[ApplicationConstants.LYRIC_TIMING_CHANGED] = () => {
  if (currentLyricIndex >= parsedLyrics.length) {
    return storeInstance.emitChange();
  }

  parsedLyrics[currentLyricIndex].timing = performance.now() - whenSongActuallyStarted;
  currentLyricIndex++;
  storeInstance.emitChange();
};

actions[ApplicationConstants.START_CALIBRATION] = () => {
  currentLyricIndex = 0;
  var calibrate = () => {
    Speech.calibrate(parsedLyrics[currentLyricIndex].lyric, time => {
      parsedLyrics[currentLyricIndex].normalDuration = time;
      storeInstance.emitChange();

      currentLyricIndex++;
      storeInstance.emitChange();
      if (currentLyricIndex >= parsedLyrics.length) {
        return;
      }

      calibrate();
    });
  };

  calibrate();
};

actions[ApplicationConstants.RAP_TO_ME] = action => {
  currentLyricIndex = 0;
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
    var currentLyric = parsedLyrics[currentLyricIndex];
    if (currentLyric.expectedDuration && (currentLyric.normalDuration > currentLyric.expectedDuration)) {
      rate = ((currentLyric.normalDuration * mysteriousFactor) / currentLyric.expectedDuration).toFixed(1);
      if (rate > 10) {
        rate = 10;
      }
    }

    debugging && console.log(currentLyric.lyric + ' ' + currentLyric.timing + ' ' + currentLyric.normalDuration + ' ' + currentLyric.expectedDuration + ' ' + rate);

    currentLyric.inTransit = true;
    Speech.rap(currentLyric.lyric, rate, (time) => {

      debugging && console.log('took ' + time + ' comp to ' + parsedLyrics[currentLyricIndex].expectedDuration);

      currentLyricIndex++;
      storeInstance.emitChange();
    });
  };

  var rapEventLoopInterval = setInterval(() => {

    if (currentLyricIndex >= parsedLyrics.length) {
      debugging && console.log('im done!');
      clearInterval(rapEventLoopInterval);
      return;
    }

    var currentLyric = parsedLyrics[currentLyricIndex];
    var now = performance.now();

    debugging && console.log('now - start', now - whenSongActuallyStarted);

    // while (((currentLyricIndex+1) < parsedLyrics.length) && ((parsedLyrics[currentLyricIndex+1].timing - offset) < (now - whenSongActuallyStarted))) {
    //   console.log('skipping ', parsedLyrics[currentLyricIndex]);
    //   ++currentLyricIndex;
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
};

storeInstance = new ExampleStore(actions);

module.exports = storeInstance;