import React from "react";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import whoLogoBlueIcon from "../assets/img/who-logo-blue.svg";
import html2canvas from "html2canvas";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      pointerEvents: "all",
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
    // var c=document.getElementById("myCanvas");
    // var ctx=c.getContext("2d");
    const imageObj1 = new Image();
    imageObj1.src = whoLogoBlueIcon;
    imageObj1.onload = function() {
      html2canvas(document.querySelector("#legend")).then(legend => {
        const canvas = map.getCanvas();
        const width = canvas.width;
        const height = canvas.height;
        const destCanvas = document.createElement("canvas");
        const destCtx = destCanvas.getContext("2d");
        destCanvas.width = width;
        destCanvas.height = height;

        //call its drawImage() function passing it the source canvas directly
        const baseCanvasImage = canvas.toDataURL("image/octet-stream", 1.0);
        destCtx.drawImage(canvas, 0, 0);
        destCtx.drawImage(legend, width / 2, height / 2);
        destCtx.drawImage(imageObj1, 20, height - 70, 150, 50);
        destCtx.font = "30px Arial";
        destCtx.fillText("Hello World", 10, 50);
        const image = destCanvas.toDataURL("image/octet-stream", 1.0);
        const link = document.createElement("a");
        const objurl = URL.createObjectURL(dataURLtoBlob(image));
        link.download = `MTM - ${new Date().toUTCString()}.png`;
        link.href = objurl;
        link.click();
      });
    };
    // imageObj1.onload = function() {
    //     ctx.drawImage(imageObj1, 0, 0, 328, 526);
    //     imageObj2.src = "2.png";
    //     imageObj2.onload = function() {
    //         ctx.drawImage(imageObj2, 15, 85, 300, 300);
    //         var img = c.toDataURL("image/png");
    //         document.write('<img src="' + img + '" width="328" height="526"/>');
    //     }
    // };
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
