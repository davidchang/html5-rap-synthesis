var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');

var ApplicationStore = require('stores/ApplicationStore');
var ApplicationActions = require('actions/ApplicationActions');

var CalibratedLyricsTable = require('components/CalibratedLyricsTable');

var CalibrationRoute = React.createClass({

  statics : {
    willTransitionFrom : function() {
      ApplicationActions.saveIntoLocalStorage();
      ApplicationActions.stopSong();
    }
  },

  mixins : [
    Router.Navigation,
    Router.State,
    Reflux.connect(ApplicationStore)
  ],

  getInitialState : function() {
    return _.extend(ApplicationStore.getExposedData(), {
      savedSong : !_.isUndefined(this.getParams().savedSongId)
    });
  },

  _goToTiming : function() {
    if (!this.state.savedSong) {
      this.transitionTo('timing');
    } else {
      this.transitionTo('savedSongTiming', this.getParams());
    }
  },

  _goToRap : function() {
    if (!this.state.savedSong) {
      this.transitionTo('rap');
    } else {
      this.transitionTo('savedSongRap', this.getParams());
    }
  },

  _toggleCalibrationStatus : function() {
    ApplicationActions[this.state.status === 'playing' ? 'stopSong' : 'startCalibration']();
  },

  render : function() {

    return (
      <section className="clearfix">
        <h1>Step 3. Calibration</h1>

        <section>
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-default"
              onClick={this._toggleCalibrationStatus}>
              {this.state.status === 'playing' ? 'Stop calibration' : 'Start calibration'}
            </button>
          </div>
        </section>

        <CalibratedLyricsTable
          mode="calibration"
          parsedLyrics={this.state.parsedLyrics}
          currentLyricIndex={this.state.currentLyricIndex} />

        <button
          type="button"
          className="btn btn-primary pull-left"
          onClick={this._goToTiming}>
          Step 2. Timing.
        </button>

        <button
          type="button"
          className="btn btn-primary pull-right"
          onClick={this._goToRap}>
          Step 4. Rap.
        </button>

      </section>
    );
  }

});

module.exports = CalibrationRoute;