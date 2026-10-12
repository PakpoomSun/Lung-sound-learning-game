(() => {
"use strict";
const S={
 normal:{name:"เสียงปอดปกติ (Normal sound)",audio:"media/normal-sound.mp4"},
 rhonchi:{name:"Rhonchi",audio:"media/rhonchi-audio.mp4",video:"media/rhonchi-review.mp4",desc:"เสียงต่ำคล้ายกรนหรือครืดคราด อาจเปลี่ยนหลังไอ"},
 stridor:{name:"Stridor",audio:"media/stridor-audio.mp4",video:"media/stridor-review.mp4",desc:"เสียงแหลมหรือหยาบ มักเด่นขณะหายใจเข้า"},
 wheezing:{name:"Wheezing",audio:"media/wheezing-audio.mp4",video:"media/wheezing-review.mp4",desc:"เสียงหวีดต่อเนื่อง มักเด่นขณะหายใจออก"},
 crackles:{name:"Crepitation / Rales / Crackles",audio:"media/crackles-audio.mp4",video:"media/crackles-review.mp4",desc:"เสียงแตกพร่าเป็นช่วง ๆ คล้ายเสียงเป๊าะหรือกรอบแกรบ"}
};
const types=["rhonchi","stridor","wheezing","crackles"],$=id=>document.getElementById(id);
let qs=[],idx=0,answers=[null,null,null,null],optionSets=[];
function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function side(s){return s==="left"?"ฝั่งซ้ายของภาพ":"ฝั่งขวาของภาพ";}
function showError(msg){if($("feedback"))$("feedback").textContent=msg;console.error("[Lung Sound Pair Quiz]",msg);}
function setup(){qs=shuffle(types).map(type=>({type,abn:Math.random()<.5?"left":"right"}));idx=0;answers=[null,null,null,null];optionSets=[];render();}
function play(s){
 const q=qs[idx],player=$("player");if(!q||!player){showError("ไม่พบข้อมูลข้อสอบหรือเครื่องเล่นเสียง");return;}
 const key=s===q.abn?q.type:"normal";player.pause();player.src=S[key].audio;player.load();
 const p=player.play();if(p&&p.catch)p.catch(err=>{console.error("Audio playback failed:",err);showError("เล่นเสียงไม่ได้ กรุณาตรวจชื่อไฟล์ "+S[key].audio+" ในโฟลเดอร์ media");});
 $("left").classList.toggle("active",s==="left");$("right").classList.toggle("active",s==="right");
}
function render(){
 const q=qs[idx];if(!q){showError("ไม่สามารถเตรียมข้อสอบได้");return;}
 $("qLabel").textContent=`ข้อ ${idx+1} จาก ${qs.length}`;$("bar").style.width=`${idx/qs.length*100}%`;$("feedback").textContent="";$("options").replaceChildren();
 const player=$("player");player.pause();player.removeAttribute("src");player.load();$("left").classList.remove("active");$("right").classList.remove("active");
 const combos=[{side:q.abn,type:q.type}];
 shuffle(types.filter(t=>t!==q.type)).forEach((type,i)=>combos.push({side:i%2===0?(q.abn==="left"?"right":"left"):q.abn,type}));
 optionSets[idx]=shuffle(combos);
 optionSets[idx].forEach((o,i)=>{
  const label=document.createElement("label");label.className="opt";
  const radio=document.createElement("input");radio.type="radio";radio.name="answer";radio.value=String(i);radio.checked=answers[idx]===i;
  radio.addEventListener("change",()=>{answers[idx]=i;updateDots();updateSelection();});
  const span=document.createElement("span");span.textContent=`${side(o.side)} มีเสียง ${S[o.type].name}`;
  label.append(radio,span);$("options").appendChild(label);
 });
 $("prev").disabled=idx===0;$("next").classList.toggle("hidden",idx===qs.length-1);$("submit").classList.toggle("hidden",idx!==qs.length-1);updateSelection();updateDots();
 if($("options").children.length!==4)showError("สร้างตัวเลือกไม่ครบ 4 ข้อ กรุณาตรวจสอบ script.js");
}
function updateSelection(){document.querySelectorAll("#options .opt").forEach((el,i)=>el.classList.toggle("selected",answers[idx]===i));}
function updateDots(){$("answered").textContent=String(answers.filter(a=>a!==null).length);$("dots").replaceChildren();qs.forEach((q,i)=>{const d=document.createElement("div");d.className="dot";if(answers[i]!==null)d.classList.add("done");if(i===idx)d.classList.add("current");d.textContent=`ข้อ ${i+1}${answers[i]!==null?" ✓":""}`;$("dots").appendChild(d);});}
function next(){if(idx<qs.length-1){idx++;render();}}
function prev(){if(idx>0){idx--;render();}}
function addText(parent,tag,text,cls){const el=document.createElement(tag);if(cls)el.className=cls;el.textContent=text;parent.appendChild(el);return el;}
function submit(){
 const missing=answers.map((a,i)=>a===null?i+1:null).filter(Boolean);if(missing.length){$("feedback").textContent=`กรุณาตอบข้อ ${missing.join(", ")} ก่อนส่งคำตอบ`;return;}
 let score=0;qs.forEach((q,i)=>{const a=optionSets[i][answers[i]];if(a.side===q.abn&&a.type===q.type)score++;});
 $("quizPage").classList.add("hidden");$("results").classList.remove("hidden");$("finalScore").textContent=String(score);$("finalText").textContent=score===qs.length?"ยอดเยี่ยม! ถูกครบทุกข้อ":"ทบทวนลักษณะเสียงผิดปกติและลองทำแบบทดสอบอีกครั้ง";$("reviews").replaceChildren();
 qs.forEach((q,i)=>{
  const answer=optionSets[i][answers[i]],good=answer.side===q.abn&&answer.type===q.type,ab=S[q.type],article=document.createElement("article");article.className="review";
  addText(article,"h3",`ข้อ ${i+1} · ${good?"ตอบถูก":"ตอบผิด"}`);
  const meta=document.createElement("div");meta.className="meta";const info=document.createElement("div");info.className="abn";addText(info,"b","เสียงผิดปกติ");info.append(document.createElement("br"),document.createTextNode(`${side(q.abn)} · ${ab.name}`));meta.appendChild(info);article.appendChild(meta);
  addText(article,"p",`ลักษณะเสียง: ${ab.desc}`);addText(article,"p",`คำตอบของคุณ: ${side(answer.side)} · ${S[answer.type].name}`);
  const media=document.createElement("div");media.className="media";const col=document.createElement("div");
  addText(col,"h4",`ฟังเสียงผิดปกติ: ${ab.name}`);const audio=document.createElement("audio");audio.controls=true;audio.preload="metadata";audio.src=ab.audio;col.appendChild(audio);
  addText(col,"h4",`วิดีโอทบทวน: ${ab.name}`);const video=document.createElement("video");video.controls=true;video.playsInline=true;video.preload="metadata";video.src=ab.video;col.appendChild(video);
  media.appendChild(col);article.appendChild(media);$("reviews").appendChild(article);
 });
 window.scrollTo({top:0,behavior:"smooth"});
}
function init(){
 const ids=["quizPage","results","qLabel","bar","left","right","player","options","feedback","prev","next","submit","answered","dots","finalScore","finalText","reviews","retry"];
 const missing=ids.filter(id=>!$(id));if(missing.length){console.error("Missing HTML elements:",missing);return;}
 $("left").addEventListener("click",()=>play("left"));$("right").addEventListener("click",()=>play("right"));$("next").addEventListener("click",next);$("prev").addEventListener("click",prev);$("submit").addEventListener("click",submit);
 $("retry").addEventListener("click",()=>{$("results").classList.add("hidden");$("quizPage").classList.remove("hidden");setup();});
 setup();console.info("Lung Sound Pair Quiz initialized.");
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
