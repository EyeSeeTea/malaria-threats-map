import { defaultDisease } from "../../domain/entities/Disease";

/**
 * Whether the maps keep the behaviour they had before the disease filter: with the default disease,
 * and while no disease is set.
 */
export function keepsMapBehaviourBeforeDisease(disease: string | undefined): boolean {
    return disease === undefined || disease === defaultDisease;
}
