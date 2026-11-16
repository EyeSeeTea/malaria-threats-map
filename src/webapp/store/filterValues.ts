/**
 * The value a single-choice filter takes among its options: the current value if offered, otherwise
 * the preferred one if offered, otherwise the first option. With no options, because the studies are
 * not loaded yet, the current value, or else the preferred one.
 */
export function chooseFilterValue(options: ReadonlyArray<string>, preferred: string, current?: string): string {
    if (options.length === 0) return current ?? preferred;

    return [current, preferred].find(value => value !== undefined && options.includes(value)) ?? options[0];
}
