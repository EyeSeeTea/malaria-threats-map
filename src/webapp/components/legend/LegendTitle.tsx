import { Typography } from "@mui/material";
import React, { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
    DiagnosisFilters,
    InvasiveFilters,
    InvasiveMapType,
    PreventionFilters,
    PreventionMapType,
    TreatmentFilters,
    TreatmentMapType,
} from "../../store/types";
import { MOLECULAR_MARKERS } from "../filters/MolecularMarkerFilter";

export function LegendTitle(
    theme: string,
    preventionFilters: PreventionFilters,
    diagnosisFilters: DiagnosisFilters,
    treatmentFilters: TreatmentFilters,
    invasiveFilters: InvasiveFilters,
    countryMode: boolean
): ReactNode {
    switch (theme) {
        case "prevention":
            return PreventionLegendTitle(preventionFilters, countryMode);
        case "diagnosis":
            return DiagnosisLegendTitle(diagnosisFilters, countryMode);
        case "treatment":
            return TreatmentLegendTitle(treatmentFilters, countryMode);
        case "invasive":
            return InvasiveLegendTitle(invasiveFilters, countryMode);
        default:
            return "";
    }
}

function PreventionLegendTitle(filters: PreventionFilters, countryMode: boolean): ReactNode {
    const { t } = useTranslation();

    if (countryMode) {
        if (filters.mapType === PreventionMapType.PBO_DEPLOYMENT) {
            return t("common.prevention.pbo_deployment_legend");
        } else {
            return t("common.themes.prevention");
        }
    }

    switch (filters.mapType) {
        case PreventionMapType.RESISTANCE_STATUS:
            return t("common.prevention.resistance_status");
        case PreventionMapType.INTENSITY_STATUS:
            return t("common.prevention.resistance_intensity");
        case PreventionMapType.RESISTANCE_MECHANISM:
            return t("common.prevention.resistance_mechanism");
        case PreventionMapType.LEVEL_OF_INVOLVEMENT:
            return t("common.prevention.synergist_involvement_legend");
        case PreventionMapType.PBO_DEPLOYMENT:
            return t("common.prevention.pbo_deployment_legend");
        default:
            return "";
    }
}

function DiagnosisLegendTitle(filters: DiagnosisFilters, countryMode: boolean) {
    const { t } = useTranslation();

    if (countryMode) {
        return t("common.themes.diagnosis");
    }
    return t(`common.diagnosis.legend.gene_deletions.${filters.deletionType}`);
}

function TreatmentLegendTitle(filters: TreatmentFilters, countryMode: boolean): ReactNode {
    const { t } = useTranslation();

    if (countryMode) {
        return t("common.themes.treatment");
    }

    switch (filters.mapType) {
        case TreatmentMapType.TREATMENT_FAILURE:
            return (
                <React.Fragment>
                    <Typography variant="body2"> {t("common.treatment.treatment_failure")}</Typography>
                    <Typography variant="body2">
                        <Trans on t={t} i18nKey={filters.drug}>
                            {filters.drug}
                        </Trans>
                    </Typography>
                </React.Fragment>
            );
        case TreatmentMapType.DELAYED_PARASITE_CLEARANCE:
            return (
                <React.Fragment>
                    <Typography variant="body2"> {t("common.treatment.delayed_parasite_clearance")}</Typography>
                    <Typography variant="body2">
                        <Trans t={t} i18nKey={filters.drug}>
                            {filters.drug}
                        </Trans>
                    </Typography>
                </React.Fragment>
            );

        case TreatmentMapType.MOLECULAR_MARKERS:
            return `${t("common.treatment.molecular_markers")} (
                ${MOLECULAR_MARKERS[filters.molecularMarker - 1].label})`;
        default:
            return "";
    }
}

function InvasiveLegendTitle(filters: InvasiveFilters, countryMode: boolean): ReactNode {
    const { t } = useTranslation();

    if (countryMode) {
        return t("common.themes.treatment");
    }
    switch (filters.mapType) {
        case InvasiveMapType.VECTOR_OCCURANCE:
            return t("common.invasive.vector_occurrance");
        default:
            return "";
    }
}
