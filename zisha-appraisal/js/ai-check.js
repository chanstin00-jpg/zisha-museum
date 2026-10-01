// ---------- 免費 AI 初檢（模擬數據，替換為真實模型調用即可） ----------
const shots = ['全貌', '底款', '內壁', '泥料微距'];
let shotCount = 0;
const shotList = document.getElementById('shotList');
const runAiBtn = document.getElementById('runAiBtn');

document.getElementById('uploadBox').addEventListener('click', () => {
  if (shotCount >= 4) return;
  const chip = document.createElement('div');
  chip.className = 'shot-chip';
  chip.textContent = '✓ ' + shots[shotCount];
  shotList.appendChild(chip);
  shotCount++;
  if (shotCount >= 4) runAiBtn.disabled = false;
});

runAiBtn.addEventListener('click', () => {
  const box = document.getElementById('aiResultBox');
  box.innerHTML = '<div class="loading"><div class="spinner"></div>AI 正在比對器型庫與泥料紋理...</div>';

  // TODO: 這裡之後接入真實的多模態模型調用，返回真實的概率數值
  setTimeout(() => {
    box.innerHTML = `
      <div class="result-metric"><div class="label"><span>全手工工藝概率</span><span>78%</span></div><div class="bar"><i style="width:78%;"></i></div></div>
      <div class="result-metric"><div class="label"><span>底款相似度</span><span>92%</span></div><div class="bar"><i style="width:92%;"></i></div></div>
      <div class="result-metric"><div class="label"><span>泥料紋理自然度</span><span>65%</span></div><div class="bar"><i style="width:65%;"></i></div></div>
      <div class="warn-box">AI 影像判斷無法排除化工添加劑風險，也無法確認真實泥料成分。建議做一次光譜元素檢測，獲取實驗室級別的準確數據。</div>
      <button class="btn" style="margin-top:16px;" data-goto="spectral">預約權威光譜檢測 →</button>`;
    box.querySelector('[data-goto]').addEventListener('click', () => goto('spectral'));
  }, 1400);
});
