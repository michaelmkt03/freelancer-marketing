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
    '': ['Đào Mạnh Dũng · Dũng Ads Strategy · Tư vấn chiến lược và triển khai quảng cáo', 'Dũng làm performance marketing ở TP.HCM: quảng cáo, tracking và báo cáo cho thẩm mỹ, làm đẹp, nha khoa, sự kiện và khách sạn. 5 dự án xếp theo bước khách rơi khỏi phễu.'],
    toi: ['Giới thiệu · Đào Mạnh Dũng · Dũng Ads Strategy', 'Đào Mạnh Dũng làm performance marketing tại Silverland Hospitality và nhận dự án freelance cho thẩm mỹ, làm đẹp, nha khoa, sự kiện.'],
    'du-an': ['5 dự án · Dũng Ads Strategy', 'Silverland Hotels, KBIT, KLA Center, Nha khoa Việt Mỹ, Human: mỗi dự án nằm ở bước của phễu mà khách thật sự rơi.'],
    'cach-lam': ['Cách làm việc · Dũng Ads Strategy', 'Chẩn đoán trong 3 ngày, sửa tracking tuần đầu, test mỗi tuần một giả thuyết, báo cáo một trang có số đã đối chiếu.'],
    'lien-he': ['Liên hệ · Dũng Ads Strategy', 'Gửi tên thương hiệu và kênh quảng cáo đang chạy. Dũng trả lời trong 24 giờ, kèm nhận xét đầu tiên về phễu, không tính phí.'],
    human: ['Human · Dự án làm đẹp · Dũng Ads Strategy', 'Quảng cáo cho gian hàng tại K-Beauty Expo 2026: 284.170 người tiếp cận với 4,91 triệu đồng, chi phí mỗi lượt xem trang 1.123 đ.'],
    kbit: ['KBIT · K-Beauty MEETS 2026 · Dũng Ads Strategy', 'Meta báo 128 lượt đăng ký, danh sách thật có 471: chi phí thật mỗi lượt đăng ký là 54.270 đ, 1.274 lượt đăng ký từ quảng cáo qua 4 đợt.'],
    kla: ['KLA Center · Dự án thẩm mỹ · Dũng Ads Strategy', 'Pico ra nhiều tin nhắn nhất nhưng doanh thu nằm ở HIFU: 39,47 triệu đồng doanh thu tháng 9/2026 từ 18 khách đến.'],
    vietmy: ['Nha khoa Việt Mỹ · Dự án nha khoa · Dũng Ads Strategy', 'Hồ sơ minh hoạ theo mặt bằng chi phí ngành nha khoa: tách nhóm quảng cáo theo dịch vụ để hạ chi phí mỗi tin nhắn.'],
    silverland: ['Silverland Hotels · Dự án khách sạn · Dũng Ads Strategy', 'Báo cáo ghi ROAS 24, thực tế chỉ 15: bỏ chuyển đổi đếm trùng, đối soát Google Ads, GA4 và hệ thống đặt phòng.']
  },
  en: {
    '': ['Đào Mạnh Dũng · Dũng Ads Strategy · Ad strategy and campaign management', 'Dũng is a performance marketer in Ho Chi Minh City: ads, tracking and reporting for aesthetics, beauty, dental, events and hotels. 5 projects, ordered by where customers dropped off.'],
    toi: ['About · Đào Mạnh Dũng · Dũng Ads Strategy', 'Đào Mạnh Dũng works in performance marketing at Silverland Hospitality and takes on freelance projects in aesthetics, beauty, dental and events.'],
    'du-an': ['5 projects · Dũng Ads Strategy', 'Silverland Hotels, KBIT, KLA Center, Nha khoa Việt Mỹ, Human: each project sits at the funnel step where customers actually dropped off.'],
    'cach-lam': ['Process · Dũng Ads Strategy', 'A 3-day diagnosis, tracking fixed in week 1, one tested hypothesis a week, and a one-page report with reconciled numbers.'],
    'lien-he': ['Contact · Dũng Ads Strategy', 'Send your brand name and the ad channels you run. Dũng replies within 24 hours with a first take on your funnel, free of charge.'],
    human: ['Human · Beauty case study · Dũng Ads Strategy', 'Ads for a booth at K-Beauty Expo 2026: 284,170 people reached on VND 4.91 million, VND 1,123 per landing page view.'],
    kbit: ['KBIT · K-Beauty MEETS 2026 · Dũng Ads Strategy', 'Meta reported 128 sign-ups, the real list had 471: a real cost per sign-up of VND 54,270, and 1,274 sign-ups from ads across 4 flights.'],
    kla: ['KLA Center · Aesthetics case study · Dũng Ads Strategy', 'Pico brought the most messages but HIFU brought the revenue: VND 39.47 million in Sep 2026 from 18 clinic visits.'],
    vietmy: ['Nha khoa Việt Mỹ · Dental case study · Dũng Ads Strategy', 'An illustrative case built on typical dental ad costs: splitting ad sets by treatment to bring cost per message down.'],
    silverland: ['Silverland Hotels · Hotel case study · Dũng Ads Strategy', 'The report said ROAS 24, the real figure was 15: double-counted conversions removed and bookings reconciled across Google Ads, GA4 and the booking engine.']
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
