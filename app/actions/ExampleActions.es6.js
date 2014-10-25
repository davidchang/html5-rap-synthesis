var AppDispatcher = require('../AppDispatcher');
var ExampleConstants = require('constants/ExampleConstants');

var ExampleActions = {

  changeRoute : newRoute => {
    AppDispatcher.handleViewAction({
      actionType : ExampleConstants.CHANGE_ROUTE,
      newRoute    : newRoute
    });
  },

  save : () => {
    AppDispatcher.handleViewAction({
      actionType : ExampleConstants.SAVE_TO_LOCAL
    });
  },

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
  },

  handleLyricsChange : event => {
    AppDispatcher.handleViewAction({
      actionType : ExampleConstants.LYRICS_CHANGE,
      newValue   : event.target.value
    });
  }

};

module.exports = ExampleActions;