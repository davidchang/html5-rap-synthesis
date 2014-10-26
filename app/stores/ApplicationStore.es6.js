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

actions[ApplicationConstants.PAUSE_SONG] = () => {
  player.pauseVideo();
};

actions[ApplicationConstants.STOP_SONG] = () => {
  player.stopVideo();
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
  var speak = () => {
      Speech.speak(parsedLyrics[currentLyricIndex].lyric, time => {
      parsedLyrics[currentLyricIndex].normalDuration = time;
      storeInstance.emitChange();

      currentLyricIndex++;
      if (currentLyricIndex >= parsedLyrics.length) {
        return;
      }

      speak();
    });
  };

  speak();
};

storeInstance = new ExampleStore(actions);

module.exports = storeInstance;