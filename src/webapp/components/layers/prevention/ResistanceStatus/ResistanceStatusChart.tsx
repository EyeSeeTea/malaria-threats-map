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
import Citation from "../../../charts/Citation";
import Curation from "../../../Curation";
import IntegrationReactSelect from "../../../BasicSelect";
import FormLabel from "@mui/material/FormLabel";
import { sendAnalytics } from "../../../../utils/analytics";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import Hidden from "../../../hidden/Hidden";
import SiteTitle from "../../../site-title/SiteTitle";
import { chartOptions, createData, getTranslations } from "./utils";
import _ from "lodash";

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
    studies: PreventionStudy[];
};
type Props = StateProps & OwnProps;

const ResistanceStatusChart = ({ studies: baseStudies }: Props) => {
    const { t } = useTranslation();
    const speciesOptions = R.uniq(R.map(s => s.SPECIES, baseStudies));
    const suggestions: any[] = speciesOptions.map((specie: string) => ({
        label: specie,
        value: specie,
    }));
    const [species, setSpecies] = useState<any[]>(suggestions);
    const [dataByInsecticideType, setDataByInsecticideType] = useState<{ [x: string]: ChartData[] }>({});

    const studyObject = React.useMemo(() => baseStudies[0], [baseStudies]);

    const onSpeciesChange = (value: any) => {
        sendAnalytics({ type: "event", category: "popup", action: "filter" });
        setSpecies(value);
    };

    React.useEffect(() => {
        const byInsecticideType = _(baseStudies)
            .groupBy(({ INSECTICIDE_TYPE }) => INSECTICIDE_TYPE)
            .mapValues(studies => createData(studies))
            .value();

        setDataByInsecticideType(byInsecticideType);
    }, [baseStudies]);

    // const groupedStudies = R.values(
    //     R.groupBy(
    //         R.prop("CITATION_URL"),
    //         baseStudies.filter(
    //             study => !species || !species.length || species.map(s => s.value).includes(study.SPECIES)
    //         )
    //     )
    // );

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
                <Typography color="primary" variant="body2" fontWeight="bold">
                    {t(studyObject.SPECIES)}
                </Typography>
                <Typography variant="caption">{t(studyObject.TYPE)}</Typography>

                {Object.keys(dataByInsecticideType).map(key => {
                    return (
                        <HighchartsReact
                            key={key}
                            highcharts={Highcharts}
                            options={chartOptions(dataByInsecticideType[key], getTranslations(key))}
                        />
                    );
                })}

                <Citation study={studyObject} />
                <Curation study={studyObject} />
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
