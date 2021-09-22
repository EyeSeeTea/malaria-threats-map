type ConfigProps = {
    mapServerUrl: string;
    mapTilesBaseUrl: string;
    mapLabelsBaseUrl: string;
    boundariesBaseUrl: string;
    backendUrl: string;
    gaAppId: string;
    env: string;
    hotjar?: { hjid: number; hjsv: number };
    feedback?: {
        token: string | string[];
        createIssue?: boolean;
        issues: {
            title: string;
            body?: string | undefined;
            repository: string;
        };
        snapshots: {
            repository: string;
            branch: string;
        };
    };
};

const WHO_MALARIA_THREATS_MAP_STAGING =
    "https://extranet.who.int/gis/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP_STAGING/MapServer";
const WHO_MALARIA_THREATS_MAP = "https://extranet.who.int/gis/rest/services/MALARIA/WHO_MALARIA_THREATS_MAP/MapServer";

const BASEMAP_NONIC_UAT =
    "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/WHO_Basemap_Beta3/MapServer";
const BASEMAP_NONIC_LABEL_UAT = "https://maps.who.int/arcgis/rest/services/Basemap/BASEMAP_NONIC_LABEL_UAT/MapServer";

const BASEMAP_NONIC =
    "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/WHO_Basemap_Beta3/MapServer";
const BASEMAP_NONIC_LABEL = "https://maps.who.int/arcgis/rest/services/Basemap/BASEMAP_NONIC_LABEL/MapServer";

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

const feedbackConfig = {
    token: ["ghp_mKe29w1W0ww54C", "ah9NfIMlJdEpP2Mw3RU7FO"],
    createIssue: true,
    issues: { repository: "WorldHealthOrganization/malaria-threats-map", title: "[User feedback] {title}" },
    snapshots: { repository: "EyeSeeTeaBotTest/snapshots", branch: "master" },
    buttonPosition: "right",
};

const localFeedbackConfig = {
    ...feedbackConfig,
    issues: { repository: "EyeSeeTea/malaria-threats-map", title: "[User feedback] {title}" },
};

const configurations: { [key: string]: ConfigProps } = {
    local: {
        ...stagingMapServer,
        ...stagingMapTile,
        backendUrl: process.env.REACT_APP_BACKEND_URL || `https://portal-uat.who.int/malthreats-api/`,
        gaAppId: "UA-191197789-1",
        env: "local",
        feedback: localFeedbackConfig,
    },
    dev: {
        ...stagingMapServer,
        ...stagingMapTile,
        backendUrl: `https://portal-uat.who.int/malthreats-api/`,
        gaAppId: "UA-191197789-2",
        env: "dev",
        hotjar: { hjid: 2287362, hjsv: 6 },
        feedback: feedbackConfig,
    },
    staging: {
        ...stagingMapServer,
        ...stagingMapTile,
        backendUrl: `https://portal-uat.who.int/malthreats-api/`,
        gaAppId: "UA-191197789-1",
        env: "staging",
        hotjar: { hjid: 2280607, hjsv: 6 },
        feedback: feedbackConfig,
    },
    prod: {
        ...prodMapServer,
        ...prodMapTile,
        backendUrl: `https://extranet.who.int/malthreats-api/`,
        gaAppId: "UA-140410266-1",
        env: "prod",
        hotjar: { hjid: 2269048, hjsv: 6 },
        feedback: feedbackConfig,
    },
};

export default configurations[process.env.REACT_APP_ENV];
