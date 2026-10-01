// ---------- 光譜元素檢測中心：三種服務入口 ----------
// 1) 購買檢測服務（套餐 → 物流 → 蓋章報告）
// 2) 上傳外部檢測數據（客戶在其他機構的數據 → 無章參考報告）
// 3) 上傳本機構檢測數據（已購服務收到的數據 → 蓋章正式報告）
// 全部為前端模擬：數據解析與報告生成在本機完成，對接後端後替換對應函數即可。

// ---------- 套餐配置（可自行增減） ----------
const packages = [
  { id: 'purity', name: '泥料純度檢', price: 498, items: ['鐵/矽/錳基礎元素比例', '化工色素初篩', '潔淨度等級評定'] },
  { id: 'origin', name: '產地溯源檢', price: 899, items: ['與宜興黃龍山礦源檔案比對', '特徵比值（Rb/Sr 等）計算', '產地歸屬概率雷達圖'] },
  { id: 'full', name: '全項尊享檢', price: 1599, items: ['泥料純度 + 產地溯源全部項目', '重金屬（鋇/鉛/鎘）安全篩查', '編號蓋章報告 + 數字 DNA 防偽'] },
];

// ---------- 流程狀態 ----------
let mode = null;                 // 'buy' | 'external' | 'ours'
let selectedPkg = null;
let currentParsed = null;        // { oxides, traces }
let currentMeta = null;
let currentAnalysis = null;
let currentStep = -1;
let demoIndex = 0;
let currentSampleInfo = null;    // { name, type } 最近一次載入的樣品身份

const $ = id => document.getElementById(id);
const show = (id, on) => $(id).style.display = on ? 'block' : 'none';

// ---------- 服務入口 ----------
document.querySelectorAll('.entry-card').forEach(card => {
  card.addEventListener('click', e => {
    const go = e.target.closest('[data-entry-go]');
    if (!go) return;
    const entry = go.dataset.entryGo;
    if (entry === 'buy') {
      mode = 'buy';
      show('entryStage', false); show('pkgStage', true);
    } else if (entry === 'external') {
      mode = 'external';
      setupUpload('external');
    } else if (entry === 'ours') {
      mode = 'ours';
      setupUpload('ours');
    }
  });
});
// 卡片整張可點
document.querySelectorAll('.entry-card').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('.entry-btn')) return; // 已由上面處理
    const entry = card.dataset.entry;
    if (entry === 'buy') { mode = 'buy'; show('entryStage', false); show('pkgStage', true); }
    else if (entry === 'external') { mode = 'external'; setupUpload('external'); }
    else if (entry === 'ours') { mode = 'ours'; setupUpload('ours'); }
  });
});
// 返回入口
document.querySelectorAll('.stage-back').forEach(btn => {
  btn.addEventListener('click', () => resetToEntry());
});

function resetToEntry() {
  show('entryStage', true); show('pkgStage', false); show('trackStage', false);
  show('uploadStage', false); show('reportStage', false);
  document.querySelectorAll('.pkg').forEach(x => x.classList.remove('selected'));
  selectedPkg = null; currentStep = -1;
  $('orderBtn').disabled = true;
}

// ---------- 上傳介面（external / ours 共用） ----------
function setupUpload(kind) {
  mode = kind;
  show('entryStage', false); show('pkgStage', false); show('trackStage', false);
  show('uploadStage', true); show('reportStage', false);
  currentParsed = null;
  currentSampleInfo = null;
  $('genReportBtn').disabled = true;
  $('dataFileInput').value = '';
  if (kind === 'external') {
    $('uploadTitle').textContent = '上傳外部檢測數據';
    $('uploadDesc').textContent = '在其他機構（實驗室 / 檢測中心）檢測過的數據，可直接上傳。系統會自動識別元素含量並生成專業解讀報告；因數據非本機構出具，報告不蓋章、僅供參考。';
    $('uploadHint').textContent = '支援格式：CSV（如「SiO2,57.63」逐行）、JSON（如 {"SiO2": 57.63}）、TXT（如「SiO2 57.63%」）。系統自動匹配元素名稱，未識別項目會略過。';
  } else {
    $('uploadTitle').textContent = '上傳本機構檢測數據';
    $('uploadDesc').textContent = '已購買壺鑒檢測服務並收到實驗室數據？上傳數據文件後，系統將核驗檔案並生成帶機構認證蓋章的正式權威報告。';
    $('uploadHint').textContent = '支援格式：CSV / JSON / TXT（含元素名稱與含量即可）。正式版將由後端核驗訂單編號與實驗室檔案後出具，此處為前端模擬。';
  }
}

// 文件選擇與解析
$('dataUploadBox').addEventListener('click', () => $('dataFileInput').click());
$('dataFileInput').addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    const ext = (f.name.split('.').pop() || '').toLowerCase();
    const parsed = parseElementData(String(reader.result), ext);
    applyParsed(parsed, f.name);
  };
  reader.readAsText(f);
});
$('useSampleBtn').addEventListener('click', () => {
  demoIndex = (demoIndex + 1) % DEMO_SAMPLES.length;
  const s = DEMO_SAMPLES[demoIndex];
  applyParsed(sampleToParsed(s), s.label, s.sampleName, s.sampleType);
});
function applyParsed(parsed, fileName, sampleName, sampleType) {
  const hasData = Object.keys(parsed.oxides).length || Object.keys(parsed.traces).length;
  currentParsed = parsed;
  currentSampleInfo = { name: sampleName || fileName || '客戶上傳樣品', type: sampleType || '待定' };
  $('genReportBtn').disabled = !hasData;
  if (!hasData) {
    $('uploadHint').textContent = '⚠ 未能從文件中識別元素數據。請確認文件包含元素名稱與含量（如 SiO2、Fe2O3、Rb、Pb 等），或點擊「使用示例數據演示」。';
    return;
  }
  const cnt = Object.keys(parsed.oxides).length + Object.keys(parsed.traces).length;
  $('uploadHint').textContent = `✓ 已識別 ${cnt} 項元素數據（主量 ${Object.keys(parsed.oxides).length} 項 / 微量 ${Object.keys(parsed.traces).length} 項）${sampleName ? ' · ' + sampleName : ' · ' + fileName}。點擊「生成專業分析報告」。`;
}
$('genReportBtn').addEventListener('click', () => {
  if (!currentParsed) return;
  const isCertified = mode === 'ours' || mode === 'buy';
  const now = new Date();
  const dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  const reportNo = (isCertified ? 'HJ-XRF-' : 'HJ-EXT-') + now.getTime().toString().slice(-8) + (mode === 'external' ? '-R' : '');
  const meta = {
    certified: isCertified,
    reportNo,
    source: mode === 'external' ? '客戶自送（外部機構檢測）' : '壺鑒合作實驗室（本機構）',
    sampleName: currentSampleInfo ? currentSampleInfo.name : DEMO_SAMPLES[0].sampleName,
    sampleType: currentSampleInfo ? currentSampleInfo.type : DEMO_SAMPLES[0].sampleType,
    owner: '壺鑒註冊用戶（示例）',
    date: dateStr,
    pkgName: mode === 'buy' && selectedPkg ? selectedPkg.name : (mode === 'ours' ? '本機構檢測數據核驗' : '外部數據解讀'),
    method: 'X 射線螢光光譜分析（XRF / EDXRF）',
    instrument: '能量色散 XRF 光譜儀 · XL3t 系列（模擬）'
  };
  currentAnalysis = analyzeSample(currentParsed, meta);
  currentMeta = meta;
  renderReportStage();
});

// ---------- 購買流程：套餐 → 訂單 → 物流 ----------
const pkgGrid = $('pkgGrid');
packages.forEach(p => {
  const el = document.createElement('div');
  el.className = 'pkg';
  el.dataset.id = p.id;
  el.innerHTML = `<h3>${p.name}</h3><div class="price">¥${p.price}</div><ul>${p.items.map(i => '<li>' + i + '</li>').join('')}</ul>`;
  el.addEventListener('click', () => {
    document.querySelectorAll('.pkg').forEach(x => x.classList.remove('selected'));
    el.classList.add('selected');
    selectedPkg = p;
    $('orderBtn').disabled = false;
  });
  pkgGrid.appendChild(el);
});

const steps = [
  { t: '下單成功', d: '訂單已生成，等待順豐上門取件。' },
  { t: '順豐已取件', d: '快遞員已上門取壺，正發往北京合作實驗室。' },
  { t: '已送達實驗室', d: '實驗室確認收到樣品，登記入庫。' },
  { t: 'XRF 光譜分析中', d: '儀器正在測定二氧化矽、三氧化二鐵等元素含量。' },
  { t: '數據回傳，生成報告', d: '實驗室已錄入元素數據，正在生成蓋章權威報告。' },
];
const timelineBox = $('timelineBox');
function renderTimeline() {
  timelineBox.innerHTML = '';
  steps.forEach((s, i) => {
    const wrap = document.createElement('div');
    const state = i < currentStep ? 'done' : i === currentStep ? 'current' : '';
    wrap.innerHTML = `<div class="t-step ${state}"><div class="t-dot"></div><div class="t-body"><h4>${s.t}</h4><p>${s.d}</p></div></div>`;
    timelineBox.appendChild(wrap);
  });
}

$('orderBtn').addEventListener('click', () => {
  show('pkgStage', false); show('trackStage', true);
  $('orderNo').textContent = '#HJ' + Math.floor(100000 + Math.random() * 899999);
  $('pkgNameTag').textContent = selectedPkg.name + ' · ¥' + selectedPkg.price;
  currentStep = 0;
  renderTimeline();
});

$('advanceBtn').addEventListener('click', (e) => {
  currentStep++;
  if (currentStep >= steps.length) {
    renderTimeline();
    // 檢測完成：以本機構示例數據生成蓋章報告
    const s = DEMO_SAMPLES[0];
    currentParsed = sampleToParsed(s);
    const now = new Date();
    const dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    currentMeta = {
      certified: true,
      reportNo: 'HJ-XRF-' + now.getTime().toString().slice(-8),
      source: '壺鑒合作實驗室（本機構）',
      sampleName: s.sampleName,
      sampleType: s.sampleType,
      owner: '壺鑒註冊用戶（示例）',
      date: dateStr,
      pkgName: selectedPkg.name,
      method: 'X 射線螢光光譜分析（XRF / EDXRF）',
      instrument: '能量色散 XRF 光譜儀 · XL3t 系列（模擬）'
    };
    currentAnalysis = analyzeSample(currentParsed, currentMeta);
    renderReportStage();
    return;
  }
  renderTimeline();
  if (currentStep >= steps.length - 1) e.target.textContent = '生成蓋章分析報告 →';
});

// ---------- 報告階段 ----------
function renderReportStage() {
  show('trackStage', false); show('uploadStage', false); show('entryStage', false);
  show('pkgStage', false); show('reportStage', true);
  $('analysisReport').innerHTML = renderReport(currentAnalysis, currentMeta);
  // 檢測結果不理想時，向商城頁引流（漏斗第三層）
  const risky = currentAnalysis.verdictLevel !== 'good';
  $('mallBanner').style.display = risky ? 'block' : 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$('reportBackBtn').addEventListener('click', () => {
  if (mode === 'buy') { show('reportStage', false); show('entryStage', true); }
  else { resetToEntry(); }
});

$('shareBtn').addEventListener('click', async () => {
  const a = currentAnalysis, m = currentMeta;
  const text = `壺鑒紫砂元素分析報告 ${m.reportNo}\n樣品：${m.sampleName}\n產地歸屬：${a.matched.name}（${a.matched.prob}%）\n純淨度：${a.purityGrade} 級 ${a.purityScore} 分\n綜合判定：${a.verdict}`;
  try {
    if (navigator.share) await navigator.share({ title: '壺鑒 · 紫砂元素分析報告', text });
    else { await navigator.clipboard.writeText(text); alert('報告摘要已複製'); }
  } catch (e) { alert('報告摘要：\n' + text); }
});

$('printBtn').addEventListener('click', () => window.print());

// ---------- 初始：入口可見 ----------
resetToEntry();
