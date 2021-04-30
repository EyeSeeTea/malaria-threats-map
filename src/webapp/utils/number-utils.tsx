export const isNull = (rawValue: string) => {
  const value = (rawValue || "").trim();
  return value === "NA" || value === "NR" || value === null || !value;
};
export const isNotNull = (value: string) => !isNull(value);
