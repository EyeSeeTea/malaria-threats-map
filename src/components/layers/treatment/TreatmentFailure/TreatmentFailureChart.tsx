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
import Pagination from "../../../charts/Pagination";
import Citation from "../../../charts/Citation";
import { formatYears, formatYears2 } from "../../../../utils/string-utils";
import { PLASMODIUM_SPECIES_SUGGESTIONS } from "../../../filters/PlasmodiumSpeciesFilter";

const options: (
  data: any,
  categories: any[],
  translations: any
) => Highcharts.Options = (data, categories, translations) => ({
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
    title: {
      text: translations.percentage
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
  width: 600px;
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
  const sortedStudies = R.sortBy(study => parseInt(study.YEAR_START), studies);
  const years = R.uniq(sortedStudies.map(study => study.YEAR_START)).sort();
  const maxYear = parseInt(sortedStudies[sortedStudies.length - 1].YEAR_START);
  const minYear = parseInt(sortedStudies[0].YEAR_START);

  const keys = [
    { name: "POSITIVE_DAY_3", color: "#00994C" },
    { name: "TREATMENT_FAILURE_PP", color: "#BE4B48" },
    { name: "TREATMENT_FAILURE_KM", color: "#4b48be" }
  ];

  const exists = (value: string) => {
    if (!value) {
      return false;
    }
    const trimmed = value.trim();
    return trimmed !== "N/A" && trimmed !== "NA" && trimmed !== null;
  };

  const series = keys.map(key => {
    return {
      name: t(key.name),
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

  const siteDuration = formatYears(`${minYear}`, `${maxYear}`);

  const titleItems = [
    studies[study].SITE_NAME,
    studies[study].PROVINCE,
    t(studies[study].COUNTRY_NAME)
  ];
  const title = titleItems.filter(Boolean).join(", ");
  const {
    YEAR_START,
    YEAR_END,
    PLASMODIUM_SPECIES,
    DRUG_NAME,
    N,
    FOLLOW_UP,
    CONFIRMED_RESIST_PV,
    POSITIVE_DAY_3,
    TREATMENT_FAILURE_KM,
    TREATMENT_FAILURE_PP
  } = sortedStudies[study];

  const duration = formatYears2(YEAR_START, YEAR_END);
  const formatValue = (value: string) =>
    Number.isNaN(parseFloat(value))
      ? "N/A"
      : `${(parseFloat(value) * 100).toFixed(2)}%`;

  const translations = {
    percentage: t("treatment.chart.treatment_failure.percentage")
  };
  const studyYears = t("treatment.chart.treatment_failure.study_years");
  const numberOfPatients = t(
    "treatment.chart.treatment_failure.number_of_patients"
  );
  const followUp = t("treatment.chart.treatment_failure.follow_up");
  const confirmedResistPv = t(
    "treatment.chart.treatment_failure.confirmed_resist_pv"
  );
  const positiveDay3 = t("treatment.chart.treatment_failure.positive_day_3");
  const treatmentFailurePp = t(
    "treatment.chart.treatment_failure.treatment_failure_pp"
  );
  const treatmentFailureKm = t(
    "treatment.chart.treatment_failure.treatment_failure_km"
  );
  const days = t("treatment.chart.treatment_failure.days");
  const t_studies = t("treatment.chart.treatment_failure.studies");

  function renderInfo() {
    return (
      <Margin>
        <Flex>
          <Typography variant="body2">
            <b>{studyYears}:&nbsp;</b>
            {duration}
          </Typography>
        </Flex>
        <Flex>
          <Typography variant="body2">
            <b>{numberOfPatients}:&nbsp;</b>
            {N}
          </Typography>
        </Flex>
        <Flex>
          <Typography variant="body2">
            <b>{followUp}:&nbsp;</b>
            {FOLLOW_UP} {days}
          </Typography>
        </Flex>
        {exists(CONFIRMED_RESIST_PV) && (
          <Flex>
            <Typography variant="body2">
              <b>{confirmedResistPv}:&nbsp;</b>
              {formatValue(CONFIRMED_RESIST_PV)}
            </Typography>
          </Flex>
        )}
        {exists(POSITIVE_DAY_3) && (
          <Flex>
            <Typography variant="body2">
              <b>{positiveDay3}:&nbsp;</b>
              {formatValue(POSITIVE_DAY_3)}
            </Typography>
          </Flex>
        )}
        {exists(TREATMENT_FAILURE_PP) && (
          <Flex>
            <Typography variant="body2">
              <b>{treatmentFailurePp}:&nbsp;</b>
              {formatValue(TREATMENT_FAILURE_PP)}
            </Typography>
          </Flex>
        )}
        {exists(TREATMENT_FAILURE_KM) && (
          <Flex>
            <Typography variant="body2">
              <b>{treatmentFailureKm}:&nbsp;</b>
              {formatValue(TREATMENT_FAILURE_KM)}
            </Typography>
          </Flex>
        )}
      </Margin>
    );
  }

  const plasmodiumSpecies = PLASMODIUM_SPECIES_SUGGESTIONS.find(
    (species: any) => species.value === PLASMODIUM_SPECIES
  ).label;

  return (
    <ChatContainer>
      <Pagination studies={studies} study={study} setStudy={setStudy} />
      <Typography variant="subtitle1">
        <Box fontWeight="fontWeightBold">{`${title}`}</Box>
      </Typography>
      <Typography variant="body2">
        <i>{plasmodiumSpecies}</i>
        {`, ${t(DRUG_NAME)}: ${studies.length} ${t_studies} ${siteDuration}`}
      </Typography>
      <Hidden smUp>
        {renderInfo()}
        <HighchartsReact
          highcharts={Highcharts}
          options={options(series, years, translations)}
        />
      </Hidden>
      <Hidden xsDown>
        <Flex>
          <FlexCol>{renderInfo()}</FlexCol>
          <FlexCol>
            <HighchartsReact
              highcharts={Highcharts}
              options={options(series, years, translations)}
            />
          </FlexCol>
        </Flex>
      </Hidden>
      <Citation study={studies[study]} />
    </ChatContainer>
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreatmentFailureChart);
