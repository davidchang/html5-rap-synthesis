var AppDispatcher = require('../AppDispatcher');
var ApplicationConstants = require('constants/ApplicationConstants');

var ExampleActions = {

  changeRoute : newRoute => {
    AppDispatcher.handleViewAction({
      actionType : ApplicationConstants.CHANGE_ROUTE,
      newRoute    : newRoute
    });
  },

  save : () => {
    AppDispatcher.handleViewAction({
      actionType : ApplicationConstants.SAVE_TO_LOCAL
    });
  },

  playSong : () => {
    AppDispatcher.handleViewAction({
      actionType : ApplicationConstants.PLAY_SONG
    });
  },

  pauseSong : () => {
    AppDispatcher.handleViewAction({
      actionType : ApplicationConstants.PAUSE_SONG
    });
  },

  stopSong : () => {
    AppDispatcher.handleViewAction({
      actionType : ApplicationConstants.STOP_SONG
    });
  },

  handleLyricsChange : event => {
    AppDispatcher.handleViewAction({
      actionType : ApplicationConstants.LYRICS_CHANGE,
      newValue   : event.target.value
    });
  },

  lyricTimingTriggered : () => {
    AppDispatcher.handleViewAction({
      actionType : ApplicationConstants.LYRIC_TIMING_CHANGED
    });
  },

  startCalibration : () => {
    AppDispatcher.handleViewAction({
      actionType : ApplicationConstants.START_CALIBRATION
    });
  }

};

module.exports = ExampleActions;