import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { setMolecularMarker } from "../../store/actions/treatment-actions";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { logEventAction } from "../../store/actions/base-actions";
import RadioGroupFilter from "./RadioGroupFilter";

export const MOLECULAR_MARKERS = [
    {
        label: "Pfkelch13",
        value: 1,
    },
    {
        label: "Pfcrt",
        value: 2,
    },
    {
        label: "Pfmdr1",
        value: 3,
    },
    {
        label: "Pfplasmepsin 2-3",
        value: 4,
    },
];

const mapStateToProps = (state: State) => ({
    treatmentFilters: selectTreatmentFilters(state),
});

const mapDispatchToProps = {
    setMolecularMarker: setMolecularMarker,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function MolecularMarkerFilter({ treatmentFilters, setMolecularMarker, logEventAction }: Props) {
    const { t } = useTranslation();
    const handleChange = (event: React.ChangeEvent<unknown>) => {
        const molecularMarker = MOLECULAR_MARKERS.find(
            marker => marker.label === (event.target as HTMLInputElement).value
        );
        const label = molecularMarker.label;
        setMolecularMarker(molecularMarker.value);
        logEventAction({ category: "filter", action: "molecularMarkers", label });
    };

    const molecularMarkerTranslations = MOLECULAR_MARKERS.map((marker, index) => ({
        OBJECTID: index,
        Code: marker.label,
        DATASET: marker.label,
        FIELD: marker.label,
        VALUE_: marker.label,
        EN: marker.label,
        FR: marker.label,
        ES: marker.label,
        ACTIVE: "yes",
        NOTES: marker.label,
    }));

    return (
        <RadioGroupFilter
            label={t("common.filters.molecular_marker")}
            options={molecularMarkerTranslations}
            handleChange={handleChange}
            value={MOLECULAR_MARKERS.find(marker => marker.value === treatmentFilters.molecularMarker).label}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MolecularMarkerFilter);
