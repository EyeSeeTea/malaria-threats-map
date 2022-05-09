import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { Button } from "@mui/material";
import { selectEndemicity } from "../../store/reducers/base-reducer";
import { toggleEndemicityLayerAction } from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import { sendAnalytics } from "../../utils/analytics";
import styled from "styled-components";

const StyledButton = styled(Button)<{ selected: boolean }>`
    background: ${props => (props.selected ? "grey" : "palevioletred")};
    text-transform: none;
    width: 80px;
    height: 80px;
    border-radius: 12px;
`;

const Row = styled.div`
    padding: 8px;
    display: flex;
    flex-direction: row;
`;

const Title = styled.span`
    padding: 8px;
    font-size: 16px;
    width: 120px;
`;

const mapStateToProps = (state: State) => ({
    endemicityLayer: selectEndemicity(state),
});

const mapDispatchToProps = {
    toogleEndemicityLayer: toggleEndemicityLayerAction,
};

type DispatchProps = typeof mapDispatchToProps;
type StateProps = ReturnType<typeof mapStateToProps>;
type Props = DispatchProps & StateProps;

const EndemicityLayerButton: React.FC<Props> = ({ toogleEndemicityLayer, endemicityLayer }) => {
    const { t } = useTranslation();
    const handleToggle = () => {
        const newValue = !endemicityLayer;
        if (newValue) sendAnalytics({ type: "event", category: "menu", action: "shade" });
        toogleEndemicityLayer(newValue);
    };

    console.log({ endemicityLayer });

    return (
        <Row>
            <StyledButton onClick={handleToggle} selected={endemicityLayer} />
            <Title> {t("common.icons.endemicity")}</Title>
        </Row>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(EndemicityLayerButton);
