import ReactGA from "react-ga";

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
            ReactGA.pageview(data.path);
            break;
        case "outboundLink":
            ReactGA.outboundLink({ label: data.label }, () => {});
            break;
    }
}
