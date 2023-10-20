import { LastUpdatedDates } from "../../../domain/entities/LastUpdateDates";
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

export function useLastUpdatedDatesByThemeAndMapType(
    lastUpdatedDates: LastUpdatedDates,
    theme: string,
    preventionFilters: PreventionFilters,
    treatmentFilters: TreatmentFilters,
    diagnosisFilters: DiagnosisFilters,
    invasiveFilters: InvasiveFilters
) {
    switch (theme) {
        case "prevention":
            return getPreventionLastUpdatedDates(lastUpdatedDates, preventionFilters);
        case "diagnosis":
            return getDiagnosisLastUpdatedDates(lastUpdatedDates, diagnosisFilters);
        case "treatment":
            return getTreatmentLastUpdatedDates(lastUpdatedDates, treatmentFilters);
        case "invasive":
            return getInvasiveLastUpdatedDates(lastUpdatedDates, invasiveFilters);
    }
}

function getPreventionLastUpdatedDates(lastUpdatedDates: LastUpdatedDates, preventionFilters: PreventionFilters): Date {
    switch (preventionFilters.mapType) {
        case PreventionMapType.RESISTANCE_STATUS:
            return lastUpdatedDates.VIR_DIS;
        case PreventionMapType.INTENSITY_STATUS:
            return lastUpdatedDates.VIR_INT;
        case PreventionMapType.RESISTANCE_MECHANISM:
            return lastUpdatedDates.VIR_RMD;
        case PreventionMapType.LEVEL_OF_INVOLVEMENT:
            return lastUpdatedDates.VIR_SYN;
    }
}

function getTreatmentLastUpdatedDates(lastUpdatedDates: LastUpdatedDates, treatmentFilters: TreatmentFilters): Date {
    switch (treatmentFilters.mapType) {
        case TreatmentMapType.DELAYED_PARASITE_CLEARANCE:
            return lastUpdatedDates.AMDER_TES;
        case TreatmentMapType.TREATMENT_FAILURE:
            return lastUpdatedDates.AMDER_TES;
        case TreatmentMapType.MOLECULAR_MARKERS:
            return lastUpdatedDates.AMDER_MM;
        case TreatmentMapType.THERAPEUTIC_EFFICACY_STUDIES:
            return lastUpdatedDates.AMDERO_TES;
        case TreatmentMapType.MOLECULAR_MARKERS_ONGOING_STUDIES:
            return lastUpdatedDates.AMDERO_MM;
    }
}

function getDiagnosisLastUpdatedDates(lastUpdatedDates: LastUpdatedDates, diagnosisFilters: DiagnosisFilters): Date {
    switch (diagnosisFilters.mapType) {
        case DiagnosisMapType.GENE_DELETIONS:
            return lastUpdatedDates.HRP;
        case DiagnosisMapType.HRP23_STUDIES:
            return lastUpdatedDates.HRPO;
    }
}

function getInvasiveLastUpdatedDates(lastUpdatedDates: LastUpdatedDates, invasiveFilters: InvasiveFilters): Date {
    switch (invasiveFilters.mapType) {
        case InvasiveMapType.VECTOR_OCCURANCE:
            return lastUpdatedDates.INV;
    }
}
