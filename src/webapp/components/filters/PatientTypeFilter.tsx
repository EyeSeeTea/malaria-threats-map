import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectPatientType } from "../../store/reducers/translations-reducer";
import { selectDiagnosisFilters, selectDiagnosisStudies } from "../../store/reducers/diagnosis-reducer";
import { setDiagnosisPatientType } from "../../store/actions/diagnosis-actions";
import {
    filterByDeletionType,
    filterByRegion,
    filterBySurveyTypes,
    filterByYearRange,
} from "../layers/studies-filters";
import * as R from "ramda";
import { selectFilters, selectRegion } from "../../store/reducers/base-reducer";
import { logEventAction } from "../../store/actions/base-actions";
import { DiagnosisStudy } from "../../../domain/entities/DiagnosisStudy";
import SingleFilter from "./common/SingleFilter";
import { useTranslation } from "react-i18next";

const mapStateToProps = (state: State) => ({
    patientType: selectPatientType(state),
    studies: selectDiagnosisStudies(state),
    yearFilter: selectFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    region: selectRegion(state),
});

const mapDispatchToProps = {
    setPatientType: setDiagnosisPatientType,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const PatientTypeFilter: React.FC<Props> = ({ setPatientType, diagnosisFilters, studies, yearFilter, region }) => {
    const { t } = useTranslation();

    const filters = [
        filterByDeletionType(diagnosisFilters.deletionType),
        filterBySurveyTypes(diagnosisFilters.surveyTypes),
        filterByYearRange(yearFilter),
        filterByRegion(region),
    ];

    const filteredStudies: DiagnosisStudy[] = filters.reduce((studies, filter) => studies.filter(filter), studies);

    const uniques = R.uniq(R.map(R.prop("PATIENT_TYPE"), filteredStudies));

    const suggestions: any[] = uniques.map((patientType: string) => ({
        label: patientType,
        value: patientType,
    }));

    return (
        <SingleFilter
            label={t("common.filters.patient_type")}
            placeholder={t("common.filters.select_patient_type")}
            options={suggestions}
            onChange={setPatientType}
            value={diagnosisFilters.patientType}
            analyticsFilterAction={"patient"}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(PatientTypeFilter);
