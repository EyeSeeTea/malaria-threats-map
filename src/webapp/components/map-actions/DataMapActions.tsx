import React, { useMemo, useCallback } from "react";

import { connect } from "react-redux";
import FiltersContent from "../filters/container/FiltersContent";
import ActionGroupItem from "./ActionGroupItem";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { selectFilters, selectTheme } from "../../store/reducers/base-reducer";
import { PreventionMapType, State, TreatmentMapType } from "../../store/types";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { selectInvasiveFilters } from "../../store/reducers/invasive-reducer";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { selectTranslations } from "../../store/reducers/translations-reducer";
import _ from "lodash";
import { suggestions } from "../filters/VectorSpeciesFilter";
import { MOLECULAR_MARKERS } from "../filters/MolecularMarkerFilter";
import { PLASMODIUM_SPECIES_SUGGESTIONS } from "../filters/PlasmodiumSpeciesFilter";
import { Box } from "@mui/material";

const Label = styled.span`
    font-weight: bold;
`;

const Value = styled.span`
    font-weight: normal;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    yearFilters: selectFilters(state),
    translations: selectTranslations(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;

const DataMapActions: React.FC<StateProps> = ({
    theme,
    preventionFilters,
    invasiveFilters,
    diagnosisFilters,
    treatmentFilters,
    yearFilters,
    translations,
}) => {
    const { t } = useTranslation();

    const preventionFiltersValue = useCallback(() => {
        const years = yearFilters.join("-");
        const insecticideClass = t(preventionFilters.insecticideClass);
        const insecticideTypes = preventionFilters.insecticideTypes.map(item => t(item));
        const type = t(preventionFilters.type);
        const species = preventionFilters.species.map(item => t(item));
        const assayTypes = preventionFilters.assayTypes.map(item => t(item));
        const synergistTypes = preventionFilters.synergistTypes.map(item => t(item));

        switch (preventionFilters.mapType) {
            case PreventionMapType.RESISTANCE_STATUS: {
                return _.compact([insecticideClass, ...insecticideTypes, type, ...species, years]).join(" | ");
            }
            case PreventionMapType.INTENSITY_STATUS: {
                return _.compact([insecticideClass, ...insecticideTypes, type, ...species, years]).join(" | ");
            }
            case PreventionMapType.RESISTANCE_MECHANISM: {
                return _.compact([type, ...assayTypes, ...species, years]).join(" | ");
            }
            case PreventionMapType.LEVEL_OF_INVOLVEMENT: {
                return _.compact([type, ...synergistTypes, ...species, years]).join(" | ");
            }
        }
    }, [yearFilters, preventionFilters, t]);

    const treatmentFiltersValue = useCallback(() => {
        const years = yearFilters.join("-");
        const exlude = treatmentFilters.excludeLowerPatients ? t("common.filters.exclude_lower_patients") : undefined;

        switch (treatmentFilters.mapType) {
            case TreatmentMapType.TREATMENT_FAILURE:
            case TreatmentMapType.DELAYED_PARASITE_CLEARANCE: {
                const plasmodiumSpecies = PLASMODIUM_SPECIES_SUGGESTIONS.find(
                    item => item.value === treatmentFilters.plasmodiumSpecies
                );
                const drug = t(treatmentFilters.drug);

                return _.compact([plasmodiumSpecies?.label, drug, exlude, years]).join(" | ");
            }
            case TreatmentMapType.MOLECULAR_MARKERS: {
                const molecularMarker = MOLECULAR_MARKERS.find(item => item.value === treatmentFilters.molecularMarker);

                return _.compact([molecularMarker?.label, exlude, years]).join(" | ");
            }
        }
    }, [yearFilters, treatmentFilters, t]);

    const selectedFilters = useMemo(() => {
        if (!translations) return;

        const years = yearFilters.join("-");

        switch (theme) {
            case "prevention": {
                return preventionFiltersValue();
            }
            case "diagnosis": {
                const deletionType = t(diagnosisFilters.deletionType);
                const surveyTypes = diagnosisFilters.surveyTypes.map(item => t(item));
                const patientType = t(diagnosisFilters.patientType);

                return _.compact([deletionType, ...surveyTypes, patientType, years]).join(" | ");
            }
            case "invasive": {
                const vectorSpecies = invasiveFilters.vectorSpecies.map(item => {
                    const vectorSpecie = suggestions.find(sug => sug.value === item);
                    return vectorSpecie.label;
                });

                return _.compact([...vectorSpecies, years]).join(" | ");
            }
            case "treatment": {
                return treatmentFiltersValue();
            }
        }
    }, [
        theme,
        translations,
        preventionFiltersValue,
        yearFilters,
        diagnosisFilters,
        invasiveFilters,
        treatmentFiltersValue,
        t,
    ]);

    return (
        <Box id="dataFilters">
            <ActionGroupItem
                childrenMaxHeight={"400px"}
                placeholder={t("mapActions.selectData")}
                actionGroupKey={"DATA"}
                value={
                    selectedFilters && (
                        <span>
                            <Label>{t("mapActions.data")}:&nbsp;</Label>
                            <Value>{t(selectedFilters)}</Value>
                        </span>
                    )
                }
            >
                <FiltersContent />
            </ActionGroupItem>
        </Box>
    );
};

export default connect(mapStateToProps)(DataMapActions);
