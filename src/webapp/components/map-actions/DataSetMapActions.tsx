import React, { useMemo } from "react";

import { connect } from "react-redux";
import ActionGroupItem from "./ActionGroupItem";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { selectFilters, selectRegion, selectTheme } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import { selectInvasiveFilters } from "../../store/reducers/invasive-reducer";
import { selectDiagnosisFilters } from "../../store/reducers/diagnosis-reducer";
import { selectTreatmentFilters } from "../../store/reducers/treatment-reducer";
import { getDataset } from "./utils";
import DataSetSelector from "../DataDownload/filters/DataSetSelector";

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
    region: selectRegion(state),
    yearFilters: selectFilters(state),
});

const mapDispatchToProps = {};

type DispatchProps = typeof mapDispatchToProps;
type StateProps = ReturnType<typeof mapStateToProps>;
type Props = DispatchProps & StateProps;

const DataSetMapActions: React.FC<Props> = ({
    theme,
    preventionFilters,
    invasiveFilters,
    diagnosisFilters,
    treatmentFilters,
}) => {
    const { t } = useTranslation();

    const selectedDataset = useMemo(() => {
        return getDataset(theme, preventionFilters, treatmentFilters, diagnosisFilters, invasiveFilters);
    }, [theme, preventionFilters, diagnosisFilters, invasiveFilters, treatmentFilters]);

    return (
        <ActionGroupItem
            childrenMaxHeight={"420px"}
            placeholder={t("mapActions.selectDataset")}
            value={
                selectedDataset && (
                    <span>
                        <Label>{t("mapActions.dataset")}:&nbsp;</Label>
                        <Value>{t(selectedDataset)}</Value>
                    </span>
                )
            }
            actionGroupKey={"DATASET"}
        >
            {theme !== "diagnosis" && theme !== "invasive" && <DataSetSelector />}
        </ActionGroupItem>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(DataSetMapActions);
