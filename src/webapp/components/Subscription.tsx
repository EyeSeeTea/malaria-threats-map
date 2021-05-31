import React, { useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import {
    Button,
    createStyles,
    Fab,
    FormControl,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    TextField,
    Theme,
} from "@material-ui/core";
import SubscriptionIcon from "@material-ui/icons/RssFeed";
import Typography from "@material-ui/core/Typography";
import { State } from "../store/types";
import { setSubscriptionOpenAction } from "../store/actions/base-actions";
import { selectIsSubmittingSubscription, selectIsSubscriptionOpen } from "../store/reducers/base-reducer";
import { connect } from "react-redux";
import { addSubscriptionContactRequestAction } from "../store/actions/data-download-actions";
import { Contact } from "./DataDownload";
import { useTranslation } from "react-i18next";
import { sendAnalytics } from "../utils/analytics";
import { addNotificationAction } from "../store/actions/notifier-actions";
import { isNotNull } from "../utils/number-utils";

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
    })
);

const mapStateToProps = (state: State) => ({
    subscriptionOpen: selectIsSubscriptionOpen(state),
    isSubmitting: selectIsSubmittingSubscription(state),
});

const mapDispatchToProps = {
    setSubscriptionOpen: setSubscriptionOpenAction,
    saveContact: addSubscriptionContactRequestAction,
    addNotification: addNotificationAction,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;
export const emailRegexp = new RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

const Subscription = ({ subscriptionOpen, setSubscriptionOpen, isSubmitting, saveContact }: Props) => {
    const { t } = useTranslation();
    const classes = useStyles({});
    const [email, setEmail] = React.useState<string>(null);
    const [firstName, setFirstName] = React.useState<string>(null);
    const [lastName, setLastName] = React.useState<string>(null);
    const [organization, setOrganization] = React.useState<string>(null);
    const [country, setCountry] = React.useState<string>(null);
    const [valid, setValid] = React.useState<boolean>(false);

    useEffect(() => {
        const isValid: boolean =
            emailRegexp.test(email) &&
            isNotNull(firstName) &&
            isNotNull(lastName) &&
            isNotNull(organization) &&
            isNotNull(country);
        setValid(isValid);
    }, [email, firstName, lastName, organization, country]);

    const handleClose = () => {
        setSubscriptionOpen(false);
    };

    const handleOpen = () => {
        sendAnalytics({ type: "event", category: "menu", action: "subscribe" });
        setSubscriptionOpen(true);
    };

    const submit = () => {
        const contact: Contact = {
            email,
            firstName,
            lastName,
            organization,
            country,
        };
        saveContact(contact);
        sendAnalytics({ type: "event", category: "menu", action: "subscribe", label: "submit" });
    };

    return (
        <React.Fragment>
            <Fab
                id="country-button"
                size="small"
                color={"default"}
                className={classes.fab}
                onClick={handleOpen}
                title={t("common.icons.subscribe")}
            >
                <SubscriptionIcon />
            </Fab>
            <Dialog
                fullWidth
                maxWidth={"xs"}
                open={subscriptionOpen}
                onClose={handleClose}
                PaperProps={{
                    className: classes.paper,
                }}
            >
                <form id="ic_signupform">
                    <div>
                        <Typography variant={"h5"}>{t("common.subscription.title")}</Typography>
                    </div>
                    <div>
                        <FormControl fullWidth margin={"dense"}>
                            <div data-validation-type="1" data-label="First Name">
                                <TextField
                                    fullWidth
                                    label={t("common.subscription.first_name")}
                                    type={t("common.subscription.first_name")}
                                    placeholder={t("common.subscription.first_name")}
                                    name="data[fname]"
                                    required
                                    value={firstName}
                                    onChange={event => setFirstName(event.target.value as string)}
                                />
                            </div>
                        </FormControl>
                        <FormControl fullWidth margin={"dense"}>
                            <div data-validation-type="1" data-label="Last Name">
                                <TextField
                                    fullWidth
                                    label={t("common.subscription.last_name")}
                                    type={t("common.subscription.last_name")}
                                    placeholder={t("common.subscription.last_name")}
                                    name="data[lname]"
                                    required
                                    value={lastName}
                                    onChange={event => setLastName(event.target.value as string)}
                                />
                            </div>
                        </FormControl>
                        <FormControl fullWidth margin={"dense"}>
                            <div data-validation-type="1" data-label="Email">
                                <TextField
                                    fullWidth
                                    label={t("common.subscription.email")}
                                    type={t("common.subscription.email")}
                                    placeholder={t("common.subscription.email")}
                                    required
                                    name="data[email]"
                                    value={email}
                                    onChange={event => setEmail(event.target.value as string)}
                                />
                            </div>
                        </FormControl>
                        <FormControl fullWidth margin={"dense"}>
                            <div
                                className="formEl fieldtype-input required"
                                data-validation-type="1"
                                data-label="Country"
                            >
                                <TextField
                                    fullWidth
                                    label={t("common.subscription.country")}
                                    type={t("common.subscription.country")}
                                    placeholder={t("common.subscription.country")}
                                    required
                                    name="data[country]"
                                    value={country}
                                    onChange={event => setCountry(event.target.value as string)}
                                />
                            </div>
                        </FormControl>
                        <div
                            className="formEl fieldtype-dropdown required"
                            data-validation-type="1"
                            data-label="Organization"
                        >
                            <FormControl fullWidth margin={"dense"}>
                                <InputLabel id="organization-label">{t("common.subscription.organization")}</InputLabel>
                                <Select
                                    name="data[organization]"
                                    labelId="organization-label"
                                    value={organization}
                                    onChange={event => setOrganization(event.target.value as string)}
                                >
                                    <MenuItem value="nmcp">{t("common.subscription.institutions.nmcp")}</MenuItem>
                                    <MenuItem value="funding">
                                        {t("common.subscription.institutions.funding_organization")}
                                    </MenuItem>
                                    <MenuItem value="research">
                                        {t("common.subscription.institutions.research_organization")}
                                    </MenuItem>
                                    <MenuItem value="collaboratingcenter">
                                        {t("common.subscription.institutions.who_collaborating_centers")}
                                    </MenuItem>
                                    <MenuItem value="privatesector">
                                        {t("common.subscription.institutions.private_sector")}
                                    </MenuItem>
                                    <MenuItem value="ngo">{t("common.subscription.institutions.ngo")}</MenuItem>
                                    <MenuItem value="media">
                                        {t("common.subscription.institutions.media_organization")}
                                    </MenuItem>
                                    <MenuItem value="whoco">
                                        {t("common.subscription.institutions.who_country_office")}
                                    </MenuItem>
                                    <MenuItem value="whoro">
                                        {t("common.subscription.institutions.who_regional_office")}
                                    </MenuItem>
                                    <MenuItem value="whohq">{t("common.subscription.institutions.who_headquarters")}</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <FormControl fullWidth margin={"normal"}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                disabled={isSubmitting || !valid}
                                onClick={() => submit()}
                            >
                                {t("common.subscription.button")}
                            </Button>
                        </FormControl>
                    </div>
                </form>
            </Dialog>
        </React.Fragment>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Subscription);
