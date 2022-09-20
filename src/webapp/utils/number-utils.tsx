export const isNull = (rawValue: string) => {
    const value = (rawValue || "").trim().toLowerCase();
    return isNA(value) || isNR(value) || value === null || !value;
};

export const isNA = (rawValue: string) => {
    const value = (rawValue || "").trim().toLowerCase();
    return value === "n/a" || value === "na";
};

export const isNR = (rawValue: string) => {
    const value = (rawValue || "").trim().toLowerCase();
    return value === "nr";
};

export const isNotNull = (value: string) => !isNull(value);
