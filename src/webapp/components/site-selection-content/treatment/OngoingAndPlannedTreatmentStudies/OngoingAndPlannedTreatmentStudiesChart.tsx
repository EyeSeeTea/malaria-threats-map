import * as React from "react";
import styled from "styled-components";
import { Pagination } from "@mui/material";

import { SelectionData } from "../../../../store/SelectionData";
import OngoingAndPlannedTreatmentStudiesPage from "./OngoingAndPlannedTreatmentStudiesPage";

type OngoingAndPlannedTreatmentStudiesChartProps = {
    selectionData: SelectionData;
    isPaginated?: boolean;
};

const OngoingAndPlannedTreatmentStudiesChart = ({
    selectionData,
    isPaginated = true,
}: OngoingAndPlannedTreatmentStudiesChartProps) => {
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

    const getStudiesDetailsConfig = React.useCallback(
        dataPage => {
            if (
                selectionData.kind === "common" &&
                (selectionData.data.kind === "therapeutic-efficacy-studies" ||
                    selectionData.data.kind === "molecular-markers-ongoing-studies")
            ) {
                return selectionData.data.data.length && selectionData.data.data[dataPage].studiesDetailsConfig;
            } else {
                return null;
            }
        },
        [selectionData]
    );

    const getOverviewInfo = React.useCallback(
        dataPage => {
            if (
                selectionData.kind === "common" &&
                (selectionData.data.kind === "therapeutic-efficacy-studies" ||
                    selectionData.data.kind === "molecular-markers-ongoing-studies")
            ) {
                return selectionData.data.data && selectionData.data.data[dataPage].overviewInfo;
            } else {
                return null;
            }
        },
        [selectionData]
    );

    if (
        selectionData.kind !== "common" ||
        (selectionData.data.kind !== "therapeutic-efficacy-studies" &&
            selectionData.data.kind !== "molecular-markers-ongoing-studies")
    ) {
        return null;
    }

    return (
        <Container>
            {isPaginated ? (
                <>
                    <OngoingAndPlannedTreatmentStudiesPage
                        selectionData={selectionData}
                        overviewInfo={getOverviewInfo(currentPage - 1)}
                        studiesDetailsConfig={getStudiesDetailsConfig(currentPage - 1)}
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
                </>
            ) : (
                Array.from(new Array(totalPages).keys()).map(page => (
                    <Container key={`OngoingAndPlannedTreatmentStudies_${page}`}>
                        <OngoingAndPlannedTreatmentStudiesPage
                            selectionData={selectionData}
                            overviewInfo={getOverviewInfo(page)}
                            studiesDetailsConfig={getStudiesDetailsConfig(page)}
                        />
                    </Container>
                ))
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
