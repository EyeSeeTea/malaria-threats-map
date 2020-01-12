console.log(process.env.REACT_APP_ENV);

type ConfigProps = {
  mapServerUrl: string;
  gaAppId: string;
  env: string;
};

const configurations: { [key: string]: ConfigProps } = {
  local: {
    mapServerUrl:
      "https://who-cache.esriemcs.com/cloud53/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP_STAGING/MapServer",
    gaAppId: "UA-151634352-1",
    env: "local"
  },
  staging: {
    mapServerUrl:
      "https://who-cache.esriemcs.com/cloud53/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP_STAGING/MapServer",
    gaAppId: "UA-151634352-1",
    env: "staging"
  },
  prod: {
    mapServerUrl:
      "https://who-cache.esriemcs.com/cloud53/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP/MapServer",
    gaAppId: "",
    env: "prod"
  }
};

export default configurations[process.env.REACT_APP_ENV];
