import React, { useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Paper, IconButton, Slider } from "@mui/material";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CloseIcon from "@mui/icons-material/Close";
import { setFiltersAction, setTheaterModeAction } from "../../store/actions/base-actions";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectMaxMinYears, selectTheme } from "../../store/reducers/base-reducer";
import { sendAnalytics } from "../../utils/analytics";

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

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    maxMinYears: selectMaxMinYears(state),
});

const mapDispatchToProps = {
    setYears: setFiltersAction,
    setTheaterMode: setTheaterModeAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

function TheaterMode({ setYears, setTheaterMode, maxMinYears }: Props) {
    const classes = useStyles({});

    const [year, setYear] = React.useState<number>(maxMinYears[0]);
    const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setYear(year => {
                    const newYear = year + 1;
                    if (newYear > maxMinYears[1]) {
                        setYears([maxMinYears[0], maxMinYears[0]]);
                        return maxMinYears[0];
                    } else {
                        setYears([maxMinYears[0], newYear]);
                        return newYear;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, setYears, maxMinYears]);

    const play = () => {
        sendAnalytics({ type: "event", category: "timeline", action: "play" });
        setIsPlaying(true);
    };

    const pause = () => {
        sendAnalytics({ type: "event", category: "timeline", action: "pause" });
        setIsPlaying(false);
    };

    const beginning = () => {
        sendAnalytics({ type: "event", category: "timeline", action: "restart" });
        setYear(() => maxMinYears[0]);
        setYears([maxMinYears[0], maxMinYears[0]]);
    };

    function valuetext(value: number) {
        return `${value}`;
    }

    const handleChange = (event: Event, newValue: number | number[]) => {
        const value = newValue as number;
        sendAnalytics({ type: "event", category: "timeline", action: "drag", label: year.toString() });
        setYear(() => value);
        setYears([maxMinYears[0], value]);
    };

    return (
        <Paper className={classes.root}>
            <IconButton className={classes.iconButton} size={"small"} onClick={beginning}>
                <SkipPreviousIcon />
            </IconButton>
            {isPlaying ? (
                <IconButton className={classes.iconButton} size={"small"} onClick={pause}>
                    <PauseIcon />
                </IconButton>
            ) : (
                <IconButton className={classes.iconButton} size={"small"} onClick={play}>
                    <PlayArrowIcon />
                </IconButton>
            )}

            <Slider
                size="small"
                className={classes.slider}
                value={year}
                valueLabelDisplay="on"
                getAriaValueText={valuetext}
                onChange={handleChange}
                step={1}
                min={maxMinYears[0]}
                max={maxMinYears[1]}
            />
            <IconButton
                className={classes.iconButton}
                size={"small"}
                onClick={() => {
                    setTheaterMode(false);
                }}
                title={"Exit theater mode"}
            >
                <CloseIcon />
            </IconButton>
        </Paper>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(TheaterMode);
