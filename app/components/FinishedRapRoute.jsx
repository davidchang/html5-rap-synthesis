var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');

var ApplicationStore = require('stores/ApplicationStore');
var ApplicationActions = require('actions/ApplicationActions');

var CalibratedLyricsTable = require('components/CalibratedLyricsTable');

var RapRoute = React.createClass({

  mixins : [
    Router.Navigation,
    Reflux.connect(ApplicationStore)
  ],

  getInitialState : function() {
    return ApplicationStore.getExposedData();
  },

  _goToCalibration : function() {
    this.transitionTo('calibration');
  },

  render : function() {
    return (
      <section className="clearfix">
        <h1>Step 4. Finished Rap</h1>

        <section className="space">
          <button
            type="button"
            className="btn btn-default"
            onClick={ApplicationActions.startRap.bind(undefined, { withSong : true })}>
            Rap with music
          </button>

          <button
            type="button"
            className="btn btn-default"
            onClick={ApplicationActions.startRap.bind(undefined, { withSong : false })}>
            Rap without music
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
          Step 3. Calibration.
        </button>
      </section>
    );
  }

});

module.exports = RapRoute;