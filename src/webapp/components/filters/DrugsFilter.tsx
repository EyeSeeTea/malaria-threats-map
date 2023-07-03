import React from "react";
import { connect } from "react-redux";
import { State } from "../../store/types";
import { selectDrugs } from "../../store/reducers/translations-reducer";
import { selectTreatmentFilters, selectTreatmentStudies } from "../../store/reducers/treatment-reducer";
import { setTreatmentDrug, setTreatmentDrugs } from "../../store/actions/treatment-actions";
import {
    filterByDimensionId,
    filterByPlasmodiumSpecies,
    filterByRegion,
    filterByYearRange,
    filterByManyPlasmodiumSpecies,
} from "../../components/layers/studies-filters";
import { selectFilters, selectRegion } from "../../store/reducers/base-reducer";
import * as R from "ramda";
import { logEventAction } from "../../store/actions/base-actions";
import { TreatmentStudy } from "../../../domain/entities/TreatmentStudy";
import SingleFilter from "./common/SingleFilter";
import { useTranslation } from "react-i18next";
import { OptionType } from "../BasicSelect";
import MultiFilter from "./common/MultiFilter";

const mapStateToProps = (state: State) => ({
    drugs: selectDrugs(state),
    studies: selectTreatmentStudies(state),
    yearFilter: selectFilters(state),
    treatmentFilters: selectTreatmentFilters(state),
    region: selectRegion(state),
});

const mapDispatchToProps = {
    setDrug: setTreatmentDrug,
    setDrugs: setTreatmentDrugs,
    logEventAction: logEventAction,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
type OwnProps = {
    isMulti?: boolean;
};
type Props = DispatchProps & StateProps & OwnProps;

const DrugsFilter: React.FC<Props> = ({
    setDrug,
    setDrugs,
    treatmentFilters,
    studies,
    yearFilter,
    region,
    isMulti = false,
}) => {
    const { t } = useTranslation();

    const filters = isMulti
        ? [
              filterByDimensionId(300),
              filterByManyPlasmodiumSpecies(treatmentFilters.plasmodiumSpeciesArray),
              filterByYearRange(yearFilter),
              filterByRegion(region),
          ]
        : [
              filterByDimensionId(256),
              filterByPlasmodiumSpecies(treatmentFilters.plasmodiumSpecies),
              filterByYearRange(yearFilter),
              filterByRegion(region),
          ];

    const filteredStudies: TreatmentStudy[] = filters.reduce((studies, filter) => studies.filter(filter), studies);

    const uniques = R.uniq(R.map(R.prop("DRUG_NAME"), filteredStudies)).map(value => value.replace(".", "%2E"));

    const suggestions: OptionType[] = uniques.map((drug: string) => ({
        label: drug,
        value: drug,
    }));

    return isMulti ? (
        <MultiFilter
            placeholder={t("common.filters.select_drugs")}
            options={
                treatmentFilters.mapType === 1
                    ? suggestions.filter((drug: OptionType) => drug.label !== "DRUG_AQ+SP" && drug.label !== "DRUG_AP")
                    : suggestions
            }
            onChange={setDrugs}
            value={treatmentFilters.drugs}
            analyticsMultiFilterAction={"drug"}
            isClearable={true}
        />
    ) : (
        <SingleFilter
            label={t("common.filters.drug")}
            options={
                treatmentFilters.mapType === 1
                    ? suggestions.filter((drug: OptionType) => drug.label !== "DRUG_AQ+SP" && drug.label !== "DRUG_AP")
                    : suggestions
            }
            onChange={setDrug}
            value={treatmentFilters.drug}
            analyticsFilterAction={"drug"}
            isClearable={false}
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(DrugsFilter);
