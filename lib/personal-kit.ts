import type {Draft} from "./domain";

export type KitItem={id:string;label:string};
export type SubmissionGuide={documents:KitItem[];photos:string;application:string;places:string[];note:string};

export function buildPersonalKit(d:Draft){
  const prepared:KitItem[]=[
    {id:"timeline",label:"История работы, учёбы, службы и перерывов за 10 лет проверена"},
    {id:"internal",label:"Данные паспорта РФ подготовлены"},
    {id:"photo",label:"Требования к фотографии разобраны"},
  ];
  if(d.hasForeignPassport==="yes")prepared.push({id:"foreign",label:"Действующий загранпаспорт учтён"});
  if(d.changedName==="yes")prepared.push({id:"name-change",label:"Смена ФИО учтена"});
  if(d.restriction==="yes"||d.secretAccess==="yes"||d.contractualRestriction==="yes")prepared.push({id:"circumstances",label:"Указанные дополнительные обстоятельства учтены"});

  const documents:KitItem[]=[{id:"passport",label:"Паспорт гражданина РФ"}];
  if(d.hasForeignPassport==="yes")documents.push({id:"foreign-passport",label:"Указанный действующий загранпаспорт"});
  if(d.changedName==="yes")documents.push({id:"name-docs",label:"Сведения и документы об изменении ФИО — для сверки"});
  if(d.reason==="lost")documents.push({id:"loss",label:"Сведения о дате, месте и обстоятельствах утраты прежнего загранпаспорта"});
  if(d.secretAccess==="yes"||d.contractualRestriction==="yes"||d.restriction==="yes")documents.push({id:"special",label:"Документы по указанным особым обстоятельствам — если их запросит МВД"});
  return{prepared,documents};
}

export function buildPersonalSubmissionGuide(d:Draft):SubmissionGuide{
  const base:KitItem[]=[{id:"passport",label:"Паспорт гражданина РФ"}];
  if(d.hasForeignPassport==="yes")base.push({id:"foreign",label:"Действующий загранпаспорт, сведения о котором указаны в заявлении"});
  if(d.reason==="lost")base.push({id:"loss",label:"Заявление об утрате с известными реквизитами, датой, местом и обстоятельствами утраты"});
  if(d.changedName==="yes")base.push({id:"name-change",label:"Сведения об изменении ФИО; при нескольких изменениях понадобится приложение к заявлению"});
  if(d.passportKind==="5y")return{
    documents:base,
    application:"Заявление установленной формы в двух экземплярах. Бланк можно получить в МВД или МФЦ либо распечатать с официального сайта МВД.",
    photos:"Три фотографии 35 × 45 мм. Для электронной подачи вместо бумажных фотографий загружается электронная фотография.",
    places:["Подразделение по вопросам миграции МВД","МФЦ, если выбранный центр оказывает эту услугу"],
    note:"Для отдельных ситуаций могут понадобиться специальные документы, например разрешение командования для некоторых военнослужащих. Уточните персональный перечень в выбранном месте подачи."
  };
  return{
    documents:base,
    application:"Заявление установленной формы в одном экземпляре. Бланк можно получить в МВД или МФЦ либо распечатать с официального сайта МВД.",
    photos:"Бумажные фотографии для изготовления биометрического паспорта не заменяют цифровое фотографирование: его выполняют при приёме заявления. Для подачи через Госуслуги отдельно загружается электронная фотография.",
    places:["Подразделение по вопросам миграции МВД","МФЦ с оборудованием для цифрового фотографирования и дактилоскопии, если выбранный центр оказывает услугу"],
    note:"При приёме выполняют цифровое фотографирование и сканирование отпечатков указательных пальцев. Для отдельных ситуаций могут понадобиться специальные документы; уточните персональный перечень в выбранном месте подачи."
  };
}
