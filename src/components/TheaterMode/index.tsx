import React, { useEffect } from "react";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import CloseIcon from "@material-ui/icons/Close";
import Slider from "@material-ui/core/Slider";
import {
  setFiltersAction,
  setTheaterModeAction
} from "../../store/actions/base-actions";
import { connect } from "react-redux";

const useStyles = makeStyles({
  root: {
    padding: "2px 4px",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center"
  },
  iconButton: {
    padding: "10px"
  },
  input: {
    flex: 1
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  },
  slider: {
    marginLeft: "10px",
    marginRight: "10px"
  }
});

const MIN_YEAR = 1998;
const THIS_YEAR = new Date().getFullYear();

const mapDispatchToProps = {
  setYears: setFiltersAction,
  setTheaterMode: setTheaterModeAction
};

type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps;

function TheaterMode({ setYears, setTheaterMode }: Props) {
  const classes = useStyles({});

  const [year, setYear] = React.useState<number>(MIN_YEAR);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = setInterval(() => {
        setYear(year => {
          const newYear = year + 1;
          if (newYear > THIS_YEAR) {
            setYears([MIN_YEAR, MIN_YEAR]);
            return MIN_YEAR;
          } else {
            setYears([MIN_YEAR, newYear]);
            return newYear;
          }
        });
      }, 750);
    }
    return () => clearInterval(interval);
  }, [isPlaying, setYears]);

  const play = () => {
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const beginning = () => {
    setYear(() => MIN_YEAR);
    setYears([MIN_YEAR, MIN_YEAR]);
  };

  function valuetext(value: number) {
    return `${value}`;
  }

  const handleChange = (event: any, newValue: number | number[]) => {
    const value = newValue as number;
    setYear(() => value);
    setYears([MIN_YEAR, value]);
  };

  return (
    <Paper className={classes.root}>
      <IconButton
        className={classes.iconButton}
        size={"small"}
        onClick={beginning}
      >
        <SkipPreviousIcon />
      </IconButton>
      {isPlaying ? (
        <IconButton
          className={classes.iconButton}
          size={"small"}
          onClick={pause}
        >
          <PauseIcon />
        </IconButton>
      ) : (
        <IconButton
          className={classes.iconButton}
          size={"small"}
          onClick={play}
        >
          <PlayArrowIcon />
        </IconButton>
      )}

      <Slider
        className={classes.slider}
        value={year}
        valueLabelDisplay="on"
        getAriaValueText={valuetext}
        onChange={handleChange}
        step={1}
        min={1998}
        max={THIS_YEAR}
      />
      <IconButton
        className={classes.iconButton}
        size={"small"}
        onClick={() => setTheaterMode(false)}
        title={"Exit theater mode"}
      >
        <CloseIcon />
      </IconButton>
    </Paper>
  );
}

export default connect(null, mapDispatchToProps)(TheaterMode);
