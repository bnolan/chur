/* globals app */

var React = require('react');
var Identity = require('./identity');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      name: '',
      pkf: ''
    };
  },

  onChangeName: function (e) {
    this.setState({ name: e.target.value });
  },

  onChangePKF: function (e) {
    this.setState({ pkf: e.target.value });
  },

  onSubmit: function (e) {
    e.preventDefault();

    if (!this.validate()) {
      return;
    }
  },

  getMailTo: function () {
    var message = 'Chur is a peer to peer social network.\n\nMy name:\n\t' + app.identity.name + '\n\nMy pkf:\n\t' + app.identity.pkf + '\n\nChur!\n' + app.identity.getFirstName();
    var subject = 'Add me on Chur!';

    return '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(message);
  },

  validate: function () {
    if (this.state.name === '') {
      this.setState({ error: 'Friends name can\'t be blank.' });
      return false;
    }

    if (this.state.pkf.length !== 59) {
      this.setState({ error: 'Friends PKF is too short.' });
      return false;
    }

    var friend = new Identity({
      name: this.state.name,
      pkf: this.state.pkf
    });

    app.friends.add(friend);

    this.setState({name: '', pkf: '', error: null});

    return true;
  },

  render: function () {
    return (<form className='friend-form' onSubmit={this.onSubmit}>
      <div>
        <label>Name</label>
        <input placeholder='Friends name' value={this.state.name} onChange={this.onChangeName} />
      </div>

      <div>
        <label>PKF</label>
        <input placeholder='Public key fingerprint' value={this.state.pkf} onChange={this.onChangePKF} />
        <span className='error'>{ this.state.error ? 'Error: ' + this.state.error : '' }</span>
      </div>

      <div>
        <button>Add friend</button>
        <span> or</span> <a className='button' href={ 'mailto:' + this.getMailTo() }>send an invite</a>
      </div>
    </form>);
  }
});

