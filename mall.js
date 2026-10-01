// ---------- 臻品原礦商城（模擬商品數據，之後接入真實電商/傭金系統） ----------
const products = [
  { name: '黃龍山底槽青 · 石瓢壺', maker: '工藝師 陳明遠', price: '¥3,280' },
  { name: '本山綠泥 · 西施壺', maker: '工藝師 吳雅蘭', price: '¥2,150' },
  { name: '趙莊朱泥 · 掇球壺', maker: '工藝師 周文濤', price: '¥4,600' },
  { name: '底槽青 · 仿古壺', maker: '工藝師 陳明遠', price: '¥3,880' },
  { name: '降坡泥 · 龍蛋壺', maker: '工藝師 李振宇', price: '¥1,980' },
  { name: '紫泥 · 一粒珠', maker: '工藝師 吳雅蘭', price: '¥2,680' },
];

const mallGrid = document.getElementById('mallGrid');
products.forEach(p => {
  mallGrid.innerHTML += `<div class="prod"><div class="prod-img"><svg width="40%" viewBox="0 0 100 100"><path d="M20 55 Q20 40 50 40 Q80 40 80 55 L78 75 Q78 85 50 85 Q22 85 22 75 Z" fill="none" stroke="var(--clay-deep)" stroke-width="2"/></svg></div><div class="prod-body"><span class="badge">官方溯源</span><h4>${p.name}</h4><p class="maker">${p.maker}</p><div class="price">${p.price}</div></div></div>`;
});

// 頁面首次載入時默認隱藏「避坑」橫幅，僅在光譜檢測判定不佳時由 spectral.js 顯示
document.getElementById('mallBanner').style.display = 'none';
