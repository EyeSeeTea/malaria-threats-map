import mapboxgl, { MapMouseEvent } from "mapbox-gl";
import { PayloadActionCreator } from "typesafe-actions";
import { getRegionBySite } from "../../../../domain/entities/Study";
import { ActionTypeEnum } from "../../../store/actions";
import { RegionState, SiteSelection } from "../../../store/types";

const getSiteSelectionByFeature = (e: any, feature: any) => {
    const coordinates = feature.geometry.coordinates.slice();

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    return {
        ISO_2_CODE: feature.properties.ISO_2_CODE,
        SITE_ID: feature.properties.SITE_ID,
        coordinates: coordinates,
        OBJECTIDs: [feature.properties.OBJECTID],
    };
};

export const updateSelectionAndRegionAfterClick = (
    event: MapMouseEvent,
    map: mapboxgl.Map,
    layer: string,
    currentRegion: RegionState,
    setSelection: PayloadActionCreator<ActionTypeEnum.SetSelection, SiteSelection>,
    setRegion: PayloadActionCreator<ActionTypeEnum.MalariaSetRegion, RegionState>
): void => {
    const selection = getSiteSelectionOnClick(event, map, layer);

    setTimeout(() => {
        setSelection(selection);

        if (currentRegion) {
            const region = getRegionBySiteOnClick(event, map, layer);

            if (region) {
                setRegion(region);
            }
        }
    }, 100);
};

export const getSiteSelectionOnClick = (e: any, map: mapboxgl.Map, layer: string): SiteSelection => {
    const features: any = map.queryRenderedFeatures(e.point, { layers: [layer] });

    if (features && features.length > 0) {
        const selection = getSiteSelectionByFeature(e, features[0]);

        return selection;
    } else {
        return null;
    }
};

export const getRegionBySiteOnClick = (e: any, map: mapboxgl.Map, layer: string): RegionState => {
    const features: any = map.queryRenderedFeatures(e.point, { layers: [layer] });

    if (features && features.length > 0) {
        const region = getRegionBySite(features[0].properties);

        return region;
    } else {
        return null;
    }
};

export const getSiteSelectionOnMove = (e: any, map: mapboxgl.Map, layer: string): SiteSelection => {
    const features: any = map.queryRenderedFeatures(e.point, { layers: [layer] });

    if (features && features.length > 0) {
        const selection = getSiteSelectionByFeature(e, features[0]);

        return selection;
    } else {
        return null;
    }
};

export const getLayerSource = (theme: string) => {
    switch (theme) {
        case "prevention":
            return "prevention-source";
        case "invasive":
            return "invasive-source";
        case "treatment":
            return "treatment-source";
        case "diagnosis":
            return "diagnosis-source";
    }
};
