// ---------- 首頁：紫砂壺文化與數字展廳 ----------

// 四大名泥（科普用，可自行擴充或替換為真實圖文/短視頻/3D模型連結）
const clays = [
  { name:'底槽青', origin:'黃龍山礦層最底部', color:'#4B3244', desc:'含雲母顆粒較多，燒成後呈紫中帶青，質感沉穩顆粒感強，公認為紫泥中的上品。' },
  { name:'大紅袍', origin:'趙莊台西一帶', color:'#9C4030', desc:'朱泥中的極品，含鐵量高，燒成收縮率極大、成品率低，色澤紅豔如朱砂。' },
  { name:'本山綠泥', origin:'黃龍山礦層中段', color:'#8C8A5E', desc:'燒成後呈米黃泛綠，胎質細膩，傳統上常用作花貨的化妝土裝飾。' },
  { name:'趙莊朱泥', origin:'趙莊山', color:'#B5624A', desc:'澄泥製成，收縮率極高，成品多嬌小玲瓏，色澤朱紅溫潤，泡養後包漿明顯。' },
];

// 經典器型（可替換 svg 為真實器型圖 / 短視頻封面 / 3D 模型嵌入）
const shapes = [
  { name:'西施壺', era:'花貨經典', desc:'壺身豐潤飽滿，仿西施浴後卧姿，壺嘴短巧，是花貨與光素兼備的代表器型。' },
  { name:'石瓢壺', era:'曼生十八式', desc:'三角幾何構圖，壺身如鐘，古樸大氣，歷代名家皆有各自演繹版本。' },
  { name:'供春壺', era:'明代開山之作', desc:'相傳為明代供春所創，壺身仿老樹癭瘤紋理，是紫砂「花貨」的起點。' },
  { name:'掇球壺', era:'光貨試金石', desc:'三球疊置的經典光素器型，講究圓潤飽滿、比例協調，最考驗基本功。' },
  { name:'仿古壺', era:'光貨經典', desc:'壺身扁圓敦厚，線條簡練有力，考驗匠人對「圓」與「勢」的把握。' },
  { name:'龍蛋壺', era:'簡約一氣', desc:'壺身如蛋形，線條流暢一氣呵成，造型簡約卻極考驗手工功力。' },
];

// 名家堂：歷代真實名家（史載事實性介紹）+ 當代虛構工藝師示例
const masters = [
  { name:'供春', era:'明代', desc:'相傳為紫砂壺「開山鼻祖」，樹癭壺傳世稀少，樹瘤紋理為其標誌性風格。' },
  { name:'時大彬', era:'明代', desc:'將紫砂壺從大件改良為便於文人把玩的小品，奠定「文人壺」傳統。' },
  { name:'陳鳴遠', era:'清代', desc:'花貨巨匠，善於將瓜果草蟲等自然形態融入壺藝，作品寫實生動。' },
  { name:'陳曼生', era:'清代', desc:'與楊彭年合作創「曼生十八式」，將金石書畫與壺藝結合，開文人壺新風。' },
  { name:'顧景舟', era:'近現代', desc:'現代紫砂「七大老藝人」之一，以嚴謹造型與精湛工藝被譽為「壺藝泰斗」。' },
  { name:'陳明遠', era:'當代（示例）', desc:'本站合作工藝師示例檔案，擅長光素器型，代表作見臻品商城。' },
  { name:'吳雅蘭', era:'當代（示例）', desc:'本站合作工藝師示例檔案，擅長花貨寫實器型。' },
  { name:'周文濤', era:'當代（示例）', desc:'本站合作工藝師示例檔案，擅長朱泥小品壺。' },
];

// ---- 四大名泥標籤頁 ----
const clayTabs = document.getElementById('clayTabs');
const clayPanel = document.getElementById('clayPanel');
function renderClay(idx){
  const c = clays[idx];
  clayPanel.innerHTML = `
    <div class="clay-swatch" style="background:${c.color};"></div>
    <div>
      <h3>${c.name}</h3>
      <p class="origin">產地：${c.origin}</p>
      <p class="desc">${c.desc}</p>
    </div>`;
  [...clayTabs.children].forEach((b,i)=>b.classList.toggle('active', i===idx));
}
clays.forEach((c,i)=>{
  const b=document.createElement('button');
  b.textContent=c.name;
  b.addEventListener('click',()=>renderClay(i));
  clayTabs.appendChild(b);
});
renderClay(0);

// ---- 經典器型卡片 ----
const shapeGrid = document.getElementById('shapeGrid');
shapes.forEach(s=>{
  const el=document.createElement('div');
  el.className='shape-card';
  el.innerHTML=`
    <svg viewBox="0 0 100 100"><path d="M20 55 Q20 40 50 40 Q80 40 80 55 L78 75 Q78 85 50 85 Q22 85 22 75 Z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M80 50 Q92 50 92 58 Q92 66 80 64" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>
    <h4>${s.name}</h4>
    <p class="era">${s.era}</p>
    <p>${s.desc}</p>`;
  shapeGrid.appendChild(el);
});

// ---- 名家堂：印章卡片 + 搜索 ----
const masterGrid = document.getElementById('masterGrid');
masters.forEach(m=>{
  const el=document.createElement('div');
  el.className='master-card';
  el.dataset.name=m.name;
  el.innerHTML=`
    <div class="seal">${m.name[0]}</div>
    <h4>${m.name}</h4>
    <p class="era">${m.era}</p>
    <p>${m.desc}</p>`;
  masterGrid.appendChild(el);
});
document.getElementById('masterSearch').addEventListener('input', (e)=>{
  const q = e.target.value.trim();
  document.querySelectorAll('.master-card').forEach(card=>{
    card.classList.toggle('hidden', q && !card.dataset.name.includes(q));
  });
});

// ---------- 首頁 2.0：滾動漸現動效 ----------
(function revealOnScroll(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  // 1) 板塊與銜接元素
  document.querySelectorAll('#view-home [data-reveal]').forEach(el => el.classList.add('reveal-init'));
  // 2) 板塊內子元素：卡片錯落漸現
  const staggerGroups = ['.shape-grid', '.master-grid', '.funnel', '.hall-panel', '.tab-strip'];
  staggerGroups.forEach(sel => {
    document.querySelectorAll('#view-home ' + sel).forEach(group => {
      [...group.children].forEach((child, i) => {
        child.classList.add('reveal-init');
        child.style.transitionDelay = Math.min(0.08 * i, 0.5) + 's';
      });
    });
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('revealed');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('#view-home .reveal-init').forEach(el => io.observe(el));
})();

// ---------- 首頁 2.0：水印字滾動視差（緩慢漂移） ----------
(function parallaxWatermark(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  const marks = [...document.querySelectorAll('#view-home .watermark-cn')];
  if (!marks.length) return;
  let ticking = false;
  const update = () => {
    marks.forEach(m => {
      const r = m.getBoundingClientRect();
      const vpMid = window.innerHeight / 2;
      const elMid = r.top + r.height / 2;
      const off = (elMid - vpMid) * 0.05; // 緩慢漂移，最大約 ±90px
      m.style.transform = 'translateY(' + Math.max(-110, Math.min(110, off)) + 'px)';
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();
