import type { PassportKind } from "./domain";
export const FORMS = {
  "passport-5y-186": { id:"passport-5y-186", kind:"5y" as PassportKind, status:"CURRENT" as const, order:"Приказ МВД России от 31.03.2021 №186", title:"Паспорт на 5 лет" },
  "passport-10y-996": { id:"passport-10y-996", kind:"10y" as PassportKind, status:"CURRENT" as const, order:"Приказ МВД России от 31.12.2019 №996", title:"Биометрический паспорт на 10 лет" },
  "passport-future-83": { id:"passport-future-83", kind:null, status:"FUTURE_DISABLED" as const, order:"Приказ МВД России от 24.02.2026 №83", title:"Будущая форма" },
} as const;
export function getCurrentForm(kind: PassportKind) { return kind === "5y" ? FORMS["passport-5y-186"] : FORMS["passport-10y-996"]; }
export function canSelectForm(id: keyof typeof FORMS) { return FORMS[id].status === "CURRENT"; }
