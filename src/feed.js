/* globals chrome, app */

var React = require('react');
var PostView = require('./post-view');
var PostForm = require('./post-form');
var Mousetrap = require('mousetrap');

module.exports = React.createClass({
  displayName: 'Feed',

  propTypes: {
    posts: React.PropTypes.array
  },

  componentDidMount: function () {
    var self = this;

    Mousetrap.bind('command+n', function () {
      self.onNewPost();
    });

    Mousetrap.bind('down', function () {
      this.setState({ selected: this.getPosts()[0].get('id') });
      self.onNewPost();
    });

    app.posts.on('update', function () {
      self.forceUpdate();
    });
  },

  onNewPost: function () {
    chrome.app.window.create('window.html#post-form', {
      'outerBounds': {
        'width': 320,
        'height': 140
      }
    });
  },

  getPosts: function () {
    return Array.prototype.slice.call(app.posts.models).reverse();
  },

  render: function () {
    var posts = this.getPosts();

    return (
      <div>
        <PostForm />

        {posts.map(function (result) {
          return <PostView key={result.id} {...result.attributes} />;
        })}
      </div>
    );
  }
});
