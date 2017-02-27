import React, { PropTypes, Component } from 'react';

class GoogleLogin extends Component {
  constructor(props) {
    super(props);
    this.signIn = this.signIn.bind(this);
    this.state = {
      disabled: true,
    };
  }

  componentDidMount() {
    const { clientId, scope, cookiePolicy, loginHint,
      hostedDomain, autoLoad, fetchBasicProfile } = this.props;

    ((d, s, id, cb) => {
      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;
      js = d.createElement(s);
      js.id = id;
      js.src = '//apis.google.com/js/client:platform.js';
      fjs.parentNode.insertBefore(js, fjs);
      js.onload = cb;
    })(document, 'script', 'google-login', () => {
      const params = {
        client_id: clientId,
        cookiepolicy: cookiePolicy,
        login_hint: loginHint,
        hosted_domain: hostedDomain,
        fetch_basic_profile: fetchBasicProfile,
        scope,
      };
      window.gapi.load('auth2', () => {
        this.setState({
          disabled: false,
        });
        if (!window.gapi.auth2.getAuthInstance()) {
          window.gapi.auth2.init(params);
        }
        if (autoLoad) {
          this.signIn();
        }
      });
    });
  }

  signIn() {
    if (!this.state.disabled) {
      const auth2 = window.gapi.auth2.getAuthInstance();

      const { offline, redirectUri, onSuccess,
        onRequest, fetchBasicProfile, onFailure, prompt } = this.props;

      const options = {
        redirect_uri: redirectUri,
        fetch_basic_profile: fetchBasicProfile,
        prompt,
      };
      onRequest();
      if (offline) {
        auth2.grantOfflineAccess(options)
          .then(
            res => onSuccess(res),
            err => onFailure(err),
          );
      } else {
        auth2.signIn(options)
          .then((res) => {
            const response = res;
            const basicProfile = res.getBasicProfile();
            const authResponse = res.getAuthResponse();

            response.googleId = basicProfile.getId();
            response.tokenObj = authResponse;
            response.tokenId = authResponse.id_token;
            response.accessToken = authResponse.access_token;
            response.profileObj = {
              googleId: basicProfile.getId(),
              imageUrl: basicProfile.getImageUrl(),
              email: basicProfile.getEmail(),
              name: basicProfile.getName(),
              givenName: basicProfile.getGivenName(),
              familyName: basicProfile.getFamilyName(),
            };
            onSuccess(response);
          }, err => onFailure(err));
      }
    }
  }

  render() {
    const { tag, className, children } = this.props;
    const disabled = this.state.disabled || this.props.disabled;

    const googleLoginButton = React.createElement(
      tag, {
        onClick: this.signIn,
        disabled,
        className,
      }, children,
    );
    return googleLoginButton;
  }
}

GoogleLogin.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
  clientId: PropTypes.string.isRequired,
  onRequest: PropTypes.func,
  offline: PropTypes.bool,
  scope: PropTypes.string,
  className: PropTypes.string,
  redirectUri: PropTypes.string,
  cookiePolicy: PropTypes.string,
  loginHint: PropTypes.string,
  hostedDomain: PropTypes.string,
  children: React.PropTypes.node,
  fetchBasicProfile: PropTypes.bool,
  prompt: PropTypes.string,
  tag: PropTypes.string,
  autoLoad: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
};

GoogleLogin.defaultProps = {
  tag: 'button',
  buttonText: 'Login with Google',
  scope: 'profile email',
  redirectUri: 'postmessage',
  prompt: '',
  cookiePolicy: 'single_host_origin',
  fetchBasicProfile: true,
  disabledStyle: {
    opacity: 0.6,
  },
  onRequest: () => {},
  offline: false,
};

export default GoogleLogin;
