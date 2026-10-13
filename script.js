(() => {
"use strict";
const S = {
  normal:{name:"เสียงปอดปกติ (Normal sound)",audio:"media/normal-sound.mp4"},
  rhonchi:{name:"Rhonchi",audio:"media/rhonchi-audio.mp4",video:"media/rhonchi-review.mp4",desc:"เสียงต่ำ ทุ้ม คล้ายเสียงกรนหรือเสียงครืดคราด มักเกิดจากสารคัดหลั่งในทางเดินหายใจขนาดใหญ่ และอาจเปลี่ยนแปลงหรือลดลงหลังไอ"},
  stridor:{name:"Stridor",audio:"media/stridor-audio.mp4",video:"media/stridor-review.mp4",desc:"เสียงแหลมดังและหยาบ คล้ายเสียงหวูด มักได้ยินชัดขณะหายใจเข้า เกิดจากการตีบแคบหรืออุดกั้นของทางเดินหายใจส่วนบน"},
  wheezing:{name:"Wheezing",audio:"media/wheezing-audio.mp4",video:"media/wheezing-review.mp4",desc:"เสียงหวีดแหลมต่อเนื่อง คล้ายเสียงผิวปากหรือนกหวีด มักได้ยินชัดขณะหายใจออก เกิดจากทางเดินหายใจตีบแคบ"},
  crackles:{name:"Crepitation / Rales / Crackles",audio:"media/crackles-audio.mp4",video:"media/crackles-review.mp4",desc:"เสียงแตกเป๊าะ ๆ หรือกรอบแกรบเป็นช่วงสั้น ๆ คล้ายเสียงแกะตีนตุ๊กแกหรือเสียงขยี้ถุงพลาสติก มักได้ยินชัดขณะหายใจเข้า โดยอาจเกิดจากการเปิดของทางเดินหายใจขนาดเล็กหรือมีสารคัดหลั่ง ขึ้นอยู่กับสาเหตุ"}
};
const types=["rhonchi","stridor","wheezing","crackles"], $=id=>document.getElementById(id);
let qs=[],idx=0,answers=[null,null,null,null],optionSets=[];
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function side(s){return s==="left"?"ฝั่งซ้าย":"ฝั่งขวา";}
function play(player,src,onError){player.pause();player.src=src;player.load();const p=player.play();if(p&&p.catch)p.catch(()=>{const msg="เล่นเสียงไม่ได้ กรุณาตรวจสอบไฟล์ "+src;if(onError)onError(msg);else $("feedback").textContent=msg;});}
function bindLungButtons(rootId,playerId,sourceFn,statusId){
 const root=$(rootId),player=$(playerId);
 root.querySelectorAll(".lung-target").forEach(button=>{
  button.addEventListener("click",()=>{
   root.querySelectorAll(".lung-target").forEach(b=>b.classList.toggle("active",b===button));
   const src=sourceFn(button.dataset.side);
   play(player,src,msg=>{if(statusId)$(statusId).textContent=msg;else $("feedback").textContent=msg;});
   if(statusId)$(statusId).textContent="กำลังเล่นเสียงปอดปกติ — "+side(button.dataset.side);
  });
 });
}
function setup(){qs=shuffle(types).map(type=>({type,abn:Math.random()<.5?"left":"right"}));idx=0;answers=[null,null,null,null];optionSets=[];render();}
function render(){
 const q=qs[idx];$("qLabel").textContent=`ข้อ ${idx+1} จาก 4`;$("bar").style.width=`${idx/4*100}%`;$("feedback").textContent="";$("options").replaceChildren();
 const player=$("player");player.pause();player.removeAttribute("src");player.load();
 $("quizLung").querySelectorAll(".lung-target").forEach(b=>b.classList.remove("active"));
 const combos=[{side:q.abn,type:q.type}];
 shuffle(types.filter(t=>t!==q.type)).forEach((type,i)=>combos.push({side:i%2===0?(q.abn==="left"?"right":"left"):q.abn,type}));
 optionSets[idx]=shuffle(combos);
 optionSets[idx].forEach((o,i)=>{
  const label=document.createElement("label");label.className="opt";
  const radio=document.createElement("input");radio.type="radio";radio.name="answer";radio.value=String(i);radio.checked=answers[idx]===i;
  radio.addEventListener("change",()=>{answers[idx]=i;updateProgress();updateSelection();});
  const span=document.createElement("span");span.textContent=`${side(o.side)} มีเสียง ${S[o.type].name}`;
  label.append(radio,span);$("options").appendChild(label);
 });
 $("prev").disabled=idx===0;$("next").classList.toggle("hidden",idx===3);$("submit").classList.toggle("hidden",idx!==3);updateProgress();updateSelection();
}
function updateSelection(){document.querySelectorAll("#options .opt").forEach((el,i)=>el.classList.toggle("selected",answers[idx]===i));}
function updateProgress(){$("answered").textContent=String(answers.filter(a=>a!==null).length);$("dots").replaceChildren();qs.forEach((q,i)=>{const d=document.createElement("div");d.className="dot";if(answers[i]!==null)d.classList.add("done");if(i===idx)d.classList.add("current");d.textContent=`ข้อ ${i+1}${answers[i]!==null?" ✓":""}`;$("dots").appendChild(d);});}
function addText(parent,tag,text){const e=document.createElement(tag);e.textContent=text;parent.appendChild(e);return e;}
function submit(){
 const missing=answers.map((a,i)=>a===null?i+1:null).filter(Boolean);
 if(missing.length){$("feedback").textContent="กรุณาตอบข้อ "+missing.join(", ")+" ก่อนส่งคำตอบ";return;}
 let score=0;qs.forEach((q,i)=>{const a=optionSets[i][answers[i]];if(a.side===q.abn&&a.type===q.type)score++;});
 $("quizPage").classList.add("hidden");$("results").classList.remove("hidden");$("finalScore").textContent=String(score);$("finalText").textContent=score===4?"ยอดเยี่ยม! ถูกครบทุกข้อ":"ทบทวนลักษณะเสียงผิดปกติและลองทำแบบทดสอบอีกครั้ง";$("reviews").replaceChildren();
 qs.forEach((q,i)=>{
  const a=optionSets[i][answers[i]],good=a.side===q.abn&&a.type===q.type,ab=S[q.type],article=document.createElement("article");article.className="review";
  addText(article,"h3",`ข้อ ${i+1} · ${good?"ตอบถูก":"ตอบผิด"}`);
  addText(article,"p","เสียงผิดปกติ: "+side(q.abn)+" · "+ab.name);
  addText(article,"p","ลักษณะเสียง: "+ab.desc);
  addText(article,"p","คำตอบของคุณ: "+side(a.side)+" · "+S[a.type].name);
  addText(article,"h4","ฟังเสียงผิดปกติ: "+ab.name);
  const audio=document.createElement("audio");audio.controls=true;audio.preload="metadata";audio.src=ab.audio;article.appendChild(audio);
  addText(article,"h4","วิดีโอทบทวน: "+ab.name);
  const video=document.createElement("video");video.controls=true;video.playsInline=true;video.preload="metadata";video.src=ab.video;article.appendChild(video);
  $("reviews").appendChild(article);
 });
 window.scrollTo({top:0,behavior:"smooth"});
}
function init(){
 bindLungButtons("learningLung","learningPlayer",()=>S.normal.audio,"learningStatus");
 bindLungButtons("quizLung","player",s=>{const q=qs[idx];return q&&s===q.abn?S[q.type].audio:S.normal.audio;});
 $("startQuiz").addEventListener("click",()=>{$("learningPage").classList.add("hidden");$("quizPage").classList.remove("hidden");setup();window.scrollTo({top:0,behavior:"smooth"});});
 $("next").addEventListener("click",()=>{if(idx<3){idx++;render();}});
 $("prev").addEventListener("click",()=>{if(idx>0){idx--;render();}});
 $("submit").addEventListener("click",submit);
 $("retry").addEventListener("click",()=>{$("results").classList.add("hidden");$("learningPage").classList.remove("hidden");$("learningStatus").textContent="พร้อมฟังเสียงปอดปกติ";$("learningLung").querySelectorAll(".lung-target").forEach(b=>b.classList.remove("active"));const p=$("learningPlayer");p.pause();p.removeAttribute("src");p.load();window.scrollTo({top:0,behavior:"smooth"});});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
