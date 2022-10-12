import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { setMolecularMarker } from "../../store/actions/treatment-actions";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { logEventAction } from "../../store/actions/base-actions";
import RadioGroupFilter from "./RadioGroupFilter";
import { Option } from "../../pages/dashboards/ContentsFilterSection";

export type pfkelch13 = 1;
export type pfcrt = 2;
export type pfmdr1 = 3;
export type pfplasmepsin = 4;

export type MolecularMarker = pfkelch13 | pfcrt | pfmdr1 | pfplasmepsin;

export const MOLECULAR_MARKERS: Option<MolecularMarker>[] = [
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

    const options = MOLECULAR_MARKERS.map(marker => ({
        value: marker.label,
        label: t(marker.label),
    }));

    const value = React.useMemo(() => {
        return MOLECULAR_MARKERS.find(marker => marker.value === treatmentFilters.molecularMarker)?.label;
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

export default connect(mapStateToProps, mapDispatchToProps)(MolecularMarkerFilter);
