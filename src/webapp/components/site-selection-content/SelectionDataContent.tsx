import * as React from "react";
import styled from "styled-components";
import { Divider, Paper, Typography, IconButton } from "@mui/material";
import { connect } from "react-redux";
import { selectSelectionData } from "../../store/reducers/base-reducer";
import { PreventionFilters, State } from "../../store/types";
import IntegrationReactSelect, { Option } from "../BasicSelect";
import FormLabel from "@mui/material/FormLabel";
import { sendAnalytics } from "../../utils/analytics";
import Hidden from "../hidden/Hidden";
import SiteTitle from "../site-title/SiteTitle";
import CitationNew from "../charts/CitationNew";
import CurationNew from "../charts/CurationNew";
import { setSelection, setSelectionDataFilterSelection } from "../../store/actions/base-actions";
import OtherInfo from "../layers/prevention/common/OtherInfo";
import PreventionChart from "./prevention/PreventionChart";
import { selectPreventionFilters } from "../../store/reducers/prevention-reducer";
import InvasiveChart from "./invasive/InvasiveChart";
import PreventionMechanismsChart from "./prevention/PreventionMechanismsChart";
import TreatmentChart from "./treatment/TreatmentChart";
import AditionalInformation from "../layers/treatment/common/Aditionalnformation";
import MolecularMarkersChart from "./treatment/MolecularMarkersChart";
import { CommonSelectionData } from "../../store/SelectionData";
import { InvasiveSelectionData } from "../../store/epics/invasive/types";
import { PayloadActionCreator } from "typesafe-actions";
import { ActionTypeEnum } from "../../store/actions";
import { DiagnosisSelectionData } from "../../store/epics/diagnosis/types";
import CloseIcon from "@mui/icons-material/Close";
import OngoingAndPlannedTreatmentStudiesChart from "./treatment/OngoingAndPlannedTreatmentStudies/OngoingAndPlannedTreatmentStudiesChart";
import Hrp23StudiesChart from "./diagnosis/Hrp23StudiesChart";
import GeneDeletionsChart from "./diagnosis/GeneDeletionsChart";

const Container = styled.div<{ width?: string; padding?: string }>`
    width: ${props => props.width || "100%"};
    padding: ${props => props.padding || "70px 0px;"};
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

const StyledIconButton = styled(IconButton)`
    position: absolute;
    top: 65px;
    right: 10px;
`;

export const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const mapStateToProps = (state: State) => ({
    preventionFilters: selectPreventionFilters(state),
    selectionData: selectSelectionData(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = {
    setSelectionFilterSelection: setSelectionDataFilterSelection,
    setSelection: setSelection,
};
type DispatchProps = typeof mapDispatchToProps;

type OwnProps = {
    onClose: () => void;
    isScreenshot?: boolean;
    children?: React.ReactNode;
};

type Props = StateProps & DispatchProps & OwnProps;

const SelectionDataContent = ({
    preventionFilters,
    selectionData,
    setSelectionFilterSelection,
    onClose,
    isScreenshot = false,
    children,
}: Props) => {
    const chartDataContent = () => {
        switch (selectionData.kind) {
            case "common": {
                return (
                    <CommonContent
                        selectionData={selectionData}
                        preventionFilters={preventionFilters}
                        setSelectionFilterSelection={setSelectionFilterSelection}
                        isScreenshot={isScreenshot}
                    >
                        {children}
                    </CommonContent>
                );
            }
            case "invasive": {
                return <InvasiveContent selectionData={selectionData}>{children}</InvasiveContent>;
            }
            case "diagnosis": {
                return <DiagnosisContent selectionData={selectionData}>{children}</DiagnosisContent>;
            }
        }
    };

    return (
        <>
            <Hidden smUp>
                <Container width={"100%"}>{selectionData && chartDataContent()}</Container>
            </Hidden>
            <Hidden smDown>
                <Container width={isScreenshot ? "100%" : "500px"} padding={isScreenshot ? "0" : "70px 0px;"}>
                    {selectionData && chartDataContent()}
                </Container>
            </Hidden>

            {isScreenshot ? null : (
                <StyledIconButton onClick={onClose}>
                    <CloseIcon />
                </StyledIconButton>
            )}
        </>
    );
};
export default connect(mapStateToProps, mapDispatchToProps)(SelectionDataContent);

const InvasiveContent: React.FC<{ selectionData: InvasiveSelectionData; children?: React.ReactNode }> = ({
    selectionData,
    children,
}) => {
    return (
        <>
            <TopContainer>
                <SiteTitle title={selectionData.title} />
            </TopContainer>

            <Divider sx={{ marginBottom: 2, marginTop: 2 }} />
            {selectionData.data && selectionData.data.length && <InvasiveChart selectionData={selectionData} />}
            {children}
        </>
    );
};

const DiagnosisContent: React.FC<{ selectionData: DiagnosisSelectionData; children?: React.ReactNode }> = ({
    selectionData,
    children,
}) => {
    return (
        <>
            <TopContainer>
                <SiteTitle title={selectionData.title} />
                <Typography variant="subtitle2" sx={{ whiteSpace: "pre-line" }}>
                    {selectionData.subtitle}
                </Typography>
            </TopContainer>

            <Divider sx={{ marginBottom: 2, marginTop: 2 }} />
            {selectionData.data.kind === "hrp23-studies" ? (
                <Hrp23StudiesChart selectionData={selectionData} />
            ) : (
                <RoundedContainer>
                    {selectionData.data && <GeneDeletionsChart selectionData={selectionData} />}

                    {selectionData.dataSources && <CitationNew dataSources={selectionData.dataSources} />}
                    {selectionData.curations.length > 0 && <CurationNew curations={selectionData.curations} />}
                </RoundedContainer>
            )}

            {children}
        </>
    );
};

const CommonContent: React.FC<{
    selectionData: CommonSelectionData;
    preventionFilters: PreventionFilters;
    setSelectionFilterSelection: PayloadActionCreator<ActionTypeEnum.SetSelectionDataFilterSelection, Option[]>;
    isScreenshot?: boolean;
    children?: React.ReactNode;
}> = ({ selectionData, preventionFilters, setSelectionFilterSelection, isScreenshot = false, children }) => {
    const onFiltersChange = (value: any) => {
        sendAnalytics({ type: "event", category: "popup", action: "filter" });
        setSelectionFilterSelection(value);
    };

    const chartDataContent = () => {
        switch (selectionData.data.kind) {
            case "prevention": {
                return <PreventionChart mapType={preventionFilters.mapType} selectionData={selectionData} />;
            }
            case "prevention-mechanism": {
                return <PreventionMechanismsChart selectionData={selectionData} />;
            }
            case "treatment": {
                return <TreatmentChart selectionData={selectionData} />;
            }
            case "treatment-molecular-markers": {
                return <MolecularMarkersChart selectionData={selectionData} />;
            }
        }
    };

    return (
        <>
            <TopContainer>
                <SiteTitle title={selectionData.title} />
                <Typography variant="subtitle2" sx={{ whiteSpace: "pre-line" }}>
                    {selectionData.subtitle}
                </Typography>
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
            {selectionData.data?.kind === "therapeutic-efficacy-studies" ||
            selectionData.data?.kind === "molecular-markers-ongoing-studies" ? (
                <OngoingAndPlannedTreatmentStudiesChart selectionData={selectionData} isPaginated={!isScreenshot} />
            ) : (
                <RoundedContainer>
                    {selectionData.data && chartDataContent()}

                    {selectionData.dataSources && <CitationNew dataSources={selectionData.dataSources} />}
                    {selectionData.curations.length > 0 && <CurationNew curations={selectionData.curations} />}
                    {selectionData.aditionalInformation && (
                        <AditionalInformation info={selectionData.aditionalInformation} />
                    )}
                </RoundedContainer>
            )}

            {selectionData.othersDetected.length > 0 && (
                <RoundedContainer margin="16px 8px">
                    <OtherInfo title={selectionData.othersTitle} info={selectionData.othersDetected} />
                </RoundedContainer>
            )}

            {children}
        </>
    );
};
