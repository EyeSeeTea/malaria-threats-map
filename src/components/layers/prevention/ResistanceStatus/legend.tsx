import React from "react";
import {
    LegendFooter,
    LegendLabels,
    LegendSubtitleTypography,
    LegendTitleContainer,
    LegendTitleTypography,
} from "../../../Leyend";
import { useTranslation } from "react-i18next";
import LegendContainer from "../../../LegendContainer";
import { State } from "../../../../store/types";
import { selectLegendExpanded } from "../../../../store/reducers/base-reducer";
import { setLegendExpandedAction } from "../../../../store/actions/base-actions";
import { connect } from "react-redux";

const mapStateToProps = (state: State) => ({
    legendExpanded: selectLegendExpanded(state),
});

const mapDispatchToProps = {
    setLegendExpanded: setLegendExpandedAction,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function Legend({ legendExpanded }: Props) {
    const { t } = useTranslation("common");
    const labels = [
        {
            label: "prevention.legend.resistance_status.confirmed",
            color: "#d43501",
        },
        {
            label: "prevention.legend.resistance_status.possible",
            color: "#ff9502",
        },
        {
            label: "prevention.legend.resistance_status.susceptible",
            color: "#869c66",
        },
    ];
    return (
        <LegendContainer>
            <LegendTitleContainer>
                <LegendTitleTypography color="textPrimary" gutterBottom>
                    {t("prevention.resistance_status")}
                </LegendTitleTypography>
                {legendExpanded && (
                    <LegendSubtitleTypography color="textPrimary" gutterBottom>
                        (min. adjusted mosquito mortality)
                    </LegendSubtitleTypography>
                )}
            </LegendTitleContainer>
            <LegendLabels labels={labels} />
            <LegendFooter />
        </LegendContainer>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Legend);
