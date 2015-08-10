/* globals app */

var React = require('react');

module.exports = React.createClass({
  displayName: 'FriendView',

  onConfirm: function () {
    app.friends.confirmFriendByPkf(this.props.friend.pkf);
  },

  render: function () {
    var actions = [];

    if (this.props.friend.isConfirmed()) {
      actions.push(<button disabled={true}>Unfriend</button>);
    } else {
      actions.push(<button onClick={this.onConfirm}>Confirm</button>);
      actions.push(<button disabled={true}>Ignore</button>);
    }

    return (
      <div className='friend'>
        <div className='avatar'> </div>
        <h3>
          <span className='author'>{this.props.friend.name}</span>
          <small className='pkf'>{ this.props.friend.pkf.slice(0,11) + '::' }</small>
        </h3>

        <p>
          { this.props.friend.isConfirmed() ? '' : 'Unconfirmed' }
        </p>

        { actions }
      </div>
    );
  }
});
