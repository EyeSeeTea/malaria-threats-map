type ConfigProps = {
    publicUrl: string;
    mapServerUrl: string;
    featuresServerUrl: string;
    mapTilesBaseUrl: string;
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

const BASEMAP_NONIC_UAT = "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/basemap_test/MapServer";

const BASEMAP_NONIC = "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/basemap_test/MapServer";

const FEATURES_SERVER = "https://services.arcgis.com/5T5nSi527N4F7luB/arcgis/rest/services";

const stagingMapServer = {
    mapServerUrl: WHO_MALARIA_THREATS_MAP_STAGING,
    featuresServerUrl: FEATURES_SERVER,
};

const prodMapServer = {
    mapServerUrl: WHO_MALARIA_THREATS_MAP,
    featuresServerUrl: FEATURES_SERVER,
};

const stagingMapTile = {
    mapTilesBaseUrl: BASEMAP_NONIC_UAT,
};

const prodMapTile = {
    mapTilesBaseUrl: BASEMAP_NONIC,
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

const publicUrl = process.env.PUBLIC_URL;

const base: Pick<ConfigProps, "feedback" | "publicUrl"> = {
    publicUrl: publicUrl === "." ? "/" : publicUrl,
    feedback: localFeedbackConfig,
};

const configurations: { [key: string]: ConfigProps } = {
    local: {
        ...base,
        ...stagingMapServer,
        ...stagingMapTile,
        backendUrl: process.env.REACT_APP_BACKEND_URL || `https://portal-uat.who.int/malthreats-api/`,
        gaAppId: "UA-191197789-1",
        env: "local",
    },
    dev: {
        ...base,
        ...stagingMapServer,
        ...stagingMapTile,
        backendUrl: `https://portal-uat.who.int/malthreats-api/`,
        gaAppId: "UA-191197789-2",
        env: "dev",
        hotjar: { hjid: 2287362, hjsv: 6 },
    },
    staging: {
        ...base,
        ...stagingMapServer,
        ...stagingMapTile,
        backendUrl: `https://portal-uat.who.int/malthreats-api/`,
        gaAppId: "UA-191197789-1",
        env: "staging",
        hotjar: { hjid: 2280607, hjsv: 6 },
    },
    prod: {
        ...base,
        ...prodMapServer,
        ...prodMapTile,
        backendUrl: `https://extranet.who.int/malthreats-api/`,
        gaAppId: "UA-140410266-1",
        env: "prod",
        hotjar: { hjid: 2269048, hjsv: 6 },
    },
};

export default configurations[process.env.REACT_APP_ENV];
