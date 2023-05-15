import { toPng } from "html-to-image";

export function downloadHtmlElement(element: HTMLDivElement, name: string) {
    if (element === null) {
        return;
    }

    const filter = (element: HTMLElement) => {
        const exclusionClasses = ["dashboard-action"];

        return (
            element.classList === undefined ||
            !exclusionClasses.some(classname => element.classList.contains(classname))
        );
    };

    toPng(element, { backgroundColor: "#F7F7F7", filter: filter, skipAutoScale: true })
        .then(dataUrl => {
            const link = document.createElement("a");
            link.download = name;
            link.href = dataUrl;
            link.click();
        })
        .catch(err => {
            console.log(err);
        });
}
