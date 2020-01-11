import React from "react";
import Dialog from "@material-ui/core/Dialog";
import SimpleCard from "./Card";
import styled from "styled-components";
import {
  DiagnosisIcon,
  InvasiveIcon,
  PreventionIcon,
  TreatmentIcon
} from "./Icons";
import { State } from "../store/types";
import {
  selectIsInitialDialogOpen,
  selectTour
} from "../store/reducers/base-reducer";
import {
  setInitialDialogOpen,
  setTourStepAction
} from "../store/actions/base-actions";
import { connect } from "react-redux";
import LanguageSelectorSelect from "./LanguageSelectorSelect";
import { useTranslation } from "react-i18next";
import { Typography } from "@material-ui/core";

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

const LanguageWrapper = styled.div`
  max-width: 200px;
`;

const WhiteColumn = styled(Column)`
  color: white;
`;

const mapStateToProps = (state: State) => ({
  tour: selectTour(state),
  initialDialogOpen: selectIsInitialDialogOpen(state)
});

const mapDispatchToProps = {
  setTourStep: setTourStepAction,
  setInitialDialogOpen: setInitialDialogOpen
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function InitialDialog({
  initialDialogOpen,
  setInitialDialogOpen,
  tour,
  setTourStep
}: Props) {
  const { t } = useTranslation("common");
  function handleClose() {
    if (tour.open) {
      setTourStep(tour.step + 1);
    }
    setInitialDialogOpen(false);
  }

  return (
    <Dialog
      open={initialDialogOpen}
      maxWidth={"lg"}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none"
        }
      }}
    >
      <CenteredRow>
        <WhiteColumn  id="title">
          <Typography variant="h2" color={"inherit"}>
            {t("title.title")}
          </Typography>
          <Typography variant="h6">{t("title.subtitle")}</Typography>
        </WhiteColumn>
        <FlexGrow />
        <LanguageWrapper>
          <LanguageSelectorSelect />
        </LanguageWrapper>
      </CenteredRow>
      <Row id="dialog">
        <SimpleCard
          title={t("themes_caps.prevention")}
          theme="prevention"
          description={t("cards.prevention")}
          Icon={PreventionIcon}
          onSelection={handleClose}
        />
        <SimpleCard
          title={t("themes_caps.diagnosis")}
          theme="diagnosis"
          description={t("cards.diagnosis")}
          Icon={DiagnosisIcon}
          onSelection={handleClose}
        />
        <SimpleCard
          title={t("themes_caps.treatment")}
          theme="treatment"
          description={t("cards.treatment")}
          Icon={TreatmentIcon}
          onSelection={handleClose}
        />
        <SimpleCard
          title={t("themes_caps.invasive")}
          theme="invasive"
          description={t("cards.invasive")}
          Icon={InvasiveIcon}
          onSelection={handleClose}
        />
      </Row>
    </Dialog>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InitialDialog);
