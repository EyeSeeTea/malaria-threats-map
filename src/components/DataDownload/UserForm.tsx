import React from "react";
import {
  createStyles,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  TextField,
  Theme
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import Container from "@material-ui/core/Container";
import Select from "@material-ui/core/Select";
import { State } from "../../store/types";
import { selectCountries } from "../../store/reducers/translations-reducer";
import { connect } from "react-redux";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1, 1)
    }
  })
);

const ORGANIZATION_TYPES = [
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
  "data_download.step1.organization_type_options.other"
];

const mapStateToProps = (state: State) => ({
  countries: selectCountries(state)
});

const mapDispatchToProps = {};
type OwnProps = {};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps & OwnProps;

const UserForm = ({ countries }: Props) => {
  const classes = useStyles({});
  const { t } = useTranslation("common");
  const [organizationType, setOrganizationType] = React.useState(
    ORGANIZATION_TYPES[0]
  );
  const [country, setCountry] = React.useState(undefined);
  const handleOrganizationTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setOrganizationType(event.target.value as string);
  };
  const handleCountryChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setCountry(event.target.value as string);
  };

  return (
    <Container maxWidth={"sm"}>
      <FormControl fullWidth className={classes.formControl}>
        <TextField
          label={t("data_download.step1.first_name")}
          InputLabelProps={{
            shrink: true
          }}
        />
      </FormControl>
      <FormControl fullWidth className={classes.formControl}>
        <TextField
          label={t("data_download.step1.last_name")}
          InputLabelProps={{
            shrink: true
          }}
        />
      </FormControl>
      <FormControl fullWidth className={classes.formControl}>
        <InputLabel>{t("data_download.step1.organization_type")}</InputLabel>
        <Select
          fullWidth
          value={organizationType}
          onChange={handleOrganizationTypeChange}
        >
          {ORGANIZATION_TYPES.map(type => (
            <MenuItem key={type} value={type}>
              {t(type)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth className={classes.formControl}>
        <TextField
          label={t("data_download.step1.organization_name")}
          InputLabelProps={{
            shrink: true
          }}
        />
      </FormControl>
      <FormControl fullWidth className={classes.formControl}>
        <TextField
          label={t("data_download.step1.position")}
          InputLabelProps={{
            shrink: true
          }}
        />
      </FormControl>
      {countries && (
        <FormControl fullWidth className={classes.formControl}>
          <InputLabel>{t("data_download.step1.country")}</InputLabel>
          <Select fullWidth value={country} onChange={handleCountryChange}>
            {countries.map(type => (
              <MenuItem key={type.VALUE_} value={type.VALUE_}>
                {t(type.VALUE_)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <FormControl fullWidth className={classes.formControl}>
        <TextField
          label={t("data_download.step1.email")}
          InputLabelProps={{
            shrink: true
          }}
        />
      </FormControl>
      <FormControl fullWidth className={classes.formControl}>
        <TextField
          label={t("data_download.step1.phone")}
          InputLabelProps={{
            shrink: true
          }}
        />
      </FormControl>
    </Container>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserForm);
