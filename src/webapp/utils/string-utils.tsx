import { getFromLocalStorage } from "../utils/browserCache";

export const formatList = (list: string[]) => {
    const lng = getFromLocalStorage("language");
    if (lng === "es") {
        if (list.length === 0) {
            return "";
        } else if (list.length === 1) {
            return list[0];
        } else {
            return list.slice(0, list.length - 1).join(", ") + " y " + list[list.length - 1];
        }
    } else if (lng === "fr") {
        if (list.length === 0) {
            return "";
        } else if (list.length === 1) {
            return list[0];
        } else {
            return list.slice(0, list.length - 1).join(", ") + " et " + list[list.length - 1];
        }
    } else {
        if (list.length === 0) {
            return "";
        } else if (list.length === 1) {
            return list[0];
        } else {
            return list.slice(0, list.length - 1).join(", ") + " and " + list[list.length - 1];
        }
    }
};

export const formatYears = (from: string, to: string) => {
    const lng = getFromLocalStorage("language");
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
            return `entre ${from} y ${to}`;
        }
    } else if (lng === "fr") {
        if (!from && !to) {
            return "";
        } else if (from && !to) {
            return `dans ${from}`;
        } else if (!from && to) {
            return `dans ${to}`;
        } else if (from === to) {
            return `dans ${to}`;
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

export const formatYears2 = (from: string, to: string) => {
    const lng = getFromLocalStorage("language");
    if (lng === "es") {
        if (!from && !to) {
            return "";
        } else if (from && !to) {
            return `${from}`;
        } else if (!from && to) {
            return `${to}`;
        } else if (from === to) {
            return `${to}`;
        } else {
            return `entre ${from} y ${to}`;
        }
    } else if (lng === "fr") {
        if (!from && !to) {
            return "";
        } else if (from && !to) {
            return `${from}`;
        } else if (!from && to) {
            return `${to}`;
        } else if (from === to) {
            return `${to}`;
        } else {
            return `entre ${from} et ${to}`;
        }
    } else {
        if (!from && !to) {
            return "";
        } else if (from && !to) {
            return `${from}`;
        } else if (!from && to) {
            return `${to}`;
        } else if (from === to) {
            return `${to}`;
        } else {
            return `from ${from} to ${to}`;
        }
    }
};

export function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
