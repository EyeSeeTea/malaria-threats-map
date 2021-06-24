import React from "react";
import { Option } from "../../BasicSelect";
import { useTranslation } from "react-i18next";
import SingleFilter from "../../filters/common/SingleFilter";

const suggestions: Record<string, Option[]> = {
    prevention: [
        {
            label: "common.data_download.filters.prevention.datasets.discriminating_concentration_bioassays",
            value: "DISCRIMINATING_CONCENTRATION_BIOASSAY",
        },
        {
            label: "common.data_download.filters.prevention.datasets.intensity_concentration_bioassays",
            value: "INTENSITY_CONCENTRATION_BIOASSAY",
        },
        {
            label: "common.data_download.filters.prevention.datasets.synergist_insecticide_bioassays",
            value: "SYNERGIST-INSECTICIDE_BIOASSAY",
        },
        {
            label: "common.data_download.filters.prevention.datasets.resistance_mechanism_assays_molecular",
            value: "MOLECULAR_ASSAY",
        },
        {
            label: "common.data_download.filters.prevention.datasets.resistance_mechanism_assays_biochemical",
            value: "BIOCHEMICAL_ASSAY",
        },
    ],
    treatment: [
        {
            label: "common.data_download.filters.treatment.datasets.therapeutic_efficacy_studies",
            value: "THERAPEUTIC_EFFICACY_STUDY",
        },
        {
            label: "common.data_download.filters.treatment.datasets.molecular_marker_studies",
            value: "MOLECULAR_MARKER_STUDY",
        },
    ],
    invasive: [
        {
            label: "common.data_download.filters.invasive.datasets.invasive_vector_species",
            value: "INVASIVE_VECTOR_SPECIES",
        },
    ],
};

type Props = {
    theme: string;
    value: string;
    onChange: (selection: string) => void;
};

const DataSetSelector: React.FC<Props> = ({ theme, value, onChange }) => {
    const { t } = useTranslation();

    const suggs = suggestions[theme].map(s => ({ label: t(s.label), value: s.value }));

    return (
        <SingleFilter
            label={t("common.data_download.step3.filters.dataset")}
            options={suggs}
            onChange={onChange}
            value={value}
            isClearable={false}
        />
    );
};

export default DataSetSelector;
