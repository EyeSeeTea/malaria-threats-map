import * as React from "react";
import { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Divider, Paper, Typography } from "@mui/material";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import * as R from "ramda";
import IntegrationReactSelect from "../../../BasicSelect";
import FormLabel from "@mui/material/FormLabel";
import { sendAnalytics } from "../../../../utils/analytics";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import Hidden from "../../../hidden/Hidden";
import SiteTitle from "../../../site-title/SiteTitle";
import { chartOptions, createData, getTranslations } from "./utils";
import _ from "lodash";
import CitationNew from "../../../charts/CitationNew";
import CurationNew from "../../../charts/CurationNew";
import OtherInsecticideClasses from "../common/OtherInsecticideClasses";

export type ChartData = {
    name: string;
    y: number;
    number: string;
};

const Container = styled.div<{ width?: string }>`
    width: ${props => props.width || "100%"};
`;

const TopContainer = styled.div`
    margin: 0px 8px;
    padding: 0px 12px;
`;

const ChartContainer = styled(Paper)`
    padding: 12px 20px;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    border-radius: 12px;
    box-shadow: none;
    margin: 0px 8px;
`;

const StyledSelect = styled(IntegrationReactSelect)`
    margin-bottom: 4px;
    margin-left: 16px;
`;

const Flex = styled.div`
    margin-top: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    siteFilteredStudies: PreventionStudy[];
    siteNonFilteredStudies: PreventionStudy[];
};
type Props = StateProps & OwnProps;

const ResistanceStatusChart = ({ siteFilteredStudies, siteNonFilteredStudies }: Props) => {
    const { t } = useTranslation();
    const speciesOptions = R.uniq(R.map(s => s.SPECIES, siteFilteredStudies));
    const suggestions: any[] = speciesOptions.map((specie: string) => ({
        label: specie,
        value: specie,
    }));
    const [species, setSpecies] = useState<any[]>(suggestions);
    const [data, setData] = useState<{ [x: string]: { [x: string]: ChartData[] } }>({});

    const studyObject = React.useMemo(() => siteFilteredStudies[0], [siteFilteredStudies]);

    const onSpeciesChange = (value: any) => {
        sendAnalytics({ type: "event", category: "popup", action: "filter" });
        setSpecies(value);
    };

    React.useEffect(() => {
        const studiesFiltered = siteFilteredStudies.filter(
            study => !species || !species.length || species.map(s => s.value).includes(study.SPECIES)
        );

        const bySpeciesAndInsecticideType = _(studiesFiltered)
            .groupBy(({ SPECIES }) => SPECIES)
            .mapValues(studies => {
                return _(studies)
                    .groupBy(({ INSECTICIDE_TYPE }) => INSECTICIDE_TYPE)
                    .mapValues(studies => createData(studies))
                    .value();
            })
            .value();

        setData(bySpeciesAndInsecticideType);
    }, [siteFilteredStudies, species]);

    const content = () => (
        <>
            <TopContainer>
                <SiteTitle study={studyObject} />
                <Typography variant="subtitle2">{t(studyObject.ASSAY_TYPE)}</Typography>
                {suggestions.length > 1 && (
                    <Flex>
                        <FormLabel component="legend">Species</FormLabel>
                        <StyledSelect
                            isClearable
                            isMulti
                            suggestions={suggestions}
                            onChange={onSpeciesChange}
                            value={species}
                        />
                    </Flex>
                )}
            </TopContainer>

            <Divider sx={{ marginBottom: 2, marginTop: 2 }} />
            <ChartContainer>
                {Object.keys(data).map(specie => {
                    return (
                        <React.Fragment key={specie}>
                            <Typography color="primary" variant="body2" fontWeight="bold">
                                {t(specie)}
                            </Typography>
                            <Typography variant="caption">{t(studyObject.TYPE)}</Typography>
                            {Object.keys(data[specie]).map(insecticideType => {
                                return (
                                    <HighchartsReact
                                        key={insecticideType}
                                        highcharts={Highcharts}
                                        options={chartOptions(
                                            data[specie][insecticideType],
                                            getTranslations(insecticideType)
                                        )}
                                    />
                                );
                            })}
                        </React.Fragment>
                    );
                })}
                <Typography variant="caption" sx={{ marginBottom: 2 }}>
                    {t("common.prevention.chart.not_reported")}
                </Typography>

                <CitationNew studies={siteFilteredStudies} />
                <CurationNew studies={siteFilteredStudies} />
                <OtherInsecticideClasses
                    siteFilteredStudies={siteFilteredStudies}
                    siteNonFilteredStudies={siteNonFilteredStudies}
                />
            </ChartContainer>
        </>
    );
    return (
        <>
            <Hidden smUp>
                <Container width={"100%"}>{content()}</Container>
            </Hidden>
            <Hidden smDown>
                <Container width={"500px"}>{content()}</Container>
            </Hidden>
        </>
    );
};
export default connect(mapStateToProps)(ResistanceStatusChart);
