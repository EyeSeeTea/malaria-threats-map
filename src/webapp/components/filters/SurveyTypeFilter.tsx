import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { Option } from "../BasicSelect";
import { Translation } from "../../types/Translation";
import { selectSurveyTypes } from "../../store/reducers/translations-reducer";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { setDiagnosisSurveyTypes } from "../../store/actions/diagnosis-actions";
import MultiFilter from "./common/MultiFilter";
import { useTranslation } from "react-i18next";

const mapStateToProps = (state: State) => ({
    surveyTypes: selectSurveyTypes(state),
    diagnosisFilters: selectDiagnosisFilters(state),
});

const mapDispatchToProps = {
    setSurveyTypes: setDiagnosisSurveyTypes,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const SurveyTypeFilter: React.FC<Props> = ({ diagnosisFilters, surveyTypes, setSurveyTypes }) => {
    const { t } = useTranslation();

    const suggestions: Option[] = (surveyTypes as Translation[]).map((country: Translation) => ({
        label: country.VALUE_,
        value: country.VALUE_,
    }));

    return (
        <MultiFilter
            label={t("common.filters.survey_type")}
            placeholder={t("common.filters.select_survey_type")}
            options={suggestions}
            onChange={setSurveyTypes}
            value={diagnosisFilters.surveyTypes}
            analyticsMultiFilterAction={"surveyType"}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(SurveyTypeFilter);
