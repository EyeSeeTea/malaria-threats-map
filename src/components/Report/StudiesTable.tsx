import React from "react";
import clsx from "clsx";
import {
  createStyles,
  lighten,
  makeStyles,
  Theme
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
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
import { State } from "../../store/types";
import { selectPreventionStudies } from "../../store/reducers/prevention-reducer";
import { PreventionStudy } from "../../types/Prevention";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
  COLUMNS,
  Data,
  ERROR_COLUMNS,
  GREY_COLUMNS,
  headCells
} from "./columns";
import { resolvePyrethroids } from "./resolvers/resistanceStatus";
import { resolveMechanism } from "./resolvers/resistanceMechanism";
import FilterPopover from "./FilterPopover";
import { filterByCountries, filterBySpecies } from "../layers/studies-filters";
import { exportToCSV } from "../DataDownload/download";
import { Button } from "@material-ui/core";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  // stabilizedThis.sort((a, b) => {
  //   const order = comparator(a[0], b[0]);
  //   if (order !== 0) return order;
  //   return a[1] - b[1];
  // });
  return stabilizedThis.map(el => el[0]);
}

const StyledCell = styled(TableCell)<{
  isBold?: boolean;
  color?: string;
  isRight?: boolean;
}>`
  font-size: ${props => (props.isBold ? "13px" : "12px")} !important;
  line-height: 1rem !important;
  padding: 6px 10px !important;
  font-weight: ${props => (props.isBold ? "bold" : "normal")} !important;
  color: ${props => props.color || "inherit"} !important;
  ${props => props.isRight && "text-align: right !important"};
`;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    paper: {
      width: "100%"
    },
    wrapper: {
      padding: theme.spacing(2)
    },
    table: {
      minWidth: 750
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1
    },
    cell: {
      fontSize: 10
    }
  })
);

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
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
        <StyledCell isBold colSpan={2} />
        <StyledCell isBold colSpan={8}>
          Resistance status
        </StyledCell>
        <StyledCell isBold colSpan={7}>
          Resistance mechanisms
        </StyledCell>
      </TableRow>
      <TableRow>
        <StyledCell isBold colSpan={2}>
          Insecticide classes to which vector resistance confirmed
        </StyledCell>
        <StyledCell isBold colSpan={2}>
          Pyrethroids
        </StyledCell>
        <StyledCell isBold colSpan={2}>
          Organochlorines
        </StyledCell>
        <StyledCell isBold colSpan={2}>
          Carbamates
        </StyledCell>
        <StyledCell isBold colSpan={2}>
          Organophosphates
        </StyledCell>
        <StyledCell isBold colSpan={3}>
          Metabolic
        </StyledCell>
        <StyledCell isBold colSpan={4}>
          Target site
        </StyledCell>
      </TableRow>
      <TableRow>
        {/*<StyledCell padding="checkbox">*/}
        {/*  <Checkbox*/}
        {/*    indeterminate={numSelected > 0 && numSelected < rowCount}*/}
        {/*    checked={rowCount > 0 && numSelected === rowCount}*/}
        {/*    onChange={onSelectAllClick}*/}
        {/*    inputProps={{ "aria-label": "select all desserts" }}*/}
        {/*  />*/}
        {/*</StyledCell>*/}
        {headCells.map(headCell => (
          <StyledCell
            key={headCell.id}
            align={headCell.align || "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={
                  headCell.sortable ? createSortHandler(headCell.id) : () => {}
                }
              >
                {headCell.label}
                {headCell.sortable && orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
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
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1)
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          },
    title: {
      flex: "1 1 100%"
    },
    button: {
      margin: theme.spacing(1),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4)
    }
  })
);

interface EnhancedTableToolbarProps {
  numSelected: number;
  countries: string[];
  setCountries: any;
  species: string[];
  setSpecies: any;
  onClick: any;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles({});
  const {
    numSelected,
    countries,
    setCountries,
    species,
    setSpecies,
    onClick
  } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
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
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Global Report
        </Typography>
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
            Download
          </Button>
          <FilterPopover
            countries={countries}
            setCountries={setCountries}
            species={species}
            setSpecies={setSpecies}
          />
        </>
      )}
    </Toolbar>
  );
};

const mapStateToProps = (state: State) => ({
  studies: selectPreventionStudies(state)
});
const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {};
type Props = StateProps & OwnProps & DispatchProps;

function StudiesTable({ studies: baseStudies }: Props) {
  const classes = useStyles({});
  const { t } = useTranslation("common");
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>(
    "PYRETHROIDS_PERCENTAGE"
  );
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [countries, setCountries] = React.useState<string[]>([]);
  const [species, setSpecies] = React.useState<string[]>([]);

  const filters = [filterByCountries(countries), filterBySpecies(species)];

  const studies = filters.reduce(
    (studies, filter) => studies.filter(filter),
    baseStudies
  );

  const countryStudyGroups = R.groupBy(
    (study: PreventionStudy) => `${study.ISO2}`,
    studies
  );

  const groups: Data[] = R.flatten(
    Object.entries(countryStudyGroups).map(([country, countryStudies]) => {
      const countrySpeciesGroup = R.groupBy(
        (study: PreventionStudy) => `${study.SPECIES}`,
        countryStudies
      );
      const entries = Object.entries(countrySpeciesGroup);
      return entries
        .map(([species, countrySpeciesStudies]) => {
          const {
            percentage: pyrethroidsPercentage,
            sorted: sortedPyrethroidsStudies,
            n: pyrethroidsStudies
          } = resolvePyrethroids("PYRETHROIDS", countrySpeciesStudies, t);
          const {
            percentage: organochlorinesPercentage,
            sorted: sortedOrganochlorinesStudies,
            n: organochlorinesStudies
          } = resolvePyrethroids("ORGANOCHLORINES", countrySpeciesStudies, t);
          const {
            percentage: carbamatesPercentage,
            sorted: sortedCarbamatesStudies,
            n: carbamatesStudies
          } = resolvePyrethroids("CARBAMATES", countrySpeciesStudies, t);
          const {
            percentage: organophosphatesPercentage,
            sorted: sortedOrganophosphatesStudies,
            n: organophosphatesStudies
          } = resolvePyrethroids("ORGANOPHOSPHATES", countrySpeciesStudies, t);

          const {
            percentage: monoOxygenases,
            n: monoOxygenasesNumber
          } = resolveMechanism("MONO_OXYGENASES", countrySpeciesStudies);
          const {
            percentage: esterases,
            n: esterasesNumber
          } = resolveMechanism("ESTERASES", countrySpeciesStudies);
          const { percentage: gsts, n: gstsNumber } = resolveMechanism(
            "GSTS",
            countrySpeciesStudies
          );
          const {
            percentage: kdrL1014s,
            n: kdrL1014sNumber
          } = resolveMechanism("KDR_L1014S", countrySpeciesStudies);
          const {
            percentage: kdrL1014f,
            n: kdrL1014fNumber
          } = resolveMechanism("KDR_L1014F", countrySpeciesStudies);
          const {
            percentage: kdrUnspecified,
            n: kdrUnspecifiedNumber
          } = resolveMechanism(
            "KDR_(MUTATION_UNSPECIFIED)",
            countrySpeciesStudies
          );
          const { percentage: ace1r, n: ace1rNumber } = resolveMechanism(
            "ACE1R",
            countrySpeciesStudies
          );

          return {
            ID: `${country}_${species}`,
            ISO2: country,
            COUNTRY: t(country),
            COUNTRY_NUMBER: entries.length,
            SPECIES: species,
            INSECTICIDE_CLASSES: " ",
            PYRETHROIDS_PERCENTAGE: pyrethroidsPercentage,
            PYRETHROIDS_YEARS: `${
              sortedPyrethroidsStudies.length
                ? sortedPyrethroidsStudies[0].YEAR_START
                : "-"
            }`,
            PYRETHROIDS_N: pyrethroidsStudies,
            ORGANOCHLORINES_PERCENTAGE: organochlorinesPercentage,
            ORGANOCHLORINES_YEARS: `${
              sortedOrganochlorinesStudies.length
                ? sortedOrganochlorinesStudies[0].YEAR_START
                : "-"
            }`,

            ORGANOCHLORINES_N: organochlorinesStudies,
            CARBAMATES_PERCENTAGE: carbamatesPercentage,
            CARBAMATES_YEARS: `${
              sortedCarbamatesStudies.length
                ? sortedCarbamatesStudies[0].YEAR_START
                : "-"
            }`,
            CARBAMATES_N: carbamatesStudies,
            ORGANOPHOSPHATES_PERCENTAGE: organophosphatesPercentage,
            ORGANOPHOSPHATES_YEARS: `${
              sortedOrganophosphatesStudies.length
                ? sortedOrganophosphatesStudies[0].YEAR_START
                : "-"
            }`,
            ORGANOPHOSPHATES_N: organophosphatesStudies,
            MONOOXYGENASES: monoOxygenases,
            MONOOXYGENASES_NUMBER: monoOxygenasesNumber,
            ESTERASES: esterases,
            ESTERASES_NUMBER: esterasesNumber,
            GSTS: gsts,
            GSTS_NUMBER: gstsNumber,
            K1014S: kdrL1014s,
            K1014S_NUMBER: kdrL1014sNumber,
            K1014F: kdrL1014f,
            K1014F_NUMBER: kdrL1014fNumber,
            KDR_UNSPECIFIED: kdrUnspecified,
            KDR_UNSPECIFIED_NUMBER: kdrUnspecifiedNumber,
            ACE1R: ace1r,
            ACE1R_NUMBER: ace1rNumber
          };
        })
        .sort(getComparator(order, orderBy));
    })
  );

  const downloadData = () => {
    const tabs = [
      {
        name: "Data",
        studies: groups
      }
    ];
    exportToCSV(tabs, "file");
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = groups.map(n => n.ID);
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

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, groups.length - page * rowsPerPage);

  const tablePage = stableSort(groups, getComparator(order, orderBy)).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const rows: Data[] = tablePage.map(row => ({
    ...row,
    COUNTRY_NUMBER: tablePage.filter(r => r.ISO2 === row.ISO2).length
  }));

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.wrapper}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            countries={countries}
            setCountries={setCountries}
            species={species}
            setSpecies={setSpecies}
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
                      role="checkbox"
                      tabIndex={-1}
                      key={row.ID}
                      selected={isItemSelected}
                    >
                      {(index === 0 ||
                        tablePage[index].ISO2 !==
                          tablePage[index - 1].ISO2) && (
                        <>
                          {/*<StyledCell*/}
                          {/*  padding="checkbox"*/}
                          {/*  rowSpan={row.COUNTRY_NUMBER}*/}
                          {/*>*/}
                          {/*  <Checkbox*/}
                          {/*    checked={isItemSelected}*/}
                          {/*    inputProps={{ "aria-labelledby": labelId }}*/}
                          {/*  />*/}
                          {/*</StyledCell>*/}
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
                        .filter(entry => !COLUMNS.includes(entry[0]))
                        .map((entry, index) => {
                          const number = Number(entry[1]);
                          const header = headCells.find(
                            cell => cell.id === entry[0]
                          );
                          const isNumber = !Number.isNaN(number);
                          const percentage = ERROR_COLUMNS.includes(entry[0]);
                          const cell = entry[0].split("_")[0];
                          const active = (row as any)[`${cell}_N`];
                          const error =
                            percentage &&
                            entry[0].indexOf("PERCENTAGE") > -1 &&
                            number > 0;
                          const grey = GREY_COLUMNS.includes(entry[0]);
                          const darkGrey =
                            grey && (row as any)[`${entry[0]}_NUMBER`] > 0
                              ? "dimgrey"
                              : "darkgray";
                          return (
                            <StyledCell
                              key={`${entry[0]}_${index}`}
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                              color={
                                error ? "red" : grey ? darkGrey : undefined
                              }
                              isRight={header.align === "right"}
                            >
                              {header && header.numeric && isNumber
                                ? `${number.toFixed(2)}% ${
                                    active ? `(${active})` : ""
                                  }`
                                : entry[1] || "-"}
                            </StyledCell>
                          );
                        })}
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 33 * emptyRows }}>
                    <StyledCell colSpan={2} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
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

export default connect(mapStateToProps, mapDispatchToProps)(StudiesTable);
