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

function isSameFilterValue(previous: unknown, next: unknown): boolean {
    if (Array.isArray(previous) && Array.isArray(next)) {
        return previous.length === next.length && previous.every((value, index) => value === next[index]);
    }

    return previous === next;
}

/**
 * Whether a map layer has to filter its studies again: any filter of its theme holds another value.
 * Every filter counts, so a filter added to the theme redraws the map with no change here.
 */
export function haveFiltersChanged<Filters extends object>(
    previous: Readonly<Filters>,
    next: Readonly<Filters>
): boolean {
    const previousValues: ReadonlyMap<string, unknown> = new Map<string, unknown>(Object.entries(previous));
    const nextValues: ReadonlyMap<string, unknown> = new Map<string, unknown>(Object.entries(next));
    const keys = new Set([...previousValues.keys(), ...nextValues.keys()]);

    return [...keys].some(key => !isSameFilterValue(previousValues.get(key), nextValues.get(key)));
}

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
                    coordinates: [study.Longitude, study.Latitude],
                },
            };
        }),
    };

    return features;
};
