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
import { TreatmentStudy } from "../../../../types/Treatment";
import { MutationColors } from "../../treatment/MolecularMarkers/utils";

const Flex = styled.div`
  display: flex;
`;

const FlexCol = styled.div<{ flex?: number }>`
  flex: ${props => props.flex || 1};
`;

const options: (data: any, translations: any) => Highcharts.Options = (
  data,
  translations
) => ({
  ...baseChart,
  title: {
    text: translations.title
  },
  xAxis: {
    type: "category"
  },
  yAxis: {
    title: {
      text: translations.count
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

const options2: (
  data: any,
  categories: any[],
  translations: any
) => Highcharts.Options = (data, categories, translations) => ({
  ...baseChart,
  title: {
    text: translations.title
  },
  xAxis: { categories },
  yAxis: {
    title: {
      text: translations.count
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
  series: data,
  legend: {
    itemStyle: {
      fontSize: "9px"
    },
    enabled: true,
    maxHeight: 70
  }
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

const ResistanceMechanismsChart = ({ studies }: Props) => {
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
      name: t("prevention.chart.resistance_mechanism.DETECTED"),
      color: ResistanceMechanismColors[RESISTANCE_MECHANISM.CONFIRMED][0],
      data: detected
    },
    {
      type: "column",
      name: t("prevention.chart.resistance_mechanism.NOT_DETECTED"),
      color: ResistanceMechanismColors[RESISTANCE_MECHANISM.NOT_CONFIRMED][0],
      data: notDetected
    }
  ];
  const groups = R.groupBy(R.prop("SPECIES"), sortedStudies);
  const series = Object.keys(groups).map((specie: string) => {
    const studies: PreventionStudy[] = groups[specie];
    return {
      type: "column",
      name: specie,
      data: years.map(year => {
        const yearFilters = studies.filter(
          study => year === parseInt(study.YEAR_START)
        )[0];
        return {
          name: `${year}`,
          y: yearFilters
            ? parseFloat(yearFilters.MECHANISM_FREQUENCY)
            : undefined
        };
      })
    };
  });
  const translations = {
    count: t("prevention.chart.resistance_mechanism.count"),
    title: t("prevention.chart.resistance_mechanism.title")
  };
  const translations2 = {
    count: t("prevention.chart.resistance_mechanism.frequency"),
    title: t("prevention.chart.resistance_mechanism.allelic")
  };
  console.log(studies[0]);
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
      <Flex>
        <FlexCol>
          <HighchartsReact
            highcharts={Highcharts}
            options={options(data, translations)}
          />
        </FlexCol>
        <FlexCol>
          <HighchartsReact
            highcharts={Highcharts}
            options={options2(series, years, translations2)}
          />
        </FlexCol>
      </Flex>
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
