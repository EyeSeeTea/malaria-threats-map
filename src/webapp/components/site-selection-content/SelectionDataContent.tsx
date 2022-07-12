import * as React from "react";
import styled from "styled-components";
import { Divider, Paper, Typography } from "@mui/material";
import { connect } from "react-redux";
import { selectSelectionData } from "../../store/reducers/base-reducer";
import { State } from "../../store/types";
import IntegrationReactSelect from "../BasicSelect";
import FormLabel from "@mui/material/FormLabel";
import { sendAnalytics } from "../../utils/analytics";
import Hidden from "../hidden/Hidden";
import SiteTitle from "../site-title/SiteTitle";
import CitationNew from "../charts/CitationNew";
import CurationNew from "../charts/CurationNew";
import OtherInsecticideClasses from "../layers/prevention/common/OtherInsecticideClasses";
import { setSelectionDataFilterSelection } from "../../store/actions/base-actions";
import PreventionChart from "./prevention/PreventionChart";
import DiagnosisChart from "./diagnosis/DiagnosisChart";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";

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
    preventionFilters: selectPreventionFilters(state),
    selectionData: selectSelectionData(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {
    setSelectionFilterSelection: setSelectionDataFilterSelection,
};
type DispatchProps = typeof mapDispatchToProps;

type Props = StateProps & DispatchProps;

const SelectionDataContent = ({ preventionFilters, selectionData, setSelectionFilterSelection }: Props) => {
    const onFiltersChange = (value: any) => {
        sendAnalytics({ type: "event", category: "popup", action: "filter" });
        setSelectionFilterSelection(value);
    };

    const chartCataContent = () => {
        switch (selectionData.data.kind) {
            case "prevention": {
                return <PreventionChart mapType={preventionFilters.mapType} selectionData={selectionData} />;
            }
            case "diagnosis": {
                return <DiagnosisChart selectionData={selectionData} />;
            }
        }
    };

    console.log({ selectionData });

    const content = () =>
        selectionData ? (
            <>
                <TopContainer>
                    <SiteTitle title={selectionData.title} />
                    <Typography variant="subtitle2">{selectionData.subtitle}</Typography>
                    {selectionData.filterOptions && selectionData.filterOptions.length > 1 && (
                        <Flex>
                            <FormLabel component="legend">Species</FormLabel>
                            <StyledSelect
                                isClearable
                                isMulti
                                suggestions={selectionData.filterOptions}
                                onChange={onFiltersChange}
                                value={selectionData.filterSelection}
                            />
                        </Flex>
                    )}
                </TopContainer>

                <Divider sx={{ marginBottom: 2, marginTop: 2 }} />
                <RoundedContainer>
                    {selectionData.data && chartCataContent()}

                    <CitationNew dataSources={selectionData.dataSources} />
                    {selectionData.curations.length > 0 && <CurationNew curations={selectionData.curations} />}
                </RoundedContainer>

                {selectionData.othersDetected.length > 0 && (
                    <RoundedContainer margin="16px 8px">
                        <OtherInsecticideClasses otherInsecticideClasses={selectionData.othersDetected} />
                    </RoundedContainer>
                )}
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
export default connect(mapStateToProps, mapDispatchToProps)(SelectionDataContent);
