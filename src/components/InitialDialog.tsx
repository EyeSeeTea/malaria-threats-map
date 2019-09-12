import React from "react";
import Dialog from "@material-ui/core/Dialog";
import {
  PreventionCard,
  DiagnosisCard,
  TreatmentCard,
  InvasiveCard
} from "./Card";
import styled from "styled-components";

const Row = styled.div`
  flex: 1;
  display: flex;
`;

export default function InitialDialog() {
  const [open, setOpen] = React.useState(true);

  function handleClickOpen() {
    setOpen(true);
  }

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
        <PreventionCard />
        <DiagnosisCard />
        <TreatmentCard />
        <InvasiveCard />
      </Row>
    </Dialog>
  );
}
