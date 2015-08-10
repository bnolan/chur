var SimplePeer = require('simple-peer');
var signalhub = require('signalhub');
var Messages = require('./messages');
var Identity = require('./identity');

var HUB_URL = 'http://signalhub.xyz:8000';

var PeerSync = function (identity, posts, friends) {
  console.log('Starting peer sync with ' + friends.count() + ' friends...');
  console.log('  * using signalhub: ' + HUB_URL);

  var hub = signalhub('chur', [HUB_URL]);

  posts.on('add', function (model) {
    if (model.getAuthor().isEqual(identity)) {
      // We only send on things that we authored

      var message = {
        type: Messages.NEW_POST,
        post: model.attributes
      };

      friends.findAllOnline().forEach(function (friend) {
        friend.send(JSON.stringify(message));
      });
    } else {
      model.save();
    }
  });
  posts.fetch();

  /* hack state */

  // if (window.location.hostname === 'a.localhost') {
  //   identity = new Identity({name: 'captainbenis', pkf: '12:12::'});
  //   friends.push(new Identity({name: 'dirk', pkf: '12:34::'}));
  //   friends.push(new Identity({name: 'bong', pkf: '12:45::'}));
  // }

  // if (window.location.hostname === 'b.localhost') {
  //   identity = new Identity({name: 'dirk', pkf: '12:34::'});
  //   friends.push(new Identity({name: 'captainbenis', pkf: '12:12::'}));
  // }

  var onRecieveMessage = function (friend, data) {
    if (data.type === Messages.SYNC_FROM) {
      var message = {
        type: Messages.SYNC_REPLY,
        posts: posts.findAllNewerThan(data.minAge)
      };

      friend.send(JSON.stringify(message));
    } else if (data.type === Messages.SYNC_REPLY) {
      posts.add(data.posts);
    } else if (data.type === Messages.NEW_POST) {
      posts.add(data.post);
    } else if (data.type === Messages.UPDATE_POST) {
      posts.get(data.post.id).save(data.post);
    } else {
      console.log('Unknown message #' + data.type);
      console.log(data);
    }
  };

  hub.subscribe(identity.getChannel())
    .on('data', function (message) {
      // console.log('new message received', message);

      var friend = friends.findByPkf(message.pkf);

      // Not a friend?
      if (!friend) {
        console.log('New friend request from ' + message.name);

        friend = new Identity({
          name: message.name,
          pkf: message.pkf
        });

        friends.add(friend);

        return;
      }

      if (!friend.isConfirmed()) {
        console.log('denied signal from non confirmed friend');
        return;
      }

      // We originated?
      if (!message.initiator) {
        if (!friend.peer.destroyed) {
          friend.peer.signal(message.signalling);
        }

        return;
      }

      if (!friend.recievingPeer) {
        console.log('constructing reciever peer');

        friend.recievingPeer = new SimplePeer();

        friend.recievingPeer.on('error', function (err) {
          console.error(err);
        });

        friend.recievingPeer.on('signal', function (data) {
          // Give my signalling data back to originator
          hub.broadcast(friend.getChannel(), {
            signalling: data,
            name: identity.name,
            pkf: identity.pkf,
            initiator: false
          });
        });

        friend.recievingPeer.on('data', function (data) {
          // got a data channel message
          console.log('got a message from friend: ');
          console.log(data);

          onRecieveMessage(friend, data);
        });

        friend.recievingPeer.on('connect', function () {
          console.log('reciever peer to ' + friend.name + ' is connected');

          var message = {
            type: Messages.SYNC_FROM,
            minAge: posts.getHighestCreatedAt()
          };

          friend.send(JSON.stringify(message));
        });

        friend.recievingPeer.on('close', function () {
          friend.recievingPeer = null;
        });
      }

      if (friend.recievingPeer && !friend.recievingPeer.destroyed) {
        friend.recievingPeer.signal(message.signalling);
      }
    });

  friends.findAllConfirmed().forEach(function (friend) {
    friend.peer = new SimplePeer({ initiator: true });

    friend.peer.on('error', function (err) {
      console.error(err);
    });

    friend.peer.on('data', function (data) {
      onRecieveMessage(friend, data);
    });

    friend.peer.on('signal', function (data) {
      hub.broadcast(friend.getChannel(), {
        signalling: data,
        name: identity.name,
        pkf: identity.pkf,
        initiator: true
      });
    });

    friend.peer.on('close', function () {
      friend.peer = null;
    });

    friend.peer.on('connect', function () {
      console.log('peer to ' + friend.name + ' is connected');

      var message = {
        type: Messages.SYNC_FROM,
        minAge: posts.getHighestCreatedAt()
      };

      friend.send(JSON.stringify(message));
    });
  });
};

module.exports = PeerSync;
