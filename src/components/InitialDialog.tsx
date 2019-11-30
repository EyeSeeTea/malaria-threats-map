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
import { selectIsInitialDialogOpen } from "../store/reducers/base-reducer";
import { setInitialDialogOpen } from "../store/actions/base-actions";
import { connect } from "react-redux";
import LanguageSelector from "./LanguageSelector";
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
  initialDialogOpen: selectIsInitialDialogOpen(state)
});

const mapDispatchToProps = {
  setInitialDialogOpen: setInitialDialogOpen
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function InitialDialog({ initialDialogOpen, setInitialDialogOpen }: Props) {
  function handleClose() {
    setInitialDialogOpen(false);
  }

  return (
    <Dialog
      id="initial-dialog"
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
          <LanguageSelector />
        </Column>
      </Row>
      <Row>
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
