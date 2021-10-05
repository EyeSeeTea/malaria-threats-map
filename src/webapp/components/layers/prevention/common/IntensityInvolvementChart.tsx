import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Box, Hidden, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import Citation from "../../../charts/Citation";
import Pagination from "../../../charts/Pagination";
import Curation from "../../../Curation";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";

const ChatContainer = styled.div<{ width?: string }>`
    width: ${props => props.width || "100%"};
`;

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
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

const IntensityInvolvementChart = ({ studyObject, options, groupedStudies, setStudy, study }: Props) => {
    const { t } = useTranslation();
    const content = () => (
        <>
            {groupedStudies.length > 1 && <Pagination studies={groupedStudies} setStudy={setStudy} study={study} />}
            <Typography variant="subtitle1">
                <Box fontWeight="fontWeightBold">{`${studyObject.VILLAGE_NAME}, ${t(
                    studyObject.ISO2 === "NA" ? "common.COUNTRY_NA" : studyObject.ISO2
                )}`}</Box>
            </Typography>
            <Typography variant="subtitle2">{`${t(studyObject.ASSAY_TYPE)}, ${t(studyObject.TYPE)}`}</Typography>
            <HighchartsReact highcharts={Highcharts} options={options} />
            <Citation study={studyObject} />
            <Curation study={studyObject} />
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
export default connect(mapStateToProps)(IntensityInvolvementChart);
