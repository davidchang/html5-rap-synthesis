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

  revertToDefaultSong : () => {
    AppDispatcher.handleViewAction({
      actionType : ApplicationConstants.REVERT_TO_DEFAULT_SONG
    });
  },

  playSong : () => {
    AppDispatcher.handleViewAction({
      actionType : ApplicationConstants.PLAY_SONG
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
  },

  rapToMe : options => {
    options.actionType = ApplicationConstants.RAP_TO_ME;
    AppDispatcher.handleViewAction(options);
  }

};

module.exports = ExampleActions;