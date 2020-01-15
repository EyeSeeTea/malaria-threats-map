import config from "../config";

export const style: any = {
  version: 8,
  sources: {
    "raster-tiles": {
      type: "raster",
      tiles: [`${config.mapTilesBaseUrl}/tile/{z}/{y}/{x}?blankTile=false`],
      tileSize: 256,
      attribution: ""
    },
    "raster-labels": {
      type: "raster",
      tiles: [`${config.mapLabelsBaseUrl}/tile/{z}/{y}/{x}?blankTile=false`],
      tileSize: 256,
      attribution: ""
    },
    labels: {
      type: "raster",
      tiles: [
        `https://maps.who.int/arcgis/rest/services/Basemap/WHO_Reference_layer/MapServer/tile/{z}/{y}/{x}?blankTile=false`
      ],
      tileSize: 256,
      attribution: ""
    }
  },
  layers: [
    {
      id: "simple-tiles",
      type: "raster",
      source: "raster-tiles",
      minzoom: 1,
      maxzoom: 8
    },
    {
      id: "label-tiles",
      type: "raster",
      source: "labels",
      minzoom: 1,
      maxzoom: 8
    }
  ]
};

const empty: any = {
  version: 8,
  sources: {},
  layers: []
};

export default empty;
