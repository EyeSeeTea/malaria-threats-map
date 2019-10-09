import mapboxgl from "mapbox-gl";
import ReactDOM from "react-dom";
import * as React from "react";
import Chart from "../Chart";

export default (map: any, source: string, layer: string) => {
  map.on("click", layer, (e: any, a: any) => {
    const placeholder = document.createElement("div");
    ReactDOM.render(<Chart />, placeholder);
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties["VILLAGE_NAME"];

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setDOMContent(placeholder)
      .addTo(map);
  });

  let hoveredStateId: any = null;

  map.on("mousemove", layer, (e: any) => {
    if (e.features.length > 0) {
      if (hoveredStateId) {
        map.setFeatureState(
          { source: source, id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = e.features[0].properties.OBJECTID;
      map.setFeatureState(
        { source: source, id: hoveredStateId },
        { hover: true }
      );
    }
  });

  map.on("mouseleave", layer, () => {
    if (hoveredStateId) {
      map.setFeatureState(
        { source: source, id: hoveredStateId },
        { hover: false }
      );
    }
    hoveredStateId = null;
  });
};
