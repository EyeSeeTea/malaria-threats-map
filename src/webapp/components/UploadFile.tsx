import React, { useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import {
    Button,
    TextField,
    InputLabel,
    MenuItem,
    Select,
    Fab,
    FormControl,
    Theme,
    Tab,
    Tabs,
    Box,
    SelectChangeEvent,
} from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import UploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/CloudDownload";
import DoneIcon from "@mui/icons-material/CloudDone";
import Typography from "@mui/material/Typography";
import { State } from "../store/types";
import { setUploadFileOpenAction, uploadFileRequestAction } from "../store/actions/base-actions";
import { selectIsUploadingFile, selectUploadFileOpen } from "../store/reducers/base-reducer";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { sendAnalytics } from "../utils/analytics";
import { addNotificationAction } from "../store/actions/notifier-actions";
import { isNotNull } from "../utils/number-utils";
import Dropzone, { DropzoneState } from "react-dropzone";
import { FullCountry } from "./DataDownload/filters/FullCountriesSelector";
import { ORGANIZATION_TYPES } from "./DataDownload/UserForm";

const mapStateToProps = (state: State) => ({
    uploadFileOpen: selectUploadFileOpen(state),
    isUploadingFile: selectIsUploadingFile(state),
});

const mapDispatchToProps = {
    setUploadFileOpen: setUploadFileOpenAction,
    uploadFile: uploadFileRequestAction,
    addNotification: addNotificationAction,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Typography
                    component="div"
                    role="tabpanel"
                    hidden={value !== index}
                    id={`scrollable-auto-tabpanel-${index}`}
                    aria-labelledby={`scrollable-auto-tab-${index}`}
                    {...other}
                >
                    <Box p={3}>{children}</Box>
                </Typography>
            )}
        </div>
    );
};

const UploadFile: React.FC<Props> = ({
    uploadFileOpen,
    setUploadFileOpen,
    uploadFile,
    isUploadingFile,
    addNotification,
}) => {
    const { t } = useTranslation();
    const classes = useStyles({});
    const [name, setName] = React.useState<string>("");
    const [comment, setComment] = React.useState<string>("");
    const [file, setFile] = React.useState<File>();
    const [valid, setValid] = React.useState<boolean>(false);

    const [country, setCountry] = React.useState<string>("");
    const [newOrganizationType, setNewOrganizationType] = React.useState<string>("");
    const [templateType, setTemplateType] = React.useState<string>("");

    const [value, setValue] = React.useState<any>(0);

    const organizationTypes = ORGANIZATION_TYPES.map(ot => t(ot)).sort();
    const countries: FullCountry = t("countries", { returnObjects: true });

    const TEMPLATE_TYPES: { [key: string]: string } = {
        "common.downloadFile.template1":
            "https://cdn.who.int/media/docs/default-source/malaria/vector-control/who-standard-form-for-reporting-synergist-insecticide-bioassay-results.xlsx?sfvrsn=30ed3b0d_2",
        "common.downloadFile.template2":
            "https://cdn.who.int/media/docs/default-source/malaria/vector-control/who-standard-form-for-reporting-intensity-concentration-bioassay-results.xlsx?sfvrsn=b82e9f35_2",
        "common.downloadFile.template3":
            "https://cdn.who.int/media/docs/default-source/malaria/vector-control/who-standard-form-for-reporting-discriminating-concentration-bioassay-results.xlsx?sfvrsn=7273f2bb_2",
        "common.downloadFile.template4":
            "https://cdn.who.int/media/docs/default-source/malaria/vector-control/who-standard-form-for-reporting-molecular-and-biochemical-bioassay-results.xlsx?sfvrsn=b302dd0_4",
        "common.downloadFile.template5":
            "https://web-prod.who.int/docs/default-source/documents/publications/gmp/who-test-kit-catalogue-and-requisition-form-may2013.pdf",
    };

    const handleOrganizationTypeChange = (event: SelectChangeEvent) => {
        const newOrganizationType = event.target.value as string;
        setNewOrganizationType(newOrganizationType);
    };

    const handleCountryChange = (event: SelectChangeEvent) => {
        const newCountry = event.target.value as string;
        setCountry(newCountry);
    };

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: any) => {
        setValue(newValue);
    };

    useEffect(() => {
        setValid(
            isNotNull(name) &&
                isNotNull(comment) &&
                isNotNull(country) &&
                isNotNull(newOrganizationType) &&
                file !== undefined
        );
    }, [name, file, comment, country, newOrganizationType]);

    useEffect(() => {
        setName("");
        setComment("");
        setCountry("");
        setNewOrganizationType("");
        setTemplateType("");
        setFile(undefined);
    }, [uploadFileOpen]);

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
        uploadFile({ title: name, comment, country, organizationType: newOrganizationType, file });
        sendAnalytics({ type: "event", category: "menu", action: "upload file", label: "submit" });
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
                maxWidth={"sm"}
                open={uploadFileOpen}
                onClose={handleClose}
                PaperProps={{
                    className: classes.paper,
                }}
            >
                <Tabs value={value} onChange={handleTabChange} variant="fullWidth">
                    <Tab value={0} icon={<UploadIcon />} />
                    <Tab value={1} icon={<DownloadIcon />} />
                </Tabs>

                <TabPanel value={value} index={0}>
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
                                <TextField
                                    fullWidth
                                    label={t("common.uploadFile.comment")}
                                    type={t("common.uploadFile.comment")}
                                    placeholder={t("common.uploadFile.comment")}
                                    name="comment"
                                    required
                                    value={comment}
                                    onChange={event => setComment(event.target.value as string)}
                                />
                            </FormControl>
                            {countries && (
                                <FormControl fullWidth className={classes.formControl}>
                                    <InputLabel>{t("common.data_download.step1.country") + "*"}</InputLabel>
                                    <Select fullWidth value={country} onChange={handleCountryChange}>
                                        {Object.entries(countries).map(([iso, name]) => (
                                            <MenuItem key={iso} value={iso}>
                                                {name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                            <FormControl fullWidth className={classes.formControl}>
                                <InputLabel>{t("common.data_download.step1.organization_type") + "*"}</InputLabel>
                                <Select fullWidth value={newOrganizationType} onChange={handleOrganizationTypeChange}>
                                    {organizationTypes.map(type => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
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
                                    disabled={isUploadingFile || !valid}
                                    onClick={() => submit()}
                                >
                                    {t("common.uploadFile.button")}
                                </Button>
                            </FormControl>
                        </div>
                    </form>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <form id="ic_downloadTemplateForm">
                        <div>
                            <Typography variant={"h5"}>{t("common.downloadFile.title")}</Typography>
                        </div>
                        <div>
                            <FormControl fullWidth className={classes.formControl}>
                                <InputLabel>{t("common.downloadFile.template") + "*"}</InputLabel>
                                <Select
                                    fullWidth
                                    value={templateType}
                                    onChange={event => setTemplateType(event.target.value as string)}
                                >
                                    {Object.keys(TEMPLATE_TYPES).map(type => (
                                        <MenuItem key={type} value={type}>
                                            {t(`${type}`)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin={"normal"}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    disabled={
                                        country.length === 0 &&
                                        newOrganizationType.length === 0 &&
                                        templateType.length === 0
                                    }
                                    onClick={() => window.open(TEMPLATE_TYPES[templateType], "_blank")}
                                >
                                    {t("common.downloadFile.button")}
                                </Button>
                            </FormControl>
                        </div>
                    </form>
                </TabPanel>
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
        formControl: {
            margin: theme.spacing(1, 0),
        },
    })
);
