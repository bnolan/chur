var React = require('react');
var timeago = require('timeago');

module.exports = React.createClass({
  displayName: 'PostView',

  render: function () {
    var status = this.props.status.replace(/(http\S+)/, '<a href="$1">$1</a>');

    return (
      <div className='post'>
        <div className='avatar'> </div>
        <h3>
          <span className='author'>{this.props.author.name}</span>
          <small className='pkf'>{ this.props.author.pkf.slice(0,11) + '::' }</small>
        </h3>
        <div className='status' dangerouslySetInnerHTML={{__html: status}} />
        <small className='meta'>{ timeago(this.props.createdAt) }</small>
      </div>
    );
  }
});
