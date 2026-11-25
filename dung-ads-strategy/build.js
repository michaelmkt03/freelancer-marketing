// Tạo website tĩnh vào thư mục docs/ từ src/index.html.
// Mỗi phần và mỗi dự án có một đường dẫn riêng, đủ 2 ngôn ngữ, mỗi trang có tiêu đề, mô tả và ảnh chia sẻ riêng.
// Chạy: node build.js   (không cần cài thêm gói nào)
const fs = require('fs');
const path = require('path');

const CAU_HINH = JSON.parse(fs.readFileSync(path.join(__dirname, 'site.config.json'), 'utf8'));
const SITE = (CAU_HINH.site_url || '').replace(/\/$/, '');      // ví dụ https://dungadsstrategy.vercel.app
const CHO_INDEX = !!CAU_HINH.cho_google_index;                 // false = thêm noindex
const BASE_404 = (CAU_HINH.base_path || '/').replace(/\/?$/, '/'); // GitHub Pages dạng tên-repo thì đặt "/ten-repo/"
const RA = path.join(__dirname, 'docs');
const TEN = 'Dũng Ads Strategy';

/* ---------- Tiêu đề và mô tả của từng trang (sửa ở đây) ---------- */
// Slug lấy từ src/index.html (SLUG_MUC, SLUG_DA) để chỉ phải sửa một chỗ
const MAU = fs.readFileSync(path.join(__dirname, 'src/index.html'), 'utf8');
const layHang = ten => { const m = MAU.match(new RegExp('const ' + ten + ' = (\\{.*\\});')); if (!m) throw new Error('Không tìm thấy ' + ten + ' trong src/index.html'); return Function('return ' + m[1])(); };
const MUC = Object.assign({'': {vi: '', en: ''}}, layHang('SLUG_MUC'));
const DU_AN = layHang('SLUG_DA');

const META = {
  vi: {
    '': ['Dũng Ads Strategy · Performance marketing tại TP.HCM', 'Meta Ads, Google Ads, SEO, đo lường, tối ưu performance cho ngành thẩm mỹ, nha khoa, sự kiện, khách sạn.'],
    toi: ['Giới thiệu · Dũng Ads Strategy', 'Đào Mạnh Dũng làm performance marketing tại Silverland Hospitality và nhận dự án freelance.'],
    'dich-vu': ['Gói dịch vụ và bảng giá · Dũng Ads Strategy', 'Meta Ads từ 2,5 triệu, Google Ads từ 1,8 triệu mỗi tháng. Có gói SEO, GEO, đo lường, không phí khởi tạo.'],
    'du-an': ['Dự án · Dũng Ads Strategy', 'Silverland Hotels, KBIT, KLA Center, Human, Nha khoa Việt Mỹ: việc đã làm và kết quả đo được.'],
    'cach-lam': ['Cách làm việc · Dũng Ads Strategy', '4 bước: chẩn đoán trong 3 ngày, sửa tracking, test mỗi tuần, báo cáo bằng số đã đối chiếu.'],
    'lien-he': ['Liên hệ · Dũng Ads Strategy', 'Gửi thương hiệu và kênh đang chạy, Dũng trả lời trong 24 giờ kèm nhận xét miễn phí.'],
    human: ['Human · K-Beauty Expo 2026 · Dũng Ads Strategy', '284.170 người tiếp cận trong 3 ngày hội chợ, với 4,9 triệu đồng chi phí quảng cáo.'],
    kbit: ['KBIT · K-Beauty MEETS 2026 · Dũng Ads Strategy', '1.274 lượt đăng ký tham dự từ quảng cáo qua 4 đợt, cho 3 sự kiện ngành thẩm mỹ.'],
    kla: ['KLA Center · Phòng khám thẩm mỹ · Dũng Ads Strategy', '39,47 triệu đồng doanh thu tháng 9/2026 từ 18 khách đến khám.'],
    vietmy: ['Nha khoa Việt Mỹ · Dũng Ads Strategy', 'Hồ sơ minh hoạ: tách quảng cáo theo dịch vụ, chi phí mỗi tin nhắn giảm 38%.'],
    silverland: ['Silverland Hotels · Dũng Ads Strategy', 'Doanh thu đặt phòng trên web Bến Thành năm 2025 tăng 85,3% so với 2024. Google Ads, SEO và GEO.']
  },
  en: {
    '': ['Dũng Ads Strategy · Performance marketing in HCMC', 'Meta Ads, Google Ads, SEO, measurement and performance optimization for aesthetics, dental, events and hotels.'],
    toi: ['About · Dũng Ads Strategy', 'Đào Mạnh Dũng works in performance marketing at Silverland Hospitality and takes on freelance projects.'],
    'dich-vu': ['Service plans and pricing · Dũng Ads Strategy', 'Meta Ads from VND 2.5M, Google Ads from VND 1.8M a month. SEO, GEO and measurement plans, no setup fee.'],
    'du-an': ['Projects · Dũng Ads Strategy', 'Silverland Hotels, KBIT, KLA Center, Human, Nha khoa Việt Mỹ: the work and the measured results.'],
    'cach-lam': ['Process · Dũng Ads Strategy', '4 steps: a 3-day diagnosis, tracking fixes, weekly tests, and reports with reconciled numbers.'],
    'lien-he': ['Contact · Dũng Ads Strategy', 'Send your brand and the channels you run. Dũng replies within 24 hours with free first feedback.'],
    human: ['Human · K-Beauty Expo 2026 · Dũng Ads Strategy', '284,170 people reached over a 3-day trade show, on VND 4.9 million in ad spend.'],
    kbit: ['KBIT · K-Beauty MEETS 2026 · Dũng Ads Strategy', '1,274 sign-ups from ads across 4 flights, for 3 aesthetics industry events.'],
    kla: ['KLA Center · Aesthetic clinic · Dũng Ads Strategy', 'VND 39.47 million in revenue in Sep 2026 from 18 clinic visits.'],
    vietmy: ['Nha khoa Việt Mỹ · Dũng Ads Strategy', 'Illustrative case: ad sets split by treatment, cost per message down 38%.'],
    silverland: ['Silverland Hotels · Dũng Ads Strategy', 'Bến Thành web booking revenue up 85.3% in 2025 versus 2024. Google Ads, SEO and GEO.']
  }
};

/* ---------- danh sách trang ---------- */
const TRANG = [];
for (const lang of ['vi', 'en']) {
  for (const muc of Object.keys(MUC)) TRANG.push({lang, key: muc, route: muc, duong: (lang === 'en' ? 'en/' : '') + (MUC[muc][lang] ? MUC[muc][lang] + '/' : '')});
  for (const id of Object.keys(DU_AN)) TRANG.push({lang, key: id, route: 'p:' + id, duong: (lang === 'en' ? 'en/' : '') + MUC['du-an'][lang] + '/' + DU_AN[id] + '/'});
}
const ban_kia = t => TRANG.find(x => x.lang !== t.lang && x.route === t.route);
const tuyet_doi = duong => SITE ? `${SITE}/${duong}` : null;
const thoat = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function metaCho(t, root) {
  const [tieuDe, moTa] = META[t.lang][t.key];
  const og = fs.existsSync(path.join(__dirname, 'assets/og', `${t.lang}-${t.key}.png`)) ? `${t.lang}-${t.key}.png` : `${t.lang}-home.png`;
  const anh = SITE ? `${SITE}/assets/og/${og}` : `${root}assets/og/${og}`;
  const kia = ban_kia(t);
  const dong = [
    `<title>${thoat(tieuDe)}</title>`,
    `<meta name="description" content="${thoat(moTa)}">`,
    CHO_INDEX ? '' : '<meta name="robots" content="noindex">',
    SITE ? `<link rel="canonical" href="${tuyet_doi(t.duong)}">` : '',
    SITE ? `<link rel="alternate" hreflang="${t.lang}" href="${tuyet_doi(t.duong)}">` : '',
    SITE ? `<link rel="alternate" hreflang="${kia.lang}" href="${tuyet_doi(kia.duong)}">` : '',
    SITE ? `<link rel="alternate" hreflang="x-default" href="${tuyet_doi(t.lang === 'vi' ? t.duong : kia.duong)}">` : '',
    `<meta property="og:type" content="${t.route.startsWith('p:') ? 'article' : 'website'}">`,
    `<meta property="og:site_name" content="${TEN}">`,
    `<meta property="og:locale" content="${t.lang === 'vi' ? 'vi_VN' : 'en_US'}">`,
    `<meta property="og:title" content="${thoat(tieuDe)}">`,
    `<meta property="og:description" content="${thoat(moTa)}">`,
    SITE ? `<meta property="og:url" content="${tuyet_doi(t.duong)}">` : '',
    `<meta property="og:image" content="${anh}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<link rel="icon" href="${root}assets/favicon.svg" type="image/svg+xml">`,
    `<link rel="icon" href="${root}assets/favicon-32.png" sizes="32x32" type="image/png">`,
    `<link rel="apple-touch-icon" href="${root}assets/apple-touch-icon.png">`
  ].filter(Boolean);
  return dong.join('\n');
}

function dung(mau, t, root) {
  let h = mau.replace(/<!-- META:START -->[\s\S]*?<!-- META:END -->/, metaCho(t, root));
  h = h.replace('<html lang="vi">', `<html lang="${t.lang}" data-lang="${t.lang}" data-root="${root}" data-route="${t.route}">`);
  h = h.split('{{ROOT}}').join(root);
  return h;
}

/* ---------- chạy ---------- */
const mau = MAU;
if (!mau.includes('<html lang="vi">') || !mau.includes('<!-- META:START -->')) throw new Error('src/index.html thiếu thẻ <html lang="vi"> hoặc khối META');
fs.rmSync(RA, {recursive: true, force: true});
fs.mkdirSync(RA, {recursive: true});
fs.cpSync(path.join(__dirname, 'assets'), path.join(RA, 'assets'), {recursive: true});

for (const t of TRANG) {
  const sau = t.duong.split('/').filter(Boolean).length;
  const root = sau ? '../'.repeat(sau) : './';
  const thuMuc = path.join(RA, t.duong);
  fs.mkdirSync(thuMuc, {recursive: true});
  fs.writeFileSync(path.join(thuMuc, 'index.html'), dung(mau, t, root));
}
// trang 404: dùng đường dẫn gốc tuyệt đối vì có thể mở ở bất kỳ độ sâu nào
fs.writeFileSync(path.join(RA, '404.html'), dung(mau, TRANG[0], BASE_404).replace('<meta name="robots" content="noindex">', '').replace('<title>', '<meta name="robots" content="noindex">\n<title>'));
fs.writeFileSync(path.join(RA, '.nojekyll'), '');

// robots.txt và sitemap.xml
fs.writeFileSync(path.join(RA, 'robots.txt'), CHO_INDEX && SITE ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n` : 'User-agent: *\nAllow: /\n');
if (SITE) {
  const url = TRANG.map(t => { const k = ban_kia(t); return `  <url><loc>${tuyet_doi(t.duong)}</loc><xhtml:link rel="alternate" hreflang="${t.lang}" href="${tuyet_doi(t.duong)}"/><xhtml:link rel="alternate" hreflang="${k.lang}" href="${tuyet_doi(k.duong)}"/></url>`; }).join('\n');
  fs.writeFileSync(path.join(RA, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${url}\n</urlset>\n`);
}

console.log(`Đã tạo ${TRANG.length} trang vào docs/`);
TRANG.forEach(t => console.log('  /' + t.duong));
if (!SITE) console.log('Lưu ý: site.config.json chưa có site_url, ảnh chia sẻ trên Facebook và Zalo cần link đầy đủ mới hiện.');
if (!CHO_INDEX) console.log('Lưu ý: đang chặn Google index (cho_google_index = false).');
