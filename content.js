let busy=false;
chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
 if(msg.type!=="TRANSLATE_PAGE")return;
 translatePage().then(count=>sendResponse({message:count? "تمت ترجمة "+count+" فقرة.":"لم يتم العثور على نص قابل للترجمة."})).catch(()=>sendResponse({message:"حدث خطأ أثناء ترجمة الصفحة."}));
 return true;
});
async function translatePage(){
 if(busy)return 0;busy=true;
 try{
  const nodes=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
   const n=walker.currentNode,p=n.parentElement;
   if(!p||!n.nodeValue.trim()||p.closest("script,style,noscript,textarea,input,code,pre,[contenteditable=true]"))continue;
   if(p.getClientRects().length)nodes.push(n);
  }
  const unique=nodes.filter(n=>n.nodeValue.trim().length>1).slice(0,180);
  const {target="ar"}=await chrome.storage.sync.get({target:"ar"});
  const chunks=[];for(let i=0;i<unique.length;i+=15)chunks.push(unique.slice(i,i+15));
  let changed=0;
  for(const chunk of chunks){
   const items=chunk.map((n,i)=>({id:i,text:n.nodeValue}));
   const result=await chrome.runtime.sendMessage({type:"TRANSLATE_BATCH",items,target});
   if(result?.items)result.items.forEach((r,i)=>{if(r.text){chunk[i].nodeValue=r.text;changed++;}});
  }
  return changed;
 }finally{busy=false;}
}