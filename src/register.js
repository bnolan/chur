/* globals app */

var React = require('react');
var Identity = require('./identity');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      name: ''
    };
  },

  onChange: function (e) {
    this.setState({ name: e.target.value });
  },

  validate: function () {
    if (this.state.name === '') {
      this.setState({ error: 'Your name can\'t be blank.' });
      return false;
    }

    return true;
  },

  onSubmit: function (e) {
    e.preventDefault();

    if (!this.validate()) {
      return;
    }

    var identity = new Identity({ name: this.state.name });
    identity.generate();
    app.setIdentity(identity);
  },

  render: function () {
    return (
      <form className='register' onSubmit={this.onSubmit}>
        <h1>
          Join Chur
        </h1>

        <div>
          <label>Your name (eg Ben Nolan)</label>
          <input type='text' value={this.state.name} placeholder='Name' onChange={this.onChange} />
          <span className='error'>{ this.state.error ? 'Error: ' + this.state.error : '' }</span>
        </div>

        <div>
          <button>Register</button>
        </div>
      </form>
    );
  }
});
