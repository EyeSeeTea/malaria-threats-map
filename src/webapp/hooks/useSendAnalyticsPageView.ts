import { useEffect } from "react";
import { sendAnalytics } from "../utils/analytics";
import { useLocation } from "react-router-dom";

export function useSendAnalyticsPageView(path?: string) {
    const location = useLocation();

    useEffect(() => {
        const finalPath = path || location.pathname.substring(1);

        sendAnalytics({ type: "pageView", path: finalPath });
    }, [location.pathname, path]);
}
