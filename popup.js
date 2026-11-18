const $=id=>document.getElementById(id);
const LANGUAGES=[
["af","الأفريكانية"],["sq","الألبانية"],["am","الأمهرية"],["ar","العربية"],["hy","الأرمينية"],["as","الأسامية"],["ay","الأيمارا"],["az","الأذربيجانية"],["bm","البامبارا"],["eu","الباسكية"],["be","البيلاروسية"],["bn","البنغالية"],["bho","البهوجبرية"],["bs","البوسنية"],["bg","البلغارية"],["my","البورمية"],["ca","الكتالونية"],["ceb","السيبوانية"],["zh-CN","الصينية المبسطة"],["zh-TW","الصينية التقليدية"],["co","الكورسيكية"],["hr","الكرواتية"],["cs","التشيكية"],["da","الدنماركية"],["dv","الديفيهية"],["doi","الدوجرية"],["nl","الهولندية"],["en","الإنجليزية"],["eo","الإسبرانتو"],["et","الإستونية"],["ee","الإيوي"],["fil","الفلبينية"],["fi","الفنلندية"],["fr","الفرنسية"],["fy","الفريزية"],["gl","الجاليكية"],["ka","الجورجية"],["de","الألمانية"],["el","اليونانية"],["gn","الجوارانية"],["gu","الغوجاراتية"],["ht","الكريولية الهايتية"],["ha","الهوسا"],["haw","الهاوائية"],["he","العبرية"],["hi","الهندية"],["hmn","الهمونغ"],["hu","المجرية"],["is","الأيسلندية"],["ig","الإيغبو"],["ilo","الإيلوكانو"],["id","الإندونيسية"],["ga","الأيرلندية"],["it","الإيطالية"],["ja","اليابانية"],["jv","الجاوية"],["kn","الكانادا"],["kk","الكازاخية"],["km","الخميرية"],["rw","الكينيارواندا"],["gom","الكونكانية"],["ko","الكورية"],["kri","الكريو"],["ku","الكردية"],["ky","القيرغيزية"],["lo","اللاوية"],["la","اللاتينية"],["lv","اللاتفية"],["ln","اللينغالا"],["lt","الليتوانية"],["lg","اللوغندية"],["lb","اللوكسمبورغية"],["mk","المقدونية"],["mai","المايثيلية"],["mg","الملغاشية"],["ms","الملايوية"],["ml","المالايالامية"],["mt","المالطية"],["mi","الماورية"],["mr","الماراثية"],["mni-Mtei","الميتي"],["lus","الميزو"],["mn","المنغولية"],["ne","النيبالية"],["no","النرويجية"],["ny","النيانجا"],["or","الأوديا"],["om","الأورومو"],["ps","البشتوية"],["fa","الفارسية"],["pl","البولندية"],["pt","البرتغالية"],["pa","البنجابية"],["qu","الكيتشوا"],["ro","الرومانية"],["ru","الروسية"],["sm","الساموية"],["sa","السنسكريتية"],["gd","الغيلية الاسكتلندية"],["nso","السوتو الشمالية"],["sr","الصربية"],["st","السوتو"],["sn","الشونا"],["sd","السندية"],["si","السنهالية"],["sk","السلوفاكية"],["sl","السلوفينية"],["so","الصومالية"],["es","الإسبانية"],["su","السوندية"],["sw","السواحيلية"],["sv","السويدية"],["tl","التاغالوغية"],["tg","الطاجيكية"],["ta","التاميلية"],["tt","التترية"],["te","التيلوغوية"],["th","التايلاندية"],["ti","التغرينية"],["ts","التسونغا"],["tr","التركية"],["tk","التركمانية"],["uk","الأوكرانية"],["ur","الأردية"],["ug","الأويغورية"],["uz","الأوزبكية"],["vi","الفيتنامية"],["cy","الويلزية"],["xh","الخوسا"],["yi","اليديشية"],["yo","اليوروبا"],["zu","الزولو"]
];
const select=$("target");
for(const [code,name] of LANGUAGES){const option=document.createElement("option");option.value=code;option.textContent=name;select.appendChild(option);}
chrome.storage.sync.get({target:"ar"},v=>{select.value=v.target||"ar";});
select.addEventListener("change",()=>chrome.storage.sync.set({target:select.value}));
$("more").onclick=()=>{$("menu").hidden=!$("menu").hidden;};
$("reset").onclick=()=>{select.value="ar";chrome.storage.sync.set({target:"ar"});$("menu").hidden=true;};
$("about").onclick=()=>{ $("menu").hidden=true; $("status").textContent="SEIF TRANSLATOR — ترجمة صفحات الويب والصور إلى لغات متعددة."; };
$("translatePage").onclick=async()=>{
 $("status").textContent="جارٍ ترجمة الصفحة...";
 try{const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
 chrome.tabs.sendMessage(tab.id,{type:"TRANSLATE_PAGE"},r=>{
  if(chrome.runtime.lastError){$("status").textContent="لا يمكن ترجمة هذه الصفحة. جرّب تحديثها أولاً.";return;}
  $("status").textContent=r?.message||"انتهت العملية.";
 });}catch(e){$("status").textContent="تعذّر الوصول إلى الصفحة الحالية.";}
};
$("imageMode").onclick=()=>$("imageFile").click();
$("clearImage").onclick=()=>{$("imageFile").value="";$("imagePanel").hidden=true;$("imageResult").textContent="";};
$("imageFile").onchange=async e=>{
 const file=e.target.files[0];if(!file)return;
 $("imagePanel").hidden=false;$("preview").src=URL.createObjectURL(file);
 $("imageText").value="جارٍ استخراج النص من الصورة...";$("imageResult").textContent="";
 try{
  const data=new FormData();data.append("file",file);data.append("language","auto");data.append("isOverlayRequired","false");data.append("OCREngine","2");
  const response=await fetch("https://api.ocr.space/parse/image",{method:"POST",body:data,headers:{"apikey":"helloworld"}});
  const json=await response.json();const extracted=json.ParsedResults?.map(x=>x.ParsedText).join("\n").trim();
  $("imageText").value=extracted||json.ErrorMessage?.join("\n")||"لم يتم العثور على نص واضح. يمكنك إدخاله يدوياً.";
 }catch(err){$("imageText").value="تعذّر الاتصال بخدمة استخراج النص. يمكنك كتابة النص يدوياً.";}
};
$("translateImage").onclick=async()=>{
 const text=$("imageText").value.trim();if(!text)return;
 $("imageResult").textContent="جارٍ الترجمة...";
 try{const r=await chrome.runtime.sendMessage({type:"TRANSLATE_TEXT",text,target:select.value});$("imageResult").textContent=r.text||r.error||"تعذّرت الترجمة.";}
 catch(e){$("imageResult").textContent="تعذّرت الترجمة حالياً.";}
};