import * as React from "react";
import { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Box, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import { PreventionStudy } from "../../../../types/Prevention";
import { ConfirmationStatusColors } from "./symbols";
import * as R from "ramda";
import Citation from "../../../charts/Citation";
import Pagination from "../../../charts/Pagination";

const options: (data: any) => Highcharts.Options = data => ({
  chart: {
    type: "column",
    height: 300,
    style: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;'
    }
  },
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
  ],
  legend: {
    enabled: false
  },
  credits: {
    enabled: false
  }
});

const ChatContainer = styled.div`
  width: 500px;
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

const ResistanceStatusChart = ({ studies: baseStudies }: Props) => {
  const { t } = useTranslation("common");
  const [study, setStudy] = useState(0);
  const groupedStudies = R.values(
    R.groupBy(R.prop("CITATION_URL"), baseStudies)
  );
  const studies = groupedStudies[study];
  const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);
  const cleanedStudies = R.groupBy((study: PreventionStudy) => {
    return `${study.YEAR_START}, ${study.INSECTICIDE_TYPE} ${study.INSECTICIDE_CONC}`;
  }, sortedStudies);
  const simplifiedStudies = R.values(cleanedStudies).map(
    (groupStudies: PreventionStudy[]) =>
      R.sortBy(study => -parseInt(study.MORTALITY_ADJUSTED), groupStudies)[0]
  );
  const data = simplifiedStudies.map(study => ({
    name: `${study.YEAR_START}, ${study.INSECTICIDE_TYPE} ${study.INSECTICIDE_CONC}`,
    y: Math.round(parseFloat(study.MORTALITY_ADJUSTED) * 100),
    species: study.SPECIES,
    number: study.NUMBER
  }));
  const studyObject = simplifiedStudies[study];
  return (
    <ChatContainer>
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
    </ChatContainer>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResistanceStatusChart);
