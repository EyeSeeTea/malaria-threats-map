import React from "react";
import { useTranslation } from "react-i18next";
import { WHITELISTED_TYPES } from "./MechanismTypeFilter";
import { BIOCHEMICAL_MECHANISM_TYPES, MOLECULAR_MECHANISM_TYPES } from "../DataDownload";
import * as R from "ramda";
import MultiSelector from "./MultiSelector";

type OwnProps = {
    onChange: (selection: string[]) => void;
    value: string[];
    dataset?: string;
};

type Props = OwnProps;

function MechanismsTypeSelector({ onChange, value, dataset }: Props) {
    const { t } = useTranslation("common");

    const types = (() => {
        switch (dataset) {
            case "MOLECULAR_ASSAY":
                return MOLECULAR_MECHANISM_TYPES;
            case "BIOCHEMICAL_ASSAY":
                return BIOCHEMICAL_MECHANISM_TYPES;
            default:
                return WHITELISTED_TYPES;
        }
    })();

    const suggestions: any[] = R.sortBy(
        R.prop("label"),
        types.map((specie: string) => ({
            label: t(specie),
            value: specie,
        }))
    );

    return (
        <MultiSelector label={t("filters.mechanism_type")} options={suggestions} onChange={onChange} value={value} />
    );
}
export default MechanismsTypeSelector;
