// ---------- 頁面導航切換 ----------
const views = document.querySelectorAll('.view');
const navBtns = document.querySelectorAll('#nav button');

function goto(name){
  views.forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
  navBtns.forEach(b => b.classList.toggle('active', b.dataset.view === name));
  window.scrollTo({ top: 0 });
}

navBtns.forEach(b => b.addEventListener('click', () => goto(b.dataset.view)));
document.querySelectorAll('[data-goto]').forEach(b =>
  b.addEventListener('click', () => goto(b.dataset.goto))
);
