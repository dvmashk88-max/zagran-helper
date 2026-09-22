export const STEPS=["Тип паспорта","Личные данные","Изменения ФИО","Адрес","Контакты","Паспорт РФ","Причина","Загранпаспорта","Важные обстоятельства","Фотография","История за 10 лет","Проверка"] as const;
export const PHOTO_STEP=9,ACTIVITY_STEP=10,REVIEW_STEP=11;
export type CorrectionState={step:number;returnToReview:boolean};
export function beginCorrection(step:number):CorrectionState{return{step,returnToReview:true}}
export function returnToReview():CorrectionState{return{step:REVIEW_STEP,returnToReview:false}}
