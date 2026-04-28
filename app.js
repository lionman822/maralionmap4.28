const DEFAULT_POINTS = [
  { id: "rekero", name: "Rekero", lng: 35.08240245593801, lat: -1.408741732410886, alt: 1525.839580792552 },
  { id: "marsh", name: "Marsh", lng: 35.04717692078727, lat: -1.293995863190812, alt: 1578.051379129161 },
  { id: "topi-pride", name: "Topi pride", lng: 35.10563319300971, lat: -1.333397805135415, alt: 1585.659424717089 },
  { id: "engoyanai", name: "Engoyanai", lng: 35.13754614452806, lat: -1.382995504236161, alt: 1538.54453629897 },
  { id: "oldikdik", name: "Oldikdik", lng: 35.172964285365, lat: -1.279935559812809, alt: 1644.953791831195 },
  { id: "sankai", name: "Sankai", lng: 35.21062683752822, lat: -1.350775552039355, alt: 1630.091482528981 },
  { id: "fig-tree", name: "Fig tree", lng: 35.15032522022999, lat: -1.432267812324017, alt: 1567.023162215389 },
  { id: "rongai", name: "Rongai", lng: 35.11755560405287, lat: -1.463945414309665, alt: 1537.635193755812 },
  { id: "lookout", name: "Lookout", lng: 35.08631108401165, lat: -1.516065874829221, alt: 1556.141799550096 },
  { id: "roan", name: "Roan", lng: 35.13793378958003, lat: -1.573718643041434, alt: 1568.724703968551 },
  { id: "observation", name: "Observation", lng: 35.18056437946538, lat: -1.597706992376722, alt: 1580.416008409331 },
  { id: "maji-ya-fisi", name: "Maji ya fisi", lng: 35.20152725771524, lat: -1.494839849242928, alt: 1578.994911196133 },
  { id: "rocky-valley", name: "Rocky valley", lng: 35.24418956146962, lat: -1.546863677762317, alt: 1634.108004308114 },
  { id: "kws", name: "KWS", lng: 35.34773913943525, lat: -1.579420500213944, alt: 1985.715172342823 },
  { id: "oloolaimutia", name: "Oloolaimutia", lng: 35.43364788135656, lat: -1.624723830191059, alt: 1922.722043494465 },
  { id: "salas", name: "Salas", lng: 35.21781144246665, lat: -1.624499808773402, alt: 1719.84691365738 },
  { id: "sand-river", name: "Sand river", lng: 35.28440548769822, lat: -1.638585483576517, alt: 1688.927023991946 },
  { id: "koka", name: "Koka", lng: 35.37465260074171, lat: -1.669660419571557, alt: 1759.125590249462 },
  { id: "purangat", name: "Purangat", lng: 34.98927864047164, lat: -1.528798938550405, alt: 1551.097501673068 },
  { id: "nasipa", name: "Nasipa", lng: 34.90195087016649, lat: -1.479425684557844, alt: 1418.885938203918 },
  { id: "ngiro-are", name: "Ngiro Are", lng: 34.84103483943397, lat: -1.400097478738584, alt: 1404.677174386188 },
  { id: "gg-yptian-goose", name: "Ggyptian goose", lng: 35.00279890496167, lat: -1.438709912672022, alt: 1509.432743491082 },
  { id: "serena-north", name: "Serena North", lng: 35.03722106307466, lat: -1.358489815508586, alt: 1530.448545300677 },
  { id: "mugoro", name: "Mugoro", lng: 34.94928392820323, lat: -1.388795886419876, alt: 1526.411903905383 },
  { id: "sausage-tree", name: "Sausage tree", lng: 34.91381468977141, lat: -1.344279828975277, alt: 1593.925334058908 },
  { id: "mara-river", name: "Mara river", lng: 35.00042399022595, lat: -1.31007425336361, alt: 1523.10533611298 },
  { id: "agama", name: "Agama", lng: 35.00251570418191, lat: -1.258854587974857, alt: 1637.61041004649 },
];

const state = {
  points: [...DEFAULT_POINTS],
  selectedId: DEFAULT_POINTS[0].id,
  userLocation: null,
  watchId: null,
  activeLayer: "openfreemap",
  sourceName: "内置 KML：马赛马拉的狮群",
  query: "",
};

const els = {
  pointCount: document.getElementById("pointCount"),
  locateBtn: document.getElementById("locateBtn"),
  watchBtn: document.getElementById("watchBtn"),
  fitBtn: document.getElementById("fitBtn"),
  layerSelect: document.getElementById("layerSelect"),
  mapStatus: document.getElementById("mapStatus"),
  selectedPanel: document.getElementById("selectedPanel"),
  searchInput: document.getElementById("searchInput"),
  importBtn: document.getElementById("importBtn"),
  resetBtn: document.getElementById("resetBtn"),
  kmlInput: document.getElementById("kmlInput"),
  locationStatus: document.getElementById("locationStatus"),
  nearestStatus: document.getElementById("nearestStatus"),
  sourceName: document.getElementById("sourceName"),
  filterCount: document.getElementById("filterCount"),
  pointList: document.getElementById("pointList"),
};

let map;
let baseLayer;
let markerLayer;
let userMarker;
let accuracyCircle;
let openFreeMapAttribution = false;

function init() {
  map = L.map("map", {
    zoomControl: false,
    attributionControl: true,
  }).setView([-1.455, 35.115], 10);

  map.attributionControl.setPrefix("");
  L.control.zoom({ position: "bottomright" }).addTo(map);
  markerLayer = L.layerGroup().addTo(map);
  setBaseLayer(state.activeLayer);
  bindEvents();
  render();
  fitAll();
}

function bindEvents() {
  els.locateBtn.addEventListener("click", locateOnce);
  els.watchBtn.addEventListener("click", toggleWatch);
  els.fitBtn.addEventListener("click", fitAll);
  els.layerSelect.addEventListener("change", (event) => {
    state.activeLayer = event.target.value;
    setBaseLayer(state.activeLayer);
  });
  els.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    render();
  });
  els.importBtn.addEventListener("click", () => els.kmlInput.click());
  els.resetBtn.addEventListener("click", restoreDefaultPoints);
  els.kmlInput.addEventListener("change", handleKmlImport);
}

function setBaseLayer(layerName) {
  if (baseLayer) {
    map.removeLayer(baseLayer);
  }

  removeOpenFreeMapAttribution();

  if (layerName === "openfreemap" && L.maplibreGL) {
    baseLayer = L.maplibreGL({
      style: "https://tiles.openfreemap.org/styles/liberty",
      interactive: false,
    }).addTo(map);
    addOpenFreeMapAttribution();
    setMapStatus("OpenFreeMap，无需 API Key");
    return;
  }

  baseLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
  }).addTo(map);
  state.activeLayer = "osm";
  els.layerSelect.value = "osm";
  setMapStatus("OpenStreetMap，无需 API Key");
}

function addOpenFreeMapAttribution() {
  if (!openFreeMapAttribution) {
    map.attributionControl.addAttribution(
      '<a href="https://openfreemap.org/" target="_blank" rel="noreferrer">OpenFreeMap</a> &copy; <a href="https://openmaptiles.org/" target="_blank" rel="noreferrer">OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/" target="_blank" rel="noreferrer">OpenStreetMap</a>',
    );
    openFreeMapAttribution = true;
  }
}

function removeOpenFreeMapAttribution() {
  if (openFreeMapAttribution) {
    map.attributionControl.removeAttribution(
      '<a href="https://openfreemap.org/" target="_blank" rel="noreferrer">OpenFreeMap</a> &copy; <a href="https://openmaptiles.org/" target="_blank" rel="noreferrer">OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/" target="_blank" rel="noreferrer">OpenStreetMap</a>',
    );
    openFreeMapAttribution = false;
  }
}

function setMapStatus(text) {
  els.mapStatus.textContent = text;
}

function render() {
  const points = getDisplayPoints();
  const selected = getSelectedPoint(points) || points[0] || state.points[0];
  if (selected && selected.id !== state.selectedId) {
    state.selectedId = selected.id;
  }

  els.pointCount.textContent = `${state.points.length} 个点位`;
  els.sourceName.textContent = state.sourceName;
  els.filterCount.textContent = state.query ? `${points.length}/${state.points.length}` : "";
  renderMarkers(points);
  renderList(points);
  renderSelected(selected);
  renderNearest();
}

function getDisplayPoints() {
  const filtered = state.query
    ? state.points.filter((point) => point.name.toLowerCase().includes(state.query))
    : [...state.points];

  if (!state.userLocation) {
    return filtered;
  }

  return filtered
    .map((point) => ({
      ...point,
      distanceMeters: distanceMeters(state.userLocation, point),
    }))
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
}

function getSelectedPoint(points = state.points) {
  return points.find((point) => point.id === state.selectedId);
}

function renderMarkers(points) {
  markerLayer.clearLayers();
  points.forEach((point, index) => {
    const marker = L.marker([point.lat, point.lng], {
      title: point.name,
      icon: makePointIcon(index + 1, point.id === state.selectedId),
    });
    marker.bindPopup(makePopup(point));
    marker.on("click", () => selectPoint(point.id, { openPopup: true }));
    marker.addTo(markerLayer);
  });
}

function makePointIcon(label, selected) {
  return L.divIcon({
    className: "",
    html: `<div class="pride-marker${selected ? " is-selected" : ""}">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -13],
  });
}

function makePopup(point) {
  const distance = state.userLocation
    ? `<br>距离：${formatDistance(distanceMeters(state.userLocation, point))}`
    : "";
  return `
    <p class="popup-title">${escapeHtml(point.name)}</p>
    <p class="popup-meta">
      ${formatCoord(point.lat)}, ${formatCoord(point.lng)}<br>
      海拔：${formatAltitude(point.alt)}${distance}
    </p>
  `;
}

function renderList(points) {
  if (!points.length) {
    els.pointList.innerHTML = '<div class="empty-state">没有匹配的点位</div>';
    return;
  }

  els.pointList.innerHTML = points
    .map((point) => {
      const distance =
        point.distanceMeters !== undefined ? formatDistance(point.distanceMeters) : "未定位";
      return `
        <button class="point-card${point.id === state.selectedId ? " is-selected" : ""}" type="button" data-point-id="${point.id}">
          <span class="point-row">
            <span class="point-name">${escapeHtml(point.name)}</span>
            <span class="point-distance">${distance}</span>
          </span>
          <span class="point-meta">
            <span>纬度 ${formatCoord(point.lat)}，经度 ${formatCoord(point.lng)}</span>
            <span>海拔 ${formatAltitude(point.alt)}</span>
          </span>
          <span class="point-actions">
            <a class="link-button" href="${mapsViewUrl(point)}" target="_blank" rel="noreferrer">打开地图</a>
            <a class="link-button alt" href="${mapsNavUrl(point)}" target="_blank" rel="noreferrer">导航到这里</a>
          </span>
        </button>
      `;
    })
    .join("");

  els.pointList.querySelectorAll(".point-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectPoint(card.dataset.pointId, { pan: true });
    });
    card.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (event) => event.stopPropagation());
    });
  });
}

function renderSelected(point) {
  if (!point) {
    els.selectedPanel.innerHTML = "";
    return;
  }

  const distance = state.userLocation ? formatDistance(distanceMeters(state.userLocation, point)) : "未定位";
  els.selectedPanel.innerHTML = `
    <div class="selected-inner">
      <div class="selected-title">
        <h2>${escapeHtml(point.name)}</h2>
        <span class="distance-badge">${distance}</span>
      </div>
      <div class="meta-grid">
        <span>纬度 ${formatCoord(point.lat)}</span>
        <span>经度 ${formatCoord(point.lng)}</span>
        <span>海拔 ${formatAltitude(point.alt)}</span>
        <span>${state.sourceName}</span>
      </div>
      <div class="link-row">
        <a class="link-button" href="${mapsViewUrl(point)}" target="_blank" rel="noreferrer">在 Google Maps 打开</a>
        <a class="link-button alt" href="${mapsNavUrl(point)}" target="_blank" rel="noreferrer">导航到这里</a>
      </div>
    </div>
  `;
}

function renderNearest() {
  if (!state.userLocation || !state.points.length) {
    els.nearestStatus.textContent = "定位后显示最近点位";
    return;
  }

  const nearest = state.points
    .map((point) => ({ ...point, distanceMeters: distanceMeters(state.userLocation, point) }))
    .sort((a, b) => a.distanceMeters - b.distanceMeters)[0];

  els.nearestStatus.textContent = `最近：${nearest.name}，${formatDistance(nearest.distanceMeters)}`;
}

function selectPoint(id, options = {}) {
  const point = state.points.find((item) => item.id === id);
  if (!point) {
    return;
  }

  state.selectedId = id;
  render();

  if (options.pan) {
    map.flyTo([point.lat, point.lng], Math.max(map.getZoom(), 13), { duration: 0.75 });
  }

  if (options.openPopup) {
    const marker = markerLayer
      .getLayers()
      .find((layer) => layer.options && layer.options.title === point.name);
    if (marker) {
      marker.openPopup();
    }
  }
}

function locateOnce() {
  if (!navigator.geolocation) {
    updateLocationStatus("当前浏览器不支持定位");
    return;
  }

  updateLocationStatus("正在定位");
  navigator.geolocation.getCurrentPosition(handlePosition, handleLocationError, {
    enableHighAccuracy: true,
    timeout: 14000,
    maximumAge: 8000,
  });
}

function toggleWatch() {
  if (!navigator.geolocation) {
    updateLocationStatus("当前浏览器不支持定位");
    return;
  }

  if (state.watchId !== null) {
    navigator.geolocation.clearWatch(state.watchId);
    state.watchId = null;
    els.watchBtn.textContent = "实时跟踪";
    updateLocationStatus("已停止实时跟踪");
    return;
  }

  updateLocationStatus("正在启动实时跟踪");
  state.watchId = navigator.geolocation.watchPosition(handlePosition, handleLocationError, {
    enableHighAccuracy: true,
    timeout: 16000,
    maximumAge: 5000,
  });
  els.watchBtn.textContent = "停止跟踪";
}

function handlePosition(position) {
  state.userLocation = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    accuracy: position.coords.accuracy,
  };

  const accuracy = Math.round(position.coords.accuracy);
  updateLocationStatus(`已定位，精度约 ${accuracy} m`);
  renderUserLocation();
  render();
}

function renderUserLocation() {
  if (!state.userLocation) {
    return;
  }

  const latLng = [state.userLocation.lat, state.userLocation.lng];

  if (!userMarker) {
    userMarker = L.circleMarker(latLng, {
      radius: 8,
      color: "#ffffff",
      weight: 3,
      fillColor: "#2368ad",
      fillOpacity: 0.95,
    }).addTo(map);
  } else {
    userMarker.setLatLng(latLng);
  }

  if (!accuracyCircle) {
    accuracyCircle = L.circle(latLng, {
      radius: state.userLocation.accuracy || 30,
      color: "#2368ad",
      weight: 1,
      fillColor: "#2368ad",
      fillOpacity: 0.1,
    }).addTo(map);
  } else {
    accuracyCircle.setLatLng(latLng);
    accuracyCircle.setRadius(state.userLocation.accuracy || 30);
  }
}

function handleLocationError(error) {
  const messages = {
    1: "定位权限被拒绝",
    2: "无法取得当前位置",
    3: "定位超时",
  };
  updateLocationStatus(`${messages[error.code] || "定位失败"}：请检查浏览器权限、HTTPS 和设备定位`);
}

function updateLocationStatus(text) {
  els.locationStatus.textContent = text;
}

function fitAll() {
  const points = getDisplayPoints();
  if (!points.length) {
    return;
  }

  const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]));
  if (state.userLocation) {
    bounds.extend([state.userLocation.lat, state.userLocation.lng]);
  }
  map.fitBounds(bounds.pad(0.14), { maxZoom: 13 });
}

async function handleKmlImport(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const parsed = parseKmlPoints(text);
    if (!parsed.length) {
      throw new Error("未找到有效 Point 坐标");
    }

    state.points = parsed;
    state.selectedId = parsed[0].id;
    state.sourceName = `导入 KML：${file.name}`;
    state.query = "";
    els.searchInput.value = "";
    render();
    fitAll();
    updateLocationStatus(`已导入 ${parsed.length} 个点位`);
  } catch (error) {
    updateLocationStatus(`导入失败：${error.message}`);
  } finally {
    event.target.value = "";
  }
}

function parseKmlPoints(text) {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  if (getByLocalName(doc, "parsererror").length) {
    throw new Error("KML 格式无法解析");
  }

  const placemarks = getByLocalName(doc, "Placemark");
  return placemarks
    .map((placemark, index) => {
      const nameEl = getByLocalName(placemark, "name")[0];
      const coordEl = getByLocalName(placemark, "coordinates")[0];
      if (!coordEl) {
        return null;
      }

      const firstCoord = coordEl.textContent.trim().split(/\s+/)[0];
      const [lng, lat, alt] = firstCoord.split(",").map(Number);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return null;
      }

      const name = nameEl && nameEl.textContent.trim() ? nameEl.textContent.trim() : `Point ${index + 1}`;
      return {
        id: `${slugify(name)}-${index + 1}`,
        name,
        lat,
        lng,
        alt: Number.isFinite(alt) ? alt : null,
      };
    })
    .filter(Boolean);
}

function getByLocalName(root, localName) {
  return Array.from(root.getElementsByTagName("*")).filter((node) => node.localName === localName);
}

function restoreDefaultPoints() {
  state.points = [...DEFAULT_POINTS];
  state.selectedId = DEFAULT_POINTS[0].id;
  state.sourceName = "内置 KML：马赛马拉的狮群";
  state.query = "";
  els.searchInput.value = "";
  render();
  fitAll();
  updateLocationStatus("已恢复默认点位");
}

function distanceMeters(a, b) {
  const earthRadius = 6371008.8;
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const deltaLat = toRadians(b.lat - a.lat);
  const deltaLng = toRadians(b.lng - a.lng);
  const h =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  return 2 * earthRadius * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function formatDistance(meters) {
  if (!Number.isFinite(meters)) {
    return "未定位";
  }
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(meters < 10000 ? 2 : 1)} km`;
}

function formatCoord(value) {
  return Number(value).toFixed(6);
}

function formatAltitude(value) {
  return Number.isFinite(value) ? `${Math.round(value)} m` : "未知";
}

function mapsViewUrl(point) {
  return `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`;
}

function mapsNavUrl(point) {
  return `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "point";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.addEventListener("DOMContentLoaded", init);
