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

const FlexGrow = styled.div`
  flex-grow: 1;
`;
const Row = styled.div`
  flex: 1;
  display: flex;
`;

const Column = styled.div`
  padding-left: 10px;
  padding-right: 10px;
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
      <Row>
        <FlexGrow />
        <Column>
          <LanguageSelectorSelect />
        </Column>
      </Row>
      <Row id="dialog">
        <SimpleCard
          title="VECTOR INSECTICIDE RESISTANCE"
          theme="prevention"
          description="Resistance of malaria mosquitoes to insecticides used in core prevention tools of treated bed nets and indoor residual sprays threatens vector control effectiveness"
          Icon={PreventionIcon}
          onSelection={handleClose}
        />
        <SimpleCard
          title="PARASITE pfhrp2/3 GENE DELETIONS"
          theme="diagnosis"
          description="Gene deletions among some malaria parasites cause false negative diagnostic test results, complicating case management and control"
          Icon={DiagnosisIcon}
          onSelection={handleClose}
        />
        <SimpleCard
          title="PARASITE DRUG EFFICACY AND RESISTANCE"
          theme="treatment"
          description="Resistance of malaria parasites to artemisinin – the core compound of the best available antimalarial medicines – threatens antimalarial drug efficacy"
          Icon={TreatmentIcon}
          onSelection={handleClose}
        />
        <SimpleCard
          title="INVASIVE VECTOR SPECIES"
          theme="invasive"
          description=""
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
