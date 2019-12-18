import React from "react";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import {
  Button,
  createStyles,
  DialogActions,
  DialogContent,
  IconButton,
  makeStyles,
  Theme,
  Typography
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
// @ts-ignore
import JsxParser from "react-jsx-parser";
import { FlexGrow } from "./Chart";
import styled from "styled-components";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: theme.spacing(2, 0),
      width: "100%"
    }
  })
);

const Wrapper = styled.div`
  padding: 0 16px;
`;

const InitialDisclaimer = () => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles({});
  const { t } = useTranslation("common");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Wrapper>
      <Button
        variant="outlined"
        size="small"
        color="primary"
        onClick={handleClickOpen}
      >
        {t("disclaimer.title")}
      </Button>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: classes.paper
        }}
      >
        <DialogActions>
          <Wrapper>
            <Typography variant="h5">{t("disclaimer.title")}</Typography>
          </Wrapper>
          <FlexGrow />
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent>
          <JsxParser jsx={t("disclaimer.p1")} />
          <br />
          <JsxParser jsx={t("disclaimer.p2")} />
          <br />
          <JsxParser jsx={t("disclaimer.p3")} />
          <br />
          <JsxParser jsx={t("disclaimer.p4")} />
        </DialogContent>
        <DialogActions />
      </Dialog>
    </Wrapper>
  );
};

export default InitialDisclaimer;
