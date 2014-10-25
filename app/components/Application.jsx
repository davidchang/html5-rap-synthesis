var React = require('react');

var ExampleStore = require('stores/ExampleStore');
var ExampleActions = require('actions/ExampleActions');

var SubComponent = require('./SubComponent');

var StoreListenerMixin = require('mixins/StoreListenerMixin');

require('bootstrap/dist/css/bootstrap.css');

var Application = React.createClass({

  mixins : [StoreListenerMixin(ExampleStore)],

  getStateFromStores : function() {
    return {
      currentTime  : ExampleStore.currentTime
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
      <div>
        <section>
          <div>
            <div id="player"></div>
          </div>
          <div>
            <button onClick={ExampleActions.playSong}>Play Song</button>
            <button onClick={ExampleActions.pauseSong}>Pause Song</button>
            <button onClick={ExampleActions.stopSong}>Stop Song</button>
          </div>
        </section>

        <div>
          {this.state.currentTime}
        </div>
      </div>
    );
  }

});

React.renderComponent(Application(), document.getElementById('mountNode'));
