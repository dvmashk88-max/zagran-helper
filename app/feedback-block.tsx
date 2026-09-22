import {useEffect,useState} from "react";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {loadPublicStats,sendFeedback,type Rating} from "@/lib/analytics";

export function FeedbackBlock({endpoint}:{endpoint:string}){
 const[rating,setRating]=useState<Rating|null>(null),[message,setMessage]=useState(""),[state,setState]=useState<"idle"|"sending"|"sent"|"error">("idle"),[kits,setKits]=useState<number|null>(null);
 useEffect(()=>{loadPublicStats(endpoint).then(x=>setKits(x?.kits??null)).catch(()=>setKits(null))},[endpoint]);
 const submit=async()=>{if(!endpoint){setState("error");return}setState("sending");try{setState(await sendFeedback(endpoint,rating,message)?"sent":"error")}catch{setState("error")}};
 return <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
  {kits!==null&&<p className="mb-5 inline-flex rounded-full bg-emerald-50 px-4 py-2 font-bold text-emerald-900">Подготовлено комплектов: {kits}</p>}
  <h2 className="text-2xl font-black">Помог ли вам сервис?</h2><div className="mt-4 flex gap-3"><button aria-pressed={rating==="up"} onClick={()=>setRating("up")} className={`rounded-xl border-2 px-5 py-3 text-lg font-bold ${rating==="up"?"border-emerald-600 bg-emerald-50":"border-slate-200"}`}>👍 Да</button><button aria-pressed={rating==="down"} onClick={()=>setRating("down")} className={`rounded-xl border-2 px-5 py-3 text-lg font-bold ${rating==="down"?"border-rose-600 bg-rose-50":"border-slate-200"}`}>👎 Нет</button></div>
  <label className="mt-6 block font-bold">Что было непонятно или чего не хватает?</label><Textarea value={message} onChange={e=>setMessage(e.target.value)} className="mt-2 min-h-28 text-base" placeholder="Пожалуйста, не указывайте ФИО, паспортные данные, адреса и другие личные сведения."/>
  <p className="mt-2 text-sm text-slate-500">К отзыву никогда не прикладываются ответы из оформления. Отправляются только выбранная оценка и введённый здесь текст.</p>
  <Button onClick={submit} disabled={state==="sending"||state==="sent"||(!rating&&!message.trim())} className="mt-4 bg-sky-900">{state==="sending"?"Отправляем…":state==="sent"?"Спасибо за отзыв":"Отправить отзыв"}</Button>
  {state==="error"&&<p className="mt-3 text-sm text-amber-800">Приём обезличенных отзывов пока не подключён. Ваш текст никуда не отправлен.</p>}
 </section>
}
