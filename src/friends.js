/* globals app */

var React = require('react');
var FriendForm = require('./friend-form');
var FriendView = require('./friend-view');

module.exports = React.createClass({
  displayName: 'Friends',

  propTypes: {
    posts: React.PropTypes.array
  },

  componentDidMount: function () {
    var self = this;

    app.friends.on('updated', function () {
      self.forceUpdate();
    });
  },

  getFriends: function () {
    return app.friends.list;
  },

  render: function () {
    var friendList = this.getFriends().map(function (friend) {
      return <FriendView key={friend.pkf} friend={friend} />;
    });

    return (
      <div>
        <FriendForm />

        { friendList }
      </div>
    );
  }
});
