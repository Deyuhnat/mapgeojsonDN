// Khởi tạo bản đồ và chỉ hiển thị khu vực Đà Nẵng
var map = L.map("map").setView([16.047, 108.206], 12); // Trung tâm Đà Nẵng

// Thêm bản đồ OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Định nghĩa SVG map overlay
var svgUrl = "path/to/your/danang-map.svg"; // Chỉnh lại đường dẫn SVG của Đà Nẵng
var bounds = [
  [16.031, 108.153],
  [16.076, 108.215],
]; // Tọa độ của Đà Nẵng

// Thêm SVG map vào bản đồ
L.imageOverlay(svgUrl, bounds).addTo(map);

// Dữ liệu giả định về các công ty (thêm nhiều công ty hơn)
var companies = [
  {
    name: "Semiconductor A",
    location: [16.047, 108.206],
    industry: "semiconductors",
  },
  { name: "Material B", location: [16.048, 108.207], industry: "materials" },
  {
    name: "Semiconductor C",
    location: [16.049, 108.208],
    industry: "semiconductors",
  },
  {
    name: "Semiconductor D",
    location: [16.05, 108.209],
    industry: "semiconductors",
  },
  { name: "Material E", location: [16.051, 108.21], industry: "materials" },
  {
    name: "Semiconductor F",
    location: [16.052, 108.211],
    industry: "semiconductors",
  },
  { name: "Material G", location: [16.053, 108.212], industry: "materials" },
  {
    name: "Semiconductor H",
    location: [16.054, 108.213],
    industry: "semiconductors",
  },
  { name: "Material I", location: [16.055, 108.214], industry: "materials" },
  {
    name: "Semiconductor J",
    location: [16.056, 108.215],
    industry: "semiconductors",
  },
];

// Tạo nhóm marker
var markers = L.markerClusterGroup();

// Thêm các marker vào bản đồ
companies.forEach(function (company) {
  var color = company.industry === "semiconductors" ? "blue" : "green";
  var marker = L.marker(company.location, {
    icon: L.icon({
      iconUrl: `https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    }),
  }).bindPopup(`<b>${company.name}</b><br>Industry: ${company.industry}`);

  markers.addLayer(marker);
});

// Thêm nhóm marker vào bản đồ
map.addLayer(markers);

// Bộ lọc theo ngành nghề
document
  .getElementById("industry-filter")
  .addEventListener("change", function () {
    var selectedIndustry = this.value;

    markers.clearLayers();

    companies.forEach(function (company) {
      if (selectedIndustry === "all" || company.industry === selectedIndustry) {
        var color = company.industry === "semiconductors" ? "blue" : "green";
        var marker = L.marker(company.location).bindPopup(
          `<b>${company.name}</b><br>Industry: ${company.industry}`
        );
        markers.addLayer(marker);
      }
    });

    map.addLayer(markers);
  });

// Nút reset
document.getElementById("reset-btn").addEventListener("click", function () {
  document.getElementById("industry-filter").value = "all";
  markers.clearLayers();

  companies.forEach(function (company) {
    var marker = L.marker(company.location).bindPopup(
      `<b>${company.name}</b><br>Industry: ${company.industry}`
    );
    markers.addLayer(marker);
  });

  map.addLayer(markers);
});
