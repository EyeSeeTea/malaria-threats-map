import React, { useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import { Button, createStyles, Fab, FormControl, makeStyles, TextField, Theme } from "@material-ui/core";
import UploadIcon from "@material-ui/icons/CloudUpload";
import DoneIcon from "@material-ui/icons/CloudDone";
import Typography from "@material-ui/core/Typography";
import { State } from "../store/types";
import { setUploadFileOpenAction } from "../store/actions/base-actions";
import { selectIsSubmittingSubscription, selectUploadFileOpen } from "../store/reducers/base-reducer";
import { connect } from "react-redux";
import { addSubscriptionContactRequestAction } from "../store/actions/data-download-actions";
import { useTranslation } from "react-i18next";
import { sendAnalytics } from "../utils/analytics";
import { addNotificationAction } from "../store/actions/notifier-actions";
import { isNotNull } from "../utils/number-utils";
import Dropzone, { DropzoneState } from "react-dropzone";

const mapStateToProps = (state: State) => ({
    uploadFileOpen: selectUploadFileOpen(state),
    isSubmitting: selectIsSubmittingSubscription(state),
});

const mapDispatchToProps = {
    setUploadFileOpen: setUploadFileOpenAction,
    saveContact: addSubscriptionContactRequestAction,
    addNotification: addNotificationAction,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const UploadFile: React.FC<Props> = ({ uploadFileOpen, setUploadFileOpen, isSubmitting, addNotification }) => {
    const { t } = useTranslation();
    const classes = useStyles({});
    const [name, setName] = React.useState<string>("");
    const [file, setFile] = React.useState<File>();
    const [valid, setValid] = React.useState<boolean>(false);

    useEffect(() => {
        setValid(isNotNull(name) && file !== undefined);
    }, [name, file]);

    const handleClose = () => {
        setUploadFileOpen(false);
    };

    const handleOpen = () => {
        sendAnalytics({ type: "event", category: "menu", action: "upload file" });
        setUploadFileOpen(true);
    };

    const handleUploadFile = async (files: File[]) => {
        const file = files[0];

        if (!file) {
            addNotification(t("common.uploadFile.fileError"));
            return;
        }

        setFile(file);
    };

    const submit = () => {
        // const data {
        //     name,
        //     file,
        // };
        // saveContact(contact);
        // sendAnalytics({ type: "event", category: "menu", action: "upload file", label: "submit" });
    };

    return (
        <React.Fragment>
            <Fab
                id="upload-button"
                size="small"
                color={"default"}
                className={classes.fab}
                onClick={handleOpen}
                title={t("common.icons.uploadFile")}
            >
                <UploadIcon />
            </Fab>
            <Dialog
                fullWidth
                maxWidth={"xs"}
                open={uploadFileOpen}
                onClose={handleClose}
                PaperProps={{
                    className: classes.paper,
                }}
            >
                <form id="ic_uploadfileForm">
                    <div>
                        <Typography variant={"h5"}>{t("common.uploadFile.title")}</Typography>
                    </div>
                    <div>
                        <FormControl fullWidth margin={"dense"}>
                            <TextField
                                fullWidth
                                label={t("common.uploadFile.name")}
                                type={t("common.uploadFile.name")}
                                placeholder={t("common.uploadFile.name")}
                                name="name"
                                required
                                value={name}
                                onChange={event => setName(event.target.value as string)}
                            />
                        </FormControl>
                        <FormControl fullWidth margin={"dense"}>
                            <Dropzone
                                accept={[
                                    "application/vnd.ms-excel",
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                ]}
                                onDrop={handleUploadFile}
                                multiple={false}
                            >
                                {({ getRootProps, getInputProps }: DropzoneState) => (
                                    <section>
                                        <div
                                            {...getRootProps({
                                                className: classes.dropzone,
                                            })}
                                        >
                                            <input {...getInputProps()} />
                                            <div className={classes.dropzoneTextStyle} hidden={file !== undefined}>
                                                <p className={classes.dropzoneParagraph}>
                                                    {t("common.uploadFile.dragAndDrop")}
                                                </p>
                                                <br />
                                                <UploadIcon className={classes.uploadIcon} />
                                            </div>
                                            <div className={classes.dropzoneTextStyle} hidden={file === undefined}>
                                                {file !== undefined && (
                                                    <p className={classes.dropzoneParagraph}>{file.name}</p>
                                                )}
                                                <br />
                                                <DoneIcon className={classes.uploadIcon} />
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>
                        </FormControl>
                        <FormControl fullWidth margin={"normal"}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                disabled={isSubmitting || !valid}
                                onClick={() => submit()}
                            >
                                {t("common.uploadFile.button")}
                            </Button>
                        </FormControl>
                    </div>
                </form>
            </Dialog>
        </React.Fragment>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(1),
            "& > *": {
                margin: theme.spacing(1),
                width: "25ch",
            },
        },
        fab: {
            pointerEvents: "all",
            margin: theme.spacing(0.5, 0.5),
        },
        paper: {
            margin: theme.spacing(1),
            padding: theme.spacing(3),
            width: "100%",
        },
        uploadIcon: { width: 50, height: 50, color: "#909090" },
        dropzoneTextStyle: { textAlign: "center", top: "15%", position: "relative" },
        dropzoneParagraph: { fontSize: 20 },
        dropzone: {
            position: "relative",
            width: "100%",
            height: 270,
            backgroundColor: "#f0f0f0",
            border: "dashed",
            borderColor: "#c8c8c8",
            cursor: "pointer",
        },
    })
);
