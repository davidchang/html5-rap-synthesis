var React = require('react');

var ExampleStore = require('stores/ExampleStore');
var ExampleActions = require('actions/ExampleActions');

var StoreListenerMixin = require('mixins/StoreListenerMixin');

var LyricsRoute = require('components/LyricsRoute');
var TimingRoute = require('components/TimingRoute');

require('bootstrap/dist/css/bootstrap.css');
require('styles/styles.less');

var Application = React.createClass({

  mixins : [StoreListenerMixin(ExampleStore)],

  getStateFromStores : function() {
    return {
      currentTime  : ExampleStore.currentTime,
      lyrics       : ExampleStore.lyrics,
      parsedLyrics : ExampleStore.parsedLyrics,
      route        : ExampleStore.route
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
        <button type="button" className="btn btn-primary" onClick={ExampleActions.save}>Save</button>

        <div className="player-container">
          <div id="player"></div>
        </div>

        <LyricsRoute route={this.state.route} lyrics={this.state.lyrics} />

        <TimingRoute route={this.state.route} parsedLyrics={this.state.parsedLyrics} currentTime={this.state.currentTime} />
      </div>
    );
  }

});

React.renderComponent(Application(), document.getElementById('mountNode'));
