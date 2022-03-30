import React, { useMemo } from "react";

import { connect } from "react-redux";
import FiltersContent from "../filters/container/FiltersContent";
import ActionGroupItem from "./ActionGroupItem";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { selectFilters, selectTheme } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { selectInvasiveFilters } from "../../store/reducers/invasive-reducer";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";

const Label = styled.span`
    font-weight: bold;
`;

const Value = styled.span`
    font-weight: normal;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    yearFilters: selectFilters(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;

const DataMapActions: React.FC<StateProps> = ({
    theme,
    preventionFilters,
    invasiveFilters,
    diagnosisFilters,
    treatmentFilters,
    yearFilters,
}) => {
    const { t } = useTranslation();

    const selectedFilters = useMemo(() => {
        const years = yearFilters.join("-");
        switch (theme) {
            case "prevention": {
                return `${t(preventionFilters.insecticideClass)} | ${years}`;
            }
            case "diagnosis": {
                return years;
            }
            case "invasive": {
                return years;
            }
            case "treatment": {
                return years;
            }
        }
    }, [theme, yearFilters, preventionFilters, diagnosisFilters, invasiveFilters, treatmentFilters, t]);

    return (
        <ActionGroupItem
            placeholder={t("mapActions.selectData")}
            actionGroupKey={"DATA"}
            value={
                selectedFilters && (
                    <span>
                        <Label>{t("mapActions.data")}:&nbsp;</Label>
                        <Value>{t(selectedFilters)}</Value>
                    </span>
                )
            }
        >
            <FiltersContent />
        </ActionGroupItem>
    );
};

export default connect(mapStateToProps)(DataMapActions);
