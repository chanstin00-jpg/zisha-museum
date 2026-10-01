/* ============================================================
   壺鑒 HuJian · 紫砂元素分析報告生成引擎（前端模擬版）
   -----------------------------------------------------------------
   · 全部數據為前端演示（mock），參考區間取自公開文獻與行業資料：
     - 宜興紫砂地理標誌範圍：SiO₂ ≤70%、Al₂O₃ ≥11%
     - 黃龍山系主量元素典型範圍（SiO₂ 50–65%、Al₂O₃ 18–29%、Fe₂O₃ 3–18%）
     - Rb/Sr 比值與黃龍山礦層深度相關（深層 >1.8）
     - 產地特徵元素：K、Ca、As、Rb、Sr、Y、Zr
     - 化工添加篩查：Ba、Mn、Cr、Co、Ti、Sb、Cu、Zr、Zn
     - 重金屬監控：Pb、Cd、As、Hg
   · 對接真實後端時，僅需替換 CLAY_PROFILES 與計算輸入來源（儀器實測數據）。
   ============================================================ */

// ---------- 泥料類型參考資料庫 ----------
// p: 主量氧化物典型值（wt%）；rbsr: Rb/Sr 參考比值（礦層深度指數）；zrY: Zr/Y 參考比值
const CLAY_PROFILES = [
  {
    id: 'dcq', name: '黃龍山底槽青', rarity: 5, rarityNote: '黃龍山最底層紫泥，礦源稀缺、練泥繁複，被譽為紫泥之冠，市場稀缺度極高。',
    tea: ['熟普洱', '老白茶', '武夷岩茶', '黑茶', '紅茶'], teaNote: '胎質緻密而透氣適中，能醇化湯感、聚香不悶，最宜陳年發酵類茶。',
    p: { SiO2: 56.5, Al2O3: 24.9, Fe2O3: 8.2, TiO2: 1.02, CaO: 0.50, MgO: 0.42, K2O: 1.30, Na2O: 0.36, MnO: 0.09 },
    rbsr: 2.2, zrY: 7.8
  },
  {
    id: 'zl', name: '黃龍山紫泥', rarity: 3, rarityNote: '宜興最常見的原礦紫泥，礦源相對充足，但優質深井料仍逐年減少。',
    tea: ['普洱熟茶', '黑茶', '武夷岩茶', '老白茶', '紅茶'], teaNote: '透氣性適中、性格溫和，幾乎不挑茶，為「萬金油」型泥料。',
    p: { SiO2: 57.6, Al2O3: 24.1, Fe2O3: 8.7, TiO2: 1.08, CaO: 0.56, MgO: 0.48, K2O: 1.27, Na2O: 0.42, MnO: 0.11 },
    rbsr: 1.7, zrY: 7.5
  },
  {
    id: 'lvn', name: '本山綠泥', rarity: 4, rarityNote: '產自黃龍山礦層中段，儲量少且常與紫泥共生，純淨綠泥難得。',
    tea: ['綠茶', '生普洱', '新白茶', '黃茶'], teaNote: '燒成胎質細膩、透氣性佳，能保留茶湯清鮮本味，適合不發酵或輕發酵茶。',
    p: { SiO2: 60.8, Al2O3: 22.4, Fe2O3: 4.0, TiO2: 0.72, CaO: 0.80, MgO: 0.62, K2O: 1.50, Na2O: 0.55, MnO: 0.06 },
    rbsr: 1.2, zrY: 7.2
  },
  {
    id: 'zz', name: '趙莊朱泥', rarity: 4, rarityNote: '朱泥收縮率極高、成品率低，精品小壺數量稀少，市場追捧度高。',
    tea: ['高香烏龍（鐵觀音）', '鳳凰單叢', '高山烏龍', '高香型紅茶'], teaNote: '密度高、聚香性強，能集中並升華茶香，最宜香氣型茶類。',
    p: { SiO2: 52.6, Al2O3: 20.8, Fe2O3: 14.5, TiO2: 1.35, CaO: 1.05, MgO: 0.35, K2O: 1.05, Na2O: 0.28, MnO: 0.16 },
    rbsr: 0.9, zrY: 6.6
  },
  {
    id: 'dhp', name: '大紅袍朱泥', rarity: 5, rarityNote: '朱泥中的極品，含鐵量極高、收縮極大，成品率極低，一壺難求。',
    tea: ['鳳凰單叢', '高香烏龍', '武夷岩茶（輕焙火）', '紅茶'], teaNote: '胎體緊實、傳熱快、聚香最強，適合香氣高揚的茶，沖泡時注意控制水溫。',
    p: { SiO2: 50.8, Al2O3: 19.6, Fe2O3: 17.8, TiO2: 1.50, CaO: 1.20, MgO: 0.30, K2O: 0.90, Na2O: 0.22, MnO: 0.20 },
    rbsr: 0.8, zrY: 6.2
  },
  {
    id: 'duan', name: '段泥（團泥）', rarity: 3, rarityNote: '紫泥與綠泥共生礦，產量中等，砂性明顯，古樸耐看。',
    tea: ['綠茶', '生普洱', '新白茶', '黃茶', '輕焙火烏龍'], teaNote: '含砂量高、透氣性最強，泡茶時茶葉充分舒展，湯感清透。',
    p: { SiO2: 63.8, Al2O3: 20.6, Fe2O3: 4.6, TiO2: 0.90, CaO: 0.75, MgO: 0.55, K2O: 1.40, Na2O: 0.50, MnO: 0.05 },
    rbsr: 1.0, zrY: 6.9
  },
  {
    id: 'kz', name: '喀左紫砂', rarity: 2, rarityNote: '遼寧喀左礦源，品質接近宜興紫砂但歷史與文化稀缺度較低。',
    tea: ['普洱熟茶', '紅茶', '黑茶'], teaNote: '泥性接近紫泥，透氣性尚可，價格親民，適合作日常口糧壺。',
    p: { SiO2: 59.8, Al2O3: 19.5, Fe2O3: 7.8, TiO2: 0.80, CaO: 2.20, MgO: 0.70, K2O: 1.10, Na2O: 0.30, MnO: 0.10 },
    rbsr: 0.6, zrY: 5.8
  },
  {
    id: 'gd', name: '廣德紫砂', rarity: 2, rarityNote: '安徽廣德礦源，與宜興礦脈相近，成分相似但稀缺度遜於黃龍山。',
    tea: ['普洱熟茶', '黑茶', '武夷岩茶', '紅茶'], teaNote: '成分接近黃龍山紫泥，透氣適中，性價比之選。',
    p: { SiO2: 58.0, Al2O3: 22.8, Fe2O3: 8.9, TiO2: 1.15, CaO: 0.40, MgO: 0.50, K2O: 1.15, Na2O: 0.40, MnO: 0.12 },
    rbsr: 1.4, zrY: 7.0
  }
];

// 疑似調配 / 化工泥：無法匹配任何原礦檔案時的歸屬去向
const MIXED_PROFILE = {
  id: 'mixed', name: '疑似調配泥 / 化工泥', rarity: 1,
  rarityNote: '檢出異常添加特徵，無法對應已知原礦檔案，市場價值與安全性存疑。',
  tea: [], teaNote: '存在化工添加風險，不建議日常泡飲，建議先確認安全性。',
  p: null, rbsr: null, zrY: null
};

// 主量氧化物判讀規則（單位 wt%）
const OXIDE_RULES = {
  SiO2: { range: [50, 65], name: '二氧化矽', note: v => v > 65 ? '石英骨架偏高，砂性較重、成型難度大；若 >70 已偏離宜興紫砂地標範圍（≤70）。' : v < 50 ? '矽質偏低，燒結緻密度高，透氣性可能偏弱。' : '處於宜興紫砂典型範圍，骨架與透氣平衡良好。' },
  Al2O3: { range: [18, 29], name: '氧化鋁', note: v => v < 11 ? '鋁含量顯著低於宜興紫砂地標下限（≥11），耐高溫性與緻密度存疑。' : v < 18 ? '鋁質略低，胎體強度一般。' : v > 29 ? '鋁含量偏高，胎體緻密，燒結溫度需求高。' : '處於黃龍山系典型範圍，耐火度與緻密度良好。' },
  Fe2O3: { range: [6, 14], name: '氧化鐵', note: v => v > 14 ? '鐵含量高，呈色深豔（傾向朱泥/紅泥譜系），收縮率大。' : v < 6 ? '鐵含量偏低，呈色淺（傾向段泥/綠泥譜系）。' : '鐵含量處於紫泥譜系典型範圍，呈色沉穩。' },
  TiO2: { range: [0.6, 1.6], name: '二氧化鈦', note: v => v > 1.6 ? '鈦含量偏高，需留意是否添加鈦白調色。' : v < 0.6 ? '鈦含量低，色澤傾向素淨。' : '鈦含量正常，未見鈦系調色特徵。' },
  CaO: { range: [0.2, 1.5], name: '氧化鈣', note: v => v > 2.5 ? '鈣含量顯著偏高，偏離宜興礦源特徵，需考慮是否為外埠礦料或添加輔料。' : v > 1.5 ? '鈣含量略高，可能影響燒結溫度與色澤。' : '鈣含量正常。' },
  MgO: { range: [0.2, 0.8], name: '氧化鎂', note: v => v > 0.8 ? '鎂含量偏高，胎體可能偏粗。' : '鎂含量正常。' },
  K2O: { range: [0.7, 1.8], name: '氧化鉀', note: v => '鉀主要來自雲母礦物，含量反映顆粒質感與燒結特性：' + (v > 1.8 ? '偏高，雲母顆粒多，砂感明顯。' : v < 0.7 ? '偏低，顆粒感弱。' : '正常，雲母比例適中。') },
  Na2O: { range: [0.15, 0.7], name: '氧化鈉', note: v => v > 0.7 ? '鈉含量偏高，需留意是否引入長石類助熔劑。' : '鈉含量正常。' },
  MnO: { range: [0.02, 0.25], name: '氧化錳', note: v => v > 0.8 ? '錳含量異常偏高，強烈提示添加氧化錳調色（化工特徵）。' : v > 0.25 ? '錳含量略高，建議留意。' : '錳含量正常。' },
  P2O5: { range: [0.02, 0.25], name: '五氧化二磷', note: v => v > 0.3 ? '磷含量偏高，可能來源於含磷添加物，建議留意。' : '磷含量正常。' }
};

// 微量元素（ppm）篩查規則
const TRACE_RULES = {
  Rb:  { name: '銣', note: '產地特徵元素；與 Sr 的比值反映黃龍山礦層深度。' },
  Sr:  { name: '鍶', note: '產地特徵元素；與 Rb 共同構成礦層深度指數。' },
  Zr:  { name: '鋯', note: '產地岩相特徵元素；過高（>450ppm）需留意氧化鋯類添加。', high: 450 },
  Y:   { name: '釔', note: '產地岩相特徵元素，與 Zr 比值常用於礦源比對。' },
  Ba:  { name: '鋇', note: '碳酸鋇為常見化工添加劑（用於除鐵增白），>400ppm 需高度警惕。', high: 400 },
  Cr:  { name: '鉻', note: '鉻為化工著色常見元素，>120ppm 提示添加風險。', high: 120 },
  Co:  { name: '鈷', note: '鈷常作為藍色調色劑，>60ppm 提示添加風險。', high: 60 },
  Ni:  { name: '鎳', note: '鎳含量異常多與工業污染或添加有關，>120ppm 需留意。', high: 120 },
  Cu:  { name: '銅', note: '銅常作綠色調色劑，>250ppm 提示添加風險。', high: 250 },
  Zn:  { name: '鋅', note: '鋅含量偏高提示工業原料混入，>350ppm 需留意。', high: 350 },
  Pb:  { name: '鉛', note: '重金屬鉛：>20ppm 即超出安全監控建議，存在遷移風險。', high: 20, heavy: true },
  Cd:  { name: '鎘', note: '重金屬鎘：>5ppm 即超出安全監控建議。', high: 5, heavy: true },
  As:  { name: '砷', note: '重金屬砷：>12ppm 即超出安全監控建議；微量砷亦具產地指示意義。', high: 12, heavy: true },
  Hg:  { name: '汞', note: '重金屬汞：>1.5ppm 即超出安全監控建議。', high: 1.5, heavy: true },
  Sb:  { name: '銻', note: '銻常作乳濁/阻燃添加，>8ppm 提示化工添加風險。', high: 8 }
};

// 特徵比值定義
const RATIO_DEFS = [
  { key: 'SiAl', name: 'Si / Al 骨架比', calc: d => d.SiO2 / d.Al2O3, ref: [2.2, 2.7],
    note: (v, r) => v > r[1] ? '石英骨架偏多，砂性重、透氣強，泡養包漿較慢。' : v < r[0] ? '鋁質偏高，胎體緻密、燒結度高，透氣性偏弱。' : '骨架與鋁質比例均衡，成型與透氣俱佳。' },
  { key: 'FeAl', name: 'Fe / Al 呈色比', calc: d => d.Fe2O3 / d.Al2O3, ref: [0.30, 0.45],
    note: (v, r) => v > r[1] ? '鐵相對偏高，呈色深豔，傾向朱泥譜系。' : v < r[0] ? '鐵相對偏低，呈色淺淡，傾向段泥/綠泥譜系。' : '呈色沉穩，典型紫泥譜系特徵。' },
  { key: 'RbSr', name: 'Rb / Sr 礦層指數', calc: d => d.Rb / d.Sr, ref: [0.9, 1.8],
    note: (v, r) => v > r[1] ? '指示黃龍山深層礦料特徵（深井料），礦源稀缺度高。' : v < r[0] ? '指示淺層礦或外埠礦料特徵。' : '指示黃龍山系中層礦料特徵。' },
  { key: 'ZrY', name: 'Zr / Y 岩相比', calc: d => d.Zr / d.Y, ref: [6.5, 9.0],
    note: (v, r) => v > r[1] ? '偏離宜興黃龍山系典型岩相，需考慮非宜興礦源。' : v < r[0] ? '岩相比偏低，礦源歸屬需謹慎。' : '符合宜興黃龍山系典型岩相特徵。' },
  { key: 'TiFe', name: 'Ti / Fe 鈦鐵比', calc: d => d.TiO2 / d.Fe2O3, ref: [0.10, 0.16],
    note: (v, r) => v > r[1] ? '鈦相對偏高，傾向段泥/綠泥或含鈦調色，呈色偏淡。' : v < r[0] ? '鐵相對偏高，傾向朱泥譜系，呈色豔麗。' : '鈦鐵比例正常。' },
  { key: 'KNa', name: 'K / Na 雲母比', calc: d => d.K2O / d.Na2O, ref: [2.0, 3.5],
    note: (v, r) => v > r[1] ? '雲母礦物比例高，顆粒感與砂感明顯。' : v < r[0] ? '鈉相對偏高，可能引入長石類輔料。' : '雲母比例正常。' }
];

// ---------- 元素別名表（用於解析外部文件） ----------
const ELEM_ALIAS = {
  'sio2': 'SiO2', '二氧化矽': 'SiO2', '氧化矽': 'SiO2', '矽': 'SiO2', 'si': 'SiO2',
  'al2o3': 'Al2O3', '三氧化二鋁': 'Al2O3', '氧化鋁': 'Al2O3', '鋁': 'Al2O3', 'al': 'Al2O3',
  'fe2o3': 'Fe2O3', '三氧化二鐵': 'Fe2O3', '氧化鐵': 'Fe2O3', '鐵': 'Fe2O3', 'fe': 'Fe2O3',
  'tio2': 'TiO2', '二氧化鈦': 'TiO2', '氧化鈦': 'TiO2', '鈦': 'TiO2', 'ti': 'TiO2',
  'cao': 'CaO', '氧化鈣': 'CaO', '鈣': 'CaO', 'ca': 'CaO',
  'mgo': 'MgO', '氧化鎂': 'MgO', '鎂': 'MgO', 'mg': 'MgO',
  'k2o': 'K2O', '氧化鉀': 'K2O', '鉀': 'K2O', 'k': 'K2O',
  'na2o': 'Na2O', '氧化鈉': 'Na2O', '鈉': 'Na2O', 'na': 'Na2O',
  'mno': 'MnO', '氧化錳': 'MnO', '錳': 'Mn', 'mn': 'Mn',
  'p2o5': 'P2O5', '五氧化二磷': 'P2O5', '磷': 'P2O5', 'p': 'P2O5',
  'rb': 'Rb', '銣': 'Rb', 'sr': 'Sr', '鍶': 'Sr', 'zr': 'Zr', '鋯': 'Zr',
  'y': 'Y', '釔': 'Y', 'ba': 'Ba', '鋇': 'Ba', 'cr': 'Cr', '鉻': 'Cr',
  'co': 'Co', '鈷': 'Co', 'ni': 'Ni', '鎳': 'Ni', 'cu': 'Cu', '銅': 'Cu',
  'zn': 'Zn', '鋅': 'Zn', 'pb': 'Pb', '鉛': 'Pb', 'cd': 'Cd', '鎘': 'Cd',
  'as': 'As', '砷': 'As', 'hg': 'Hg', '汞': 'Hg', 'sb': 'Sb', '銻': 'Sb'
};
const OXIDE_KEYS = ['SiO2', 'Al2O3', 'Fe2O3', 'TiO2', 'CaO', 'MgO', 'K2O', 'Na2O', 'MnO', 'P2O5'];
const TRACE_KEYS = ['Rb', 'Sr', 'Zr', 'Y', 'Ba', 'Cr', 'Co', 'Ni', 'Cu', 'Zn', 'Pb', 'Cd', 'As', 'Hg', 'Sb'];

// ---------- 數據解析 ----------
// 將任意輸入文字解析為 { oxides:{}, traces:{} }
function parseElementData(text, ext) {
  const out = { oxides: {}, traces: {} };
  const put = (keyRaw, val) => {
    const key = (ELEM_ALIAS[keyRaw.trim().toLowerCase()] || ELEM_ALIAS[keyRaw.trim()]);
    if (!key || !isFinite(val)) return;
    const v = Number(val);
    if (OXIDE_KEYS.includes(key)) out.oxides[key] = v;
    else if (TRACE_KEYS.includes(key)) out.traces[key] = v;
  };
  text = (text || '').replace(/\r/g, '').trim();
  if (!text) return out;

  // 1) JSON
  if (/^\s*[\[{]/.test(text)) {
    try {
      const j = JSON.parse(text);
      const arr = Array.isArray(j) ? j : [j];
      arr.forEach(obj => {
        Object.keys(obj).forEach(k => {
          const v = obj[k];
          if (typeof v === 'number') put(k, v);
          else if (typeof v === 'string' && !isNaN(parseFloat(v))) put(k, parseFloat(v));
        });
        // 陣列物件形式：{element: "SiO2", value: 57.6}
        const el = obj.element || obj.元素 || obj.name || obj['元素名稱'];
        if (el) put(el, parseFloat(obj.value ?? obj.含量 ?? obj.val ?? obj.數值));
      });
      return out;
    } catch (e) { /* 非合法 JSON，繼續按文字解析 */ }
  }

  // 2) 逐行解析：支援 "SiO2,57.63" / "SiO2 57.63%" / "二氧化矽 = 57.63"
  const lines = text.split('\n');
  // 跳過表頭行
  lines.forEach((line, i) => {
    const l = line.trim();
    if (!l || /^(元素|element|名稱|name|項目|成分|參數|含量|value|wt|%|oxide|成分組成)/i.test(l) && i === 0) return;
    // 格式1: 名稱 數字
    let m = l.match(/^([A-Za-z\u4e00-\u9fa5]{1,12}(?:2O3|O2|O5|2O5|O|2O)?)\s*[:=，,、\s]\s*([-+]?\d+(?:\.\d+)?)\s*(?:%|ppm|wt%|wt|％)?/);
    if (!m) m = l.match(/^([A-Za-z\u4e00-\u9fa5]{1,12}(?:2O3|O2|O5|2O5|O|2O)?)\s+([-+]?\d+(?:\.\d+)?)\s*(?:%|ppm|wt%|wt|％)?/);
    if (m) { put(m[1], m[2]); return; }
    // 格式2: 編號,名稱,含量
    const parts = l.split(/[,，\t;]/).map(s => s.trim());
    if (parts.length >= 2) {
      const name = parts.find(p => /[A-Za-z\u4e00-\u9fa5]/.test(p) && !/^\d+$/.test(p));
      const val = parts.find(p => /^-?\d+(\.\d+)?$/.test(p));
      if (name && val) put(name, val);
    }
  });
  return out;
}

// ---------- 分析計算 ----------
function analyzeSample(parsed, meta) {
  const ox = parsed.oxides || {};
  const tr = parsed.traces || {};

  // 1) 主量元素判讀
  const oxideRows = OXIDE_KEYS.map(k => {
    const v = ox[k];
    const rule = OXIDE_RULES[k];
    return v == null ? null : {
      code: k, name: rule.name, value: v, unit: '%',
      range: rule.range,
      status: v > rule.range[1] ? '偏高' : v < rule.range[0] ? '偏低' : '正常',
      note: rule.note(v)
    };
  }).filter(Boolean);

  // 2) 微量 / 化工添加 / 重金屬篩查
  const traceRows = TRACE_KEYS.map(k => {
    const v = tr[k];
    const rule = TRACE_RULES[k];
    if (v == null) return null;
    const flagged = rule.high != null && v > rule.high;
    return { code: k, name: rule.name, value: v, unit: 'ppm', flagged: !!flagged, heavy: !!rule.heavy, note: rule.note, status: flagged ? '異常' : '正常' };
  }).filter(Boolean);
  const additiveFlags = traceRows.filter(t => t.flagged && !t.heavy);
  const heavyFlags = traceRows.filter(t => t.flagged && t.heavy);
  const oxideAnomalies = oxideRows.filter(o => o.status !== '正常');

  // 3) 產地歸屬概率（僅用可用主量氧化物 + Rb/Sr + Zr/Y）
  const keys = OXIDE_KEYS.filter(k => ox[k] != null);
  let sims = CLAY_PROFILES.map(prof => {
    let d = 0, n = 0;
    keys.forEach(k => {
      const base = prof.p[k];
      if (base == null) return;
      d += Math.pow((ox[k] - base) / base, 2);
      n++;
    });
    if (tr.Rb != null && tr.Sr != null && prof.rbsr) { d += Math.pow((tr.Rb / tr.Sr - prof.rbsr) / prof.rbsr, 2) * 1.2; n += 1.2; }
    if (tr.Zr != null && tr.Y != null && prof.zrY) { d += Math.pow((tr.Zr / tr.Y - prof.zrY) / prof.zrY, 2) * 1.0; n += 1.0; }
    return { prof, d: n ? Math.sqrt(d / n) : 1 };
  });
  // 化工風險加成：異常越多，原礦擬合越不可信
  const riskPenalty = additiveFlags.length + heavyFlags.length * 1.5 + oxideAnomalies.filter(o => ['MnO', 'CaO', 'TiO2'].includes(o.code)).length * 0.5;
  sims.forEach(s => { s.d += riskPenalty * 0.18; });
  const minD = Math.min(...sims.map(s => s.d));
  const raw = sims.map(s => ({ prof: s.prof, s: Math.exp(-(s.d - minD) / 0.09) }));
  const sumS = raw.reduce((a, x) => a + x.s, 0);
  const attrib = raw.map(x => ({ name: x.prof.name, id: x.prof.id, prob: Math.round(x.s / sumS * 1000) / 10 })).sort((a, b) => b.prob - a.prob);

  // 化工風險改判：異常特徵明顯時，無論氧化物多接近原礦檔案，一律改判疑似調配泥
  const riskLevel = heavyFlags.length + Math.min(additiveFlags.length, 3)
    + oxideAnomalies.filter(o => ['MnO', 'TiO2', 'CaO'].includes(o.code)).length;
  if (riskLevel >= 3) {
    const mixedProb = Math.min(92, Math.max(55, 40 + riskLevel * 9));
    const restSum = attrib.reduce((a, x) => a + x.prob, 0);
    const factor = (100 - mixedProb) / (restSum || 1);
    const scaled = attrib.map(a => ({ ...a, prob: Math.round(a.prob * factor * 10) / 10 }));
    scaled.unshift({ name: MIXED_PROFILE.name, id: 'mixed', prob: mixedProb });
    attrib.length = 0;
    attrib.push(...scaled);
  }
  const matched = attrib[0];
  const topProfile = CLAY_PROFILES.find(p => p.id === matched.id && matched.id !== 'mixed') || null;

  // 4) 純淨度
  const flagCount = additiveFlags.length + heavyFlags.length;
  let purityScore, purityGrade, purityText;
  if (heavyFlags.length > 0 || flagCount >= 3) {
    purityScore = 55 - flagCount * 5; purityGrade = 'C';
    purityText = '檢出' + [...heavyFlags, ...additiveFlags].map(t => t.name + '(' + t.code + ')').join('、') + '異常，存在化工調配 / 重金屬風險，不建議日常泡養使用。';
  } else if (flagCount === 2) {
    purityScore = 72; purityGrade = 'B';
    purityText = '檢出' + additiveFlags.map(t => t.name + '(' + t.code + ')').join('、') + '偏高，需留意，建議複檢確認。';
  } else if (flagCount === 1) {
    purityScore = 84; purityGrade = 'B';
    purityText = '檢出' + additiveFlags[0].name + '(' + additiveFlags[0].code + ')略高，整體潔淨，建議留意長期使用情況。';
  } else {
    purityScore = 92 + (oxideAnomalies.length ? -4 : 4); purityGrade = 'A';
    purityText = '未檢出化工添加劑與重金屬風險特徵，泥料潔淨度良好，符合原礦特徵。';
  }
  purityScore = Math.max(35, Math.min(98, purityScore));

  // 5) 稀缺度
  let rarityStars = topProfile ? topProfile.rarity : 1;
  if (purityGrade === 'B') rarityStars = Math.max(1, rarityStars - 1);
  if (purityGrade === 'C') rarityStars = 1;
  const rarityNote = matched.id === 'mixed'
    ? MIXED_PROFILE.rarityNote
    : topProfile.rarityNote + (purityGrade !== 'A' ? '（受純淨度影響，稀缺度評級下調）' : '');

  // 6) 適茶性
  const teaNote = matched.id === 'mixed' || purityGrade === 'C'
    ? '存在化工添加 / 重金屬風險，不建議日常泡飲；建議先完成安全性確認或更換正品。'
    : (topProfile ? topProfile.teaNote : '');

  // 7) 特徵比值
  const ratioRows = RATIO_DEFS.map(r => {
    const need = r.key === 'RbSr' ? [tr.Rb, tr.Sr] : r.key === 'ZrY' ? [tr.Zr, tr.Y] : null;
    let v = null;
    if (need) v = (need[0] != null && need[1] != null) ? need[0] / need[1] : null;
    else v = (ox[r.key === 'SiAl' ? 'SiO2' : r.key === 'FeAl' ? 'Fe2O3' : r.key === 'TiFe' ? 'TiO2' : r.key === 'KNa' ? 'K2O' : 'SiO2'] != null
      && ox[r.key === 'SiAl' ? 'Al2O3' : r.key === 'FeAl' ? 'Al2O3' : r.key === 'TiFe' ? 'Fe2O3' : r.key === 'KNa' ? 'Na2O' : 'Al2O3'] != null)
      ? ox[r.key === 'SiAl' ? 'SiO2' : r.key === 'FeAl' ? 'Fe2O3' : r.key === 'TiFe' ? 'TiO2' : r.key === 'KNa' ? 'K2O' : 'SiO2'] / ox[r.key === 'SiAl' ? 'Al2O3' : r.key === 'FeAl' ? 'Al2O3' : r.key === 'TiFe' ? 'Fe2O3' : r.key === 'KNa' ? 'Na2O' : 'Al2O3']
      : null;
    if (v == null) return null;
    const status = v > r.ref[1] ? '偏高' : v < r.ref[0] ? '偏低' : '正常';
    return { key: r.key, name: r.name, value: v, ref: r.ref, status, note: r.note(v, r.ref) };
  }).filter(Boolean);

  // 8) 綜合判定
  let verdict, verdictLevel;
  if (matched.id === 'mixed' || purityGrade === 'C') {
    verdict = '樣品檢出化工添加 / 重金屬風險特徵，無法歸屬於已知原礦檔案，判定為「疑似調配泥 / 化工泥」，不建議日常泡養使用。';
    verdictLevel = 'danger';
  } else if (purityGrade === 'B') {
    verdict = '樣品特徵基本符合「' + matched.name + '」，但' + (additiveFlags.map(t => t.name).join('、') || '個別指標') + '需留意，建議複檢確認後再長期使用。';
    verdictLevel = 'warn';
  } else if (matched.prob >= 55) {
    verdict = '樣品元素特徵與「' + matched.name + '」擬合度高（' + matched.prob + '%），未見化工添加與重金屬風險，判定為原礦紫砂，可正常泡養使用。';
    verdictLevel = 'good';
  } else {
    verdict = '樣品元素特徵與已知檔案擬合度中等（「' + matched.name + '」' + matched.prob + '%），未見明顯化工風險，建議結合工藝特徵綜合判斷。';
    verdictLevel = 'warn';
  }

  // 9) 數字 DNA
  const dna = buildDNA(parsed);

  return {
    meta, ox, tr,
    oxideRows, traceRows, additiveFlags, heavyFlags,
    attrib, matched, topProfile,
    purityScore, purityGrade, purityText,
    rarityStars, rarityNote,
    teaNote, ratioRows,
    verdict, verdictLevel,
    dna
  };
}

// ---------- 數字 DNA（確定性哈希 + 指紋圖） ----------
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 0x01000193) >>> 0; }
  return h >>> 0;
}
function buildDNA(parsed) {
  const all = {};
  Object.keys(parsed.oxides).forEach(k => all[k] = parsed.oxides[k]);
  Object.keys(parsed.traces).forEach(k => all[k] = parsed.traces[k]);
  const canon = Object.keys(all).sort().map(k => k + ':' + all[k].toFixed(3)).join('|');
  const h1 = fnv1a(canon).toString(16).padStart(8, '0').toUpperCase();
  const h2 = fnv1a(canon.split('').reverse().join('')).toString(16).padStart(8, '0').toUpperCase();
  const id = 'HJ-DNA-' + h1.slice(0, 4) + '-' + h1.slice(4) + '-' + h2.slice(0, 4) + '-' + h2.slice(4);
  // 8×6 指紋格
  let bits = '';
  for (let i = 0; i < 48; i++) bits += ((fnv1a(canon + '#' + i) >> (i % 31)) & 1) ? '1' : '0';
  return { id, hex: h1 + h2, cells: bits };
}

// ---------- 雷達圖（SVG） ----------
function radarSVG(keys, stdVals, smpVals, stdLabel, smpLabel, size) {
  size = size || 260;
  const cx = size / 2, cy = size / 2, r = size * 0.34;
  const total = keys.length;
  const pt = (i, v) => {
    const a = (Math.PI * 2 * i / total) - Math.PI / 2;
    const rr = r * Math.max(0, Math.min(100, v)) / 100;
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
  };
  let svg = `<svg viewBox="0 0 ${size} ${size}" width="100%" style="max-width:${size}px;">`;
  for (let ring = 1; ring <= 4; ring++) {
    const pts = keys.map((_, i) => pt(i, ring * 25).join(',')).join(' ');
    svg += `<polygon points="${pts}" fill="none" stroke="#D8CDB8" stroke-width="1"/>`;
  }
  keys.forEach((_, i) => {
    const [x, y] = pt(i, 100);
    svg += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#D8CDB8" stroke-width="1"/>`;
  });
  const std = stdVals.map((v, i) => pt(i, v).join(',')).join(' ');
  const smp = smpVals.map((v, i) => pt(i, v).join(',')).join(' ');
  svg += `<polygon points="${std}" fill="none" stroke="#C89A42" stroke-width="1.6" stroke-dasharray="5 4"/>`;
  svg += `<polygon points="${smp}" fill="rgba(122,58,42,0.22)" stroke="#7A3A2A" stroke-width="2"/>`;
  keys.forEach((k, i) => {
    const [x, y] = pt(i, 118);
    svg += `<text x="${x}" y="${y}" font-size="11" fill="#5C4E3F" text-anchor="middle">${k}</text>`;
  });
  svg += `</svg>`;
  return { svg, std, smp };
}

// ---------- 報告渲染 ----------
// meta: { reportNo, certified, source, sampleName, sampleType, owner, date, pkgName, method, instrument }
function renderReport(analysis, meta) {
  const { oxideRows, traceRows, attrib, matched, purityScore, purityGrade, purityText, rarityStars, rarityNote, teaNote, ratioRows, verdict, verdictLevel, dna } = analysis;
  const { certified, reportNo, source, sampleName, sampleType, owner, date, pkgName, method, instrument } = meta;
  const stampImg = 'assets/認證蓋章.png';

  // 雷達（取前 5 個可用氧化物）
  const radarKeys = ['SiO2', 'Al2O3', 'Fe2O3', 'TiO2', 'MnO'].filter(k => analysis.ox[k] != null);
  const stdVals = radarKeys.map(k => (analysis.topProfile && analysis.topProfile.p[k] != null) ? analysis.topProfile.p[k] / (OXIDE_RULES[k].range[1]) * 100 : 60);
  const smpVals = radarKeys.map(k => analysis.ox[k] / (OXIDE_RULES[k].range[1]) * 100);
  const radar = radarSVG(radarKeys, stdVals, smpVals, '標準檔案', '本樣本');

  // 產地概率條
  const probBars = attrib.map(a => {
    const isTop = a.name === matched.name;
    const pct = Math.min(100, Math.max(4, a.prob));
    return `<div class="r-prob-row"><span class="r-prob-name">${a.name}${isTop ? ' <em class="r-top">最可能</em>' : ''}</span><div class="r-prob-bar"><i style="width:${pct}%;${isTop ? 'background:#7A3A2A;' : ''}"></i></div><span class="r-prob-val">${a.prob}%</span></div>`;
  }).join('');

  // 純淨度條
  const purityBarColor = purityGrade === 'A' ? 'linear-gradient(90deg,#4C7A4A,#6FA36B)' : purityGrade === 'B' ? 'linear-gradient(90deg,#C89A42,#E0BC66)' : 'linear-gradient(90deg,#B5462F,#D97A55)';

  // 稀缺度星級
  const stars = Array.from({ length: 5 }, (_, i) => `<i class="${i < rarityStars ? 'on' : ''}"></i>`).join('');

  // 微量元素表（化工/重金屬）
  const traceTable = traceRows.length
    ? `<table class="r-table"><thead><tr><th>元素</th><th>含量 (ppm)</th><th>監控參考</th><th>判定</th></tr></thead><tbody>` +
      traceRows.map(t => `<tr class="${t.flagged ? 'row-flag' : ''}"><td>${t.code} ${t.name}</td><td>${t.value}</td><td>${t.heavy ? '重金屬安全' : '添加劑監控'}${t.flagged ? ' ≤' + t.note ? '' : '' : ''}</td><td><span class="r-badge ${t.flagged ? 'badge-danger' : 'badge-ok'}">${t.status}</span></td></tr>`).join('') +
      `</tbody></table>`
    : `<p class="r-empty">數據文件中未包含微量元素（ppm）數據，本項略。</p>`;

  // 指紋格
  const cells = dna.cells.split('').map(b => `<i class="${b === '1' ? 'on' : ''}"></i>`).join('');

  const stampHtml = certified
    ? `<div class="r-stamp"><img src="${stampImg}" alt="機構認證蓋章"><span>國科華翰 · 認證檢測機構</span></div>`
    : `<div class="r-nostamp"><span>未蓋章</span><p>數據來源：客戶自送（非本機構檢測）<br>本報告僅供參考，不具機構認證效力</p></div>`;

  const riskBanner = verdictLevel === 'danger'
    ? `<div class="r-risk danger">⚠ 綜合判定：${verdict}</div>`
    : verdictLevel === 'warn'
      ? `<div class="r-risk warn">△ 綜合判定：${verdict}</div>`
      : `<div class="r-risk good">✓ 綜合判定：${verdict}</div>`;

  return `
  <div class="report-paper${certified ? '' : ' report-uncertified'}">
    ${certified ? '' : `<div class="watermark-tape">非本機構檢測 · 僅供參考</div>`}
    <!-- 報告頭部 -->
    <header class="r-head">
      <div class="r-brand">
        <span class="r-logo">壺</span>
        <div><h1>壺鑒 HuJian</h1><p>紫砂壺元素光譜分析報告</p></div>
      </div>
      <div class="r-meta">
        <div><span>報告編號</span><b>${reportNo}</b></div>
        <div><span>報告日期</span><b>${date}</b></div>
        <div><span>報告性質</span><b>${certified ? '正式報告（已蓋章）' : '參考解讀（未蓋章）'}</b></div>
        <div><span>數據來源</span><b>${source}</b></div>
      </div>
    </header>

    <section class="r-sec">
      <h2><span>01</span>樣品資訊</h2>
      <table class="r-table">
        <tbody>
          <tr><td class="r-th">樣品名稱</td><td>${sampleName}</td><td class="r-th">樣品類別</td><td>${sampleType}</td></tr>
          <tr><td class="r-th">委託人</td><td>${owner}</td><td class="r-th">檢測方法</td><td>${method}</td></tr>
          <tr><td class="r-th">分析儀器</td><td>${instrument}</td><td class="r-th">檢測套餐</td><td>${pkgName || '—'}</td></tr>
          <tr><td class="r-th">檢測狀態</td><td colspan="3">${certified ? '本機構實驗室完成檢測，數據已核驗存檔' : '客戶自送數據，系統自動識別，未經本機構實驗室核驗'}</td></tr>
        </tbody>
      </table>
    </section>

    <section class="r-sec">
      <h2><span>02</span>元素含量</h2>
      <p class="r-note">X 射線螢光光譜（XRF）為無損檢測，下表為樣品主量氧化物含量（wt%）與參考範圍比對。</p>
      <table class="r-table">
        <thead><tr><th>氧化物</th><th>含量 (wt%)</th><th>參考範圍</th><th>判定</th><th>簡要判讀</th></tr></thead>
        <tbody>
          ${oxideRows.map(o => `<tr class="${o.status !== '正常' ? 'row-flag' : ''}"><td>${o.code} ${o.name}</td><td><b>${o.value.toFixed(2)}</b></td><td>${o.range[0]} – ${o.range[1]}</td><td><span class="r-badge ${o.status === '正常' ? 'badge-ok' : 'badge-warn'}">${o.status}</span></td><td class="r-cell-note">${o.note}</td></tr>`).join('')}
        </tbody>
      </table>
      <h3 class="r-sub">微量元素與安全監控</h3>
      ${traceTable}
    </section>

    <section class="r-sec">
      <h2><span>03</span>元素分析結果</h2>
      <div class="r-grid2">
        <div class="r-card">
          <h3>核心元素擬合雷達</h3>
          ${radar.svg}
          <div class="legend"><span><i style="background:#7A3A2A;"></i>本樣本</span><span><i style="background:#C89A42;"></i>${matched.id === 'mixed' ? '原礦典型區間' : matched.name + ' 檔案'}</span></div>
        </div>
        <div class="r-card">
          <h3>關鍵結論</h3>
          <ul class="r-findings">
            <li><b>主量元素</b>：${oxideAnomalySummary(oxideRows)}</li>
            <li><b>化工添加篩查</b>：${analysis.additiveFlags.length ? '檢出 ' + analysis.additiveFlags.map(t => t.name + '(' + t.code + ')').join('、') + ' 異常' : '未檢出明顯化工添加特徵'}</li>
            <li><b>重金屬監控</b>：${analysis.heavyFlags.length ? '檢出 ' + analysis.heavyFlags.map(t => t.name + '(' + t.code + ')').join('、') + ' 超標' : '鉛、鎘、砷、汞均未超標'}</li>
            <li><b>綜合判定</b>：${verdict}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="r-sec">
      <h2><span>04</span>特徵比值計算</h2>
      <table class="r-table">
        <thead><tr><th>比值</th><th>樣本值</th><th>參考區間</th><th>判定</th><th>地質 / 工藝意義</th></tr></thead>
        <tbody>
          ${ratioRows.map(r => `<tr class="${r.status !== '正常' ? 'row-flag' : ''}"><td>${r.name}</td><td><b>${r.value.toFixed(2)}</b></td><td>${r.ref[0]} – ${r.ref[1]}</td><td><span class="r-badge ${r.status === '正常' ? 'badge-ok' : 'badge-warn'}">${r.status}</span></td><td class="r-cell-note">${r.note}</td></tr>`).join('')}
        </tbody>
      </table>
      <p class="r-note">Rb/Sr 比值是現行紫砂科技鑑定中推斷黃龍山礦層深度的常用指標；Zr/Y、K/Na、Ti/Fe 等比值用於岩相與產地比對。</p>
    </section>

    <section class="r-sec">
      <h2><span>05</span>產地歸屬概率</h2>
      <div class="r-grid2">
        <div>
          <h3 class="r-sub">與已知礦源檔案比對</h3>
          ${probBars}
          <p class="r-note">概率由主量元素歐氏距離 + 特徵比值（Rb/Sr、Zr/Y）加權計算，並依化工異常程度懲罰原礦擬合。</p>
        </div>
        <div class="r-card r-verdict-card">
          <h3>產地歸屬結論</h3>
          <p class="r-big">${matched.name}</p>
          <p>擬合概率 <b>${matched.prob}%</b></p>
          ${matched.id === 'mixed' ? '<p class="r-warn-text">未匹配到已知原礦檔案，建議結合工藝特徵與流通渠道綜合判斷。</p>' : ''}
        </div>
      </div>
    </section>

    <section class="r-sec">
      <h2><span>06</span>純淨度</h2>
      <div class="r-grid2">
        <div class="r-card">
          <h3>純淨度綜合評分</h3>
          <div class="r-bigscore"><b style="color:${purityGrade === 'A' ? '#4C7A4A' : purityGrade === 'B' ? '#B8860B' : '#B5462F'};">${purityScore}</b><span>/ 100</span></div>
          <div class="r-purity-track"><i style="width:${purityScore}%; background:${purityBarColor};"></i></div>
          <p>等級：<span class="r-grade grade-${purityGrade}">${purityGrade} 級</span></p>
        </div>
        <div class="r-card">
          <h3>純淨度判讀</h3>
          <p>${purityText}</p>
          <p class="r-note">判定依據：化工添加劑（Ba、Mn、Cr、Co、Ti、Sb、Cu、Zr、Zn）與重金屬（Pb、Cd、As、Hg）篩查結果。</p>
        </div>
      </div>
    </section>

    <section class="r-sec">
      <h2><span>07</span>稀缺度</h2>
      <div class="r-grid2">
        <div class="r-card">
          <h3>稀缺度評級</h3>
          <div class="r-stars">${stars}</div>
          <p>${rarityStars} / 5 星</p>
        </div>
        <div class="r-card">
          <h3>稀缺度說明</h3>
          <p>${rarityNote}</p>
          <p class="r-note">稀缺度由「泥料種類市場稀缺度」×「純淨度」綜合評定，星級越高收藏與流通價值越高。</p>
        </div>
      </div>
    </section>

    <section class="r-sec">
      <h2><span>08</span>適茶性</h2>
      <div class="r-card">
        <h3>推薦茶類與泡養建議</h3>
        <p>${teaNote}</p>
        ${matched.id !== 'mixed' && purityGrade !== 'C' ? `<p class="r-note">推薦茶類：${teaList(analysis.topProfile)}</p>` : ''}
      </div>
    </section>

    <section class="r-sec">
      <h2><span>09</span>數字 DNA</h2>
      <div class="r-grid2">
        <div class="r-card">
          <h3>數字指紋</h3>
          <div class="r-dna">${cells}</div>
          <p class="r-dna-id">${dna.id}</p>
        </div>
        <div class="r-card">
          <h3>防偽說明</h3>
          <p>數字 DNA 由樣品全部元素含量經雜湊演算法（FNV-1a 雙重加鹽）生成，任何一個元素值變動都會導致指紋完全改變，用於證書防篡改與跨平台溯源比對。</p>
          <p class="r-note">可於「壺鑒」資料庫輸入此指紋核驗報告真偽（上線後開放）。</p>
        </div>
      </div>
    </section>

    ${riskBanner}

    <!-- 簽章區 -->
    <section class="r-sec r-sign">
      <h2><span>10</span>檢測簽章</h2>
      <div class="r-sign-wrap">
        <div class="r-sign-item"><p>檢測員</p><b>${'HJ-' + reportNo.slice(-4) + '-A'}</b><span>（電子簽名）</span></div>
        <div class="r-sign-item"><p>審核員</p><b>${'HJ-' + reportNo.slice(-4) + '-B'}</b><span>（電子簽名）</span></div>
        <div class="r-sign-item"><p>檢測機構</p><b>壺鑒 · 國科華翰合作實驗室</b><span>${certified ? '已用印' : '未用印'}</span></div>
      </div>
      ${stampHtml}
      <div class="r-qr"></div>
      <p class="r-foot">本報告僅對送檢樣品負責。報告數據可於官網輸入報告編號核驗。<br>壺鑒 HuJian · 光譜檢測中心　|　${reportNo}　|　${date}</p>
    </section>
  </div>`;
}

function oxideAnomalySummary(rows) {
  const bad = rows.filter(r => r.status !== '正常');
  if (!bad.length) return '各主量氧化物均在參考範圍內，符合宜興紫砂地標特徵';
  return bad.map(r => r.code + ' ' + r.status).join('、') + '，詳見上表';
}
function teaList(prof) {
  return prof && prof.tea && prof.tea.length ? prof.tea.join('、') : '—';
}

// 示例數據集（用於演示 / 購買流程模擬）
const DEMO_SAMPLES = [
  {
    label: '示例 A · 黃龍山底槽青（優質原礦）',
    sampleName: '石瓢壺（示例樣本 A）', sampleType: '紫泥類 · 光貨器型',
    oxides: { SiO2: 56.8, Al2O3: 24.6, Fe2O3: 8.3, TiO2: 1.05, CaO: 0.52, MgO: 0.45, K2O: 1.24, Na2O: 0.38, MnO: 0.10, P2O5: 0.11 },
    traces: { Rb: 198, Sr: 92, Zr: 205, Y: 27, Ba: 96, Cr: 18, Co: 9, Ni: 26, Cu: 15, Zn: 58, Pb: 6, As: 3, Hg: 0.4, Sb: 0.8 }
  },
  {
    label: '示例 B · 趙莊朱泥（高香聚香型）',
    sampleName: '掇球壺（示例樣本 B）', sampleType: '朱泥類 · 光貨器型',
    oxides: { SiO2: 52.9, Al2O3: 20.6, Fe2O3: 14.3, TiO2: 1.32, CaO: 1.02, MgO: 0.36, K2O: 1.06, Na2O: 0.29, MnO: 0.17, P2O5: 0.13 },
    traces: { Rb: 128, Sr: 142, Zr: 186, Y: 28, Ba: 88, Cr: 15, Co: 8, Ni: 24, Cu: 12, Zn: 52, Pb: 5, As: 2, Hg: 0.3, Sb: 0.6 }
  },
  {
    label: '示例 C · 疑似化工調配泥（風險樣本）',
    sampleName: '仿古壺（示例樣本 C）', sampleType: '紫泥類（待核）',
    oxides: { SiO2: 55.2, Al2O3: 23.1, Fe2O3: 11.6, TiO2: 1.85, CaO: 0.9, MgO: 0.5, K2O: 1.1, Na2O: 0.45, MnO: 0.92, P2O5: 0.2 },
    traces: { Rb: 150, Sr: 175, Zr: 420, Y: 40, Ba: 620, Cr: 145, Co: 18, Ni: 95, Cu: 210, Zn: 380, Pb: 28, Cd: 6, As: 9, Hg: 1.2, Sb: 6.5 }
  }
];

// 由示例數據構建 parsed 物件
function sampleToParsed(s) {
  return { oxides: { ...s.oxides }, traces: { ...s.traces } };
}
