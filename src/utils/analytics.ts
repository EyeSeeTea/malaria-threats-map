import ReactGA from "react-ga";

export type AnalyticsData = Event | PageView;

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

export function sendAnalytics(data: AnalyticsData) {
    switch (data.type) {
        case "event":
            ReactGA.event({ category: data.category, action: data.action, label: data.label });
            break;
        case "pageView":
            ReactGA.pageview(data.path);
            break;
    }
}
