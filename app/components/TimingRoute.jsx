var React = require('react');

var ExampleActions = require('actions/ExampleActions');

var keypress = require('lib/keypress');

var TimingRoute = React.createClass({

  componentDidMount : function() {

    var listeners = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(key => {
      return { 'keys' : key, 'on_keydown' : ExampleActions.lyricTimingTriggered };
    });

    var listener = new keypress.Listener();
    listener.register_many(listeners);
  },

  render : function() {
    if (this.props.route !== 'timing') {
      return null;
    }

    var finishedHtml = null;

    if (this.props.currentLyricIndex >= this.props.parsedLyrics.length) {
      finishedHtml = (
        <section className="space centered">
          Done - now allow Speech Synthesis to calibrate:
          <button type="button" className="btn btn-primary small-left" onClick={ExampleActions.changeRoute.bind(undefined, 'calibration')}>Step 3. Calibration</button>
        </section>
      );
    }

    return (
      <section className="clearfix">
        <h1>Step 2. Timing</h1>
        <section>
          <div className="btn-group">
            <button type="button" className="btn btn-default" onClick={ExampleActions.playSong}>Play Song</button>
            <button type="button" className="btn btn-default" onClick={ExampleActions.pauseSong}>Pause Song</button>
            <button type="button" className="btn btn-default" onClick={ExampleActions.stopSong}>Stop Song</button>
          </div>
        </section>

        <section className="space">
          {this.props.parsedLyrics.map((lyric, index) => {
            if (this.props.currentLyricIndex > index) {
              return null;
            }

            if (this.props.currentLyricIndex == index) {
              return (
                <div className="panel panel-default bold centered">
                  <div className="panel-body">{lyric.lyric}</div>
                </div>
              );
            }

            return <div className="centered">{lyric.lyric}</div>;
          })}
        </section>

        {finishedHtml}

        <button type="button" className="btn btn-primary pull-left" onClick={ExampleActions.changeRoute.bind(undefined, 'lyrics')}>Step 1. Lyrics</button>
      </section>
    );
  }

});

module.exports = TimingRoute;