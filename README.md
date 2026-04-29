# 马赛马拉狮群定位

这是一个静态网页应用，使用 Leaflet、OpenFreeMap 和 OpenStreetMap 显示 KML 点位，不需要 Google Maps API Key。

## 功能

- 内置 27 个“马赛马拉的狮群”点位
- 免费交互地图，默认 OpenStreetMap，可切换 OpenFreeMap
- 浏览器定位、实时跟踪、方向方位和最近点排序
- 点位搜索、KML 导入、恢复默认点位
- 点击点位卡片即可在地图上定位
- 手机端点位列表是底部抽屉，地图占主要空间
- 地图上方固定显示最近 3 个点位
- PWA 支持安装到手机桌面；页面外壳可离线打开，地图瓦片仍需网络
- 位置只在本机计算，不上传服务器
- OpenFreeMap 加载异常时自动切换 OpenStreetMap

## 部署

把本目录的文件发布到任意静态网站服务即可：

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- 任意支持静态 HTML/CSS/JS 的服务器

定位功能需要通过 HTTPS 访问；本地调试时 `localhost` 也可以使用定位。
