import { LastUpdatedDates } from "../../../domain/entities/LastUpdateDates";
import { DiagnosisFilters, InvasiveFilters, PreventionFilters, TreatmentFilters } from "../../store/types";

export function useLastUpdatedDatesByThemeAndDataSet(
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
    switch (preventionFilters.dataset) {
        case "DISCRIMINATING_CONCENTRATION_BIOASSAY":
            return lastUpdatedDates.VIR_DIS;
        case "INTENSITY_CONCENTRATION_BIOASSAY":
            return lastUpdatedDates.VIR_INT;
        case "BIOCHEMICAL_ASSAY":
            return lastUpdatedDates.VIR_RMD;
        case "SYNERGIST-INSECTICIDE_BIOASSAY":
            return lastUpdatedDates.VIR_SYN;
        case "MOLECULAR_ASSAY":
            return lastUpdatedDates.VIR_SYN;
    }
}

function getTreatmentLastUpdatedDates(lastUpdatedDates: LastUpdatedDates, treatmentFilters: TreatmentFilters): Date {
    switch (treatmentFilters.dataset) {
        case "THERAPEUTIC_EFFICACY_STUDY":
            return lastUpdatedDates.AMDER_TES;
        case "MOLECULAR_MARKER_STUDY":
            return lastUpdatedDates.AMDER_MM;
        case "AMDERO_TES":
            return lastUpdatedDates.AMDERO_TES;
        case "AMDERO_MM":
            return lastUpdatedDates.AMDERO_MM;
    }
}

function getDiagnosisLastUpdatedDates(lastUpdatedDates: LastUpdatedDates, diagnosisFilters: DiagnosisFilters): Date {
    switch (diagnosisFilters.dataset) {
        case "PFHRP23_GENE_DELETIONS":
            return lastUpdatedDates.HRP;
        case "HRPO":
            return lastUpdatedDates.HRPO;
    }
}

function getInvasiveLastUpdatedDates(lastUpdatedDates: LastUpdatedDates, invasiveFilters: InvasiveFilters): Date {
    switch (invasiveFilters.dataset) {
        case "INVASIVE_VECTOR_SPECIES":
            return lastUpdatedDates.INV;
    }
}
