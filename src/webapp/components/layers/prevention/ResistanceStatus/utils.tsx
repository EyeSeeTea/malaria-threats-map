export const resolveResistanceStatus = (percentage: number) => {
    if (percentage < 0.9) {
        return "Confirmed";
    } else if (percentage >= 0.9 && percentage < 0.98) {
        return "Possible";
    } else {
        return "Susceptible";
    }
};
