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
import { ResistanceStatusColors } from "./symbols";
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
    const labels = [
        {
            label: "prevention.legend.resistance_status.confirmed",
            color: ResistanceStatusColors.Confirmed[0],
        },
        {
            label: "prevention.legend.resistance_status.possible",
            color: ResistanceStatusColors.Possible[0],
        },
        {
            label: "prevention.legend.resistance_status.susceptible",
            color: ResistanceStatusColors.Susceptible[0],
        },
    ];

    const affectedInsecticideClasses = ["PYRROLES", "ORGANOPHOSPHATES"];
    const isPirimiphosMethyl =
        preventionFilters.insecticideClass === "ORGANOPHOSPHATES" &&
        preventionFilters.insecticideTypes.includes("PIRIMIPHOS-METHYL");
    const isChlorfenapyr =
        preventionFilters.insecticideClass === "PYRROLES" &&
        preventionFilters.insecticideTypes.includes("CHLORFENAPYR");

    const greyLabelExtended = isPirimiphosMethyl
        ? "prevention.extended_legend.resistance_status.pyrroles.pirimiphos_methly_undetermined"
        : isChlorfenapyr
        ? "prevention.extended_legend.resistance_status.pyrroles.chlorfenapyr_undetermined"
        : null;

    const greyLabel = {
        label: "prevention.legend.resistance_status.undetermined",
        color: ResistanceStatusColors.Undetermined[0],
        extendedLabel: greyLabelExtended,
    };
    const labelsWithGrey = affectedInsecticideClasses.includes(preventionFilters.insecticideClass)
        ? labels.concat(greyLabel)
        : labels;

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
            <LegendLabels
                legendExpanded={legendExpanded}
                labels={labelsWithGrey !== undefined ? labelsWithGrey : labels}
            />
            <LegendFooter />
        </LegendContainer>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Legend);
