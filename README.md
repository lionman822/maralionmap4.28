# 马赛马拉狮群定位

这是一个静态网页应用，直接使用 Leaflet、OpenFreeMap 和 OpenStreetMap 显示 KML 点位，不需要 Google Maps API Key。

## 功能

- 内置 27 个“马赛马拉的狮群”点位
- 免费交互地图，默认 OpenFreeMap，可切换 OpenStreetMap
- 浏览器定位、实时跟踪、最近点排序
- 点位搜索、KML 导入、恢复默认点位
- 点击点位卡片即可在地图上定位

## 部署

把本目录的文件发布到任意静态网站服务即可：

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- 任意支持静态 HTML/CSS/JS 的服务器

定位功能需要通过 HTTPS 访问；本地调试时 `localhost` 也可以使用定位。
