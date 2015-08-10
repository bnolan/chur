/* globals app */

var React = require('react');
var Mousetrap = require('mousetrap');
var Post = require('./post');

module.exports = React.createClass({
  displayName: 'PostForm',

  getInitialState: function () {
    return { status: '' };
  },

  // createOnEnter: function (e) {
  //   var enterKey = 13;

  //   if (e.which === enterKey) {
  //     this.handleSubmit(e);
  //   }
  // },

  componentDidMount: function () {
    var self = this;

    window.addEventListener('resize', function () {
      self.forceUpdate();
    });

    Mousetrap.bind('mod+enter', function () {
      self.handleSubmit();
    });
  },

  handleSubmit: function (e) {
    if (e) {
      e.preventDefault();
    }

    var p = new Post({ status: this.state.status });

    p.setAuthor(app.identity);
    p.setTimestamps();
    app.posts.add(p);
    p.save();

    this.setState({ status: '' });
  },

  onChange: function (e) {
    this.setState({ status: e.target.value });
  },

  render: function () {
    var h = 70;
    var canSubmit = this.state.status.length > 0;

    return (
      <form className='post-form' onSubmit={this.handleSubmit}>
        <div className='new-post'>
          <div className='avatar'> </div>
          <textarea value={this.state.status} onChange={this.onChange} className='mousetrap' style={{height: h}} autoFocus={true} placeholder='Say something...' />
        </div>

        <div className='toolbar'>
          <input type='submit' title='Press Command+Enter to quick post' value='Post Status' className={ 'btn ' + (canSubmit && 'active') } />
        </div>
      </form>
    );
  }
});
