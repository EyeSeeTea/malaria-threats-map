import ReactGA from "react-ga";
import _ from "lodash";

/* Non-redux GA analytics helpers. For Redux, check for example the <Citation> component. Steps:
    - Import action.
    - Create mapDispatchToProps.
    - Add dispatch props to Props type.
    - Use redux connect with mapDispatchToProps.
    - Call dispatcher from props.
*/

export type AnalyticsData = Event | PageView | OutboundLink;

export interface Event {
    type: "event",
    category: string;
    action: string;
    label?: string,
}

export interface PageView {
    type: "pageView",
    path: string;
}

export interface OutboundLink {
    type: "outboundLink",
    label: string;
}

export function sendAnalytics(data: AnalyticsData) {
    switch (data.type) {
        case "event":
            ReactGA.event({ category: data.category, action: data.action, label: data.label });
            break;
        case "pageView":
            ReactGA.set({ page : data.path })
            ReactGA.pageview(data.path);
            if (window.hj) {
                const hotjarPath = getHotjarPath(data.path);
                window.hj('stateChange', hotjarPath);
            }
            break;
        case "outboundLink":
            ReactGA.outboundLink({ label: data.label }, () => {});
            break;
    }
}

export function sendMultiFilterAnalytics(
    action: string,
    prevValues: string[],
    newSelection: Array<{value: string}> | undefined
) {
    const currentValues = (newSelection || []).map(x => x.value);
    const newValues = _.difference(currentValues, prevValues);

    _(newValues).uniq().each(newValue => {
        sendAnalytics({ type: "event", category: "filter", action, label: newValue })
    })
}

function getHotjarPath(path: string) {
    const pathPrefix = window.location.pathname.replace(/^\//, "").replace(/\/$/, "");
    return pathPrefix ? (pathPrefix + "/" + path) : path;
}
