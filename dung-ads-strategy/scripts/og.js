// Tạo ảnh chia sẻ 1200x630 cho trang chủ và từng dự án, 2 ngôn ngữ, lưu vào assets/og/.
// Chỉ cần chạy lại khi đổi nội dung ảnh. Cần: npm i -D playwright  rồi  npx playwright install chromium
// Chạy: node scripts/og.js
const path = require('path');
const fs = require('fs');
let chromium;
try { ({chromium} = require('playwright')); } catch (_) { ({chromium} = require('playwright-core')); }

const FONT = process.env.OG_FONT_DIR ? 'file://' + path.resolve(process.env.OG_FONT_DIR) + '/' : null;
const nguonFont = tep => `url(${tep})`;
const CSS_FONT = FONT ? `
@font-face{font-family:Archivo;src:${nguonFont('archivo.ttf')};font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Newsreader;src:${nguonFont('newsreader-italic.ttf')};font-style:italic;font-weight:200 800}
@font-face{font-family:Newsreader;src:${nguonFont('newsreader.ttf')};font-weight:200 800}
@font-face{font-family:'IBM Plex Mono';src:${nguonFont('plexmono-med.ttf')};font-weight:500}` : '';
const LINK_FONT = FONT ? '' : '<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=IBM+Plex+Mono:wght@500&display=block" rel="stylesheet">';

const ANH = {
  vi: {
    home: {nhan: 'PERFORMANCE MARKETING · TP.HCM', tieu: 'Khách rơi ở đâu,', nghieng: 'mình sửa ở đó', so: '5 dự án', so_nhan: 'xếp theo bước khách rơi khỏi phễu'},
    'dich-vu': {nhan: 'GÓI DỊCH VỤ · BẢNG GIÁ', tieu: 'Gói dịch vụ', nghieng: 'từ cơ bản tới nâng cao', so: '2,5 tr', so_nhan: 'gói Meta Ads mỗi tháng, không phí khởi tạo'},
    human: {nhan: 'DỰ ÁN 01 · LÀM ĐẸP', tieu: 'Human', nghieng: 'Gian hàng hội chợ làm đẹp 3 ngày', so: '284.170', so_nhan: 'người tiếp cận, 1.123 đ mỗi lượt xem trang'},
    kbit: {nhan: 'DỰ ÁN 02 · SỰ KIỆN', tieu: 'KBIT', nghieng: 'Sự kiện làm đẹp, 4 đợt đăng ký', so: '128 → 471', so_nhan: 'lượt đăng ký đợt 1: Meta ghi nhận và danh sách đối chiếu'},
    kla: {nhan: 'DỰ ÁN 03 · THẨM MỸ', tieu: 'KLA Center', nghieng: 'Phòng khám thẩm mỹ', so: '110 và 23', so_nhan: 'tin nhắn Pico + Meso và HIFU 5D: 0,35 tr và 15 tr doanh thu'},
    cora: {nhan: 'DỰ ÁN 04 · THẨM MỸ', tieu: 'CORA', nghieng: 'Phòng khám phẫu thuật thẩm mỹ', so: '51 tin nhắn', so_nhan: 'gần như không có khách đến khám: đổi thông điệp thế nào'},
    silverland: {nhan: 'DỰ ÁN 05 · KHÁCH SẠN', tieu: 'Silverland Hotels', nghieng: 'Web đặt phòng khách sạn', so: '2 → 1', so_nhan: 'chuyển đổi chính mỗi lượt đặt phòng, sau khi sửa tracking Google Ads'}
  },
  en: {
    home: {nhan: 'PERFORMANCE MARKETING · HO CHI MINH CITY', tieu: 'See which ads lead', nghieng: 'to bookings and sales', so: '5 projects', so_nhan: 'ordered by where customers dropped off'},
    'dich-vu': {nhan: 'SERVICE PLANS · PRICING', tieu: 'Service plans', nghieng: 'from basic to advanced', so: 'VND 2.5M', so_nhan: 'Meta Ads plan per month, no setup fee'},
    human: {nhan: 'PROJECT 01 · BEAUTY', tieu: 'Human', nghieng: 'A booth at a 3-day beauty trade show', so: '284,170', so_nhan: 'people reached, VND 1,123 per landing page view'},
    kbit: {nhan: 'PROJECT 02 · EVENTS', tieu: 'KBIT', nghieng: 'A beauty event, 4 sign-up flights', so: '128 → 471', so_nhan: 'flight 1 sign-ups: Meta recorded vs the matched list'},
    kla: {nhan: 'PROJECT 03 · AESTHETICS', tieu: 'KLA Center', nghieng: 'An aesthetics clinic', so: '110 vs 23', so_nhan: 'messages for Pico + Meso and HIFU 5D: VND 0.35M vs 15M revenue'},
    cora: {nhan: 'PROJECT 04 · AESTHETICS', tieu: 'CORA', nghieng: 'An aesthetic surgery clinic', so: '51 messages', so_nhan: 'almost no clinic visits: how the message changed'},
    silverland: {nhan: 'PROJECT 05 · HOTELS', tieu: 'Silverland Hotels', nghieng: 'Direct bookings for a hotel group', so: '2 → 1', so_nhan: 'primary conversions per booking, after the Google Ads tracking fix'}
  }
};

const html = a => `<!doctype html><html><head><meta charset="utf-8">${LINK_FONT}<style>${CSS_FONT}
*{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#0E1116;color:#ECEEEA;font-family:Archivo,sans-serif;position:relative;overflow:hidden}
.luoi{position:absolute;inset:0;background-image:linear-gradient(90deg,rgba(236,238,234,.05) 1px,transparent 1px);background-size:300px 100%}
.sang{position:absolute;right:-120px;top:-160px;width:640px;height:640px;background:radial-gradient(circle,rgba(46,75,255,.35),transparent 62%)}
.phieu{position:absolute;right:90px;top:120px;width:300px;height:380px}
.dau{position:absolute;left:72px;top:58px;display:flex;align-items:center;gap:14px}
.dau b{font:400 26px/1 Newsreader,serif;font-style:normal}.dau b span{font-weight:700}
.noi{position:absolute;left:72px;top:150px;width:720px}
.nhan{font:500 18px/1 'IBM Plex Mono',monospace;letter-spacing:.08em;color:#8FA2FF;margin-bottom:22px}
h1{margin:0 0 0 -4px;font:850 92px/.98 Archivo,sans-serif;font-stretch:66%;letter-spacing:-.025em}
h1.dai{font-size:80px}
p.ng{margin:18px 0 0;width:690px;font:italic 400 38px/1.18 Newsreader,serif;color:#C9CED6}
.so{position:absolute;left:72px;bottom:56px;display:flex;align-items:baseline;gap:18px}
.so b{font:850 58px/1 Archivo,sans-serif;font-stretch:66%;color:#8FA2FF}.so span{font:500 18px/1.3 'IBM Plex Mono',monospace;color:#9AA1AA;max-width:520px}
</style></head><body><div class="luoi"></div><div class="sang"></div>
<svg class="phieu" viewBox="0 0 300 380"><g fill="none" stroke="rgba(236,238,234,.28)" stroke-width="1.5"><path d="M0 0 L300 0 L178 380 L122 380 Z"/></g>
${[1, 2, 3, 4].map(i => { const y = i * 76, w = 150 - 120 * y / 380; return `<line x1="${150 - w}" x2="${150 + w}" y1="${y}" y2="${y}" stroke="rgba(236,238,234,.22)" stroke-dasharray="4 7"/>`; }).join('')}
<path d="M122 304 L178 304 L178 380 L122 380 Z" fill="#2E4BFF" opacity=".85"/></svg>
<div class="dau"><svg width="48" height="38" viewBox="0 0 40 32"><path d="M1 30.5h26" stroke="rgba(236,238,234,.28)"/><polyline points="2,26 11,20.5 20,23 34,7" fill="none" stroke="#8FA2FF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="34.5" cy="6.5" r="4" fill="#ECEEEA"/></svg><b>Dũng <span>Ads Strategy</span></b></div>
<div class="noi"><div class="nhan">${a.nhan}</div>
<h1 class="${a.tieu.length > 18 ? 'dai' : ''}">${a.tieu}</h1>
<p class="ng">${a.nghieng}</p></div>
<div class="so"><b>${a.so}</b><span>${a.so_nhan}</span></div>
</body></html>`;

(async () => {
  const ra = path.join(__dirname, '..', 'assets', 'og');
  fs.mkdirSync(ra, {recursive: true});
  const b = await chromium.launch(process.env.CHROME ? {executablePath: process.env.CHROME} : {});
  const p = await b.newPage({viewport: {width: 1200, height: 630}});
  for (const lang of Object.keys(ANH)) for (const [k, a] of Object.entries(ANH[lang])) {
    if (FONT) { const tam = path.join(path.resolve(process.env.OG_FONT_DIR), '_og_tam.html'); fs.writeFileSync(tam, html(a)); await p.goto('file://' + tam); }
    else await p.setContent(html(a), {waitUntil: 'networkidle'});
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({path: path.join(ra, `${lang}-${k}.png`)});
    console.log('assets/og/' + `${lang}-${k}.png`);
  }
  await b.close();
})();
