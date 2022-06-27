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
import { selectPreventionFilters, selectFilteredPreventionStudies } from "../../../../store/reducers/prevention-reducer";

import { setLegendExpandedAction } from "../../../../store/actions/base-actions";
import { connect } from "react-redux";

const mapStateToProps = (state: State) => ({
    legendExpanded: selectLegendExpanded(state),
    preventionFilters: selectPreventionFilters(state),
    preventionStudies: selectFilteredPreventionStudies(state)

});

const mapDispatchToProps = {
    setLegendExpanded: setLegendExpandedAction,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function Legend({ legendExpanded, preventionFilters, preventionStudies }: Props) {
    const { t } = useTranslation();
    console.log(preventionFilters)
    console.log(preventionStudies)
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

    const greyLabelExtended =preventionFilters.insecticideClass === "PYRROLES" &&  preventionFilters.insecticideTypes.includes("CHLORFENAPYR") ?
    "Data collected with the formerly recommended discriminating concentration of 0.25%." :
    "Data collected with the recommended discriminating concentration of 100 µg/bottle but that do not fully match WHO criteria for test validation, either because temperature was not reported, because temperature fell outside of the recommended range (27 °C ± 2 °C), because no susceptible mosquito strain was tested in parallel or because results of the susceptible mosquito strain were not reported.  "
    const greyLabel ={
        label: "prevention.legend.resistance_status.undetermined",
        color: "#BEBEBE",
        extendedLabel: greyLabelExtended
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
            <LegendLabels legendExpanded={legendExpanded} labels={labelsWithGrey !== undefined ? labelsWithGrey : labels} />
            <LegendFooter />
        </LegendContainer>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Legend);
