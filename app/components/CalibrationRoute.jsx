var React = require('react');

var ApplicationActions = require('actions/ApplicationActions');

var CalibratedLyricsTable = require('components/CalibratedLyricsTable');

var CalibrationRoute = React.createClass({

  render : function() {
    if (this.props.route !== 'calibration') {
      return null;
    }

    return (
      <section className="clearfix">
        <h1>Step 3. Calibration</h1>

        <section>
          <div className="btn-group">
            <button type="button" className="btn btn-default" onClick={ApplicationActions.startCalibration}>Start calibration</button>
          </div>
        </section>

        <CalibratedLyricsTable parsedLyrics={this.props.parsedLyrics} currentLyricIndex={this.props.currentLyricIndex} />

        <button type="button" className="btn btn-primary pull-left" onClick={ApplicationActions.changeRoute.bind(undefined, 'timing')}>Step 2. Timing.</button>
        <button type="button" className="btn btn-primary pull-right" onClick={ApplicationActions.changeRoute.bind(undefined, 'finishedRap')}>Step 4. Finished Rap.</button>
      </section>
    );
  }

});

module.exports = CalibrationRoute;