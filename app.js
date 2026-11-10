/* Special Me — concept site (Lumagen) */
const POSTS = (window.SM_POSTS || []).slice().sort((a, b) => b.d - a.d);
const BY = Object.fromEntries(POSTS.map(p => [p.c, p]));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const TG = 'https://t.me/joinchat/QcfK1xF6C5TyHZl8';
const DM = 'https://ig.me/m/special_me_uz';
const store = { get: (k, d) => { try { const v = localStorage.getItem('sm_' + k); return v == null ? d : JSON.parse(v); } catch (_) { return d; } }, set: (k, v) => { try { localStorage.setItem('sm_' + k, JSON.stringify(v)); } catch (_) {} } };

const STORES = [
  { id: 'minor', name: 'Minor', tel: '+998958110077', telT: '+998 95 811-00-77',
    addr: { ru: 'Markaz-5, 54', uz: 'Markaz-5, 54' },
    land: { ru: 'Ориентир — метро Минор', uz: 'Mo‘ljal — Minor metrosi' },
    q: 'Ташкент, Центр-5, 54, метро Минор' },
  { id: 'efendi', name: 'Efendi', tel: '+998958117700', telT: '+998 95 811-77-00',
    addr: { ru: 'ул. Садыка Азимова, 72', uz: 'Sodiq Azimov ko‘chasi, 72' },
    land: { ru: 'Напротив ресторана Efendi', uz: 'Efendi restorani ro‘parasida' },
    q: 'Ташкент, улица Садыка Азимова, 72' }
];

const I = {
  ru: {
    skip: 'К новинкам', navRail: 'Вешалка', navFeed: 'Новинки', navStores: 'Магазины', bag: 'Примерка',
    kicker: 'Женская одежда, Ташкент', h1: 'Новая коллекция приходит почти каждый день',
    lede: 'Смотрите образы, выбирайте размер и магазин — и напишите нам, чтобы уточнить наличие или отложить вещь на примерку.',
    ctaFeed: 'Смотреть новинки', ctaStores: 'Выбрать магазин', ask: 'Уточнить размер и наличие',
    railH: 'Вешалка недели', railP: 'Листайте — вешалка поворачивается. Нажмите на вещь, чтобы выбрать размер и магазин.',
    feedH: 'Новинки по дням', feedP: 'Всё, что появилось в Instagram за последние недели. Наличие и размеры меняются быстро — уточняйте в магазине.',
    fAll: 'Все', fReel: 'С видео', fSizes: 'Размеры указаны', more: 'Показать ещё',
    storesH: 'Два магазина, одни часы', storesP: 'Оба магазина работают с 10:00 до 20:00. Выберите удобный — он подставится в ваше сообщение.',
    newsH: 'Новинки — сначала в Telegram и Instagram', newsP: 'Новые вещи появляются почти каждый день. Подпишитесь, чтобы видеть их первыми, или напишите в Direct.',
    tgGroup: 'Telegram-группа', direct: 'Написать в Direct', footHours: 'Магазины открыты с 10:00 до 20:00', concept: 'Концепт сайта · Lumagen',
    fStore: 'Магазин', fIntent: 'Что нужно', fWhen: 'Когда удобно прийти', fMsg: 'Сообщение — можно изменить',
    aTg: 'Telegram', aDm: 'Instagram Direct', aCopy: 'Скопировать текст',
    check: 'Уточнить наличие', hold: 'Отложить на примерку', today: 'Сегодня', tomorrow: 'Завтра', later: 'Другой день',
    sizeHelp: 'Не знаю размер', fSize: 'Размер', item: 'Новинка', prem: 'Новинка Premium',
    reelOf: d => `Рилс от ${d}`, pubOf: d => `Публикация от ${d}`, itemOf: d => `новинка от ${d}`,
    sizesIn: s => `Размеры в публикации: ${s}.`, sizesNo: 'Размеры в публикации не указаны — спросите у продавца.',
    price: p => `Цена в публикации: ${p} сум.`, ig: 'Пост в Instagram',
    call: s => `Позвонить в ${s}`, route: 'Маршрут', pick: 'Выбрать этот магазин', picked: 'Выбран для сообщений',
    addBag: 'Добавить в примерку', inBag: 'В списке примерки — открыть', bagTitle: 'Список примерки',
    bagEmpty: 'Список пуст. Нажмите «Добавить в примерку» у любой вещи.', bagSub: n => `${n} ${plural(n, ['вещь', 'вещи', 'вещей'])} — одно сообщение в выбранный магазин.`,
    remove: 'Убрать', clear: 'Очистить список', added: 'Добавлено в примерку', copied: 'Текст скопирован',
    copiedTg: 'Текст скопирован — вставьте его в Telegram', copiedDm: 'Текст скопирован — вставьте его в Direct',
    open: 'Открыто до 20:00', soon: 'Откроется в 10:00', closed: 'Сейчас закрыто, откроется в 10:00',
    close: 'Закрыть', reels: 'Рилсы', lastPost: d => `последняя — ${d}`, count: n => `${n} ${plural(n, ['новинка', 'новинки', 'новинок'])}`,
    msgHi: 'Здравствуйте! Пишу с сайта Special Me.', msgCheck: 'Хочу уточнить наличие:', msgHold: 'Прошу отложить на примерку:',
    msgSize: s => `размер ${s}`, msgSizeHelp: 'подскажите размер', msgStore: 'Магазин', msgWhen: 'Приду', msgBye: 'Спасибо!',
    months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    wd: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
  },
  uz: {
    skip: 'Yangiliklarga', navRail: 'Ilgich', navFeed: 'Yangiliklar', navStores: 'Do‘konlar', bag: 'Kiyib ko‘rish',
    kicker: 'Ayollar kiyimi, Toshkent', h1: 'Yangi kolleksiya deyarli har kuni keladi',
    lede: 'Obrazlarni ko‘ring, o‘lcham va do‘konni tanlang — mavjudligini bilish yoki kiyib ko‘rishga olib qo‘yish uchun bizga yozing.',
    ctaFeed: 'Yangiliklarni ko‘rish', ctaStores: 'Do‘konni tanlash', ask: 'O‘lcham va mavjudligini bilish',
    railH: 'Hafta ilgichi', railP: 'Pastga suring — ilgich aylanadi. O‘lcham va do‘konni tanlash uchun kiyimni bosing.',
    feedH: 'Kunma-kun yangiliklar', feedP: 'So‘nggi haftalarda Instagramda chiqqan barcha yangiliklar. Mavjudlik va o‘lchamlar tez o‘zgaradi — do‘kondan aniqlang.',
    fAll: 'Hammasi', fReel: 'Videoli', fSizes: 'O‘lchami ko‘rsatilgan', more: 'Yana ko‘rsatish',
    storesH: 'Ikki do‘kon, bir xil ish vaqti', storesP: 'Ikkala do‘kon ham 10:00 dan 20:00 gacha ishlaydi. Qulayini tanlang — u xabaringizga qo‘shiladi.',
    newsH: 'Yangiliklar — avval Telegram va Instagramda', newsP: 'Yangi kiyimlar deyarli har kuni chiqadi. Birinchilardan bo‘lib ko‘rish uchun obuna bo‘ling yoki Directga yozing.',
    tgGroup: 'Telegram guruhi', direct: 'Directga yozish', footHours: 'Do‘konlar 10:00 dan 20:00 gacha ochiq', concept: 'Sayt konsepti · Lumagen',
    fStore: 'Do‘kon', fIntent: 'Nima kerak', fWhen: 'Qachon kelish qulay', fMsg: 'Xabar — o‘zgartirish mumkin',
    aTg: 'Telegram', aDm: 'Instagram Direct', aCopy: 'Matnni nusxalash',
    check: 'Mavjudligini bilish', hold: 'Kiyib ko‘rishga olib qo‘yish', today: 'Bugun', tomorrow: 'Ertaga', later: 'Boshqa kun',
    sizeHelp: 'O‘lchamni bilmayman', fSize: 'O‘lcham', item: 'Yangilik', prem: 'Premium yangilik',
    reelOf: d => `${d}dagi rils`, pubOf: d => `${d}dagi e’lon`, itemOf: d => `${d}dagi yangilik`,
    sizesIn: s => `E’londagi o‘lchamlar: ${s}.`, sizesNo: 'E’londa o‘lcham ko‘rsatilmagan — sotuvchidan so‘rang.',
    price: p => `E’londagi narx: ${p} so‘m.`, ig: 'Instagramdagi post',
    call: s => `${s} do‘koniga qo‘ng‘iroq`, route: 'Yo‘nalish', pick: 'Shu do‘konni tanlash', picked: 'Xabarlar uchun tanlangan',
    addBag: 'Kiyib ko‘rish ro‘yxatiga qo‘shish', inBag: 'Ro‘yxatda bor — ochish', bagTitle: 'Kiyib ko‘rish ro‘yxati',
    bagEmpty: 'Ro‘yxat bo‘sh. Istalgan kiyimda «Kiyib ko‘rish ro‘yxatiga qo‘shish»ni bosing.', bagSub: n => `${n} ta kiyim — tanlangan do‘konga bitta xabar.`,
    remove: 'Olib tashlash', clear: 'Ro‘yxatni tozalash', added: 'Ro‘yxatga qo‘shildi', copied: 'Matn nusxalandi',
    copiedTg: 'Matn nusxalandi — uni Telegramga joylang', copiedDm: 'Matn nusxalandi — uni Directga joylang',
    open: '20:00 gacha ochiq', soon: '10:00 da ochiladi', closed: 'Hozir yopiq, 10:00 da ochiladi',
    close: 'Yopish', reels: 'Rilslar', lastPost: d => `oxirgisi — ${d}`, count: n => `${n} ta yangilik`,
    msgHi: 'Assalomu alaykum! Special Me saytidan yozyapman.', msgCheck: 'Mavjudligini bilmoqchiman:', msgHold: 'Kiyib ko‘rish uchun olib qo‘yishingizni so‘rayman:',
    msgSize: s => `o‘lcham ${s}`, msgSizeHelp: 'o‘lchamni maslahat bering', msgStore: 'Do‘kon', msgWhen: 'Kelaman', msgBye: 'Rahmat!',
    months: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
    wd: ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba']
  }
};
function plural(n, f) { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? f[0] : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? f[1] : f[2]; }

/* ---------- language ---------- */
let LANG = (new URLSearchParams(location.search).get('lang') || store.get('lang', 'ru'));
if (!I[LANG]) LANG = 'ru';
const t = k => I[LANG][k];

/* ---------- dates (Asia/Tashkent) ---------- */
const dtf = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tashkent', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
function tkParts(ms) { const o = {}; for (const p of dtf.formatToParts(new Date(ms))) o[p.type] = p.value; return o; }
function dayKey(sec) { const o = tkParts(sec * 1000); return `${o.year}-${o.month}-${o.day}`; }
function fmtDay(key) { const [, m, d] = key.split('-').map(Number); return LANG === 'uz' ? `${d}-${t('months')[m - 1]}` : `${d} ${t('months')[m - 1]}`; }
function weekday(key) { const [y, m, d] = key.split('-').map(Number); return t('wd')[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]; }
const postDay = p => fmtDay(dayKey(p.d));
function tkNowMin() { const f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Tashkent', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()); const h = +f.find(x => x.type === 'hour').value, m = +f.find(x => x.type === 'minute').value; return h * 60 + m; }
function openState() { const m = tkNowMin(); return m >= 600 && m < 1200 ? 'open' : m < 600 ? 'soon' : 'closed'; }

/* ---------- item helpers ---------- */
const title = p => p.t ? p.t[LANG === 'uz' ? 1 : 0] : (p.prem ? t('prem') : t('item'));
const thumb = p => (p.f && p.f[1]) || p.img;
const igUrl = p => `instagram.com/p/${p.c}/`;
const fmtPrice = n => n.toLocaleString('ru-RU').replace(/ /g, ' ');

/* ---------- state ---------- */
let bag = store.get('bag', []).filter(x => BY[x.c]);
let storeId = store.get('store', 'minor');
if (!STORES.find(s => s.id === storeId)) storeId = 'minor';
const st = () => STORES.find(s => s.id === storeId);

/* ---------- toast & copy ---------- */
let toastT;
function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 2600); }
function copy(text) {
  let ok = false;
  try { const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0'; document.body.appendChild(ta); ta.select(); ok = document.execCommand('copy'); ta.remove(); } catch (_) {}
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).catch(() => {});
  return ok || !!navigator.clipboard;
}

/* ---------- static text ---------- */
function applyLang() {
  document.documentElement.lang = LANG === 'uz' ? 'uz-Latn' : 'ru';
  document.title = LANG === 'uz' ? 'Special Me — ayollar kiyimi, Toshkent' : 'Special Me — женская одежда, Ташкент';
  $$('[data-i]').forEach(el => { const v = I[LANG][el.dataset.i]; if (typeof v === 'string') el.textContent = v; });
  $$('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === LANG));
  $$('[data-close].x').forEach(b => b.setAttribute('aria-label', t('close')));
  renderStatus(); renderHeroStores(); renderStores(); renderFeed(); updateReelCap(); hooks.onLang && hooks.onLang();
  if (!$('#sheet').hidden) renderSheet();
}
$$('.lang button').forEach(b => b.addEventListener('click', () => {
  LANG = b.dataset.lang; store.set('lang', LANG);
  const u = new URL(location.href); u.searchParams.set('lang', LANG); history.replaceState(null, '', u);
  applyLang();
}));

function statusText() { return t(openState()); }
function renderStatus() { const s = openState(); $$('.status').forEach(el => { el.textContent = statusText(); el.classList.toggle('open', s === 'open'); }); }
setInterval(renderStatus, 60000);

function renderHeroStores() {
  $('#heroStores').innerHTML = STORES.map(s => `<li><b>${s.name}</b>${s.addr[LANG]}<br><a href="tel:${s.tel}">${s.telT}</a><span class="st status"></span></li>`).join('');
  renderStatusOnly();
}
function renderStatusOnly() { const s = openState(); $$('.status').forEach(el => { el.textContent = statusText(); el.classList.toggle('open', s === 'open'); }); }

function renderStores() {
  $('#storeGrid').innerHTML = STORES.map(s => `
    <article class="store${s.id === storeId ? ' sel' : ''}">
      <h3>${s.name}</h3>
      <p class="addr">${s.addr[LANG]}</p>
      <p class="land">${s.land[LANG]}</p>
      <a class="tel" href="tel:${s.tel}">${s.telT}</a>
      <span class="status"></span>
      <div class="row">
        <a class="btn btn-ink" href="tel:${s.tel}">${t('call')(s.name)}</a>
        <a class="btn btn-line" href="https://yandex.uz/maps/?text=${encodeURIComponent(s.q)}" target="_blank" rel="noopener">${t('route')}</a>
        <button class="btn btn-line pick" type="button" data-store="${s.id}" aria-pressed="${s.id === storeId}">${s.id === storeId ? t('picked') : t('pick')}</button>
      </div>
    </article>`).join('');
  $$('#storeGrid .pick').forEach(b => b.addEventListener('click', () => { storeId = b.dataset.store; store.set('store', storeId); renderStores(); toast(`${st().name}: ${t('picked').toLowerCase()}`); }));
  renderStatusOnly();
}

/* ---------- hero reels ---------- */
const REELS = ['DfUheYot1Cn', 'DeqmmIVNNEv', 'DfFDYKcNWkG', 'DemGd2YNR0t', 'DfR6GQZtl5m', 'DfTsEEst1F5'].filter(c => BY[c] && BY[c].v).map(c => BY[c]);
let reelIdx = 0;
const hooks = {};
function renderReels() {
  $('#reels').innerHTML = REELS.map((p, i) => `<button class="reel" role="tab" type="button" aria-selected="${i === reelIdx}" aria-label="${t('reelOf')(postDay(p))}" data-r="${i}"><img src="${p.f ? p.f[1] : p.img}" alt="" loading="lazy"><i></i></button>`).join('');
  $$('#reels .reel').forEach(b => b.addEventListener('click', () => goReel(+b.dataset.r, true)));
}
function updateReelCap() {
  const p = REELS[reelIdx]; if (!p) return;
  $('#mirrorCap').textContent = t('reelOf')(postDay(p)) + (p.s ? ` · ${p.s.join(', ')}` : '');
  $$('#reels .reel').forEach((b, i) => { b.setAttribute('aria-selected', i === reelIdx); b.setAttribute('aria-label', t('reelOf')(postDay(REELS[i]))); });
}
function setReelProgress(f) { const b = $$('#reels .reel i')[reelIdx]; if (b) b.style.width = (f * 100).toFixed(1) + '%'; }
function goReel(i, user) {
  reelIdx = (i + REELS.length) % REELS.length;
  $$('#reels .reel i').forEach(x => x.style.width = '0');
  updateReelCap();
  if (hooks.mirrorGo) hooks.mirrorGo(reelIdx); else domReel(user);
}
// DOM fallback for mirror
const mv = $('#mirrorVideo');
function domReel(user) {
  const p = REELS[reelIdx];
  mv.poster = '' + (p.f ? p.f[1] : p.img);
  mv.src = '' + p.v;
  if (!RM || user) mv.play().catch(() => {});
}
mv.addEventListener('timeupdate', () => mv.duration && setReelProgress(mv.currentTime / mv.duration));
mv.addEventListener('ended', () => { if (!RM) goReel(reelIdx + 1); });
$('#mirror').addEventListener('click', () => { if (!hooks.mirrorGo) { mv.paused ? mv.play().catch(() => {}) : mv.pause(); } });
$('#mirrorAsk').addEventListener('click', () => openItem(REELS[reelIdx]));

/* ---------- feed ---------- */
let filter = 'all', shown = 36;
function filtered() { return POSTS.filter(p => filter === 'all' || (filter === 'reel' && p.v) || (filter === 'sizes' && p.s)); }
function cardHTML(p) {
  const tags = [];
  if (p.s) tags.push(p.s.join(' '));
  if (p.p) tags.push(fmtPrice(p.p) + (LANG === 'uz' ? ' so‘m' : ' сум'));
  if (p.prem) tags.push('Premium');
  return `<button class="card" type="button" data-c="${p.c}">
    <span class="ph"><img src="${p.img}" alt="${title(p)}" loading="lazy" decoding="async" width="${p.w}" height="${p.h}">
    ${tags.length ? `<span class="tag">${tags.map(x => `<span>${x}</span>`).join('')}</span>` : ''}${p.v ? '<span class="play" aria-hidden="true"></span>' : ''}</span>
    ${p.t ? `<span class="t">${title(p)}</span>` : ''}</button>`;
}
function renderFeed() {
  const list = filtered(); const vis = list.slice(0, shown);
  const groups = []; let cur;
  for (const p of vis) { const k = dayKey(p.d); if (!cur || cur.k !== k) { cur = { k, items: [] }; groups.push(cur); } cur.items.push(p); }
  $('#days').innerHTML = groups.map(g => `<div class="day"><div class="day-h"><b>${fmtDay(g.k)}</b><span>${weekday(g.k)}, ${t('count')(g.items.length)}</span></div><div class="grid">${g.items.map(cardHTML).join('')}</div></div>`).join('');
  $('#moreBtn').hidden = shown >= list.length;
}
$('#days').addEventListener('click', e => { const c = e.target.closest('.card'); if (c) openItem(BY[c.dataset.c], c); });
$('#moreBtn').addEventListener('click', () => { shown += 36; renderFeed(); });
$$('.filters .chip').forEach(b => b.addEventListener('click', () => {
  filter = b.dataset.filter; shown = 36;
  $$('.filters .chip').forEach(x => x.setAttribute('aria-pressed', x === b)); renderFeed();
}));

/* ---------- rail fallback list ---------- */
const RAIL = POSTS.slice(0, 16);
function renderRailList() {
  $('#railList').innerHTML = RAIL.map(p => `<button type="button" data-c="${p.c}"><img src="${thumb(p)}" alt="${title(p)}" loading="lazy"><span>${postDay(p)}</span></button>`).join('');
}
$('#railList').addEventListener('click', e => { const b = e.target.closest('button'); if (b) openItem(BY[b.dataset.c], b); });
let railFocus = 0;
function setRailFocus(i) { railFocus = i; const p = RAIL[i]; $('#railCap').textContent = `${title(p)} · ${postDay(p)}${p.s ? ' · ' + p.s.join(', ') : ''}`; }
$('#railAsk').addEventListener('click', () => openItem(RAIL[railFocus]));
hooks.onLang = () => { setRailFocus(railFocus); renderRailList(); };

/* ---------- sheet (item + fitting list) ---------- */
const sheet = $('#sheet');
let mode = 'item', curPost = null, curSize = null, intent = 'check', when = 'today', lastFocus = null, mediaSel = 0;
function sizesFor(p) { return p.s ? p.s : ['S', 'M', 'L']; }
function openItem(p, from) {
  if (!p) return; mode = 'item'; curPost = p; curSize = null; mediaSel = 0;
  const inB = bag.find(x => x.c === p.c); if (inB) curSize = inB.size;
  openSheet(from);
}
function openBag(from) { mode = 'bag'; openSheet(from); }
function openSheet(from) {
  lastFocus = from || document.activeElement;
  sheet.classList.toggle('bag', mode === 'bag');
  renderSheet(true);
  sheet.hidden = false; document.body.style.overflow = 'hidden';
  hooks.pauseAll && hooks.pauseAll(true);
  if (!RM && window.gsap) { gsap.fromTo('#sheetPanel', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: 'power3.out' }); gsap.fromTo('.sheet-bg', { opacity: 0 }, { opacity: 1, duration: .3 }); }
  setTimeout(() => $('.x', sheet).focus(), 30);
}
function closeSheet() {
  const v = $('video', sheet); if (v) { v.pause(); v.removeAttribute('src'); v.load(); }
  sheet.hidden = true; document.body.style.overflow = '';
  hooks.pauseAll && hooks.pauseAll(false);
  if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
}
sheet.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeSheet(); });
addEventListener('keydown', e => {
  if (sheet.hidden) return;
  if (e.key === 'Escape') closeSheet();
  if (e.key === 'Tab') { const f = $$('button:not([hidden]),a[href],textarea,video[controls]', $('#sheetPanel')).filter(x => x.offsetParent !== null); if (!f.length) return; const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
});

function renderMedia(fresh) {
  const p = curPost, box = $('#sheetMedia');
  const imgs = p.k && p.k.length ? [p.img, ...p.k] : p.v ? [] : [p.img];
  if (fresh) {
    if (p.v) {
      box.innerHTML = `<video src="${p.v}" poster="${p.f ? p.f[0] : p.img}" muted playsinline loop ${RM ? 'controls' : 'autoplay'} preload="metadata"></video>`;
      const v = $('video', box); if (!RM) v.play().catch(() => {});
    } else {
      box.innerHTML = `<img src="${imgs[0]}" alt="${title(p)}">` + (imgs.length > 1 ? `<div class="thumbs">${imgs.map((s, i) => `<button type="button" data-m="${i}" aria-pressed="${i === 0}" aria-label="${i + 1}/${imgs.length}"><img src="${s}" alt=""></button>`).join('')}</div>` : '');
      $$('.thumbs button', box).forEach(b => b.addEventListener('click', () => { $('img', box).src = '' + imgs[+b.dataset.m]; $$('.thumbs button', box).forEach(x => x.setAttribute('aria-pressed', x === b)); }));
    }
  }
}
function seg(el, opts, val, on) {
  el.innerHTML = opts.map(o => `<button type="button" data-v="${o.v}" aria-pressed="${o.v === val}">${o.l}</button>`).join('');
  $$('button', el).forEach(b => b.addEventListener('click', () => on(b.dataset.v)));
}
function sizeOpts(p) { return [...sizesFor(p).map(s => ({ v: s, l: s })), { v: '?', l: t('sizeHelp') }]; }
function renderSheet(fresh) {
  $$('[data-i]', sheet).forEach(el => { const v = I[LANG][el.dataset.i]; if (typeof v === 'string') el.textContent = v; });
  const items = $('#sheetItems');
  if (mode === 'item') {
    const p = curPost;
    if (fresh) renderMedia(true);
    $('#sheetDate').textContent = (p.v ? t('reelOf') : t('pubOf'))(postDay(p));
    $('#sheetTitle').textContent = title(p);
    $('#sheetMeta').innerHTML = `${p.s ? t('sizesIn')(p.s.join(', ')) : t('sizesNo')}${p.p ? ' ' + t('price')(fmtPrice(p.p)) : ''} <a href="https://www.instagram.com/p/${p.c}/" target="_blank" rel="noopener">${t('ig')}</a>`;
    items.innerHTML = `<fieldset class="field"><legend>${t('fSize')}</legend><div class="seg" id="sizePick"></div></fieldset>`;
    seg($('#sizePick'), sizeOpts(p), curSize, v => { curSize = v; const b = bag.find(x => x.c === p.c); if (b) { b.size = v; saveBag(); } renderSheet(); });
    const inB = bag.some(x => x.c === p.c);
    $('#aBag').hidden = false; $('#aBag').textContent = inB ? t('inBag') : t('addBag');
  } else {
    $('#sheetDate').textContent = '';
    $('#sheetTitle').textContent = t('bagTitle');
    $('#sheetMeta').textContent = bag.length ? t('bagSub')(bag.length) : t('bagEmpty');
    items.innerHTML = bag.map((b, i) => { const p = BY[b.c]; return `<div class="bag-item"><img src="${thumb(p)}" alt=""><div><p>${title(p)} · ${postDay(p)}</p><div class="seg" data-bi="${i}"></div></div><button class="rm" type="button" data-rm="${i}">${t('remove')}</button></div>`; }).join('');
    $$('[data-bi]', items).forEach(el => { const i = +el.dataset.bi; seg(el, sizeOpts(BY[bag[i].c]), bag[i].size, v => { bag[i].size = v; saveBag(); renderSheet(); }); });
    $$('[data-rm]', items).forEach(b => b.addEventListener('click', () => { bag.splice(+b.dataset.rm, 1); saveBag(); renderSheet(); }));
    $('#aBag').hidden = !bag.length; $('#aBag').textContent = t('clear');
  }
  $('#storePick').innerHTML = STORES.map(s => `<button type="button" data-s="${s.id}" aria-pressed="${s.id === storeId}"><b>${s.name}</b>${s.addr[LANG]}<br>${s.telT}</button>`).join('');
  $$('#storePick button').forEach(b => b.addEventListener('click', () => { storeId = b.dataset.s; store.set('store', storeId); renderStores(); renderSheet(); }));
  seg($('#intentPick'), [{ v: 'check', l: t('check') }, { v: 'hold', l: t('hold') }], intent, v => { intent = v; renderSheet(); });
  seg($('#whenPick'), [{ v: 'today', l: t('today') }, { v: 'tomorrow', l: t('tomorrow') }, { v: 'later', l: t('later') }], when, v => { when = v; renderSheet(); });
  const s = st();
  $('#aCall').href = 'tel:' + s.tel; $('#aCall').textContent = t('call')(s.name);
  $('#msg').value = compose();
  const empty = mode === 'bag' && !bag.length;
  $$('.actions .btn, #storePick button, #intentPick button, #whenPick button').forEach(b => b.toggleAttribute('disabled', empty));
  $('.actions').style.opacity = empty ? .4 : 1;
}
function compose() {
  const L = I[LANG], s = st();
  const list = mode === 'item' ? [{ c: curPost.c, size: curSize }] : bag;
  const lines = list.map((b, i) => {
    const p = BY[b.c]; const name = p.t ? title(p) : L.itemOf(postDay(p));
    const sz = b.size === '?' ? L.msgSizeHelp : b.size ? L.msgSize(b.size) : L.msgSizeHelp;
    const nm = p.t ? `${name} (${postDay(p)})` : name.charAt(0).toUpperCase() + name.slice(1);
    return `${i + 1}) ${nm}, ${sz} — ${igUrl(p)}`;
  });
  return [L.msgHi, intent === 'hold' ? L.msgHold : L.msgCheck, ...lines, '', `${L.msgStore}: ${s.name} (${s.addr[LANG]})`, `${L.msgWhen}: ${L[when].toLowerCase()}`, L.msgBye].join('\n');
}
$('#aCopy').addEventListener('click', () => { copy($('#msg').value); toast(t('copied')); });
$('#aTg').addEventListener('click', () => { copy($('#msg').value); toast(t('copiedTg')); window.open(TG, '_blank', 'noopener'); });
$('#aDm').addEventListener('click', () => { copy($('#msg').value); toast(t('copiedDm')); window.open(DM, '_blank', 'noopener'); });
$('#aBag').addEventListener('click', () => {
  if (mode === 'bag') { bag = []; saveBag(); renderSheet(); return; }
  if (!bag.some(x => x.c === curPost.c)) { bag.push({ c: curPost.c, size: curSize }); saveBag(); toast(t('added')); renderSheet(); }
  else { const v = $('video', sheet); if (v) v.pause(); mode = 'bag'; sheet.classList.add('bag'); renderSheet(true); }
});
function saveBag() { store.set('bag', bag); const n = $('#bagCount'); n.textContent = bag.length; const b = $('#bagBtn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
$('#bagBtn').addEventListener('click', e => openBag(e.currentTarget));

/* ---------- init ---------- */
renderReels(); renderRailList(); setRailFocus(0);
$('#bagCount').textContent = bag.length;
applyLang();

function glOK() {
  if (RM) return false;
  if (navigator.connection && navigator.connection.saveData) return false;
  if (navigator.deviceMemory && navigator.deviceMemory < 2) return false;
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (_) { return false; }
}
if (glOK()) {
  import('./gl.js').then(G => {
    // mirror: start now (above the fold)
    try {
      const m = G.initMirror($('#mirrorGl'), $('#mirror'), REELS, {
        onEnded: () => goReel(reelIdx + 1),
        onProgress: setReelProgress,
        onReady: () => document.querySelector('.mirror-wrap').classList.add('gl-on')
      });
      hooks.mirrorGo = i => m.go(i);
      hooks.pauseAll = on => { m.pause(on); };
      m.go(0);
    } catch (err) { console.warn('mirror gl', err); domReel(); }
    // rail: lazy when near
    const sec = $('#rail');
    const io = new IntersectionObserver(es => {
      if (!es.some(e => e.isIntersecting)) return; io.disconnect();
      try { G.initRail($('#railGl'), sec, RAIL, { onFocus: setRailFocus, onPick: i => openItem(RAIL[i]) }); }
      catch (err) { console.warn('rail gl', err); document.documentElement.classList.add('no-gl'); }
    }, { rootMargin: '400px 0px' });
    io.observe(sec);
  }).catch(err => { console.warn(err); document.documentElement.classList.add('no-gl'); domReel(); });
} else {
  document.documentElement.classList.add('no-gl');
  domReel();
}
