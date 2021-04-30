export const dispatchCustomEvent = (event: string) => {
  if (
    navigator.userAgent.indexOf("MSIE") !== -1 ||
    navigator.appVersion.indexOf("Trident/") > 0
  ) {
    const evt = document.createEvent("UIEvents");
    evt.initEvent(event, true, false);
    window.dispatchEvent(evt);
  } else {
    window.dispatchEvent(new Event(event));
  }
};
