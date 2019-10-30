import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Box, Link, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import { PreventionStudy } from "../../../../types/Prevention";

const options: (data: any) => Highcharts.Options = data => ({
  chart: {
    type: "column",
    height: 300,
    style: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;'
    }
  },
  title: {
    text: "Number of mechanism assays"
  },
  xAxis: {
    type: "category"
  },
  yAxis: {
    title: {
      text: "count"
    }
  },
  plotOptions: {
    column: {
      stacking: "normal",
      dataLabels: {
        enabled: true
      }
    }
  },
  series: [
    {
      type: "column",
      name: "Mortality",
      data: [{ name: "2018", y: 2 }, { name: "2019", y: 3 }]
    },
    {
      type: "column",
      name: "Mortality 2",
      data: [{ name: "2018", y: 1 }, { name: "2019", y: 2 }]
    }
  ],
  legend: {
    enabled: false
  },
  credits: {
    enabled: false
  }
});

const ChatContainer = styled.div`
  max-width: 500px;
`;

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state)
});
const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
  studies: PreventionStudy[];
};
type Props = DispatchProps & StateProps & OwnProps;

const ResistanceMechanismsChart = ({ theme, studies }: Props) => {
  const { t } = useTranslation("common");
  const data = studies.map(study => ({}));
  return (
    <ChatContainer>
      <Typography variant="subtitle1">
        <Box fontWeight="fontWeightBold">{`${studies[0].VILLAGE_NAME}, ${t(
          studies[0].COUNTRY_NAME
        )}`}</Box>
      </Typography>
      <Typography variant="subtitle2">
        {`${t(studies[0].ASSAY_TYPE)}, ${t(studies[0].TYPE)}`}
      </Typography>
      <HighchartsReact highcharts={Highcharts} options={options(data)} />

      <Typography variant="body2">Source:</Typography>
      <Typography variant="caption">
        <Link href={studies[0].CITATION_URL} target="_blank">
          {studies[0].CITATION_LONG}
          color={"textSecondary"}
        </Link>
      </Typography>
    </ChatContainer>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResistanceMechanismsChart);
