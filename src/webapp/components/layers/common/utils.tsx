import mapboxgl from "mapbox-gl";
import { SiteSelection } from "../../../store/types";

const getSiteSelectionByFeature = (e: any, feature: any) => {
    const coordinates = feature.geometry.coordinates.slice();

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    return {
        ISO_2_CODE: feature.properties.ISO_2_CODE,
        SITE_ID: feature.properties.SITE_ID,
        coordinates: coordinates,
        OBJECTID: feature.properties.OBJECTID,
    };
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
