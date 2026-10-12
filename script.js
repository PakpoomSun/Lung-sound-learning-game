
const S = {
  normal: {
    name: "เสียงปอดปกติ (Normal sound)",
    audio: "media/normal-sound.mp4"
  },
  rhonchi: {
    name: "Rhonchi",
    audio: "media/rhonchi-audio.mp4",
    video: "media/rhonchi-review.mp4",
    desc: "เสียงต่ำคล้ายกรนหรือครืดคราด อาจเปลี่ยนหลังไอ"
  },
  stridor: {
    name: "Stridor",
    audio: "media/stridor-audio.mp4",
    video: "media/stridor-review.mp4",
    desc: "เสียงแหลมหรือหยาบ มักเด่นขณะหายใจเข้า"
  },
  wheezing: {
    name: "Wheezing",
    audio: "media/wheezing-audio.mp4",
    video: "media/wheezing-review.mp4",
    desc: "เสียงหวีดต่อเนื่อง มักเด่นขณะหายใจออก"
  },
  crackles: {
    name: "Crepitation / Rales / Crackles",
    audio: "media/crackles-audio.mp4",
    video: "media/crackles-review.mp4",
    desc: "เสียงแตกพร่าเป็นช่วง ๆ คล้ายเสียงเป๊าะหรือกรอบแกรบ"
  }
};

const types = ["rhonchi", "stridor", "wheezing", "crackles"];
const $ = id => document.getElementById(id);

let qs = [];
let idx = 0;
let answers = [null, null, null, null];
let optionSets = [];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function side(s) {
  return s === "left" ? "ฝั่งซ้ายของภาพ" : "ฝั่งขวาของภาพ";
}

function setup() {
  qs = shuffle(types).map(type => ({
    type,
    abn: Math.random() < 0.5 ? "left" : "right"
  }));

  idx = 0;
  answers = [null, null, null, null];
  optionSets = [];
  render();
}

function play(s) {
  const q = qs[idx];
  const isAbnormal = s === q.abn;
  const key = isAbnormal ? q.type : "normal";
  const player = $("player");

  player.pause();
  player.src = S[key].audio;
  player.load();

  // เล่นเสียงจากการคลิกปอด
  player.play().catch(err => {
    console.error("ไม่สามารถเล่นเสียงได้:", err);
  });

  $("left").classList.toggle("active", s === "left");
  $("right").classList.toggle("active", s === "right");
}

function render() {
  const q = qs[idx];

  $("qLabel").textContent = `ข้อ ${idx + 1} จาก 4`;
  $("bar").style.width = `${(idx / 4) * 100}%`;
  $("feedback").textContent = "";
  $("options").innerHTML = "";

  const player = $("player");
  player.pause();
  player.removeAttribute("src");
  player.load();

  $("left").classList.remove("active");
  $("right").classList.remove("active");

  // สร้างตัวเลือก 4 ข้อ โดยมีคำตอบถูกเพียงข้อเดียว
  const combos = [
    { side: q.abn, type: q.type }
  ];

  const distractors = shuffle(types.filter(t => t !== q.type));

  distractors.forEach((type, i) => {
    combos.push({
      side: i % 2 === 0
        ? (q.abn === "left" ? "right" : "left")
        : q.abn,
      type
    });
  });

  optionSets[idx] = shuffle(combos);

  optionSets[idx].forEach((o, i) => {
    const label = document.createElement("label");
    label.className = "opt";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = i;
    radio.checked = answers[idx] === i;

    const text = document.createElement("span");
    text.textContent = `${side(o.side)} มีเสียง ${S[o.type].name}`;

    radio.addEventListener("change", () => {
      answers[idx] = i;
      updateDots();
      updateSelection();
    });

    label.appendChild(radio);
    label.appendChild(text);
    $("options").appendChild(label);
  });

  updateSelection();

  $("prev").disabled = idx === 0;
  $("next").classList.toggle("hidden", idx === 3);
  $("submit").classList.toggle("hidden", idx !== 3);

  updateDots();
}

function updateSelection() {
  document.querySelectorAll("#options .opt").forEach((label, i) => {
    label.classList.toggle("selected", answers[idx] === i);
  });
}

function updateDots() {
  $("answered").textContent =
    answers.filter(a => a !== null).length;

  $("dots").innerHTML = qs.map((q, i) => {
    const dot = document.createElement("div");
    dot.className = "dot";
    if (answers[i] !== null) dot.classList.add("done");
    if (i === idx) dot.classList.add("current");
    dot.textContent = `ข้อ ${i + 1}${answers[i] !== null ? " ✓" : ""}`;
    return dot.outerHTML;
  }).join("");
}

function next() {
  if (idx < 3) {
    idx++;
    render();
  }
}

function prev() {
  if (idx > 0) {
    idx--;
    render();
  }
}

function submit() {
  const missing = answers
    .map((a, i) => a === null ? i + 1 : null)
    .filter(Boolean);

  if (missing.length) {
    $("feedback").textContent =
      `กรุณาตอบข้อ ${missing.join(", ")} ก่อนส่งคำตอบ`;
    return;
  }

  let score = 0;

  qs.forEach((q, i) => {
    const answer = optionSets[i][answers[i]];
    if (answer.side === q.abn && answer.type === q.type) score++;
  });

  $("quizPage").classList.add("hidden");
  $("results").classList.remove("hidden");

  $("finalScore").textContent = score;
  $("finalText").textContent = score === 4
    ? "ยอดเยี่ยม! ถูกครบทุกข้อ"
    : "ทบทวนลักษณะเสียงผิดปกติและลองทำแบบทดสอบอีกครั้ง";

  $("reviews").innerHTML = "";

  qs.forEach((q, i) => {
    const answer = optionSets[i][answers[i]];
    const good = answer.side === q.abn && answer.type === q.type;
    const abnormal = S[q.type];

    const article = document.createElement("article");
    article.className = "review";

    const heading = document.createElement("h3");
    heading.textContent = `ข้อ ${i + 1} · ${good ? "ตอบถูก" : "ตอบผิด"}`;
    article.appendChild(heading);

    const meta = document.createElement("div");
    meta.className = "meta";

    const info = document.createElement("div");
    info.className = "abn";

    const strong = document.createElement("b");
    strong.textContent = "เสียงผิดปกติ";
    info.appendChild(strong);
    info.appendChild(document.createElement("br"));
    info.appendChild(document.createTextNode(
      `${side(q.abn)} · ${abnormal.name}`
    ));

    meta.appendChild(info);
    article.appendChild(meta);

    const desc = document.createElement("p");
    desc.textContent = `ลักษณะเสียง: ${abnormal.desc}`;
    article.appendChild(desc);

    const userAnswer = document.createElement("p");
    userAnswer.textContent =
      `คำตอบของคุณ: ${side(answer.side)} · ${S[answer.type].name}`;
    article.appendChild(userAnswer);

    const media = document.createElement("div");
    media.className = "media";

    const mediaColumn = document.createElement("div");

    const audioTitle = document.createElement("h4");
    audioTitle.textContent = `ฟังเสียงผิดปกติ: ${abnormal.name}`;
    mediaColumn.appendChild(audioTitle);

    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "metadata";
    audio.src = abnormal.audio;
    mediaColumn.appendChild(audio);

    const videoTitle = document.createElement("h4");
    videoTitle.textContent = `วิดีโอทบทวน: ${abnormal.name}`;
    mediaColumn.appendChild(videoTitle);

    const video = document.createElement("video");
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.src = abnormal.video;
    mediaColumn.appendChild(video);

    media.appendChild(mediaColumn);
    article.appendChild(media);

    $("reviews").appendChild(article);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

$("left").addEventListener("click", () => play("left"));
$("right").addEventListener("click", () => play("right"));
$("next").addEventListener("click", next);
$("prev").addEventListener("click", prev);
$("submit").addEventListener("click", submit);

$("retry").addEventListener("click", () => {
  $("results").classList.add("hidden");
  $("quizPage").classList.remove("hidden");
  setup();
});

setup();
