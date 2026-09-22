const EVENTS={visit:"visits",start:"starts",reached_review:"reviews",kit_ready:"kits",gosuslugi_click:"gosuslugi_clicks"};
const headers=origin=>({"access-control-allow-origin":origin,"access-control-allow-methods":"GET,POST,OPTIONS","access-control-allow-headers":"content-type","content-type":"application/json","vary":"Origin"});
const reply=(body,status,origin)=>new Response(JSON.stringify(body),{status,headers:headers(origin)});

export default {
 async fetch(request,env){
  const origin=request.headers.get("Origin")||"";
  const allowed=env.ALLOWED_ORIGIN||"";
  if(request.method!=="GET"&&origin!==allowed)return reply({error:"origin_not_allowed"},403,allowed);
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:headers(allowed)});
  const path=new URL(request.url).pathname.replace(/\/$/,"");
  if(request.method==="POST"&&path.endsWith("/event")){
   const body=await request.json().catch(()=>({}));
   const column=EVENTS[body.event];
   if(!column)return reply({error:"invalid_event"},400,allowed);
   const day=new Date().toISOString().slice(0,10);
   await env.DB.prepare(`INSERT INTO daily_metrics(day,${column}) VALUES(?,1) ON CONFLICT(day) DO UPDATE SET ${column}=${column}+1`).bind(day).run();
   return reply({ok:true},200,allowed);
  }
  if(request.method==="POST"&&path.endsWith("/feedback")){
   const body=await request.json().catch(()=>({}));
   const rating=body.rating==="up"||body.rating==="down"?body.rating:null;
   const message=typeof body.message==="string"?body.message.trim().slice(0,2000):"";
   if(!rating&&!message)return reply({error:"empty_feedback"},400,allowed);
   await env.DB.prepare("INSERT INTO feedback(rating,message) VALUES(?,?)").bind(rating,message).run();
   return reply({ok:true},200,allowed);
  }
  if(request.method==="GET"&&path.endsWith("/public-stats")){
   const row=await env.DB.prepare("SELECT COALESCE(SUM(kits),0) AS kits FROM daily_metrics").first();
   return reply({kits:Number(row?.kits||0)},200,allowed);
  }
  return reply({error:"not_found"},404,allowed);
 }
};
