const API="https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=";
async function translate(text,target){
 const url=API+encodeURIComponent(target)+"&dt=t&q="+encodeURIComponent(text);
 const res=await fetch(url);if(!res.ok)throw new Error("Translation service unavailable");
 const data=await res.json();return (data[0]||[]).map(x=>x[0]||"").join("");
}
chrome.runtime.onInstalled.addListener(()=>{
 chrome.contextMenus.create({id:"seif-translate-page",title:"ترجمة هذه الصفحة باستخدام SEIF TRANSLATOR",contexts:["page"]});
 chrome.contextMenus.create({id:"seif-translate-selection",title:"ترجمة النص المحدد",contexts:["selection"]});
});
chrome.contextMenus.onClicked.addListener(async(info,tab)=>{
 const {target="ar"}=await chrome.storage.sync.get({target:"ar"});
 if(info.menuItemId==="seif-translate-page")chrome.tabs.sendMessage(tab.id,{type:"TRANSLATE_PAGE"});
 if(info.menuItemId==="seif-translate-selection"&&info.selectionText){
  try{const text=await translate(info.selectionText,target);chrome.scripting.executeScript({target:{tabId:tab.id},func:t=>alert(t),args:[text]});}catch(e){}
 }
});
chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
 if(msg.type==="TRANSLATE_TEXT"){translate(msg.text,msg.target||"ar").then(text=>sendResponse({text})).catch(e=>sendResponse({error:"فشلت الترجمة: "+e.message}));return true;}
 if(msg.type==="TRANSLATE_BATCH"){Promise.all(msg.items.map(async item=>({id:item.id,text:await translate(item.text,msg.target||"ar")}))).then(items=>sendResponse({items})).catch(e=>sendResponse({error:e.message}));return true;}
});