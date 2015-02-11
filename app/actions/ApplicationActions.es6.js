var Reflux = require('reflux');
module.exports = Reflux.createActions([
  'saveToLocalStorage',

  // lyrics
  'saveLyrics',

  // timing
  'startTiming',
  'lyricTimingTriggered',
  'crunchLyricDurations',

  // calibration
  'startCalibration',

  // rap
  'startRap'
]);