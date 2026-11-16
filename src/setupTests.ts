import i18next from "i18next";

// No resources: t(key) returns the key, so assertions do not depend on the language files.
i18next.init({ lng: "en", resources: {}, initImmediate: false });
