import React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { selectViewData, selectSelection, selectIsSidebarOpen } from "../store/reducers/base-reducer";
import { setSidebarOpen } from "../store/actions/base-actions";
import { setViewData } from "../store/actions/base-actions";
import { State } from "../store/types";
import { connect } from "react-redux";

const StyledButton = styled(Button)`
    &.MuiButton-text {
        text-transform: none;
    }
    &.MuiButton-root {
        padding: 0;
        text-decoration: underline;

        &:hover {
            border: none;
            text-decoration: underline;
        }
    }
`;

const mapStateToProps = (state: State) => ({
    viewData: selectViewData(state),
    selection: selectSelection(state),
    sidebarOpen: selectIsSidebarOpen(state),
});

const mapDispatchToProps = {
    setViewData: setViewData,
    setSidebarOpen: setSidebarOpen,
};

type StateProps = ReturnType<typeof mapStateToProps>;

type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const ViewSummaryDataButton = ({ setViewData, selection, setSidebarOpen, sidebarOpen }: Props) => {
    const { t } = useTranslation();
    const handleOnClick = () => {
        if (!sidebarOpen) {
            setSidebarOpen(true);
        }
        setViewData(selection);
    };
    return <StyledButton onClick={handleOnClick}>{t("common.chart.view_summary")}</StyledButton>;
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewSummaryDataButton);
