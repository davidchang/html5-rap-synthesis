var React = require('react');

var ApplicationStore = require('stores/ApplicationStore');
var ApplicationActions = require('actions/ApplicationActions');

var StoreListenerMixin = require('mixins/StoreListenerMixin');

var LyricsRoute = require('components/LyricsRoute');
var TimingRoute = require('components/TimingRoute');
var CalibrationRoute = require('components/CalibrationRoute');
var FinishedRapRoute = require('components/FinishedRapRoute');

require('bootstrap/dist/css/bootstrap.css');
require('styles/styles.less');

var Application = React.createClass({

  mixins : [StoreListenerMixin(ApplicationStore)],

  getStateFromStores : function() {
    return {
      route                : ApplicationStore.route,
      lyrics               : ApplicationStore.lyrics,
      parsedLyrics         : ApplicationStore.parsedLyrics,
      currentLyricIndex    : ApplicationStore.currentLyricIndex
    };
  },

  componentDidMount : function() {
    var tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  },

  render : function() {
    return (
      <div className="page-wrapper">
        <button type="button" className="btn btn-primary" onClick={ApplicationActions.save}>Save App Data To LocalStorage</button>
        <button type="button" className="btn btn-primary small-left" onClick={ApplicationActions.revertToDefaultSong}>Revert to Default Song</button>

        <div className="player-container">
          <div id="player"></div>
        </div>

        <LyricsRoute route={this.state.route} lyrics={this.state.lyrics} />

        <TimingRoute route={this.state.route} parsedLyrics={this.state.parsedLyrics} currentLyricIndex={this.state.currentLyricIndex} />

        <CalibrationRoute route={this.state.route} parsedLyrics={this.state.parsedLyrics} />

        <FinishedRapRoute route={this.state.route} />
      </div>
    );
  }

});

React.renderComponent(Application(), document.getElementById('mountNode'));
