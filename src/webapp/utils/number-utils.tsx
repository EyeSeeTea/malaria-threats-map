export const isNull = (rawValue: string) => {
    const value = (rawValue || "").trim();
    return value === "N/A" || value === "NA" || value === "NR" || value === null || !value;
};

export const isNA = (rawValue: string) => {
    const value = (rawValue || "").trim();
    return value === "N/A" || value === "NA";
};

export const isNR = (rawValue: string) => {
    const value = (rawValue || "").trim();
    return value === "NR";
};

export const isNotNull = (value: string) => !isNull(value);
