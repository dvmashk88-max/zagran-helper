import type {Activity,ActivityKind} from "./domain";
import {analyzeTimeline,compareMonths,tenYearWindow} from "./timeline";

export type ActivityAnswer={kind:ActivityKind;from:string;organization:string;position:string;address:string};

export function nextActivityTarget(items:Activity[],now=new Date()){
  const analysis=analyzeTimeline(items,now);
  if(!analysis.gaps.length)return null;
  return analysis.gaps[analysis.gaps.length-1].to;
}

export function gapForTarget(items:Activity[],target:string,now=new Date()){
  return analyzeTimeline(items,now).gaps.find(g=>compareMonths(g.from,target)<=0&&compareMonths(target,g.to)<=0)??null;
}

export function buildActivity(answer:ActivityAnswer,target:string,now=new Date(),id="activity") : Activity {
  const end=tenYearWindow(now).end;
  const current=target===end;
  return {id,kind:answer.kind,from:answer.from,to:current?"":target,current,organization:answer.kind==="unemployed"?"НЕ РАБОТАЛ(А)":answer.organization,position:answer.kind==="unemployed"?"":answer.position,address:answer.address};
}

export function activityAnswerIsValid(answer:ActivityAnswer,target:string,minStart:string){
  if(!answer.from||compareMonths(answer.from,minStart)<0||compareMonths(answer.from,target)>0)return false;
  if(!answer.address.trim())return false;
  if(answer.kind!=="unemployed"&&!answer.organization.trim())return false;
  return answer.kind!=="work"||Boolean(answer.position.trim());
}
