import React from "react";
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
import { selectIsSubscriptionOpen } from "../store/reducers/base-reducer";
import { connect } from "react-redux";
import { addSubscriptionContactRequestAction } from "../store/actions/data-download-actions";
import { Contact } from "./DataDownload";
import { useTranslation } from "react-i18next";

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
});

const mapDispatchToProps = {
  setSubscriptionOpen: setSubscriptionOpenAction,
  saveContact: addSubscriptionContactRequestAction,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const Subscription = ({
  subscriptionOpen,
  setSubscriptionOpen,
  saveContact,
}: Props) => {
  const { t } = useTranslation("common");
  const classes = useStyles({});
  const [email, setEmail] = React.useState<string>(null);
  const [firstName, setFirstName] = React.useState<string>(null);
  const [lastName, setLastName] = React.useState<string>(null);
  const [organization, setOrganization] = React.useState<string>(null);
  const [country, setCountry] = React.useState<string>(null);

  const handleClose = () => {
    setSubscriptionOpen(false);
  };

  const handleOpen = () => {
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
  };

  return (
    <React.Fragment>
      <Fab
        id="country-button"
        size="small"
        color={"default"}
        className={classes.fab}
        onClick={handleOpen}
        title={t("icons.subscribe")}
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
            <Typography variant={"h5"}>{t("subscription.title")}</Typography>
          </div>
          <div>
            <FormControl fullWidth margin={"dense"}>
              <div data-validation-type="1" data-label="First Name">
                <TextField
                  fullWidth
                  label={t("subscription.first_name")}
                  type={t("subscription.first_name")}
                  placeholder={t("subscription.first_name")}
                  name="data[fname]"
                  required
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(event.target.value as string)
                  }
                />
              </div>
            </FormControl>
            <FormControl fullWidth margin={"dense"}>
              <div data-validation-type="1" data-label="Last Name">
                <TextField
                  fullWidth
                  label={t("subscription.last_name")}
                  type={t("subscription.last_name")}
                  placeholder={t("subscription.last_name")}
                  name="data[lname]"
                  required
                  value={lastName}
                  onChange={(event) =>
                    setLastName(event.target.value as string)
                  }
                />
              </div>
            </FormControl>
            <FormControl fullWidth margin={"dense"}>
              <div data-validation-type="1" data-label="Email">
                <TextField
                  fullWidth
                  label={t("subscription.email")}
                  type={t("subscription.email")}
                  placeholder={t("subscription.email")}
                  required
                  name="data[email]"
                  value={email}
                  onChange={(event) => setEmail(event.target.value as string)}
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
                  label={t("subscription.country")}
                  type={t("subscription.country")}
                  placeholder={t("subscription.country")}
                  required
                  name="data[country]"
                  value={country}
                  onChange={(event) => setCountry(event.target.value as string)}
                />
              </div>
            </FormControl>
            <div
              className="formEl fieldtype-dropdown required"
              data-validation-type="1"
              data-label="Organization"
            >
              <FormControl fullWidth margin={"dense"}>
                <InputLabel id="organization-label">
                  {t("subscription.organization")}
                </InputLabel>
                <Select
                  name="data[organization]"
                  labelId="organization-label"
                  value={organization}
                  onChange={(event) =>
                    setOrganization(event.target.value as string)
                  }
                >
                  <MenuItem value="nmcp">
                    {t("subscription.institutions.nmcp")}
                  </MenuItem>
                  <MenuItem value="funding">
                    {t("subscription.institutions.funding_organization")}
                  </MenuItem>
                  <MenuItem value="research">
                    {t("subscription.institutions.research_organization")}
                  </MenuItem>
                  <MenuItem value="collaboratingcenter">
                    {t("subscription.institutions.who_collaborating_centers")}
                  </MenuItem>
                  <MenuItem value="privatesector">
                    {t("subscription.institutions.private_sector")}
                  </MenuItem>
                  <MenuItem value="ngo">
                    {t("subscription.institutions.ngo")}
                  </MenuItem>
                  <MenuItem value="media">
                    {t("subscription.institutions.media_organization")}
                  </MenuItem>
                  <MenuItem value="whoco">
                    {t("subscription.institutions.who_country_office")}
                  </MenuItem>
                  <MenuItem value="whoro">
                    {t("subscription.institutions.who_regional_office")}
                  </MenuItem>
                  <MenuItem value="whohq">
                    {t("subscription.institutions.who_headquarters")}
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            <FormControl fullWidth margin={"normal"}>
              <Button
                variant="contained"
                color="primary"
                type="button"
                onClick={() => submit()}
              >
                {t("subscription.button")}
              </Button>
            </FormControl>
          </div>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Subscription);
