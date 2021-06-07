import React from "react";
import { MOLECULAR_MARKERS } from "./MolecularMarkerFilter";
import MultiFilter from "./MultiFilter";
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
        <MultiFilter label={t("filters.molecular_marker")} options={suggestions} onChange={onChange} value={value} />
    );
}

export default MolecularMarkerSelector;
