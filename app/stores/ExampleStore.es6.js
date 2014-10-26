var BaseStore = require('./BaseStore');
var ExampleConstants = require('constants/ExampleConstants');

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

var playInterval;

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

var parseLyrics = () => {
  parsedLyrics = lyrics.match(/[^\s]+/g).map(lyric => {
    return { 'lyric' : lyric };
  });

  console.log('parsedLyrics', parsedLyrics);
};

var resetOffset = true;

var actions = {};

actions[ExampleConstants.CHANGE_ROUTE] = action => {

  if (action.newRoute === 'timing') {
    parseLyrics();
  }

  route = action.newRoute;
  storeInstance.emitChange();
};

actions[ExampleConstants.SAVE_TO_LOCAL] = () => {
  localStorage.lyrics = lyrics;
  localStorage.parsedLyrics = JSON.stringify(parsedLyrics);
  localStorage.route = route;
};

actions[ExampleConstants.PLAY_SONG] = () => {
  if (resetOffset) {
    performanceNowOffset = performance.now();
  }
  player.playVideo();
  storeInstance.emitChange();
};

actions[ExampleConstants.PAUSE_SONG] = () => {
  player.pauseVideo();
};

actions[ExampleConstants.STOP_SONG] = () => {
  player.stopVideo();
};

actions[ExampleConstants.LYRICS_CHANGE] = action => {
  lyrics = action.newValue;
  storeInstance.emitChange();
};

actions[ExampleConstants.LYRIC_TIMING_CHANGED] = () => {
  if (currentLyricIndex >= parsedLyrics.length) {
    return storeInstance.emitChange();
  }

  parsedLyrics[currentLyricIndex].timing = performance.now() - performanceNowOffset;
  currentLyricIndex++;
  storeInstance.emitChange();
};

storeInstance = new ExampleStore(actions);

module.exports = storeInstance;