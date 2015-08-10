/* globals app */

var React = require('react');
var Main = require('./main');
var Register = require('./register');

module.exports = React.createClass({
  displayName: 'Router',

  getInitialState: function () {
    return { tab: app.getIdentity() ? 'main' : 'register' };
  },

  componentDidMount: function () {
    var self = this;

    app.on('identity', function () {
      self.setState({ tab: 'main' });
    });
  },

  render: function () {
    if (this.state.tab === 'register') {
      return <Register />;
    } else {
      return <Main />;
    }
  }
});
