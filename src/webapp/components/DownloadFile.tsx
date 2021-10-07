import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { Button, InputLabel, MenuItem, Select, createStyles, Fab, FormControl, makeStyles, Theme } from "@material-ui/core";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import Typography from "@material-ui/core/Typography";
import { State } from "../store/types";
import { setDownloadFileOpenAction } from "../store/actions/base-actions";
import { selectDownloadFileOpen } from "../store/reducers/base-reducer";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { sendAnalytics } from "../utils/analytics";
import { FullCountry } from "./DataDownload/filters/FullCountriesSelector";
import { ORGANIZATION_TYPES } from "./DataDownload/UserForm";

const mapStateToProps = (state: State) => ({
    downloadFileOpen: selectDownloadFileOpen(state),
});

const mapDispatchToProps = {
    setDownloadFileOpen: setDownloadFileOpenAction,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const DownloadFile: React.FC<Props> = ({
    downloadFileOpen,
    setDownloadFileOpen,
}) => {
    const { t } = useTranslation();
    const classes = useStyles({});

    const [country, setCountry] = React.useState<string>("");
    const [newOrganizationType, setNewOrganizationType] = React.useState<string>("");
    const [templateType, setTemplateType] = React.useState<string>("");

    const organizationTypes = ORGANIZATION_TYPES.map(ot => t(ot)).sort();
    const countries: FullCountry = t("countries", { returnObjects: true });

    const TEMPLATE_TYPES: { [key: string]: string; } = {
        "Synergist insecticide-bioassay results": "https://cdn.who.int/media/docs/default-source/malaria/vector-control/who-standard-form-for-reporting-synergist-insecticide-bioassay-results.xlsx?sfvrsn=30ed3b0d_2",
         "Intensity concentration bioassay results": "https://cdn.who.int/media/docs/default-source/malaria/vector-control/who-standard-form-for-reporting-intensity-concentration-bioassay-results.xlsx?sfvrsn=b82e9f35_2",
         "Discriminating concentration bioassay results": "https://cdn.who.int/media/docs/default-source/malaria/vector-control/who-standard-form-for-reporting-discriminating-concentration-bioassay-results.xlsx?sfvrsn=7273f2bb_2",
         "Molecular and biochemical bioassay results": "https://cdn.who.int/media/docs/default-source/malaria/vector-control/who-standard-form-for-reporting-molecular-and-biochemical-bioassay-results.xlsx?sfvrsn=b302dd0_4",
         "WHO susceptibility tests": "https://web-prod.who.int/docs/default-source/documents/publications/gmp/who-test-kit-catalogue-and-requisition-form-may2013.pdf"
     };

    const handleOrganizationTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newOrganizationType = event.target.value as string;
        setNewOrganizationType(newOrganizationType);
    };

    const handleCountryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newCountry = event.target.value as string;
        setCountry(newCountry);
    };

    const handleClose = () => {
        setDownloadFileOpen(false);
    };

    const handleOpen = () => {
        sendAnalytics({ type: "event", category: "menu", action: "download file" });
        setDownloadFileOpen(true);
    };

    const submit = () => {
        sendAnalytics({ type: "event", category: "menu", action: "download file", label: "submit" });
        window.open(TEMPLATE_TYPES[templateType], "_blank");
        setDownloadFileOpen(false);
    };

    return (
        <React.Fragment>
            <Fab
                id="upload-button"
                size="small"
                color={"default"}
                className={classes.fab}
                onClick={handleOpen}
                title={t("common.icons.downloadFile")}
            >
                <DownloadIcon />
            </Fab>
            <Dialog
                fullWidth
                maxWidth={"xs"}
                open={downloadFileOpen}
                onClose={handleClose}
                PaperProps={{
                    className: classes.paper,
                }}
            >
                <form id="ic_uploadfileForm">
                    <div>
                        <Typography variant={"h5"}>{t("common.downloadFile.title")}</Typography>
                    </div>
                    <div>
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
                        <FormControl fullWidth className={classes.formControl}>
                            <InputLabel>{t("common.downloadFile.template") + "*"}</InputLabel>
                            <Select fullWidth value={templateType} onChange={event => setTemplateType(event.target.value as string)}>
                                {Object.keys(TEMPLATE_TYPES).map(type => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth margin={"normal"}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                disabled={country.length === 0 && newOrganizationType.length === 0 && templateType.length === 0}
                                onClick={submit}
                            >
                                {t("common.downloadFile.button")}
                            </Button>
                        </FormControl>
                    </div>
                </form>
            </Dialog>
        </React.Fragment>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadFile);

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
