import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Box, IconButton, Link, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import { TreatmentStudy } from "../../../../types/Treatment";
import * as R from "ramda";
import ArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import ArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import { useState } from "react";
import { MutationColors } from "../MolecularMarkers/utils";

const options: (data: any, categories: any[]) => Highcharts.Options = (
  data,
  categories
) => ({
  chart: {
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
    pointFormat: "{series.name}: <b>{point.y:.1f}%</b>"
  },
  xAxis: { categories },
  yAxis: {
    min: 0,
    max: 100
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
  max-width: 600px;
`;

const Flex = styled.div`
  display: flex;
`;

const FlexReverse = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const FlexCol = styled.div<{ flex?: number }>`
  flex: ${props => props.flex || 1};
`;

const Margin = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
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

const TreatmentFailureChart = ({ theme, studies }: Props) => {
  const { t } = useTranslation("common");
  const [study, setStudy] = useState(0);
  const sortedStudies = R.sortBy(study => -parseInt(study.YEAR_START), studies);
  const years = R.uniq(sortedStudies.map(study => study.YEAR_START)).sort();
  const minYear = parseInt(sortedStudies[sortedStudies.length - 1].YEAR_START);
  const maxYear = parseInt(sortedStudies[0].YEAR_START);

  const keys = [
    { name: "POSITIVE_DAY_3", color: "#00994C" },
    { name: "TREATMENT_FAILURE_PP", color: "#BE4B48" }
  ];

  const series = keys.map(key => {
    return {
      name: key.name,
      color: key.color,
      data: years.map(year => {
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

  const titleItems = [
    studies[study].SITE_NAME,
    studies[study].PROVINCE,
    t(studies[study].COUNTRY_NAME)
  ];
  const title = titleItems.filter(Boolean).join(", ");
  return (
    <ChatContainer>
      {sortedStudies.length > 1 && (
        <FlexReverse>
          <IconButton
            aria-label="left"
            size="small"
            onClick={() =>
              setStudy(study === 0 ? sortedStudies.length - 1 : study - 1)
            }
          >
            <ArrowLeftIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="right"
            size="small"
            onClick={() => setStudy((study + 1) % sortedStudies.length)}
          >
            <ArrowRightIcon fontSize="small" />
          </IconButton>
        </FlexReverse>
      )}
      <Typography variant="subtitle1">
        <Box fontWeight="fontWeightBold">{`${title} (${minYear}-${maxYear})`}</Box>
      </Typography>
      <Typography variant="body2">
        In this 2010 study, the following Pfkelch13 mutations were observed
        among 6 samples:
      </Typography>
      <Flex>
        <FlexCol>
          <Margin>
            <Flex>
              <Typography variant="body2">
                <b>Study year:&nbsp;</b>from 2014 to 2016
              </Typography>
            </Flex>
            <Flex>
              <Typography variant="body2">
                <b>Number of patients:&nbsp;</b>50
              </Typography>
            </Flex>
            <Flex>
              <Typography variant="body2">
                <b>Follow-up:&nbsp;</b>28 days
              </Typography>
            </Flex>
            <Flex>
              <Typography variant="body2">
                <b>Patients with confirmed resistance:&nbsp;</b>N/A
              </Typography>
            </Flex>
            <Flex>
              <Typography variant="body2">
                <b>Patients with treatment failure, per protocol:&nbsp;</b>2.0%
              </Typography>
            </Flex>
            <Flex>
              <Typography variant="body2">
                <b>Patients with treatment failure, Kaplan-Meier:&nbsp;</b>N/A
              </Typography>
            </Flex>
          </Margin>
        </FlexCol>
        <FlexCol>
          <HighchartsReact
            highcharts={Highcharts}
            options={options(series, years)}
          />
        </FlexCol>
      </Flex>
      <Typography variant="caption">
        <Link
          href={studies[study].CITATION_URL}
          target="_blank"
          color={"textSecondary"}
        >
          {`${studies[study].INSTITUTION}, ${studies[study].INSTITUTION_CITY}`}
        </Link>
      </Typography>
    </ChatContainer>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreatmentFailureChart);
