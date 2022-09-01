import baseSymbols from "../../common/baseSymbols";

export const ResistanceStatusColors: { [key: string]: string[] } = {
    Confirmed: ["#D43501", "#882201"],
    Possible: ["#FF9502", "#b56900"],
    Susceptible: ["#869C66", "#5e6e47"],
    Undetermined: ["#BEBEBE", "#838383"],
};

const resistanceStatusSymbols = {
    ...baseSymbols,
    "circle-radius": ["interpolate", ["linear"], ["zoom"], 1, 2, 4, 7],
    "circle-color": [
        "case",
        [
            "any",
            ["==", ["get", "INSECTICIDE_CLASS"], "PYRROLES"],
            ["==", ["get", "INSECTICIDE_CLASS"], "ORGANOPHOSPHATES"],
        ],
        [
            "match",
            ["get", "RESISTANCE_STATUS"],
            "CONFIRMED_RESISTANCE",
            ResistanceStatusColors.Confirmed[0],
            "POSSIBLE_RESISTANCE",
            ResistanceStatusColors.Possible[0],
            "SUSCEPTIBLE",
            ResistanceStatusColors.Susceptible[0],
            "UNDETERMINED",
            ResistanceStatusColors.Undetermined[0],
            /* other */ "#ccc",
        ],
        [
            "match",
            ["get", "CONFIRMATION_STATUS"],
            "Confirmed",
            ResistanceStatusColors.Confirmed[0],
            "Possible",
            ResistanceStatusColors.Possible[0],
            "Susceptible",
            ResistanceStatusColors.Susceptible[0],
            /* other */ "#ccc",
        ],
    ],
    "circle-stroke-color": [
        ...baseSymbols["circle-stroke-color"],
        [
            "case",
            [
                "any",
                ["==", ["get", "INSECTICIDE_CLASS"], "PYRROLES"],
                ["==", ["get", "INSECTICIDE_CLASS"], "ORGANOPHOSPHATES"],
            ],
            [
                "match",
                ["get", "RESISTANCE_STATUS"],
                "CONFIRMED_RESISTANCE",
                ResistanceStatusColors.Confirmed[1],
                "POSSIBLE_RESISTANCE",
                ResistanceStatusColors.Possible[1],
                "SUSCEPTIBLE",
                ResistanceStatusColors.Susceptible[1],
                "UNDETERMINED",
                ResistanceStatusColors.Undetermined[1],
                /* other */ "#111",
            ],
            [
                "match",
                ["get", "CONFIRMATION_STATUS"],
                "Confirmed",
                ResistanceStatusColors.Confirmed[1],
                "Possible",
                ResistanceStatusColors.Possible[1],
                "Susceptible",
                ResistanceStatusColors.Susceptible[1],
                /* other */ "#111",
            ],
        ],
    ],
};

export default resistanceStatusSymbols;
