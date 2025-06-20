var map = L.map("map", {
  center: [16.0471, 108.2068], // ✅ Tọa độ trung tâm Đà Nẵng
  zoom: 11,
  minZoom: 5,
  maxBounds: [
    [4.0, 100.0],
    [25.0, 120.0],
  ],
  maxBoundsViscosity: 0.8,
  renderer: L.svg({ padding: 0.5 }),
});

// If markerPane already exists, remove it
if (map.getPane("markerPane")) {
  map.removeLayer(map.getPane("markerPane"));
}

// Create a pane for markers and add a CSS class
const markerPane = map.createPane("markerPane");
markerPane.classList.add("marker-pane");

// Remove OpenStreetMap tile layer if exists
map.eachLayer(function (layer) {
  if (layer instanceof L.TileLayer) {
    map.removeLayer(layer);
  }
});

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution: "© OpenStreetMap contributors",
//   maxZoom: 19,
// }).addTo(map);

// Function to load GeoJSON for regions
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

// Load GeoJSON layers: Vietnam, Hoang Sa, Truong Sa
addVietnamLayer("vietnam.geojson.json");
addVietnamLayer("truongsa.json", "#f4a261");
addVietnamLayer("hoangsa.json", "#e76f51");

// Define colors by company type
const typeColors = {
  semiconductor: "#33aaff",
  ai: "#33cc33",
  gov: "#9999ff",
  "university-rd": "#00f8f8",
  strategic: "#ff5733",
  investor: "#ff9999",
  materials: "#66ccff",
  supplier: "#9900cc",
  "energy-water": "#66ffcc",
  enabler: "#cc66ff",
  startup: "#ffcc00",
};

// Company data will be loaded from JSON file
var companies = [];

// List of existing markers
var markers = [];

// Function to get selected values from multi-select dropdowns
function getSelectedValues(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const checked = Array.from(dropdown.querySelectorAll("input:checked"));

  // If "All" is checked or no checkboxes are checked, return empty array (show all)
  if (checked.some((cb) => cb.value === "all") || checked.length === 0) {
    return [];
  }

  return checked.map((cb) => cb.value);
}

// Define full names for company type, segment, and facility
const typeNames = {
  semiconductor: "Companies in Semiconductor",
  ai: "Companies in AI",
  gov: "Government Agencies",
  "university-rd": "University R&D",
  strategic: "City's Strategic Partners",
  investor: "Investors",
  materials: "Materials Suppliers",
  supplier: "Equipment Suppliers",
  "energy-water": "Energy/Water",
  enabler: "Enablers (Incubator & Accelerators Program)",
  startup: "Startups",
};

const segmentNames = {
  "ip-eda": "IP & EDA",
  fabless: "Fabless",
  foundry: "Foundry",
  idm: "IDM",
  osat: "OSAT",
  equipment: "Equipment",
  materials: "Materials",
  fpga: "FPGA Design",
  "university-rdp": "University R&D Partner",
};

const facilityNames = {
  "chip-design": "Chip Design",
  "ip-core": "IP Core",
  "eda-software": "EDA Software",
  rnd: "Research & Development",
  "material-suppliers": "Material Suppliers",
  "equipment-manufacturers": "Equipment Manufacturers",
  "wafer-fabrication": "Wafer Fabrication",
  "assembly-testing": "Assembly & Testing",
};

const aiSegmentNames = {
  "ai-hardware": "Hardware",
  "ai-apps": "Applications",
  "ai-data": "Data Infrastructure",
  "ai-university": "University R&D Partner",
};

const aiFacilityNames = {
  "ai-hpc": "AI Hardware & High-Performance Computing",
  "ai-ml": "Machine Learning",
  "ai-vision": "Computer Vision",
  "ai-convo": "Conversational Platforms",
  "ai-ethics": "Ethical, Legal, Social Aspects",
  "ai-robotics": "Robotics",
  "ai-infrastructure": "Data Infrastructure & Services",
  "ai-search": "Search & Optimisation",
  "ai-routing": "Planning, Routing & Scheduling",
  "ai-labeling": "Data Annotation & Labeling",
  "ai-multiagent": "Multi-Agent Systems & Agent-based Modelling",
  "ai-context": "Context-aware Computing",
  "ai-rnd": "Research & Development",
};

// Function to replace values with full names
function getFullNames(data, mapping) {
  return data.map((item) => mapping[item] || item).join(", ");
}

// Function to display companies on the map
function displayCompanies() {
  const typeFilters = getSelectedValues("company-type");
  const segmentFilters = getSelectedValues("industry-segment");
  const facilityFilters = getSelectedValues("facility-activity");
  const aiSegmentFilters = getSelectedValues("ai-segment");
  const aiFacilityFilters = getSelectedValues("ai-facility");

  // Remove old markers
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];

  companies.forEach((company) => {
    let matchesType =
      typeFilters.length === 0 ||
      typeFilters.some((filter) => company.type.includes(filter));
    let matchesSegment =
      segmentFilters.length === 0 ||
      segmentFilters.some((filter) => company.segment.includes(filter));
    let matchesFacility =
      facilityFilters.length === 0 ||
      facilityFilters.some((filter) => company.facility.includes(filter));
    let matchesAI =
      aiSegmentFilters.length === 0 ||
      aiSegmentFilters.some((filter) => company.aiSegment?.includes(filter));
    let matchesAIFacility =
      aiFacilityFilters.length === 0 ||
      aiFacilityFilters.some((filter) => company.aiFacility?.includes(filter));

    if (
      matchesType &&
      matchesSegment &&
      matchesFacility &&
      matchesAI &&
      matchesAIFacility
    ) {
      var dot = L.circleMarker([company.lat, company.lng], {
        color: "#FFFFFF",
        fillColor: typeColors[company.type[0]] || "#000000", // Use the first type for color
        fillOpacity: 1,
        radius: 6,
        weight: 2,
        pane: "markerPane",
      }).addTo(map);

      let popupContent = `
      ${
        company.logo
          ? `<img src="${company.logo}" style="width:180px; height:90px; object-fit:contain; margin-bottom:8px;">
          <br>`
          : ""
      }
      📍 <b>${company.name}</b><br>
      Type: ${getFullNames(company.type, typeNames)}<br>
      ${
        company.segment && company.segment.length > 0
          ? `Semi Segment: ${getFullNames(company.segment, segmentNames)}<br>`
          : ""
      }
      <!--
      ${
        company.facility && company.facility.length > 0
          ? `Semi Facility: ${getFullNames(
              company.facility,
              facilityNames
            )}<br>`
          : ""
      }
      -->
      ${
        company.aiSegment && company.aiSegment.length > 0
          ? `AI Segment: ${getFullNames(company.aiSegment, aiSegmentNames)}<br>`
          : ""
      }
      <!--
      ${
        company.aiFacility && company.aiFacility.length > 0
          ? `AI Facility: ${getFullNames(
              company.aiFacility,
              aiFacilityNames
            )}<br>`
          : ""
      }
      -->
      Location: ${company.address}
    `;

      dot.bindPopup(popupContent);

      dot.bringToFront();
      markers.push(dot);
    }
  });

  setTimeout(() => {
    markers.forEach((marker) => marker.bringToFront());
  }, 500);
}

// Load company data from companies.json and display
$.getJSON("companies.json")
  .done(function (data) {
    companies = data;
    displayCompanies();
  })
  .fail(function (err) {
    console.error("Error loading companies data:", err);
  });

// Add event listeners for filters
// Handle dropdown toggle
document.querySelectorAll(".dropdown-toggle").forEach((button) => {
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const target = document.getElementById(button.dataset.target);
    target.classList.toggle("show");
  });
});

document.querySelectorAll(".dropdown-menu").forEach((menu) => {
  menu.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

// Close dropdowns when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.matches(".dropdown-toggle")) {
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.classList.remove("show");
    });
  }
});

// Handle checkbox changes
document
  .querySelectorAll('.dropdown-menu input[type="checkbox"]')
  .forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const dropdown = this.closest(".dropdown-menu");
      const allCheckbox = dropdown.querySelector('input[value="all"]');

      if (this.value === "all") {
        // When "All" is checked, uncheck others
        dropdown.querySelectorAll('input:not([value="all"])').forEach((cb) => {
          cb.checked = false;
        });
      } else {
        // When any other checkbox is checked, uncheck "All"
        allCheckbox.checked = false;
      }

      updateDropdownToggleText(dropdown);
      displayCompanies();
    });
  });

// Update dropdown toggle text
function updateDropdownToggleText(dropdown) {
  const checked = Array.from(
    dropdown.querySelectorAll('input:checked:not([value="all"])')
  );
  const toggle = document.querySelector(`[data-target="${dropdown.id}"]`);

  if (
    checked.length === 0 ||
    dropdown.querySelector('input[value="all"]:checked')
  ) {
    toggle.textContent = "All ";
  } else {
    toggle.textContent = `${checked.length} selected `;
  }
}

// Update reset filter handler
document.getElementById("reset-filter").addEventListener("click", function () {
  document.querySelectorAll(".dropdown-menu").forEach((dropdown) => {
    dropdown.querySelectorAll("input").forEach((cb) => {
      cb.checked = cb.value === "all";
    });
    updateDropdownToggleText(dropdown);
  });
  displayCompanies();
});
