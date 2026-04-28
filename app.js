const STORAGE_KEYS = {
  items: "cooldown.items",
  settings: "cooldown.settings",
  lastSeenAt: "cooldown.lastSeenAt",
  auth: "cooldown.auth",
};

const LOCAL_API_BASE_URLS = ["https://localhost:7269/api", "http://localhost:5261/api"];
const API_BASE_URLS =
  localStorage.getItem("cooldown.apiBaseUrl")?.split(",").map((url) => url.trim()).filter(Boolean) ||
  (["localhost", "127.0.0.1"].includes(window.location.hostname) ? LOCAL_API_BASE_URLS : [`${window.location.origin}/api`]);

const FREE_ITEM_LIMIT = 3;

const DEFAULT_SETTINGS = {
  allowEarlyCancel: true,
  currencyCode: "TL",
  hourlyWage: 0,
  language: "tr",
  timeRules: [
    { min: 0, max: 500, hours: 12 },
    { min: 500.01, max: 5000, hours: 24 },
    { min: 5000.01, max: 20000, hours: 72 },
    { min: 20000.01, max: Infinity, hours: 168 },
  ],
};

const TRANSLATIONS = {
  tr: {
    documentTitle: "CoolDown",
    navAria: "Ana gezinme",
    brandAria: "CoolDown ana sayfa",
    brandTagline: "Satın almadan önce düşün",
    installApp: "Uygulamayı Yükle",
    heroEyebrow: "Flash sale baskısına mola ver",
    heroTitle: "Sepete değil, önce soğuma odasına.",
    heroCopy: "Alışveriş dürtülerini ürün kartlarına dönüştür, sayaç bitene kadar bekle ve gerçekten ihtiyacın olup olmadığını gör.",
    heroSummaryAria: "Kısa özet",
    savedSoFar: "Bugüne kadar kurtarılan",
    tabsAria: "CoolDown ekranları",
    tabAdd: "Yeni İstek",
    tabWaiting: "Soğuma Odası",
    tabWallet: "Kumbara",
    tabSettings: "Ayarlar",
    tabAuth: "Üyelik",
    authEyebrow: "Hesap",
    authTitle: "Üyelik işlemleri",
    signedInAs: "Giriş yapılan hesap",
    signOut: "Çıkış Yap",
    signInTitle: "Giriş yap",
    signUpTitle: "Üye ol",
    emailLabel: "E-posta",
    passwordLabel: "Şifre",
    signInButton: "Giriş Yap",
    signUpButton: "Üye Ol",
    authSuccessEyebrow: "Üyelik",
    signInSuccessTitle: "Giriş yapıldı",
    signUpSuccessTitle: "Üyelik oluşturuldu",
    authSuccessMessage: "{email} hesabı aktif.",
    signOutTitle: "Çıkış yapıldı",
    signOutMessage: "Hesabından güvenli şekilde çıkış yaptın.",
    authErrorTitle: "Üyelik işlemi tamamlanamadı",
    loginRequiredEyebrow: "Üyelik gerekli",
    loginRequiredTitle: "Login olmalısınız",
    loginRequiredMessage: "3 karttan sonra yeni kart eklemek için giriş yapmanız gerekiyor.",
    addEyebrow: "Sepete eklemeden önce",
    addTitle: "Yeni istek ekle",
    uploadImage: "Ürün görseli ekle",
    uploadHint: "Galeriden seç veya kamerayla çek",
    takePhoto: "Kamerayla Çek",
    chooseFromGallery: "Galeriden Seç",
    imageSourceTitle: "Görsel Kaynağı Seç",
    imageSourceMessage: "Nasıl devam etmek istersin?",
    imagePreviewAlt: "Seçilen ürün görseli ön izlemesi",
    productNameLabel: "Ürün adı",
    productNamePlaceholder: "Örn: Kablosuz kulaklık",
    priceLabel: "Fiyat",
    pricePlaceholder: "Örn: 1.500,50",
    cooldownEmpty: "Fiyat girildiğinde soğuma süreniz burada görünecek.",
    cooldownForAmount: "Bu tutar için soğuma süreniz {duration}.",
    addButton: "CoolDown'a Al",
    waitingEyebrow: "Ana vitrin",
    waitingTitle: "Soğuma odası",
    waitingCount: "{count} ürün bekliyor",
    waitingEmpty: "Bekleyen ürün yok. Yeni bir istek ekleyerek başlayabilirsin.",
    walletEyebrow: "Kumbara ve irade raporu",
    walletTitle: "Karar geçmişi",
    walletFiltersAria: "Kumbara filtreleri",
    filterAll: "Tümü",
    filterThisWeek: "Bu Hafta",
    filterLast7Days: "Son 1 Hafta",
    filterLast30Days: "Son 1 Ay",
    totalSaved: "Toplam kurtarılan para",
    earlySaved: "Erken pes ederek kurtarılan",
    totalBought: "Satın alınan toplam",
    successRate: "İrade başarı oranı",
    historyEmpty: "Henüz tamamlanan karar yok.",
    settingsEyebrow: "Profil ve ayarlar",
    settingsTitle: "Kurallarını belirle",
    earlyActionTitle: "Erken işlem izni",
    earlyActionCopy: 'Sayaç bitmeden "Satın Aldım" ve "Vazgeçtim" butonlarının kullanılmasına izin ver.',
    languageLabel: "Dil",
    languageHelp: "Uygulama arayüz dilini seç.",
    currencyCodeLabel: "Para birimi kodu",
    currencyHelp: "Örn: TL, USD, EUR. Tüm tutarların sonunda bu kod gösterilir.",
    hourlyWageLabel: "Saatlik kazanç",
    hourlyWagePlaceholder: "Örn: 250,00",
    hourlyWageHelp: "Ürün kartlarında bu ürünü almak için kaç saat çalışman gerektiği gösterilir.",
    rulesEyebrow: "Parametrik süreler",
    rulesTitle: "Fiyat kuralları",
    ruleMin: "Minimum",
    ruleMax: "Maksimum",
    ruleHours: "Süre (saat)",
    saveRules: "Kaydet",
    clearDataTitle: "Verileri temizle",
    clearDataCopy: "Tüm ürünleri, ayarları ve OPFS'deki görselleri siler.",
    clearDataButton: "Tüm Verileri Temizle",
    closeMessage: "Mesajı kapat",
    ok: "Tamam",
    cancel: "İptal",
    heroSuccess: "%{success} irade başarısı",
    hours: "{hours} saat",
    days: "{days} gün",
    remainingDays: "{days}g {hours}s {minutes}dk",
    remainingHours: "{hours}s {minutes}dk {seconds}sn",
    unnamedProduct: "İsimsiz ürün",
    invalidFormEyebrow: "Eksik bilgi",
    invalidFormTitle: "Ürünü CoolDown'a alamadık",
    invalidProductName: "ürün adı",
    invalidPrice: "geçerli bir fiyat",
    invalidFormMessage: "Devam etmek için {fields} girmen gerekiyor.",
    and: " ve ",
    imageAlt: "{name} görseli",
    imageMissing: "Görsel bulunamadı",
    expired: "Süre doldu",
    expiredReturnEyebrow: "Soğuma süresi tamamlandı",
    expiredReturnTitle: "{count} ürünün süresi doldu",
    expiredReturnMessage: "Sen uygulamada değilken şu kayıtların bekleme süresi tamamlandı: {names}. Soğuma Odası'ndan karar verebilirsin.",
    countdownBadge: "Flash Sale molası: {remaining}",
    waitingMeta: "{duration} bekleme süresi atandı. Bitiş: {date}\nOluşturuldu: {createdAt}",
    workTimeNeeded: "Bu ürün için yaklaşık {hours} saat çalışman gerekir.",
    boughtButton: "Satın Aldım",
    cancelButton: "Vazgeçtim",
    boughtConfirmEyebrow: "Satın alma onayı",
    boughtConfirmTitle: "Bu ürünü satın aldığını onaylıyor musun?",
    boughtConfirmMessage: '"{name}" kaydı satın alındı olarak işaretlenecek.',
    boughtConfirmAction: "Evet, Satın Aldım",
    cancelConfirmEyebrow: "Vazgeçme onayı",
    cancelConfirmTitle: "Bu üründen vazgeçtiğini onaylıyor musun?",
    cancelConfirmMessage: '"{name}" kaydı kumbara geçmişine eklenecek.',
    cancelConfirmAction: "Evet, Vazgeçtim",
    deleteButton: "Sil",
    deleteConfirmEyebrow: "Silme onayı",
    deleteConfirmTitle: "Bu kaydı silmek istiyor musun?",
    deleteConfirmMessage: '"{name}" kaydı ve varsa görseli kalıcı olarak silinecek.',
    deleteConfirmAction: "Evet, Sil",
    boughtBadge: "Satın alındı",
    boughtMeta: "Bu ürün için satın alma kararı verildi. Kumbara toplamına eklenmedi.\nOluşturuldu: {createdAt}\nKarar tarihi: {statusDate}",
    savedFullBadge: "Tam süre bekledi",
    savedFullMeta: "Sayaç tamamlandıktan sonra satın alınmadı.\nOluşturuldu: {createdAt}\nKarar tarihi: {statusDate}",
    savedEarlyBadge: "Erken vazgeçti",
    savedEarlyMeta: "Sayaç bitmeden satın almaktan vazgeçildi.\nOluşturuldu: {createdAt}\nKarar tarihi: {statusDate}",
    earlyBoughtEyebrow: "Erken satın alma",
    earlySavedEyebrow: "Erken vazgeçme",
    earlyBoughtTitle: "Soğuma süresi bitmeden satın aldın",
    earlySavedTitle: "Güzel karar, parayı cebinde tuttun",
    earlyBoughtMessage: "{name} için sayaç bitmeden alışverişi tamamladın. Bir sonraki istekte süreyi sonuna kadar beklemek kararını daha netleştirebilir.",
    earlySavedMessage: "{name} için {amount} harcamaktan sayaç bitmeden vazgeçtin. Bu tutar kumbara raporuna eklendi.",
    settingsSavedEyebrow: "Ayarlar kaydedildi",
    rulesSavedTitle: "Ayarlarınız kaydedilmiştir",
    rulesSavedMessage: "Değişiklikler başarıyla kaydedildi.",
    clearConfirm: "Tüm CoolDown verileri ve görseller silinsin mi?",
  },
  en: {
    documentTitle: "CoolDown",
    navAria: "Main navigation",
    brandAria: "CoolDown home",
    brandTagline: "Think before you buy",
    installApp: "Install App",
    heroEyebrow: "Pause the flash sale pressure",
    heroTitle: "Not in the cart yet. Into the cooldown room first.",
    heroCopy: "Turn shopping urges into product cards, wait until the timer ends, and see whether you really need them.",
    heroSummaryAria: "Quick summary",
    savedSoFar: "Saved so far",
    tabsAria: "CoolDown screens",
    tabAdd: "New Wish",
    tabWaiting: "Cooldown Room",
    tabWallet: "Piggy Bank",
    tabSettings: "Settings",
    tabAuth: "Account",
    authEyebrow: "Account",
    authTitle: "Membership",
    signedInAs: "Signed in as",
    signOut: "Sign Out",
    signInTitle: "Sign in",
    signUpTitle: "Sign up",
    emailLabel: "Email",
    passwordLabel: "Password",
    signInButton: "Sign In",
    signUpButton: "Sign Up",
    authSuccessEyebrow: "Account",
    signInSuccessTitle: "Signed in",
    signUpSuccessTitle: "Account created",
    authSuccessMessage: "{email} is active.",
    signOutTitle: "Signed out",
    signOutMessage: "You signed out successfully.",
    authErrorTitle: "Account action failed",
    loginRequiredEyebrow: "Account required",
    loginRequiredTitle: "Please sign in",
    loginRequiredMessage: "You need to sign in to add more cards after 3 cards.",
    addEyebrow: "Before adding to cart",
    addTitle: "Add a new wish",
    uploadImage: "Add product image",
    uploadHint: "Choose from gallery or take a photo",
    takePhoto: "Take Photo",
    chooseFromGallery: "Choose from Gallery",
    imageSourceTitle: "Choose Image Source",
    imageSourceMessage: "How would you like to continue?",
    imagePreviewAlt: "Selected product image preview",
    productNameLabel: "Product name",
    productNamePlaceholder: "E.g. Wireless headphones",
    priceLabel: "Price",
    pricePlaceholder: "E.g. 1.500,50",
    cooldownEmpty: "Enter a price to see your cooldown period here.",
    cooldownForAmount: "Your cooldown period for this amount is {duration}.",
    addButton: "Add to CoolDown",
    waitingEyebrow: "Main showcase",
    waitingTitle: "Cooldown room",
    waitingCount: "{count} item(s) waiting",
    waitingEmpty: "No waiting items yet. Add a new wish to get started.",
    walletEyebrow: "Piggy bank and willpower report",
    walletTitle: "Decision history",
    walletFiltersAria: "Piggy bank filters",
    filterAll: "All",
    filterThisWeek: "This Week",
    filterLast7Days: "Last 1 Week",
    filterLast30Days: "Last 1 Month",
    totalSaved: "Total money saved",
    earlySaved: "Saved by canceling early",
    totalBought: "Total purchased",
    successRate: "Willpower success rate",
    historyEmpty: "No completed decisions yet.",
    settingsEyebrow: "Profile and settings",
    settingsTitle: "Set your rules",
    earlyActionTitle: "Early action permission",
    earlyActionCopy: 'Allow "Bought It" and "Canceled" before the timer ends.',
    languageLabel: "Language",
    languageHelp: "Choose the app interface language.",
    currencyCodeLabel: "Currency code",
    currencyHelp: "E.g. TL, USD, EUR. This code is shown after every amount.",
    hourlyWageLabel: "Hourly income",
    hourlyWagePlaceholder: "E.g. 250,00",
    hourlyWageHelp: "Product cards will show how many hours you need to work to buy the item.",
    rulesEyebrow: "Parametric durations",
    rulesTitle: "Price rules",
    ruleMin: "Minimum",
    ruleMax: "Maximum",
    ruleHours: "Duration (hours)",
    saveRules: "Save",
    clearDataTitle: "Clear data",
    clearDataCopy: "Deletes all items, settings, and images in OPFS.",
    clearDataButton: "Clear All Data",
    closeMessage: "Close message",
    ok: "OK",
    cancel: "Cancel",
    heroSuccess: "%{success} willpower success",
    hours: "{hours} hour(s)",
    days: "{days} day(s)",
    remainingDays: "{days}d {hours}h {minutes}m",
    remainingHours: "{hours}h {minutes}m {seconds}s",
    unnamedProduct: "Unnamed product",
    invalidFormEyebrow: "Missing information",
    invalidFormTitle: "We could not add this to CoolDown",
    invalidProductName: "product name",
    invalidPrice: "a valid price",
    invalidFormMessage: "Please enter {fields} to continue.",
    and: " and ",
    imageAlt: "{name} image",
    imageMissing: "Image not found",
    expired: "Time is up",
    expiredReturnEyebrow: "Cooldown completed",
    expiredReturnTitle: "{count} item(s) expired",
    expiredReturnMessage: "These items completed their cooldown while you were away: {names}. You can decide from the Cooldown Room.",
    countdownBadge: "Flash Sale pause: {remaining}",
    waitingMeta: "{duration} cooldown period assigned. Ends: {date}\nCreated: {createdAt}",
    workTimeNeeded: "You need to work about {hours} hour(s) for this item.",
    boughtButton: "Bought It",
    cancelButton: "Canceled",
    boughtConfirmEyebrow: "Purchase confirmation",
    boughtConfirmTitle: "Confirm that you bought this item?",
    boughtConfirmMessage: '"{name}" will be marked as purchased.',
    boughtConfirmAction: "Yes, Bought It",
    cancelConfirmEyebrow: "Cancel confirmation",
    cancelConfirmTitle: "Confirm that you canceled this item?",
    cancelConfirmMessage: '"{name}" will be added to your piggy bank history.',
    cancelConfirmAction: "Yes, Canceled",
    deleteButton: "Delete",
    deleteConfirmEyebrow: "Delete confirmation",
    deleteConfirmTitle: "Do you want to delete this record?",
    deleteConfirmMessage: '"{name}" and its image, if any, will be permanently deleted.',
    deleteConfirmAction: "Yes, Delete",
    boughtBadge: "Purchased",
    boughtMeta: "A purchase decision was made for this item. It was not added to the piggy bank total.\nCreated: {createdAt}\nDecision date: {statusDate}",
    savedFullBadge: "Waited full time",
    savedFullMeta: "Not purchased after the timer ended.\nCreated: {createdAt}\nDecision date: {statusDate}",
    savedEarlyBadge: "Canceled early",
    savedEarlyMeta: "Canceled before the timer ended.\nCreated: {createdAt}\nDecision date: {statusDate}",
    earlyBoughtEyebrow: "Early purchase",
    earlySavedEyebrow: "Early cancel",
    earlyBoughtTitle: "You bought it before cooldown ended",
    earlySavedTitle: "Good call, you kept the money",
    earlyBoughtMessage: "You completed the purchase for {name} before the timer ended. Waiting until the end next time may make the decision clearer.",
    earlySavedMessage: "You canceled {name} before spending {amount}. This amount was added to your piggy bank report.",
    settingsSavedEyebrow: "Settings saved",
    rulesSavedTitle: "Your settings have been saved",
    rulesSavedMessage: "Changes were saved successfully.",
    clearConfirm: "Delete all CoolDown data and images?",
  },
};

const state = {
  items: [],
  settings: structuredClone(DEFAULT_SETTINGS),
  selectedImage: null,
  countdownTimer: null,
  deferredInstallPrompt: null,
  objectUrls: new Map(),
  walletFilter: "all",
  lastReturnCheckAt: 0,
  auth: null,
};

const elements = {
  tabs: document.querySelectorAll("[data-tab]"),
  screens: document.querySelectorAll(".screen"),
  form: document.querySelector("#itemForm"),
  dropzone: document.querySelector("#dropzone"),
  imageInput: document.querySelector("#imageInput"),
  cameraInput: document.querySelector("#cameraInput"),
  imageSourceModal: document.querySelector("#imageSourceModal"),
  cameraOptionButton: document.querySelector("#cameraOptionButton"),
  galleryOptionButton: document.querySelector("#galleryOptionButton"),
  imageSourceCancelButton: document.querySelector("#imageSourceCancelButton"),
  imagePreview: document.querySelector("#imagePreview"),
  productName: document.querySelector("#productName"),
  price: document.querySelector("#price"),
  cooldownHint: document.querySelector("#cooldownHint"),
  waitingGrid: document.querySelector("#waitingGrid"),
  waitingEmpty: document.querySelector("#waitingEmpty"),
  waitingCount: document.querySelector("#waitingCount"),
  walletFilters: document.querySelectorAll("[data-wallet-filter]"),
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
  languageSelect: document.querySelector("#languageSelect"),
  currencyCode: document.querySelector("#currencyCode"),
  hourlyWage: document.querySelector("#hourlyWage"),
  rulesTable: document.querySelector("#rulesTable"),
  settingsDrawer: document.querySelector("#settingsDrawer"),
  settingsCloseButton: document.querySelector("#settingsCloseButton"),
  authDrawer: document.querySelector("#authDrawer"),
  authCloseButton: document.querySelector("#authCloseButton"),
  saveRulesButton: document.querySelector("#saveRulesButton"),
  clearDataButton: document.querySelector("#clearDataButton"),
  signInForm: document.querySelector("#signInForm"),
  signUpForm: document.querySelector("#signUpForm"),
  signInEmail: document.querySelector("#signInEmail"),
  signInPassword: document.querySelector("#signInPassword"),
  signUpEmail: document.querySelector("#signUpEmail"),
  signUpPassword: document.querySelector("#signUpPassword"),
  authForms: document.querySelector("#authForms"),
  authStatus: document.querySelector("#authStatus"),
  authUserEmail: document.querySelector("#authUserEmail"),
  signOutButton: document.querySelector("#signOutButton"),
  installButton: document.querySelector("#installButton"),
  feedbackModal: document.querySelector("#feedbackModal"),
  feedbackIcon: document.querySelector("#feedbackIcon"),
  feedbackEyebrow: document.querySelector("#feedbackEyebrow"),
  feedbackTitle: document.querySelector("#feedbackTitle"),
  feedbackMessage: document.querySelector("#feedbackMessage"),
  modalCloseButton: document.querySelector("#modalCloseButton"),
  modalCancelButton: document.querySelector("#modalCancelButton"),
  modalOkButton: document.querySelector("#modalOkButton"),
  productCardTemplate: document.querySelector("#productCardTemplate"),
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  loadState();
  loadAuthState();
  bindEvents();
  renderAll();
  handleShareTargetLaunch();
  startCountdowns();
  notifyExpiredWhileAway();
  persistLastSeenAt();
  registerServiceWorker();
}

function loadState() {
  state.settings = normalizeSettings(readJson(STORAGE_KEYS.settings, DEFAULT_SETTINGS));
  state.items = readJson(STORAGE_KEYS.items, []).map(normalizeItem);
  saveSettings();
  saveItems();
}

function loadAuthState() {
  state.auth = readJson(STORAGE_KEYS.auth, null);
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
    hourlyWage: Math.max(0, Number(merged.hourlyWage) || 0),
    language: normalizeLanguage(merged.language),
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
    productName: item.productName || t("unnamedProduct"),
    price: Number(item.price) || 0,
    hasImage: Boolean(item.hasImage),
    dateAdded,
    assignedWaitHours,
    expireDate: item.expireDate || new Date(new Date(dateAdded).getTime() + assignedWaitHours * 60 * 60 * 1000).toISOString(),
    status: item.status || "waiting",
    statusChangedDate: item.statusChangedDate || (item.status && item.status !== "waiting" ? dateAdded : null),
  };
}

function saveSettings() {
  localStorage.setItem(
    STORAGE_KEYS.settings,
    JSON.stringify({
      allowEarlyCancel: state.settings.allowEarlyCancel,
      currencyCode: state.settings.currencyCode,
      hourlyWage: state.settings.hourlyWage,
      language: state.settings.language,
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
  elements.walletFilters.forEach((button) => {
    button.addEventListener("click", () => {
      state.walletFilter = button.dataset.walletFilter;
      renderWallet();
    });
  });
  document.querySelectorAll("[data-tab-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showTab(link.dataset.tabLink);
    });
  });

  elements.form.addEventListener("submit", handleSubmit);
  elements.price.addEventListener("input", updateCooldownHint);
  elements.dropzone.addEventListener("click", handleDropzoneClick);
  elements.imageInput.addEventListener("change", () => setSelectedImage(elements.imageInput.files[0]));
  elements.cameraInput.addEventListener("change", () => {
    setSelectedImage(elements.cameraInput.files[0]);
    elements.cameraInput.value = "";
  });
  elements.galleryOptionButton.addEventListener("click", () => {
    hideImageSourceModal();
    elements.imageInput.click();
  });
  elements.cameraOptionButton.addEventListener("click", () => {
    hideImageSourceModal();
    elements.cameraInput.click();
  });
  elements.imageSourceCancelButton.addEventListener("click", hideImageSourceModal);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("pagehide", persistLastSeenAt);
  window.addEventListener("pageshow", handleAppReturn);
  window.addEventListener("focus", handleAppReturn);

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

  elements.languageSelect.addEventListener("change", () => {
    state.settings.language = normalizeLanguage(elements.languageSelect.value);
    saveSettings();
    renderAll();
  });

  elements.currencyCode.addEventListener("change", () => {
    state.settings.currencyCode = normalizeCurrencyCode(elements.currencyCode.value);
    saveSettings();
    renderAll();
  });

  elements.hourlyWage.addEventListener("change", () => {
    state.settings.hourlyWage = Math.max(0, parseCurrencyInput(elements.hourlyWage.value));
    saveSettings();
    renderAll();
  });

  elements.saveRulesButton.addEventListener("click", handleRulesSave);
  elements.clearDataButton.addEventListener("click", handleClearData);
  elements.settingsCloseButton.addEventListener("click", closeSettingsDrawer);
  elements.settingsDrawer.addEventListener("click", (event) => {
    if (event.target === elements.settingsDrawer) {
      closeSettingsDrawer();
    }
  });
  elements.authCloseButton.addEventListener("click", closeAuthDrawer);
  elements.authDrawer.addEventListener("click", (event) => {
    if (event.target === elements.authDrawer) {
      closeAuthDrawer();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeOpenDrawers();
    }
  });
  elements.signInForm.addEventListener("submit", (event) => handleAuthSubmit(event, "signin"));
  elements.signUpForm.addEventListener("submit", (event) => handleAuthSubmit(event, "signup"));
  elements.signOutButton.addEventListener("click", handleSignOut);
  elements.modalCloseButton.addEventListener("click", hideFeedbackModal);
  elements.modalCancelButton.addEventListener("click", hideFeedbackModal);

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
  if (tabName === "settings") {
    openSettingsDrawer();
    return;
  }

  if (tabName === "auth") {
    openAuthDrawer();
    return;
  }

  closeOpenDrawers({ restoreTab: false });
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

function openSettingsDrawer() {
  closeAuthDrawer({ restoreTab: false });
  elements.tabs.forEach((button) => {
    const isActive = button.dataset.tab === "settings";
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  elements.settingsDrawer.classList.remove("is-closing");
  elements.settingsDrawer.hidden = false;
  document.body.classList.add("drawer-open");
  elements.settingsCloseButton.focus();
}

function openAuthDrawer() {
  closeSettingsDrawer({ restoreTab: false });
  elements.tabs.forEach((button) => {
    const isActive = button.dataset.tab === "auth";
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  elements.authDrawer.classList.remove("is-closing");
  elements.authDrawer.hidden = false;
  document.body.classList.add("drawer-open");
  elements.authCloseButton.focus();
}

function closeSettingsDrawer({ restoreTab = true } = {}) {
  closeDrawer(elements.settingsDrawer, { restoreTab });
}

function closeAuthDrawer({ restoreTab = true } = {}) {
  closeDrawer(elements.authDrawer, { restoreTab });
}

function closeDrawer(drawer, { restoreTab = true } = {}) {
  if (drawer.hidden || drawer.classList.contains("is-closing")) {
    return;
  }

  drawer.classList.add("is-closing");
  if (restoreTab) {
    restoreActiveTabFromVisibleScreen();
  }

  const panel = drawer.querySelector(".settings-drawer-panel");
  const finishClose = () => {
    if (!drawer.classList.contains("is-closing")) {
      return;
    }

    drawer.hidden = true;
    drawer.classList.remove("is-closing");
    if (elements.settingsDrawer.hidden && elements.authDrawer.hidden) {
      document.body.classList.remove("drawer-open");
    }
  };

  panel.addEventListener("animationend", finishClose, { once: true });
}

function closeOpenDrawers(options) {
  closeSettingsDrawer(options);
  closeAuthDrawer(options);
}

function restoreActiveTabFromVisibleScreen() {
  const activeScreen = [...elements.screens].find((screen) => !screen.hidden);
  const activeTab = activeScreen?.id.replace("screen-", "");

  elements.tabs.forEach((button) => {
    const isActive = button.dataset.tab === activeTab;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function handleShareTargetLaunch() {
  const params = new URLSearchParams(window.location.search);
  const sharedTitle = params.get("title")?.trim() || "";
  const sharedText = params.get("text")?.trim() || "";
  const sharedUrl = params.get("url")?.trim() || "";

  if (!sharedTitle && !sharedText && !sharedUrl) {
    return;
  }

  const sharedProductName = buildSharedProductName(sharedTitle, sharedText, sharedUrl);
  if (sharedProductName) {
    showTab("add");
    elements.productName.value = sharedProductName;
    elements.price.focus();
  }

  window.history.replaceState(window.history.state, document.title, `${window.location.pathname}${window.location.hash}`);
}

function buildSharedProductName(title, text, url) {
  return [title, text, url]
    .filter(Boolean)
    .filter((part, index, parts) => parts.indexOf(part) === index)
    .join(" - ");
}

async function handleSubmit(event) {
  event.preventDefault();

  if (requiresLoginForNewItem()) {
    showLoginRequiredModal();
    return;
  }

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
    statusChangedDate: null,
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

function requiresLoginForNewItem() {
  return state.items.length >= FREE_ITEM_LIMIT && !state.auth?.token;
}

function showLoginRequiredModal() {
  showTab("auth");
  showInfoModal({
    eyebrow: t("loginRequiredEyebrow"),
    title: t("loginRequiredTitle"),
    message: t("loginRequiredMessage"),
  });
}

function updateCooldownHint() {
  const price = parseCurrencyInput(elements.price.value);
  if (!price) {
    elements.cooldownHint.textContent = t("cooldownEmpty");
    return;
  }

  const hours = getWaitHours(price);
  elements.cooldownHint.textContent = t("cooldownForAmount", { duration: formatHours(hours) });
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

function normalizeLanguage(value) {
  return TRANSLATIONS[value] ? value : DEFAULT_SETTINGS.language;
}

function t(key, replacements = {}) {
  const dictionary = TRANSLATIONS[state.settings.language] || TRANSLATIONS[DEFAULT_SETTINGS.language];
  const template = dictionary[key] ?? TRANSLATIONS[DEFAULT_SETTINGS.language][key] ?? key;

  return Object.entries(replacements).reduce((text, [name, value]) => {
    return text.replaceAll(`{${name}}`, value);
  }, template);
}

function formatHours(hours) {
  return hours >= 24 && hours % 24 === 0 ? t("days", { days: formatNumber(hours / 24) }) : t("hours", { hours: formatNumber(hours) });
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

async function handleAuthSubmit(event, mode) {
  event.preventDefault();

  const isSignIn = mode === "signin";
  const emailInput = isSignIn ? elements.signInEmail : elements.signUpEmail;
  const passwordInput = isSignIn ? elements.signInPassword : elements.signUpPassword;
  if (!emailInput.reportValidity() || !passwordInput.reportValidity()) {
    return;
  }

  try {
    const auth = await requestAuth(mode, {
      email: emailInput.value.trim(),
      password: passwordInput.value,
    });
    state.auth = auth;
    saveAuthState();
    renderAuth();
    event.target.reset();
    showInfoModal({
      eyebrow: t("authSuccessEyebrow"),
      title: isSignIn ? t("signInSuccessTitle") : t("signUpSuccessTitle"),
      message: t("authSuccessMessage", { email: auth.email }),
      success: true,
    });
  } catch (error) {
    showInfoModal({
      eyebrow: t("authSuccessEyebrow"),
      title: t("authErrorTitle"),
      message: error.message,
    });
  }
}

async function requestAuth(mode, credentials) {
  let connectionError = null;

  for (const baseUrl of API_BASE_URLS) {
    let response;
    try {
      response = await fetch(`${baseUrl}/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      connectionError = error;
      continue;
    }

    const payload = await readResponseJson(response);
    if (!response.ok) {
      throw new Error(payload?.message || t("authErrorTitle"));
    }

    return payload;
  }

  throw connectionError || new Error(t("authErrorTitle"));
}

async function readResponseJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function saveAuthState() {
  localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(state.auth));
}

function renderAuth() {
  const isSignedIn = Boolean(state.auth?.token);
  elements.authStatus.hidden = !isSignedIn;
  elements.authForms.hidden = isSignedIn;
  elements.authUserEmail.textContent = isSignedIn ? state.auth.email : "";
}

function handleSignOut() {
  state.auth = null;
  localStorage.removeItem(STORAGE_KEYS.auth);
  renderAuth();
  showInfoModal({
    eyebrow: t("authSuccessEyebrow"),
    title: t("signOutTitle"),
    message: t("signOutMessage"),
    success: true,
  });
}

function handleDropzoneClick(event) {
  event.preventDefault();
  if (isIosDevice()) {
    elements.imageInput.click();
    return;
  }
  showImageSourceModal();
}

function isIosDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function showImageSourceModal() {
  elements.imageSourceModal.hidden = false;
}

function hideImageSourceModal() {
  elements.imageSourceModal.hidden = true;
}

function handleVisibilityChange() {
  if (document.visibilityState === "hidden") {
    persistLastSeenAt();
    return;
  }

  handleAppReturn();
}

function handleAppReturn() {
  const now = Date.now();
  if (now - state.lastReturnCheckAt < 750) {
    return;
  }

  state.lastReturnCheckAt = now;
  notifyExpiredWhileAway();
  persistLastSeenAt();
  renderWaitingRoom();
}

function notifyExpiredWhileAway() {
  const lastSeenMs = readLastSeenMs();
  if (!lastSeenMs) {
    return;
  }

  const now = Date.now();
  const expiredItems = state.items.filter((item) => {
    const expireMs = new Date(item.expireDate).getTime();
    return item.status === "waiting" && expireMs > lastSeenMs && expireMs <= now;
  });

  if (!expiredItems.length) {
    return;
  }

  const names = formatExpiredItemNames(expiredItems);
  showTab("waiting");
  showInfoModal({
    eyebrow: t("expiredReturnEyebrow"),
    title: t("expiredReturnTitle", { count: expiredItems.length }),
    message: t("expiredReturnMessage", { names }),
  });
}

function formatExpiredItemNames(items) {
  const visibleNames = items.slice(0, 3).map((item) => item.productName);
  const remainingCount = items.length - visibleNames.length;
  return remainingCount > 0 ? `${visibleNames.join(", ")} +${remainingCount}` : visibleNames.join(", ");
}

function readLastSeenMs() {
  const lastSeenAt = localStorage.getItem(STORAGE_KEYS.lastSeenAt);
  const timestamp = lastSeenAt ? new Date(lastSeenAt).getTime() : 0;
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function persistLastSeenAt() {
  localStorage.setItem(STORAGE_KEYS.lastSeenAt, new Date().toISOString());
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

async function deleteImageFromOpfs(id) {
  const directory = await getImageDirectory();
  if (!directory) return;

  try {
    await directory.removeEntry(id);
  } catch {
    // The item may not have an image or the file may have already been removed.
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
  applyTranslations();
  renderSettings();
  renderAuth();
  updateCooldownHint();
  renderWaitingRoom();
  renderWallet();
}

function applyTranslations() {
  document.documentElement.lang = state.settings.language;
  document.title = t("documentTitle");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.setAttribute("alt", t(element.dataset.i18nAlt));
  });
}

function renderSettings() {
  elements.allowEarlyCancel.checked = state.settings.allowEarlyCancel;
  elements.languageSelect.value = state.settings.language;
  elements.currencyCode.value = state.settings.currencyCode;
  elements.hourlyWage.value = state.settings.hourlyWage > 0 ? formatNumber(state.settings.hourlyWage) : "";
  elements.rulesTable.innerHTML = "";

  state.settings.timeRules.forEach((rule, index) => {
    const row = document.createElement("div");
    row.className = "rule-row";
    row.innerHTML = `
      <label>
        ${t("ruleMin")}
        <input type="text" inputmode="decimal" value="${formatNumber(rule.min)}" data-rule="${index}" data-field="min" />
      </label>
      <label>
        ${t("ruleMax")}
        <input type="text" inputmode="decimal" value="${rule.max === Infinity ? "∞" : formatNumber(rule.max)}" data-rule="${index}" data-field="max" />
      </label>
      <label>
        ${t("ruleHours")}
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
  elements.waitingCount.textContent = t("waitingCount", { count: waitingItems.length });

  for (const item of waitingItems) {
    const card = await createProductCard(item, "waiting");
    elements.waitingGrid.append(card);
  }
}

async function renderWallet() {
  elements.walletFilters.forEach((button) => {
    button.classList.toggle("active", button.dataset.walletFilter === state.walletFilter);
  });

  const completedItems = state.items.filter((item) => item.status !== "waiting" && isInWalletFilter(item));
  const savedItems = completedItems.filter((item) => item.status === "saved_full" || item.status === "saved_early");
  const boughtItems = completedItems.filter((item) => item.status === "bought");
  const decisionItems = [...savedItems, ...boughtItems].sort((first, second) => new Date(second.statusChangedDate || second.dateAdded) - new Date(first.statusChangedDate || first.dateAdded));
  elements.savedGrid.innerHTML = "";
  elements.savedEmpty.hidden = decisionItems.length > 0;

  for (const item of decisionItems) {
    const card = await createProductCard(item, "history");
    elements.savedGrid.append(card);
  }

  const totalSaved = savedItems.reduce((sum, item) => sum + item.price, 0);
  const earlySaved = savedItems.filter((item) => item.status === "saved_early").reduce((sum, item) => sum + item.price, 0);
  const totalBought = boughtItems.reduce((sum, item) => sum + item.price, 0);
  const completedDecisions = completedItems.length;
  const success = completedDecisions ? Math.round((savedItems.length / completedDecisions) * 100) : 0;

  elements.totalSaved.textContent = formatCurrency(totalSaved);
  elements.earlySaved.textContent = formatCurrency(earlySaved);
  elements.totalBought.textContent = formatCurrency(totalBought);
  elements.successRate.textContent = `%${success}`;
  elements.successBar.style.width = `${success}%`;
  elements.heroSavedTotal.textContent = formatCurrency(totalSaved);
  elements.heroSuccessRate.textContent = t("heroSuccess", { success });
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
      image.alt = t("imageAlt", { name: item.productName });
    } else {
      renderImagePlaceholder(imageWrap, image, t("imageMissing"));
    }
  } else {
    renderImagePlaceholder(imageWrap, image, item.productName);
  }

  if (mode === "waiting") {
    const remaining = getRemainingMs(item);
    const isExpired = remaining <= 0;
    badge.textContent = isExpired ? t("expired") : t("countdownBadge", { remaining: formatRemaining(remaining) });
    badge.classList.toggle("done", isExpired);
    meta.textContent = withWorkTime(item, t("waitingMeta", { duration: formatHours(item.assignedWaitHours), date: formatDate(item.expireDate), createdAt: formatDate(item.dateAdded) }));

    actions.append(
      createActionButton(t("boughtButton"), "secondary-button", () => confirmDecision(item.id, "bought"), !isExpired && !state.settings.allowEarlyCancel),
      createActionButton(t("cancelButton"), "primary-button", () => confirmDecision(item.id, isExpired ? "saved_full" : "saved_early"), !isExpired && !state.settings.allowEarlyCancel),
      createActionButton(t("deleteButton"), "danger-button", () => confirmDeleteItem(item.id)),
    );
  } else {
    const historyCopy = getHistoryCopy(item);
    badge.textContent = historyCopy.badge;
    badge.classList.add("done");
    meta.textContent = withWorkTime(item, historyCopy.meta);
    actions.append(createActionButton(t("deleteButton"), "danger-button", () => confirmDeleteItem(item.id)));
  }

  return card;
}

function getHistoryCopy(item) {
  const dates = {
    createdAt: formatDate(item.dateAdded),
    statusDate: formatDate(item.statusChangedDate || item.dateAdded),
  };

  if (item.status === "bought") {
    return {
      badge: t("boughtBadge"),
      meta: t("boughtMeta", dates),
    };
  }

  if (item.status === "saved_full") {
    return {
      badge: t("savedFullBadge"),
      meta: t("savedFullMeta", dates),
    };
  }

  return {
    badge: t("savedEarlyBadge"),
    meta: t("savedEarlyMeta", dates),
  };
}

function withWorkTime(item, text) {
  if (state.settings.hourlyWage <= 0) {
    return text;
  }

  const hoursNeeded = item.price / state.settings.hourlyWage;
  if (!Number.isFinite(hoursNeeded) || hoursNeeded <= 0) {
    return text;
  }

  return `${text}\n${t("workTimeNeeded", { hours: formatNumber(hoursNeeded) })}`;
}

function isInWalletFilter(item) {
  if (state.walletFilter === "all") return true;

  const decisionDate = new Date(item.statusChangedDate || item.dateAdded);
  const now = new Date();

  if (state.walletFilter === "this_week") {
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay() || 7;
    startOfWeek.setDate(startOfWeek.getDate() - day + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    return decisionDate >= startOfWeek;
  }

  if (state.walletFilter === "last_7_days") {
    const lastSevenDays = new Date(now);
    lastSevenDays.setDate(lastSevenDays.getDate() - 7);
    return decisionDate >= lastSevenDays;
  }

  if (state.walletFilter === "last_30_days") {
    const lastThirtyDays = new Date(now);
    lastThirtyDays.setDate(lastThirtyDays.getDate() - 30);
    return decisionDate >= lastThirtyDays;
  }

  return true;
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

function confirmDecision(id, status) {
  const item = state.items.find((candidate) => candidate.id === id);
  if (!item) return;

  const isBought = status === "bought";
  showConfirmModal({
    eyebrow: isBought ? t("boughtConfirmEyebrow") : t("cancelConfirmEyebrow"),
    title: isBought ? t("boughtConfirmTitle") : t("cancelConfirmTitle"),
    message: isBought ? t("boughtConfirmMessage", { name: item.productName }) : t("cancelConfirmMessage", { name: item.productName }),
    confirmText: isBought ? t("boughtConfirmAction") : t("cancelConfirmAction"),
    onConfirm: () => handleDecision(id, status),
  });
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
  item.statusChangedDate = new Date().toISOString();
  saveItems();
  renderAll();
}

function confirmDeleteItem(id) {
  const item = state.items.find((candidate) => candidate.id === id);
  if (!item) return;

  showConfirmModal({
    eyebrow: t("deleteConfirmEyebrow"),
    title: t("deleteConfirmTitle"),
    message: t("deleteConfirmMessage", { name: item.productName }),
    confirmText: t("deleteConfirmAction"),
    onConfirm: () => deleteItem(id),
  });
}

async function deleteItem(id) {
  const item = state.items.find((candidate) => candidate.id === id);
  if (!item) return;

  state.items = state.items.filter((candidate) => candidate.id !== id);
  saveItems();

  if (item.hasImage) {
    await deleteImageFromOpfs(id);
  }

  if (state.objectUrls.has(id)) {
    URL.revokeObjectURL(state.objectUrls.get(id));
    state.objectUrls.delete(id);
  }

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
    return t("remainingDays", { days, hours, minutes });
  }
  return t("remainingHours", { hours, minutes, seconds });
}

function showEarlyDecisionModal(item, status) {
  prepareInfoModal();
  const boughtEarly = status === "bought";
  elements.feedbackIcon.textContent = boughtEarly ? "!" : "TL";
  elements.feedbackIcon.classList.toggle("success", !boughtEarly);
  elements.feedbackEyebrow.textContent = boughtEarly ? t("earlyBoughtEyebrow") : t("earlySavedEyebrow");
  elements.feedbackTitle.textContent = boughtEarly ? t("earlyBoughtTitle") : t("earlySavedTitle");
  elements.feedbackMessage.textContent = boughtEarly
    ? t("earlyBoughtMessage", { name: item.productName })
    : t("earlySavedMessage", { name: item.productName, amount: formatCurrency(item.price) });
  elements.feedbackModal.hidden = false;
  elements.modalOkButton.focus();
}

function showValidationModal(productName, price) {
  prepareInfoModal();
  const missingFields = [];
  if (!productName) missingFields.push(t("invalidProductName"));
  if (price <= 0) missingFields.push(t("invalidPrice"));

  elements.feedbackIcon.textContent = "!";
  elements.feedbackIcon.classList.remove("success");
  elements.feedbackEyebrow.textContent = t("invalidFormEyebrow");
  elements.feedbackTitle.textContent = t("invalidFormTitle");
  elements.feedbackMessage.textContent = t("invalidFormMessage", { fields: missingFields.join(t("and")) });
  elements.feedbackModal.hidden = false;
  elements.modalOkButton.focus();
}

function showInfoModal({ eyebrow, title, message, success = false }) {
  prepareInfoModal();
  elements.feedbackIcon.textContent = success ? "OK" : "!";
  elements.feedbackIcon.classList.toggle("success", success);
  elements.feedbackEyebrow.textContent = eyebrow;
  elements.feedbackTitle.textContent = title;
  elements.feedbackMessage.textContent = message;
  elements.feedbackModal.hidden = false;
  elements.modalOkButton.focus();
}

function showConfirmModal({ eyebrow, title, message, confirmText, onConfirm }) {
  elements.modalCancelButton.hidden = false;
  elements.modalCancelButton.textContent = t("cancel");
  elements.modalOkButton.textContent = confirmText;
  elements.modalOkButton.onclick = async () => {
    hideFeedbackModal();
    await onConfirm();
  };
  elements.feedbackIcon.textContent = "!";
  elements.feedbackIcon.classList.remove("success");
  elements.feedbackEyebrow.textContent = eyebrow;
  elements.feedbackTitle.textContent = title;
  elements.feedbackMessage.textContent = message;
  elements.feedbackModal.hidden = false;
  elements.modalOkButton.focus();
}

function prepareInfoModal() {
  elements.modalCancelButton.hidden = true;
  elements.modalOkButton.textContent = t("ok");
  elements.modalOkButton.onclick = hideFeedbackModal;
}

function hideFeedbackModal() {
  prepareInfoModal();
  elements.feedbackModal.hidden = true;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat(state.settings.language === "en" ? "en-US" : "tr-TR", {
    dateStyle: "medium",
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
    eyebrow: t("settingsSavedEyebrow"),
    title: t("rulesSavedTitle"),
    message: t("rulesSavedMessage"),
    success: true,
  });
}

async function handleClearData() {
  const confirmed = window.confirm(t("clearConfirm"));
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
