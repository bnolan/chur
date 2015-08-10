/* globals localStorage */

var Events = require('events');
var util = require('util');
var Identity = require('./identity');
var PeerSync = require('./peer-sync');

function App () {
  Events.EventEmitter.call(this);
}

util.inherits(App, Events.EventEmitter);

App.prototype.setIdentity = function (identity) {
  this.identity = identity;
  this.save();
  this.emit('identity');
};

App.prototype.getIdentity = function () {
  return this.identity;
};

App.prototype.clearIdentity = function () {
  this.identity = null;
  this.save();
  this.emit('identity');
};

App.prototype.save = function () {
  localStorage['identity'] = JSON.stringify(this.identity);
};

App.prototype.load = function () {
  if (localStorage['identity']) {
    this.setIdentity(new Identity(JSON.parse(localStorage['identity'])));
  }
};

App.prototype.startPeerSync = function () {
  var self = this;

  if (this.getIdentity() && (!this.peerSync)) {
    this.peerSync = new PeerSync(this.getIdentity(), this.posts, this.friends);
  } else {
    this.on('identity', function () {
      self.startPeerSync();
    });
  }
};

module.exports = App;
