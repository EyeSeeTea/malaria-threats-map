import React from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { selectIsTooltipOpen } from "../store/reducers/base-reducer";
import { setTooltipOpen } from "../store/actions/base-actions";
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
    tooltipOpen: selectIsTooltipOpen(state),
});

const mapDispatchToProps = {
    setTooltipOpen: setTooltipOpen,
};

type StateProps = ReturnType<typeof mapStateToProps>;

type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const ViewSummaryDataButton = ({ tooltipOpen, setTooltipOpen }: Props) => {
    const { t } = useTranslation();

    return <StyledButton onClick={() => setTooltipOpen(!tooltipOpen)}>View summary of the data</StyledButton>
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewSummaryDataButton);

