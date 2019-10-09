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

const Row = styled.div`
  flex: 1;
  display: flex;
`;

export default function InitialDialog() {
  const [open, setOpen] = React.useState(true);

  function handleClose() {
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
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
