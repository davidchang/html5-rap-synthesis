var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');

var ApplicationStore = require('stores/ApplicationStore');
var ApplicationActions = require('actions/ApplicationActions');

var CalibratedLyricsTable = require('components/CalibratedLyricsTable');

var CalibrationRoute = React.createClass({

  mixins : [
    Router.Navigation,
    Reflux.connect(ApplicationStore)
  ],

  getInitialState : function() {
    return ApplicationStore.getExposedData();
  },

  _goToTiming : function() {
    this.transitionTo('timing');
  },

  _goToRap : function() {
    this.transitionTo('rap');
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
              onClick={ApplicationActions.startCalibration}>
              Start calibration
            </button>
          </div>
        </section>

        <CalibratedLyricsTable
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