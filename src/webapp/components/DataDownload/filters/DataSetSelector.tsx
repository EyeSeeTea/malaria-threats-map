import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ListSelector, { ListSelectorItem } from "../../list-selector/ListSelector";
import { selectPreventionFilters } from "../../../store/reducers/prevention-reducer";
import { State } from "../../../store/types";
import { setActionGroupSelected } from "../../../store/actions/base-actions";
import { selectTheme } from "../../../store/reducers/base-reducer";
import { connect } from "react-redux";
import { setPreventionDataset } from "../../../store/actions/prevention-actions";
import { setDiagnosisDataset } from "../../../store/actions/diagnosis-actions";
import { setTreatmentDataset } from "../../../store/actions/treatment-actions";
import { setInvasiveDataset } from "../../../store/actions/invasive-actions";
import { selectDiagnosisFilters } from "../../../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../../../store/reducers/treatment-reducer";
import { selectInvasiveFilters } from "../../../store/reducers/invasive-reducer";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
});

const mapDispatchToProps = {
    setPreventionDataset: setPreventionDataset,
    setDiagnosisDataset: setDiagnosisDataset,
    setTreatmentDataset: setTreatmentDataset,
    setInvasiveDataset: setInvasiveDataset,
    setActionGroupSelected: setActionGroupSelected,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

export const preventionDatasetSuggestions: ListSelectorItem[] = [
    {
        title: "common.data_download.filters.prevention.datasets.discriminating_concentration_bioassays",
        value: "DISCRIMINATING_CONCENTRATION_BIOASSAY",
    },
    {
        title: "common.data_download.filters.prevention.datasets.intensity_concentration_bioassays",
        value: "INTENSITY_CONCENTRATION_BIOASSAY",
    },
    {
        title: "common.data_download.filters.prevention.datasets.synergist_insecticide_bioassays",
        value: "SYNERGIST-INSECTICIDE_BIOASSAY",
    },
    {
        title: "common.data_download.filters.prevention.datasets.resistance_mechanism_assays_molecular",
        value: "MOLECULAR_ASSAY",
    },
    {
        title: "common.data_download.filters.prevention.datasets.resistance_mechanism_assays_biochemical",
        value: "BIOCHEMICAL_ASSAY",
    },
];

export const treatmentDatasetSuggestions: ListSelectorItem[] = [
    {
        title: "common.data_download.filters.treatment.datasets.therapeutic_efficacy_studies",
        value: "THERAPEUTIC_EFFICACY_STUDY",
    },
    {
        title: "common.data_download.filters.treatment.datasets.molecular_marker_studies",
        value: "MOLECULAR_MARKER_STUDY",
    },
];

export const diagnosisDatasetSuggestions: ListSelectorItem[] = [
    {
        title: "common.data_download.filters.diagnosis.datasets.gene_deletions",
        value: "PFHRP23_GENE_DELETIONS",
    },
];

export const invasiveDatasetSuggestions: ListSelectorItem[] = [
    {
        title: "common.data_download.filters.invasive.datasets.invasive_vector_species",
        value: "INVASIVE_VECTOR_SPECIES",
    },
];

function DataSetSelector({
    theme,
    preventionFilters,
    diagnosisFilters,
    treatmentFilters,
    invasiveFilters,
    setPreventionDataset,
    setDiagnosisDataset,
    setTreatmentDataset,
    setInvasiveDataset,
    setActionGroupSelected,
}: Props) {
    const { t } = useTranslation();

    const onChangeDataSet = useCallback(
        (selection: ListSelectorItem) => {
            if (theme === "prevention") {
                setPreventionDataset(selection.value as string);
            } else if (theme === "diagnosis") {
                setDiagnosisDataset(selection.value as string);
            } else if (theme === "treatment") {
                setTreatmentDataset(selection.value as string);
            } else {
                setInvasiveDataset(selection.value as string);
            }
        },
        [theme, setPreventionDataset, setDiagnosisDataset, setTreatmentDataset, setInvasiveDataset]
    );

    const datasetSuggestions = useMemo(() => {
        if (theme === "prevention") {
            return preventionDatasetSuggestions;
        } else if (theme === "diagnosis") {
            return diagnosisDatasetSuggestions;
        } else if (theme === "treatment") {
            return treatmentDatasetSuggestions;
        } else {
            return invasiveDatasetSuggestions;
        }
    }, [theme]);

    const filters = useMemo(() => {
        if (theme === "prevention") {
            return preventionFilters;
        } else if (theme === "diagnosis") {
            return diagnosisFilters;
        } else if (theme === "treatment") {
            return treatmentFilters;
        } else {
            return invasiveFilters;
        }
    }, [theme, preventionFilters, diagnosisFilters, treatmentFilters, invasiveFilters]);

    const onChange = useCallback(
        (selection: ListSelectorItem) => {
            onChangeDataSet(selection);
            setActionGroupSelected(null);
        },
        [onChangeDataSet, setActionGroupSelected]
    );

    const onMouseOver = useCallback(
        (selection: ListSelectorItem) => {
            onChangeDataSet(selection);
        },
        [onChangeDataSet]
    );

    const items = React.useMemo(
        () => datasetSuggestions.map(item => ({ ...item, title: t(item.title) })),
        [t, datasetSuggestions]
    );

    const value = React.useMemo(() => items.find(s => s.value === filters.dataset), [items, filters]);

    return <ListSelector items={items} onChange={onChange} onMouseOver={onMouseOver} value={value} />;
}

export default connect(mapStateToProps, mapDispatchToProps)(DataSetSelector);
