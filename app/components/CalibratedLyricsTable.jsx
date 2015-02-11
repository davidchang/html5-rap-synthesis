var React = require('react');

var CalibratedLyricsTable = React.createClass({

  render : function() {
    if (!this.props.parsedLyrics || !this.props.parsedLyrics.length) {
      return null;
    }

    return (
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
          {this.props.parsedLyrics.map((lyric, index) => {
            var className = '';
            if (index == this.props.currentLyricIndex) {
              className = 'bold';
            }

            return (
              <tr key={index} className={className}>
                <td>{lyric.lyric}</td>
                <td>{lyric.timing}</td>
                <td>{lyric.expectedDuration}</td>
                <td>{lyric.normalDuration}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

});

module.exports = CalibratedLyricsTable;