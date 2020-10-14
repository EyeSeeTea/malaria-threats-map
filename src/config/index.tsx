type ConfigProps = {
  mapServerUrl: string;
  mapTilesBaseUrl: string;
  mapLabelsBaseUrl: string;
  boundariesBaseUrl: string;
  backendUrl: string;
  gaAppId: string;
  env: string;
  mekong: boolean;
};

const WHO_MALARIA_THREATS_MAP_STAGING =
  "https://extranet.who.int/gis/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP_STAGING/MapServer";
const WHO_MALARIA_THREATS_MAP =
  "https://extranet.who.int/gis/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP/MapServer";

const BASEMAP_NONIC_UAT =
  "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/WHO_Basemap_Beta3/MapServer";
const BASEMAP_NONIC_LABEL_UAT =
  "https://maps.who.int/arcgis/rest/services/Basemap/BASEMAP_NONIC_LABEL_UAT/MapServer";

const BASEMAP_NONIC =
  "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/WHO_Basemap_Beta3/MapServer";
const BASEMAP_NONIC_LABEL =
  "https://maps.who.int/arcgis/rest/services/Basemap/BASEMAP_NONIC_LABEL/MapServer";

const BOUNDARIES_BASE_URL = `https://services.arcgis.com/5T5nSi527N4F7luB/ArcGIS/rest/services/POLIO_ADMINISTRATIVE_BOUNDARIES/FeatureServer/1/query?where=1%3D1&f=geojson&geometryPrecision=2.5`;

const stagingMapServer = {
  mapServerUrl: WHO_MALARIA_THREATS_MAP_STAGING,
  boundariesBaseUrl: BOUNDARIES_BASE_URL,
};

const prodMapServer = {
  mapServerUrl: WHO_MALARIA_THREATS_MAP,
  boundariesBaseUrl: BOUNDARIES_BASE_URL,
};

const stagingMapTile = {
  mapTilesBaseUrl: BASEMAP_NONIC_UAT,
  mapLabelsBaseUrl: BASEMAP_NONIC_LABEL_UAT,
};

const prodMapTile = {
  mapTilesBaseUrl: BASEMAP_NONIC,
  mapLabelsBaseUrl: BASEMAP_NONIC_LABEL,
};

const configurations: { [key: string]: ConfigProps } = {
  local: {
    ...stagingMapServer,
    ...stagingMapTile,
    backendUrl: `https://desolate-fjord-62744.herokuapp.com`,
    gaAppId: "",
    env: "local",
    mekong: false,
  },
  staging: {
    ...stagingMapServer,
    ...stagingMapTile,
    backendUrl: `https://desolate-fjord-62744.herokuapp.com`,
    gaAppId: "UA-151634352-1",
    env: "staging",
    mekong: false,
  },
  prod: {
    ...prodMapServer,
    ...prodMapTile,
    backendUrl: `https://extranet.who.int/gis/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP/MapServer/`,
    gaAppId: "UA-140410266-1",
    env: "prod",
    mekong: false,
  },
  "local-mekong": {
    ...stagingMapServer,
    ...stagingMapTile,
    backendUrl: `https://portal-uat.who.int/malthreats-api/`,
    gaAppId: "",
    env: "local",
    mekong: true,
  },
  "staging-mekong": {
    ...stagingMapServer,
    ...stagingMapTile,
    backendUrl: `https://portal-uat.who.int/malthreats-api/`,
    gaAppId: "",
    env: "staging",
    mekong: true,
  },
  "prod-mekong": {
    ...prodMapServer,
    ...prodMapTile,
    backendUrl: `https://extranet.who.int/gis/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP/MapServer/`,
    gaAppId: "",
    env: "prod",
    mekong: true,
  },
};

export default configurations[process.env.REACT_APP_ENV];
