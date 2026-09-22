import type {Draft} from "./domain";
import {analyzeTimeline,monthLabel} from "./timeline";
import {ACTIVITY_STEP,PHOTO_STEP} from "./workflow";

export type ValidationIssue={id:string;message:string;step:number};
export function validateDraft(d:Draft,now=new Date()){
 const issues:ValidationIssue[]=[];
 const add=(id:string,message:string,step:number)=>issues.push({id,message,step});
 const req:[unknown,string,string,number][]=[
  [d.passportKind,"passport-kind","Выберите паспорт на 5 или 10 лет.",0],[d.lastName,"last-name","Укажите фамилию.",1],[d.firstName,"first-name","Укажите имя.",1],[d.gender,"gender","Укажите пол.",1],[d.birthDate,"birth-date","Укажите дату рождения.",1],[d.birthPlace,"birth-place","Укажите место рождения точно по паспорту.",1],
  [d.changedName,"changed-name","Ответьте, меняли ли вы ФИО.",2],[d.registeredAddress,"registered-address","Укажите адрес постоянной регистрации.",3],[d.registrationDate,"registration-date","Укажите дату регистрации.",3],[d.livesAtRegistration,"living-address","Укажите, живёте ли вы по адресу регистрации.",3],
  [d.internalIssueDate,"internal-date","Укажите дату выдачи внутреннего паспорта.",5],[d.internalIssuer,"internal-issuer","Укажите, кем выдан внутренний паспорт.",5],[d.reason,"reason","Выберите причину оформления.",6],[d.hasForeignPassport,"foreign-answer","Ответьте, есть ли действующий загранпаспорт.",7],
  [d.restriction,"restriction","Ответьте на вопрос об ограничениях права на выезд.",8],[d.secretAccess,"secret","Ответьте на вопрос о допуске к гостайне.",8],[d.contractualRestriction,"contract","Ответьте на вопрос о договорных обязательствах.",8],
 ];req.forEach(([v,id,m,s])=>{if(!v)add(id,m,s)});
 if(!d.noMiddleName&&!d.middleName.trim())add("middle-name","Укажите отчество или отметьте, что его нет.",1);
 if(!/^\d{4}$/.test(d.internalSeries))add("internal-series","Серия внутреннего паспорта должна состоять из 4 цифр.",5);
 if(!/^\d{6}$/.test(d.internalNumber))add("internal-number","Номер внутреннего паспорта должен состоять из 6 цифр.",5);
 if(d.livesAtRegistration==="no"&&!d.actualAddress.trim())add("actual-address","Укажите адрес места пребывания или фактического проживания.",3);
 if(d.changedName==="yes"&&(!d.previousName||!d.changeDate||!d.changePlace))add("name-change-details","Заполните прежние ФИО, дату и место изменения.",2);
 if(d.hasForeignPassport==="yes"&&(!d.foreignSeries||!d.foreignNumber||!d.foreignIssueDate||!d.foreignIssuer))add("foreign-details","Заполните сведения о действующем загранпаспорте.",7);
 if(d.restriction==="yes"&&!d.restrictionDetails)add("restriction-details","Опишите обстоятельства возможного ограничения права на выезд.",8);
 if(d.secretAccess==="yes"&&!d.secretDetails)add("secret-details","Укажите организацию и год допуска.",8);
 if(d.contractualRestriction==="yes"&&!d.contractDetails)add("contract-details","Укажите организацию и год обязательства.",8);
 if(!d.photoAcknowledged)add("photo","Ознакомьтесь с информацией о фотографии.",PHOTO_STEP);
 for(const [i,date]of[d.birthDate,d.registrationDate,d.internalIssueDate,d.foreignIssueDate].entries())if(date&&new Date(date)>now)add(`future-date-${i}`,"Исправьте дату: она не может быть в будущем.",[1,3,5,7][i]);
 const t=analyzeTimeline(d.activities,now);
 t.invalid.forEach((id)=>add(`activity-invalid-${id}`,"В одном из периодов дата начала позже даты окончания.",ACTIVITY_STEP));
 t.gaps.forEach(g=>add(`gap-${g.from}-${g.to}`,`Мы не знаем, чем вы занимались с ${monthLabel(g.from)} по ${monthLabel(g.to)}.`,ACTIVITY_STEP));
 t.overlaps.forEach(g=>add(`overlap-${g.from}-${g.to}`,`Периоды пересекаются: ${monthLabel(g.from)} — ${monthLabel(g.to)}.`,ACTIVITY_STEP));
 return issues;
}
