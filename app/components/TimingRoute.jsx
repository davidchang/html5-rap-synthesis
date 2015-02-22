var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var _ = require('lodash');

var ApplicationStore = require('stores/ApplicationStore');
var ApplicationActions = require('actions/ApplicationActions');

var keypress = require('lib/keypress');

var listener = new keypress.Listener();

var TimingRoute = React.createClass({

  mixins : [
    Router.Navigation,
    Reflux.connect(ApplicationStore)
  ],

  getInitialState : function() {
    return _.extend(ApplicationStore.getExposedData(), { speed : 1 });
  },

  componentWillUnmount : function() {
    // remove bindings
    listener.reset();
  },

  _goToLyrics : function() {
    this.transitionTo('lyrics');
  },

  _goToCalibration : function() {
    ApplicationActions.crunchLyricDurations();
    this.transitionTo('calibration');
  },

  _togglePlayingStatus : function() {
    if (this.state.status === 'stopped') {
      // only attach keyboard bindings when you start the song to time
      var listeners = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(key => {
        return { 'keys' : key, 'on_keydown' : ApplicationActions.lyricTimingTriggered };
      });

      listener.register_many(listeners);
      ApplicationActions.startTiming(this.state.speed);
    } else {
      ApplicationActions.stopTiming();
    }
  },

  _speedChange : function(e) {
    this.setState({
      speed : e.target.value
    });
  },

  render : function() {

    var finishedHtml = null;

    if (this.state.currentLyricIndex >= this.state.parsedLyrics.length) {
      finishedHtml = (
        <section className="space centered">
          Done - now allow Speech Synthesis to calibrate..
        </section>
      );
    }

    return (
      <section className="clearfix">
        <h1>Step 2. Timing</h1>
        <section>

          { /* this should be fixed later to dynamically pull playback rates */ }
          <div>
            <label className="radio-inline">
              <input checked={this.state.speed == 0.25} onChange={this._speedChange} type="radio" name="speedOpt" value="0.25" />0.25
            </label>
            <label className="radio-inline">
              <input checked={this.state.speed == 0.5} onChange={this._speedChange} type="radio" name="speedOpt" value="0.5" />0.5
            </label>
            <label className="radio-inline">
              <input checked={this.state.speed == 1} onChange={this._speedChange} type="radio" name="speedOpt" value="1" />1
            </label>
            <label className="radio-inline">
              <input checked={this.state.speed == 1.5} onChange={this._speedChange} type="radio" name="speedOpt" value="1.5" />1.5
            </label>
            <label className="radio-inline">
              <input checked={this.state.speed == 2} onChange={this._speedChange} type="radio" name="speedOpt" value="2" />2
            </label>
          </div>

          <button
            type="button"
            className="btn btn-default"
            onClick={this._togglePlayingStatus}>
            {this.state.status === 'playing' ? 'Stop Timing' : 'Start Timing'}
          </button>

        </section>

        <section className="space">
          {this.state.parsedLyrics.map((lyric, index) => {
            if (this.state.currentLyricIndex > index) {
              return null;
            }

            if (this.state.currentLyricIndex == index) {
              return (
                <div key={index} className="panel panel-default bold centered">
                  <div className="panel-body">{lyric.lyric}</div>
                </div>
              );
            }

            return (
              <div
                key={index}
                className="centered">
                {lyric.lyric}
              </div>
            );

          })}
        </section>

        <button
          type="button"
          className="btn btn-primary pull-left"
          onClick={this._goToLyrics}>
          Step 1. Lyrics
        </button>

        {finishedHtml}

        <button
          type="button"
          className="btn btn-primary pull-right"
          onClick={this._goToCalibration}>
          Step 3. Calibration
        </button>

      </section>
    );
  }

});

module.exports = TimingRoute;