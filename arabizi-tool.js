/* SEIF TRANSLATOR — local Arabic / Arabizi converter. */
(function () {
  "use strict";
  const arabicWords = {
    "عامر":"3amer","عمري":"3omri","عمر":"3omar","زحف":"za7f","زاحف":"za7ef",
    "شنوة":"chnowa","شنوّة":"chnowa","شنيا":"chnia","شنو":"chno","توة":"tawa","توّا":"tawa",
    "برشة":"barsha","برشا":"barsha","ياسر":"yesser","نحب":"n7eb","نحبك":"n7ebek",
    "علاش":"3lech","وين":"win","كيفاش":"kifech","باهي":"behi","قداش":"9addech",
    "موش":"mouch","مش":"mouch","ما":"ma","إنت":"enti","انت":"enti","إنتي":"enti",
    "أنا":"ena","احنا":"a7na","إحنا":"a7na","توا":"tawa","يعطيك":"ya3tik",
    "الصحة":"essa7a","عسلامة":"3aslema","بالسلامة":"besslema","لاباس":"lebes",
    "صباح":"sbe7","الخير":"elkhir","مساء":"msa","شنوة تحب":"chnowa t7eb",
    "شنو تحب":"chnowa t7eb","كيف حالك":"kifech 7alek","وينك":"winik",
    "توحشتك":"twa7achtek","برشا":"barsha","فلوس":"flous","كرهبة":"karhba",
    "خدمة":"5edma","دار":"dar","الدار":"eddar","صاحبي":"sa7bi","خويا":"5ouya",
    "نعم":"ey","إي":"ey","لا":"le","بزاف":"bzzaf","دابا":"daba","واش":"wach",
    "راك":"rak","بغيت":"bghit","شنو بغيتي":"chno bghiti","واش راك":"wach rak",
    "عايز":"3ayez","عاوز":"3ayez","إيه":"eh","أيوه":"aywa","دلوقتي":"delwa2ti",
    "معلش":"ma3lesh","بحبك":"ba7ebak","وحشتني":"wa7ashteni","إزيك":"ezzayak",
    "بدي":"baddi","شو":"shu","بدك":"baddak","كتير":"kteer","هلأ":"halla2",
    "هسا":"hassa","شلونك":"shlonak","شنو":"shno","هسه":"hassa","هواية":"hwaya",
    "الحين":"al7een","أبغى":"abgha","أبي":"abi","وايد":"wayed","نبي":"nabi",
    "هلبة":"halba","باهي":"behi","مليح":"mli7","صحا":"sa7a","خلاص":"5alas",
    "حلو":"7elw","كويس":"kwayyes","تمام":"tamam","شكرا":"shokran","شكراً":"shokran",
    "مرحبا":"mar7aba","أهلا":"ahlan","سلام":"salam","بحب":"ba7eb","اشتقتلك":"eshta2tlek",
    "إن شاء الله":"inshallah","الحمد لله":"el7amdulillah","الله":"allah","ربي":"rabbi",
    "قلب":"9alb","حبيبي":"7abibi","حبيبتي":"7abibti","غالي":"ghali","عزيز":"3ziz"
  };
  const reverseWords = {};
  Object.keys(arabicWords).forEach(ar => {
    const latin = arabicWords[ar].toLowerCase();
    if (!reverseWords[latin]) reverseWords[latin] = ar;
  });
  Object.assign(reverseWords, {
    "3amer":"عامر","3omri":"عمري","3omar":"عمر","za7f":"زحف","za7ef":"زاحف",
    "chnowa":"شنوة","chnia":"شنيا","chno":"شنو","tawa":"توا","barsha":"برشة",
    "yesser":"ياسر","n7eb":"نحب","n7ebek":"نحبك","3lech":"علاش","win":"وين",
    "kifech":"كيفاش","behi":"باهي","9addech":"قداش","mouch":"موش","enti":"إنتي",
    "ena":"أنا","a7na":"إحنا","ya3tik":"يعطيك","3aslema":"عسلامة",
    "besslema":"بالسلامة","lebes":"لاباس","sbe7":"صباح","elkhir":"الخير",
    "msa":"مسا","t7eb":"تحب","7alek":"حالك","winik":"وينك","twa7achtek":"توحشتك",
    "flous":"فلوس","karhba":"كرهبة","5edma":"خدمة","sa7bi":"صاحبي","5ouya":"خويا",
    "ey":"إي","le":"لا","bzzaf":"بزاف","daba":"دابا","wach":"واش","rak":"راك",
    "bghit":"بغيت","bghiti":"بغيتي","3ayez":"عايز","eh":"إيه","aywa":"أيوه",
    "delwa2ti":"دلوقتي","ma3lesh":"معلش","ba7ebak":"بحبك","wa7ashteni":"وحشتني",
    "ezzayak":"إزيك","baddi":"بدي","shu":"شو","baddak":"بدك","kteer":"كتير",
    "halla2":"هلأ","hassa":"هسا","shlonak":"شلونك","shno":"شنو","hwaya":"هواية",
    "al7een":"الحين","abgha":"أبغى","abi":"أبي","wayed":"وايد","nabi":"نبي",
    "halba":"هلبة","mli7":"مليح","sa7a":"صحا","5alas":"خلاص","7elw":"حلو",
    "kwayyes":"كويس","tamam":"تمام","shokran":"شكرا","mar7aba":"مرحبا",
    "ahlan":"أهلا","salam":"سلام","ba7eb":"بحب","eshta2tlek":"اشتقتلك",
    "inshallah":"إن شاء الله","el7amdulillah":"الحمد لله","allah":"الله",
    "rabbi":"ربي","9alb":"قلب","7abibi":"حبيبي","7abibti":"حبيبتي",
    "ghali":"غالي","3ziz":"عزيز"
  });
  const charMap = {
    "ء":"2","أ":"2","إ":"2","ؤ":"2","ئ":"2","ا":"a","آ":"2a",
    "ب":"b","ت":"t","ث":"th","ج":"j","ح":"7","خ":"5","د":"d","ذ":"dh",
    "ر":"r","ز":"z","س":"s","ش":"ch","ص":"s","ض":"d","ط":"6","ظ":"z",
    "ع":"3","غ":"gh","ف":"f","ق":"9","ك":"k","ل":"l","م":"m","ن":"n",
    "ه":"h","ة":"a","و":"ou","ي":"i","ى":"a","پ":"p","ڨ":"g","گ":"g"
  };
  const latinToArabic = {
    "2":"ء","3":"ع","5":"خ","6":"ط","7":"ح","8":"غ","9":"ق",
    "b":"ب","t":"ت","j":"ج","d":"د","r":"ر","z":"ز","s":"س","f":"ف",
    "q":"ق","k":"ك","l":"ل","m":"م","n":"ن","h":"ه","w":"و","y":"ي",
    "p":"پ","g":"گ"
  };
  function normalize(value) {
    return String(value || "").toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"")
      .replace(/[\u064B-\u065F\u0670\u0640]/g,"")
      .replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي")
      .replace(/[؟?!.,،؛:()"“”]/g," ").replace(/\s+/g," ").trim();
  }
  const tokenPattern = /[A-Za-z0-9']+|[\u0621-\u063A\u0641-\u064A\u066E-\u06D3\u06FA-\u06FC\u064B-\u065F\u0670]+/g;
  function replaceTokens(text, convert, pattern) {
    pattern.lastIndex = 0;
    return text.replace(pattern, token => convert(token));
  }
  function toArabizi(text) {
    return replaceTokens(String(text || ""), token => {
      if (!/[\u0600-\u06FF\u0750-\u077F]/.test(token)) return token;
      const key = normalize(token);
      if (arabicWords[key]) return arabicWords[key];
      return Array.from(token).map(char => charMap[char] || char).join("");
    }, tokenPattern);
  }
  function toArabic(text) {
    return replaceTokens(String(text || ""), token => {
      if (!/[A-Za-z0-9]/.test(token)) return token;
      const key = normalize(token);
      if (reverseWords[key]) return reverseWords[key];
      if (!/[2-9]/.test(token) && !/[bcdfghjklmnpqrstvwxyz]{2}/i.test(token)) return token;
      let result = "", lower = token.toLowerCase(), i = 0;
      while (i < lower.length) {
        const rest = lower.slice(i);
        const digraph = ["sh","ch","kh","gh","th","dh","ou","oo","aa","ee","ii"].find(x => rest.startsWith(x));
        if (digraph) {
          const mapped = {sh:"ش",ch:"ش",kh:"خ",gh:"غ",th:"ث",dh:"ذ",ou:"و",oo:"و",aa:"ا",ee:"ي",ii:"ي"}[digraph];
          result += mapped; i += digraph.length; continue;
        }
        const char = lower[i];
        if (latinToArabic[char]) result += latinToArabic[char];
        else if (char === "o" || char === "u") result += "و";
        else if (char === "a" || char === "e" || char === "i") { /* short vowels are usually omitted */ }
        else result += char;
        i++;
      }
      return result || token;
    }, tokenPattern);
  }
  function isLikely(text) {
    const value = String(text || "").toLowerCase();
    if (/[2-9]/.test(value) && /[a-z]/.test(value)) return true;
    const words = value.match(/[a-z0-9']+/g) || [];
    if (!words.length) return false;
    const known = words.filter(word => reverseWords[normalize(word)] || /^(?:3|7|5|9|2|6|8)[a-z]+|[a-z]+(?:3|7|5|9|2|6|8)[a-z]*$/.test(word));
    return known.length >= 1;
  }

  window.SEIF_ARABIZI = { toArabizi, toArabic, isLikely, wordCount: Object.keys(arabicWords).length };

  const input = document.getElementById("arabiziInput");
  const output = document.getElementById("arabiziOutput");
  const copyButton = document.getElementById("arabiziCopy");
  const directionButtons = Array.from(document.querySelectorAll("[data-arabizi-direction]"));
  if (!input || !output) return;
  let direction = "to";
  function render() {
    const value = input.value.trim();
    output.textContent = !value ? "ستظهر الكتابة المحوّلة هنا…" : direction === "to" ? toArabizi(value) : toArabic(value);
    output.dir = direction === "to" ? "ltr" : "rtl";
    output.classList.toggle("is-empty", !value);
  }
  directionButtons.forEach(button => button.addEventListener("click", () => {
    direction = button.dataset.arabiziDirection;
    directionButtons.forEach(item => item.classList.toggle("active", item === button));
    input.placeholder = direction === "to" ? "مثال: عمري زحف" : "مثال: 3amer za7f";
    render();
  }));
  input.addEventListener("input", render);
  if (copyButton) copyButton.addEventListener("click", async () => {
    const value = output.textContent;
    if (!input.value.trim()) return;
    try {
      await navigator.clipboard.writeText(value);
      copyButton.textContent = "تم النسخ ✓";
      setTimeout(() => { copyButton.textContent = "نسخ"; }, 1300);
    } catch (_) {
      copyButton.textContent = "انسخ النتيجة يدوياً";
    }
  });
  render();
})();