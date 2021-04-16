import React, { useEffect } from "react";
import {
    LegendContainer,
    LegendFooter,
    LegendLabels,
    LegendSubtitleTypography,
    LegendTitleContainer,
    LegendTitleTypography,
} from "../../../Leyend";
import { DELAYED_PARASITE_CLEARANCE_STATUS } from "./utils";
import { DelayedParasiteClearanceColors } from "./delayedParasiteClearanceSymbols";
import { useTranslation } from "react-i18next";
import T from "../../../../translations/T";
import { connect } from "react-redux";
import { State } from "../../../../store/types";
import { selectTreatmentFilters } from "../../../../store/reducers/treatment-reducer";

const mapStateToProps = (state: State) => ({
    treatmentFilters: selectTreatmentFilters(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps;

function DelayedParasiteClearanceLeyend({ treatmentFilters }: Props) {
    const { t } = useTranslation("common");
    const [show, setShow] = React.useState(false);

    useEffect(() => {
        setTimeout(() => setShow(true), 1000);
    }, []);
    const labels = [
        {
            label: "treatment.legend.delayed_parasite_clearance.high",
            color: DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.HIGH][0],
        },
        {
            label: "treatment.legend.delayed_parasite_clearance.medium_high",
            color: DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM_HIGH][0],
        },
        {
            label: "treatment.legend.delayed_parasite_clearance.medium",
            color: DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.MEDIUM][0],
        },
        {
            label: "treatment.legend.delayed_parasite_clearance.low",
            color: DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.LOW][0],
        },
        {
            label: "treatment.legend.delayed_parasite_clearance.unknown",
            color: DelayedParasiteClearanceColors[DELAYED_PARASITE_CLEARANCE_STATUS.UNKNOWN][0],
        },
    ];
    return (
        <LegendContainer>
            <LegendTitleContainer>
                <LegendTitleTypography color="textPrimary" gutterBottom>
                    {t("treatment.delayed_parasite_clearance")}
                </LegendTitleTypography>
                <LegendSubtitleTypography>{show && <T i18nKey={treatmentFilters.drug}></T>}</LegendSubtitleTypography>
            </LegendTitleContainer>
            <LegendLabels labels={labels} />
            <LegendFooter />
        </LegendContainer>
    );
}
export default connect(mapStateToProps, null)(DelayedParasiteClearanceLeyend);
