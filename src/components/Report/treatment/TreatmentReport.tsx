import React from "react";
import clsx from "clsx";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { connect } from "react-redux";
import { State } from "../../../store/types";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import { Data, headCells } from "./columns";
import FilterPopover from "./FilterPopover";
import {
  filterByCountries,
  filterByDrugs,
  filterByManyPlasmodiumSpecies,
  filterByMolecularMarkerStudyDimension256,
} from "../../layers/studies-filters";
import { exportToCSV } from "../../DataDownload/download";
import { Button } from "@material-ui/core";
import { getComparator, Order, percentile, stableSort } from "../utils";
import { selectTreatmentStudies } from "../../../store/reducers/treatment-reducer";
import { TreatmentStudy } from "../../../types/Treatment";
import { EnhancedTableProps, StyledCell, useStyles } from "../types";
import { isNull } from "../../../utils/number-utils";
import { format } from "date-fns";

function EnhancedTableHead(props: EnhancedTableProps) {
  const { t } = useTranslation("common");
  const { classes, order, orderBy, onRequestSort } = props;

  const createSortHandler = (property: keyof Data) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };
  //17
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledCell
            key={headCell.id}
            align={headCell.align || "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
            divider={headCell.divider}
            isBold
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={
                  headCell.sortable ? createSortHandler(headCell.id) : () => {}
                }
              >
                {t(headCell.label)}
                {headCell.sortable && orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              t(headCell.label)
            )}
          </StyledCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: "1 1 100%",
    },
    button: {
      margin: theme.spacing(1),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
  })
);

interface EnhancedTableToolbarProps {
  numSelected: number;
  countries: string[];
  setCountries: any;
  drugs: string[];
  setDrugs: any;
  plasmodiumSpecie: string;
  setPlasmodiumSpecie: any;
  onClick: any;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { t } = useTranslation("common");
  const classes = useToolbarStyles({});
  const {
    numSelected,
    countries,
    setCountries,
    drugs,
    setDrugs,
    plasmodiumSpecie,
    setPlasmodiumSpecie,
    onClick,
  } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <>
          <Typography className={classes.title} variant="h6" id="tableTitle">
            {t("report.treatment.title")}
            <br />
            <Typography variant="body1" id="tableTitle">
              ({t(plasmodiumSpecie.replace(".", "%2E"))})
            </Typography>
          </Typography>
        </>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        // <div />
        <>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            startIcon={<CloudDownloadIcon />}
            onClick={onClick}
          >
            {t("data_download.buttons.download")}
          </Button>
          <FilterPopover
            countries={countries}
            setCountries={setCountries}
            drugs={drugs}
            setDrugs={setDrugs}
            plasmodiumSpecie={plasmodiumSpecie}
            setPlasmodiumSpecie={setPlasmodiumSpecie}
          />
        </>
      )}
    </Toolbar>
  );
};

const mapStateToProps = (state: State) => ({
  studies: selectTreatmentStudies(state),
});
const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {};
type Props = StateProps & OwnProps & DispatchProps;

function TreatmentReport({ studies: baseStudies }: Props) {
  const classes = useStyles({});
  const { t } = useTranslation("common");
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("DRUG");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  const [countries, doSetCountries] = React.useState<string[]>([]);
  const [drugs, doSetDrugs] = React.useState<string[]>([]);
  const [plasmodiumSpecie, doSetPlasmodiumSpecie] = React.useState<string>(
    "P._FALCIPARUM"
  );

  const setCountries = (countries: string[]) => {
    doSetCountries(countries);
    setPage(0);
  };

  const setDrugs = (species: string[]) => {
    doSetDrugs(species);
    setPage(0);
  };

  const setPlasmodiumSpecie = (specie: string) => {
    doSetPlasmodiumSpecie(specie);
    setPage(0);
  };

  const filters = [
    (study: TreatmentStudy) => !isNull(study.DRUG_NAME),
    filterByMolecularMarkerStudyDimension256(),
    filterByManyPlasmodiumSpecies([plasmodiumSpecie]),
    filterByCountries(countries),
    filterByDrugs(drugs),
  ];

  const studies = filters.reduce(
    (studies, filter) => studies.filter(filter),
    baseStudies
  );

  const countryStudyGroups = R.groupBy(
    (study: TreatmentStudy) => `${study.ISO2}`,
    studies
  );

  const groups: Data[] = R.flatten(
    Object.entries(countryStudyGroups).map(([country, countryStudies]) => {
      const countrySpeciesGroup = R.groupBy(
        (study: TreatmentStudy) => `${study.DRUG_NAME}`,
        countryStudies
      );
      const entries = Object.entries(countrySpeciesGroup);
      return entries
        .map(([drug, countrySpeciesStudies]) => {
          const yearSortedStudies = countrySpeciesStudies
            .map((study: TreatmentStudy) => parseInt(study.YEAR_START))
            .sort();
          const minYear = yearSortedStudies[0];
          const maxYear = yearSortedStudies[yearSortedStudies.length - 1];

          const prop = "TREATMENT_FAILURE_KM";

          const values = countrySpeciesStudies
            .map((study: TreatmentStudy) => parseFloat(study[prop]))
            .filter((value) => !Number.isNaN(value));
          const sortedValues = values.sort();

          const min = values.length ? sortedValues[0] : "-";
          const max = values.length ? sortedValues[values.length - 1] : "-";
          const median = values.length ? R.median(sortedValues) : "-";
          const percentile25 = values.length
            ? percentile(sortedValues, 0.25)
            : "-";
          const percentile75 = values.length
            ? percentile(sortedValues, 0.75)
            : "-";

          return {
            ID: `${country}_${drug}`,
            DRUG: t(drug),
            ISO2: country,
            COUNTRY: t(country),
            COUNTRY_NUMBER: entries.length,
            FOLLOW_UP: 0,
            STUDY_YEARS: `${minYear} - ${maxYear}`,
            NUMBER_OF_STUDIES: countrySpeciesStudies.length,
            MEDIAN: median,
            MIN: min,
            MAX: max,
            PERCENTILE_25: percentile25,
            PERCENTILE_75: percentile75,
          };
        })
        .sort(getComparator(order, orderBy));
    })
  );

  const downloadData = () => {
    const studies = R.map((group) => {
      const study = { ...group };
      delete study.ID;
      delete study.COUNTRY_NUMBER;
      return study;
    }, groups);
    const tabs = [
      {
        name: "Data",
        studies: studies,
      },
    ];
    const dateString = format(new Date(), "yyyyMMdd");
    exportToCSV(tabs, `MTM_TREATMENT_${dateString}`);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setPage(0);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = groups.map((n) => n.ID);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const sortedGroups = R.sort(
    (a, b) => (t(a.COUNTRY) < t(b.COUNTRY) ? -1 : 1),
    groups
  );

  const tablePage = stableSort(
    sortedGroups,
    getComparator(order, orderBy)
  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const rows: Data[] = tablePage.map((row) => ({
    ...row,
    COUNTRY_NUMBER: tablePage.filter((r) => r.COUNTRY === row.COUNTRY).length,
  }));

  const filterColumnsToDisplay = ([field, value]: [string, string]) =>
    !["ID", "COUNTRY", "COUNTRY_NUMBER", "ISO2"].includes(field);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.wrapper}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            countries={countries}
            setCountries={setCountries}
            drugs={drugs}
            setDrugs={setDrugs}
            plasmodiumSpecie={plasmodiumSpecie}
            setPlasmodiumSpecie={setPlasmodiumSpecie}
            onClick={() => downloadData()}
          />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={"small"}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={groups.length}
              />
              <TableBody>
                {rows.map((row, index) => {
                  const isItemSelected = isSelected(row.ID);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      tabIndex={-1}
                      key={row.ID}
                      selected={isItemSelected}
                    >
                      {(index === 0 ||
                        tablePage[index].ISO2 !==
                          tablePage[index - 1].ISO2) && (
                        <>
                          <StyledCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            rowSpan={row.COUNTRY_NUMBER}
                          >
                            {row.COUNTRY}
                          </StyledCell>
                        </>
                      )}
                      {Object.entries(row)
                        .filter(filterColumnsToDisplay)
                        .map(([field, value]) => {
                          const header = headCells.find(
                            (cell) => cell.id === field
                          );
                          const number = Number(value);
                          const isNumber = !Number.isNaN(number);
                          return (
                            <StyledCell
                              key={`${field}_${index}`}
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                              isRight={header.align === "right"}
                              divider={header.divider}
                            >
                              {header && header.numeric && isNumber
                                ? `${number.toFixed(
                                    header.decimalPositions | 0
                                  )}`
                                : value || "-"}
                            </StyledCell>
                          );
                        })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 20]}
            component="div"
            count={groups.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </div>
      </Paper>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(TreatmentReport);
