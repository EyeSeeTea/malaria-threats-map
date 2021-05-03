import React, { useEffect } from "react";
import {
    LegendContainer,
    LegendFooter,
    LegendLabels,
    LegendSubtitleTypography,
    LegendTitleContainer,
    LegendTitleTypography,
} from "../../../Leyend";
import { TREATMENT_FAILURE_STATUS } from "./utils";
import { TreatmentFailureColors } from "./treatmentLayerSymbols";
import { useTranslation } from "react-i18next";
import { State } from "../../../../store/types";
import { connect } from "react-redux";
import { selectTreatmentFilters } from "../../../../store/reducers/treatment-reducer";
import T from "../../../../translations/T";

const mapStateToProps = (state: State) => ({
    treatmentFilters: selectTreatmentFilters(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps;

function TreatmentFailureLeyend({ treatmentFilters }: Props) {
    const { t } = useTranslation("common");
    const [show, setShow] = React.useState(false);

    useEffect(() => {
        setTimeout(() => setShow(true), 1000);
    }, []);
    const labels = [
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
    return (
        <LegendContainer>
            <LegendTitleContainer>
                <LegendTitleTypography color="textPrimary" gutterBottom>
                    {t("treatment.treatment_failure")}
                </LegendTitleTypography>
                <LegendSubtitleTypography>{show && <T i18nKey={treatmentFilters.drug}></T>}</LegendSubtitleTypography>
            </LegendTitleContainer>
            <LegendLabels labels={labels} />
            <LegendFooter />
        </LegendContainer>
    );
}

export default connect(mapStateToProps, null)(TreatmentFailureLeyend);
