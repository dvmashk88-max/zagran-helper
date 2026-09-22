import type {Draft} from "./domain";
import {analyzeTimeline,monthLabel} from "./timeline";
import {ACTIVITY_STEP,GOSUSLUGI_STEP,PHOTO_STEP} from "./workflow";

export type ValidationIssue={id:string;message:string;step:number};
export function validateDraft(d:Draft,now=new Date()){
 const issues:ValidationIssue[]=[];
 const add=(id:string,message:string,step:number)=>issues.push({id,message,step});
 const req:[unknown,string,string,number][]=[
  [d.passportKind,"passport-kind","Выберите паспорт на 5 или 10 лет.",0],[d.gosuslugiAccess,"gosuslugi-access","Укажите, можете ли вы войти на Госуслуги.",GOSUSLUGI_STEP],[d.lastName,"last-name","Укажите фамилию.",2],[d.firstName,"first-name","Укажите имя.",2],[d.gender,"gender","Укажите пол.",2],[d.birthDate,"birth-date","Укажите дату рождения.",2],[d.birthPlace,"birth-place","Укажите место рождения точно по паспорту.",2],
  [d.changedName,"changed-name","Ответьте, меняли ли вы ФИО.",3],[d.registeredAddress,"registered-address","Укажите адрес постоянной регистрации.",4],[d.registrationDate,"registration-date","Укажите дату регистрации.",4],[d.livesAtRegistration,"living-address","Укажите, живёте ли вы по адресу регистрации.",4],
  [d.internalIssueDate,"internal-date","Укажите дату выдачи внутреннего паспорта.",6],[d.internalIssuer,"internal-issuer","Укажите, кем выдан внутренний паспорт.",6],[d.reason,"reason","Выберите причину оформления.",7],[d.hasForeignPassport,"foreign-answer","Ответьте, есть ли действующий загранпаспорт.",8],
  [d.restriction,"restriction","Ответьте на вопрос об ограничениях права на выезд.",9],[d.secretAccess,"secret","Ответьте на вопрос о допуске к гостайне.",9],[d.contractualRestriction,"contract","Ответьте на вопрос о договорных обязательствах.",9],
 ];req.forEach(([v,id,m,s])=>{if(!v)add(id,m,s)});
 if(!d.noMiddleName&&!d.middleName.trim())add("middle-name","Укажите отчество или отметьте, что его нет.",2);
 if(!/^\d{4}$/.test(d.internalSeries))add("internal-series","Серия внутреннего паспорта должна состоять из 4 цифр.",6);
 if(!/^\d{6}$/.test(d.internalNumber))add("internal-number","Номер внутреннего паспорта должен состоять из 6 цифр.",6);
 if(d.livesAtRegistration==="no"&&!d.actualAddress.trim())add("actual-address","Укажите адрес места пребывания или фактического проживания.",4);
 if(d.changedName==="yes"&&(!d.previousName||!d.changeDate||!d.changePlace))add("name-change-details","Заполните прежние ФИО, дату и место изменения.",3);
 if(d.hasForeignPassport==="yes"&&(!d.foreignSeries||!d.foreignNumber||!d.foreignIssueDate||!d.foreignIssuer))add("foreign-details","Заполните сведения о действующем загранпаспорте.",8);
 if(d.restriction==="yes"&&!d.restrictionDetails)add("restriction-details","Опишите обстоятельства возможного ограничения права на выезд.",9);
 if(d.secretAccess==="yes"&&!d.secretDetails)add("secret-details","Укажите организацию и год допуска.",9);
 if(d.contractualRestriction==="yes"&&!d.contractDetails)add("contract-details","Укажите организацию и год обязательства.",9);
 if(!d.photoAcknowledged)add("photo","Ознакомьтесь с информацией о фотографии.",PHOTO_STEP);
 for(const [i,date]of[d.birthDate,d.registrationDate,d.internalIssueDate,d.foreignIssueDate].entries())if(date&&new Date(date)>now)add(`future-date-${i}`,"Исправьте дату: она не может быть в будущем.",[2,4,6,8][i]);
 const t=analyzeTimeline(d.activities,now);
 t.invalid.forEach((id)=>add(`activity-invalid-${id}`,"В одном из периодов дата начала позже даты окончания.",ACTIVITY_STEP));
 t.gaps.forEach(g=>add(`gap-${g.from}-${g.to}`,`Не заполнено: ${monthLabel(g.from)} — ${monthLabel(g.to)}.`,ACTIVITY_STEP));
 t.overlaps.forEach(g=>add(`overlap-${g.from}-${g.to}`,`Периоды пересекаются: ${monthLabel(g.from)} — ${monthLabel(g.to)}.`,ACTIVITY_STEP));
 return issues;
}
