var React = require('react');

var ExampleActions = require('actions/ExampleActions');

var TimingRoute = React.createClass({

  render : function() {
    if (this.props.route !== 'timing') {
      return null;
    }

    var currentTime = null;
    if (this.props.currentTime) {
      <section>
        Current time: {this.props.currentTime}
      </section>
    }

    return (
      <section>
        <h1>Step 2. Timing</h1>
        <section>
          <div className="btn-group">
            <button type="button" className="btn btn-default" onClick={ExampleActions.playSong}>Play Song</button>
            <button type="button" className="btn btn-default" onClick={ExampleActions.pauseSong}>Pause Song</button>
            <button type="button" className="btn btn-default" onClick={ExampleActions.stopSong}>Stop Song</button>
          </div>
        </section>

        {currentTime}

        <section>
          {this.props.parsedLyrics.map(lyric => {
            return <div>{lyric}</div>;
          })}
        </section>

        <button type="button" className="btn btn-primary pull-left" onClick={ExampleActions.changeRoute.bind(undefined, 'lyrics')}>Step 1. Lyrics</button>
        <button type="button" className="btn btn-primary pull-right" onClick={ExampleActions.changeRoute.bind(undefined, 'calibration')}>Step 3. Calibration</button>
      </section>
    );
  }

});

module.exports = TimingRoute;