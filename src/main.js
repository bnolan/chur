/* globals chrome, app */

var React = require('react');
var Feed = require('./feed');
var Friends = require('./friends');

module.exports = React.createClass({
  displayName: 'Main',

  getInitialState: function () {
    return { tab: 'feed' };
  },

  setFeed: function () {
    this.setState({ tab: 'feed' });
  },

  setFriends: function () {
    this.setState({ tab: 'friends' });
  },

  render: function () {
    var content;

    if (this.state.tab === 'feed') {
      content = <Feed />;
    }

    if (this.state.tab === 'friends') {
      content = <Friends />;
    }

    return (
      <div>
        <h1>Chur</h1>

        <ul className='tabs'>
          <li onClick={this.setFeed} className={ this.state.tab === 'feed' ? 'active' : '' }>Posts</li>
          <li onClick={this.setFriends} className={ this.state.tab === 'friends' ? 'active' : '' }>Friends</li>
        </ul>

        { content }
      </div>
    );
  }
});
