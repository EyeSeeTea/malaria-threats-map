export const formatList = (list: string[]) => {
  if (list.length === 0) {
    return "";
  } else if (list.length === 1) {
    return list[0];
  } else {
    return (
      list.slice(0, list.length - 1).join(", ") +
      " and " +
      list[list.length - 1]
    );
  }
};

export const formatYears = (from: string, to: string) => {
  if (!from && !to) {
    return "";
  } else if (from && !to) {
    return `in ${from}`;
  } else if (!from && to) {
    return `in ${to}`;
  } else if (from === to) {
    return `in ${to}`;
  } else {
    return `between ${from} and ${to}`;
  }
};
