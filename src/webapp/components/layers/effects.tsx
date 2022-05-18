export default function setupEffects(map: mapboxgl.Map, source: string, layer: string) {
    let hoveredStateId: any = null;
    let clickedStateId: any = null;

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

    map.on("click", layer, (e: any) => {
        if (e.features.length > 0) {
            const id = e.features[0].properties.OBJECTID;
            setTimeout(() => {
                clickedStateId = id;
                map.setFeatureState({ source: source, id: clickedStateId }, { click: true });
            }, 100);
        }
    });

    map.on("click", _e => {
        if (clickedStateId) {
            map.setFeatureState({ source: source, id: clickedStateId }, { click: false });
        }
        clickedStateId = null;
    });
}
