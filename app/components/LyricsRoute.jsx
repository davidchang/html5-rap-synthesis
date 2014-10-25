var React = require('react');

var ExampleActions = require('actions/ExampleActions');

var LyricsRoute = React.createClass({

  render : function() {
    if (this.props.route !== 'lyrics') {
      return null;
    }

    return (
      <section>
        <h1>Step 1. Lyrics</h1>
        <textarea className="form-control" rows="15" value={this.props.lyrics} onChange={ExampleActions.handleLyricsChange}></textarea>
        <button type="button" className="btn btn-primary pull-right" onClick={ExampleActions.changeRoute.bind(undefined, 'timing')}>Step 2. Timing</button>
      </section>
    );
  }

});

module.exports = LyricsRoute;