import _ from "lodash";
import { PayloadActionCreator } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import { SiteSelection } from "../../store/types";
import { FeatureCollection } from "./layer-utils";

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

export function updateSelectionAfterFilter(
    map: mapboxgl.Map,
    source: string,
    selection: SiteSelection,
    geoJsonData: FeatureCollection,
    setSelection: PayloadActionCreator<ActionTypeEnum.SetSelection, SiteSelection>
) {
    if (selection) {
        const selectedFeature = geoJsonData.features.find(f => f.properties.SITE_ID === selection.SITE_ID);

        const newObjectIds = _.uniq([...selection.OBJECTIDs, selectedFeature.id]);

        const newSelection = { ...selection, OBJECTIDs: newObjectIds };

        setSelection(newSelection);

        if (selectedFeature) {
            map.setFeatureState({ source, id: selectedFeature.id }, { click: true });
        }

        map.on("click", (e: any) => {
            if (!e.features) {
                resetSelectionInFeatures(map, source, newSelection);
            }
        });
    }
}

export function resetSelectionInFeatures(map: mapboxgl.Map, source: string, selection?: SiteSelection) {
    selection?.OBJECTIDs.forEach(objectId => {
        map.setFeatureState({ source: source, id: objectId }, { click: false });
    });
}
