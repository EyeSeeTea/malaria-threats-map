import * as React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import styled from "styled-components";
import { Divider, Paper, Typography } from "@mui/material";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectTheme } from "../../../../store/reducers/base-reducer";
import { State } from "../../../../store/types";
import IntegrationReactSelect from "../../../BasicSelect";
import FormLabel from "@mui/material/FormLabel";
import { sendAnalytics } from "../../../../utils/analytics";
import Hidden from "../../../hidden/Hidden";
import SiteTitle from "../../../site-title/SiteTitle";
import { chartOptions, getTranslations } from "./utils";
import CitationNew from "../../../charts/CitationNew";
import CurationNew from "../../../charts/CurationNew";
import OtherInsecticideClasses from "../common/OtherInsecticideClasses";
import { selectPreventionSelectionData } from "../../../../store/reducers/prevention-reducer";
import { setPreventionSelectionDataSpecies } from "../../../../store/actions/prevention-actions";

const Container = styled.div<{ width?: string }>`
    width: ${props => props.width || "100%"};
`;

const TopContainer = styled.div`
    margin: 0px 8px;
    padding: 0px 12px;
`;

const RoundedContainer = styled(Paper)<{ margin?: string }>`
    padding: 12px 20px;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    border-radius: 12px;
    box-shadow: none;
    margin: ${props => props.margin || "0px 8px"}; ;
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
    selectionData: selectPreventionSelectionData(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {
    setPreventionSelectionDataSpecies: setPreventionSelectionDataSpecies,
};
type DispatchProps = typeof mapDispatchToProps;

type Props = StateProps & DispatchProps;

const ResistanceStatusChart = ({ selectionData, setPreventionSelectionDataSpecies }: Props) => {
    const { t } = useTranslation();

    const onSpeciesChange = (value: any) => {
        sendAnalytics({ type: "event", category: "popup", action: "filter" });
        setPreventionSelectionDataSpecies(value);
    };

    const content = () =>
        selectionData ? (
            <>
                <TopContainer>
                    <SiteTitle title={selectionData.title} />
                    <Typography variant="subtitle2">{t(selectionData.studyObject.ASSAY_TYPE)}</Typography>
                    {selectionData.filterOptions.length > 1 && (
                        <Flex>
                            <FormLabel component="legend">Species</FormLabel>
                            <StyledSelect
                                isClearable
                                isMulti
                                suggestions={selectionData.filterOptions}
                                onChange={onSpeciesChange}
                                value={selectionData.filterSelection}
                            />
                        </Flex>
                    )}
                </TopContainer>

                <Divider sx={{ marginBottom: 2, marginTop: 2 }} />
                <RoundedContainer>
                    {Object.keys(selectionData.data).map(specie => {
                        const dataItems = Object.keys(selectionData.data[specie]);

                        return (
                            <React.Fragment key={specie}>
                                <Typography color="primary" variant="body2" fontWeight="bold">
                                    {t(specie)}
                                </Typography>
                                <Typography variant="caption">{t(selectionData.studyObject.TYPE)}</Typography>
                                {dataItems.map((insecticideType, index) => {
                                    return (
                                        <div key={insecticideType}>
                                            <HighchartsReact
                                                highcharts={Highcharts}
                                                options={chartOptions(
                                                    selectionData.data[specie][insecticideType],
                                                    getTranslations(insecticideType)
                                                )}
                                            />
                                            {index < dataItems.length - 1 ? <Divider sx={{ marginBottom: 2 }} /> : null}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}
                    <Typography variant="caption" sx={{ marginBottom: 2 }}>
                        {t("common.prevention.chart.not_reported")}
                    </Typography>

                    <CitationNew dataSources={selectionData.dataSources} />
                    <CurationNew curations={selectionData.curations} />
                </RoundedContainer>
                <RoundedContainer margin="16px 8px">
                    <OtherInsecticideClasses otherInsecticideClasses={selectionData.othersDetected} />
                </RoundedContainer>
            </>
        ) : null;

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
export default connect(mapStateToProps, mapDispatchToProps)(ResistanceStatusChart);
