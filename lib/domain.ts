export type PassportKind = "5y" | "10y";
export type GosuslugiAccess = "yes" | "none" | "cant-login";
export type ActivityKind = "work" | "study" | "service" | "unemployed";
export type Activity = { id: string; kind: ActivityKind; from: string; to: string; current: boolean; organization: string; position: string; address: string };
export type Draft = {
  consent: boolean; passportKind: PassportKind | ""; gosuslugiAccess:GosuslugiAccess|""; lastName: string; firstName: string; middleName: string; noMiddleName: boolean;
  gender: "male" | "female" | ""; birthDate: string; birthPlace: string; changedName: "yes" | "no" | ""; previousName: string; changeDate: string; changePlace: string;
  registeredAddress: string; registrationDate: string; livesAtRegistration: "yes" | "no" | ""; actualAddress: string; phone: string; email: string;
  internalSeries: string; internalNumber: string; internalIssueDate: string; internalIssuer: string; reason: "first" | "additional" | "replace" | "lost" | "damaged" | "";
  hasForeignPassport: "yes" | "no" | ""; foreignSeries: string; foreignNumber: string; foreignIssueDate: string; foreignIssuer: string; foreignLost: boolean; foreignForCancellation: boolean;
  restriction: "yes" | "no" | ""; restrictionDetails: string; secretAccess: "yes" | "no" | ""; secretDetails: string; contractualRestriction: "yes" | "no" | ""; contractDetails: string;
  photoAcknowledged: boolean;
  activities: Activity[];
};
export const EMPTY_DRAFT: Draft = {
  consent:false,passportKind:"",gosuslugiAccess:"",lastName:"",firstName:"",middleName:"",noMiddleName:false,gender:"",birthDate:"",birthPlace:"",changedName:"",previousName:"",changeDate:"",changePlace:"",
  registeredAddress:"",registrationDate:"",livesAtRegistration:"",actualAddress:"",phone:"",email:"",internalSeries:"",internalNumber:"",internalIssueDate:"",internalIssuer:"",reason:"",
  hasForeignPassport:"",foreignSeries:"",foreignNumber:"",foreignIssueDate:"",foreignIssuer:"",foreignLost:false,foreignForCancellation:false,restriction:"",restrictionDetails:"",secretAccess:"",secretDetails:"",contractualRestriction:"",contractDetails:"",photoAcknowledged:false,activities:[],
};
