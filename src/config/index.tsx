console.log(process.env.REACT_APP_ENV);

type ConfigProps = {
  mapServerUrl: string;
  mapTilesBaseUrl: string;
  mapLabelsBaseUrl: string;
  gaAppId: string;
  env: string;
  mekong: boolean;
};

const stagingMapServer = {
  mapServerUrl:
    "https://who-cache.esriemcs.com/cloud53/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP_STAGING/MapServer"
};

const prodMapServer = {
  mapServerUrl:
    "https://who-cache.esriemcs.com/cloud53/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP/MapServer"
};

const stagingMapTile = {
  mapTilesBaseUrl:
    "https://maps.who.int/arcgis/rest/services/Basemap/BASEMAP_NONIC_UAT/MapServer",
  mapLabelsBaseUrl:
    "https://maps.who.int/arcgis/rest/services/Basemap/BASEMAP_NONIC_LABEL_UAT/MapServer"
};

const prodMapTile = {
  mapTilesBaseUrl:
    "https://maps.who.int/arcgis/rest/services/Basemap/BASEMAP_NONIC/MapServer",
  mapLabelsBaseUrl:
    "https://maps.who.int/arcgis/rest/services/Basemap/BASEMAP_NONIC_LABEL/MapServer"
};

const configurations: { [key: string]: ConfigProps } = {
  local: {
    ...stagingMapServer,
    ...stagingMapTile,
    gaAppId: "",
    env: "local",
    mekong: false
  },
  staging: {
    ...stagingMapServer,
    ...stagingMapTile,
    gaAppId: "UA-151634352-1",
    env: "staging",
    mekong: false
  },
  prod: {
    ...prodMapServer,
    ...prodMapTile,
    gaAppId: "UA-140410266-1",
    env: "prod",
    mekong: false
  },
  "local-mekong": {
    ...stagingMapServer,
    ...stagingMapTile,
    gaAppId: "",
    env: "local",
    mekong: true
  },
  "staging-mekong": {
    ...stagingMapServer,
    ...stagingMapTile,
    gaAppId: "",
    env: "staging",
    mekong: true
  },
  "prod-mekong": {
    ...prodMapServer,
    ...prodMapTile,
    gaAppId: "",
    env: "prod",
    mekong: true
  }
};

export default configurations[process.env.REACT_APP_ENV];
