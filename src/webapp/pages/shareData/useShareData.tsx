import { useEffect, useState } from "react";
import { useAppContext } from "../../context/app-context";
import { ShareDataContent } from "../../../domain/entities/ShareDataContent";

export function useShareData() {
    const { compositionRoot } = useAppContext();
    const [shareData, setShareData] = useState<ShareDataContent>({ surveyLinks: [] });

    useEffect(() => {
        compositionRoot.shareData.get().run(
            data => {
                setShareData(data);
            },
            () => {
                setShareData({ surveyLinks: [] });
            }
        );
    }, [compositionRoot]);

    return {
        shareData,
    };
}
