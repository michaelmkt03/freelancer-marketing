# Dũng Ads Strategy · website portfolio

Website tĩnh, 2 ngôn ngữ, mỗi phần và mỗi dự án có đường dẫn riêng. Không cần máy chủ, không cần cài gói nào để build.

## Đường dẫn

| Phần | Tiếng Việt | Tiếng Anh |
|---|---|---|
| Trang chủ | `/` | `/en/` |
| Giới thiệu | `/gioi-thieu/` | `/en/about/` |
| Dự án | `/du-an/` | `/en/projects/` |
| Silverland Hotels | `/du-an/silverland-hotels/` | `/en/projects/silverland-hotels/` |
| KBIT | `/du-an/kbit-k-beauty-meets/` | `/en/projects/kbit-k-beauty-meets/` |
| KLA Center | `/du-an/kla-center/` | `/en/projects/kla-center/` |
| Nha khoa Việt Mỹ | `/du-an/nha-khoa-viet-my/` | `/en/projects/nha-khoa-viet-my/` |
| Human | `/du-an/human/` | `/en/projects/human/` |
| Cách làm | `/cach-lam/` | `/en/process/` |
| Liên hệ | `/lien-he/` | `/en/contact/` |

Mở thẳng link dự án thì hồ sơ dự án tự mở. Cuộn trang thì thanh địa chỉ tự đổi theo mục đang xem, nên copy link lúc nào cũng ra đúng chỗ.

## Cấu trúc

```
src/index.html      trang mẫu: toàn bộ nội dung, giao diện, slug (SLUG_MUC, SLUG_DA), logo (LOGO)
build.js            tạo website vào docs/, tiêu đề và mô tả từng trang nằm trong biến META
site.config.json    tên miền, đường dẫn gốc, bật tắt Google index
assets/             ảnh chân dung, logo, favicon, ảnh chia sẻ (og/)
scripts/og.js       tạo lại ảnh chia sẻ, chỉ cần khi đổi nội dung ảnh
docs/               website đã build, đưa thư mục này lên mạng
```

## Sửa nội dung

1. Mở `src/index.html`, tìm `NOI_DUNG` (bản vi và en), sửa chữ hoặc số.
2. Chạy `node build.js`.
3. Mở thử: `npx serve docs` rồi vào http://localhost:3000

Đổi slug: sửa `SLUG_MUC` hoặc `SLUG_DA` trong `src/index.html` rồi chạy lại `node build.js`.
Thêm logo: bỏ file PNG nền trong suốt vào `assets/logos/`, điền đường dẫn vào `LOGO` trong `src/index.html`.

## Đưa lên Vercel

1. Đẩy cả thư mục lên một repo GitHub.
2. Vào vercel.com, chọn Add New Project, chọn repo. Không cần chỉnh gì, `vercel.json` đã khai báo lệnh build và thư mục `docs`.
3. Có link rồi thì điền vào `site.config.json`, ví dụ `"site_url": "https://dungadsstrategy.vercel.app"`, đẩy lên lại. Bước này để ảnh chia sẻ hiện khi gửi link qua Facebook, Zalo, LinkedIn.

## Đưa lên GitHub Pages

1. Chạy `node build.js`, đẩy cả thư mục (gồm `docs/`) lên GitHub.
2. Vào repo, Settings, Pages, Source chọn Deploy from a branch, nhánh `main`, thư mục `/docs`.
3. Link sẽ có dạng `https://<tên-github>.github.io/<tên-repo>/`. Điền vào `site.config.json`:
   - `"site_url": "https://<tên-github>.github.io/<tên-repo>"`
   - `"base_path": "/<tên-repo>/"` (dùng cho trang 404)
4. Chạy lại `node build.js`, đẩy lên lại.

## Trước khi cho Google index

`"cho_google_index": false` đang chặn Google. Chỉ đổi sang `true` khi số liệu 4 dự án freelance đã là số thật.

## Tạo lại ảnh chia sẻ

```
npm i -D playwright
npx playwright install chromium
node scripts/og.js
node build.js
```
Nội dung ảnh sửa trong biến `ANH` ở `scripts/og.js`.
