import React from "react";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(0.5, 0)
    }
  })
);

function Screenshot({ map }: any) {
  const classes = useStyles({});

  const handleClick = () => {
    const image = map
      .getCanvas()
      .toDataURL("image/png", 1.0)
      .replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.download = `MTM - ${new Date().toUTCString()}`;
    link.href = image;
    link.click();
  };
  return (
    <div>
      <Fab
        size="small"
        color="default"
        onClick={handleClick}
        className={classes.fab}
      >
        <AddAPhotoIcon />
      </Fab>
    </div>
  );
}

export default Screenshot;
