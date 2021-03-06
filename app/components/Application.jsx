var React = require('react');

var ApplicationActions = require('actions/ApplicationActions');

var Router = require('react-router');
var {
  Route,
  Redirect,
  DefaultRoute,
  NotFoundRoute,
  RouteHandler
} = Router;

var LyricsRoute = require('components/LyricsRoute');
var TimingRoute = require('components/TimingRoute');
var CalibrationRoute = require('components/CalibrationRoute');
var RapRoute = require('components/RapRoute');

require('bootstrap/dist/css/bootstrap.css');
require('styles/styles.less');

var Application = React.createClass({
  mixins : [ Router.Navigation ],

  componentDidMount : function() {
    var tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },

  _goHome : function() {
    this.transitionTo('app');
    window.location.reload();
  },

  _redirect : function(savedSongId) {
    this.transitionTo('savedSong', { savedSongId });
    window.location.reload();
  },

  render : function() {
    return (
      <div className="page-wrapper">
        <header className="clearfix">
          <h1>Rapping Browser</h1>
          <div><a href="https://github.com/davidchang/html5-rap-synthesis">Code</a></div>
          <div>
            <a
              style={{ cursor : 'pointer', marginBottom : '10' }}
              onClick={ApplicationActions.saveIntoLocalStorage}>
              Save Current Data into Local Storage
            </a>
          </div>

          <h4>Pre-Recorded Songs:</h4>
          <ul>
            <li>
              <a style={{ cursor : 'pointer' }} onClick={() => this._redirect('-JjYb7jLwlD4YjZJPZK3')}>
                Lose Yourself
              </a>
            </li>
            <li>
              <a style={{ cursor : 'pointer' }} onClick={() => this._redirect('-JjYUI4SH0rotsJYAmsR')}>
                Fresh Prince of Bel-Air
              </a>
            </li>
            <li>
              <a style={{ cursor : 'pointer' }} onClick={() => this._redirect('-JjYRritv6qLfqN3o2V-')}>
                La Biblioteca (from Community)
              </a>
            </li>
          </ul>

          Or <a style={{ cursor : 'pointer' }} onClick={this._goHome}>
            make your own recording
          </a>
        </header>
        <div className="player-container">
          <div id="player"></div>
        </div>
        <RouteHandler />
      </div>
    );
  }

});

var SavedSongApplication = React.createClass({
  mixins : [Router.State],
  componentDidMount : function() {
    ApplicationActions.loadSavedSong(this.getParams().savedSongId);
  },

  render : function() {
    return <RouteHandler />;
  }
});

var routes = (
  <Route name="app" path="/" handler={Application}>
    <Route name="lyrics" handler={LyricsRoute} />
    <Route name="timing" handler={TimingRoute} />
    <Route name="calibration" handler={CalibrationRoute} />
    <Route name="rap" handler={RapRoute} />

    <Route name="savedSong" path=":savedSongId" handler={SavedSongApplication}>
      <Route name="savedSongLyrics" handler={LyricsRoute} />
      <Route name="savedSongTiming" handler={TimingRoute} />
      <Route name="savedSongCalibration" handler={CalibrationRoute} />
      <Route name="savedSongRap" handler={RapRoute} />
      <Redirect from="" to="savedSongRap" />
      <DefaultRoute handler={RapRoute} />
    </Route>

    <Redirect from="" to="lyrics" />
    <NotFoundRoute handler={LyricsRoute} />
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler />, document.getElementById('mountNode'));
});
