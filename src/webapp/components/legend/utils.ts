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
import { DiagnosisStatusColors } from "../layers/diagnosis/GeneDeletions/symbols";
import { DIAGNOSIS_STATUS } from "../layers/diagnosis/GeneDeletions/utils";
import { INVASIVE_STATUS } from "../layers/invasive/VectorOccurance/utils";
import { InvasiveStatusColors } from "../layers/invasive/VectorOccurance/vector-ocurrance-symbols";
import { IntensityStatusColors } from "../layers/prevention/IntensityStatus/symbols";
import { ResistanceStatusColors } from "../layers/prevention/ResistanceStatus/symbols";
import { INTENSITY_STATUS } from "../layers/prevention/IntensityStatus/utils";
import { LevelOfInvolvementColors } from "../layers/prevention/Involvement/symbols";
import { LEVEL_OF_INVOLVEMENT } from "../layers/prevention/Involvement/utils";
import { ResistanceMechanismColors } from "../layers/prevention/ResistanceMechanisms/symbols";
import { RESISTANCE_MECHANISM } from "../layers/prevention/ResistanceMechanisms/utils";
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
    invasiveFilters: InvasiveFilters
): string {
    switch (theme) {
        case "prevention":
            return getPreventionLegendTitle(preventionFilters);
        case "diagnosis":
            return getDiagnosisLegendTitle(diagnosisFilters);
        case "treatment":
            return getTreatmentLegendTitle(treatmentFilters);
        case "invasive":
            return getInvasiveLegendTitle(invasiveFilters);
        default:
            return "";
    }
}

function getPreventionLegendTitle(filters: PreventionFilters): string {
    switch (filters.mapType) {
        case PreventionMapType.RESISTANCE_STATUS:
            return i18next.t("common.prevention.resistance_status");
        case PreventionMapType.INTENSITY_STATUS:
            return i18next.t("common.prevention.resistance_intensity");
        case PreventionMapType.RESISTANCE_MECHANISM:
            return i18next.t("common.prevention.resistance_mechanism");
        case PreventionMapType.LEVEL_OF_INVOLVEMENT:
            return i18next.t("common.prevention.synergist_involvement_legend");
        default:
            return "";
    }
}

function getDiagnosisLegendTitle(filters: DiagnosisFilters) {
    return i18next.t(`common.diagnosis.legend.gene_deletions.${filters.deletionType}`);
}

function getTreatmentLegendTitle(filters: TreatmentFilters): string {
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

function getInvasiveLegendTitle(filters: InvasiveFilters): string {
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
    invasiveFilters: InvasiveFilters
): LegendLabel[] {
    switch (theme) {
        case "prevention":
            return getPreventionLegendLabels(preventionFilters);
        case "diagnosis":
            return getDiagnosisLegendLabels(diagnosisFilters);
        case "treatment":
            return getTreatmentLegendLabels(treatmentFilters);
        case "invasive":
            return getInvasiveLegendLabels(invasiveFilters);
        default:
            return [];
    }
}

function getPreventionLegendLabels(filters: PreventionFilters): LegendLabel[] {
    const resistanceStatusLabels = [
        {
            label: "prevention.legend.resistance_status.confirmed",
            color: ResistanceStatusColors.Confirmed[0],
        },
        {
            label: "prevention.legend.resistance_status.possible",
            color: ResistanceStatusColors.Possible[0],
        },
        {
            label: "prevention.legend.resistance_status.susceptible",
            color: ResistanceStatusColors.Susceptible[0],
        },
    ];
    const greyLabel = {
        label: "prevention.legend.resistance_status.undetermined",
        color: ResistanceStatusColors.Undetermined[0],
    };

    switch (filters.mapType) {
        case PreventionMapType.RESISTANCE_STATUS:
            return filters.insecticideClass === "PYRROLES" || filters.insecticideClass === "ORGANOPHOSPHATES"
                ? resistanceStatusLabels.concat(greyLabel)
                : resistanceStatusLabels;

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
                    label: "prevention.legend.synergist_involvement.full_restoration",
                    color: LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.FULL_INVOLVEMENT][0],
                },
                {
                    label: "prevention.legend.synergist_involvement.partial_restoration",
                    color: LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.PARTIAL_INVOLVEMENT][0],
                },
                {
                    label: "prevention.legend.synergist_involvement.no_restoration",
                    color: LevelOfInvolvementColors[LEVEL_OF_INVOLVEMENT.NO_INVOLVEMENT][0],
                },
            ];
        default:
            return [];
    }
}

function getDiagnosisLegendLabels(_: DiagnosisFilters): LegendLabel[] {
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

function getTreatmentLegendLabels(filters: TreatmentFilters): LegendLabel[] {
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

function getInvasiveLegendLabels(filters: InvasiveFilters): LegendLabel[] {
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
