import * as React from "react";
import styled from "styled-components";
import { Box, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import { selectPreventionFilters } from "../../../../store/reducers/prevention-reducer";
import { ChartContainer } from "../../../Chart";
import * as R from "ramda";
import { filterByAssayTypes, filterByProxyType, filterByType } from "../../studies-filters";
import { evaluateDeploymentStatus } from "../utils";
import { PboDeploymentStatus } from "./PboDeploymentSymbols";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    preventionFilters: selectPreventionFilters(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studies: PreventionStudy[];
};
type Props = StateProps & OwnProps;

const Flex = styled.div`
    display: flex;
`;

const Margin = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
`;

const PboDistrictChart = ({ studies }: Props) => {
    const { t } = useTranslation("common");
    const titleTranslation = t("Compliance with WHO recommended criteria for Pyrethroid-PBO nets deployment");
    const nSitesTranslation = t("Number of sites that meet criteria");
    const vectorSpeciesTranslation = t("Vector species that meet criteria");
    const pyrethroidYearTranslation = t("Most recent pyrethroid susceptibility test results");
    const monoOxygenaseYearTranslation = t("Most recent mono-oxygenase involvement results");
    const studyObject = studies[0];

    const studiesBySiteID = R.groupBy(R.prop("SITE_ID"), studies);
    const studiesWithCriteriaPerSiteId = Object.entries(studiesBySiteID).map(([siteId, studies]) => {
        const { criteria, pboDeploymentStatus } = evaluateDeploymentStatus(studies);
        return {
            siteId,
            criteria,
            studies,
            pboDeploymentStatus,
        };
    });

    const meetsCriteria = studiesWithCriteriaPerSiteId.filter(
        site => site.pboDeploymentStatus === PboDeploymentStatus.ELIGIBLE
    );

    const species = R.flatten(
        meetsCriteria.map(site => {
            return Object.entries(site.criteria).map(([species, criterias]: any) => {
                if (criterias.criteria1 && criterias.criteria2 && criterias.criteria3) {
                    return [species];
                } else {
                    return [];
                }
            });
        })
    );

    const group1Studies = studies.filter(filterByAssayTypes(["DISCRIMINATING_CONCENTRATION_BIOASSAY"]));
    const mostRecentPyrethroidStudies: any = R.reverse(R.sortBy(R.prop("YEAR_START"), group1Studies)) || [];
    const mostRecentPyrethroidStudy = mostRecentPyrethroidStudies[0] || {};
    const group2aStudies = studies
        .filter(filterByAssayTypes(["MOLECULAR_ASSAY", "SYNERGIST-INSECTICIDE_BIOASSAY"]))
        .filter(filterByType("MONO_OXYGENASES"));
    const group2bStudies = studies
        .filter(filterByAssayTypes(["SYNERGIST-INSECTICIDE_BIOASSAY"]))
        .filter(filterByProxyType("MONO_OXYGENASES"));
    const group2Studies = [...group2aStudies, ...group2bStudies];
    const mostRecentMonoOxygenasesStudies: any = R.reverse(R.sortBy(R.prop("YEAR_START"), group2Studies)) || [];
    const mostRecentMonoOxygenasesStudy = mostRecentMonoOxygenasesStudies[0] || {};

    return (
        <ChartContainer>
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${studyObject.ADMIN2}`}</Box>
            </Typography>
            <Typography variant="subtitle2">
                <Box>{titleTranslation}</Box>
            </Typography>
            <Margin>
                <Flex>
                    <Typography variant="body2">
                        <b>{nSitesTranslation}:&nbsp;</b>
                        {meetsCriteria.length}
                    </Typography>
                </Flex>
                <Flex>
                    <Typography variant="body2">
                        <b>{vectorSpeciesTranslation}:&nbsp;</b>
                        {R.uniq(species).join(", ")}
                    </Typography>
                </Flex>
                <Flex>
                    <Typography variant="body2">
                        <b>{pyrethroidYearTranslation}:&nbsp;</b>
                        {mostRecentPyrethroidStudy.YEAR_START}
                    </Typography>
                </Flex>
                <Flex>
                    <Typography variant="body2">
                        <b>{monoOxygenaseYearTranslation}:&nbsp;</b>
                        {mostRecentMonoOxygenasesStudy.YEAR_START}
                    </Typography>
                </Flex>
            </Margin>
        </ChartContainer>
    );
};
export default connect(mapStateToProps)(PboDistrictChart);
