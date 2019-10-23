import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Box, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import { PreventionStudy } from "../../../../types/Prevention";
import { ConfirmationStatusColors } from "../ResistanceStatus/symbols";

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
      return `
<B><i>${this.point.species}</i></B><br>
Mortality (%): ${this.y}<br>
Tested (n): ${this.point.number}
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

const IntensityStatusChart = ({ theme, studies }: Props) => {
  const { t } = useTranslation("common");
  const data = studies.map(study => ({
    name: `${study.YEAR_START}, ${study.INSECTICIDE_TYPE} ${
      study.INSECTICIDE_CONC
    }`,
    y: Math.round(parseFloat(study.MORTALITY_ADJUSTED) * 100),
    species: study.SPECIES,
    number: study.NUMBER
  }));
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
    </ChatContainer>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntensityStatusChart);
