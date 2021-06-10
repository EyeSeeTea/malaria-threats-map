import React from "react";
import {
    Card,
    createStyles,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    TextField,
    Theme,
    Select,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { UserInfo } from "./index";
import { emailRegexp } from "../Subscription";
import { FullCountry } from "./filters/FullCountriesSelector";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1, 0),
        },
        paper: {
            padding: "24px",
        },
    })
);

export const ORGANIZATION_TYPES = [
    "data_download.step1.organization_type_options.university",
    "data_download.step1.organization_type_options.ngos",
    "data_download.step1.organization_type_options.agency",
    "data_download.step1.organization_type_options.international",
    "data_download.step1.organization_type_options.government",
    "data_download.step1.organization_type_options.partnership",
    "data_download.step1.organization_type_options.consultant",
    "data_download.step1.organization_type_options.health",
    "data_download.step1.organization_type_options.communications",
    "data_download.step1.organization_type_options.private",
    "data_download.step1.organization_type_options.other",
];

type Props = {
    userInfo: Partial<UserInfo>;
    onChange: (key: keyof UserInfo, value: any) => void;
};

const UserForm = ({ onChange, userInfo }: Props) => {
    const classes = useStyles({});
    const { t } = useTranslation("common");
    const { t: tCountries } = useTranslation("fullCountries");
    const handleOrganizationTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newOrganizationType = event.target.value as string;
        onChange("organizationType", newOrganizationType);
    };

    const handleCountryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newCountry = event.target.value as string;
        onChange("country", newCountry);
    };

    const organizationTypes = ORGANIZATION_TYPES.map(ot => t(ot)).sort();

    const baseCountries: FullCountry[] = tCountries("countries", { returnObjects: true });

    const countries = baseCountries.sort((t1, t2) => (t1.name < t2.name ? -1 : 1));

    return (
        <Card className={classes.paper}>
            <FormControl fullWidth className={classes.formControl}>
                <TextField
                    label={t("data_download.step1.first_name") + "*"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={userInfo.firstName}
                    onChange={event => onChange("firstName", event.target.value as string)}
                />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
                <TextField
                    label={t("data_download.step1.last_name") + "*"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={userInfo.lastName}
                    onChange={event => onChange("lastName", event.target.value as string)}
                />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
                <TextField
                    label={t("data_download.step1.position") + "*"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={userInfo.position}
                    onChange={event => onChange("position", event.target.value as string)}
                />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
                <TextField
                    label={t("data_download.step1.organization_name") + "*"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={userInfo.organizationName}
                    onChange={event => onChange("organizationName", event.target.value as string)}
                />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
                <InputLabel>{t("data_download.step1.organization_type") + "*"}</InputLabel>
                <Select fullWidth value={userInfo.organizationType} onChange={handleOrganizationTypeChange}>
                    {organizationTypes.map(type => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {countries && (
                <FormControl fullWidth className={classes.formControl}>
                    <InputLabel>{t("data_download.step1.country") + "*"}</InputLabel>
                    <Select fullWidth value={userInfo.country} onChange={handleCountryChange}>
                        {countries.map(country => (
                            <MenuItem key={country.iso2} value={country.iso2}>
                                {country.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            <FormControl fullWidth className={classes.formControl}>
                <TextField
                    label={t("data_download.step1.email") + "*"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    error={userInfo.email && !emailRegexp.test(userInfo.email)}
                    value={userInfo.email}
                    onChange={event => onChange("email", event.target.value as string)}
                />
            </FormControl>
        </Card>
    );
};

export default connect()(UserForm);
