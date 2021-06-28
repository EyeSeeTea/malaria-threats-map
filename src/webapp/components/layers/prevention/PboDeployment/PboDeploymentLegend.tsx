import React from "react";
import {
    LegendContainer,
    LegendLabels,
    LegendTitleContainer,
    LegendTitleTypography,
    LegendDescriptionText,
} from "../../../Leyend";
import { PboDeploymentColors, PboDeploymentStatus } from "./PboDeploymentSymbols";
import { useTranslation } from "react-i18next";
import { State } from "../../../../store/types";
import { selectLegendExpanded } from "../../../../store/reducers/base-reducer";
import { setLegendExpandedAction } from "../../../../store/actions/base-actions";
import { connect } from "react-redux";
import { Link } from "@material-ui/core";
import styled from "styled-components";

const mapStateToProps = (state: State) => ({
    legendExpanded: selectLegendExpanded(state),
});

const Description = styled.span`
    line-height: 18px;
`;

const mapDispatchToProps = {
    setLegendExpanded: setLegendExpandedAction,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function PboDeploymentLegend({ legendExpanded }: Props) {
    const { t } = useTranslation();
    const labels = [
        {
            label: !legendExpanded
                ? "prevention.legend.pbo_deployment.eligible"
                : "prevention.legend.pbo_deployment.expanded.eligible",
            color: PboDeploymentColors[PboDeploymentStatus.ELIGIBLE][0],
        },
        {
            label: !legendExpanded
                ? "prevention.legend.pbo_deployment.not_eligible"
                : "prevention.legend.pbo_deployment.expanded.not_eligible",
            color: PboDeploymentColors[PboDeploymentStatus.NOT_ELIGIBLE][0],
        },
        {
            label: !legendExpanded
                ? "prevention.legend.pbo_deployment.not_enough_data"
                : "prevention.legend.pbo_deployment.expanded.not_enough_data",
            color: PboDeploymentColors[PboDeploymentStatus.NOT_ENOUGH_DATA][0],
        },
        {
            label: !legendExpanded
                ? "prevention.legend.pbo_deployment.no_data"
                : "prevention.legend.pbo_deployment.expanded.no_data",
            color: PboDeploymentColors[PboDeploymentStatus.NO_DATA][0],
        },
    ];

    const legend = () => (
        <LegendDescriptionText>
            {t("common.prevention.legend.pbo_deployment.expanded.p1")}
            <Link href={t("common.prevention.legend.pbo_deployment.expanded.p1Link")} target={"_blank"}>
                {t("common.prevention.legend.pbo_deployment.expanded.p1a")}
            </Link>
            {t("common.prevention.legend.pbo_deployment.expanded.p2")}
        </LegendDescriptionText>
    );

    return (
        <LegendContainer>
            <LegendTitleContainer>
                <LegendTitleTypography color="textPrimary" gutterBottom>
                    {t("common.prevention.pbo_deployment_legend")}
                </LegendTitleTypography>
            </LegendTitleContainer>
            {legendExpanded && (
                <>
                    <Description>{legend()}</Description>
                    <br />
                    <br />
                </>
            )}
            <LegendLabels labels={labels} />
        </LegendContainer>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(PboDeploymentLegend);
