console.log(process.env.REACT_APP_ENV);

type ConfigProps = {
  mapServerUrl: string;
  mapTilesBaseUrl: string;
  mapLabelsBaseUrl: string;
  gaAppId: string;
  env: string;
};

const configurations: { [key: string]: ConfigProps } = {
  local: {
    mapServerUrl:
      "https://who-cache.esriemcs.com/cloud53/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP/MapServer",
    mapTilesBaseUrl:
      "https://maps.who.int/arcgis/rest/services/Basemap/BASEMAP_NONIC_UAT/MapServer",
    mapLabelsBaseUrl:
      "https://maps.who.int/arcgis/rest/services/Basemap/BASEMAP_NONIC_LABEL_UAT/MapServer",
    gaAppId: "",
    env: "local"
  },
  staging: {
    mapServerUrl:
      "https://who-cache.esriemcs.com/cloud53/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP/MapServer",
    mapTilesBaseUrl:
      "https://maps.who.int/arcgis/rest/services/Basemap/BASEMAP_NONIC_UAT/MapServer",
    mapLabelsBaseUrl:
      "https://maps.who.int/arcgis/rest/services/Basemap/BASEMAP_NONIC_LABEL_UAT/MapServer",
    gaAppId: "UA-151634352-1",
    env: "staging"
  },
  prod: {
    mapServerUrl:
      "https://who-cache.esriemcs.com/cloud53/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP/MapServer",
    mapTilesBaseUrl:
      "https://maps.who.int/arcgis/rest/services/Basemap/BASEMAP_NONIC/MapServer",
    mapLabelsBaseUrl:
      "https://maps.who.int/arcgis/rest/services/Basemap/BASEMAP_NONIC_LABEL/MapServer",
    gaAppId: "UA-140410266-1",
    env: "prod"
  }
};

export default configurations[process.env.REACT_APP_ENV];
