const baseSymbols = {
    "circle-radius": [
        "case",
        ["boolean", ["feature-state", "click"], false],
        7,
        ["boolean", ["feature-state", "hover"], false],
        7,
        6,
    ],
    "circle-opacity": 1,
    "circle-stroke-color": [
        "case",
        ["boolean", ["feature-state", "click"], false],
        "#2FB3AF",
        ["boolean", ["feature-state", "hover"], false],
        "lightgrey",
    ],
    "circle-stroke-width": [
        "case",
        ["boolean", ["feature-state", "click"], false],
        5,
        ["boolean", ["feature-state", "hover"], false],
        5,
        1,
    ],
    "circle-stroke-opacity": [
        "case",
        ["boolean", ["feature-state", "click"], false],
        0.7,
        ["boolean", ["feature-state", "hover"], false],
        0.7,
        0.7,
    ],
};

export default baseSymbols;
