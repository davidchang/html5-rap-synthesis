var React = require('react');
var Router = require('react-router');

var ApplicationStore = require('stores/ApplicationStore');
var ApplicationActions = require('actions/ApplicationActions');

var LyricsRoute = React.createClass({
  mixins : [
    Router.Navigation,
    Router.State
  ],

  statics : {
    willTransitionFrom : function() {
      ApplicationActions.saveIntoLocalStorage();
    }
  },

  getInitialState : function() {
    return {
      lyrics : '',
      videoId : '',
      savedSong : !_.isUndefined(this.getParams().savedSongId)
    };
  },

  componentWillMount : function() {
    // in case there are lyrics
    this.setState(ApplicationStore.getExposedData());
  },

  _handleVideoCodeChange : function(event) {
    event.preventDefault();
    this.setState({
      videoId : event.target.value
    });
  },

  _handleLyricsChange : function(event) {
    this.setState({
      lyrics : event.target.value
    });
  },

  _goToTiming : function() {
    ApplicationActions.saveLyrics(this.state.lyrics);
    if (!this.state.savedSong) {
      this.transitionTo('timing');
    } else {
      this.transitionTo('savedTiming', this.getParams());
    }
  },

  _changeVideo : function(event) {
    event.preventDefault();
    ApplicationActions.changeVideo(this.state.videoId);
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
                value={this.state.videoId}
                onChange={this._handleVideoCodeChange} />
            </div>
          </div>
          <button
            style={{ marginLeft : '10px' }}
            className="btn btn-primary"
            onClick={this._changeVideo}>
            Set Video
          </button>
        </form>

        <p>Paste lyrics below - words are determined by whitespace.</p>

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