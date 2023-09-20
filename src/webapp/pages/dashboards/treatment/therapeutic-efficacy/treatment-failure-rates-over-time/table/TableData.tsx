type NumberOrHyphen = number | string;

export interface TableData {
    ID: string;
    ISO2: string;
    COUNTRY: string;
    COUNTRY_NUMBER: number;
    DRUG: string;
    FOLLOW_UP: NumberOrHyphen;
    STUDY_YEARS: string;
    NUMBER_OF_STUDIES: NumberOrHyphen;
    MEDIAN: NumberOrHyphen;
    MIN: NumberOrHyphen;
    MAX: NumberOrHyphen;
    PERCENTILE_25: NumberOrHyphen;
    PERCENTILE_75: NumberOrHyphen;
}
