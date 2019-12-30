export const isNull = (value: string) => value === "NA" || value === "NR" || value === null || !value;
export const isNotNull = (value: string) => !isNull(value);
