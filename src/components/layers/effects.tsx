import mapboxgl from "mapbox-gl";

export default (map: any, source: string, layer: string) => {
  map.on("click", layer, (e: any, a: any) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties["VILLAGE_NAME"];

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(description)
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
