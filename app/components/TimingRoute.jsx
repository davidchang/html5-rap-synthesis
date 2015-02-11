var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');

var ApplicationStore = require('stores/ApplicationStore');
var ApplicationActions = require('actions/ApplicationActions');

var keypress = require('lib/keypress');

var TimingRoute = React.createClass({

  mixins : [
    Router.Navigation,
    Reflux.connect(ApplicationStore)
  ],

  getInitialState : function() {
    return ApplicationStore.getExposedData();
  },

  componentDidMount : function() {

    var listeners = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(key => {
      return { 'keys' : key, 'on_keydown' : ApplicationActions.lyricTimingTriggered };
    });

    var listener = new keypress.Listener();
    listener.register_many(listeners);
  },

  _goToLyrics : function() {
    this.transitionTo('lyrics');
  },

  _goToCalibration : function() {
    ApplicationActions.crunchLyricDurations();
    this.transitionTo('calibration');
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
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-default"
              onClick={ApplicationActions.startTiming}>
              Play Song
            </button>
          </div>
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