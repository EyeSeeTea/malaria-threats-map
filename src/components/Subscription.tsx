import React, { useEffect, useRef } from "react";
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
  setSubscriptionOpen: setSubscriptionOpenAction
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const Subscription = ({ subscriptionOpen, setSubscriptionOpen }: Props) => {
  const classes = useStyles({});
  const ref = useRef();

  useEffect(() => {
    const validation = document.createElement("script");

    validation.src =
      "//app.icontact.com/icp/static/form/javascripts/validation-captcha.js";
    validation.async = true;
    const tracking = document.createElement("script");

    tracking.src =
      "////app.icontact.com/icp/static/form/javascripts/tracking.js";
    tracking.async = true;

    setTimeout(() => {
      if (ref && ref.current) {
        // @ts-ignore
        ref.current.appendChild(validation);
        // @ts-ignore
        ref.current.appendChild(tracking);
      }
    }, 2000);
  });

  const handleClose = () => {
    setSubscriptionOpen(false);
  };

  const handleOpen = () => {
    setSubscriptionOpen(true);
  };

  const verifyCallback = (response: any) => {
    console.log(response);
  };

  // @ts-ignore
  // @ts-ignore
  return (
    <React.Fragment>
      <Fab
        id="country-button"
        size="small"
        color={"default"}
        className={classes.fab}
        onClick={handleOpen}
      >
        <SubscriptionIcon />
      </Fab>
      <Dialog
        fullWidth
        open={subscriptionOpen}
        onClose={handleClose}
        PaperProps={{
          className: classes.paper
        }}
      >
        {/*<form*/}
        {/*  id="ic_signupform"*/}
        {/*  captcha-key="6LeCZCcUAAAAALhxcQ5fN80W6Wa2K3GqRQK6WRjA"*/}
        {/*  captcha-theme="light"*/}
        {/*  new-captcha="true"*/}
        {/*  method="POST"*/}
        {/*  action="https://app.icontact.com/icp/core/mycontacts/signup/designer/form/?id=397&cid=1358575&lid=10873"*/}
        {/*>*/}
        {/*  <div>*/}
        {/*    <Typography variant={"h5"}>*/}
        {/*      Subscribe to receive Threats Updates!*/}
        {/*    </Typography>*/}
        {/*  </div>*/}
        {/*  <div>*/}
        {/*    <div data-validation-type="1" data-label="First Name">*/}
        {/*      <TextField*/}
        {/*        fullWidth*/}
        {/*        label="First Name"*/}
        {/*        type="text"*/}
        {/*        placeholder="First Name"*/}
        {/*        name="data[fname]"*/}
        {/*        required*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*    <div data-validation-type="1" data-label="Last Name">*/}
        {/*      <TextField*/}
        {/*        fullWidth*/}
        {/*        label="Last Name"*/}
        {/*        type="text"*/}
        {/*        placeholder="Last Name"*/}
        {/*        name="data[lname]"*/}
        {/*        required*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*    <div data-validation-type="1" data-label="Email">*/}
        {/*      <TextField*/}
        {/*        fullWidth*/}
        {/*        label="Email"*/}
        {/*        type="email"*/}
        {/*        placeholder="Email"*/}
        {/*        required*/}
        {/*        name="data[email]"*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*    <div*/}
        {/*      className="formEl fieldtype-input required"*/}
        {/*      data-validation-type="1"*/}
        {/*      data-label="Country"*/}
        {/*    >*/}
        {/*      <TextField*/}
        {/*        fullWidth*/}
        {/*        label="Country"*/}
        {/*        type="text"*/}
        {/*        placeholder="Country"*/}
        {/*        required*/}
        {/*        name="data[country]"*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*    <div*/}
        {/*      className="formEl fieldtype-dropdown required"*/}
        {/*      data-validation-type="1"*/}
        {/*      data-label="Organization"*/}
        {/*    >*/}
        {/*      <FormControl fullWidth>*/}
        {/*        <InputLabel id="organization-label">Organization</InputLabel>*/}
        {/*        <Select name="data[organization]" labelId="organization-label">*/}
        {/*          <MenuItem value="nmcp">NMCP</MenuItem>*/}
        {/*          <MenuItem value="funding">Funding organization</MenuItem>*/}
        {/*          <MenuItem value="research">Research Organization</MenuItem>*/}
        {/*          <MenuItem value="collaboratingcenter">*/}
        {/*            WHO Collaborating Centers*/}
        {/*          </MenuItem>*/}
        {/*          <MenuItem value="privatesector">Private Sector</MenuItem>*/}
        {/*          <MenuItem value="ngo">NGO</MenuItem>*/}
        {/*          <MenuItem value="media">Media Organization</MenuItem>*/}
        {/*          <MenuItem value="whoco">WHO Country Office</MenuItem>*/}
        {/*          <MenuItem value="whoro">WHO Regional Office</MenuItem>*/}
        {/*          <MenuItem value="whohq">WHO Headquarters</MenuItem>*/}
        {/*        </Select>*/}
        {/*      </FormControl>*/}
        {/*    </div>*/}
        {/*    <div*/}
        {/*      className="formEl fieldtype-checkbox required"*/}
        {/*      data-validation-type="1"*/}
        {/*      data-label="Lists"*/}
        {/*    >*/}
        {/*      <FormControlLabel*/}
        {/*        control={*/}
        {/*          <Checkbox*/}
        {/*            inputProps={{*/}
        {/*              name: "data[listGroups][]",*/}
        {/*              value: "125447"*/}
        {/*            }}*/}
        {/*          />*/}
        {/*        }*/}
        {/*        label="Malaria Threats Map"*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*    <Button variant="contained" color="primary" type="submit">*/}
        {/*      Submit*/}
        {/*    </Button>*/}
        {/*  </div>*/}
        {/*</form>*/}
        <form
          id="ic_signupform"
          captcha-key="6LeCZCcUAAAAALhxcQ5fN80W6Wa2K3GqRQK6WRjA"
          captcha-theme="light"
          new-captcha="true"
          method="POST"
          action="https://app.icontact.com/icp/core/mycontacts/signup/designer/form/?id=397&cid=1358575&lid=10873"
        >
          <div className="elcontainer normal inline-label-left left-aligned">
            <div className="form-header">
              <h3>Subscribe to receive Threats Updates!</h3>
            </div>
            <div className="sortables">
              <div
                className="formEl fieldtype-input required"
                data-validation-type={1}
                data-label="First Name"
                style={{ display: "inline-block", width: "100%" }}
              >
                <label>
                  First Name<span className="indicator required">*</span>
                </label>
                <input
                  type="text"
                  placeholder="First Name"
                  name="data[fname]"
                />
              </div>
              <div
                className="formEl fieldtype-input required"
                data-validation-type={1}
                data-label="Last Name"
                style={{ display: "inline-block", width: "100%" }}
              >
                <label>
                  Last Name<span className="indicator required">*</span>
                </label>
                <input type="text" placeholder="Last Name" name="data[lname]" />
              </div>
              <div
                className="formEl fieldtype-input required"
                data-validation-type={1}
                data-label="Email"
                style={{ display: "inline-block", width: "100%" }}
              >
                <label>
                  Email<span className="indicator required">*</span>
                </label>
                <input type="text" placeholder="Email" name="data[email]" />
              </div>
              <div
                className="formEl fieldtype-input required"
                data-validation-type={1}
                data-label="Country"
                style={{ display: "inline-block", width: "100%" }}
              >
                <label>
                  Country<span className="indicator required">*</span>
                </label>
                <input type="text" placeholder="Country" name="data[country]" />
              </div>
              <div
                className="formEl fieldtype-dropdown required"
                data-validation-type={1}
                data-label="Organization"
                style={{ display: "inline-block", width: "100%" }}
              >
                <label>
                  Organization<span className="indicator required">*</span>
                </label>
                <select
                  // @ts-ignore
                  type="text"
                  alt="Organization"
                  name="data[organization]"
                >
                  <option value="nmcp">NMCP</option>
                  <option value="funding">Funding organization</option>
                  <option value="research">Research Organization</option>
                  <option value="collaboratingcenter">
                    WHO Collaborating Centers
                  </option>
                  <option value="privatesector">Private Sector</option>
                  <option value="ngo">NGO</option>
                  <option value="media">Media Organization</option>
                  <option value="whoco">WHO Country Office</option>
                  <option value="whoro">WHO Regional Office</option>
                  <option value="whohq">WHO Headquarters</option>
                </select>
              </div>
              <div
                className="formEl fieldtype-checkbox required"
                // @ts-ignore
                dataname="listGroups"
                data-validation-type={1}
                data-label="Lists"
                style={{ display: "none", width: "100%" }}
              >
                <h3>
                  Lists<span className="indicator required">*</span>
                </h3>
                <div className="option-container">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      alt="Lists"
                      name="data[listGroups][]"
                      // @ts-ignore
                      defaultValue={125447}
                      // @ts-ignore
                      defaultChecked="checked"
                    />
                    Malaria Threats Map
                  </label>
                </div>
              </div>
              <div className="submit-container">
                <input
                  type="submit"
                  defaultValue="Submit"
                  className="btn btn-submit"
                />
              </div>
            </div>
            <div className="hidden-container" />
          </div>
        </form>
        <img src="//app.icontact.com/icp/core/signup/tracking.gif?id=397&cid=1358575&lid=10873" />
      </Dialog>
    </React.Fragment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Subscription);
