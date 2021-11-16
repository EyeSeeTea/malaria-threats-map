import config from "../config";

export const style: mapboxgl.Style = {
    version: 8,
    sources: {
        "raster-tiles": {
            type: "raster",
            tiles: [`${config.mapTilesBaseUrl}/tile/{z}/{y}/{x}?blankTile=false`],
            tileSize: 256,
            attribution: "",
        },

        /**
         * Vector type source
         */
        // "vector-tiles": {
        //     type: "vector",
        //     tiles: [`https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/WHO_Polygon_Basemap_with_labels_VTP/VectorTileServer/tile/{z}/{y}/{x}?blankTile=false`],
        //     attribution: "",
        // },

        // "vector-tiles-admin1": {
        //     type: "vector",
        //     tiles: [
        //         `https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/Admin1/VectorTileServer/tile/{z}/{y}/{x}?blankTile=false`,
        //     ],
        //     attribution: "",
        // },

        // "vector-tiles-disputed": {
        //     type: "vector",
        //     tiles: [
        //         `https://tiles.arcgis.com/tiles/5T5nSi527N4F7luB/arcgis/rest/services/WHO_Polygon_Basemap_Disputed_Areas_and_Borders_VTP/VectorTileServer/tile/{z}/{y}/{x}?blankTile=false`,
        //     ],
        //     attribution: "",
        // },
    },
    layers: [
        {
            id: "raster-tiles",
            type: "raster",
            source: "raster-tiles",
            minzoom: 1,
            maxzoom: 8,
        },
        /**
         * Vector type layers
         */
        // {
        //     id: "land-lines",
        //     type: "line",
        //     source: "vector-tiles",
        //     "source-layer": "Land (ADM0)",
        //     minzoom: 1,
        //     maxzoom: 8,
        // },
        // {
        //     id: "vector-tiles-background",
        //     type: "background",
        //     source: "vector-tiles",
        //     "source-layer": "Background_VTP",
        //     paint: {
        //         "background-opacity": 0.8,
        //         "background-color": "#b2d1db",
        //     },
        // },

        // {
        //     id: "vector-land-fill",
        //     type: "fill",
        //     source: "vector-tiles",
        //     "source-layer": "Land (ADM0)",
        //     paint: {
        //         "fill-color": "#efebe0",
        //         "fill-opacity": 0.8,
        //     },
        // },
        // {
        //     id: "vector-land-lines",
        //     type: "line",
        //     source: "vector-tiles",
        //     "source-layer": "GLOBAL_ADM_L_Merge_20201201",
        //     paint: {
        //         "line-color": "#f8bbd0",
        //         "line-opacity": 0.5,
        //         "line-width": 2,
        //     },
        // },
        // {
        //     id: "vector-admin1",
        //     type: "line",
        //     source: "vector-tiles-admin1",
        //     "source-layer": "Admin1",
        //     paint: {
        //         "line-color": "#f8bbd0",
        //         "line-opacity": 0.5,
        //         "line-width": 0.5,
        //     },
        //     minzoom: 4,
        // },
        // {
        //     id: "vector-disputed",
        //     type: "fill",
        //     source: "vector-tiles-disputed",
        //     "source-layer": "DISPUTED_AREAS",
        //     paint: {
        //         "fill-color": "#cfcfcf",
        //     },
        // },
    ],
};
