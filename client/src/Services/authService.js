import auth0 from 'auth0-js';

import ENV from "../Conf/env"
import { AUTH_LOCAL_STORAGE } from "../Conf/auth"
import history from '../history';


class Auth {
  auth0 = new auth0.WebAuth({
    domain: ENV.OATH0_DOMAIN,
    clientID: ENV.OATH0_CLIENT_ID,
    redirectUri: `${window.location.protocol}//${window.location.host}/welcome`,
    responseType: 'token id_token',
    scope: 'openid'
  });

  login = () => {
    this.auth0.authorize();
  }

  logout = () => {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem(AUTH_LOCAL_STORAGE.access_token);
    localStorage.removeItem(AUTH_LOCAL_STORAGE.id_token);
    localStorage.removeItem(AUTH_LOCAL_STORAGE.expires_at);
    // navigate to the home route
    history.replace('/');
  }

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace('/');
      } else if (err) {
        history.replace('/');
        console.log(err);
      }
    });
  }
  
  setSession = (authResult) => {
    // Set the time that the Access Token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem(AUTH_LOCAL_STORAGE.access_token, authResult.accessToken);
    localStorage.setItem(AUTH_LOCAL_STORAGE.id_token, authResult.idToken);
    localStorage.setItem(AUTH_LOCAL_STORAGE.expires_at, expiresAt);
    // navigate to the home route
    history.replace('/');
  }

  isAuthenticated = () => {
    // Check whether the current time is past the 
    // Access Token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem(AUTH_LOCAL_STORAGE.expires_at));
    return new Date().getTime() < expiresAt;
  }
};

export default Auth;