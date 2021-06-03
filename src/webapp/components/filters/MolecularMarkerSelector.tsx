import React from "react";
import { MOLECULAR_MARKERS } from "./MolecularMarkerFilter";
import MultiSelector from "./MultiSelector";
import { useTranslation } from "react-i18next";

type OwnProps = {
    onChange: (selection: string[]) => void;
    value: string[];
};

type Props = OwnProps;

const suggestions = MOLECULAR_MARKERS.map(s => ({ ...s, value: `${s.value}` }));

function MolecularMarkerSelector({ onChange, value }: Props) {
    const { t } = useTranslation("common");

    return (
        <MultiSelector label={t("filters.molecular_marker")} options={suggestions} onChange={onChange} value={value} />
    );
}

export default MolecularMarkerSelector;
