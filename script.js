var map = L.map("map").setView([15.87, 107.81], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

var vietnamLayer;
// Load bản đồ Việt Nam
$.getJSON("vietnam.geojson.json", function (data) {
  vietnamLayer = L.geoJSON(data, {
    style: function (feature) {
      return {
        color: "#ffffff",
        weight: 1,
        fillColor:
          feature.properties.ten_tinh === "Đà Nẵng" ? "#2548b4" : "#d3daf0", // Change all other regions to #d3daf0
        fillOpacity: 0.7,
      };
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.ten_tinh);
    },
  }).addTo(map);

  // Sau khi bản đồ được load, đảm bảo các marker nằm trên cùng
  displayCompanies("all");
});

// Định nghĩa màu sắc cho từng loại hình công ty
const typeColors = {
  technology: "#FFFF00",
  manufacturing: "#33FF57",
  finance: "#3385FF",
};

// Fake dữ liệu mà không cần chỉ định màu
var companies = [
  { name: "Tech Danang", type: "technology", lat: 16.06, lng: 108.21 },
  { name: "Viet Software", type: "technology", lat: 16.07, lng: 108.2 },
  { name: "Danang Auto", type: "manufacturing", lat: 16.05, lng: 108.23 },
  { name: "Finance Hub", type: "finance", lat: 16.04, lng: 108.22 },
];

var markers = [];
function displayCompanies(filterType) {
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];

  companies.forEach((company) => {
    if (filterType === "all" || company.type === filterType) {
      var marker = L.circleMarker([company.lat, company.lng], {
        color: "#FFFFFF", // Viền trắng
        fillColor: typeColors[company.type],
        fillOpacity: 1,
        radius: 7, // Làm nhỏ hơn
        weight: 2,
      }).addTo(map);

      marker.bindPopup(`<b>${company.name}</b><br>Loại hình: ${company.type}`);
      markers.push(marker);
    }
  });

  // Đảm bảo các marker luôn nằm trên cùng ngay khi load trang
  setTimeout(() => {
    markers.forEach((marker) => marker.bringToFront());
  }, 500);
}

document.getElementById("company-type").addEventListener("change", function () {
  displayCompanies(this.value);
});

document.getElementById("reset-filter").addEventListener("click", function () {
  document.getElementById("company-type").value = "all";
  displayCompanies("all");
});
