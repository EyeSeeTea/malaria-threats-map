import React from "react";
import Dialog from "@mui/material/Dialog";
import SimpleCard from "./Card";
import styled from "styled-components";
import { DiagnosisIcon, InvasiveIcon, PreventionIcon, TreatmentIcon } from "./Icons";
import { State } from "../store/types";
import { selectIsInitialDialogOpen, selectTour } from "../store/reducers/base-reducer";
import { setInitialDialogOpen, setThemeAction, setTourStepAction } from "../store/actions/base-actions";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { Container, Typography } from "@mui/material";
import { sendAnalytics } from "../utils/analytics";
import { getAnalyticsPageView } from "../store/analytics";

const FlexGrow = styled.div`
    flex-grow: 1;
`;
const Row = styled.div`
    display: flex;
`;

const CenteredRow = styled(Row)`
    align-items: center;
    min-width: 20px;
`;

const Column = styled.div`
    padding-left: 10px;
    padding-right: 10px;
`;

const WhiteColumn = styled(Column)`
    color: white;
`;

const mapStateToProps = (state: State) => ({
    tour: selectTour(state),
    initialDialogOpen: selectIsInitialDialogOpen(state),
});

const mapDispatchToProps = {
    setTheme: setThemeAction,
    setTourStep: setTourStepAction,
    setInitialDialogOpen: setInitialDialogOpen,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function InitialDialog({ initialDialogOpen, setInitialDialogOpen, tour, setTourStep }: Props) {
    const { t } = useTranslation();
    function handleClose() {
        if (tour.open) {
            setTourStep(tour.step + 1);
        }
        setInitialDialogOpen(false);
    }
    function logAndClose() {
        sendAnalytics({ type: "event", category: "homeItem", action: "exit" });
        const pageView = getAnalyticsPageView({ page: "prevention" });
        sendAnalytics({ type: "pageView", path: pageView.path });
        handleClose();
    }

    React.useEffect(() => {
        if (initialDialogOpen) sendAnalytics({ type: "pageView", path: "Home" });
    }, [initialDialogOpen]);

    return (
        <Dialog
            open={initialDialogOpen}
            maxWidth={"lg"}
            onClose={logAndClose}
            PaperProps={{
                style: {
                    backgroundColor: "transparent",
                    boxShadow: "none",
                },
            }}
            BackdropProps={{
                style: {},
            }}
        >
            <Container maxWidth={"xl"}>
                <CenteredRow id="title">
                    <WhiteColumn>
                        <Typography variant="h2" color={"inherit"}>
                            {t("common.title.title")}
                        </Typography>
                        <Typography variant="h6">{t("common.title.subtitle")}</Typography>
                    </WhiteColumn>
                    <FlexGrow />
                </CenteredRow>
                <Row id="dialog">
                    <SimpleCard
                        title={t("common.themes_caps.prevention")}
                        theme="prevention"
                        description={t("common.cards.prevention")}
                        Icon={PreventionIcon}
                        onSelection={handleClose}
                    />
                    <SimpleCard
                        title={t("common.themes_caps.diagnosis")}
                        theme="diagnosis"
                        description={t("common.cards.diagnosis")}
                        Icon={DiagnosisIcon}
                        onSelection={handleClose}
                    />
                    <SimpleCard
                        title={t("common.themes_caps.treatment")}
                        theme="treatment"
                        description={t("common.cards.treatment")}
                        Icon={TreatmentIcon}
                        onSelection={handleClose}
                        hasFooter
                    />
                    <SimpleCard
                        title={t("common.themes_caps.invasive")}
                        theme="invasive"
                        description={t("common.cards.invasive")}
                        Icon={InvasiveIcon}
                        onSelection={handleClose}
                    />
                </Row>
            </Container>
        </Dialog>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(InitialDialog);
