var React = require('react');

var CalibratedLyricsTable = React.createClass({

  render : function() {
    if (!this.props.parsedLyrics || !this.props.parsedLyrics.length) {
      return null;
    }

    var calibrationHeaders = (
      <tr>
        <th>Word</th>
        <th>Time it was said</th>
        <th>Desired Duration</th>
        <th>Actual Timing</th>
      </tr>
    );

    var rapHeaders = (
      <tr>
        <th>Word</th>
        <th>Time it was said</th>
        <th>Desired Duration</th>

        <th>Time it was triggered</th>
        <th>Actual Timing</th>
      </tr>
    );

    var renderCalibrationBody = (lyric, index) => {
      var className = (index === this.props.currentLyricIndex) ? 'bold' : '';

      return (
        <tr key={index} className={className}>
          <td>{lyric.lyric}</td>
          <td>{lyric.timing}</td>
          <td>{lyric.expectedDuration}</td>
          <td>{lyric.normalDuration}</td>
        </tr>
      );
    };

    var renderRapBody = (lyric, index) => {
      var className = (index === this.props.currentLyricIndex) ? 'bold' : '';

      return (
        <tr key={index} className={className}>
          <td>{lyric.lyric}</td>
          <td>{lyric.timing}</td>
          <td>{lyric.expectedDuration}</td>

          <td>{lyric.eventLoopTiming}</td>
          <td>{lyric.actualDuration}</td>
        </tr>
      );
    };


    return (
      <table className="table">
        <thead>
          {this.props.mode == 'calibration' ? calibrationHeaders : rapHeaders}
        </thead>
        <tbody>
          {this.props.parsedLyrics.map(
            this.props.mode == 'calibration' ? renderCalibrationBody : renderRapBody
          )}
        </tbody>
      </table>
    );
  }

});

module.exports = CalibratedLyricsTable;