var Post = require('./post');
var Backbone = require('backbone');
Backbone.LocalStorage = require('backbone.localstorage');

module.exports = Backbone.Collection.extend({
  localStorage: new Backbone.LocalStorage('PostCollection'), // Unique name within your app.
  model: Post,
  comparator: 'createdAt',

  getHighestCreatedAt: function () {
    return this.any() ? this.last().get('createdAt') : new Date(0).toJSON();
  },

  findAllNewerThan: function (timestamp) {
    return this.filter(function (post) {
      return post.get('createdAt') > timestamp;
    });
  }
});
