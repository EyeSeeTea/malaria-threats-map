import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Divider } from "@mui/material";

import ListSelector, { ListSelectorItem } from "../../list-selector/ListSelector";
import ExpandableContainer from "../../expandable-container/ExpandableContainer";

type MapTypeStudyGroupsProps = {
    onChange: (selection: ListSelectorItem) => void;
    onMouseOver: (selection: ListSelectorItem) => void;
    studyResults: ListSelectorItem[];
    ongoingAndPlannedStudies: ListSelectorItem[];
    studyResultsValue: ListSelectorItem;
    ongoingAndPlannedStudiesValue: ListSelectorItem;
};

function MapTypeStudyGroups({
    onChange,
    onMouseOver,
    studyResults,
    ongoingAndPlannedStudies,
    studyResultsValue,
    ongoingAndPlannedStudiesValue,
}: MapTypeStudyGroupsProps) {
    const { t } = useTranslation();

    return (
        <MapTypeStudyGroupsContainer>
            <Divider />
            <ExpandableContainer placeholder={t("mapActions.mapTypeStudyResults")} expanded>
                <ListSelector
                    items={studyResults}
                    onChange={onChange}
                    onMouseOver={onMouseOver}
                    value={studyResultsValue}
                />
            </ExpandableContainer>
            <Divider />
            <ExpandableContainer placeholder={t("mapActions.mapTypeOngoingAndPlannedStudies")} expanded>
                <ListSelector
                    items={ongoingAndPlannedStudies}
                    onChange={onChange}
                    onMouseOver={onMouseOver}
                    value={ongoingAndPlannedStudiesValue}
                />
            </ExpandableContainer>
        </MapTypeStudyGroupsContainer>
    );
}

export default MapTypeStudyGroups;

const MapTypeStudyGroupsContainer = styled.div`
    .MuiListItem-root .MuiButton-root {
        padding-bottom: 0;
        padding-right: 0;
    }
`;
