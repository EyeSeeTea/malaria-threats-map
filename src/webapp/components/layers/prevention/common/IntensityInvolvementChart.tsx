import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Box, Typography } from "@mui/material";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import Citation from "../../../charts/Citation";
import Pagination from "../../../charts/Pagination";
import Curation from "../../../Curation";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import Hidden from "../../../hidden/Hidden";
import { selectTranslations } from "../../../../store/reducers/translations-reducer";

const ChatContainer = styled.div<{ width?: string }>`
    width: ${props => props.width || "100%"};
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    translations: selectTranslations(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    studyObject: PreventionStudy;
    groupedStudies: PreventionStudy[][];
    study: number;
    setStudy: React.Dispatch<React.SetStateAction<number>>;
    options: Highcharts.Options;
};
type Props = StateProps & OwnProps;

const IntensityInvolvementChart = ({ studyObject, options, groupedStudies, setStudy, study, translations }: Props) => {
    const { t } = useTranslation();
    const intensityStatusFiltersValue = React.useCallback(() => {
        if (!translations) return;
        return {
            studyObject,
            groupedStudies,
        };
    }, [groupedStudies, studyObject, translations]);

    const selectedFilters = React.useMemo(() => {
        if (!translations) return;
        return intensityStatusFiltersValue();
    }, [translations, intensityStatusFiltersValue]);

    const content = () => (
        <>
            {selectedFilters.groupedStudies.length > 1 && (
                <Pagination studies={selectedFilters.groupedStudies} setStudy={setStudy} study={study} />
            )}
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${selectedFilters.studyObject.VILLAGE_NAME}, ${t(
                    selectedFilters.studyObject.ISO2 === "NA" ? "common.COUNTRY_NA" : selectedFilters.studyObject.ISO2
                )}`}</Box>
            </Typography>
            <Typography variant="subtitle2">{`${t(selectedFilters.studyObject.ASSAY_TYPE)}, ${t(
                selectedFilters.studyObject.TYPE
            )}`}</Typography>
            <HighchartsReact highcharts={Highcharts} options={options} />
            <Citation study={selectedFilters.studyObject} />
            <Curation study={selectedFilters.studyObject} />
        </>
    );
    return (
        <>
            <Hidden smUp>
                <ChatContainer width={"100%"}>{content()}</ChatContainer>
            </Hidden>
            <Hidden smDown>
                <ChatContainer width={"500px"}>{content()}</ChatContainer>
            </Hidden>
        </>
    );
};
export default connect(mapStateToProps)(IntensityInvolvementChart);
