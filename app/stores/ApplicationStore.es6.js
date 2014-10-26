var BaseStore = require('./BaseStore');
var ApplicationConstants = require('constants/ApplicationConstants');

var Speech = require('lib/Speech');

var storeInstance;

var route = localStorage.route || 'lyrics';

var lyrics = localStorage.lyrics || '';
var parsedLyrics = [];
try {
  parsedLyrics = JSON.parse(localStorage.parsedLyrics);
} catch(e) {
  parsedLyrics = [];
}

var performanceNowOffset = 0;
var currentLyricIndex = 0;

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

actions[ApplicationConstants.PLAY_SONG] = () => {
  if (resetOffset) {
    performanceNowOffset = performance.now();
    currentLyricIndex = 0;
  }
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

  parsedLyrics[currentLyricIndex].timing = performance.now() - performanceNowOffset;
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
      if (currentLyricIndex >= parsedLyrics.length) {
        return;
      }

      calibrate();
    });
  };

  calibrate();
};

actions[ApplicationConstants.RAP_TO_ME] = () => {
  currentLyricIndex = 0;

  var debugging = false;

  var rap = () => {
    var rate = 1;
    var current = parsedLyrics[currentLyricIndex];
    if (!current.expectedDuration || (current.normalDuration > current.expectedDuration)) {
      rate = (current.normalDuration / current.expectedDuration).toFixed(1);
      if (rate > 10) {
        rate = 10;
      }
    }

    debugging && console.log(current.lyric + ' ' + current.normalDuration + ' ' + current.expectedDuration + ' ' + rate);

    Speech.rap(current.lyric, rate, (time) => {

      debugging && console.log('took ' + time);

      currentLyricIndex++;
      if (currentLyricIndex >= parsedLyrics.length) {
        return;
      }

      rap();
    });
  };

  rap();
};

storeInstance = new ExampleStore(actions);

module.exports = storeInstance;