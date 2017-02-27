import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import GoogleLogin from '../components/GoogleLogin';

import { login } from '../actions/auth';

const error = (err) => {
  console.error(err);
};

const loading = () => {
};

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.success = this.success.bind(this);
  }

  success(credentials) {
    this.props.login(credentials);
  }

  render() {
    return (
      <GoogleLogin
        clientId={process.env.GOOGLE_CLIENT_ID}
        onSuccess={this.success}
        onFailure={error}
        onRequest={loading}
        offline={false}
        approvalPrompt="force"
      >
        <span>Login with Google</span>
      </GoogleLogin>
    );
  }
}

LoginPage.propTypes = {
  login: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    user: state.auth.user,
  };
}

export default connect(mapStateToProps, { login })(LoginPage);
