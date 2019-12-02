import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Box, Hidden, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import { PreventionStudy } from "../../../../types/Prevention";
import Citation from "../../../charts/Citation";
import * as R from "ramda";
import { ResistanceMechanismColors } from "./symbols";
import { RESISTANCE_MECHANISM } from "./utils";
import { baseChart } from "../../../charts/chart-utils";

const options: (data: any) => Highcharts.Options = data => ({
  ...baseChart,
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
  series: data
});

const ChatContainer = styled.div<{ width?: string }>`
  width: ${props => props.width || "100%"};
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
  const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);
  const minYear = parseInt(sortedStudies[sortedStudies.length - 1].YEAR_START);
  const maxYear = parseInt(sortedStudies[0].YEAR_START);
  const years: number[] = [];
  for (let i = minYear; i <= maxYear; i++) {
    years.push(i);
  }
  const detected = years.map(year => {
    const yearStudies = studies.filter(
      study => parseInt(study.YEAR_START) === year
    );
    return {
      name: year,
      y: yearStudies.filter(study => study.MECHANISM_STATUS === "DETECTED")
        .length
    };
  });
  const notDetected = years.map(year => {
    const yearStudies = studies.filter(
      study => parseInt(study.YEAR_START) === year
    );
    return {
      name: year,
      y: yearStudies.filter(study => study.MECHANISM_STATUS !== "DETECTED")
        .length
    };
  });
  const data = [
    {
      type: "column",
      name: "Confirmed",
      color: ResistanceMechanismColors[RESISTANCE_MECHANISM.CONFIRMED][0],
      data: detected
    },
    {
      type: "column",
      color: ResistanceMechanismColors[RESISTANCE_MECHANISM.NOT_CONFIRMED][0],
      name: "Not confirmed",
      data: notDetected
    }
  ];
  const content = () => (
    <>
      <Typography variant="subtitle1">
        <Box fontWeight="fontWeightBold">{`${studies[0].VILLAGE_NAME}, ${t(
          studies[0].COUNTRY_NAME
        )}`}</Box>
      </Typography>
      <Typography variant="subtitle2">
        {`${t(studies[0].ASSAY_TYPE)}, ${t(studies[0].TYPE)}`}
      </Typography>
      <HighchartsReact highcharts={Highcharts} options={options(data)} />
      <Citation study={studies[0]} />
    </>
  );
  return (
    <>
      <Hidden smUp>
        <ChatContainer width={"100%"}>{content()}</ChatContainer>
      </Hidden>
      <Hidden xsDown>
        <ChatContainer width={"500px"}>{content()}</ChatContainer>
      </Hidden>
    </>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResistanceMechanismsChart);
