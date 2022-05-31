import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import Config from 'config';
import { exchangeToken, clearToken } from 'app/auth/store/userSlice';
import axios from 'axios';
import _ from 'lodash';

export default function Auth({ children }) {
  return (
    <Auth0Provider domain={Config.auth0.domain} clientId={Config.auth0.clientId} redirectUri={window.location.origin}>
      <Auth0>{children}</Auth0>
    </Auth0Provider>
  );
}

function Auth0({ children }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(({ auth }) => auth.user.isAuthenticated);
  const auth0 = useAuth0();

  useEffect(() => {
    if (!auth0.isLoading) {
      if (auth0.isAuthenticated) {
        (async () => {
          const claims = await auth0.getIdTokenClaims();

          const resp = await axios.request({
            baseURL: Config.apiBaseURL,
            url: `auth/auth0`,
            method: 'post',
            data: { idToken: claims.__raw },
          });

          if (!_.isEmpty(resp.data.result)) {
            dispatch(exchangeToken(claims.__raw, resp.data.result));
            localStorage.setItem('auth0Token', claims.__raw);
          } else {
            dispatch(clearToken());
            auth0.logout();
            return;
          }
        })();
      } else {
        dispatch(clearToken());
        auth0.loginWithRedirect();
      }
    }
  }, [auth0.isLoading, auth0.isAuthenticated]);

  return isAuthenticated && children;
}
