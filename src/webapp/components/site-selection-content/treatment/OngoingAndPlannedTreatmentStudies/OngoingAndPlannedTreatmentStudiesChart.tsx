import * as React from "react";
import styled from "styled-components";
import { Pagination } from "@mui/material";

import {
    OngoingAndPlannedTreatmentStudiesDetailsConfig,
    OngoingAndPlannedTreatmentStudiesOverviewInfo,
    SelectionData,
} from "../../../../store/SelectionData";
import OngoingAndPlannedTreatmentStudiesPage from "./OngoingAndPlannedTreatmentStudiesPage";

type OngoingAndPlannedTreatmentStudiesChartProps = {
    selectionData: SelectionData;
};

const OngoingAndPlannedTreatmentStudiesChart = ({ selectionData }: OngoingAndPlannedTreatmentStudiesChartProps) => {
    const [currentPage, setCurrentPage] = React.useState<number>(1);

    const totalPages: number = React.useMemo(() => {
        if (
            selectionData.kind === "common" &&
            (selectionData.data.kind === "therapeutic-efficacy-studies" ||
                selectionData.data.kind === "molecular-markers-ongoing-studies")
        ) {
            return selectionData.data.data.length;
        } else {
            return 0;
        }
    }, [selectionData]);

    const studiesDetailsConfig: OngoingAndPlannedTreatmentStudiesDetailsConfig[] = React.useMemo(() => {
        if (
            selectionData.kind === "common" &&
            (selectionData.data.kind === "therapeutic-efficacy-studies" ||
                selectionData.data.kind === "molecular-markers-ongoing-studies")
        ) {
            return selectionData.data.data.length && selectionData.data.data[currentPage - 1].studiesDetailsConfig;
        } else {
            return null;
        }
    }, [selectionData, currentPage]);

    const overviewInfo: OngoingAndPlannedTreatmentStudiesOverviewInfo = React.useMemo(() => {
        if (
            selectionData.kind === "common" &&
            (selectionData.data.kind === "therapeutic-efficacy-studies" ||
                selectionData.data.kind === "molecular-markers-ongoing-studies")
        ) {
            return selectionData.data.data && selectionData.data.data[currentPage - 1].overviewInfo;
        } else {
            return null;
        }
    }, [selectionData, currentPage]);

    return (
        <Container>
            <OngoingAndPlannedTreatmentStudiesPage
                selectionData={selectionData}
                overviewInfo={overviewInfo}
                studiesDetailsConfig={studiesDetailsConfig}
            />
            {totalPages > 1 && (
                <PaginationContainer>
                    <Pagination
                        page={currentPage}
                        count={totalPages}
                        onChange={(_event, pageSelected) => setCurrentPage(pageSelected)}
                        shape="rounded"
                    />
                </PaginationContainer>
            )}
        </Container>
    );
};

export default OngoingAndPlannedTreatmentStudiesChart;

const Container = styled.div`
    margin: 15px 9px;
`;

const PaginationContainer = styled.div`
    margin-top: 15px;
    display: flex;
    justify-content: center;
`;
