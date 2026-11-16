import { defaultDisease } from "../../domain/entities/Disease";
import { Source } from "./actions/base-actions";

/**
 * Whether the maps keep the behaviour they had before the disease filter: with the default disease,
 * and while no disease is set.
 */
export function keepsMapBehaviourBeforeDisease(disease: string | undefined): boolean {
    return disease === undefined || disease === defaultDisease;
}

/**
 * Whether a filter replaces the selected values it does not offer, so none stays applied without
 * being shown: on the map, with a disease other than the default one. Data Download, and the maps
 * with the default disease, keep their behaviour from before the disease filter.
 */
export function replacesValuesNotOfferedOnMap(from: Source, disease: string | undefined): boolean {
    return from === "map" && !keepsMapBehaviourBeforeDisease(disease);
}
