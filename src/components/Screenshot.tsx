import React from "react";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import {createStyles, Fab, makeStyles, Theme} from "@material-ui/core";
import whoLogoWhite from "../assets/img/who-logo-white.svg";
import invasive from "../assets/img/invasive.svg";
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

const loadImage: (url: string) => Promise<HTMLImageElement> = (url: string) =>
  new Promise((resolve, reject) => {
    const imageObj1 = new Image();
    imageObj1.src = url;
    imageObj1.onload = function() {
      resolve(imageObj1);
    };
    imageObj1.onabort = function() {
      reject();
    };
  });

function Screenshot({ map }: any) {
  const classes = useStyles({});

  const handleClick = () => {
    // var c=document.getElementById("myCanvas");
    // var ctx=c.getContext("2d");
    const mapCanvas = map.getCanvas();
    const color = "#5abe86";
    const padding = 20;
    const titleHeight = 60;
    const footerHeight = 80;
    const headerPadding = titleHeight + padding;
    const footerPadding = footerHeight + padding;
    const canvasWidth = mapCanvas.width + 2 * padding;
    const canvasHeight = mapCanvas.height + headerPadding + footerPadding;
    const logoWidth = 150;
    const logoHeight = 50;

    const imageObj1 = new Image();
    imageObj1.src = whoLogoWhite;
    Promise.all([loadImage(whoLogoWhite), loadImage(invasive)]).then(
      ([logo, icon]) => {
        html2canvas(document.querySelector("#legend")).then(legend => {
          const destCanvas = document.createElement("canvas");
          const destCtx = destCanvas.getContext("2d");
          destCanvas.width = canvasWidth;
          destCanvas.height = canvasHeight;
          destCtx.fillStyle = color;
          destCtx.fillRect(0, 0, canvasWidth, canvasHeight);

          //call its drawImage() function passing it the source canvas directly
          // const baseCanvasImage = canvas.toDataURL("image/octet-stream", 1.0);
          destCtx.drawImage(mapCanvas, padding, titleHeight + padding);
          const legendPositionX = canvasWidth - legend.width - 2 * padding;
          const legendPositionY =
            canvasHeight - legend.height - footerHeight - 2 * padding;
          destCtx.drawImage(legend, legendPositionX, legendPositionY);
          destCtx.fillStyle = "#FFFFFF";
          destCtx.drawImage(
            logo,
            canvasWidth - logoWidth - padding,
            canvasHeight - footerPadding + padding / 2,
            logoWidth,
            logoHeight
          );
          destCtx.fillStyle = "#000000";
          destCtx.drawImage(icon, padding, padding, logoHeight, logoHeight);
          destCtx.fillStyle = "#FFFFFF";
          destCtx.font = "30px Arial";
          destCtx.fillText(
            "Intensity of An.gambiae s.l. resistance to Deltamethrin",
            2 * padding + logoHeight,
            2.5 * padding
          );
          destCtx.font = "14px Arial";
          const textWidth = destCtx.measureText(
            "@WHO 2019. All rights reserve"
          );
          destCtx.fillText(
            "@WHO 2019. All rights reserve",
            canvasWidth - textWidth.width - padding,
            canvasHeight - padding
          );
          const image = destCanvas.toDataURL("image/octet-stream", 1.0);
          const link = document.createElement("a");
          const objurl = URL.createObjectURL(dataURLtoBlob(image));
          link.download = `MTM - ${new Date().toUTCString()}.png`;
          link.href = objurl;
          link.click();
        });
      }
    );
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
