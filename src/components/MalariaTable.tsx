import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import FilterIcon from "@material-ui/icons/FilterList";
import Table, { Data } from "./Table";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            backgroundColor: "#404041",
            position: "relative",
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
    })
);

function createData(name: string, calories: number, fat: number, carbs: number, protein: number): Data {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Donut", 452, 25.0, 51, 4.9),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
    createData("Honeycomb", 408, 3.2, 87, 6.5),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Jelly Bean", 375, 0.0, 94, 0.0),
    createData("KitKat", 518, 26.0, 65, 7.0),
    createData("Lollipop", 392, 0.2, 98, 0.0),
    createData("Marshmallow", 318, 0, 81, 2.0),
    createData("Nougat", 360, 19.0, 9, 37.0),
    createData("Oreo", 437, 18.0, 63, 4.0),
];

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props: any, ref: any) {
    return <Slide direction="right" ref={ref} {...props} />;
});

export default function MalariaTable() {
    const classes = useStyles({});
    const [open, setOpen] = React.useState(false);

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    return (
        <React.Fragment>
            <IconButton onClick={handleClickOpen}>
                <FilterIcon />
            </IconButton>
            <Dialog
                open={open}
                maxWidth={"lg"}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        width: "100%",
                    },
                }}
            >
                <Table rows={rows} />
            </Dialog>
        </React.Fragment>
    );
}
