export const getFromLocalStorage = (key: string): string | null => {
    return localStorage.getItem(key);
};

export const setToLocalStorage = (key: string, value: string): void => {
    localStorage.setItem(key, value);
};

export const hasShowedDisplaySuggestion = (): boolean => {
    const result = getFromLocalStorage("displaySuggestionShowed");
    return !!result;
};

export const markDisplaySuggestionAsShowed = (): void => {
    setToLocalStorage("displaySuggestionShowed", "true");
};
