var React = require('react');

var ApplicationActions = require('actions/ApplicationActions');

var CalibratedLyricsTable = require('components/CalibratedLyricsTable');

var FinishedRapRoute = React.createClass({

  render : function() {
    if (this.props.route !== 'finishedRap') {
      return null;
    }

    return (
      <section className="clearfix">
        <h1>Step 4. Finished Rap</h1>

        <section className="space">
          <button type="button" className="btn btn-default" onClick={ApplicationActions.rapToMe.bind(undefined, { withSong : true })}>Rap with music</button>

          <button type="button" className="btn btn-default" onClick={ApplicationActions.rapToMe.bind(undefined, { withSong : false })}>Rap without music!</button>
        </section>

        <CalibratedLyricsTable parsedLyrics={this.props.parsedLyrics} currentLyricIndex={this.props.currentLyricIndex} />

        <button type="button" className="btn btn-primary pull-left" onClick={ApplicationActions.changeRoute.bind(undefined, 'calibration')}>Step 3. Calibration.</button>
      </section>
    );
  }

});

module.exports = FinishedRapRoute;