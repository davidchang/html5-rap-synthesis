var React = require('react');

var ApplicationActions = require('actions/ApplicationActions');

var Router = require('react-router');
var {
  Route,
  Redirect,
  NotFoundRoute,
  RouteHandler
} = Router;

var LyricsRoute = require('components/LyricsRoute');
var TimingRoute = require('components/TimingRoute');
var CalibrationRoute = require('components/CalibrationRoute');
var FinishedRapRoute = require('components/FinishedRapRoute');

require('bootstrap/dist/css/bootstrap.css');
require('styles/styles.less');

var Application = React.createClass({

  componentDidMount : function() {
    var tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },

  render : function() {
    return (
      <div className="page-wrapper">
        <button
          type="button"
          className="btn btn-primary"
          onClick={ApplicationActions.saveToLocalStorage}>
          Save App Data To LocalStorage
        </button>

        <div className="player-container">
          <div id="player"></div>
        </div>

        <RouteHandler />
      </div>
    );
  }

});

var routes = (
  <Route name="app" path="/" handler={Application}>
    <Route name="lyrics" handler={LyricsRoute} />
    <Route name="timing" handler={TimingRoute} />
    <Route name="calibration" handler={CalibrationRoute} />
    <Route name="rap" handler={FinishedRapRoute} />

    <Redirect from="" to="lyrics" />
    <NotFoundRoute handler={LyricsRoute} />
  </Route>
);

Router.run(routes, function(Handler) {
  React.render(<Handler />, document.getElementById('mountNode'));
});
