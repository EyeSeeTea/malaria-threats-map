export const getFromLocalStorage = (key: string): string | null => {
    return localStorage.getItem(key);
};

export const setToLocalStorage = (key: string, value: string): void => {
    localStorage.setItem(key, value);
};

export const hasSeenDisplaySuggestion = (): boolean => {
    const result = getFromLocalStorage("displaySuggestionSeen");
    return !!result;
};

export const markDisplaySuggestionAsSeen = (): void => {
    setToLocalStorage("displaySuggestionSeen", "true");
};
