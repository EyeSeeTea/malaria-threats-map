export default (map: any, source: string, layer: string) => {
    let hoveredStateId: any = null;

    map.on("mousemove", layer, (e: any) => {
        if (e.features.length > 0) {
            if (hoveredStateId) {
                map.setFeatureState({ source: source, id: hoveredStateId }, { hover: false });
            }
            hoveredStateId = e.features[0].properties.OBJECTID;
            map.setFeatureState({ source: source, id: hoveredStateId }, { hover: true });
        }
    });

    map.on("mouseleave", layer, () => {
        if (hoveredStateId) {
            map.setFeatureState({ source: source, id: hoveredStateId }, { hover: false });
        }
        hoveredStateId = null;
    });
};
