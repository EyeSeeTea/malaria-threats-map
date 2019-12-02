import * as React from "react";
import { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Box, Hidden, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import { PreventionStudy } from "../../../../types/Prevention";
import * as R from "ramda";
import Citation from "../../../charts/Citation";
import Pagination from "../../../charts/Pagination";
import { ConfirmationStatusColors } from "../ResistanceStatus/symbols";
import { baseChart } from "../../../charts/chart-utils";

const options: (data: any) => Highcharts.Options = data => ({
  ...baseChart,
  title: {
    text: "% mosquito mortality"
  },
  xAxis: {
    type: "category"
  },
  yAxis: {
    min: 0,
    max: 100,
    title: {
      text: "% mosquito mortality"
    },
    plotLines: [
      {
        value: 90,
        color: "#d43501",
        dashStyle: "LongDashDot",
        width: 2,
        zIndex: 5,
        label: {
          text: ""
        }
      }
    ]
  },
  plotOptions: {
    column: {
      zones: [
        {
          value: 90.001,
          color: ConfirmationStatusColors.Confirmed[0]
        },
        {
          value: 97.001,
          color: ConfirmationStatusColors.Possible[0]
        },
        {
          value: 100.001,
          color: ConfirmationStatusColors.Susceptible[0]
        }
      ]
    }
  },
  tooltip: {
    formatter: function() {
      const point = this.point as any;
      return `
<B><i>${point.species}</i></B><br>
Mortality (%): ${point.y}<br>
Tested (n): ${point.number}
`;
    }
  },
  series: [
    {
      type: "column",
      name: "Mortality",
      data: data
    }
  ]
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

const LevelOfInvolvementChart = ({ studies: baseStudies }: Props) => {
  const { t } = useTranslation("common");
  const [study, setStudy] = useState(0);
  const groupedStudies = R.values(
    R.groupBy(R.prop("CITATION_URL"), baseStudies)
  );
  const studies = groupedStudies[study];

  const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
  const data = sortedStudies.map(study => {
    const base = `${study.YEAR_START}, ${study.INSECTICIDE_TYPE} ${study.INSECTICIDE_CONC}`;
    const syn =
      study.SYNERGIST_TYPE === "NO"
        ? `No synergist`
        : `${study.SYNERGIST_TYPE} ${study.SYNERGIST_CONC}`;
    return {
      name: `${base}, ${syn}`,
      y: Math.round(parseFloat(study.MORTALITY_ADJUSTED) * 100),
      species: study.SPECIES,
      number: study.NUMBER
    };
  });
  const studyObject = sortedStudies[study];

  const content = () => (
    <>
      {groupedStudies.length > 1 && (
        <Pagination
          studies={groupedStudies}
          setStudy={setStudy}
          study={study}
        />
      )}
      <Typography variant="subtitle1">
        <Box fontWeight="fontWeightBold">{`${studyObject.VILLAGE_NAME}, ${t(
          studyObject.COUNTRY_NAME
        )}`}</Box>
      </Typography>
      <Typography variant="subtitle2">
        {`${t(studyObject.ASSAY_TYPE)}, ${t(studyObject.TYPE)}`}
      </Typography>
      <HighchartsReact highcharts={Highcharts} options={options(data)} />
      <Citation study={studyObject} />
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
)(LevelOfInvolvementChart);
