export const formatList = (list: string[]) => {
  const lng = localStorage.getItem("language");
  if (lng === "es") {
    if (list.length === 0) {
      return "";
    } else if (list.length === 1) {
      return list[0];
    } else {
      return (
        list.slice(0, list.length - 1).join(", ") +
        " y " +
        list[list.length - 1]
      );
    }
  } else if (lng === "fr") {
    if (list.length === 0) {
      return "";
    } else if (list.length === 1) {
      return list[0];
    } else {
      return (
        list.slice(0, list.length - 1).join(", ") +
        " et " +
        list[list.length - 1]
      );
    }
  } else {
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
  }
};

export const formatYears = (from: string, to: string) => {
  const lng = localStorage.getItem("language");
  if (lng === "es") {
    if (!from && !to) {
      return "";
    } else if (from && !to) {
      return `en ${from}`;
    } else if (!from && to) {
      return `en ${to}`;
    } else if (from === to) {
      return `en ${to}`;
    } else {
      return `entre ${from} et ${to}`;
    }
  } else {
    if (!from && !to) {
      return "";
    } else if (from && !to) {
      return `in ${from}`;
    } else if (!from && to) {
      return `in ${to}`;
    } else if (from === to) {
      return `in ${to}`;
    } else {
      return `from ${from} to ${to}`;
    }
  }
};
