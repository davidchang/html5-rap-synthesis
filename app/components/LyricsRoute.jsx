var React = require('react');
var Router = require('react-router');

var ApplicationStore = require('stores/ApplicationStore');
var ApplicationActions = require('actions/ApplicationActions');

var LyricsRoute = React.createClass({
  mixins : [Router.Navigation],

  getInitialState : function() {
    return { lyrics : '' };
  },

  componentWillMount : function() {
    // in case there are lyrics
    this.setState(ApplicationStore.getExposedData());
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
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-addon">youtube.com/watch?v=</div>
              <input
                className="form-control"
                id="youtubeVideoCode"
                placeholder="P4Uv_4jGgAM"
                value={this.props.videoCode}
                onChange={ApplicationActions.handleYoutubeCodeChange} />
            </div>
          </div>
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