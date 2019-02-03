import Amplify from "aws-amplify";
import ENV from "./env";

Amplify.Logger.LOG_LEVEL = 'VERBOSE';

const oauth = Object.freeze({
  domain: ENV.OAUTH_DOMAIN,
  scope: [
    "phone",
    "email",
    "profile",
    "openid",
    "aws.cognito.signin.user.admin"
  ],
  redirectSignIn: ENV.SIGNIN_CALLBACK,
  redirectSignOut: ENV.SIGNOUT_CALLBACK,
  responseType: "code"
});

export const awsConfig = Object.freeze({
  Analytics: Object.freeze({
    disabled: true
  }),
  Auth: Object.freeze({
    oauth: oauth,
    region: ENV.REGION,
    identityPoolId: ENV.IDENTITY_POOL_ID,
    userPoolId: ENV.USER_POOL_ID,
    userPoolWebClientId: ENV.CLIENT_ID
  })
});

function configureAmplify(){
  Amplify.configure(awsConfig);
}

export const signInUrl=
  `https://${awsConfig.Auth.oauth.domain
  }/login?redirect_uri=${awsConfig.Auth.oauth.redirectSignIn
  }&response_type=${awsConfig.Auth.oauth.responseType
  }&client_id=${awsConfig.Auth.userPoolWebClientId}`;


export default configureAmplify;

export const AUTH_LOCAL_STORAGE = {
  access_token: "access_token",
  id_token: "id_token",
  expires_at: "expires_at",
}