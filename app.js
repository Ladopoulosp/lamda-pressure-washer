const products = [
  {
    code: "WS202",
    name: "Interpump WS202 Triplex Pump",
    category: "pumps",
    family: "WS Series",
    pressure: "200 bar",
    flow: "14 lpm",
    rpm: "1450 rpm",
    drive: "Direct drive",
    doc: "docs/ws202.pdf",
    image: "images/ws202.jpg",
    lead: "Ready to upload",
    price: "Request quote",
    description: "Placeholder data. Swap with the official WS202 spec and imagery." 
  },
  {
    code: "WW190",
    name: "Interpump WW190 Pump",
    category: "pumps",
    family: "WW Series",
    pressure: "190 bar",
    flow: "15 lpm",
    rpm: "1450 rpm",
    drive: "Belt drive",
    doc: "docs/ww190.pdf",
    image: "images/ww190.jpg",
    lead: "Ready to upload",
    price: "Request quote",
    description: "Placeholder entry for WW series. Replace with official documentation." 
  },
  {
    code: "XLT2805",
    name: "Interpump XLT 2805 Pump",
    category: "pumps",
    family: "XLT",
    pressure: "280 bar",
    flow: "18.5 lpm",
    rpm: "1450 rpm",
    drive: "Belt drive",
    doc: "docs/xlt2805.pdf",
    image: "images/xlt2805.jpg",
    lead: "Ready to upload",
    price: "Request quote",
    description: "High pressure placeholder. Replace with the official XLT 2805 data." 
  },
  {
    code: "KIT-UNLOADER",
    name: "Unloader Valve Kit",
    category: "kits",
    family: "Service Kits",
    pressure: "Up to 250 bar",
    flow: "",
    rpm: "",
    drive: "",
    doc: "docs/kit-unloader.pdf",
    image: "images/kit-unloader.jpg",
    lead: "Ready to upload",
    price: "Request quote",
    description: "Accessory placeholder kit. Swap with official kit contents and PDF." 
  },
  {
    code: "SPARE-SEAL-13MM",
    name: "Seal Kit 13 mm",
    category: "spares",
    family: "Spare Parts",
    pressure: "Match pump spec",
    flow: "",
    rpm: "",
    drive: "",
    doc: "docs/seal-13mm.pdf",
    image: "images/seal-13mm.jpg",
    lead: "Ready to upload",
    price: "Request quote",
    description: "Placeholder spare seal kit keyed to product code. Replace with Interpump spec sheet." 
  },
  {
    code: "GUN-AGRICLEAN",
    name: "Spray Gun Agricultural",
    category: "accessories",
    family: "Accessories",
    pressure: "Up to 250 bar",
    flow: "30 lpm",
    rpm: "",
    drive: "",
    doc: "docs/gun-agri.pdf",
    image: "images/gun-agri.jpg",
    lead: "Ready to upload",
    price: "Request quote",
    description: "Accessory placeholder for Interpump spray guns. Attach correct PDF and image." 
  }
];

const productGrid = document.getElementById("productGrid");
const filterButtons = document.querySelectorAll("[data-filter]");
const searchField = document.getElementById("searchField");
const emptyState = document.getElementById("emptyState");
const resetFilters = document.getElementById("resetFilters");
const toast = document.getElementById("toast");
const scheduleCall = document.getElementById("scheduleCall");

let activeFilter = "all";
const favorites = new Set();

function backgroundValue(image) {
  return image ? `url('${image}')` : "linear-gradient(135deg, #e0efff, #cde5ff)";
}

function renderProducts() {
  const query = searchField.value.trim().toLowerCase();
  const filtered = products.filter((item) => {
    const matchesFilter = activeFilter === "all" || item.category === activeFilter;
    const haystack = `${item.code} ${item.name} ${item.family} ${item.pressure} ${item.flow}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    return matchesFilter && matchesQuery;
  });

  emptyState.hidden = filtered.length > 0;
  productGrid.innerHTML = filtered
    .map((item) => {
      const faveActive = favorites.has(item.code) ? "active" : "";
      const faveLabel = favorites.has(item.code) ? "Saved" : "Save";
      const specs = [item.pressure, item.flow, item.rpm, item.drive]
        .filter(Boolean)
        .map((spec) => `<span>${spec}</span>`)
        .join("");

      const docLink = item.doc
        ? `<a href="${item.doc}" target="_blank" rel="noopener">Spec sheet</a>`
        : `<span>Upload docs/${item.code.toLowerCase()}.pdf</span>`;

      return `
        <article class="product-card" data-category="${item.category}">
          <div class="product-media" style="background-image:${backgroundValue(item.image)}"></div>
          <div class="card-top">
            <p class="code">${item.code}</p>
            <div class="badge">${item.family}</div>
          </div>
          <h3>${item.name}</h3>
          <p class="desc">${item.description}</p>
          <div class="specs">${specs}</div>
          <div class="doc-link">${docLink}</div>
          <div class="card-footer">
            <div>
              <p class="price">${item.price}</p>
              <p class="micro">${item.lead || "Lead time pending"}</p>
            </div>
            <div class="card-actions">
              <button class="icon-btn favorite ${faveActive}" data-id="${item.code}" aria-label="Toggle shortlist for ${item.name}">${faveLabel}</button>
              <button class="btn tiny inquire" data-id="${item.code}">Inquire</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function setActiveFilter(value) {
  activeFilter = value;
  filterButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === value);
  });
  renderProducts();
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => setActiveFilter(btn.dataset.filter));
});

searchField.addEventListener("input", () => {
  renderProducts();
});

resetFilters.addEventListener("click", () => {
  searchField.value = "";
  setActiveFilter("all");
});

productGrid.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("favorite")) {
    const code = target.dataset.id;
    favorites.has(code) ? favorites.delete(code) : favorites.add(code);
    showToast(`${favorites.has(code) ? "Added to" : "Removed from"} shortlist`);
    renderProducts();
  }
  if (target.classList.contains("inquire")) {
    const code = target.dataset.id;
    const product = products.find((p) => p.code === code);
    showToast(`We will follow up about ${product?.code || "this item"}`);
  }
});

scheduleCall.addEventListener("click", () => showToast("We will schedule a 15-minute vendor call."));

let toastTimeout;
function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("visible");
    toastTimeout = setTimeout(() => (toast.hidden = true), 220);
  }, 2400);
}

renderProducts();
