import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import { useTranslation } from "react-i18next";
import { range } from "../../YearRangeSelector";
import { Divider } from "../../filters/Filters";
import IntegrationReactSelect, { OptionType } from "../../BasicSelect";

const min = 1988;
const max = new Date().getFullYear();

const suggestions = range(min, max, true).map(year => ({
  label: year,
  value: year
}));

const useStyles = makeStyles({
  root: {
    margin: "10px 20px"
  }
});

type OwnProps = {
  value: number[];
  onChange: (value: number[]) => void;
};

type Props = OwnProps;

const YearsSelector = ({ value, onChange }: Props) => {
  const classes = useStyles({});
  const { t } = useTranslation("common");

  const handleChange = (selection: OptionType[]) => {
    onChange((selection || []).map(s => s.value));
  };
  return (
    <div className={classes.root}>
      <FormLabel component="legend">{t(`filters.years`)}</FormLabel>
      <Divider />
      <IntegrationReactSelect
        isMulti
        isClearable
        suggestions={suggestions}
        onChange={handleChange}
        value={suggestions.filter(year => value.includes(year.value))}
      />
    </div>
  );
};
export default YearsSelector;
