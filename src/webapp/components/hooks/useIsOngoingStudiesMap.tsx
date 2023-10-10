import { useEffect, useState } from "react";
import { DiagnosisMapType, State, TreatmentMapType } from "../../store/types";
import { useSelector } from "react-redux";

export const useIsOngoingStudiesMap = () => {
    const theme = useSelector((state: State) => state.malaria.theme);
    const diagnosisFilters = useSelector((state: State) => state.diagnosis.filters);
    const treatmentFilters = useSelector((state: State) => state.treatment.filters);
    console.log("theme", theme);

    const [isOngoingStudyMap, setIsOngoingStudyMap] = useState(false);
    useEffect(() => {
        switch (theme) {
            case "treatment": {
                setIsOngoingStudyMap(
                    [
                        TreatmentMapType.THERAPEUTIC_EFFICACY_STUDIES,
                        TreatmentMapType.MOLECULAR_MARKERS_ONGOING_STUDIES,
                    ].includes(treatmentFilters.mapType)
                );
                break;
            }
            case "diagnosis": {
                setIsOngoingStudyMap([DiagnosisMapType.HRP23_STUDIES].includes(diagnosisFilters.mapType));
                break;
            }
            default: {
                setIsOngoingStudyMap(false);
                break;
            }
        }
    }, [theme, diagnosisFilters.mapType, treatmentFilters.mapType]);

    return isOngoingStudyMap;
};
