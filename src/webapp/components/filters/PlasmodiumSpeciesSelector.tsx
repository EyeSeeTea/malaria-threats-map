import React from "react";
import MultiFilter from "./common/MultiFilter";
import { useTranslation } from "react-i18next";

type OwnProps = {
    onChange: (selection: string[]) => void;
    value: string[];
};

type Props = OwnProps;

const PLASMODIUM_SPECIES_SUGGESTIONS: any[] = [
    {
        label: "P. falciparum",
        value: "P._FALCIPARUM",
    },
    {
        label: "P. vivax",
        value: "P._VIVAX",
    },
    {
        label: "P. knowlesi",
        value: "P._KNOWLESI",
    },
    {
        label: "P. malariae",
        value: "P._MALARIAE",
    },
    {
        label: "P. ovale",
        value: "P._OVALE",
    },
];

const PlasmodiumSpeciesSelector: React.FC<Props> = ({ onChange, value }) => {
    const { t } = useTranslation();

    return (
        <MultiFilter
            label={t("common.filters.plasmodium_species")}
            options={PLASMODIUM_SPECIES_SUGGESTIONS}
            onChange={onChange}
            value={value}
        />
    );
};

export default PlasmodiumSpeciesSelector;
