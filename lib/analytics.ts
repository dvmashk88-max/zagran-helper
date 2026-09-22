export const METRIC_EVENTS=["visit","application_started","review_reached","kit_completed"] as const;
export type MetricEvent=typeof METRIC_EVENTS[number];
export type Rating="up"|"down";
export function buildMetricPayload(event:MetricEvent){return{event}}
export function buildFeedbackPayload(rating:Rating|null,message:string){return{rating,message:message.trim().slice(0,2000)}}
export async function sendMetric(endpoint:string,event:MetricEvent){if(!endpoint)return false;const r=await fetch(`${endpoint.replace(/\/$/,"")}/event`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(buildMetricPayload(event)),keepalive:true});return r.ok}
export async function sendFeedback(endpoint:string,rating:Rating|null,message:string){if(!endpoint)return false;const r=await fetch(`${endpoint.replace(/\/$/,"")}/feedback`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(buildFeedbackPayload(rating,message))});return r.ok}
export async function loadPublicStats(endpoint:string){if(!endpoint)return null;const r=await fetch(`${endpoint.replace(/\/$/,"")}/public-stats`);if(!r.ok)return null;return await r.json() as {kits:number}}
