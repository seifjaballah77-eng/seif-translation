(()=> {
 let installPrompt=null;
 const installButton=document.getElementById("installAppBtn");
 if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(error=>console.warn("PWA offline shell unavailable:",error)));
 }
 window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault();installPrompt=event;
  if(installButton)installButton.hidden=false;
 });
 if(installButton)installButton.addEventListener("click",async()=>{
  if(!installPrompt){alert("يمكنك تثبيت SEIF TRANSLATOR من قائمة المتصفح: تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية.");return;}
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt=null;installButton.hidden=true;
 });
 window.addEventListener("appinstalled",()=>{if(installButton)installButton.hidden=true;});
})();