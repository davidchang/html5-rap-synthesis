var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var _ = require('lodash');

var ApplicationStore = require('stores/ApplicationStore');
var ApplicationActions = require('actions/ApplicationActions');

var CalibratedLyricsTable = require('components/CalibratedLyricsTable');

var RapRoute = React.createClass({

  statics : {
    willTransitionFrom : function() {
      ApplicationActions.stopSong();
    }
  },

  mixins : [
    Router.Navigation,
    Router.State,
    Reflux.listenTo(ApplicationStore, '_onStatusChange')
  ],

  getInitialState : function() {
    return _.extend(ApplicationStore.getExposedData(), {
      savedSong : !_.isUndefined(this.getParams().savedSongId)
    });
  },

  _onStatusChange : function(updatedData) {
    if (updatedData._status === 'publishSuccess') {
      setTimeout(() => {
        this.transitionTo('savedSong', { savedSongId : updatedData.miscData.key });
      }, 3000);
    }

    this.setState(updatedData);
  },

  _goToCalibration : function() {
    if (!this.state.savedSong) {
      this.transitionTo('calibration');
    } else {
      this.transitionTo('savedSongCalibration', this.getParams());
    }
  },

  _toggleStatus : function() {
    if (this.state.status === 'playing') {
      ApplicationActions.stopSong();
    } else {
      ApplicationActions.startRap();
    }
  },

  _publish : function() {
    this.setState({
      '_status' : 'pending'
    });
    ApplicationActions.publish();
  },

  render : function() {

    var publishButton = '';
    if (!this.state.savedSong) {
      publishButton = (
        <button
          type="button"
          className="btn btn-primary pull-right"
          disabled={this.state._status === 'pending' || this.state._status === 'publishSuccess'}
          onClick={this._publish}>
          Publish
        </button>
      );
    }

    var publishFeedback = '';
    if (this.state._status === 'publishSuccess') {
      publishFeedback = 'Saved! Redirecting in 3 seconds';
    } else if (this.state._status === 'publishError') {
      publishFeedback = `Error Saving: ${this.state.miscData.err}`;
    }

    if (publishFeedback) {
      publishFeedback = (
        <span style={{ marginLeft : '15' }} className="pull-right">
          {publishFeedback}
        </span>
      );
    }


    return (
      <section className="clearfix">
        <h1>Step 4. Finished Rap</h1>

        <section className="space">
          <button
            type="button"
            className="btn btn-default"
            onClick={this._toggleStatus}>
            {this.state.status === 'playing' ? 'Stop Rapping' : 'Start Rapping'}
          </button>
        </section>

        <CalibratedLyricsTable
          mode="rap"
          parsedLyrics={this.state.parsedLyrics}
          currentLyricIndex={this.state.currentLyricIndex} />

        <button
          type="button"
          className="btn btn-primary pull-left"
          onClick={this._goToCalibration}>
          Step 3. Calibration.
        </button>

        {publishFeedback}
        {publishButton}
      </section>
    );
  }

});

module.exports = RapRoute;