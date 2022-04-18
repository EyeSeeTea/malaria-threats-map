import React from "react";
import mapboxgl from "mapbox-gl";
import styled from "styled-components";
import { Modal, Box, Button, CircularProgress, Typography } from "@mui/material";
import whoLogoWhite from "../assets/img/who-logo-blue.png";
import prevention from "../assets/img/prevention.png";
import diagnosis from "../assets/img/diagnosis.png";
import treatment from "../assets/img/treatment.png";
import invasive from "../assets/img/invasive.jpg";
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
import { format } from "date-fns";
import { sendAnalytics } from "../utils/analytics";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DownloadIcon from "@mui/icons-material/Download";
import SimpleLoader from "./SimpleLoader";
import { useWindowDimensions } from "./hooks/use-window-dimensions";

const ScreenshotButton = styled(Button)`
    &.MuiButton-root {
        margin-right: 10px;
        background-color: #2FB3AF;
    }
`;

const CircularProgressWithLabel = () => {
    const { t } = useTranslation();
    const styles = {
        progress: {
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
        },
    };
    return (
        <div style={styles.progress}>
            <CircularProgress />
            <Typography>{t("common.screenshot.generating_screenshot")}</Typography>
        </div>
    );
};

const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    title: selectMapTitle(state),
    preventionMapType: selectPreventionFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = {
    map: mapboxgl.Map;
};
type Props = StateProps & OwnProps;

function Screenshot({ map, theme, title }: Props) {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const [downloading, setDownloading] = React.useState(false);
    const [generatingScreenshot, setGeneratingScreenshot] = React.useState(false);
    const [file, setFile] = React.useState<string>("");
    const { width, height } = useWindowDimensions();
    PdfJs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.7.570/pdf.worker.js`;

    const handleClick = () => {
        setGeneratingScreenshot(true);
        setOpen(true);
        sendAnalytics({ type: "event", category: "menu", action: "capture" });

        const mapCanvas = map.getCanvas();

        const copyright = t("common.copyright.content", { year: new Date().getFullYear() });

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

        html2canvas(document.querySelector("#legend")).then(legend => {
            const doc = new jsPDF({
                orientation: "l",
                unit: "mm",
                format: "a4",
                putOnlyUsedFonts: true,
                floatPrecision: 16,
            });

            const ratio = mapCanvas.width / mapCanvas.height;

            doc.setFontSize(24);
            const textWidth2 = (doc.getStringUnitWidth(title) * doc.getFontSize()) / doc.internal.scaleFactor;
            const titleOffset = (doc.internal.pageSize.width - textWidth2 - 25) / 2;
            doc.text(title, titleOffset + 25, 20);
            const img2 = new Image();
            img2.src = icon;
            doc.addImage(img2, "JPEG", titleOffset, 10, 15, 15);

            doc.setFontSize(7);
            doc.setFont("normal");
            const lines = doc.splitTextToSize(copyright, 150);
            doc.text(lines, 10, 175);
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

            doc.addImage(baseCanvasImage, "JPEG", legendX, legendY, legendWidth, legendHeight);

            doc.setFontSize(10);
            doc.text("Data source: Malaria Threats Map", a4h - 130, 180);
            doc.text("Map Production: Global Malaria Programme", a4h - 130, 185);
            doc.text("World Health Organization", a4h - 130, 190);

            const img = new Image();
            img.src = whoLogoWhite;
            doc.addImage(img, "JPEG", a4h - 60, 175, 45, 13);
            doc.setFontSize(9);
            doc.text(`@WHO ${new Date().getFullYear()}. All rights reserved`, a4h - 60, 195);
            // Save the Data
            const file = doc.output("dataurlstring");
            setFile(file);

            // If we wanted to save as PDF
            //doc.save("Report.pdf");
            const pdfAsArray = convertDataURIToBinary(file);
            setGeneratingScreenshot(false);
            //PdfJs.disableWorker = true;
            PdfJs.getDocument(pdfAsArray).promise.then((pdf: any) => {
                pdf.getPage(1).then((page: any) => {
                    const canvas = document.getElementById("pdf") as HTMLCanvasElement;
                    const context = canvas.getContext("2d");
                    canvas.width = width * 0.85;
                    canvas.height = height * 0.8;
                    const viewport = page.getViewport({ scale: canvas.width / page.getViewport({ scale: 1 }).width });
                    const renderContext = { canvasContext: context, viewport: viewport };
                    page.render(renderContext);
                });
            });
            return;
        });
    };

    const downloadScreenshot = () => {
        setDownloading(true);
        const pdfAsArray = convertDataURIToBinary(file);

        PdfJs.getDocument(pdfAsArray).promise.then((pdf: any) => {
            pdf.getPage(1).then((page: any) => {
                const viewport = page.getViewport({ scale: 2.5 });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const renderContext = { canvasContext: context, viewport: viewport };
                page.render(renderContext).promise.then(() => {
                    const dateString = format(new Date(), "yyyyMMdd");
                    const fileName = `MTM_${title.toUpperCase()}_${dateString}`;
                    download(canvas, fileName);
                    setDownloading(false);
                });
            });
        });
        return;
    };

    const styles = {
        box: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: width * 0.9,
            height: height * 0.9,
            bgcolor: "white",
            p: 4,
            padding: 0,
            borderRadius: 5,
        },
        canvas: {
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "2px solid grey",
            borderRadius: 5,
        },
        progress: {
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
        },
        icon: { marginRight: 5 },
        downloadScreenshot: { marginTop: 10, float: "right" as const },
    };

    return (
        <>
            <ScreenshotButton variant="contained" onClick={handleClick}>
                <CameraAltIcon style={styles.icon} />
                {t("common.screenshot.screenshot")}
            </ScreenshotButton>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styles.box}>
                    {downloading && <SimpleLoader message={t("common.data_download.loader.generating_file")} />}
                    <ScreenshotButton
                        variant="contained"
                        onClick={downloadScreenshot}
                        style={styles.downloadScreenshot}
                    >
                        <DownloadIcon style={styles.icon} />
                        {t("common.screenshot.download_screenshot")}
                    </ScreenshotButton>
                    {generatingScreenshot ? (
                        <CircularProgressWithLabel />
                    ) : (
                        <canvas id="pdf" style={styles.canvas}></canvas>
                    )}
                </Box>
            </Modal>
        </>
    );
}

export default connect(mapStateToProps)(Screenshot);
