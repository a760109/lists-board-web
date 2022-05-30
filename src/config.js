const auth0 = {
  domain: 'a760109.us.auth0.com',
  clientId: 'D7r7QVMocnsR2j3eMHVllhLGgcqDjKSk',
};

const local = {
  auth0,
  apiBaseURL: 'http://localhost:8443/lists/v1',
};

const prod = {
  auth0,
  apiBaseURL: 'https://api.a760109.goportal.one/lists/v1',
};

const hostnameToConfig = {
  localhost: local,
  prod,
};

let config = hostnameToConfig[process.env.REACT_APP_HOSTNAME || window.location.hostname];
if (!config) {
  console.error(`Unknown hostname ${window.location.hostname}, fallback to local config`);
  config = local;
}

export default {
  ...config,
};
