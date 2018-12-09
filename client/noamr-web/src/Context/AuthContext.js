import React from 'react';
// import Amplify, { Auth } from "aws-amplify";
// import { awsConfig, signInUrl } from "../Conf/auth";

import Auth from "../Services/authService";

const AuthContext = React.createContext();

class AuthProvider extends React.Component {
  constructor() {
    super();
    this.auth = new Auth();
  }

  getCredentials = async () => {
    try {
      const credentials = await Auth.currentCredentials();
      this.notify(credentials.authenticated);
      return credentials;
    } catch (err) {
      this.notify(false);
    }
  };

  isAuth = () => {
    return Boolean(this.auth.isAuthenticated());
  };
  
  signIn = () => {
    this.auth.login();
  }

  signOut = async () => {
    this.auth.logout();
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          isAuth: this.isAuth,
          signIn: this.signIn,
          signOut: this.signOut,
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };