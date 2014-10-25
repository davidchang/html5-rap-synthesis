var BaseStore = require('./BaseStore');
var ExampleConstants = require('constants/ExampleConstants');

var storeInstance;

var currentTime = 0;
var performanceNowOffset = 0;

var playInterval;

class ExampleStore extends BaseStore {
  get currentTime() {
    return currentTime;
  }
}

var updateCurrentTime = () => {
  currentTime = performance.now() - performanceNowOffset;
  storeInstance.emitChange();
};

var actions = {};

actions[ExampleConstants.PLAY_SONG] = action => {
  performanceNowOffset = performance.now();
  player.playVideo();
  storeInstance.emitChange();

  playInterval = setInterval(updateCurrentTime, 100);
};

actions[ExampleConstants.PAUSE_SONG] = action => {
  player.pauseVideo();
};

actions[ExampleConstants.STOP_SONG] = action => {
  player.stopVideo();
  clearInterval(playInterval);
};

storeInstance = new ExampleStore(actions);

module.exports = storeInstance;