import type {Draft} from "./domain";

export type KitItem={id:string;label:string};
export function ageOn(date:string,now=new Date()){if(!date)return 0;const b=new Date(`${date}T00:00:00`);let age=now.getFullYear()-b.getFullYear();if(now.getMonth()<b.getMonth()||(now.getMonth()===b.getMonth()&&now.getDate()<b.getDate()))age--;return age}
export function buildPersonalKit(d:Draft,now=new Date()){
  const prepared:KitItem[]=[
    {id:"identity",label:"Основные данные подготовлены"},
    {id:"timeline",label:"История работы, учёбы и службы за 10 лет проверена"},
    {id:"internal",label:"Паспорт РФ учтён"},
    {id:"circumstances",label:"Дополнительные обстоятельства учтены"},
  ];
  if(d.hasForeignPassport==="yes")prepared.push({id:"foreign",label:"Действующий загранпаспорт учтён"});
  if(d.changedName==="yes")prepared.push({id:"name-change",label:"Смена ФИО учтена"});
  const documents:KitItem[]=[{id:"passport",label:"Внутренний паспорт РФ"}];
  if(d.hasForeignPassport==="yes")documents.push({id:"foreign-passport",label:"Указанный действующий загранпаспорт"});
  if(d.changedName==="yes")documents.push({id:"name-docs",label:"Документы со сведениями об изменении ФИО — держите под рукой для сверки"});
  if(d.reason==="lost")documents.push({id:"loss",label:"Известные сведения и обстоятельства утраты прежнего загранпаспорта"});
  const age=ageOn(d.birthDate,now);
  if(d.gender==="male"&&age>=18&&age<=30)documents.push({id:"military",label:"Документ воинского учёта — при наличии"});
  documents.push({id:"photo",label:d.passportKind==="10y"?"Фото для электронной анкеты; биометрическое фото сделают при личном визите":"Фото для электронной анкеты; актуальный перечень для личного визита проверьте в Госуслугах"});
  return{prepared,documents};
}
