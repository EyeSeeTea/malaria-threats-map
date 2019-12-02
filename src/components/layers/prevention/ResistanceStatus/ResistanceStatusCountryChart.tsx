import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Box, Button, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import { PreventionStudy } from "../../../../types/Prevention";
import * as R from "ramda";
import { resolveResistanceStatus } from "./utils";
import { ConfirmationStatusColors } from "./symbols";
import {
  setCountryModeAction,
  setRegionAction
} from "../../../../store/actions/base-actions";
import ZoomIcon from "@material-ui/icons/ZoomIn";
import { selectPreventionFilters } from "../../../../store/reducers/prevention-reducer";

const options: (data: any) => Highcharts.Options = data => ({
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: "pie",
    height: 250,
    style: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;'
    }
  },
  title: {
    text: "<b>Resistance status</b> (# of tests)"
  },
  tooltip: {
    pointFormat: "{series.name}: <b>{point.y}</b>"
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>: {point.y}"
      }
    }
  },
  series: [
    {
      type: "pie",
      innerSize: "50%",
      name: "Studies",
      colorByPoint: true,
      data
    }
  ],
  legend: {
    enabled: true
  },
  credits: {
    enabled: false
  }
});

const ChatContainer = styled.div`
  max-width: 500px;
`;

const Actions = styled.div`
  display: flex;
`;

const FlexGrow = styled.div`
  flex-grow: 1;
`;

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  preventionFilters: selectPreventionFilters(state)
});
const mapDispatchToProps = {
  setRegion: setRegionAction,
  setCountryMode: setCountryModeAction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
  studies: PreventionStudy[];
};
type Props = DispatchProps & StateProps & OwnProps;

const ResistanceStatusCountryChart = ({
  studies,
  setRegion,
  setCountryMode,
  preventionFilters
}: Props) => {
  const { t } = useTranslation("common");
  const nStudies = studies.length;
  const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
  const maxYear = sortedStudies[sortedStudies.length - 1].YEAR_START;
  const minYear = sortedStudies[0].YEAR_START;
  const richStudies = sortedStudies.map(study => {
    const percentage = parseFloat(study["MORTALITY_ADJUSTED"]);
    return {
      ...study,
      CONFIRMATION_STATUS: resolveResistanceStatus(percentage)
    };
  });
  const data = Object.entries(
    R.groupBy((study: any) => study.CONFIRMATION_STATUS, richStudies)
  ).map(([status, studies]: any[]) => ({
    name: status,
    y: studies.length,
    color: ConfirmationStatusColors[status][0]
  }));
  const onClick = () => {
    setRegion({ country: studies[0].COUNTRY_NAME });
    setCountryMode(false);
  };
  return (
    <ChatContainer>
      <Typography variant="subtitle1">
        <Box fontWeight="fontWeightBold">{`${t(studies[0].COUNTRY_NAME)}`}</Box>
      </Typography>
      <Typography variant="subtitle2">
        {nStudies} test(s) on <i>Anopheles</i> malaria vectors via
        discriminating concentration bioassay(s) with selected{" "}
        {t(preventionFilters.insecticideClass)}
        between {minYear} and {maxYear}
      </Typography>
      <HighchartsReact highcharts={Highcharts} options={options(data)} />
      <Actions>
        <FlexGrow />
        <Button
          variant="contained"
          color="default"
          size="small"
          onClick={onClick}
        >
          <ZoomIcon />
          Zoom
        </Button>
      </Actions>
    </ChatContainer>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResistanceStatusCountryChart);
