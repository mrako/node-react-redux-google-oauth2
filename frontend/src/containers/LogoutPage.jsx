import React, { Component } from 'react';
import { connect } from 'react-redux';

import { logout } from '../actions/auth';

class LogoutPage extends Component {
  componentWillMount() {
    this.props.logout();
  }

  render() {
    return null;
  }
}

export default connect(null, { logout })(LogoutPage);
