import { AnyLayer } from "mapbox-gl";

const mapTilesUrl =
    "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/WHO_Point_Basemap_no_labels/VectorTileServer";
const disputedAreasMapTilesUrl =
    "https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/WHO_Polygon_Basemap_Disputed_Areas_and_Borders_VTP/VectorTileServer";

const mapTilesBaseLayers: AnyLayer[] = [
    {
        id: "Background_VTP/1",
        type: "fill",
        source: "esri",
        "source-layer": "Background_VTP",
        layout: {},
        paint: { "fill-color": "#E8E9EC" },
    },
    {
        id: "Land (ADM0)/1",
        type: "fill",
        source: "esri",
        "source-layer": "Land (ADM0)",
        layout: {},
        paint: { "fill-color": "#FFFFFF" },
    },
    {
        id: "Boundaries/GLOBAL_ADM_L_Merge_20201201/2",
        type: "line",
        source: "esri",
        "source-layer": "GLOBAL_ADM_L_Merge_20201201",
        filter: ["==", "_symbol", 2],
        minzoom: 8,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
            "line-color": "#828282",
            "line-width": {
                stops: [
                    [8, 0.4],
                    [13, 1.33333],
                ],
            },
        },
    },
    {
        id: "Boundaries/GLOBAL_ADM_L_Merge_20201201/1",
        type: "line",
        source: "esri",
        "source-layer": "GLOBAL_ADM_L_Merge_20201201",
        filter: ["==", "_symbol", 1],
        minzoom: 4,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
            "line-color": "#828282",
            "line-width": {
                stops: [
                    [0, 0.08],
                    [8, 0.8],
                    [12, 1.86667],
                    [18, 5.33333],
                ],
            },
        },
    },
    {
        id: "Boundaries/GLOBAL_ADM_L_Merge_20201201/0",
        type: "line",
        source: "esri",
        "source-layer": "GLOBAL_ADM_L_Merge_20201201",
        filter: ["==", "_symbol", 0],
        minzoom: 0,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
            "line-color": "#828282",
            "line-width": {
                stops: [
                    [0, 0.133333],
                    [7, 1.33333],
                    [12, 2.66667],
                    [18, 8],
                ],
            },
        },
    },
];

const disputedAreasMapTilesLayers: AnyLayer[] = [
    {
        id: "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aral Sea; Great Lakes of NA; Lake Albert; Lake Malawi; Lake Tanganyika; Lake Titicaca; Lake Victoria",
        type: "fill",
        source: "disputed",
        "source-layer": "DISPUTED_AREAS",
        filter: ["==", "_symbol", 2],
        layout: {},
        paint: { "fill-color": "#E8E9EC" },
    },
    {
        id: "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Golan; Jammu and Kashmir; Western Sahara; Abyei",
        type: "fill",
        source: "disputed",
        "source-layer": "DISPUTED_AREAS",
        filter: ["==", "_symbol", 1],
        layout: {},
        paint: { "fill-color": "#E1E1E1" },
    },
    {
        id: "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin",
        type: "fill",
        source: "disputed",
        "source-layer": "DISPUTED_AREAS",
        filter: ["==", "_symbol", 0],
        minzoom: 9,
        layout: {},
        paint: { "fill-pattern": "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin" },
    },
    {
        id: "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin_7",
        type: "fill",
        source: "disputed",
        "source-layer": "DISPUTED_AREAS",
        filter: ["==", "_symbol", 0],
        maxzoom: 2,
        layout: {},
        paint: { "fill-pattern": "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin_7" },
    },
    {
        id: "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin_6",
        type: "fill",
        source: "disputed",
        "source-layer": "DISPUTED_AREAS",
        filter: ["==", "_symbol", 0],
        minzoom: 2,
        maxzoom: 3,
        layout: {},
        paint: { "fill-pattern": "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin_6" },
    },
    {
        id: "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin_5",
        type: "fill",
        source: "disputed",
        "source-layer": "DISPUTED_AREAS",
        filter: ["==", "_symbol", 0],
        minzoom: 3,
        maxzoom: 4,
        layout: {},
        paint: { "fill-pattern": "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin_5" },
    },
    {
        id: "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin_4",
        type: "fill",
        source: "disputed",
        "source-layer": "DISPUTED_AREAS",
        filter: ["==", "_symbol", 0],
        minzoom: 4,
        maxzoom: 5,
        layout: {},
        paint: { "fill-pattern": "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin_4" },
    },
    {
        id: "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin_3",
        type: "fill",
        source: "disputed",
        "source-layer": "DISPUTED_AREAS",
        filter: ["==", "_symbol", 0],
        minzoom: 5,
        maxzoom: 6,
        layout: {},
        paint: { "fill-pattern": "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin_3" },
    },
    {
        id: "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin_2",
        type: "fill",
        source: "disputed",
        "source-layer": "DISPUTED_AREAS",
        filter: ["==", "_symbol", 0],
        minzoom: 6,
        maxzoom: 7,
        layout: {},
        paint: { "fill-pattern": "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin_2" },
    },
    {
        id: "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin_1",
        type: "fill",
        source: "disputed",
        "source-layer": "DISPUTED_AREAS",
        filter: ["==", "_symbol", 0],
        minzoom: 7,
        maxzoom: 9,
        layout: {},
        paint: { "fill-pattern": "DISPUTED BORDERS AND AREAS/DISPUTED_AREAS/Aksai Chin_1" },
    },
    {
        id: "DISPUTED BORDERS AND AREAS/DISPUTED_BORDERS/Aksai Chin (IND Claim); Arunachal Pradesh; Halayib Triangle (EGY Claim); Aksai Chin (CHN Claim); Bir Tawil (EGY Claim); Jammu and Kashmir; Western Sahara",
        type: "line",
        source: "disputed",
        "source-layer": "DISPUTED_BORDERS",
        filter: ["==", "_symbol", 3],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
            "line-color": "#828282",
            "line-width": {
                stops: [
                    [0, 0.133333],
                    [7, 1.33333],
                    [12, 2.66667],
                    [18, 8],
                ],
            },
        },
    },
    {
        id: "DISPUTED BORDERS AND AREAS/DISPUTED_BORDERS/Sudan-South Sudan; Gaza Strip; West Bank; Halayib Triangle (SDN Claim); Korean DMZ; J&K (IND Claim); J&K (PAK Claim); Bir Tawil (SDN Claim)/1",
        type: "line",
        source: "disputed",
        "source-layer": "DISPUTED_BORDERS",
        filter: ["==", "_symbol", 2],
        layout: { "line-join": "round" },
        paint: {
            "line-color": "#FAFAFA",
            "line-width": {
                stops: [
                    [0, 0.133333],
                    [7, 1.33333],
                    [12, 2.66667],
                    [18, 8],
                ],
            },
        },
    },
    {
        id: "DISPUTED BORDERS AND AREAS/DISPUTED_BORDERS/Sudan-South Sudan; Gaza Strip; West Bank; Halayib Triangle (SDN Claim); Korean DMZ; J&K (IND Claim); J&K (PAK Claim); Bir Tawil (SDN Claim)/0",
        type: "line",
        source: "disputed",
        "source-layer": "DISPUTED_BORDERS",
        filter: ["==", "_symbol", 2],
        layout: { "line-join": "round" },
        paint: {
            "line-color": "#828282",
            "line-dasharray": [5, 4],
            "line-width": {
                stops: [
                    [0, 0.133333],
                    [7, 1.33333],
                    [12, 2.66667],
                    [18, 8],
                ],
            },
        },
    },
    {
        id: "DISPUTED BORDERS AND AREAS/DISPUTED_BORDERS/Kosovo",
        type: "line",
        source: "disputed",
        "source-layer": "DISPUTED_BORDERS",
        filter: ["==", "_symbol", 1],
        layout: { "line-join": "round" },
        paint: {
            "line-color": "#828282",
            "line-dasharray": [2, 2],
            "line-width": {
                stops: [
                    [0, 0.133333],
                    [7, 1.33333],
                    [12, 2.66667],
                    [18, 8],
                ],
            },
        },
    },
    {
        id: "DISPUTED BORDERS AND AREAS/DISPUTED_BORDERS/Abyei (SDN Claim); Abyei (SSD Claim); Ilemi Triangle; J&K Line of Control",
        type: "line",
        source: "disputed",
        "source-layer": "DISPUTED_BORDERS",
        filter: ["==", "_symbol", 0],
        layout: { "line-cap": "round" },
        paint: {
            "line-color": "#828282",
            "line-dasharray": [0.2, 3],
            "line-width": {
                stops: [
                    [0, 0.8],
                    [5, 1.33333],
                    [7, 1.86667],
                    [12, 4],
                    [18, 8],
                ],
            },
        },
    },
];

export const style: mapboxgl.Style = {
    version: 8,
    sprite: `${disputedAreasMapTilesUrl}/resources/sprites/sprite`,
    sources: {
        esri: {
            type: "vector",
            attribution: "WHO",
            bounds: [-180, -79.1713, 180, 85.0511],
            minzoom: 0,
            maxzoom: 23,
            tiles: [`${mapTilesUrl}/tile/{z}/{y}/{x}?blankTile=false`],
        },
        disputed: {
            type: "vector",
            attribution: "WHO",
            bounds: [-92.11, -16.6063, 128.364, 49.0108],
            minzoom: 0,
            maxzoom: 22,
            tiles: [`${disputedAreasMapTilesUrl}/tile/{z}/{y}/{x}?blankTile=false`],
        },
    },
    layers: [...mapTilesBaseLayers, ...disputedAreasMapTilesLayers],
};
