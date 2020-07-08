import React from "react";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import whoLogoWhite from "../assets/img/who-logo-blue.png";
import prevention from "../assets/img/prevention.svg";
import diagnosis from "../assets/img/diagnosis.svg";
import treatment from "../assets/img/treatment.svg";
import invasive from "../assets/img/invasive.svg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useTranslation } from "react-i18next";
import { State } from "../store/types";
import { selectMapTitle, selectTheme } from "../store/reducers/base-reducer";
import { selectDiagnosisFilters } from "../store/reducers/diagnosis-reducer";
import { connect } from "react-redux";
import { selectPreventionFilters } from "../store/reducers/prevention-reducer";
// @ts-ignore
import * as PdfJs from "pdfjs-dist";
import { convertDataURIToBinary, download } from "../utils/download-utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      pointerEvents: "all",
      margin: theme.spacing(0.5, 0),
    },
  })
);

const mapStateToProps = (state: State) => ({
  theme: selectTheme(state),
  title: selectMapTitle(state),
  preventionMapType: selectPreventionFilters(state),
  diagnosisFilters: selectDiagnosisFilters(state),
});
const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
  map: mapboxgl.Map;
};
type Props = DispatchProps & StateProps & OwnProps;

function Screenshot({ map, theme, title }: Props) {
  const { t } = useTranslation("common");
  const classes = useStyles({});

  const handleClick = () => {
    const mapCanvas = map.getCanvas();

    const copyright = t("copyright.content");

    const imageObj1 = new Image();
    imageObj1.src = whoLogoWhite;
    const a4h = 297;
    const a4p = 10;

    const icon = (() => {
      switch (theme) {
        case "prevention":
          return prevention;
        case "diagnosis":
          return diagnosis;
        case "treatment":
          return treatment;
        default:
          return invasive;
      }
    })();

    html2canvas(document.querySelector("#legend")).then((legend) => {
      const doc = new jsPDF({
        orientation: "l",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
        floatPrecision: 16,
      });

      const ratio = mapCanvas.width / mapCanvas.height;

      doc.setFontSize(24);
      const textWidth2 =
        (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const titleOffset = (doc.internal.pageSize.width - textWidth2 - 25) / 2;
      doc.text(title, titleOffset + 25, 20);
      const img2 = new Image();
      img2.src = icon;
      doc.addImage(img2, "JPEG", titleOffset, 10, 15, 15);

      doc.setFontSize(7);
      doc.setFontType("normal");
      let lines = doc.splitTextToSize(copyright, 150);
      doc.text(10, 180, lines);
      const maxWidth = a4h - 2 * a4p;
      const maxHeight = 135;
      let mapWidth, mapHeight;
      let horizontalOffset = 0;

      if (maxHeight * ratio > maxWidth) {
        mapWidth = maxWidth;
        mapHeight = mapWidth / ratio;
      } else {
        mapWidth = maxHeight * ratio;
        mapHeight = maxHeight;
      }

      const verticalPadding = (maxHeight - mapHeight) / 2;
      if (verticalPadding === 0) {
        horizontalOffset = (maxWidth - mapWidth) / 2;
      }

      doc.addImage(
        mapCanvas.toDataURL("JPEG"),
        "JPEG",
        10 + horizontalOffset,
        30 + verticalPadding,
        mapWidth,
        mapHeight
      );
      const baseCanvasImage = legend.toDataURL("image/octet-stream", 1.0);
      const legendRatio = legend.height / legend.width;

      const legendWidth = 40;
      const legendHeight = legendWidth * legendRatio;

      const legendX = maxWidth - horizontalOffset - legendWidth + 5;
      const legendY = mapHeight + 30 + verticalPadding - legendHeight - 5;

      doc.addImage(
        baseCanvasImage,
        "JPEG",
        legendX,
        legendY,
        legendWidth,
        legendHeight
      );

      doc.setFontSize(10);
      doc.text("Data source: Malaria Threats Map", a4h - 130, 180);
      doc.text("Map Production: Global Malaria Program", a4h - 130, 185);
      doc.text("World Health Organization", a4h - 130, 190);

      const img = new Image();
      img.src = whoLogoWhite;
      doc.addImage(img, "JPEG", a4h - 60, 175, 45, 13);
      doc.setFontSize(9);
      doc.text("@WHO 2019. All rights reserved", a4h - 60, 195);

      // Save the Data
      const file = doc.output("dataurlstring");

      // If we wanted to save as PDF
      //doc.save("Report.pdf");

      const pdfAsArray = convertDataURIToBinary(file);

      PdfJs.disableWorker = true;
      PdfJs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.3.200/pdf.worker.js`;
      PdfJs.getDocument(pdfAsArray).then((pdf: any) => {
        pdf.getPage(1).then((page: any) => {
          const viewport = page.getViewport(2.5);
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const renderContext = { canvasContext: context, viewport: viewport };
          page.render(renderContext).then(() => {
            download(canvas, "report.png");
          });
        });
      });
      return;
    });
  };
  return (
    <div>
      <Fab
        size="small"
        color="default"
        onClick={handleClick}
        className={classes.fab}
        title={t("icons.image")}
      >
        <AddAPhotoIcon />
      </Fab>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Screenshot);
