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
import { TreatmentStudy } from "../../../../types/Treatment";
import * as R from "ramda";
import { MutationColors } from "./utils";
import Pagination from "../../../charts/Pagination";
import { MOLECULAR_MARKERS } from "../../../filters/MolecularMarkerFilter";
import { selectTreatmentFilters } from "../../../../store/reducers/treatment-reducer";
import Citation from "../../../charts/Citation";
import { formatYears } from "../../../../utils/string-utils";

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
    text: ""
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
const options2: (data: any, categories: any[]) => Highcharts.Options = (
  data,
  categories
) => ({
  chart: {
    type: "column",
    height: 250,
    style: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;'
    }
  },
  title: {
    text: ""
  },
  xAxis: { categories },
  yAxis: {
    min: 0,
    max: 100,
    title: {
      text: "Percentage"
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

const options3: (data: any, categories: any[]) => Highcharts.Options = (
  data,
  categories
) => ({
  chart: {
    height: 250,
    width: 300,
    style: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif;'
    }
  },
  title: {
    text: ""
  },
  subtitle: {
    text: ""
  },
  tooltip: {
    pointFormat: "{series.name}: <b>{point.y:.2f}%</b>"
  },
  xAxis: { categories },
  yAxis: {
    min: 0,
    max: 100,
    title: {
      text: "Percentage (%)"
    }
  },
  plotOptions: {
    series: {
      label: {
        connectorAllowed: false
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

const Margin = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  treatmentFilters: selectTreatmentFilters(state)
});
const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
  studies: TreatmentStudy[];
};
type Props = DispatchProps & StateProps & OwnProps;

const MolecularMarkersChart = ({ studies, treatmentFilters }: Props) => {
  const { t } = useTranslation("common");
  const [studyIndex, setStudy] = useState(0);
  const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);
  const sortedYears = R.uniq(
    sortedStudies.map(study => study.YEAR_START)
  ).sort();
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
      color: MutationColors[genotype] ? MutationColors[genotype].color : "000",
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

  const data = sortedStudies[
    sortedStudies.length - studyIndex - 1
  ].groupStudies.map(study => ({
    name: `${study.GENOTYPE}`,
    y: Math.round(study.PROPORTION * 100),
    color: MutationColors[study.GENOTYPE]
      ? MutationColors[study.GENOTYPE].color
      : "000"
  }));

  const titleItems = [
    studies[studyIndex].SITE_NAME,
    studies[studyIndex].PROVINCE,
    t(studies[studyIndex].COUNTRY_NAME)
  ];
  const title = titleItems.filter(Boolean).join(", ");
  const molecularMarker = t(
    MOLECULAR_MARKERS.find(
      (m: any) => m.value === treatmentFilters.molecularMarker
    ).label
  );
  const study = sortedStudies[sortedStudies.length - studyIndex - 1];

  const pfkelch13 = () => {
    return (
      <>
        <Pagination studies={studies} study={studyIndex} setStudy={setStudy} />
        <Typography variant="subtitle1">
          <Box fontWeight="fontWeightBold">{`${title} (${minYear}-${maxYear})`}</Box>
        </Typography>
        <Typography variant="body2">
          In this {study.YEAR_START} study, the following{" "}
          <i>{molecularMarker}</i> mutations were observed among {study.N}{" "}
          samples:
        </Typography>
        <Flex>
          <FlexCol>
            <HighchartsReact highcharts={Highcharts} options={options(data)} />
          </FlexCol>
          <FlexCol flex={2}>
            <HighchartsReact
              highcharts={Highcharts}
              options={options2(series, years)}
            />
          </FlexCol>
        </Flex>
        <Citation study={study} />
      </>
    );
  };

  const {
    YEAR_START,
    YEAR_END,
    PROP_RELATED,
    N,
    groupStudies: subStudies
  } = study;

  const mcStudy = subStudies.find(s => s.GENOTYPE === "MC");
  const wtStudy = subStudies.find(s => s.GENOTYPE === "WT");

  const duration =
    parseInt(YEAR_START) !== parseInt(YEAR_END)
      ? `from ${YEAR_START} to ${YEAR_END}`
      : YEAR_START;

  const formatValue = (value: number) =>
    Number.isNaN(value) ? "N/A" : `${(value * 100).toFixed(2)}%`;

  const pfcrt = () => {
    return (
      <Margin>
        <Flex>
          <Typography variant="body2">
            <b>Study year(s):&nbsp;</b>
            {duration}
          </Typography>
        </Flex>
        <Flex>
          <Typography variant="body2">
            <b>Number of samples:&nbsp;</b>
            {N}
          </Typography>
        </Flex>
        {treatmentFilters.molecularMarker === 2 && (
          <Flex>
            <Typography variant="body2">
              <b>Samples with mutations detected:&nbsp;</b>
              {formatValue(PROP_RELATED)}
            </Typography>
          </Flex>
        )}
        {wtStudy && (
          <Flex>
            <Typography variant="body2">
              <b>Samples with wildtype:&nbsp;</b>
              {formatValue(wtStudy.PROPORTION)}
            </Typography>
          </Flex>
        )}
        {mcStudy && (
          <Flex>
            <Typography variant="body2">
              <b>Samples with multiple copy numbers:&nbsp;</b>
              {formatValue(mcStudy.PROPORTION)}
            </Typography>
          </Flex>
        )}
      </Margin>
    );
  };

  const keys = [{ name: "PROP_RELATED", color: "#00994C" }];

  const series3 = keys.map(key => {
    return {
      name: key.name,
      color: key.color,
      data: sortedYears.map(year => {
        const yearFilters: any = studies.filter(
          study => parseInt(year) === parseInt(study.YEAR_START)
        )[0];
        return yearFilters
          ? parseFloat(
              (parseFloat(yearFilters[key.name] || "0") * 100).toFixed(2)
            )
          : 0;
      })
    };
  });

  return (
    <ChatContainer>
      {treatmentFilters.molecularMarker === 1 ? (
        pfkelch13()
      ) : (
        <>
          <Pagination
            studies={studies}
            study={studyIndex}
            setStudy={setStudy}
          />
          <Typography variant="subtitle1">
            <Box fontWeight="fontWeightBold">{`${title}`}</Box>
          </Typography>
          <Typography variant="subtitle2">
            <Box>{`${studies.length} studies ${formatYears(
              `${minYear}`,
              `${maxYear}`
            )}`}</Box>
          </Typography>
          <Hidden smUp>
            {pfcrt()}
            <HighchartsReact
              highcharts={Highcharts}
              options={options3(series3, sortedYears)}
            />
          </Hidden>
          <Hidden xsDown>
            <Flex>
              <FlexCol>{pfcrt()}</FlexCol>
              <FlexCol>
                {treatmentFilters.molecularMarker === 2 ? (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={options3(series3, sortedYears)}
                  />
                ) : (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={options2(series, years)}
                  />
                )}
              </FlexCol>
            </Flex>
          </Hidden>
          <Citation study={study} />
        </>
      )}
    </ChatContainer>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MolecularMarkersChart);
