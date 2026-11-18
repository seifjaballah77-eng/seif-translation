let translating=false;
chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
 if(msg.type!=="TRANSLATE_PAGE")return;
 translatePage().then(result=>sendResponse({message:result?("تمت ترجمة "+result+" جزءاً من الصفحة."):"لم يتم العثور على نص قابل للترجمة."})).catch(()=>sendResponse({message:"تعذّرت ترجمة الصفحة. حاول مجدداً."}));
 return true;
});
async function translatePage(){
 if(translating)return 0;translating=true;
 try{
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const nodes=[];
  while(walker.nextNode()){
   const node=walker.currentNode,parent=node.parentElement;
   if(!parent||!node.nodeValue.trim()||parent.closest("script,style,noscript,textarea,input,select,option,code,pre,[contenteditable=true],[aria-hidden=true]"))continue;
   if(parent.getClientRects().length)nodes.push(node);
  }
  const filtered=nodes.filter(node=>node.nodeValue.trim().length>1).slice(0,220);
  const {target="ar"}=await chrome.storage.sync.get({target:"ar"});
  let changed=0;
  for(let i=0;i<filtered.length;i+=12){
   const chunk=filtered.slice(i,i+12);
   const response=await chrome.runtime.sendMessage({type:"TRANSLATE_BATCH",target,items:chunk.map((node,index)=>({id:index,text:node.nodeValue}))});
   if(response?.items)response.items.forEach((item,index)=>{if(item.text){chunk[index].nodeValue=item.text;changed++;}});
  }
  return changed;
 }finally{translating=false;}
}