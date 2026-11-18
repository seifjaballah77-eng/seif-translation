const ENDPOINT="https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=";
async function translateText(text,target){
 const url=ENDPOINT+encodeURIComponent(target)+"&dt=t&q="+encodeURIComponent(text);
 const response=await fetch(url);if(!response.ok)throw new Error("خدمة الترجمة غير متاحة حالياً");
 const data=await response.json();return (data[0]||[]).map(part=>part[0]||"").join("");
}
chrome.runtime.onInstalled.addListener(()=>{
 chrome.contextMenus.create({id:"seif-page",title:"ترجمة الصفحة باستخدام SEIF TRANSLATOR",contexts:["page"]});
 chrome.contextMenus.create({id:"seif-selection",title:"ترجمة النص المحدد",contexts:["selection"]});
});
chrome.contextMenus.onClicked.addListener(async(info,tab)=>{
 const {target="ar"}=await chrome.storage.sync.get({target:"ar"});
 if(info.menuItemId==="seif-page")chrome.tabs.sendMessage(tab.id,{type:"TRANSLATE_PAGE"});
 if(info.menuItemId==="seif-selection"&&info.selectionText){
  try{const translated=await translateText(info.selectionText,target);
   chrome.scripting.executeScript({target:{tabId:tab.id},func:t=>{const old=document.getElementById("__seif_translation_result");if(old)old.remove();const box=document.createElement("div");box.id="__seif_translation_result";box.textContent=t;Object.assign(box.style,{position:"fixed",zIndex:"2147483647",bottom:"18px",right:"18px",maxWidth:"min(440px,85vw)",padding:"14px 18px",background:"#fff",color:"#202124",border:"1px solid #dadce0",borderRadius:"10px",boxShadow:"0 5px 25px #0003",font:"14px/1.6 Arial,sans-serif",direction:"auto"});document.body.appendChild(box);setTimeout(()=>box.remove(),12000);},args:[translated]});
  }catch(e){}
 }
});
chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
 if(msg.type==="TRANSLATE_TEXT"){translateText(msg.text,msg.target||"ar").then(text=>sendResponse({text})).catch(e=>sendResponse({error:e.message}));return true;}
 if(msg.type==="TRANSLATE_BATCH"){
  (async()=>{const items=[];for(let i=0;i<msg.items.length;i++){const item=msg.items[i];items.push({id:item.id,text:await translateText(item.text,msg.target||"ar")});}return items;})().then(items=>sendResponse({items})).catch(e=>sendResponse({error:e.message}));return true;
 }
});