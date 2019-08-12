import React from "react";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import FilterIcon from "@material-ui/icons/FilterList";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { State } from "../store/types";
import { selectTitle } from "../malaria/reducer";
import { setTitleAction } from "../malaria/actions";

const StyledPaper = styled(Paper)`
  padding: 20px;
  margin-bottom: 10px;
  overflow-y: auto;
`;

function Filters({ setTitle, title }: any) {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(prev => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Grow in={open}>
        <StyledPaper>
          <React.Fragment>
            <Button onClick={() => setTitle("Hello World")}>
              Change Title
            </Button>
            <Typography variant="h5" component="h3">
              {title}
            </Typography>
            <Typography component="p">
              Paper can be used to build surface or other elements for your
              application.
            </Typography>
            <Typography variant="h5" component="h3">
              This is a sheet of paper.
            </Typography>
            <Typography component="p">
              Paper can be used to build surface or other elements for your
              application.
            </Typography>
            <Typography variant="h5" component="h3">
              This is a sheet of paper.
            </Typography>
            <Typography component="p">
              Paper can be used to build surface or other elements for your
              application.
            </Typography>
            <Typography variant="h5" component="h3">
              This is a sheet of paper.
            </Typography>
            <Typography component="p">
              Paper can be used to build surface or other elements for your
              application.
            </Typography>
            <Typography variant="h5" component="h3">
              This is a sheet of paper.
            </Typography>
            <Typography component="p">
              Paper can be used to build surface or other elements for your
              application.
            </Typography>
            <Typography variant="h5" component="h3">
              This is a sheet of paper.
            </Typography>
            <Typography component="p">
              Paper can be used to build surface or other elements for your
              application.
            </Typography>
            <Typography variant="h5" component="h3">
              This is a sheet of paper.
            </Typography>
            <Typography component="p">
              Paper can be used to build surface or other elements for your
              application.
            </Typography>
            <Typography variant="h5" component="h3">
              This is a sheet of paper.
            </Typography>
            <Typography component="p">
              Paper can be used to build surface or other elements for your
              application.
            </Typography>
            <Typography variant="h5" component="h3">
              This is a sheet of paper.
            </Typography>
            <Typography component="p">
              Paper can be used to build surface or other elements for your
              application.
            </Typography>
            <Typography variant="h5" component="h3">
              This is a sheet of paper.
            </Typography>
            <Typography component="p">
              Paper can be used to build surface or other elements for your
              application.
            </Typography>
            <Typography variant="h5" component="h3">
              This is a sheet of paper.
            </Typography>
            <Typography component="p">
              Paper can be used to build surface or other elements for your
              application.
            </Typography>
          </React.Fragment>
        </StyledPaper>
      </Grow>
      <Fab color="default" aria-label="add" onClick={handleClick}>
        <FilterIcon />
      </Fab>
    </React.Fragment>
  );
}

const mapStateToProps = (state: State) => ({
  title: selectTitle(state)
});

const mapDispatchToProps = {
  setTitle: setTitleAction
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);
