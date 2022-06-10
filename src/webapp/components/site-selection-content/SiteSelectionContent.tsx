import React from "react";
import { connect } from "react-redux";
import { setSelection } from "../../store/actions/base-actions";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SelectionDataContent from "./SelectionDataContent";

export const Container = styled.div`
    padding: 60px 0px;
`;

export const IconContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: end;
`;

const mapDispatchToProps = {
    setSelection: setSelection,
};

type DispatchProps = typeof mapDispatchToProps;

const SiteSelectionContent: React.FC<DispatchProps> = ({ setSelection }) => {
    const handleClose = React.useCallback(() => {
        setSelection(null);
    }, [setSelection]);

    return (
        <Container>
            <IconContainer>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </IconContainer>

            <SelectionDataContent />
        </Container>
    );
};

export default connect(null, mapDispatchToProps)(SiteSelectionContent);
