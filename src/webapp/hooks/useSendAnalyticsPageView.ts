import { useEffect } from "react";
import { sendAnalytics } from "../utils/analytics";

export function useSendAnalyticsPageView(path: string) {
    useEffect(() => {
        sendAnalytics({ type: "pageView", path });
    });
}
