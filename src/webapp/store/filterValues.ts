/**
 * The value a single-choice filter takes among its options: the current value if offered, otherwise
 * the preferred one if offered, otherwise the first option. With no options, because the studies are
 * not loaded yet, the current value, or else the preferred one.
 */
export function chooseFilterValue(options: ReadonlyArray<string>, preferred: string, current?: string): string {
    if (options.length === 0) return current ?? preferred;

    return [current, preferred].find(value => value !== undefined && options.includes(value)) ?? options[0];
}

/**
 * The value a single-choice filter selects instead of a selected one it does not offer: the preferred
 * one if offered, otherwise the first option. Undefined when nothing has to change: nothing selected,
 * the selected value offered, or no options yet because the studies are loading.
 */
export function getValueToSelectInstead(
    selected: string | null | undefined,
    options: ReadonlyArray<string>,
    preferred: string
): string | undefined {
    if (!selected || options.length === 0 || options.includes(selected)) return undefined;

    return chooseFilterValue(options, preferred);
}

/**
 * The selected values a multiple-choice filter keeps when it does not offer some of them. Undefined
 * when nothing has to change: every selected value offered, or no options yet because the studies
 * are loading.
 */
export function getSelectedValuesOffered(
    selected: ReadonlyArray<string>,
    options: ReadonlyArray<string>
): string[] | undefined {
    if (options.length === 0) return undefined;

    const offered = selected.filter(value => options.includes(value));
    return offered.length === selected.length ? undefined : offered;
}
