import React from "react";
import {
  LegendContainer,
  LegendLabels,
  LegendText,
  LegendTitleContainer,
  LegendTitleTypography
} from "../../../Leyend";
import {
  PboDeploymentColors,
  PboDeploymentStatus
} from "./PboDeploymentSymbols";
import { useTranslation } from "react-i18next";
import { State } from "../../../../store/types";
import { selectLegendExpanded } from "../../../../store/reducers/base-reducer";
import { setLegendExpandedAction } from "../../../../store/actions/base-actions";
import { connect } from "react-redux";
import { Link } from "@material-ui/core";

const mapStateToProps = (state: State) => ({
  legendExpanded: selectLegendExpanded(state)
});

const mapDispatchToProps = {
  setLegendExpanded: setLegendExpandedAction
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function PboDeploymentLegend({ legendExpanded }: Props) {
  const { t } = useTranslation("common");
  const labels = [
    {
      label: !legendExpanded
        ? "prevention.legend.pbo_deployment.eligible"
        : "All criteria met: sites where at least one vector species meets the three WHO recommended criteria described above.",
      color: PboDeploymentColors[PboDeploymentStatus.ELIGIBLE][0]
    },
    {
      label: !legendExpanded
        ? "prevention.legend.pbo_deployment.not_eligible"
        : "At least one criteria is not met: sites where one of the vector species for which data are available violates at least one of the three WHO recommended criteria described above and none of the species for which data are available meet the three WHO recommended criteria.",
      color: PboDeploymentColors[PboDeploymentStatus.NOT_ELIGIBLE][0]
    },
    {
      label: !legendExpanded
        ? "prevention.legend.pbo_deployment.not_enough_data"
        : "More data needs to be collected to evaluate criteria: sites with insufficient data to evaluate whether the local vector species meets the three criteria described above.",
      color: PboDeploymentColors[PboDeploymentStatus.NOT_ENOUGH_DATA][0]
    },
    {
      label: "prevention.legend.pbo_deployment.no_data",
      color: PboDeploymentColors[PboDeploymentStatus.NO_DATA][0]
    }
  ];
  return (
    <LegendContainer>
      <LegendTitleContainer>
        <LegendTitleTypography color="textPrimary" gutterBottom>
          {t("prevention.pbo_deployment_legend")}
        </LegendTitleTypography>
      </LegendTitleContainer>
      {legendExpanded && (
        <>
          <LegendText>
            WHO recommends the deployment of pyrethroid-PBO nets in areas where
            the main malaria vector(s) have pyrethroid resistance that is:
            <ul>
              <li>
                confirmed, meaning that mosquito mortality after exposure to a
                pyrethroid insecticide in WHO test kits or CDC bottle assays
                should be below 90%
              </li>
              <li>
                of intermediate level, meaning that mosquito mortality after
                exposure to a pyrethroid insecticide in WHO test kits or CDC
                bottle assays should be in the range 10% to 80%
              </li>
              <li>
                conferred (at least in part) by a monooxygenase-based resistance
                mechanism, as determined by standard procedures, namely either
                standard biochemical or molecular assays, or by means of
                standard synergist-insecticide bioassays.
              </li>
            </ul>
            This map shows the status of compliance of local vector populations
            with these WHO recommended criteria at different geographical sites
            or areas. The status has been evaluated based on data included in
            the Global database on insecticide resistance in malaria vectors{" "}
            <Link href={"http://apps.who.int/malaria/maps/threats"}>
              Malaria Threats Map
            </Link>
            . The map shows the status of compliance with these criteria for the
            vector species selected on the filter pane. If no species have been
            filtered, the map considers all data available for any species to
            evaluate the criteria.
          </LegendText>
          <br />
          <br />
        </>
      )}
      <LegendLabels labels={labels} />
    </LegendContainer>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PboDeploymentLegend);
