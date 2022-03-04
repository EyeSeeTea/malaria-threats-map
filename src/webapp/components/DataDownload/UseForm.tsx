import React from "react";
import { Card, Checkbox, FormControl, Paper, TextField, Theme, Typography } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import styled from "styled-components";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useTranslation } from "react-i18next";
import FormLabel from "@mui/material/FormLabel";
import { Divider } from "../filters/Filters";
import * as R from "ramda";
import "date-fns";
import { connect } from "react-redux";
import { UseInfo } from "./index";
import FullCountriesSelector from "./filters/FullCountriesSelector";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

const StyledFormControlLabel = styled(FormControlLabel)`
    & span {
        padding: 2px;
    }
`;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1, 0),
        },
        paper: {
            padding: "24px",
            overflow: "unset",
        },
    })
);
const Snackbar = styled(Paper)`
    margin: 16px 0;
    padding: 16px;
`;

const USES = [
    "data_download.step2.data_use_options.research",
    "data_download.step2.data_use_options.grant",
    "data_download.step2.data_use_options.treatments",
    "data_download.step2.data_use_options.vector",
    "data_download.step2.data_use_options.diagnosis",
    "data_download.step2.data_use_options.policies",
    "data_download.step2.data_use_options.advocacy",
];

export const isResearchActive = (uses: string[]) =>
    R.any(
        use =>
            [
                "data_download.step2.data_use_options.research",
                "data_download.step2.data_use_options.grant",
                "data_download.step2.data_use_options.treatments",
            ].includes(use),
        uses
    );

export const isPoliciesActive = (uses: string[]) =>
    R.any(use => ["data_download.step2.data_use_options.policies"].includes(use), uses);

export const isToolsActive = (uses: string[]) =>
    R.any(
        use =>
            ["data_download.step2.data_use_options.vector", "data_download.step2.data_use_options.diagnosis"].includes(
                use
            ),
        uses
    );

type OwnProps = {
    useInfo: Partial<UseInfo>;
    onChange: (key: keyof UseInfo, value: any) => void;
};

const UseForm = ({ onChange, useInfo }: OwnProps) => {
    const classes = useStyles({});
    const { t } = useTranslation();

    const handleUsesChange = (uses: string[]) => {
        onChange("uses", uses);
    };

    const handleCountriesChange = (countries: string[]) => {
        onChange("countries", countries);
    };

    const handleDateChange = (date: Date, _keyboardInputValue?: string) => {
        onChange("studyDate", date);
    };

    const handleConsent1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange("contactConsent", event.target.checked);
    };

    const handleConsent2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange("piConsent", event.target.checked);
    };

    const researchActive = isResearchActive(useInfo.uses);
    const policiesActive = isPoliciesActive(useInfo.uses);
    const toolsActive = isToolsActive(useInfo.uses);

    return (
        <Card className={classes.paper}>
            <FormControl fullWidth className={classes.formControl}>
                <FormLabel component="legend">{t("common.data_download.step2.data_use")}</FormLabel>
                <Divider />
                {USES.map(use => (
                    <StyledFormControlLabel
                        key={use}
                        control={
                            <Checkbox
                                color="primary"
                                checked={useInfo.uses.includes(use)}
                                onChange={() =>
                                    handleUsesChange(
                                        useInfo.uses.includes(use)
                                            ? useInfo.uses.filter(u => u !== use)
                                            : [...useInfo.uses, use]
                                    )
                                }
                            />
                        }
                        label={t<string>(`common.${use}`)}
                    />
                ))}
            </FormControl>
            {researchActive && (
                <FormControl fullWidth className={classes.formControl}>
                    <TextField
                        label={t("common.data_download.step2.date_use_options_content.research") + "*"}
                        multiline
                        maxRows="3"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={useInfo.researchInfo}
                        onChange={event => onChange("researchInfo", event.target.value as string)}
                    />
                </FormControl>
            )}
            {policiesActive && (
                <FormControl fullWidth className={classes.formControl}>
                    <TextField
                        label={t("common.data_download.step2.date_use_options_content.policies") + "*"}
                        multiline
                        maxRows="3"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={useInfo.policiesInfo}
                        onChange={event => onChange("policiesInfo", event.target.value as string)}
                    />
                </FormControl>
            )}
            {toolsActive && (
                <FormControl fullWidth className={classes.formControl}>
                    <TextField
                        label={t("common.data_download.step2.date_use_options_content.tools") + "*"}
                        multiline
                        maxRows="3"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={useInfo.toolsInfo}
                        onChange={event => onChange("toolsInfo", event.target.value as string)}
                    />
                </FormControl>
            )}
            <FormControl fullWidth className={classes.formControl}>
                <FormLabel component="legend">
                    {t("common.data_download.step2.date_use_options_content.date")}
                </FormLabel>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        value={useInfo.studyDate}
                        inputFormat="dd/MM/yyyy"
                        onChange={handleDateChange}
                        renderInput={props => <TextField {...props} />}
                    />
                </LocalizationProvider>
            </FormControl>
            <FullCountriesSelector
                label={t("common.data_download.step2.countries")}
                includeGlobalOption
                value={useInfo.countries}
                onChange={handleCountriesChange}
            />
            <Snackbar>
                {t("common.data_download.step2.message")}
                <FormControlLabel
                    control={
                        <Checkbox checked={useInfo.contactConsent} onChange={handleConsent1Change} color="primary" />
                    }
                    label={<Typography variant={"body2"}>{t("common.data_download.step2.consent1")}</Typography>}
                />
                <FormControlLabel
                    control={<Checkbox checked={useInfo.piConsent} onChange={handleConsent2Change} color="primary" />}
                    label={<Typography variant={"body2"}>{t("common.data_download.step2.consent2")}</Typography>}
                />
            </Snackbar>
        </Card>
    );
};

export default connect(null)(UseForm);
