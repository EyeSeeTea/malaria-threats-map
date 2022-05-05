import i18next from "i18next";
import {
    DiagnosisFilters,
    DiagnosisMapType,
    InvasiveFilters,
    InvasiveMapType,
    PreventionFilters,
    PreventionMapType,
    TreatmentFilters,
    TreatmentMapType,
} from "../../store/types";
import { DiagnosisCountryColors } from "../layers/diagnosis/Countries/DiagnosisCountrySymbols";
import { DiagnosisStatusColors } from "../layers/diagnosis/GeneDeletions/symbols";
import { DIAGNOSIS_STATUS } from "../layers/diagnosis/GeneDeletions/utils";
import { INVASIVE_STATUS } from "../layers/invasive/VectorOccurance/utils";
import { InvasiveStatusColors } from "../layers/invasive/VectorOccurance/vector-ocurrance-symbols";
import { PreventionCountryColors } from "../layers/prevention/Countries/PreventionCountrySymbols";
import { IntensityStatusColors } from "../layers/prevention/IntensityStatus/symbols";
import { INTENSITY_STATUS } from "../layers/prevention/IntensityStatus/utils";
import { LevelOfInvolvementColors } from "../layers/prevention/Involvement/symbols";
import { LEVEL_OF_INVOLVEMENT } from "../layers/prevention/Involvement/utils";
import { PboDeploymentColors, PboDeploymentStatus } from "../layers/prevention/PboDeployment/PboDeploymentSymbols";
import { ResistanceMechanismColors } from "../layers/prevention/ResistanceMechanisms/symbols";
import { RESISTANCE_MECHANISM } from "../layers/prevention/ResistanceMechanisms/utils";
import { TreatmentCountryColors } from "../layers/treatment/Countries/treatment-country-symbols";
import { DelayedParasiteClearanceColors } from "../layers/treatment/DelayedParasiteClearance/delayedParasiteClearanceSymbols";
import { DELAYED_PARASITE_CLEARANCE_STATUS } from "../layers/treatment/DelayedParasiteClearance/utils";
import { MolecularMarkerColors } from "../layers/treatment/MolecularMarkers/molecularMarkerSymbols";
import { MOLECULAR_MARKER_STATUS } from "../layers/treatment/MolecularMarkers/utils";
import { TreatmentFailureColors } from "../layers/treatment/TreatmentFailure/treatmentLayerSymbols";
import { TREATMENT_FAILURE_STATUS } from "../layers/treatment/TreatmentFailure/utils";
import { LegendLabel } from "./LegendContent";

import { MOLECULAR_MARKERS } from "../filters/MolecularMarkerFilter";

export function getLegendTitle(
    theme: string,
    preventionFilters: PreventionFilters,
    diagnosisFilters: DiagnosisFilters,
    treatmentFilters: TreatmentFilters,
    invasiveFilters: InvasiveFilters,
    countryMode: boolean
): string {
    switch (theme) {
        case "prevention":
            return getPreventionLegendTitle(preventionFilters, countryMode);
        case "diagnosis":
            return getDiagnosisLegendTitle(diagnosisFilters, countryMode);
        case "treatment":
            return getTreatmentLegendTitle(treatmentFilters, countryMode);
        case "invasive":
            return getInvasiveLegendTitle(invasiveFilters, countryMode);
        default:
            return "";
    }
}

function getPreventionLegendTitle(filters: PreventionFilters, countryMode: boolean): string {
    if (countryMode) {
        if (filters.mapType === PreventionMapType.PBO_DEPLOYMENT) {
            return i18next.t("common.prevention.pbo_deployment_legend");
        } else {
            return i18next.t("common.themes.prevention");
        }
    }

    switch (filters.mapType) {
        case PreventionMapType.RESISTANCE_STATUS:
            return i18next.t("common.prevention.resistance_status");
        case PreventionMapType.INTENSITY_STATUS:
            return i18next.t("common.prevention.resistance_intensity");
        case PreventionMapType.RESISTANCE_MECHANISM:
            return i18next.t("common.prevention.resistance_mechanism");
        case PreventionMapType.LEVEL_OF_INVOLVEMENT:
            return i18next.t("common.prevention.synergist_involvement_legend");
        case PreventionMapType.PBO_DEPLOYMENT:
            return i18next.t("common.prevention.pbo_deployment_legend");
        default:
            return "";
    }
}

function getDiagnosisLegendTitle(filters: DiagnosisFilters, countryMode: boolean) {
    if (countryMode) {
        return i18next.t("common.themes.diagnosis");
    }
    return i18next.t(`common.diagnosis.legend.gene_deletions.${filters.deletionType}`);
}

function getTreatmentLegendTitle(filters: TreatmentFilters, countryMode: boolean): string {
    if (countryMode) {
        return i18next.t("common.themes.treatment");
    }

    switch (filters.mapType) {
        case TreatmentMapType.TREATMENT_FAILURE:
            return `${i18next.t("common.treatment.treatment_failure")}\n${i18next.t(filters.drug)}`;
        case TreatmentMapType.DELAYED_PARASITE_CLEARANCE:
            return `${i18next.t("common.treatment.delayed_parasite_clearance")}\n${i18next.t(filters.drug)}`;
        case TreatmentMapType.MOLECULAR_MARKERS:
            return `${i18next.t("common.treatment.molecular_markers")} (
                ${MOLECULAR_MARKERS[filters.molecularMarker - 1].label})`;
        default:
            return "";
    }
}

function getInvasiveLegendTitle(filters: InvasiveFilters, countryMode: boolean): string {
    if (countryMode) {
        return i18next.t("common.themes.treatment");
    }
    switch (filters.mapType) {
        case InvasiveMapType.VECTOR_OCCURANCE:
            return i18next.t("common.invasive.vector_occurrance");
        default:
            return "";
    }
}

export function getLegendLabels(
    theme: string,
    preventionFilters: PreventionFilters,
    diagnosisFilters: DiagnosisFilters,
    treatmentFilters: TreatmentFilters,
    invasiveFilters: InvasiveFilters,
    countryMode: boolean
): LegendLabel[] {
    switch (theme) {
        case "prevention":
            return getPreventionLegendLebels(preventionFilters, countryMode);
        case "diagnosis":
            return getDiagnosisLegendLabels(diagnosisFilters, countryMode);
        case "treatment":
            return getTreatmentLegendLabels(treatmentFilters, countryMode);
        case "invasive":
            return getInvasiveLegendLabels(invasiveFilters, countryMode);
        default:
            return [];
    }
}

function getPreventionLegendLebels(filters: PreventionFilters, countryMode: boolean): LegendLabel[] {
    if (countryMode) {
        if (filters.mapType === PreventionMapType.PBO_DEPLOYMENT) {
            return [
                {
                    label: "prevention.legend.pbo_deployment.countries_legend.at_least_one_site",
                    color: PboDeploymentColors[PboDeploymentStatus.ELIGIBLE][0],
                },
                {
                    label: "prevention.legend.pbo_deployment.countries_legend.insufficient_to_judge",
                    color: PboDeploymentColors[PboDeploymentStatus.NOT_ENOUGH_DATA][0],
                },
                {
                    label: "prevention.legend.pbo_deployment.countries_legend.no_reports_available",
                    color: PboDeploymentColors[PboDeploymentStatus.NOT_ELIGIBLE][0],
                },
                {
                    label: "prevention.legend.pbo_deployment.countries_legend.not_malaria_endemic",
                    color: "#FFFFFF",
                    border: true,
                },
                {
                    label: "prevention.legend.pbo_deployment.countries_legend.not_applicable",
                    color: "#AAAAAA",
                },
            ];
        } else {
            return [
                {
                    label: "legend.number_of_studies",
                    color: PreventionCountryColors.COUNTRIES[0],
                },
            ];
        }
    }

    switch (filters.mapType) {
        case PreventionMapType.RESISTANCE_STATUS:
            return [
                {
                    label: "prevention.legend.resistance_status.confirmed",
                    color: "#d43501",
                },
                {
                    label: "prevention.legend.resistance_status.possible",
                    color: "#ff9502",
                },
                {
                    label: "prevention.legend.resistance_status.susceptible",
                    color: "#869c66",
                },
            ];
        case PreventionMapType.INTENSITY_STATUS:
            return [
                {
                    label: "prevention.legend.resistance_intensity.high_intensity",
                    color: IntensityStatusColors[INTENSITY_STATUS.HIGH_INTENSITY][0],
                },
                {
                    label: "prevention.legend.resistance_intensity.moderate_to_high_intensity",
                    color: IntensityStatusColors[INTENSITY_STATUS.MODERATE_TO_HIGH_INTENSITY][0],
                },
                {
                    label: "prevention.legend.resistance_intensity.moderate_intensity",
                    color: IntensityStatusColors[INTENSITY_STATUS.MODERATE_INTENSITY][0],
                },
                {
                    label: "prevention.legend.resistance_intensity.low_intensity",
                    color: IntensityStatusColors[INTENSITY_STATUS.LOW_INTENSITY][0],
                },
                {
                    label: "prevention.legend.resistance_intensity.susceptible",
                    color: IntensityStatusColors[INTENSITY_STATUS.SUSCEPTIBLE][0],
                },
            ];
        case PreventionMapType.RESISTANCE_MECHANISM:
            return [
                {
                    label: "prevention.legend.resistance_mechanism.confirmed",
                    color: ResistanceMechanismColors[RESISTANCE_MECHANISM.CONFIRMED][0],
                },
                {
                    label: "prevention.legend.resistance_mechanism.not_confirmed",
                    color: ResistanceMechanismColors[RESISTANCE_MECHANISM.NOT_CONFIRMED][0],
                },
            ];
        case PreventionMapType.LEVEL_OF_INVOLVEMENT:
            return [
                {
                    label: "prevention.legend.synergist_involvement.full_involvement",
                    color: LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.FULL_INVOLVEMENT][0],
                },
                {
                    label: "prevention.legend.synergist_involvement.partial_involvement",
                    color: LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.PARTIAL_INVOLVEMENT][0],
                },
                {
                    label: "prevention.legend.synergist_involvement.no_involvement",
                    color: LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.NO_INVOLVEMENT][0],
                },
            ];
        case PreventionMapType.PBO_DEPLOYMENT:
            return [
                {
                    label: "prevention.legend.pbo_deployment.eligible",

                    color: PboDeploymentColors[PboDeploymentStatus.ELIGIBLE][0],
                },
                {
                    label: "prevention.legend.pbo_deployment.not_eligible",
                    color: PboDeploymentColors[PboDeploymentStatus.NOT_ELIGIBLE][0],
                },
                {
                    label: "prevention.legend.pbo_deployment.not_enough_data",
                    color: PboDeploymentColors[PboDeploymentStatus.NOT_ENOUGH_DATA][0],
                },
            ];
        default:
            return [];
    }
}

function getDiagnosisLegendLabels(filters: DiagnosisFilters, countryMode: boolean): LegendLabel[] {
    if (countryMode) {
        return [
            {
                label: "legend.number_of_surveys",
                color: DiagnosisCountryColors.COUNTRIES[0],
            },
        ];
    }
    return [
        {
            label: "diagnosis.legend.gene_deletions.confirmed",
            color: DiagnosisStatusColors[DIAGNOSIS_STATUS.CONFIRMED][0],
        },
        {
            label: "diagnosis.legend.gene_deletions.not_identified",
            color: DiagnosisStatusColors[DIAGNOSIS_STATUS.NOT_IDENTIFIED][0],
        },
    ];
}

function getTreatmentLegendLabels(filters: TreatmentFilters, countryMode: boolean): LegendLabel[] {
    if (countryMode) {
        return [
            {
                label: "legend.number_of_studies",
                color: TreatmentCountryColors.COUNTRIES[0],
            },
        ];
    }
    switch (filters.mapType) {
        case TreatmentMapType.TREATMENT_FAILURE:
            return [
                {
                    label: "treatment.legend.treatment_failure.high",
                    color: TreatmentFailureColors[TREATMENT_FAILURE_STATUS.HIGH][0],
                },
                {
                    label: "treatment.legend.treatment_failure.medium_high",
                    color: TreatmentFailureColors[TREATMENT_FAILURE_STATUS.MEDIUM_HIGH][0],
                },
                {
                    label: "treatment.legend.treatment_failure.medium",
                    color: TreatmentFailureColors[TREATMENT_FAILURE_STATUS.MEDIUM][0],
                },
                {
                    label: "treatment.legend.treatment_failure.low",
                    color: TreatmentFailureColors[TREATMENT_FAILURE_STATUS.LOW][0],
                },
                {
                    label: "treatment.legend.treatment_failure.unknown",
                    color: TreatmentFailureColors[TREATMENT_FAILURE_STATUS.UNKNOWN][0],
                },
            ];
        case TreatmentMapType.DELAYED_PARASITE_CLEARANCE:
            return [
                {
                    label: "treatment.legend.delayed_parasite_clearance.high",
                    color: DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.HIGH][0],
                },
                {
                    label: "treatment.legend.delayed_parasite_clearance.medium_high",
                    color: DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM_HIGH][0],
                },
                {
                    label: "treatment.legend.delayed_parasite_clearance.medium",
                    color: DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM][0],
                },
                {
                    label: "treatment.legend.delayed_parasite_clearance.low",
                    color: DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.LOW][0],
                },
                {
                    label: "treatment.legend.delayed_parasite_clearance.unknown",
                    color: DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.UNKNOWN][0],
                },
            ];

        case TreatmentMapType.MOLECULAR_MARKERS:
            return [
                {
                    label: "treatment.legend.molecular_markers.high",
                    color: MolecularMarkerColors[MOLECULAR_MARKER_STATUS.HIGH][0],
                },
                {
                    label: "treatment.legend.molecular_markers.medium_high",
                    color: MolecularMarkerColors[MOLECULAR_MARKER_STATUS.MEDIUM_HIGH][0],
                },
                {
                    label: "treatment.legend.molecular_markers.medium",
                    color: MolecularMarkerColors[MOLECULAR_MARKER_STATUS.MEDIUM][0],
                },
                {
                    label: "treatment.legend.molecular_markers.low",
                    color: MolecularMarkerColors[MOLECULAR_MARKER_STATUS.LOW][0],
                },
            ];
        default:
            return [];
    }
}

function getInvasiveLegendLabels(filters: InvasiveFilters, countryMode: boolean): LegendLabel[] {
    if (countryMode) {
        return [
            {
                label: "legend.number_of_studies",
                color: TreatmentCountryColors.COUNTRIES[0],
            },
        ];
    }
    switch (filters.mapType) {
        case InvasiveMapType.VECTOR_OCCURANCE:
            return [
                {
                    label: "invasive.legend.vector_occurrance.invasive",
                    color: InvasiveStatusColors[INVASIVE_STATUS.INVASIVE][0],
                },
                {
                    label: "invasive.legend.vector_occurrance.native",
                    color: InvasiveStatusColors[INVASIVE_STATUS.NATIVE][0],
                },
            ];
        default:
            return [];
    }
}

export function getLegendMapTypeHelpKey(
    theme: string,
    preventionFilters: PreventionFilters,
    diagnosisFilters: DiagnosisFilters,
    treatmentFilters: TreatmentFilters,
    invasiveFilters: InvasiveFilters
): string {
    switch (theme) {
        case "prevention":
            return getPreventionLegendMapTypeHelpKey(preventionFilters);
        case "diagnosis":
            return getDiagnosisLegendMapTypeHelpKey(diagnosisFilters);
        case "treatment":
            return getTreatmentLegendMapTypeHelpKey(treatmentFilters);
        case "invasive":
            return getInvasiveLegendMapTypeHelpKey(invasiveFilters);
        default:
            return "";
    }
}

function getPreventionLegendMapTypeHelpKey(filters: PreventionFilters): string {
    switch (filters.mapType) {
        case PreventionMapType.RESISTANCE_STATUS:
            return "common.prevention.legend.resistance_status.help";
        case PreventionMapType.INTENSITY_STATUS:
            return "common.prevention.legend.resistance_intensity.help";
        case PreventionMapType.RESISTANCE_MECHANISM:
            return "common.prevention.legend.resistance_mechanism.help";
        case PreventionMapType.LEVEL_OF_INVOLVEMENT:
            return "common.prevention.legend.synergist_involvement.help";
        case PreventionMapType.PBO_DEPLOYMENT:
            return "common.prevention.legend.pbo_deployment.help";
        default:
            return "";
    }
}

function getDiagnosisLegendMapTypeHelpKey(filters: DiagnosisFilters) {
    switch (filters.mapType) {
        case DiagnosisMapType.GENE_DELETIONS:
            return "common.diagnosis.legend.gene_deletions.help";
        default:
            return "";
    }
}

function getTreatmentLegendMapTypeHelpKey(filters: TreatmentFilters): string {
    switch (filters.mapType) {
        case TreatmentMapType.TREATMENT_FAILURE:
            return "common.treatment.legend.treatment_failure.help";
        case TreatmentMapType.DELAYED_PARASITE_CLEARANCE:
            return "common.treatment.legend.delayed_parasite_clearance.help";
        case TreatmentMapType.MOLECULAR_MARKERS:
            return "common.treatment.legend.molecular_markers.help";
        default:
            return "";
    }
}

function getInvasiveLegendMapTypeHelpKey(filters: InvasiveFilters): string {
    switch (filters.mapType) {
        case InvasiveMapType.VECTOR_OCCURANCE:
            return "common.invasive.legend.vector_occurrance.help";
        default:
            return "";
    }
}
