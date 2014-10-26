var React = require('react');

var ApplicationActions = require('actions/ApplicationActions');

var FinishedRapRoute = React.createClass({

  render : function() {
    if (this.props.route !== 'shipIt') {
      return null;
    }

    return (
      <section className="clearfix">
        <h1>Step 4. Finished Rap</h1>

        <section className="space">
          <div className="btn-group">
            <button type="button" className="btn btn-default" onClick={ApplicationActions.rapToMe.bind(undefined, { withSong : true, offset : 2750 })}>Rap to me with song!</button>
            <button type="button" className="btn btn-default" onClick={ApplicationActions.rapToMe.bind(undefined, { withSong : false, offset : 38000 })}>Rap to me without song!</button>
          </div>
        </section>

        <button type="button" className="btn btn-primary pull-left" onClick={ApplicationActions.changeRoute.bind(undefined, 'calibration')}>Step 3. Calibration.</button>
      </section>
    );
  }

});

module.exports = FinishedRapRoute;