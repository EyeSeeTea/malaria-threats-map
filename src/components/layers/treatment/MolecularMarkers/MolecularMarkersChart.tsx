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
import { ConfirmationStatusColors } from "../../prevention/ResistanceStatus/symbols";
import { TreatmentStudy } from "../../../../types/Treatment";
import * as R from "ramda";

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
    text: ""
  },
  subtitle: {
    text: "<b>Resistance status</b> (# of tests)"
  },
  tooltip: {
    pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: false
      },
      showInLegend: true
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
    itemStyle: {
      fontSize: "9px"
    },
    margin: 0,
    padding: 0,
    enabled: true,
    maxHeight: 70
  },
  credits: {
    enabled: false
  }
});
const options2: (data: any) => Highcharts.Options = data => ({
  chart: {
    type: "column",
    height: 250
  },
  title: {
    text: ""
  },
  xAxis: {
    categories: ["2010", "2011", "2012", "2013", "2014", "2015", "2016"]
  },
  yAxis: {
    min: 0,
    max: 100,
    title: {
      text: "Total fruit consumption"
    },
    stackLabels: {
      style: {
        fontWeight: "bold",
        color:
          // theme
          (Highcharts.defaultOptions.title.style &&
            Highcharts.defaultOptions.title.style.color) ||
          "gray"
      }
    }
  },
  tooltip: {
    headerFormat: "<b>{point.x}</b><br/>",
    pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}"
  },
  plotOptions: {
    column: {
      stacking: "normal"
    }
  },
  series: data,
  legend: {
    enabled: true,
    align: "right",
    verticalAlign: "top",
    layout: "vertical",
    width: 70
  },
  credits: {
    enabled: false
  }
});

const ChatContainer = styled.div`
  max-width: 500px;
`;

const Flex = styled.div`
  display: flex;
`;

const FlexCol = styled.div<{ flex?: number }>`
  flex: ${props => props.flex || 1};
`;

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state)
});
const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
  studies: TreatmentStudy[];
};
type Props = DispatchProps & StateProps & OwnProps;

const MolecularMarkersChart = ({ theme, studies }: Props) => {
  const { t } = useTranslation("common");
  const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);
  const minYear = parseInt(sortedStudies[sortedStudies.length - 1].YEAR_START);
  const maxYear = parseInt(sortedStudies[0].YEAR_START);
  const groupStudies = R.flatten(
    sortedStudies.map(study => study.groupStudies)
  );
  const years: number[] = [];
  for (let i = minYear; i <= maxYear; i++) {
    years.push(i);
  }
  const k13Groups = R.groupBy(R.prop("GENOTYPE"), groupStudies);
  const series = Object.keys(k13Groups).map((genotype: string) => {
    const studies: TreatmentStudy[] = k13Groups[genotype];
    return {
      type: "column",
      name: genotype,
      data: years.map(year => {
        const yearFilters = studies.filter(
          study => year === parseInt(study.YEAR_START)
        )[0];
        return {
          name: `${year}`,
          y: yearFilters
            ? parseFloat((yearFilters.PROPORTION * 100).toFixed(2))
            : undefined
        };
      })
    };
  });
  console.log(series);
  const data = sortedStudies[sortedStudies.length - 1].groupStudies.map(
    study => ({
      name: `${study.GENOTYPE}`,
      y: Math.round(study.PROPORTION * 100),
      species: study.SPECIES,
      number: study.NUMBER
    })
  );
  return (
    <ChatContainer>
      <Typography variant="subtitle1">
        <Box fontWeight="fontWeightBold">{`${studies[0].SITE_NAME}, ${
          studies[0].PROVINCE
        }, ${t(studies[0].COUNTRY_NAME)} (${minYear}-${maxYear})`}</Box>
      </Typography>
      <Typography variant="subtitle2">
        {`${t(studies[0].ASSAY_TYPE)}, ${t(studies[0].TYPE)}`}
      </Typography>
      <Flex>
        <FlexCol>
          <HighchartsReact highcharts={Highcharts} options={options(data)} />
        </FlexCol>
        <FlexCol flex={2}>
          <HighchartsReact highcharts={Highcharts} options={options2(series)} />
        </FlexCol>
      </Flex>
    </ChatContainer>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MolecularMarkersChart);
