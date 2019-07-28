const style: any = {
  version: 8,
  sources: {
    "raster-tiles": {
      type: "raster",
      tiles: [
        "https://maps.who.int/arcgis/rest/services/Basemap/WHO_West_Africa_background_7/MapServer/tile/{z}/{y}/{x}?blankTile=false"
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
    }
  ]
};

export default style;
