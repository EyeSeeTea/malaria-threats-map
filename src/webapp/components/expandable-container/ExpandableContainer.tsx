import React, { ReactNode } from "react";

import { Button, Collapse, ListItem } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { connect } from "react-redux";
import styled from "styled-components";

const StyledButton = styled(Button)`
    color: black;
    padding: 15px 20px;
    text-transform: none;
`;

const Placeholder = styled.span`
    text-align: start;
    flex-grow: 1;
    font-weight: bold;
`;

const Value = styled.span`
    text-align: start;
    flex-grow: 1;
`;

const TitleContainer = styled(ListItem)`
    padding: 0px;
`;

type ExpandableContainerProps = {
    key?: string;
    placeholder?: string;
    value?: ReactNode;
    expanded: boolean;
    children?: ReactNode | undefined;
    childrenMaxHeight?: string;
    onExpand?: (value: boolean) => void;
};

const ExpandableContainer: React.FC<ExpandableContainerProps> = ({
    key,
    placeholder,
    value,
    expanded,
    children,
    childrenMaxHeight,
    onExpand,
}) => {
    const [expandedState, setExpandedState] = React.useState<boolean>(expanded);

    React.useEffect(() => {
        setExpandedState(expanded);
    }, [expanded]);

    const handleExpand = () => {
        if (children) {
            if (onExpand) onExpand(!expanded);

            setExpandedState(!expandedState);
        }
    };

    return (
        <React.Fragment>
            <TitleContainer onClick={handleExpand} disableGutters>
                <StyledButton fullWidth={true}>
                    {value && (!expandedState || !placeholder) ? (
                        <Value>{value}</Value>
                    ) : (
                        <Placeholder>{placeholder}</Placeholder>
                    )}
                    {children ? expandedState ? <ExpandLess /> : <ExpandMore /> : null}
                </StyledButton>
            </TitleContainer>
            {children && (
                <Collapse
                    in={expandedState}
                    timeout="auto"
                    unmountOnExit
                    key={key || placeholder}
                    sx={{ maxHeight: childrenMaxHeight, overflow: childrenMaxHeight ? "scroll" : undefined }}
                >
                    {children}
                </Collapse>
            )}
        </React.Fragment>
    );
};

export default connect()(ExpandableContainer);
