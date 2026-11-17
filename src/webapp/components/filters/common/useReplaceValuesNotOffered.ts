import React from "react";
import { getSelectedValuesOffered, getValueToSelectInstead } from "../../../store/filterValues";

/**
 * While `replaces` holds, a single-choice filter selects the preferred value, or its first option,
 * instead of a selected value it does not offer.
 */
export function useReplaceValueNotOffered(
    replaces: boolean,
    selected: string | null | undefined,
    options: ReadonlyArray<string>,
    preferred: string,
    select: (value: string) => void
) {
    const valueToSelect = replaces ? getValueToSelectInstead(selected, options, preferred) : undefined;

    React.useEffect(() => {
        if (valueToSelect) select(valueToSelect);
    }, [valueToSelect, select]);
}

/** While `drops` holds, a multiple-choice filter drops the selected values it does not offer. */
export function useDropValuesNotOffered(
    drops: boolean,
    selected: ReadonlyArray<string>,
    options: ReadonlyArray<string>,
    select: (values: string[]) => void
) {
    const valuesToKeep = drops ? getSelectedValuesOffered(selected, options) : undefined;

    React.useEffect(() => {
        if (valuesToKeep) select(valuesToKeep);
    }, [valuesToKeep, select]);
}
