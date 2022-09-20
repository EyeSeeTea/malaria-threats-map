import html2canvas from "html2canvas";

export function downloadHtmlElement(element: HTMLDivElement, name: string) {
    if (element === null) {
        return;
    }

    html2canvas(element).then(canvas => {
        const link = document.createElement("a");
        link.download = name;
        link.href = canvas.toDataURL();
        link.click();
    });
}
