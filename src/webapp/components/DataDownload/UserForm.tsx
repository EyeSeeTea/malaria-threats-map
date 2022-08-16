import React from "react";
import { Checkbox, Container, FormControlLabel, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { UserInfo } from "./index";
import { emailRegexp } from "../Subscription";
import { FullCountry } from "./filters/FullCountriesSelector";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const ORGANIZATION_TYPES = [
    "common.data_download.step1.organization_type_options.university",
    "common.data_download.step1.organization_type_options.ngos",
    "common.data_download.step1.organization_type_options.agency",
    "common.data_download.step1.organization_type_options.international",
    "common.data_download.step1.organization_type_options.government",
    "common.data_download.step1.organization_type_options.partnership",
    "common.data_download.step1.organization_type_options.consultant",
    "common.data_download.step1.organization_type_options.health",
    "common.data_download.step1.organization_type_options.communications",
    "common.data_download.step1.organization_type_options.private",
    "common.data_download.step1.organization_type_options.other",
];

type Props = {
    userInfo: Partial<UserInfo>;
    onChange: (key: keyof UserInfo, value: any) => void;
};

const UserForm = ({ onChange, userInfo }: Props) => {
    const { t } = useTranslation();
    const handleOrganizationTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newOrganizationType = event.target.value as string;
        onChange("organizationType", newOrganizationType);
    };

    const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newCountry = event.target.value as string;
        onChange("country", newCountry);
    };

    const handleConsent1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange("contactConsent", event.target.checked);
    };

    const handleConsent2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange("piConsent", event.target.checked);
    };

    const organizationTypes = ORGANIZATION_TYPES.map(ot => t(ot)).sort();
    const countries: FullCountry = t("countries", { returnObjects: true });

    //
    return (
        <React.Fragment>
            <Typography variant="h4" fontWeight="bold" sx={{ marginBottom: 6 }}>
                {t("common.data_download.step1.title")}
            </Typography>
            <Grid container rowSpacing={3} columnSpacing={2}>
                <Grid item md={4} xs={12}>
                    <StyledTextField
                        fullWidth
                        variant="outlined"
                        label={t("common.data_download.step1.first_name")}
                        value={userInfo.firstName}
                        onChange={event => onChange("firstName", event.target.value as string)}
                    />
                </Grid>
                <Grid item md={4} xs={12}>
                    <StyledTextField
                        fullWidth
                        variant="outlined"
                        label={t("common.data_download.step1.last_name")}
                        value={userInfo.lastName}
                        onChange={event => onChange("lastName", event.target.value as string)}
                    />
                </Grid>
                <Grid item md={4} xs={12}>
                    <StyledTextField
                        fullWidth
                        variant="outlined"
                        label={t("common.data_download.step1.email")}
                        error={userInfo.email && !emailRegexp.test(userInfo.email)}
                        value={userInfo.email}
                        onChange={event => onChange("email", event.target.value as string)}
                    />
                </Grid>
                <Grid item md={4} xs={12}>
                    <StyledTextField
                        fullWidth
                        variant="outlined"
                        label={t("common.data_download.step1.organization_name")}
                        value={userInfo.organizationName}
                        onChange={event => onChange("organizationName", event.target.value as string)}
                    />
                </Grid>
                <Grid item md={4} xs={12}>
                    <StyledTextField
                        fullWidth
                        variant="outlined"
                        select
                        label={t("common.data_download.step1.organization_type")}
                        value={userInfo.organizationType}
                        onChange={handleOrganizationTypeChange}
                    >
                        {organizationTypes.map(type => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </StyledTextField>
                </Grid>
                <Grid item md={4} xs={12}>
                    <StyledTextField
                        fullWidth
                        variant="outlined"
                        select
                        label={t("common.data_download.step1.country")}
                        value={userInfo.country}
                        onChange={handleCountryChange}
                    >
                        {Object.entries(countries).map(([iso, name]) => (
                            <MenuItem key={iso} value={iso}>
                                {name}
                            </MenuItem>
                        ))}
                    </StyledTextField>
                </Grid>
                <Grid item xs={12}>
                    <StyledTextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder={t("common.data_download.step1.uses_placeHolder")}
                        value={userInfo.uses}
                        onChange={event => onChange("uses", event.target.value as string)}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Trans i18nKey="common.data_download.step1.message" t={t}>
                        WHO is keen to improve the global databases and Malaria Threats Map to better serve the needs of
                        our user community. Hence, WHO would like to engage with our user community to collect
                        suggestions for improvement and to learn from different use cases and benefits that these
                        products bring to them. If you would like to share feedback, you can do so{" "}
                        <NavLink to="/contact">here</NavLink>.
                    </Trans>
                </Grid>

                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={userInfo.contactConsent}
                                onChange={handleConsent1Change}
                                color="primary"
                            />
                        }
                        label={<Typography variant={"body2"}>{t("common.data_download.step1.consent1")}</Typography>}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox checked={userInfo.piConsent} onChange={handleConsent2Change} color="primary" />
                        }
                        label={<Typography variant={"body2"}>{t("common.data_download.step1.consent2")}</Typography>}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default connect()(UserForm);

const StyledTextField = styled(TextField)`
    .MuiInputBase-root {
        background-color: #eff3f759;
    }
`;
