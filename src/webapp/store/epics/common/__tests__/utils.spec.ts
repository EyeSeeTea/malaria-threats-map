import { createPreventionStudy } from "../../../../../domain/entities/__fixtures__/studyFixtures";
import { NOT_AVAILABLE, NOT_REPORTED } from "../../../../../domain/entities/__fixtures__/studyValues";
import { PreventionStudy } from "../../../../../domain/entities/PreventionStudy";
import { setFiltersAction, setMaxMinYearsAction } from "../../../actions/base-actions";
import createRootReducer from "../../../reducers";
import { CitationDataSource } from "../../../SelectionData";
import { MapTheme, State } from "../../../types";
import { createCitationDataSources, createCurations, resetDatesRequired, selectDataSourcesByStudies } from "../utils";

const PREVENTION = "prevention";
const INVASIVE = "invasive";
const TREATMENT = "treatment";
const URL = "https://example.org/citation";
const OTHER_URL = "https://example.org/other";
const CITATION_LONG = "Long citation";
const CITATION = "Short citation";
const INSTITUTION = "Institution";
const INSTITUTE = "Institute";
const CITY = "Ouagadougou";
const CURATION = "Curation";
const INSTITUTE_CURATION = "Institute curation";

/** A study whose citation fields are all empty except the given ones. */
const citedStudy = (overrides: Partial<PreventionStudy> = {}) =>
    createPreventionStudy({
        CITATION_URL: NOT_AVAILABLE,
        CITATION_LONG: NOT_AVAILABLE,
        CITATION: NOT_AVAILABLE,
        INSTITUTION: NOT_AVAILABLE,
        INSTITUTE: NOT_AVAILABLE,
        INSTITUTION_CITY: undefined,
        INSTITUTE_CURATION: undefined,
        CURATION: NOT_AVAILABLE,
        ...overrides,
    });

const dataSource = (key: string, text: string, url: string | null = null): CitationDataSource => ({ key, url, text });

describe("side panel shared functions", () => {
    describe("createCitationDataSources", () => {
        describe("a study with a URL", () => {
            it("takes the long citation and the institution city as text", () => {
                const studies = [
                    citedStudy({ CITATION_URL: URL, CITATION_LONG: CITATION_LONG, INSTITUTION_CITY: CITY }),
                ];

                expect(createCitationDataSources(PREVENTION, studies)).toEqual([
                    dataSource("a", `${CITATION_LONG}, ${CITY}`, URL),
                ]);
            });

            it.each([
                ["the citation", { CITATION: CITATION }, CITATION],
                ["the institution", { INSTITUTION: INSTITUTION }, INSTITUTION],
                ["the URL itself", {}, URL],
            ])("falls back to %s when the fields before it are empty", (_case, overrides, text) => {
                const studies = [citedStudy({ CITATION_URL: URL, ...overrides })];

                expect(createCitationDataSources(PREVENTION, studies)).toEqual([dataSource("a", text, URL)]);
            });

            it("trims the citation", () => {
                const studies = [citedStudy({ CITATION_URL: URL, CITATION_LONG: `  ${CITATION_LONG}  ` })];

                expect(createCitationDataSources(PREVENTION, studies)).toEqual([dataSource("a", CITATION_LONG, URL)]);
            });

            it("treats NR like an empty value", () => {
                const studies = [citedStudy({ CITATION_URL: URL, CITATION_LONG: NOT_REPORTED, CITATION: CITATION })];

                expect(createCitationDataSources(PREVENTION, studies)).toEqual([dataSource("a", CITATION, URL)]);
            });
        });

        describe("a study without a URL", () => {
            it("takes the long citation, or the institute when it is empty, on prevention", () => {
                const studies = [
                    citedStudy({ CITATION_LONG: CITATION_LONG, INSTITUTE: INSTITUTE }),
                    citedStudy({ INSTITUTE: INSTITUTE }),
                ];

                expect(createCitationDataSources(PREVENTION, studies)).toEqual([
                    dataSource("a", CITATION_LONG),
                    dataSource("b", INSTITUTE),
                ]);
            });

            it("takes the short citation on invasive", () => {
                const studies = [citedStudy({ CITATION_LONG: CITATION_LONG, CITATION: CITATION })];

                expect(createCitationDataSources(INVASIVE, studies)).toEqual([dataSource("a", CITATION)]);
            });

            it("takes the institution on treatment", () => {
                const studies = [citedStudy({ CITATION_LONG: CITATION_LONG, INSTITUTION: INSTITUTION })];

                expect(createCitationDataSources(TREATMENT, studies)).toEqual([dataSource("a", INSTITUTION)]);
            });

            it("drops the study when every citation field is empty", () => {
                expect(createCitationDataSources(PREVENTION, [citedStudy()])).toEqual([]);
            });
        });

        it("keeps one source per text and URL, keyed a, b, c in the order of the studies", () => {
            const studies = [
                citedStudy({ CITATION_URL: URL, CITATION_LONG: CITATION_LONG }),
                citedStudy({ CITATION_LONG: CITATION }),
                citedStudy({ CITATION_URL: URL, CITATION_LONG: CITATION_LONG }),
                citedStudy({ CITATION_URL: OTHER_URL, CITATION_LONG: CITATION_LONG }),
            ];

            expect(createCitationDataSources(PREVENTION, studies)).toEqual([
                dataSource("a", CITATION_LONG, URL),
                dataSource("b", CITATION),
                dataSource("c", CITATION_LONG, OTHER_URL),
            ]);
        });

        // Pins today's behaviour, a possible bug pending a decision: a site with more than 26 sources
        // shows the 27th without a letter.
        it("gives no key to the 27th source, because the keys are the 26 letters", () => {
            const studies = Array.from({ length: 27 }, (_value, index) =>
                citedStudy({ CITATION_LONG: `source ${index}` })
            );

            const keys = createCitationDataSources(PREVENTION, studies).map(source => source.key);

            expect(keys.slice(24)).toEqual(["y", "z", undefined]);
        });
    });

    describe("selectDataSourcesByStudies", () => {
        const dataSources = [
            dataSource("a", CITATION_LONG, URL),
            dataSource("b", CITATION),
            dataSource("c", INSTITUTE),
            dataSource("d", INSTITUTION),
        ];

        it("matches a study by its URL", () => {
            expect(selectDataSourcesByStudies(dataSources, [citedStudy({ CITATION_URL: URL })])).toEqual(["a"]);
        });

        it.each([
            ["the short citation", { CITATION: CITATION }, "b"],
            ["the long citation", { CITATION_LONG: CITATION }, "b"],
            ["the institute", { INSTITUTE: INSTITUTE }, "c"],
            ["the institution", { INSTITUTION: INSTITUTION }, "d"],
        ])("matches a study without a URL by %s", (_case, overrides, key) => {
            expect(selectDataSourcesByStudies(dataSources, [citedStudy(overrides)])).toEqual([key]);
        });

        it("returns each key once, sorted, and skips the studies that match nothing", () => {
            const studies = [
                citedStudy({ INSTITUTION: INSTITUTION }),
                citedStudy({ CITATION_URL: URL }),
                citedStudy({ INSTITUTION: INSTITUTION }),
                citedStudy(),
            ];

            expect(selectDataSourcesByStudies(dataSources, studies)).toEqual(["a", "d"]);
        });

        // Pins today's behaviour, a possible bug pending a decision: two sources with the same link and
        // different texts both get listed, but every study with that link shows the first letter.
        it("gives two sources with the same URL the key of the first one", () => {
            const sameUrlSources = [dataSource("a", CITATION_LONG, URL), dataSource("b", CITATION, URL)];
            const studies = [citedStudy({ CITATION_URL: URL, CITATION_LONG: CITATION })];

            expect(selectDataSourcesByStudies(sameUrlSources, studies)).toEqual(["a"]);
        });
    });

    describe("createCurations", () => {
        const dataSources = [dataSource("a", CITATION), dataSource("b", INSTITUTE)];

        it("lists each curation once, with the keys of the sources of its studies", () => {
            const studies = [
                citedStudy({ CURATION: CURATION, CITATION: CITATION }),
                citedStudy({ INSTITUTE_CURATION: INSTITUTE_CURATION, INSTITUTE: INSTITUTE }),
                citedStudy({ CURATION: CURATION, INSTITUTE: INSTITUTE }),
            ];

            expect(createCurations(dataSources, studies)).toEqual([
                { text: CURATION, dataSources: ["a", "b"] },
                { text: INSTITUTE_CURATION, dataSources: ["b"] },
            ]);
        });

        it("prefers the institute curation to the curation", () => {
            const studies = [citedStudy({ INSTITUTE_CURATION: INSTITUTE_CURATION, CURATION: CURATION })];

            expect(createCurations(dataSources, studies)).toEqual([{ text: INSTITUTE_CURATION, dataSources: [] }]);
        });

        // Pins today's behaviour, a possible bug pending a decision: a curation is hidden when its
        // institute curation is NA.
        it("drops the curation when the institute curation is NA, even if the curation has a value", () => {
            const studies = [citedStudy({ INSTITUTE_CURATION: NOT_AVAILABLE, CURATION: CURATION })];

            expect(createCurations(dataSources, studies)).toEqual([]);
        });
    });

    describe("resetDatesRequired", () => {
        const START = 2005;
        const END = 2024;
        const FILTER_START = 2010;
        const minMaxYears = (): [number, number] => [START, END];

        const stateWith = (theme: MapTheme, filters: number[], maxMinYears: number[]): State => {
            const initial = createRootReducer()(undefined, { type: "@@INIT" });
            return { ...initial, malaria: { ...initial.malaria, theme, filters, maxMinYears } };
        };

        it("returns nothing when the state is on another theme", () => {
            const state = stateWith(INVASIVE, [1990, END], [1990, END]);

            expect(resetDatesRequired({ minMaxYears, theme: PREVENTION, state })).toEqual([]);
        });

        it("resets both ranges when neither starts at the studies' first year", () => {
            const state = stateWith(PREVENTION, [1990, END], [1990, END]);

            expect(resetDatesRequired({ minMaxYears, theme: PREVENTION, state })).toEqual([
                setMaxMinYearsAction([START, END]),
                setFiltersAction([START, END]),
            ]);
        });

        it("starts the filter at filterStart when it is given", () => {
            const state = stateWith(PREVENTION, [1990, END], [1990, END]);

            expect(resetDatesRequired({ minMaxYears, theme: PREVENTION, state, filterStart: FILTER_START })).toEqual([
                setMaxMinYearsAction([START, END]),
                setFiltersAction([FILTER_START, END]),
            ]);
        });

        it.each([
            ["the filter", [START, END], [1990, END]],
            ["the max-min range", [1990, END], [START, END]],
        ])("returns nothing when %s already starts at the studies' first year", (_case, filters, maxMinYears) => {
            const state = stateWith(PREVENTION, filters, maxMinYears);

            expect(resetDatesRequired({ minMaxYears, theme: PREVENTION, state })).toEqual([]);
        });
    });
});
