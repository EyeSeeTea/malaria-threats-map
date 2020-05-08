import React from "react";
import Dialog from "@material-ui/core/Dialog";
import {
  Button,
  Checkbox,
  createStyles,
  Fab,
  FormControl,
  FormControlLabel,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Theme
} from "@material-ui/core";
import SubscriptionIcon from "@material-ui/icons/RssFeed";
import Typography from "@material-ui/core/Typography";
import { State } from "../store/types";
import { setSubscriptionOpenAction } from "../store/actions/base-actions";
import { selectIsSubscriptionOpen } from "../store/reducers/base-reducer";
import { connect } from "react-redux";
import { addSubscriptionContactRequestAction } from "../store/actions/data-download-actions";
import { Contact } from "./DataDownload";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(1),
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch"
      }
    },
    fab: {
      pointerEvents: "all",
      margin: theme.spacing(0.5, 0.5)
    },
    paper: {
      margin: theme.spacing(1),
      padding: theme.spacing(3),
      width: "100%"
    }
  })
);

const mapStateToProps = (state: State) => ({
  subscriptionOpen: selectIsSubscriptionOpen(state)
});

const mapDispatchToProps = {
  setSubscriptionOpen: setSubscriptionOpenAction,
  saveContact: addSubscriptionContactRequestAction
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const Subscription = ({
  subscriptionOpen,
  setSubscriptionOpen,
  saveContact
}: Props) => {
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
      country
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
        title={"Subscription"}
      >
        <SubscriptionIcon />
      </Fab>
      <Dialog
        fullWidth
        maxWidth={"xs"}
        open={subscriptionOpen}
        onClose={handleClose}
        PaperProps={{
          className: classes.paper
        }}
      >
        <form id="ic_signupform">
          <div>
            <Typography variant={"h5"}>
              Subscribe to receive Threats Updates!
            </Typography>
          </div>
          <div>
            <FormControl fullWidth margin={"dense"}>
              <div data-validation-type="1" data-label="First Name">
                <TextField
                  fullWidth
                  label="First Name"
                  type="text"
                  placeholder="First Name"
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
                  label="Last Name"
                  type="text"
                  placeholder="Last Name"
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
                  label="Email"
                  type="email"
                  placeholder="Email"
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
                  label="Country"
                  type="text"
                  placeholder="Country"
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
                <InputLabel id="organization-label">Organization</InputLabel>
                <Select
                  name="data[organization]"
                  labelId="organization-label"
                  value={organization}
                  onChange={event =>
                    setOrganization(event.target.value as string)
                  }
                >
                  <MenuItem value="nmcp">NMCP</MenuItem>
                  <MenuItem value="funding">Funding organization</MenuItem>
                  <MenuItem value="research">Research Organization</MenuItem>
                  <MenuItem value="collaboratingcenter">
                    WHO Collaborating Centers
                  </MenuItem>
                  <MenuItem value="privatesector">Private Sector</MenuItem>
                  <MenuItem value="ngo">NGO</MenuItem>
                  <MenuItem value="media">Media Organization</MenuItem>
                  <MenuItem value="whoco">WHO Country Office</MenuItem>
                  <MenuItem value="whoro">WHO Regional Office</MenuItem>
                  <MenuItem value="whohq">WHO Headquarters</MenuItem>
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
                Subscribe
              </Button>
            </FormControl>
          </div>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Subscription);
