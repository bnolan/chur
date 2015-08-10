/* globals localStorage */

var Events = require('events');
var util = require('util');
var Identity = require('./identity');

function FriendList () {
  this.list = [];
  Events.EventEmitter.call(this);
}

util.inherits(FriendList, Events.EventEmitter);

FriendList.prototype.save = function () {
  localStorage['friends'] = JSON.stringify(this.list);
};

FriendList.prototype.load = function () {
  if (localStorage['friends']) {
    var friends = JSON.parse(localStorage['friends']);

    this.list = friends.map(function (f) {
      return new Identity(f);
    });
  }
};

FriendList.prototype.forEach = function (f) {
  this.list.forEach(f);
};

FriendList.prototype.count = function () {
  return this.list.length;
};

FriendList.prototype.add = function (f) {
  this.list.push(f);
  this.save();
  this.emit('add', f);
  this.emit('updated');
};

FriendList.prototype.remove = function (f) {
  // todo something something splice
};

FriendList.prototype.confirmFriendByPkf = function (pkf) {
  this.findByPkf(pkf).confirm();
  this.save();
  this.emit('updated');
};

FriendList.prototype.deleteFriendByPkf = function (pkf) {
  this.remove(this.findByPkf(pkf));
  this.save();
  this.emit('updated');
};

FriendList.prototype.findByPkf = function (pkf) {
  return this.list.filter(function (f) {
    return f.pkf === pkf;
  })[0];
};

FriendList.prototype.findAllOnline = function (pkf) {
  return this.list.filter(function (f) {
    return f.isConnected();
  });
};

FriendList.prototype.findAllConfirmed = function (pkf) {
  return this.list.filter(function (f) {
    return f.isConfirmed();
  });
};

module.exports = FriendList;
