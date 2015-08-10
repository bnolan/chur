var crypto = require('crypto');
var NodeRSA = require('node-rsa');

function fingerprint (pub) {
  function hash (s, alg) {
    return crypto.createHash(alg).update(s).digest('hex');
  }

  function colons (s) {
    return s.replace(/(.{2})(?=.)/g, '$1:');
  }

  var key = hash(pub, 'sha1');
  return colons(key);
}

function Identity (opts) {
  this.name = opts.name;
  this.pkf = opts.pkf;
  this.publicKey = opts.publicKey;
  this.privateKey = opts.privateKey;
  this.confirmed = opts.confirmed || false;
  this.blocked = opts.blocked || false;
}

Identity.prototype.generate = function () {
  if (this.pkf) {
    throw new Error('Already set keys');
  }

  var key = new NodeRSA({b: 512});

  this.publicKey = key.exportKey('pkcs8-public');
  this.privateKey = key.exportKey('pkcs8-private');
  this.pkf = fingerprint(key.exportKey('pkcs8-public'), 'sha1');
};

Identity.prototype.getFirstName = function () {
  return this.name.split(' ')[0];
};

Identity.prototype.isEqual = function (other) {
  return (other instanceof Identity) && (other.pkf === this.pkf);
};

Identity.prototype.getChannel = function () {
  return '/' + this.pkf;
};

Identity.prototype.isConnected = function () {
  return (this.peer && this.peer.connected) || (this.recievingPeer && this.recievingPeer.connected);
};

Identity.prototype.isConfirmed = function () {
  return !!this.confirmed;
};

Identity.prototype.isBlocked = function () {
  return !!this.confirmed;
};

Identity.prototype.confirm = function () {
  this.confirmed = true;
};

Identity.prototype.send = function (message) {
  if (!this.isConnected) {
    console.log('Friend is not connected');
    return;
  }

  (this.recievingPeer || this.peer).send(message);
};

module.exports = Identity;
