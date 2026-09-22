import type { Draft } from "./domain";
export const DRAFT_KEY="zagran-helper:draft"; export const TTL_MS=86400000;
type Store=Pick<Storage,"getItem"|"setItem"|"removeItem">;
export function saveDraft(store:Store,data:Draft,now=Date.now()){store.setItem(DRAFT_KEY,JSON.stringify({data,touchedAt:now}))}
export function loadDraft(store:Store,now=Date.now()):{data:Draft|null;expired:boolean;touchedAt?:number}{const raw=store.getItem(DRAFT_KEY);if(!raw)return{data:null,expired:false};try{const p=JSON.parse(raw);if(!p.touchedAt||now-p.touchedAt>=TTL_MS){store.removeItem(DRAFT_KEY);return{data:null,expired:true}}return{data:p.data,expired:false,touchedAt:p.touchedAt}}catch{store.removeItem(DRAFT_KEY);return{data:null,expired:true}}}
export function finishApplication(store:Store){store.removeItem(DRAFT_KEY);return store.getItem(DRAFT_KEY)===null}
