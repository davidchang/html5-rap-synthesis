var React = require('react');

var ApplicationActions = require('actions/ApplicationActions');

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

        <table className="table">
          <thead>
            <tr>
              <th>Word</th>
              <th>Time it was said (in ms)</th>
              <th>Desired timing (in ms)</th>
              <th>Actual timing (in ms)</th>
            </tr>
          </thead>
          <tbody>
            {this.props.parsedLyrics.map(lyric => {
              return (
                <tr>
                  <td>{lyric.lyric}</td>
                  <td>{lyric.timing}</td>
                  <td>{lyric.expectedDuration}</td>
                  <td>{lyric.normalDuration}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button type="button" className="btn btn-primary pull-left" onClick={ApplicationActions.changeRoute.bind(undefined, 'shipIt')}>Step 2. Timing.</button>
        <button type="button" className="btn btn-primary pull-right" onClick={ApplicationActions.changeRoute.bind(undefined, 'timing')}>Step 4. Finished Rap.</button>
      </section>
    );
  }

});

module.exports = CalibrationRoute;