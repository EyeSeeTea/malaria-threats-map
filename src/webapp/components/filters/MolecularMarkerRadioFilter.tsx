import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { setMolecularMarkers } from "../../store/actions/treatment-actions";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { logEventAction } from "../../store/actions/base-actions";
import RadioGroupFilter from "./RadioGroupFilter";
import { Option } from "../../pages/dashboards/common/types";

export type pfkelch13 = 1;
export type pfcrt = 2;
export type pfmdr1 = 3;
export type pfplasmepsin = 4;

export type MolecularMarker = pfkelch13 | pfcrt | pfmdr1 | pfplasmepsin;

export const molecularMarkersMap: Record<string, number> = {
    Pfkelch13: 1,
    Pfcrt: 2,
    Pfmdr1: 3,
    "Pfplasmepsin 2-3 amplifications": 4,
};

export const MOLECULAR_MARKERS: Option<MolecularMarker>[] = [
    {
        label: "Pfkelch13",
        value: 1,
    },
    {
        label: "Pfcrt K76T",
        value: 2,
    },
    {
        label: "Pfmdr1 amplifications",
        value: 3,
    },
    {
        label: "Pfplasmepsin 2-3 amplifications",
        value: 4,
    },
];

export const molecularMarkerTranslations: MolecularMarkerTranslations = {
    "Pfmdr1 amplifications": "download.ongoing_molecular_marker.MM_PFMDR1",
    "Pfplasmepsin 2-3 amplifications": "download.ongoing_molecular_marker.MM_PFPM23",
};

const mapStateToProps = (state: State) => ({
    treatmentFilters: selectTreatmentFilters(state),
});

const mapDispatchToProps = {
    setMolecularMarkers: setMolecularMarkers,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function MolecularMarkerRadioButtonFilter({ treatmentFilters, setMolecularMarkers, logEventAction }: Props) {
    const { t } = useTranslation();
    const handleChange = (event: React.ChangeEvent<unknown>) => {
        const molecularMarker = MOLECULAR_MARKERS.find(
            marker => marker.label === (event.target as HTMLInputElement).value
        );
        const label = molecularMarker.label;
        setMolecularMarkers([molecularMarker.value]);
        logEventAction({ category: "filter", action: "molecularMarkers", label });
    };

    const options = MOLECULAR_MARKERS.map(marker => ({
        value: marker.label,
        label: t(molecularMarkerTranslations[marker.label]) || t(marker.label),
    }));

    const value = React.useMemo(() => {
        return MOLECULAR_MARKERS.find(marker => treatmentFilters.molecularMarkers.includes(marker.value))?.label;
    }, [treatmentFilters]);

    return (
        <RadioGroupFilter
            label={t("common.filters.molecular_marker")}
            options={options}
            handleChange={handleChange}
            value={value}
        />
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MolecularMarkerRadioButtonFilter);

type MolecularMarkerLabel = typeof MOLECULAR_MARKERS[number]["label"];
type MolecularMarkerTranslations = Partial<Record<MolecularMarkerLabel, string>>;
