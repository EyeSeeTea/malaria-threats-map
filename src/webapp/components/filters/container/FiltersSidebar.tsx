import React from "react";
import { AppBar, Toolbar, IconButton, Tabs, Tab, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import { FilterIconSimple, GlobeIcon } from "../../Icons";
import CloseIcon from "@material-ui/icons/ArrowBack";
import CountrySelector from "../CountrySelector";
import styled from "styled-components";
import { State } from "../../../store/types";
import { selectFiltersMode, selectLastUpdatedDates, selectTheme } from "../../../store/reducers/base-reducer";
import { selectFilteredPreventionStudies, selectPreventionFilters } from "../../../store/reducers/prevention-reducer";
import { selectDiagnosisFilters, selectFilteredDiagnosisStudies } from "../../../store/reducers/diagnosis-reducer";
import { selectFilteredTreatmentStudies, selectTreatmentFilters } from "../../../store/reducers/treatment-reducer";
import { selectFilteredInvasiveStudies, selectInvasiveFilters } from "../../../store/reducers/invasive-reducer";
import { setFiltersMode, setFiltersOpen } from "../../../store/actions/base-actions";
import { connect } from "react-redux";
import RegionSelector from "../../filters/RegionSelector";
import SubRegionSelector from "../../filters/SubRegionSelector";
import { SuccessSnackbar, WarningSnackbar } from "./Filters";
import { useTranslation } from "react-i18next";
import SiteSelector from "../../filters/SiteSelector";
import FiltersContent from "./FiltersContent";

const FiltersWrapper = styled.div`
    margin-top: 20px;
`;

const LastUpdatedContainer = styled.div`
    padding: 20px 20px 0 20px;
`;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        appBar: {
            transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        tab: {
            minWidth: 0,
        },
        title: {
            flexGrow: 1,
        },
    })
);
const mapStateToProps = (state: State) => ({
    theme: selectTheme(state),
    filteredPreventionStudies: selectFilteredPreventionStudies(state),
    filteredDiagnosisStudies: selectFilteredDiagnosisStudies(state),
    filteredTreatmentStudies: selectFilteredTreatmentStudies(state),
    filteredInvasiveStudies: selectFilteredInvasiveStudies(state),
    filtersMode: selectFiltersMode(state),
    preventionFilters: selectPreventionFilters(state),
    diagnosisFilters: selectDiagnosisFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    invasiveFilters: selectInvasiveFilters(state),
    lastUpdatedDates: selectLastUpdatedDates(state),
});
const mapDispatchToProps = {
    setFiltersOpen: setFiltersOpen,
    setFiltersMode: setFiltersMode,
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const tabs = ["filters", "regions"];

const FiltersSidebar = ({
    theme,
    filteredPreventionStudies,
    filteredDiagnosisStudies,
    filteredTreatmentStudies,
    filteredInvasiveStudies,
    filtersMode,
    setFiltersOpen,
    setFiltersMode,
    preventionFilters,
    lastUpdatedDates,
}: Props) => {
    const { t } = useTranslation("common");
    const classes = useStyles({});

    const filteredStudies = (() => {
        switch (theme) {
            case "prevention":
                return filteredPreventionStudies;
            case "diagnosis":
                return filteredDiagnosisStudies;
            case "treatment":
                return filteredTreatmentStudies;
            case "invasive":
                return filteredInvasiveStudies;
            default:
                return [];
        }
    })();

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setFiltersMode(tabs[newValue]);
    };

    const handleClose = () => {
        setFiltersOpen(false);
    };

    const value = tabs.indexOf(filtersMode);

    const themeSelector = theme as "prevention" | "diagnosis" | "treatment" | "invasive";
    return (
        <div id="sidebar">
            <AppBar position="static" className={classes.appBar}>
                <Toolbar variant="dense">
                    <Typography variant="subtitle1" className={classes.title}>
                        {t(`themes.${theme}`)}
                    </Typography>
                    <IconButton edge="start" color="inherit" onClick={handleClose} size={"small"} aria-label="close">
                        <CloseIcon fontSize={"small"} />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <AppBar position="static" color="inherit">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab
                        className={classes.tab}
                        icon={<FilterIconSimple />}
                        label={t(`filters.tabs.filters`)}
                        id={"filters-tab"}
                    />
                    <Tab
                        className={classes.tab}
                        icon={<GlobeIcon />}
                        label={t(`filters.tabs.regions`)}
                        id={"regions-tab"}
                    />
                </Tabs>
            </AppBar>
            {lastUpdatedDates[themeSelector] && (
                <LastUpdatedContainer>
                    <Typography variant="body2" display="block" gutterBottom>
                        <strong>Last Updated:</strong> {lastUpdatedDates[themeSelector].toLocaleDateString()}
                    </Typography>
                </LastUpdatedContainer>
            )}
            {(theme !== "prevention" || preventionFilters.mapType !== 4) && (
                <>
                    {!filteredStudies.length ? (
                        <WarningSnackbar>
                            <Typography variant="body2">{t(`filters.no_records`)}</Typography>
                        </WarningSnackbar>
                    ) : (
                        <SuccessSnackbar>
                            <Typography variant="body2">
                                {t(
                                    `filters.records.${theme}${
                                        theme === "prevention" ? `.${preventionFilters.mapType}` : ""
                                    }`,
                                    { studies: filteredStudies.length }
                                )}
                            </Typography>
                        </SuccessSnackbar>
                    )}
                </>
            )}
            <FiltersWrapper>
                {value === 0 ? (
                    <FiltersContent />
                ) : (
                    <>
                        <CountrySelector />
                        <RegionSelector />
                        <SubRegionSelector />
                        <SiteSelector />
                    </>
                )}
            </FiltersWrapper>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(FiltersSidebar);
