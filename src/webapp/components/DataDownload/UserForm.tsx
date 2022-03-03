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
import { FullCountry } from "./filters/FullCountriesSelector";
import { emailRegexp } from "../../../domain/common/regex";

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
    const classes = useStyles({});
    const { t } = useTranslation();
    const handleOrganizationTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newOrganizationType = event.target.value as string;
        onChange("organizationType", newOrganizationType);
    };

    const handleCountryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newCountry = event.target.value as string;
        onChange("country", newCountry);
    };

    const organizationTypes = ORGANIZATION_TYPES.map(ot => t(ot)).sort();
    const countries: FullCountry = t("countries", { returnObjects: true });

    return (
        <Card className={classes.paper}>
            <FormControl fullWidth className={classes.formControl}>
                <TextField
                    label={t("common.data_download.step1.first_name") + "*"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={userInfo.firstName}
                    onChange={event => onChange("firstName", event.target.value as string)}
                />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
                <TextField
                    label={t("common.data_download.step1.last_name") + "*"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={userInfo.lastName}
                    onChange={event => onChange("lastName", event.target.value as string)}
                />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
                <TextField
                    label={t("common.data_download.step1.position") + "*"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={userInfo.position}
                    onChange={event => onChange("position", event.target.value as string)}
                />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
                <TextField
                    label={t("common.data_download.step1.organization_name") + "*"}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={userInfo.organizationName}
                    onChange={event => onChange("organizationName", event.target.value as string)}
                />
            </FormControl>
            <FormControl fullWidth className={classes.formControl}>
                <InputLabel>{t("common.data_download.step1.organization_type") + "*"}</InputLabel>
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
                    <InputLabel>{t("common.data_download.step1.country") + "*"}</InputLabel>
                    <Select fullWidth value={userInfo.country} onChange={handleCountryChange}>
                        {Object.entries(countries).map(([iso, name]) => (
                            <MenuItem key={iso} value={iso}>
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            <FormControl fullWidth className={classes.formControl}>
                <TextField
                    label={t("common.data_download.step1.email") + "*"}
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
