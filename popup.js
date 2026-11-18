const $=id=>document.getElementById(id);
const langs=["ar","en","fr","es","de","it","tr","pt","ru","ja","zh-CN"];
chrome.storage.sync.get({target:"ar"},v=>{$("target").value=v.target});
$("target").addEventListener("change",()=>chrome.storage.sync.set({target:$("target").value}));
$("more").onclick=()=>{$("menu").hidden=!$("menu").hidden};
$("reset").onclick=()=>{chrome.storage.sync.set({target:"ar"});$("target").value="ar";$("menu").hidden=true};
$("translatePage").onclick=async()=>{
  $("status").textContent="جارٍ ترجمة الصفحة...";
  try{const [tab]=await chrome.tabs.query({active:true,currentWindow:true});chrome.tabs.sendMessage(tab.id,{type:"TRANSLATE_PAGE"},r=>{if(chrome.runtime.lastError){$("status").textContent="أعد تحميل الصفحة ثم حاول مجدداً.";return;}$("status").textContent=r?.message||"تم إرسال طلب الترجمة.";});}
  catch(e){$("status").textContent="تعذّر الوصول إلى هذه الصفحة.";}
};
$("imageMode").onclick=()=>$("imageFile").click();
$("imageFile").onchange=async e=>{
 const file=e.target.files[0];if(!file)return;
 $("imagePanel").hidden=false;$("preview").src=URL.createObjectURL(file);$("imageText").value="جارٍ استخراج النص...";
 $("imageResult").textContent="";
 try{
  const data=new FormData();data.append("file",file);data.append("language","ara");data.append("isOverlayRequired","false");
  const response=await fetch("https://api.ocr.space/parse/image",{method:"POST",body:data,headers:{"apikey":"helloworld"}});
  const json=await response.json();const text=json.ParsedResults?.map(x=>x.ParsedText).join("\n").trim();
  $("imageText").value=text||"لم يتم العثور على نص واضح في الصورة.";
 }catch(err){$("imageText").value="تعذّر استخراج النص. يمكنك كتابته أو لصقه هنا يدوياً.";}
};
$("translateImage").onclick=async()=>{
 const text=$("imageText").value.trim();if(!text)return;
 $("imageResult").textContent="جارٍ الترجمة...";
 try{const target=$("target").value;const r=await chrome.runtime.sendMessage({type:"TRANSLATE_TEXT",text,target});$("imageResult").textContent=r.text||r.error;}
 catch(e){$("imageResult").textContent="تعذّرت الترجمة حالياً.";}
};