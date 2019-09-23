import * as React from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../config/i18next";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Typography } from "@material-ui/core";
import { ConfirmationStatusColors } from "./layers/prevention/ResistanceStatus/symbols";

const options: Highcharts.Options = {
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
  series: [
    {
      type: "column",
      name: "Mortality",
      data: [
        ["2015, ALPHACYPERMETHRIN 0.05%", 88],
        ["2015, DELTAMETHRIN 0.05%", 93],
        ["2015, LAMBDA-CYHAOTHRIN 0.05%", 100],
        ["2015, PERMETHRIN 0.05%", 100]
      ]
    }
  ],
  legend: {
    enabled: false
  },
  credits: {
    enabled: false
  }
};

const ChatContainer = styled.div`
  max-width: 500px;
`;

const Chart = (props: any) => {
  const { t }: any = useTranslation("common");
  return (
    <ChatContainer>
      <Typography variant="h6">
        Remanso, Bolivia (Plurinational State of)
      </Typography>
      <Typography variant="body1">
        Discriminating concentratin bioassay, WHO test kit bioassay
      </Typography>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </ChatContainer>
  );
};
export default Chart;
