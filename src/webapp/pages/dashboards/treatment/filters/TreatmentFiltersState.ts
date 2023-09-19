import { MolecularMarker } from "../../../../components/filters/MolecularMarkerRadioFilter";

export interface TreatmentFiltersState {
    plasmodiumSpecies: string;
    drugs: string[];
    molecularMarker: MolecularMarker;
    years: [number, number];
    excludeLowerPatients: boolean;
    excludeLowerSamples: boolean;
    maxMinYears: [number, number];
    onPlasmodiumChange: (value: string) => void;
    onDrugsChange: (values: string[]) => void;
    onYearsChange: (years: [number, number]) => void;
    onExcludeLowerPatientsChange: (excludeLowerPatients: boolean) => void;
    onExcludeLowerSamplesChange: (excludeLowerSamples: boolean) => void;
    onMolecularMarkerChange: (molecularMarker: MolecularMarker) => void;
}
