import baseSymbols from "../../common/baseSymbols";

export const ConfirmationStatusColors: { [key: string]: string[] } = {
    Confirmed: ["#D43501", "#882201"],
    Possible: ["#FF9502", "#b56900"],
    Susceptible: ["#869C66", "#5e6e47"],
};

const resistanceStatusSymbols = {
    ...baseSymbols,
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 2, 4, 7],
    "circle-color": [
        "match",
        ["get", "CONFIRMATION_STATUS"],
        "Confirmed",
        ConfirmationStatusColors.Confirmed[0],
        "Possible",
        ConfirmationStatusColors.Possible[0],
        "Susceptible",
        ConfirmationStatusColors.Susceptible[0],
        /* other */ "#ccc",
    ],
    "circle-stroke-color": [
        ...baseSymbols["circle-stroke-color"],
        [
            "match",
            ["get", "CONFIRMATION_STATUS"],
            "Confirmed",
            ConfirmationStatusColors.Confirmed[1],
            "Possible",
            ConfirmationStatusColors.Possible[1],
            "Susceptible",
            ConfirmationStatusColors.Susceptible[1],
            /* other */ "#111",
        ],
    ],
};

export default resistanceStatusSymbols;
