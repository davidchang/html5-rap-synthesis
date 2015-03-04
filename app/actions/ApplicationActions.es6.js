var Reflux = require('reflux');
// exposing on the window for the youtube API to plug in to
module.exports = window.ApplicationActions = Reflux.createActions([
  'loadSavedSong',
  'saveIntoLocalStorage',
  'stopSong',

  // lyrics
  'changeVideo',
  'saveLyrics',

  // timing
  'startTiming',

  'lyricTimingTriggered',
  'crunchLyricDurations',

  // calibration
  'startCalibration',

  // rap
  'startRap',
  'publish'
]);