import React from "react";
import {
    LegendContainer,
    LegendFooter,
    LegendLabels,
    LegendTitleContainer,
    LegendTitleTypography,
} from "../../../Leyend";
import { DIAGNOSIS_STATUS } from "./utils";
import { DiagnosisStatusColors } from "./symbols";
import { useTranslation } from "react-i18next";
import { State } from "../../../../store/types";
import { connect } from "react-redux";
import { selectDiagnosisFilters } from "../../../../store/reducers/diagnosis-reducer";

const mapStateToProps = (state: State) => ({
    filters: selectDiagnosisFilters(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;

type Props = StateProps;

function Legend({ filters }: Props) {
    const { t } = useTranslation();
    const labels = [
        {
            label: "diagnosis.legend.gene_deletions.confirmed",
            color: DiagnosisStatusColors[DIAGNOSIS_STATUS.CONFIRMED][0],
        },
        {
            label: "diagnosis.legend.gene_deletions.not_identified",
            color: DiagnosisStatusColors[DIAGNOSIS_STATUS.NOT_IDENTIFIED][0],
        },
    ];
    return (
        <LegendContainer>
            <LegendTitleContainer>
                <LegendTitleTypography color="textPrimary" gutterBottom>
                    {t(`common.diagnosis.legend.gene_deletions.${filters.deletionType}`)}
                </LegendTitleTypography>
            </LegendTitleContainer>
            <LegendLabels labels={labels} />
            <LegendFooter />
        </LegendContainer>
    );
}

export default connect(mapStateToProps, null)(Legend);
