var AppDispatcher = require('../AppDispatcher');
var ExampleConstants = require('constants/ExampleConstants');

var ExampleActions = {

  playSong : () => {
    AppDispatcher.handleViewAction({
      actionType : ExampleConstants.PLAY_SONG
    });
  },

  pauseSong : () => {
    AppDispatcher.handleViewAction({
      actionType : ExampleConstants.PAUSE_SONG
    });
  },

  stopSong : () => {
    AppDispatcher.handleViewAction({
      actionType : ExampleConstants.STOP_SONG
    });
  }

};

module.exports = ExampleActions;