var Backbone = require('backbone');
Backbone.Timestamp = require('./timestamp');
var Identity = require('./identity');

var Post = Backbone.Model.extend({
  getAuthor: function () {
    return new Identity(this.get('author'));
  },

  setAuthor: function (identity) {
    this.set({ author: { name: identity.name, pkf: identity.pkf }});
  },

  setTimestamps: function () {
    var d = (new Date()).toJSON();
    
    this.set({
      createdAt: d,
      updatedAt: d
    });
  }
});

Backbone.Timestamp(Post);

module.exports = Post;
