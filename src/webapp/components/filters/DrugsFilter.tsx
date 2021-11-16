import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectDrugs } from "../../store/reducers/translations-reducer";
import { selectTreatmentFilters, selectTreatmentStudies } from "../../store/reducers/treatment-reducer";
import { setTreatmentDrug } from "../../store/actions/treatment-actions";
import {
    filterByDimensionId,
    filterByPlasmodiumSpecies,
    filterByRegion,
    filterByYearRange,
} from "../../components/layers/studies-filters";
import { selectFilters, selectRegion } from "../../store/reducers/base-reducer";
import * as R from "ramda";
import { logEventAction } from "../../store/actions/base-actions";
import { TreatmentStudy } from "../../../domain/entities/TreatmentStudy";
import SingleFilter from "./common/SingleFilter";
import { useTranslation } from "react-i18next";

const mapStateToProps = (state: State) => ({
    drugs: selectDrugs(state),
    studies: selectTreatmentStudies(state),
    yearFilter: selectFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    region: selectRegion(state),
});

const mapDispatchToProps = {
    setDrug: setTreatmentDrug,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type Props = DispatchProps & StateProps;

const DrugsFilter: React.FC<Props> = ({ setDrug, treatmentFilters, studies, yearFilter, region }) => {
    const { t } = useTranslation();

    const filters = [
        filterByDimensionId(256),
        filterByPlasmodiumSpecies(treatmentFilters.plasmodiumSpecies),
        filterByYearRange(yearFilter),
        filterByRegion(region),
    ];

    const filteredStudies: TreatmentStudy[] = filters.reduce((studies, filter) => studies.filter(filter), studies);

    const uniques = R.uniq(R.map(R.prop("DRUG_NAME"), filteredStudies)).map(value => value.replace(".", "%2E"));

    const suggestions: any[] = uniques
        .filter((drug: string) => drug !== "DRUG_AQ+SP" && drug !== "DRUG_AP")
        .map((drug: string) => ({
            label: drug,
            value: drug,
        }));

    return (
        <SingleFilter
            label={t("common.filters.drug")}
            options={suggestions}
            onChange={setDrug}
            value={treatmentFilters.drug}
            analyticsFilterAction={"drug"}
            isClearable={false}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(DrugsFilter);
