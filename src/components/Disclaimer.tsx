import React from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import CloseIcon from "@material-ui/icons/Close";
import {
  createStyles,
  DialogActions,
  DialogContent,
  Hidden,
  IconButton,
  makeStyles,
  Theme
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: theme.spacing(1),
      width: "100%"
    }
  })
);

const DisclaimerText = styled.div`
  font-size: 60%;
  line-height: 11px;
  background-color: #e0e0e0;
  flex-grow: 0;
  color: rgba(0, 0, 0, 0.87);
  padding: 5px;
`;

const DisclaimerTextButton = styled(DisclaimerText)`
  cursor: pointer;
`;

const Disclaimer = () => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderDisclaimer = () => (
    <>
      The boundaries and names shown and the designations used on this map do
      not imply the expression of any opinion whatsoever on the part of the
      World Health Organization concerning the legal status of any country,
      territory, city or area or of its authorities, or concerning the
      delimitation of its frontiers or boundaries. Dotted and dashed lines or
      grey areas on maps represent approximate border lines or areas for which
      there may not yet be full agreement. The borders of the map provided
      reflect the current political and geographic status as of the date of
      publication (2017). However, the technical health information is based on
      data accurate with respect to the year selected. The disconnect in this
      arrangement should be noted but no implications regarding political or
      terminological status should be drawn from this arrangement as it is
      purely a function of technical and graphical limitations. Data source:
      Global Malaria Programme. Map production: Global Malaria Programme. World
      Health Organization. WHO 2019. All rights reserved.
    </>
  );

  return (
    <>
      <Hidden smUp>
        <DisclaimerTextButton onClick={handleClickOpen}>
          Click here to read the disclaimer that applies to the above map
        </DisclaimerTextButton>
        <Dialog
          fullWidth
          open={open}
          onClose={handleClose}
          PaperProps={{
            className: classes.paper
          }}
        >
          <DialogActions>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogActions>
          <DialogContent>{renderDisclaimer()}</DialogContent>
          <DialogActions />
        </Dialog>
      </Hidden>
      <Hidden xsDown>
        <DisclaimerText>{renderDisclaimer()}</DisclaimerText>
      </Hidden>
    </>
  );
};

export default Disclaimer;
