import { Study } from "../../../domain/entities/Study";

export type FeatureCollection = {
    type: string;
    features: {
        id: number;
        type: string;
        properties: Study;
        geometry: { type: string; coordinates: number[] };
    }[];
};

export const circleLayout = { visibility: "visible" };

export const studiesToGeoJson = (studies: Study[]): FeatureCollection => {
    const features = {
        type: "FeatureCollection",
        features: studies.map(study => {
            return {
                id: study.OBJECTID,
                type: "Feature",
                properties: study,
                geometry: {
                    type: "Point",
                    coordinates: [parseFloat(study.Longitude), parseFloat(study.Latitude)],
                },
            };
        }),
    };

    return features;
};
