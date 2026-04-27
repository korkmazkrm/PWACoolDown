const STORAGE_KEYS = {
  items: "cooldown.items",
  settings: "cooldown.settings",
};

const DEFAULT_SETTINGS = {
  allowEarlyCancel: true,
  currencyCode: "TL",
  timeRules: [
    { min: 0, max: 500, hours: 12 },
    { min: 500.01, max: 5000, hours: 24 },
    { min: 5000.01, max: 20000, hours: 72 },
    { min: 20000.01, max: Infinity, hours: 168 },
  ],
};

const state = {
  items: [],
  settings: structuredClone(DEFAULT_SETTINGS),
  selectedImage: null,
  countdownTimer: null,
  deferredInstallPrompt: null,
  objectUrls: new Map(),
};

const elements = {
  tabs: document.querySelectorAll("[data-tab]"),
  screens: document.querySelectorAll(".screen"),
  form: document.querySelector("#itemForm"),
  dropzone: document.querySelector("#dropzone"),
  imageInput: document.querySelector("#imageInput"),
  imagePreview: document.querySelector("#imagePreview"),
  productName: document.querySelector("#productName"),
  price: document.querySelector("#price"),
  cooldownHint: document.querySelector("#cooldownHint"),
  waitingGrid: document.querySelector("#waitingGrid"),
  waitingEmpty: document.querySelector("#waitingEmpty"),
  waitingCount: document.querySelector("#waitingCount"),
  savedGrid: document.querySelector("#savedGrid"),
  savedEmpty: document.querySelector("#savedEmpty"),
  totalSaved: document.querySelector("#totalSaved"),
  earlySaved: document.querySelector("#earlySaved"),
  totalBought: document.querySelector("#totalBought"),
  successRate: document.querySelector("#successRate"),
  successBar: document.querySelector("#successBar"),
  heroSavedTotal: document.querySelector("#heroSavedTotal"),
  heroSuccessRate: document.querySelector("#heroSuccessRate"),
  allowEarlyCancel: document.querySelector("#allowEarlyCancel"),
  currencyCode: document.querySelector("#currencyCode"),
  rulesTable: document.querySelector("#rulesTable"),
  saveRulesButton: document.querySelector("#saveRulesButton"),
  clearDataButton: document.querySelector("#clearDataButton"),
  installButton: document.querySelector("#installButton"),
  feedbackModal: document.querySelector("#feedbackModal"),
  feedbackIcon: document.querySelector("#feedbackIcon"),
  feedbackEyebrow: document.querySelector("#feedbackEyebrow"),
  feedbackTitle: document.querySelector("#feedbackTitle"),
  feedbackMessage: document.querySelector("#feedbackMessage"),
  modalCloseButton: document.querySelector("#modalCloseButton"),
  modalOkButton: document.querySelector("#modalOkButton"),
  productCardTemplate: document.querySelector("#productCardTemplate"),
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  loadState();
  bindEvents();
  renderAll();
  startCountdowns();
  registerServiceWorker();
}

function loadState() {
  state.settings = normalizeSettings(readJson(STORAGE_KEYS.settings, DEFAULT_SETTINGS));
  state.items = readJson(STORAGE_KEYS.items, []).map(normalizeItem);
  saveSettings();
  saveItems();
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function normalizeSettings(settings) {
  const merged = {
    ...DEFAULT_SETTINGS,
    ...settings,
  };

  return {
    allowEarlyCancel: Boolean(merged.allowEarlyCancel),
    currencyCode: normalizeCurrencyCode(merged.currencyCode),
    timeRules: (Array.isArray(merged.timeRules) ? merged.timeRules : DEFAULT_SETTINGS.timeRules)
      .map((rule, index) => ({
        min: Number(rule.min) || 0,
        max: rule.max === null || rule.max === "Infinity" ? Infinity : Number(rule.max),
        hours: Number(rule.hours) || DEFAULT_SETTINGS.timeRules[index]?.hours || 12,
      }))
      .filter((rule) => Number.isFinite(rule.min) && rule.hours > 0),
  };
}

function normalizeItem(item) {
  const assignedWaitHours = Number(item.assignedWaitHours) || getWaitHours(Number(item.price) || 0);
  const dateAdded = item.dateAdded || new Date().toISOString();
  return {
    id: item.id || createId(),
    productName: item.productName || "İsimsiz ürün",
    price: Number(item.price) || 0,
    hasImage: Boolean(item.hasImage),
    dateAdded,
    assignedWaitHours,
    expireDate: item.expireDate || new Date(new Date(dateAdded).getTime() + assignedWaitHours * 60 * 60 * 1000).toISOString(),
    status: item.status || "waiting",
  };
}

function saveSettings() {
  localStorage.setItem(
    STORAGE_KEYS.settings,
    JSON.stringify({
      allowEarlyCancel: state.settings.allowEarlyCancel,
      currencyCode: state.settings.currencyCode,
      timeRules: state.settings.timeRules.map((rule) => ({
        ...rule,
        max: rule.max === Infinity ? "Infinity" : rule.max,
      })),
    }),
  );
}

function saveItems() {
  localStorage.setItem(STORAGE_KEYS.items, JSON.stringify(state.items));
}

function bindEvents() {
  elements.tabs.forEach((button) => button.addEventListener("click", () => showTab(button.dataset.tab)));
  document.querySelectorAll("[data-tab-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showTab(link.dataset.tabLink);
    });
  });

  elements.form.addEventListener("submit", handleSubmit);
  elements.price.addEventListener("input", updateCooldownHint);
  elements.imageInput.addEventListener("change", () => setSelectedImage(elements.imageInput.files[0]));

  ["dragenter", "dragover"].forEach((eventName) => {
    elements.dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.dropzone.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    elements.dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.dropzone.classList.remove("dragover");
    });
  });

  elements.dropzone.addEventListener("drop", (event) => {
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  });

  elements.allowEarlyCancel.addEventListener("change", () => {
    state.settings.allowEarlyCancel = elements.allowEarlyCancel.checked;
    saveSettings();
    renderWaitingRoom();
  });

  elements.currencyCode.addEventListener("change", () => {
    state.settings.currencyCode = normalizeCurrencyCode(elements.currencyCode.value);
    saveSettings();
    renderAll();
  });

  elements.saveRulesButton.addEventListener("click", handleRulesSave);
  elements.clearDataButton.addEventListener("click", handleClearData);
  elements.modalCloseButton.addEventListener("click", hideFeedbackModal);
  elements.modalOkButton.addEventListener("click", hideFeedbackModal);

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
    elements.installButton.hidden = false;
  });

  elements.installButton.addEventListener("click", async () => {
    if (!state.deferredInstallPrompt) return;
    state.deferredInstallPrompt.prompt();
    await state.deferredInstallPrompt.userChoice;
    state.deferredInstallPrompt = null;
    elements.installButton.hidden = true;
  });
}

function showTab(tabName) {
  elements.tabs.forEach((button) => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  elements.screens.forEach((screen) => {
    const isActive = screen.id === `screen-${tabName}`;
    screen.classList.toggle("active", isActive);
    screen.hidden = !isActive;
  });
}

async function handleSubmit(event) {
  event.preventDefault();

  const price = parseCurrencyInput(elements.price.value);
  const productName = elements.productName.value.trim();
  if (!productName || price <= 0) {
    showValidationModal(productName, price);
    return;
  }

  const id = createId();
  const assignedWaitHours = getWaitHours(price);
  const dateAdded = new Date();
  const item = {
    id,
    productName,
    price,
    hasImage: Boolean(state.selectedImage),
    dateAdded: dateAdded.toISOString(),
    assignedWaitHours,
    expireDate: new Date(dateAdded.getTime() + assignedWaitHours * 60 * 60 * 1000).toISOString(),
    status: "waiting",
  };

  if (state.selectedImage) {
    await saveImageToOpfs(id, state.selectedImage);
  }

  state.items.unshift(item);
  saveItems();
  resetForm();
  renderAll();
  showTab("waiting");
}

function updateCooldownHint() {
  const price = parseCurrencyInput(elements.price.value);
  if (!price) {
    elements.cooldownHint.textContent = "Fiyat girildiğinde soğuma süreniz burada görünecek.";
    return;
  }

  const hours = getWaitHours(price);
  elements.cooldownHint.textContent = `Bu tutar için soğuma süreniz ${formatHours(hours)}.`;
}

function getWaitHours(price) {
  const rule = state.settings.timeRules.find((item) => price >= item.min && price <= item.max);
  return rule?.hours || DEFAULT_SETTINGS.timeRules.at(-1).hours;
}

function parseCurrencyInput(value) {
  if (!value) return 0;
  const compactValue = value.toString().trim().replace(/\s/g, "");
  const hasComma = compactValue.includes(",");
  const dotCount = (compactValue.match(/\./g) || []).length;
  let normalized = compactValue;

  if (hasComma) {
    normalized = compactValue.replace(/\./g, "").replace(",", ".");
  } else if (dotCount === 1) {
    const [integerPart, decimalPart] = compactValue.split(".");
    normalized = decimalPart.length === 3 && integerPart !== "0" ? compactValue.replace(".", "") : compactValue;
  } else if (dotCount > 1) {
    normalized = compactValue.replace(/\./g, "");
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value) {
  return `${new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)} ${state.settings.currencyCode}`;
}

function formatNumber(value) {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function normalizeCurrencyCode(value) {
  const code = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  return code || DEFAULT_SETTINGS.currencyCode;
}

function formatHours(hours) {
  return hours >= 24 && hours % 24 === 0 ? `${hours / 24} gün` : `${hours} saat`;
}

function createId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function setSelectedImage(file) {
  if (!file || !file.type.startsWith("image/")) return;
  state.selectedImage = file;
  elements.imagePreview.src = URL.createObjectURL(file);
  elements.imagePreview.hidden = false;
}

function resetForm() {
  elements.form.reset();
  state.selectedImage = null;
  elements.imagePreview.removeAttribute("src");
  elements.imagePreview.hidden = true;
  updateCooldownHint();
}

async function saveImageToOpfs(id, file) {
  const directory = await getImageDirectory();
  if (!directory) return;

  const handle = await directory.getFileHandle(id, { create: true });
  const writable = await handle.createWritable();
  await writable.write(file);
  await writable.close();
}

async function loadImageUrl(id) {
  if (state.objectUrls.has(id)) {
    return state.objectUrls.get(id);
  }

  const directory = await getImageDirectory();
  if (!directory) return "";

  try {
    const handle = await directory.getFileHandle(id);
    const file = await handle.getFile();
    const url = URL.createObjectURL(file);
    state.objectUrls.set(id, url);
    return url;
  } catch {
    return "";
  }
}

async function clearOpfsImages() {
  const directory = await getImageDirectory();
  if (!directory) return;

  for await (const name of directory.keys()) {
    await directory.removeEntry(name);
  }
}

async function getImageDirectory() {
  if (!navigator.storage?.getDirectory) {
    return null;
  }

  try {
    const root = await navigator.storage.getDirectory();
    return root.getDirectoryHandle("cooldown-images", { create: true });
  } catch {
    return null;
  }
}

function renderAll() {
  renderSettings();
  renderWaitingRoom();
  renderWallet();
}

function renderSettings() {
  elements.allowEarlyCancel.checked = state.settings.allowEarlyCancel;
  elements.currencyCode.value = state.settings.currencyCode;
  elements.rulesTable.innerHTML = "";

  state.settings.timeRules.forEach((rule, index) => {
    const row = document.createElement("div");
    row.className = "rule-row";
    row.innerHTML = `
      <label>
        Minimum
        <input type="text" inputmode="decimal" value="${formatNumber(rule.min)}" data-rule="${index}" data-field="min" />
      </label>
      <label>
        Maksimum
        <input type="text" inputmode="decimal" value="${rule.max === Infinity ? "∞" : formatNumber(rule.max)}" data-rule="${index}" data-field="max" />
      </label>
      <label>
        Süre (saat)
        <input type="text" inputmode="decimal" value="${formatNumber(rule.hours)}" data-rule="${index}" data-field="hours" />
      </label>
    `;
    elements.rulesTable.append(row);
  });
}

async function renderWaitingRoom() {
  const waitingItems = state.items.filter((item) => item.status === "waiting");
  elements.waitingGrid.innerHTML = "";
  elements.waitingEmpty.hidden = waitingItems.length > 0;
  elements.waitingCount.textContent = `${waitingItems.length} ürün bekliyor`;

  for (const item of waitingItems) {
    const card = await createProductCard(item, "waiting");
    elements.waitingGrid.append(card);
  }
}

async function renderWallet() {
  const savedItems = state.items.filter((item) => item.status === "saved_full" || item.status === "saved_early");
  const boughtItems = state.items.filter((item) => item.status === "bought");
  const decisionItems = [...savedItems, ...boughtItems].sort((first, second) => new Date(second.dateAdded) - new Date(first.dateAdded));
  elements.savedGrid.innerHTML = "";
  elements.savedEmpty.hidden = decisionItems.length > 0;

  for (const item of decisionItems) {
    const card = await createProductCard(item, "history");
    elements.savedGrid.append(card);
  }

  const totalSaved = savedItems.reduce((sum, item) => sum + item.price, 0);
  const earlySaved = savedItems.filter((item) => item.status === "saved_early").reduce((sum, item) => sum + item.price, 0);
  const totalBought = boughtItems.reduce((sum, item) => sum + item.price, 0);
  const completedDecisions = state.items.filter((item) => item.status !== "waiting").length;
  const success = completedDecisions ? Math.round((savedItems.length / completedDecisions) * 100) : 0;

  elements.totalSaved.textContent = formatCurrency(totalSaved);
  elements.earlySaved.textContent = formatCurrency(earlySaved);
  elements.totalBought.textContent = formatCurrency(totalBought);
  elements.successRate.textContent = `%${success}`;
  elements.successBar.style.width = `${success}%`;
  elements.heroSavedTotal.textContent = formatCurrency(totalSaved);
  elements.heroSuccessRate.textContent = `%${success} irade başarısı`;
}

async function createProductCard(item, mode) {
  const fragment = elements.productCardTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".product-card");
  const image = fragment.querySelector(".product-image");
  const imageWrap = fragment.querySelector(".product-image-wrap");
  const badge = fragment.querySelector(".countdown-badge");
  const title = fragment.querySelector("h3");
  const price = fragment.querySelector(".price");
  const meta = fragment.querySelector(".meta");
  const actions = fragment.querySelector(".card-actions");

  title.textContent = item.productName;
  price.textContent = formatCurrency(item.price);

  if (item.hasImage) {
    const imageUrl = await loadImageUrl(item.id);
    if (imageUrl) {
      image.src = imageUrl;
      image.alt = `${item.productName} görseli`;
    } else {
      renderImagePlaceholder(imageWrap, image, "Görsel bulunamadı");
    }
  } else {
    renderImagePlaceholder(imageWrap, image, item.productName);
  }

  if (mode === "waiting") {
    const remaining = getRemainingMs(item);
    const isExpired = remaining <= 0;
    badge.textContent = isExpired ? "Süre doldu" : `Flash Sale molası: ${formatRemaining(remaining)}`;
    badge.classList.toggle("done", isExpired);
    meta.textContent = `${formatHours(item.assignedWaitHours)} bekleme süresi atandı. Bitiş: ${formatDate(item.expireDate)}`;

    actions.append(
      createActionButton("Satın Aldım", "secondary-button", () => handleDecision(item.id, "bought"), !isExpired && !state.settings.allowEarlyCancel),
      createActionButton("Vazgeçtim", "primary-button", () => handleDecision(item.id, isExpired ? "saved_full" : "saved_early"), !isExpired && !state.settings.allowEarlyCancel),
    );
  } else {
    const historyCopy = getHistoryCopy(item);
    badge.textContent = historyCopy.badge;
    badge.classList.add("done");
    meta.textContent = historyCopy.meta;
  }

  return card;
}

function getHistoryCopy(item) {
  if (item.status === "bought") {
    return {
      badge: "Satın alındı",
      meta: "Bu ürün için satın alma kararı verildi. Kumbara toplamına eklenmedi.",
    };
  }

  if (item.status === "saved_full") {
    return {
      badge: "Tam süre bekledi",
      meta: "Sayaç tamamlandıktan sonra satın alınmadı.",
    };
  }

  return {
    badge: "Erken vazgeçti",
    meta: "Sayaç bitmeden satın almaktan vazgeçildi.",
  };
}

function renderImagePlaceholder(imageWrap, image, text) {
  image.remove();
  const placeholder = document.createElement("div");
  placeholder.className = "product-placeholder";
  placeholder.textContent = text;
  imageWrap.prepend(placeholder);
}

function createActionButton(label, className, onClick, disabled = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.disabled = disabled;
  button.addEventListener("click", onClick);
  return button;
}

function handleDecision(id, status) {
  const item = state.items.find((candidate) => candidate.id === id);
  if (!item) return;

  const isEarlyDecision = getRemainingMs(item) > 0;
  updateItemStatus(id, status);

  if (isEarlyDecision) {
    showEarlyDecisionModal(item, status);
  }
}

function updateItemStatus(id, status) {
  const item = state.items.find((candidate) => candidate.id === id);
  if (!item) return;
  item.status = status;
  saveItems();
  renderAll();
}

function getRemainingMs(item) {
  return new Date(item.expireDate).getTime() - Date.now();
}

function formatRemaining(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}g ${hours}s ${minutes}dk`;
  }
  return `${hours}s ${minutes}dk ${seconds}sn`;
}

function showEarlyDecisionModal(item, status) {
  const boughtEarly = status === "bought";
  elements.feedbackIcon.textContent = boughtEarly ? "!" : "TL";
  elements.feedbackIcon.classList.toggle("success", !boughtEarly);
  elements.feedbackEyebrow.textContent = boughtEarly ? "Erken satın alma" : "Erken vazgeçme";
  elements.feedbackTitle.textContent = boughtEarly ? "Soğuma süresi bitmeden satın aldın" : "Güzel karar, parayı cebinde tuttun";
  elements.feedbackMessage.textContent = boughtEarly
    ? `${item.productName} için sayaç bitmeden alışverişi tamamladın. Bir sonraki istekte süreyi sonuna kadar beklemek kararını daha netleştirebilir.`
    : `${item.productName} için ${formatCurrency(item.price)} harcamaktan sayaç bitmeden vazgeçtin. Bu tutar kumbara raporuna eklendi.`;
  elements.feedbackModal.hidden = false;
  elements.modalOkButton.focus();
}

function showValidationModal(productName, price) {
  const missingFields = [];
  if (!productName) missingFields.push("ürün adı");
  if (price <= 0) missingFields.push("geçerli bir fiyat");

  elements.feedbackIcon.textContent = "!";
  elements.feedbackIcon.classList.remove("success");
  elements.feedbackEyebrow.textContent = "Eksik bilgi";
  elements.feedbackTitle.textContent = "Ürünü CoolDown'a alamadık";
  elements.feedbackMessage.textContent = `Devam etmek için ${missingFields.join(" ve ")} girmen gerekiyor.`;
  elements.feedbackModal.hidden = false;
  elements.modalOkButton.focus();
}

function showInfoModal({ eyebrow, title, message, success = false }) {
  elements.feedbackIcon.textContent = success ? "OK" : "!";
  elements.feedbackIcon.classList.toggle("success", success);
  elements.feedbackEyebrow.textContent = eyebrow;
  elements.feedbackTitle.textContent = title;
  elements.feedbackMessage.textContent = message;
  elements.feedbackModal.hidden = false;
  elements.modalOkButton.focus();
}

function hideFeedbackModal() {
  elements.feedbackModal.hidden = true;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

function startCountdowns() {
  window.clearInterval(state.countdownTimer);
  state.countdownTimer = window.setInterval(() => {
    renderWaitingRoom();
  }, 1000);
}

function handleRulesSave() {
  const inputs = [...elements.rulesTable.querySelectorAll("input")];
  const nextRules = state.settings.timeRules.map((rule) => ({ ...rule }));

  inputs.forEach((input) => {
    const index = Number(input.dataset.rule);
    const field = input.dataset.field;
    const value = input.value.trim();

    if (field === "max" && (value === "∞" || value.toLowerCase() === "infinity")) {
      nextRules[index][field] = Infinity;
    } else if (field === "hours") {
      nextRules[index][field] = Math.max(0.01, parseCurrencyInput(value) || 0.01);
    } else {
      nextRules[index][field] = parseCurrencyInput(value);
    }
  });

  state.settings.timeRules = nextRules;
  saveSettings();
  renderSettings();
  updateCooldownHint();
  showInfoModal({
    eyebrow: "Ayarlar kaydedildi",
    title: "Süre kuralları güncellendi",
    message: "Yeni fiyat aralıkları bundan sonra ekleyeceğin ürünler için geçerli olacak.",
    success: true,
  });
}

async function handleClearData() {
  const confirmed = window.confirm("Tüm CoolDown verileri ve görseller silinsin mi?");
  if (!confirmed) return;

  state.items = [];
  state.settings = structuredClone(DEFAULT_SETTINGS);
  saveItems();
  saveSettings();
  await clearOpfsImages();
  revokeObjectUrls();
  resetForm();
  renderAll();
  showTab("add");
}

function revokeObjectUrls() {
  state.objectUrls.forEach((url) => URL.revokeObjectURL(url));
  state.objectUrls.clear();
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register("sw.js");
    await registration.update();
  } catch {
    // The app still works as a normal web app if service worker registration fails.
  }
}
