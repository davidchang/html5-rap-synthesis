var React = require('react');

var ApplicationActions = require('actions/ApplicationActions');

var LyricsRoute = React.createClass({

  render : function() {
    if (this.props.route !== 'lyrics') {
      return null;
    }

    return (
      <section className="clearfix">
        <h1>Step 1. Lyrics</h1>

        <form className="form-inline">
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-addon">youtube.com/watch?v=</div>
              <input className="form-control" id="youtubeVideoCode" placeholder="P4Uv_4jGgAM" value={this.props.videoCode} onChange={ApplicationActions.handleYoutubeCodeChange} />
            </div>
          </div>
        </form>

        <textarea className="form-control space" rows="15" value={this.props.lyrics} onChange={ApplicationActions.handleLyricsChange}></textarea>
        <button type="button" className="btn btn-primary pull-right" onClick={ApplicationActions.changeRoute.bind(undefined, 'timing')}>Step 2. Timing</button>
      </section>
    );
  }

});

module.exports = LyricsRoute;