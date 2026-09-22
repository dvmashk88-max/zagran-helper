import {useMemo,useState} from "react";
import {BriefcaseBusiness,GraduationCap,Shield,UserRoundX} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import type {Activity,ActivityKind} from "@/lib/domain";
import {activityAnswerIsValid,buildActivity,gapForTarget,nextActivityTarget,type ActivityAnswer} from "@/lib/activity-flow";
import {analyzeTimeline,compareMonths,monthLabel,monthsInWindow} from "@/lib/timeline";

const MONTHS=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const kindMeta:Record<ActivityKind,{label:string;past:string;icon:React.ReactNode}>={work:{label:"Работаю",past:"Работа",icon:<BriefcaseBusiness/>},study:{label:"Учусь",past:"Учёба",icon:<GraduationCap/>},service:{label:"Прохожу службу",past:"Служба",icon:<Shield/>},unemployed:{label:"Не работаю",past:"Не работал(а)",icon:<UserRoundX/>}};
const empty=(target:string):ActivityAnswer=>({kind:"work",from:target,organization:"",position:"",address:""});

export function ActivityStep({items,onChange,focusGap}:{items:Activity[];onChange:(items:Activity[])=>void;focusGap?:string}){
 const analysis=useMemo(()=>analyzeTimeline(items),[items]);
 const defaultTarget=focusGap||nextActivityTarget(items)||analysis.window.end;
 const[target,setTarget]=useState(defaultTarget),[answer,setAnswer]=useState<ActivityAnswer>(empty(defaultTarget)),[kindChosen,setKindChosen]=useState(false),[error,setError]=useState("");
 const gap=gapForTarget(items,target),minStart=gap?.from||analysis.window.start;
 const current=target===analysis.window.end;
 const reset=(newTarget:string)=>{setTarget(newTarget);setAnswer(empty(newTarget));setKindChosen(false);setError("")};
 const save=()=>{if(!activityAnswerIsValid(answer,target,minStart)){setError(`Проверьте ответы. Начало периода должно быть между ${monthLabel(minStart)} и ${monthLabel(target)}.`);return}const next=[...items,buildActivity(answer,target,new Date(),crypto.randomUUID())];onChange(next);const nextTarget=nextActivityTarget(next);if(nextTarget)reset(nextTarget);else{setKindChosen(false);setError("")}};
 return <div>
  <div className="mb-7"><p className="font-black uppercase tracking-widest text-sky-800">Главная проверка</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">История за 10 лет: {analysis.percent}% заполнено</h2><p className="mt-3 text-lg leading-7 text-slate-600">Мы сами ведём вас назад по месяцам — считать десятилетний диапазон не нужно.</p></div>
  <TimelineVisual items={items}/>
  {!analysis.complete&&<div className="mt-7 rounded-3xl border-2 border-sky-200 bg-sky-50 p-5 sm:p-7">
   <h3 className="text-2xl font-black">{current&&!items.length?"Чем вы занимаетесь сейчас?":`Чем вы занимались в ${monthLabel(target)}?`}</h3>
   {!kindChosen?<div className="mt-5 grid gap-3 sm:grid-cols-2">{(Object.keys(kindMeta) as ActivityKind[]).map(k=><button key={k} onClick={()=>{setAnswer(a=>({...a,kind:k}));setKindChosen(true)}} className="flex min-h-20 items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-4 text-left text-lg font-bold hover:border-sky-600"><span className="text-sky-800">{kindMeta[k].icon}</span>{current?kindMeta[k].label:kindMeta[k].past}</button>)}</div>:<ActivityQuestions answer={answer} setAnswer={setAnswer} target={target} minStart={minStart} current={current} onBack={()=>setKindChosen(false)} onSave={save}/>} 
   {error&&<p className="mt-4 rounded-xl bg-red-50 p-3 text-red-800">{error}</p>}
  </div>}
  {analysis.complete&&<div className="mt-7 rounded-2xl bg-emerald-50 p-5 text-emerald-950"><b className="text-lg">Готово: все месяцы заполнены без пропусков и пересечений.</b><p className="mt-1">Проверьте названия организаций, должности и адреса перед подачей.</p></div>}
  <div className="mt-6 space-y-3">{analysis.gaps.map(g=><div key={g.from} className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between"><p>Мы не знаем, чем вы занимались с <b>{monthLabel(g.from)}</b> по <b>{monthLabel(g.to)}</b>.</p><Button variant="outline" onClick={()=>reset(g.to)}>Заполнить этот период</Button></div>)}{analysis.overlaps.map(g=><div key={g.from} className="rounded-2xl border border-red-200 bg-red-50 p-4">Периоды пересекаются: <b>{monthLabel(g.from)} — {monthLabel(g.to)}</b>.</div>)}</div>
  {items.length>0&&<details className="mt-6 rounded-2xl border bg-white p-5"><summary className="cursor-pointer font-bold">Посмотреть заполненные периоды ({items.length})</summary><div className="mt-4 space-y-3">{[...items].sort((a,b)=>compareMonths(b.from,a.from)).map(a=><div key={a.id} className="flex flex-col gap-2 rounded-xl bg-slate-50 p-4 sm:flex-row sm:justify-between"><div><b>{monthLabel(a.from)} — {a.current?"настоящее время":monthLabel(a.to)}</b><p className="text-slate-600">{kindMeta[a.kind].past}: {a.organization}{a.position?` · ${a.position}`:""}</p></div><button className="text-left text-sm font-bold text-red-700" onClick={()=>onChange(items.filter(x=>x.id!==a.id))}>Удалить</button></div>)}</div></details>}
 </div>
}

function ActivityQuestions({answer,setAnswer,target,minStart,current,onBack,onSave}:{answer:ActivityAnswer;setAnswer:React.Dispatch<React.SetStateAction<ActivityAnswer>>;target:string;minStart:string;current:boolean;onBack:()=>void;onSave:()=>void}){
 const labels=answer.kind==="work"?{org:"Где работаете?",position:"Кем работаете?",address:"Адрес организации"}:answer.kind==="study"?{org:"Где учитесь?",position:"Специальность или статус (если применимо)",address:"Адрес учебного заведения"}:answer.kind==="service"?{org:"Воинская часть или место службы",position:"Должность (если применимо)",address:"Адрес места службы"}:{org:"",position:"",address:"Адрес проживания в этот период"};
 return <div className="mt-5 grid gap-5 sm:grid-cols-2">
  {answer.kind!=="unemployed"&&<><Field label={labels.org} value={answer.organization} set={v=>setAnswer(a=>({...a,organization:v}))}/><Field label={labels.position} value={answer.position} set={v=>setAnswer(a=>({...a,position:v}))}/></>}
  <div className="sm:col-span-2"><Field label={labels.address} value={answer.address} set={v=>setAnswer(a=>({...a,address:v}))}/></div>
  <div className="sm:col-span-2"><Label className="mb-2 block text-base font-bold">С какого месяца и года?</Label><MonthYear value={answer.from} min={minStart} max={target} onChange={v=>setAnswer(a=>({...a,from:v}))}/><p className="mt-2 text-sm text-slate-600">Окончание определено автоматически: {current?"по настоящее время":monthLabel(target)}.</p></div>
  <div className="sm:col-span-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><Button variant="ghost" onClick={onBack}>Изменить занятие</Button><Button className="bg-sky-900" onClick={onSave}>Сохранить и продолжить назад</Button></div>
 </div>
}

function MonthYear({value,min,max,onChange}:{value:string;min:string;max:string;onChange:(v:string)=>void}){const[y,m]=value.split("-").map(Number),[minY]=min.split("-").map(Number),[maxY]=max.split("-").map(Number);const years=Array.from({length:maxY-minY+1},(_,i)=>maxY-i);const set=(year:number,month:number)=>onChange(`${year}-${String(month).padStart(2,"0")}`);return <div className="grid grid-cols-2 gap-3"><select aria-label="Месяц" value={m} onChange={e=>set(y,Number(e.target.value))} className="h-12 rounded-xl border border-slate-300 bg-white px-3">{MONTHS.map((x,i)=><option key={x} value={i+1}>{x}</option>)}</select><select aria-label="Год" value={y} onChange={e=>set(Number(e.target.value),m)} className="h-12 rounded-xl border border-slate-300 bg-white px-3">{years.map(x=><option key={x}>{x}</option>)}</select></div>}
function TimelineVisual({items}:{items:Activity[]}){const a=analyzeTimeline(items),months=monthsInWindow();return <div className="rounded-2xl border bg-white p-4"><div className="mb-3 flex items-center justify-between text-sm"><span>{monthLabel(a.window.start)}</span><span>{monthLabel(a.window.end)}</span></div><div className="flex h-8 gap-[2px] overflow-hidden rounded-lg bg-slate-100 p-1" aria-label={`Заполнено ${a.percent}%`}>{months.map(m=>{const c=a.counts.get(Number(m.slice(0,4))*12+Number(m.slice(5))-1)||0;return <span key={m} title={`${monthLabel(m)}: ${c===0?"не заполнено":c>1?"пересечение":"заполнено"}`} className={`min-w-[2px] flex-1 rounded-sm ${c===0?"bg-amber-300":c>1?"bg-red-500":"bg-emerald-500"}`}/>})}</div><div className="mt-3 flex flex-wrap gap-4 text-sm"><span>🟩 заполнено</span><span>🟨 требует внимания</span><span>🟥 пересечение</span></div></div>}
function Field({label,value,set}:{label:string;value:string;set:(v:string)=>void}){return <div><Label className="mb-2 block text-base font-bold">{label}</Label><Input value={value} onChange={e=>set(e.target.value)} className="h-12 rounded-xl text-base"/></div>}
