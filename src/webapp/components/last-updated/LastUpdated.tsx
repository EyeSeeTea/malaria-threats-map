import React, { useMemo } from "react";
import { Typography, Card } from "@mui/material";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { State, DiagnosisMapType, TreatmentMapType } from "../../store/types";
import { selectLastUpdatedDates, selectTheme } from "../../store/reducers/base-reducer";
import { selectFilteredPreventionStudies, selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { selectDiagnosisFilters, selectFilteredDiagnosisStudies } from "../../store/reducers/diagnosis-reducer";
import { selectFilteredTreatmentStudies, selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { selectFilteredInvasiveStudies, selectInvasiveFilters } from "../../store/reducers/invasive-reducer";

const RoundedCard = styled(Card)`
    margin-top: 10px;
    padding: 20px;
    border-radius: 12px;
    width: 313px;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    filteredPreventionStudies: selectFilteredPreventionStudies(state),
    filteredDiagnosisStudies: selectFilteredDiagnosisStudies(state),
    filteredTreatmentStudies: selectFilteredTreatmentStudies(state),
    filteredInvasiveStudies: selectFilteredInvasiveStudies(state),
    preventionFilters: selectPreventionFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
    lastUpdatedDates: selectLastUpdatedDates(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;

type Props = StateProps;

const LastUpdated = ({
    theme,
    filteredPreventionStudies,
    filteredDiagnosisStudies,
    filteredTreatmentStudies,
    filteredInvasiveStudies,
    preventionFilters,
    treatmentFilters,
    diagnosisFilters,
    lastUpdatedDates,
}: Props) => {
    const { t } = useTranslation();

    const filteredStudies = useMemo(() => {
        switch (theme) {
            case "prevention":
                return filteredPreventionStudies;
            case "diagnosis":
                return filteredDiagnosisStudies;
            case "treatment":
                return filteredTreatmentStudies;
            case "invasive":
                return filteredInvasiveStudies;
            default:
                return [];
        }
    }, [filteredDiagnosisStudies, filteredInvasiveStudies, filteredPreventionStudies, filteredTreatmentStudies, theme]);

    const date = useMemo(() => {
        switch (theme) {
            case "prevention":
                return lastUpdatedDates.prevention;
            case "diagnosis":
                return diagnosisFilters.mapType === DiagnosisMapType.GENE_DELETIONS
                    ? lastUpdatedDates.diagnosis
                    : lastUpdatedDates.diagnosisOngoing;
            case "treatment":
                return treatmentFilters.mapType === TreatmentMapType.THERAPEUTIC_EFFICACY_STUDIES
                    ? lastUpdatedDates.treatmentTESOngoing
                    : treatmentFilters.mapType === TreatmentMapType.MOLECULAR_MARKERS_ONGOING_STUDIES
                    ? lastUpdatedDates.treatmentMMOngoing // treatmentMolecularOngoing
                    : lastUpdatedDates.treatment;
            case "invasive":
                return lastUpdatedDates.invasive;
        }
    }, [
        diagnosisFilters.mapType,
        lastUpdatedDates.diagnosis,
        lastUpdatedDates.diagnosisOngoing,
        lastUpdatedDates.invasive,
        lastUpdatedDates.prevention,
        lastUpdatedDates.treatment,
        lastUpdatedDates.treatmentMMOngoing,
        lastUpdatedDates.treatmentTESOngoing,
        theme,
        treatmentFilters.mapType,
    ]);

    const themeSelector = theme as "prevention" | "diagnosis" | "treatment" | "invasive";

    return (
        <RoundedCard>
            {lastUpdatedDates[themeSelector] && (
                <Typography variant="body2" display="block" gutterBottom>
                    <strong>{`${t("common.filters.last_updated").toUpperCase()} ${date?.toLocaleDateString()}`}</strong>
                </Typography>
            )}

            {!filteredStudies.length ? (
                <Typography variant="body2">{t("common.filters.no_records")}</Typography>
            ) : (
                <Typography variant="body2">
                    {t(
                        `common.filters.records.${theme}${
                            theme === "prevention" ? `.${preventionFilters.mapType}` : ""
                        }`,
                        { count: filteredStudies.length }
                    )}
                </Typography>
            )}
        </RoundedCard>
    );
};

export default connect(mapStateToProps)(LastUpdated);
