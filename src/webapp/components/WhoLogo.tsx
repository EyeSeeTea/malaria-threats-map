import React from "react";
import WhoSpanish from "../assets/img/WHO-SP-W-H.png";
import WhoFrench from "../assets/img/WHO-FR-W-H.png";
import WhoEnglish from "../assets/img/WHO-EN-W-H.png";
import { getFromLocalStorage } from "../utils/browserCache";

const WhoLogo = () => {
    const lng = getFromLocalStorage("language");
    const englishWidth = 175;
    //The french and spanish words are longer so they have a longer width by default
    const frenchSpanishWidth = 220;
    switch (lng) {
        case "es":
            return <img src={WhoSpanish} width={frenchSpanishWidth} alt="WHO spanish logo" />;
        case "fr":
            return <img src={WhoFrench} width={frenchSpanishWidth} alt="WHO french logo" />;
        default:
            return <img src={WhoEnglish} width={englishWidth} alt="WHO french logo" />;
    }
};

export default WhoLogo;
