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
  setTheaterModeAction,
} from "../../store/actions/base-actions";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectTheme } from "../../store/reducers/base-reducer";

const useStyles = makeStyles({
  root: {
    padding: "2px 4px",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
  },
  iconButton: {
    padding: "10px",
  },
  input: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
  slider: {
    marginLeft: "10px",
    marginRight: "10px",
  },
});

const THIS_YEAR = new Date().getFullYear();

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
});

const mapDispatchToProps = {
  setYears: setFiltersAction,
  setTheaterMode: setTheaterModeAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const getMinYear = (theme: string) => {
  switch (theme) {
    case "diagnosis":
      return 1998;
    case "invasive":
      return 1985;
    default:
      return 2010;
  }
};

function TheaterMode({ setYears, setTheaterMode, theme }: Props) {
  const classes = useStyles({});
  const minYear = getMinYear(theme);

  const [year, setYear] = React.useState<number>(minYear);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = setInterval(() => {
        setYear((year) => {
          const newYear = year + 1;
          if (newYear > THIS_YEAR) {
            setYears([minYear, minYear]);
            return minYear;
          } else {
            setYears([minYear, newYear]);
            return newYear;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, setYears, minYear]);

  const play = () => {
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const beginning = () => {
    setYear(() => minYear);
    setYears([minYear, minYear]);
  };

  function valuetext(value: number) {
    return `${value}`;
  }

  const handleChange = (event: any, newValue: number | number[]) => {
    const value = newValue as number;
    setYear(() => value);
    setYears([minYear, value]);
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
        min={minYear}
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

export default connect(mapStateToProps, mapDispatchToProps)(TheaterMode);
