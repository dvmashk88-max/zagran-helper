import type { Draft } from "./domain";
export const DRAFT_KEY="zagran-helper:draft"; export const TTL_MS=86400000;
type Store=Pick<Storage,"getItem"|"setItem"|"removeItem">;
export type StoredDraft={data:Draft;lastStep:number;touchedAt:number};
export function saveDraft(store:Store,data:Draft,lastStep=0,now=Date.now()){store.setItem(DRAFT_KEY,JSON.stringify({data,lastStep,touchedAt:now}))}
export function loadDraft(store:Store,now=Date.now()):{data:Draft|null;expired:boolean;lastStep:number;touchedAt?:number}{const raw=store.getItem(DRAFT_KEY);if(!raw)return{data:null,expired:false,lastStep:0};try{const p=JSON.parse(raw);if(!p.touchedAt||now-p.touchedAt>=TTL_MS){store.removeItem(DRAFT_KEY);return{data:null,expired:true,lastStep:0}}return{data:{...p.data,photoAcknowledged:Boolean(p.data?.photoAcknowledged)},expired:false,lastStep:Number.isInteger(p.lastStep)?p.lastStep:0,touchedAt:p.touchedAt}}catch{store.removeItem(DRAFT_KEY);return{data:null,expired:true,lastStep:0}}}
export function finishApplication(store:Store){store.removeItem(DRAFT_KEY);return store.getItem(DRAFT_KEY)===null}
