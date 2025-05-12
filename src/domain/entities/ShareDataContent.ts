export type ShareDataContent = {
    surveyLinks: SurveyLink[];
};

type SurveyLink = {
    id: string;
    name: string;
    link: string;
};
