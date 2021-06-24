import React from "react";
import { MOLECULAR_MARKERS } from "./MolecularMarkerFilter";
import MultiFilter from "./common/MultiFilter";
import { useTranslation } from "react-i18next";

type OwnProps = {
    onChange: (selection: string[]) => void;
    value: string[];
};

type Props = OwnProps;

const suggestions = MOLECULAR_MARKERS.map(s => ({ ...s, value: `${s.value}` }));
const MolecularMarkerSelector: React.FC<Props> = ({ onChange, value }) => {
    const { t } = useTranslation();

    return (
        <MultiFilter
            label={t("common.filters.molecular_marker")}
            options={suggestions}
            onChange={onChange}
            value={value}
        />
    );
};

export default MolecularMarkerSelector;
