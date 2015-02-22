var React = require('react');
var Router = require('react-router');

var ApplicationStore = require('stores/ApplicationStore');
var ApplicationActions = require('actions/ApplicationActions');

var LyricsRoute = React.createClass({
  mixins : [Router.Navigation],

  getInitialState : function() {
    return { lyrics : '', videoCode : '' };
  },

  componentWillMount : function() {
    // in case there are lyrics
    this.setState(ApplicationStore.getExposedData());
  },

  _handleVideoCodeChange : function(event) {
    event.preventDefault();
    this.setState({
      videoCode : event.target.value
    });
  },

  _handleLyricsChange : function(event) {
    this.setState({
      lyrics : event.target.value
    });
  },

  _goToTiming : function() {
    ApplicationActions.saveLyrics(this.state.lyrics);
    this.transitionTo('timing');
  },

  render : function() {
    return (
      <section className="clearfix">
        <h1>Step 1. Lyrics</h1>

        <form className="form-inline">
          <span style={{ marginRight : '10px' }}>Change Video:</span>
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-addon">youtube.com/watch?v=</div>
              <input
                className="form-control"
                id="youtubeVideoCode"
                placeholder="P4Uv_4jGgAM"
                value={this.state.videoCode}
                onChange={this._handleVideoCodeChange} />
            </div>
          </div>
          <button
            style={{ marginLeft : '10px' }}
            className="btn btn-primary"
            onClick={ApplicationActions.changeVideo.bind(this, this.state.videoCode)}>
            Change Video
          </button>
        </form>

        <textarea
          className="form-control space"
          rows="15"
          value={this.state.lyrics}
          onChange={this._handleLyricsChange}>
        </textarea>
        <button
          type="button"
          className="btn btn-primary pull-right"
          onClick={this._goToTiming}>
          Step 2. Timing
        </button>
      </section>
    );
  }

});

module.exports = LyricsRoute;