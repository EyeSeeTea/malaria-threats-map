import React from "react";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import IconButton from "@material-ui/core/IconButton";
import LayersIcon from "@material-ui/icons/Layers";
import { makeStyles } from "@material-ui/core/styles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SendIcon from "@material-ui/icons/Send";
import { Checkbox, List, ListItem } from "@material-ui/core";
import { State } from "../store/types";
import { selectEndemicity, selectTitle } from "../malaria/reducer";
import {
  setTitleAction,
  toggleEndemicityLayerAction
} from "../malaria/actions";
import { connect } from "react-redux";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  paper: {
    marginRight: theme.spacing(2)
  }
}));

function Layers({ toogleEndemicityLayer, endemicityLayer }: any) {
  // @ts-ignore
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  function handleToggle() {
    // setOpen(prevOpen => !prevOpen);
    toogleEndemicityLayer(!endemicityLayer);
  }

  function handleClose(event: any) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  }

  return (
    <div className={classes.root}>
      <div>
        <IconButton
          aria-label="delete"
          ref={anchorRef}
          aria-controls="menu-list-grow"
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <LayersIcon />
        </IconButton>
        <Popper
          open={open}
          placement="right-start"
          anchorEl={anchorRef.current}
          keepMounted
          transition
          disablePortal
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper id="menu-list-grow">
                <ClickAwayListener onClickAway={handleClose}>
                  <List dense>
                    <ListItem onClick={handleClose}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={true}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      Profile
                    </ListItem>
                    <ListItem onClick={handleClose}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={true}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      My account
                    </ListItem>
                    <ListItem onClick={handleClose}>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={true}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      Logout
                    </ListItem>
                  </List>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}

const mapStateToProps = (state: State) => ({
  endemicityLayer: selectEndemicity(state)
});

const mapDispatchToProps = {
  toogleEndemicityLayer: toggleEndemicityLayerAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layers);
