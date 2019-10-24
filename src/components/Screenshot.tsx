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

function dataURLtoBlob(dataurl: string) {
  let arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

function Screenshot({ map }: any) {
  const classes = useStyles({});

  const handleClick = () => {
    // html2canvas(document.querySelector("#capture")).then(canvas => {
    //   const image = canvas
    //     .toDataURL("image/png", 1.0)
    //     .replace("image/png", "image/octet-stream");
    //   const link = document.createElement("a");
    //   const objurl = URL.createObjectURL(dataURLtoBlob(image));
    //   link.download = `MTM - ${new Date().toUTCString()}.png`;
    //   link.href = objurl;
    //   link.click();
    // });
    const image = map
      .getCanvas()
      .toDataURL("image/png", 1.0)
      .replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    const objurl = URL.createObjectURL(dataURLtoBlob(image));
    link.download = `MTM - ${new Date().toUTCString()}.png`;
    link.href = objurl;
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
