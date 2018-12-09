import React from 'react';
import { AuthConsumer } from '../../Context/AuthContext';

const Admin = () => {
  return (
    <AuthConsumer>
      {({ isAuth, signIn, signOut }) => (
        isAuth() ?
        <div>
          <div>You are signed in <span aria-label="thumbs up" role="img">👍</span></div>
          <button id="signOut" type="submit" onClick={signOut}>Sign Out</button>
        </div>
        :
        <div>
          <div>You are signed out <span aria-label="thumbs up" role="img">👎</span></div>
          <button id="singIn" type="submit" onClick={signIn}>Sign In</button>
        </div>
      )}
    </AuthConsumer>
  )
};

export default Admin;