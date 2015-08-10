/* globals chrome */

var React = require('react');
var Router = require('./src/router');
var PostCollection = require('./src/post-collection');
var FriendList = require('./src/friend-list');
var App = require('./src/app');

var app = window.app = new App();

app.posts = new PostCollection();
app.posts.fetch();
app.friends = new FriendList();
app.friends.load();
app.load();
app.startPeerSync();

document.addEventListener('DOMContentLoaded', function (event) {
  React.render(<Router />, document.body);
});

chrome.runtime.sendMessage({greeting: 'hello'}, function (response) {
  console.log(response.farewell);
});
