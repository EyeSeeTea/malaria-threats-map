export enum INVASIVE_STATUS {
  INVASIVE = "invasive",
  NATIVE = "native",
  UNKNOWN = "UNKNOWN"
}

const translations: any = {
  english: [
    "Jan.",
    "Feb.",
    "Mar.",
    "Apr.",
    "May",
    "June",
    "July",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec."
  ],
  spanish: [
    "Enero",
    "Feb.",
    "Marzo",
    "Abr.",
    "Mayo",
    "Jun.",
    "Jul.",
    "Agosto",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec"
  ],
  french: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc."
  ]
};

export const getMonthFromNumber = (
  month: number,
  language: string = "english"
) => translations[language][month - 1];
