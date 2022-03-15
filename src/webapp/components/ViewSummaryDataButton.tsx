import React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { selectViewData, selectSelection,  selectIsTooltipOpen} from "../store/reducers/base-reducer";
import {
    setTooltipOpen,
} from "../store/actions/base-actions";
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
    tooltipOpen: selectIsTooltipOpen(state)

});

const mapDispatchToProps = {
    setViewData: setViewData,
    setTooltipOpen: setTooltipOpen
};

type StateProps = ReturnType<typeof mapStateToProps>;

type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const ViewSummaryDataButton = ({ setViewData, selection, setTooltipOpen, tooltipOpen }: Props) => {

    const { t } = useTranslation();
    const handleOnClick = () => {
        if(!tooltipOpen) {
            setTooltipOpen(true);
        }
        setViewData(selection);
    }
    return <StyledButton onClick={handleOnClick}>View summary of the data</StyledButton>;
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewSummaryDataButton);
