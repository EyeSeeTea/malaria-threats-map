export const isNull = (rawValue: string) => {
    const value = (rawValue || "").trim().toLocaleLowerCase();
    const possibleNotApplicable = ["n/a", "na", "nr"];
    return possibleNotApplicable.includes(value) || value === null || !value;
};
export const isNotNull = (value: string) => !isNull(value);
