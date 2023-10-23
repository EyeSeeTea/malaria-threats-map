export const getFromLocalStorage = (key: string): string | null => {
    return localStorage.getItem(key);
};

export const setToLocalStorage = (key: string, value: string): void => {
    localStorage.setItem(key, value);
};

export const hasSeenDisplaySuggestion = (pageKey: string): boolean => {
    const result = getFromLocalStorage(`displaySuggestionSeen${pageKey}`);
    return !!result;
};

export const markDisplaySuggestionAsSeen = (pageKey: string): void => {
    setToLocalStorage(`displaySuggestionSeen${pageKey}`, "true");
};
