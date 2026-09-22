import type { Activity } from "./domain";
const toMonth = (v:string) => { const [y,m]=v.split("-").map(Number); return y*12+m-1 };
const fromMonth = (v:number) => `${Math.floor(v/12)}-${String(v%12+1).padStart(2,"0")}`;
export function tenYearWindow(now=new Date()){ const end=now.getFullYear()*12+now.getMonth(); return {start:fromMonth(end-120),end:fromMonth(end)} }
export function monthLabel(v:string){ const [y,m]=v.split("-").map(Number); return new Intl.DateTimeFormat("ru-RU",{month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(Date.UTC(y,m-1,1))) }
export function analyzeTimeline(items:Activity[],now=new Date()){
  const window=tenYearWindow(now), start=toMonth(window.start), end=toMonth(window.end), counts=new Map<number,number>(), invalid:string[]=[];
  for(const item of items){ if(!item.from||(!item.to&&!item.current)){invalid.push(item.id);continue} const a=toMonth(item.from),b=item.current?end:toMonth(item.to); if(a>b){invalid.push(item.id);continue} for(let m=Math.max(a,start);m<=Math.min(b,end);m++) counts.set(m,(counts.get(m)||0)+1) }
  const ranges=(months:number[])=>{ const out:{from:string;to:string}[]=[]; if(!months.length)return out; let a=months[0],b=a; for(const m of months.slice(1)){if(m===b+1)b=m;else{out.push({from:fromMonth(a),to:fromMonth(b)});a=b=m}} out.push({from:fromMonth(a),to:fromMonth(b)});return out };
  const gaps:number[]=[],overlaps:number[]=[]; for(let m=start;m<=end;m++){const c=counts.get(m)||0;if(c===0)gaps.push(m);if(c>1)overlaps.push(m)}
  const total=end-start+1,covered=[...counts.values()].filter(c=>c>0).length;
  return {window,gaps:ranges(gaps),overlaps:ranges(overlaps),invalid,complete:!gaps.length&&!overlaps.length&&!invalid.length,covered,total,percent:Math.round(covered/total*100),counts};
}
export function previousMonth(value:string){return fromMonth(toMonth(value)-1)}
export function compareMonths(a:string,b:string){return toMonth(a)-toMonth(b)}
export function monthsInWindow(now=new Date()){const w=tenYearWindow(now),a=toMonth(w.start),b=toMonth(w.end);return Array.from({length:b-a+1},(_,i)=>fromMonth(a+i))}
