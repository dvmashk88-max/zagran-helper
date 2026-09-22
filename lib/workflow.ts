export const STEPS=["Тип паспорта","Доступ к Госуслугам","Личные данные","Изменения ФИО","Адрес","Контакты","Паспорт РФ","Причина","Загранпаспорта","Важные обстоятельства","Фотография","История за 10 лет","Проверка"] as const;
export const GOSUSLUGI_STEP=1,PHOTO_STEP=10,ACTIVITY_STEP=11,REVIEW_STEP=12;
export type CorrectionState={step:number;returnToReview:boolean};
export function beginCorrection(step:number):CorrectionState{return{step,returnToReview:true}}
export function returnToReview():CorrectionState{return{step:REVIEW_STEP,returnToReview:false}}
