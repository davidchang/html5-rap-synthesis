var BaseStore = require('./BaseStore');
var ExampleConstants = require('constants/ExampleConstants');

var storeInstance;

var route = localStorage.route || 'lyrics';

var lyrics = localStorage.lyrics || '';
var parsedLyrics = [];

var currentTime = 0;
var performanceNowOffset = 0;

var playInterval;

class ExampleStore extends BaseStore {
  get currentTime() {
    return currentTime;
  }

  get lyrics() {
    return lyrics;
  }

  get parsedLyrics() {
    return parsedLyrics;
  }

  get route() {
    return route;
  }
}

var updateCurrentTime = () => {
  currentTime = performance.now() - performanceNowOffset;
  storeInstance.emitChange();
};

var parseLyrics = () => {
  parsedLyrics = lyrics.match(/[^\s]+/g);
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
  localStorage.parsedLyrics = parsedLyrics;
  localStorage.route = route;
};

actions[ExampleConstants.PLAY_SONG] = () => {
  if (resetOffset) {
    performanceNowOffset = performance.now();
  }
  player.playVideo();
  storeInstance.emitChange();

  playInterval = setInterval(updateCurrentTime, 100);
};

actions[ExampleConstants.PAUSE_SONG] = () => {
  player.pauseVideo();
  clearInterval(playInterval);
};

actions[ExampleConstants.STOP_SONG] = () => {
  player.stopVideo();
  clearInterval(playInterval);
};

actions[ExampleConstants.LYRICS_CHANGE] = action => {
  lyrics = action.newValue;
  storeInstance.emitChange();
};

storeInstance = new ExampleStore(actions);

module.exports = storeInstance;