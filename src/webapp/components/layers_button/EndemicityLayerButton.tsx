import React from "react";
import { State } from "../../store/types";
import { connect } from "react-redux";
import { Button } from "@mui/material";
import { selectEndemicity } from "../../store/reducers/base-reducer";
import { toggleEndemicityLayerAction } from "../../store/actions/base-actions";
import { useTranslation } from "react-i18next";
import { sendAnalytics } from "../../utils/analytics";
import styled from "styled-components";
import EndemicImage from "../../assets/img/endemic.png";

const StyledButton = styled(Button)`
    text-transform: none;
    padding: 0px;
    border-radius: 12px;
`;

const Row = styled.div`
    padding: 4px 0px 0px 8px;
    display: flex;
    flex-direction: row;
`;

const Title = styled.span`
    padding: 8px 0px 0px 8px;
    font-size: 12px;
    width: 120px;
`;

const Image = styled.img`
    border-radius: 12px;
    width: 60px;
    height: 60px;
    object-fit: cover;
`;

const mapStateToProps = (state: State) => ({
    endemicityLayer: selectEndemicity(state),
});

const mapDispatchToProps = {
    toogleEndemicityLayer: toggleEndemicityLayerAction,
};

type DispatchProps = typeof mapDispatchToProps;
type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    onClick?: () => void;
};
type Props = DispatchProps & StateProps & OwnProps;

const EndemicityLayerButton: React.FC<Props> = ({ toogleEndemicityLayer, endemicityLayer, onClick }) => {
    const { t } = useTranslation();
    const handleToggle = () => {
        const newValue = !endemicityLayer;
        if (newValue) sendAnalytics({ type: "event", category: "menu", action: "shade" });
        toogleEndemicityLayer(newValue);

        if (onClick) {
            onClick();
        }
    };

    console.log({ endemicityLayer });

    return (
        <Row>
            <StyledButton onClick={handleToggle}>
                <Image src={EndemicImage} />
            </StyledButton>
            <Title> {t("common.icons.endemicity")}</Title>
        </Row>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(EndemicityLayerButton);
