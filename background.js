/* globals chrome, screen */

var React = require('react');
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

var newPostCount = 0;

app.posts.on('update', function () {
  newPostCount++;
  chrome.browserAction.setBadgeText({text: newPostCount});
});

chrome.browserAction.onClicked.addListener(function (tab) {
  newPostCount = 0;
  chrome.browserAction.setBadgeText({text: ''});

  chrome.windows.create({
      type: 'popup',
      url: chrome.extension.getURL('window.html'),
      focused: true,
      width: 320,
      height: screen.height - 120,
      left: screen.width - 320 - 60,
      top: 60
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(sender.tab ?
              'from a content script:' + sender.tab.url :
              'from the extension');

  if (request.type === 'STOPSYNC') {
    app.stopPeerSync();
  }

  if (request.type === 'STARTSYNC') {
    app.startPeerSync();
  }
});
