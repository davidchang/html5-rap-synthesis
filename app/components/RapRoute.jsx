var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var _ = require('lodash');

var ApplicationStore = require('stores/ApplicationStore');
var ApplicationActions = require('actions/ApplicationActions');

var CalibratedLyricsTable = require('components/CalibratedLyricsTable');

var RapRoute = React.createClass({

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

  _goToCalibration : function() {
    if (!this.state.savedSong) {
      this.transitionTo('calibration');
    } else {
      this.transitionTo('savedSongCalibration', this.getParams());
    }
  },

  _toggleStatus : function() {
    if (this.state.status === 'playing') {
      ApplicationActions.stopRap();
    } else {
      ApplicationActions.startRap();
    }
  },

  render : function() {

    var publishButton = '';
    if (!this.state.savedSong) {
      publishButton = (
        <button
          type="button"
          className="btn btn-primary pull-right"
          onClick={ApplicationActions.publish}>
          Publish
        </button>
      );
    }

    return (
      <section className="clearfix">
        <h1>Step 4. Finished Rap</h1>

        <section className="space">
          <button
            type="button"
            className="btn btn-default"
            onClick={this._toggleStatus}>
            {this.state.status === 'playing' ? 'Stop Rapping' : 'Start Rapping'}
          </button>
        </section>

        <CalibratedLyricsTable
          mode="rap"
          parsedLyrics={this.state.parsedLyrics}
          currentLyricIndex={this.state.currentLyricIndex} />

        <button
          type="button"
          className="btn btn-primary pull-left"
          onClick={this._goToCalibration}>
          {this.state.savedSong ? 'Go Back to Calibration' : 'Step 3. Calibration.'}
        </button>

        {publishButton}
      </section>
    );
  }

});

module.exports = RapRoute;