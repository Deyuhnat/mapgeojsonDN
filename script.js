var map = L.map("map", {
  center: [15.87, 107.81],
  zoom: 6,
  minZoom: 5,
  maxZoom: 12,
  maxBounds: [
    [4.0, 100.0],
    [25.0, 120.0],
  ],
  maxBoundsViscosity: 0.8,
  renderer: L.svg({ padding: 0.5 }),
});

// Nếu pane marker đã tồn tại thì xóa đi
if (map.getPane("markerPane")) {
  map.removeLayer(map.getPane("markerPane"));
}

// Tạo pane cho các dấu chấm, gắn class để style bằng CSS
const markerPane = map.createPane("markerPane");
markerPane.classList.add("marker-pane");

// Loại bỏ layer OpenStreetMap nếu có
map.eachLayer(function (layer) {
  if (layer instanceof L.TileLayer) {
    map.removeLayer(layer);
  }
});

// Hàm load GeoJSON cho các vùng
function addVietnamLayer(geojsonPath, color = "#d3daf0") {
  return new Promise((resolve, reject) => {
    $.getJSON(geojsonPath)
      .done(function (data) {
        L.geoJSON(data, {
          style: function (feature) {
            return {
              color: "#999999",
              weight: 1,
              fillColor:
                feature.properties.ten_tinh === "Đà Nẵng" ? "#2548b4" : color,
              fillOpacity: 1,
            };
          },
          onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.ten_tinh);
          },
        }).addTo(map);
        resolve();
      })
      .fail(reject);
  });
}

// Load các layer GeoJSON: Việt Nam, Trường Sa, Hoàng Sa
addVietnamLayer("vietnam.geojson.json");
addVietnamLayer("truongsa.json", "#f4a261");
addVietnamLayer("hoangsa.json", "#e76f51");

// Định nghĩa màu theo loại hình công ty
const typeColors = {
  technology: "#FFFF00",
  manufacturing: "#33FF57",
  finance: "#3385FF",
};

// Dữ liệu công ty sẽ được load từ file JSON
var companies = [];

// Danh sách marker hiện có
var markers = [];

// Hàm hiển thị các công ty trên bản đồ
function displayCompanies() {
  var typeFilter = document.getElementById("company-type").value;
  var sizeFilter = document.getElementById("company-size").value;
  var industryFilter = document.getElementById("company-industry").value;

  // Xóa các marker cũ
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];

  companies.forEach((company) => {
    if (
      (typeFilter === "all" || company.type === typeFilter) &&
      (sizeFilter === "all" || company.size === sizeFilter) &&
      (industryFilter === "all" || company.industry === industryFilter)
    ) {
      var dot = L.circleMarker([company.lat, company.lng], {
        color: "#FFFFFF",
        fillColor: typeColors[company.type],
        fillOpacity: 1,
        radius: 6,
        weight: 2,
        pane: "markerPane",
      }).addTo(map);

      dot.bindPopup(
        `📍 <b>${company.name}</b><br>Size: ${company.size}<br>Industry: ${company.industry}`
      );

      dot.bringToFront();
      markers.push(dot);
    }
  });

  map._renderer._update();

  setTimeout(() => {
    markers.forEach((marker) => marker.bringToFront());
  }, 500);
}

// Load dữ liệu công ty từ file companies.json và hiển thị
$.getJSON("companies.json")
  .done(function (data) {
    companies = data;
    displayCompanies();
  })
  .fail(function (err) {
    console.error("Error loading companies data:", err);
  });

// Thêm sự kiện thay đổi giá trị lọc
document
  .querySelectorAll("#company-type, #company-size, #company-industry")
  .forEach((select) => select.addEventListener("change", displayCompanies));

document.getElementById("reset-filter").addEventListener("click", function () {
  document
    .querySelectorAll("#company-type, #company-size, #company-industry")
    .forEach((select) => (select.value = "all"));
  displayCompanies();
});
