import { defaultDisease } from "../../domain/entities/Disease";
import { Source } from "./actions/base-actions";

/** The diseases chosen on the vector themes, the only ones with a disease filter. */
type VectorThemeDiseases = Readonly<{ prevention: string | undefined; invasive: string | undefined }>;

/**
 * The disease of the map of a theme: the disease filter on prevention and invasive, and the default
 * disease on diagnosis and treatment, which have no disease filter and only carry malaria.
 */
export function getThemeDisease(theme: string, vectorDiseases: VectorThemeDiseases): string | undefined {
    switch (theme) {
        case "prevention":
            return vectorDiseases.prevention;
        case "invasive":
            return vectorDiseases.invasive;
        default:
            return defaultDisease;
    }
}

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
