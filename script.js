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
});

//  REMOVE OpenStreetMap layer
map.eachLayer(function (layer) {
  map.removeLayer(layer);
});

// Function to load GeoJSON files
function addVietnamLayer(geojsonPath, color = "#d3daf0") {
  $.getJSON(geojsonPath, function (data) {
    L.geoJSON(data, {
      style: function (feature) {
        return {
          color: "#ffffff",
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
  });
}

addVietnamLayer("vietnam.geojson.json");
addVietnamLayer("truongsa.json", "#f4a261");
addVietnamLayer("hoangsa.json", "#e76f51");

document.getElementById("map").style.background = "rgba(0, 0, 0, 0)";

// Keep markers on top
displayCompanies();

// Define company type colors
const typeColors = {
  technology: "#FFFF00",
  manufacturing: "#33FF57",
  finance: "#3385FF",
};

// Fake company data
var companies = [
  {
    name: "Tech Danang",
    type: "technology",
    size: "small",
    industry: "software",
    lat: 16.06,
    lng: 108.21,
  },
  {
    name: "Viet Software",
    type: "technology",
    size: "medium",
    industry: "software",
    lat: 16.07,
    lng: 108.2,
  },
  {
    name: "Danang Auto",
    type: "manufacturing",
    size: "large",
    industry: "automotive",
    lat: 16.05,
    lng: 108.23,
  },
  {
    name: "Finance Hub",
    type: "finance",
    size: "medium",
    industry: "banking",
    lat: 16.04,
    lng: 108.22,
  },
];

var markers = [];
function displayCompanies() {
  var typeFilter = document.getElementById("company-type").value;
  var sizeFilter = document.getElementById("company-size").value;
  var industryFilter = document.getElementById("company-industry").value;

  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];

  companies.forEach((company) => {
    if (
      (typeFilter === "all" || company.type === typeFilter) &&
      (sizeFilter === "all" || company.size === sizeFilter) &&
      (industryFilter === "all" || company.industry === industryFilter)
    ) {
      var marker = L.circleMarker([company.lat, company.lng], {
        color: "#FFFFFF",
        fillColor: typeColors[company.type],
        fillOpacity: 1,
        radius: 7,
        weight: 2,
      }).addTo(map);

      marker.bindPopup(
        `<b>${company.name}</b><br>Size: ${company.size}<br>Industry: ${company.industry}`
      );
      markers.push(marker);
    }
  });

  setTimeout(() => {
    markers.forEach((marker) => marker.bringToFront());
  }, 500);
}

// Add event listeners for filtering
document
  .querySelectorAll("#company-type, #company-size, #company-industry")
  .forEach((select) => select.addEventListener("change", displayCompanies));

document.getElementById("reset-filter").addEventListener("click", function () {
  document
    .querySelectorAll("#company-type, #company-size, #company-industry")
    .forEach((select) => (select.value = "all"));
  displayCompanies();
});
