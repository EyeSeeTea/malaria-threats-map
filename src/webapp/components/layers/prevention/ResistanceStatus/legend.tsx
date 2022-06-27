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
import { selectPreventionFilters } from "../../../../store/reducers/prevention-reducer";

import { setLegendExpandedAction } from "../../../../store/actions/base-actions";
import { connect } from "react-redux";

const mapStateToProps = (state: State) => ({
    legendExpanded: selectLegendExpanded(state),
    preventionFilters: selectPreventionFilters(state),

});

const mapDispatchToProps = {
    setLegendExpanded: setLegendExpandedAction,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function Legend({ legendExpanded, preventionFilters }: Props) {
    const { t } = useTranslation();
    console.log(preventionFilters)
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
    /*
                {
                label: "prevention.legend.resistance_status.undetermined",
                color: "#BEBEBE",
            },
    */
    let labelsWithGrey;
    const greyLabel ={
        label: "prevention.legend.resistance_status.undetermined",
        color: "#BEBEBE",
    };
    if(preventionFilters.insecticideClass === "PYRROLES" && 
    (preventionFilters.insecticideTypes.includes("CHLORFENAPYR") || 
    preventionFilters.insecticideTypes.includes("PIRIMIPHOS-METHYL"))) {
        labelsWithGrey = labels.concat(greyLabel);
    }
    console.log(labelsWithGrey)
    /*
        only show the grey label for "pirimiphos-methly" and the new one "chlorfenapyr" (of class pyroles)
    */
    return (
        <LegendContainer>
            <LegendTitleContainer>
                <LegendTitleTypography color="textPrimary" gutterBottom>
                    {t("common.prevention.resistance_status")}
                </LegendTitleTypography>
                {legendExpanded && (
                    <LegendSubtitleTypography color="textPrimary" gutterBottom>
                        (min. adjusted mosquito mortality)
                    </LegendSubtitleTypography>
                )}
            </LegendTitleContainer>
            <LegendLabels labels={labelsWithGrey !== undefined ? labelsWithGrey : labels} />
            <LegendFooter />
        </LegendContainer>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Legend);
