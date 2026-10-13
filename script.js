<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lung Sound Learning Quiz Game</title>
<link rel="stylesheet" href="./style.css">
</head>
<body>
<header class="site-header">
  <div class="logo" aria-hidden="true">🫁</div>
  <div class="brand">
    <p class="eyebrow">NURSING AUDIO LEARNING</p>
    <h1>Lung Sound Learning Quiz Game</h1>
    <p class="subtitle">เรียนรู้เสียงปอดปกติ · จำแนกเสียงผิดปกติ · ทบทวนด้วยวิดีโอ</p>
  </div>
</header>
<main>
  <section id="learningPage" class="layout">
    <section class="card">
      <div class="between"><span class="pill">หน้าเรียนรู้</span><span class="pill pale">Normal breath sounds</span></div>
      <h2>ฝึกฟังเสียงปอดปกติก่อนเริ่มแบบทดสอบ</h2>
      <p class="muted">คลิกที่รูปปอดซ้ายหรือปอดขวาเพื่อฟังเสียงปอดปกติ ทั้งสองฝั่งจะเล่นเสียงเดียวกัน</p>
      <div class="lung-pair" id="learningLung">
        <button type="button" class="lung-target" data-side="left" aria-label="คลิกเพื่อฟังเสียงปอดปกติ ฝั่งซ้าย">
          <img src="./lung-left.png" alt="ปอดซ้าย">
          <span>ปอดซ้าย</span>
        </button>
        <button type="button" class="lung-target" data-side="right" aria-label="คลิกเพื่อฟังเสียงปอดปกติ ฝั่งขวา">
          <img src="./lung-right.png" alt="ปอดขวา">
          <span>ปอดขวา</span>
        </button>
      </div>
      <p id="learningStatus" class="listen-status" aria-live="polite">พร้อมฟังเสียงปอดปกติ</p>
      <div class="audio-engine"><audio id="learningPlayer" preload="none"></audio></div>
      <div class="actions"><button id="startQuiz" type="button">เริ่มแบบทดสอบ →</button></div>
      <p class="tiny">หน้านี้ไม่มีคำถามและไม่มีการให้คะแนน</p>
    </section>
    <aside class="sidebar card dark">
      <p class="eyebrow">BEFORE YOU START</p><h2>วิธีฝึกฟัง</h2>
      <ol><li>คลิกที่รูปปอดซ้าย</li><li>คลิกที่รูปปอดขวา</li><li>ทั้งสองฝั่งจะเล่นเสียงปอดปกติ</li><li>เมื่อพร้อมแล้วกดเริ่มแบบทดสอบ</li></ol>
    </aside>
  </section>

  <section id="quizPage" class="layout hidden">
    <section class="card">
      <div class="between"><span class="pill">แบบทดสอบ</span><span id="qLabel" class="pill pale">กำลังเตรียมข้อสอบ…</span></div>
      <div class="progress-track"><div id="bar"></div></div>
      <h2>ฟังเสียงปอดทั้งสองฝั่ง</h2>
      <p class="muted">คลิกที่รูปปอดซ้ายหรือขวาเพื่อฟังเสียง แล้วเลือกคำตอบที่ถูกต้องเพียง 1 ข้อ</p>
      <div class="lung-pair" id="quizLung">
        <button type="button" class="lung-target" data-side="left" aria-label="ฟังเสียงปอดฝั่งซ้าย">
          <img src="./lung-left.png" alt="ปอดซ้าย"><span>ปอดซ้าย</span>
        </button>
        <button type="button" class="lung-target" data-side="right" aria-label="ฟังเสียงปอดฝั่งขวา">
          <img src="./lung-right.png" alt="ปอดขวา"><span>ปอดขวา</span>
        </button>
      </div>
      <div class="audio-engine"><audio id="player" preload="none"></audio></div>
      <h3>ฝั่งไหนผิดปกติ และเป็นเสียงชนิดใด?</h3>
      <div id="options" class="options" aria-label="ตัวเลือกคำตอบ"></div>
      <div id="feedback" aria-live="polite"></div>
      <div class="actions">
        <button id="prev" class="secondary" type="button">← ข้อก่อนหน้า</button>
        <button id="next" type="button">ถัดไป →</button>
        <button id="submit" class="hidden" type="button">ส่งคำตอบทั้งหมด</button>
      </div>
      <p class="tiny">ย้อนกลับไปแก้คำตอบได้ก่อนส่ง</p>
    </section>
    <aside class="sidebar">
      <section class="card dark"><p class="eyebrow">YOUR PROGRESS</p><h2>ความคืบหน้า</h2><div class="score"><span id="answered">0</span><small>/ 4 ตอบแล้ว</small></div><div id="dots" class="dots"></div></section>
      <section class="card"><h3>วิธีเล่น</h3><ol><li>คลิกปอดซ้ายหรือขวาเพื่อฟังเสียง</li><li>เลือกฝั่งผิดปกติและชนิดเสียง</li><li>ย้อนกลับหรือกดถัดไป</li><li>ตอบครบ 4 ข้อแล้วส่งคำตอบ</li></ol></section>
    </aside>
  </section>

  <section id="results" class="results hidden">
    <div class="card result-summary"><div class="trophy">🏆</div><h2>สรุปผลแบบทดสอบ</h2><div class="final"><span id="finalScore">0</span><small>/ 4 คะแนน</small></div><p id="finalText"></p><button id="retry" type="button">กลับไปเรียนรู้เสียงปอดปกติและทำแบบทดสอบอีกครั้ง</button></div>
    <h2 class="review-heading">เฉลยและทบทวนเสียงแต่ละข้อ</h2><p class="muted">ฟังเสียงผิดปกติและเปิดวิดีโอทบทวนได้</p><div id="reviews"></div>
  </section>
</main>
<footer>สื่อฝึกการฟังเสียงสำหรับนักศึกษาพยาบาล ไม่ใช้แทนการประเมินผู้ป่วยจริง</footer>
<script src="./script.js"></script>
</body>
</html>
