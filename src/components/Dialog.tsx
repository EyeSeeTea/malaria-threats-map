import React from "react";
import Dialog from "@material-ui/core/Dialog";
import Card from "../components/Card";
import styled from "styled-components";

const Row = styled.div`
  flex: 1;
  display: flex;
`;

export default function AlertDialog() {
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
      maxWidth={"xl"}
      onClose={handleClose}
      PaperProps={{
        style: {
          backgroundColor: "transparent",
          boxShadow: "none"
        }
      }}
    >
      <Row>
        <Card />
        <Card />
        <Card />
        <Card />
      </Row>
    </Dialog>
  );
}
