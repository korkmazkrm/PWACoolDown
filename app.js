const STORAGE_KEYS = {
  items: "cooldown.items",
  settings: "cooldown.settings",
  goal: "cooldown.goal",
  lastSeenAt: "cooldown.lastSeenAt",
  auth: "cooldown.auth",
  streak: "cooldown.streak",
  reflectionTable: "cooldown.reflectionTable",
};

const DEFAULT_GOAL = {
  goalName: "",
  targetAmount: 0,
  currentAmount: 0,
  /** İlk kez hedef tutarı > 0 yapıldığında (veya geçiş migrate) — bu andan sonraki vazgeçtimler kumbaraya girer. ISO string */
  goalTrackingSince: null,
};

const LOCAL_API_BASE_URLS = ["https://localhost:7269/api", "http://localhost:5261/api"];
const API_BASE_URLS =
  localStorage.getItem("cooldown.apiBaseUrl")?.split(",").map((url) => url.trim()).filter(Boolean) ||
  (["localhost", "127.0.0.1"].includes(window.location.hostname) ? LOCAL_API_BASE_URLS : [`${window.location.origin}/api`]);

const FREE_ITEM_LIMIT = 10;
const DAY_MS = 24 * 60 * 60 * 1000;

const DEFAULT_SETTINGS = {
  allowEarlyCancel: true,
  enableReflectionForm: false,
  currencyCode: "TL",
  hourlyWage: 0,
  language: "tr",
  monthlyBudgetLimit: 0,
  budgetResetDay: 1,
  regretSurveyDays: 14,
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
    iosInstallEyebrow: "iOS kurulumu",
    iosInstallTitle: "Ana ekrana ekle",
    iosInstallMessage: "iPhone veya iPad'de kurmak için Safari'de Paylaş butonuna dokun, ardından Ana Ekrana Ekle seçeneğini kullan.",
    heroEyebrow: "Flash sale baskısına mola ver",
    heroTitle: "Sepete değil, önce bekleme odasına.",
    heroCopy: "Alışveriş dürtülerini ürün kartlarına dönüştür, sayaç bitene kadar bekle ve gerçekten ihtiyacın olup olmadığını gör.",
    heroSummaryAria: "Kısa özet",
    savedSoFar: "Bugüne kadar kurtarılan",
    streakLabel: "🔥 {days} Günlük Seri",
    longestStreakLabel: "Rekor: {days} gün",
    tabsAria: "CoolDown ekranları",
    tabAdd: "Yeni İstek",
    tabWaiting: "Bekleme Odası",
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
    streakResetEyebrow: "Harcamasız seri",
    streakResetTitle: "İraden kırıldı, seri sıfırlandı!",
    streakResetMessage: "Bu satın alma seriyi bozdu. Yeni seri yarın yeniden başlayabilir.",
    streakCelebrationEyebrow: "Harcamasız seri",
    streakCelebrationTitle: "🔥 {days} Günlük Seri",
    streakCelebrationMessage: "Dün hiç satın alma yapmadın. Serini korudun, bugün de aynı çizgide kalabilirsin.",
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
    cooldownEmpty: "Fiyat girildiğinde bekleme süreniz burada görünecek.",
    cooldownForAmount: "Bu tutar için bekleme süreniz {duration}.",
    addButton: "CoolDown'a Al",
    waitingEyebrow: "Ana vitrin",
    waitingTitle: "Bekleme odası",
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
    totalBought: "Satın alınan toplam",
    successRate: "İrade başarı oranı",
    regretRate: "Dürtüsel pişmanlık oranı",
    regretNoData: "Henüz veri yok",
    budgetHealthTitle: "Limit Barı",
    budgetHealthSetup: "Limit Barı için Settings bölümünden aylık bütçe limiti belirle.",
    budgetHealthSafe: "Güvendesin",
    budgetHealthCaution: "Dikkatli ol",
    budgetHealthCritical: "Kritik seviye",
    budgetHealthOver: "Bütçe Aşıldı!",
    budgetHealthCopy: "Kalan Limit: {remaining} / {limit}",
    budgetHealthGhostCopy: "Bekleyen ürünleri alırsan limitin {projected} seviyesine düşecek.",
    budgetOverdraftEyebrow: "Limit Barı uyarısı",
    budgetOverdraftTitle: "Bu harcama limitini eksiye düşürecek!",
    budgetOverdraftMessage: "{amount} tutarındaki bu istek kalan limitinden yüksek. Devam edersen Limit Barı negatif bölgeye inecek.",
    budgetOverdraftAction: "Evet, beklemeye al",
    historyEmpty: "Henüz tamamlanan karar yok.",
    settingsEyebrow: "Profil ve ayarlar",
    settingsTitle: "Kurallarını belirle",
    earlyActionTitle: "Süre dolmadan karar izni",
    earlyActionCopy: 'Sayaç bitmeden "Satın Aldım" ve "Vazgeçtim" butonlarının kullanılmasına izin ver.',
    reflectionSettingsTitle: "Ön-Yüzleşme formu",
    reflectionSettingsHelp: "Açıkken yeni istekte kısa sorular gösterilir; dürtüsel cevaplarda bekleme süresi kurala göre uzar.",
    reflectionModalEyebrow: "Ön yüzleşme",
    reflectionModalTitle: "Önce kendine sor",
    reflectionQ1: "Bu harcama sence bir ihtiyaç mı, yoksa sadece anlık bir istek mi?",
    reflectionQ1Need: "İhtiyaç",
    reflectionQ1Desire: "İstek",
    reflectionQ2: "Buna benzer işlev gören bir eşyan şu an var mı?",
    reflectionQ2Yes: "Evet",
    reflectionQ2No: "Hayır",
    reflectionQ3: "Sence bunu 1 ay sonra hala aktif olarak kullanıyor olacak mısın?",
    reflectionQ3Certain: "Kesinlikle",
    reflectionQ3Unsure: "Emin değilim",
    reflectionSubmit: "Cevapla ve Beklemeyi Başlat",
    reflectionDismiss: "Vazgeç",
    reflectionIncomplete: "Lütfen tüm soruları yanıtla.",
    reflectionPenaltyToast: "Cevaplarına göre bu harcama oldukça dürtüsel. Caydırıcılık için bekleme süren %{percent} oranında uzatıldı!",
    reflectionNoPenaltyToast: "Cevaplarına göre ek süre cezası uygulanmadı; standart bekleme süresi geçerli.",
    languageLabel: "Dil",
    languageHelp: "Uygulama arayüz dilini seç.",
    currencyCodeLabel: "Para birimi kodu",
    currencyHelp: "Örn: TL, USD, EUR. Tüm tutarların sonunda bu kod gösterilir.",
    hourlyWageLabel: "Saatlik kazanç",
    hourlyWagePlaceholder: "Örn: 250,00",
    hourlyWageHelp: "Ürün kartlarında bu ürünü almak için kaç saat çalışman gerektiği gösterilir.",
    regretSurveyDaysLabel: "Pişmanlık anketi süresi",
    regretSurveyDaysPlaceholder: "Örn: 14",
    regretSurveyDaysHelp: "Satın aldıktan kaç gün sonra yüzleşme anketinin gösterileceğini belirler.",
    monthlyBudgetLimitLabel: "Aylık keyfi harcama limiti",
    monthlyBudgetLimitPlaceholder: "Örn: 15.000,00",
    monthlyBudgetLimitHelp: "Limit Barı için bu döngüdeki maksimum bütçeni belirler.",
    budgetResetDayLabel: "Bütçe yenileme günü",
    budgetResetDayPlaceholder: "1",
    budgetResetDayHelp: "Maaş günü mantığıyla bütçenin ayın hangi günü %100'e döneceğini belirler.",
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
    imageLightboxLabel: "Ürün görseli — büyük önizleme",
    imageMissing: "Görsel bulunamadı",
    expired: "Süre doldu",
    expiredReturnEyebrow: "Bekleme süresi tamamlandı",
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
    extendDurationButton: "Süreyi Uzat",
    extendDurationEyebrow: "Kayıt süresi dolmuş",
    extendDurationTitle: "Ne kadar uzatmak istiyorsun?",
    extendDurationUnitHour: "saat",
    extendDurationUnitDay: "gün",
    extendDurationConfirm: "Uzat",
    extendDurationDecrease: "Azalt",
    extendDurationIncrease: "Arttır",
    boughtBadge: "Satın alındı",
    boughtMeta: "Bu ürün için satın alma kararı verildi. Kumbara toplamına eklenmedi.\nOluşturuldu: {createdAt}\nKarar tarihi: {statusDate}",
    regretVoteHappy: "Pişmanlık oyu: İyi ki almışım",
    regretVoteRegretted: "Pişmanlık oyu: Pişmanım",
    regretVotePending: "Pişmanlık oyu: Bekliyor",
    savedFullBadge: "Tam süre bekledi",
    savedFullMeta: "Sayaç tamamlandıktan sonra satın alınmadı.\nOluşturuldu: {createdAt}\nKarar tarihi: {statusDate}",
    savedEarlyBadge: "Vazgeçildi",
    savedEarlyMeta: "Sayaç bitmeden satın almaktan vazgeçildi.\nOluşturuldu: {createdAt}\nKarar tarihi: {statusDate}",
    earlyBoughtEyebrow: "Bekleme bitmeden satın alım",
    earlySavedEyebrow: "Satın alınmadı",
    earlyBoughtTitle: "Bekleme süresi bitmeden satın aldın",
    earlySavedTitle: "Güzel karar, parayı cebinde tuttun",
    earlyBoughtMessage: "{name} için sayaç bitmeden alışverişi tamamladın. Bir sonraki istekte süreyi sonuna kadar beklemek kararını daha netleştirebilir.",
    earlySavedMessage: "{name} için {amount} harcamaktan sayaç bitmeden vazgeçtin. Bu tutar kumbara raporuna eklendi.",
    regretSurveyEyebrow: "Satın alma yüzleşmesi",
    regretSurveyTitle: "Pişmanlık kontrolü",
    regretSurveyQuestion: "Bu ürünü alalı {days} gün oldu. Gerçekten verdiğin paraya değdi mi?",
    regretHappyAction: "İyi ki almışım",
    regretRegrettedAction: "Pişmanım",
    settingsSavedEyebrow: "Ayarlar kaydedildi",
    rulesSavedTitle: "Ayarlarınız kaydedilmiştir",
    rulesSavedMessage: "Değişiklikler başarıyla kaydedildi.",
    clearConfirm: "Tüm CoolDown verileri ve görseller silinsin mi?",
    goalSettingsEyebrow: "Hedef kumbarası",
    goalSettingsTitle: "İptal tutarlarını yönlendir",
    goalSettingsHelp:
      "Hedef tutarını kaydettiğin andan itibaren seçtiğin “Vazgeçtim” kalemleri burada birikir; önceki tarihli kayıtlar bu hedefe dahil edilmez.",
    goalNameLabel: "Hedef adı",
    goalNamePlaceholder: "Örn: Bali tatili",
    goalTargetLabel: "Hedef tutar",
    goalTargetPlaceholder: "Örn: 80.000,00",
    goalCurrentSavedLabel: "Hedef kumbarasında biriken",
    goalDefaultName: "Hedef",
    goalPercentDone: "Tamamlandı",
    goalAccumulatedLabel: "Biriken",
    goalCardEyebrow: "Hedef kumbarası",
    goalProgressToast: "Harika! {goalName} hedefinin %{percent} kadarı daha tamamlandı!",
  },
  en: {
    documentTitle: "CoolDown",
    navAria: "Main navigation",
    brandAria: "CoolDown home",
    brandTagline: "Think before you buy",
    installApp: "Install App",
    iosInstallEyebrow: "iOS install",
    iosInstallTitle: "Add to Home Screen",
    iosInstallMessage: "To install on iPhone or iPad, tap the Share button in Safari, then choose Add to Home Screen.",
    heroEyebrow: "Pause the flash sale pressure",
    heroTitle: "Not in the cart yet. Into the cooldown room first.",
    heroCopy: "Turn shopping urges into product cards, wait until the timer ends, and see whether you really need them.",
    heroSummaryAria: "Quick summary",
    savedSoFar: "Saved so far",
    streakLabel: "🔥 {days} Day Streak",
    longestStreakLabel: "Record: {days} day(s)",
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
    streakResetEyebrow: "No-spend streak",
    streakResetTitle: "Your willpower slipped, the streak reset!",
    streakResetMessage: "This purchase broke the streak. A new streak can start again tomorrow.",
    streakCelebrationEyebrow: "No-spend streak",
    streakCelebrationTitle: "🔥 {days} Day Streak",
    streakCelebrationMessage: "You made no purchases yesterday. You protected your streak, and you can keep it going today.",
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
    totalBought: "Total purchased",
    successRate: "Willpower success rate",
    regretRate: "Impulsive regret rate",
    regretNoData: "No data yet",
    budgetHealthTitle: "Health Bar",
    budgetHealthSetup: "Set a monthly budget limit in Settings to activate the Health Bar.",
    budgetHealthSafe: "You're safe",
    budgetHealthCaution: "Be careful",
    budgetHealthCritical: "Critical level",
    budgetHealthOver: "Budget Exceeded!",
    budgetHealthCopy: "Remaining Health: {remaining} / {limit}",
    budgetHealthGhostCopy: "If you buy waiting items, your health will drop to {projected}.",
    budgetOverdraftEyebrow: "Health Bar warning",
    budgetOverdraftTitle: "This spending will push your health below zero!",
    budgetOverdraftMessage: "This {amount} wish is higher than your remaining health. If you continue, the Health Bar will enter negative territory.",
    budgetOverdraftAction: "Yes, add to waiting",
    historyEmpty: "No completed decisions yet.",
    settingsEyebrow: "Profile and settings",
    settingsTitle: "Set your rules",
    earlyActionTitle: "Decide before the timer ends",
    earlyActionCopy: 'Allow "Bought It" and "Canceled" before the timer ends.',
    reflectionSettingsTitle: "Pre-reflection form",
    reflectionSettingsHelp: "When on, a short questionnaire appears before the wait starts; impulsive answers extend the cooldown within the rules.",
    reflectionModalEyebrow: "Pre-reflection",
    reflectionModalTitle: "Ask yourself first",
    reflectionQ1: "Is this spending a need, or just a passing want?",
    reflectionQ1Need: "Need",
    reflectionQ1Desire: "Want",
    reflectionQ2: "Do you already own something that does the job?",
    reflectionQ2Yes: "Yes",
    reflectionQ2No: "No",
    reflectionQ3: "Do you still see yourself actively using this in one month?",
    reflectionQ3Certain: "Definitely",
    reflectionQ3Unsure: "Not sure",
    reflectionSubmit: "Answer and start the wait",
    reflectionDismiss: "Cancel",
    reflectionIncomplete: "Please answer every question.",
    reflectionPenaltyToast:
      "Your answers suggest this choice is quite impulsive. Cooldown extended by {percent}% to add friction.",
    reflectionNoPenaltyToast: "No penalty from your answers—the wait time stays at the standard length.",
    languageLabel: "Language",
    languageHelp: "Choose the app interface language.",
    currencyCodeLabel: "Currency code",
    currencyHelp: "E.g. TL, USD, EUR. This code is shown after every amount.",
    hourlyWageLabel: "Hourly income",
    hourlyWagePlaceholder: "E.g. 250,00",
    hourlyWageHelp: "Product cards will show how many hours you need to work to buy the item.",
    regretSurveyDaysLabel: "Regret survey delay",
    regretSurveyDaysPlaceholder: "E.g. 14",
    regretSurveyDaysHelp: "Sets how many days after a purchase the reflection survey appears.",
    monthlyBudgetLimitLabel: "Monthly impulse budget limit",
    monthlyBudgetLimitPlaceholder: "E.g. 15.000,00",
    monthlyBudgetLimitHelp: "Sets your maximum budget for the current Health Bar cycle.",
    budgetResetDayLabel: "Budget reset day",
    budgetResetDayPlaceholder: "1",
    budgetResetDayHelp: "Sets which day of the month your budget returns to 100%, like payday.",
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
    imageLightboxLabel: "Product image — enlarged preview",
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
    extendDurationButton: "Extend time",
    extendDurationEyebrow: "Cooldown expired",
    extendDurationTitle: "How much longer?",
    extendDurationUnitHour: "hours",
    extendDurationUnitDay: "days",
    extendDurationConfirm: "Extend",
    extendDurationDecrease: "Decrease",
    extendDurationIncrease: "Increase",
    boughtBadge: "Purchased",
    boughtMeta: "A purchase decision was made for this item. It was not added to the piggy bank total.\nCreated: {createdAt}\nDecision date: {statusDate}",
    regretVoteHappy: "Regret vote: Glad I bought it",
    regretVoteRegretted: "Regret vote: I regret it",
    regretVotePending: "Regret vote: Pending",
    savedFullBadge: "Waited full time",
    savedFullMeta: "Not purchased after the timer ended.\nCreated: {createdAt}\nDecision date: {statusDate}",
    savedEarlyBadge: "Canceled",
    savedEarlyMeta: "Canceled before the timer ended.\nCreated: {createdAt}\nDecision date: {statusDate}",
    earlyBoughtEyebrow: "Purchase before timer ends",
    earlySavedEyebrow: "No purchase",
    earlyBoughtTitle: "You bought it before cooldown ended",
    earlySavedTitle: "Good call, you kept the money",
    earlyBoughtMessage: "You completed the purchase for {name} before the timer ended. Waiting until the end next time may make the decision clearer.",
    earlySavedMessage: "You canceled {name} before spending {amount}. This amount was added to your piggy bank report.",
    regretSurveyEyebrow: "Purchase reflection",
    regretSurveyTitle: "Regret check",
    regretSurveyQuestion: "It has been {days} day(s) since you bought this item. Was it really worth the money?",
    regretHappyAction: "Glad I bought it",
    regretRegrettedAction: "I regret it",
    settingsSavedEyebrow: "Settings saved",
    rulesSavedTitle: "Your settings have been saved",
    rulesSavedMessage: "Changes were saved successfully.",
    clearConfirm: "Delete all CoolDown data and images?",
    goalSettingsEyebrow: "Goal piggy bank",
    goalSettingsTitle: "Route cancelled spending",
    goalSettingsHelp:
      "Only “canceled” choices you make after saving a target count toward this goal; earlier decisions are not included.",
    goalNameLabel: "Goal name",
    goalNamePlaceholder: "E.g. Bali trip",
    goalTargetLabel: "Target amount",
    goalTargetPlaceholder: "E.g. 80,000.00",
    goalCurrentSavedLabel: "Saved toward this goal",
    goalDefaultName: "Goal",
    goalPercentDone: "complete",
    goalAccumulatedLabel: "Saved",
    goalCardEyebrow: "Savings goal",
    goalProgressToast: "Nice! That added another {percent}% toward your goal ({goalName}).",
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
  regretSurveyQueue: [],
  activeRegretSurveyItemId: null,
  pendingStreakCelebrationDays: null,
  extendModal: {
    itemId: null,
    amount: 1,
    unit: "hour",
  },
  streak: {
    lastPurchaseDate: null,
    currentStreak: 0,
    longestStreak: 0,
    lastStreakCheckDate: null,
  },
  goal: structuredClone(DEFAULT_GOAL),
  pendingWish: null,
  /** @type {Array<{ id: string, itemId: string, recordedAt: string, productName: string, price: number, q1: string, q2: string, q3: string, penaltyMultiplier: number }>} */
  reflectionTable: [],
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
  imageSourceCloseButton: document.querySelector("#imageSourceCloseButton"),
  imageLightbox: document.querySelector("#imageLightbox"),
  imageLightboxImg: document.querySelector("#imageLightboxImg"),
  imageLightboxClose: document.querySelector("#imageLightboxClose"),
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
  totalBought: document.querySelector("#totalBought"),
  successRate: document.querySelector("#successRate"),
  successBar: document.querySelector("#successBar"),
  regretRate: document.querySelector("#regretRate"),
  budgetHealthCards: document.querySelectorAll("[data-budget-health]"),
  heroSavedTotal: document.querySelector("#heroSavedTotal"),
  heroSuccessRate: document.querySelector("#heroSuccessRate"),
  heroStreakPill: document.querySelector("#heroStreakPill"),
  heroStreak: document.querySelector("#heroStreak"),
  heroLongestStreak: document.querySelector("#heroLongestStreak"),
  allowEarlyCancel: document.querySelector("#allowEarlyCancel"),
  languageSelect: document.querySelector("#languageSelect"),
  currencyCode: document.querySelector("#currencyCode"),
  hourlyWage: document.querySelector("#hourlyWage"),
  regretSurveyDays: document.querySelector("#regretSurveyDays"),
  monthlyBudgetLimit: document.querySelector("#monthlyBudgetLimit"),
  budgetResetDay: document.querySelector("#budgetResetDay"),
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
  regretSurveyModal: document.querySelector("#regretSurveyModal"),
  regretSurveyImage: document.querySelector("#regretSurveyImage"),
  regretSurveyImagePlaceholder: document.querySelector("#regretSurveyImagePlaceholder"),
  regretSurveyProductName: document.querySelector("#regretSurveyProductName"),
  regretSurveyPrice: document.querySelector("#regretSurveyPrice"),
  regretSurveyQuestion: document.querySelector("#regretSurveyQuestion"),
  regretHappyButton: document.querySelector("#regretHappyButton"),
  regretRegrettedButton: document.querySelector("#regretRegrettedButton"),
  productCardTemplate: document.querySelector("#productCardTemplate"),
  extendDurationModal: document.querySelector("#extendDurationModal"),
  extendDurationCloseButton: document.querySelector("#extendDurationCloseButton"),
  extendDurationCancelButton: document.querySelector("#extendDurationCancelButton"),
  extendDurationConfirmButton: document.querySelector("#extendDurationConfirmButton"),
  extendDurationMinus: document.querySelector("#extendDurationMinus"),
  extendDurationPlus: document.querySelector("#extendDurationPlus"),
  extendDurationAmount: document.querySelector("#extendDurationAmount"),
  extendDurationUnitHour: document.querySelector("#extendDurationUnitHour"),
  extendDurationUnitDay: document.querySelector("#extendDurationUnitDay"),
  extendDurationUnitsGroup: document.querySelector(".extend-duration-units"),
  reflectionModal: document.querySelector("#reflectionModal"),
  reflectionForm: document.querySelector("#reflectionForm"),
  reflectionSubmitButton: document.querySelector("#reflectionSubmitButton"),
  reflectionDismissButton: document.querySelector("#reflectionDismissButton"),
  reflectionCloseButton: document.querySelector("#reflectionCloseButton"),
  enableReflectionForm: document.querySelector("#enableReflectionForm"),
  goalProgressSection: document.querySelector("#goalProgressSection"),
  goalProgressTitle: document.querySelector("#goalProgressTitle"),
  goalProgressBadge: document.querySelector("#goalProgressBadge"),
  goalProgressStats: document.querySelector("#goalProgressStats"),
  goalProgressFill: document.querySelector("#goalProgressFill"),
  goalName: document.querySelector("#goalName"),
  goalTargetAmount: document.querySelector("#goalTargetAmount"),
  goalCurrentHelp: document.querySelector("#goalCurrentHelp"),
  goalCurrentDisplay: document.querySelector("#goalCurrentDisplay"),
  goalSnackbar: document.querySelector("#goalSnackbar"),
  goalConfettiCanvas: document.querySelector("#goalConfettiCanvas"),
};

let goalSnackbarTimer = null;

document.addEventListener("DOMContentLoaded", init);

function init() {
  loadState();
  loadStreakState();
  loadAuthState();
  bindEvents();
  updateNoSpendStreak();
  renderAll();
  showPendingStreakCelebration();
  configureInstallButton();
  handleShareTargetLaunch();
  startCountdowns();
  notifyExpiredWhileAway();
  checkRegretSurveys();
  persistLastSeenAt();
  registerServiceWorker();
}

function loadState() {
  state.settings = normalizeSettings(readJson(STORAGE_KEYS.settings, DEFAULT_SETTINGS));
  state.items = readJson(STORAGE_KEYS.items, []).map(normalizeItem);
  state.goal = normalizeGoal(readJson(STORAGE_KEYS.goal, DEFAULT_GOAL));
  migrateGoalBaselineIfNeeded();
  state.reflectionTable = readJson(STORAGE_KEYS.reflectionTable, [])
    .map(normalizeReflectionTableRow)
    .filter(Boolean);
  ensureReflectionRowsFromItems();
  saveSettings();
  saveItems();
  saveGoal();
}

function loadAuthState() {
  state.auth = readJson(STORAGE_KEYS.auth, null);
}

function loadStreakState() {
  const storedStreak = readJson(STORAGE_KEYS.streak, {});
  const latestPurchaseDate = getLatestPurchaseDate();
  const lastPurchaseDate = getLaterDateString(storedStreak.lastPurchaseDate, latestPurchaseDate);
  state.streak = {
    lastPurchaseDate,
    currentStreak: Math.max(0, Number(storedStreak.currentStreak) || 0),
    longestStreak: Math.max(0, Number(storedStreak.longestStreak) || 0),
    lastStreakCheckDate: storedStreak.lastStreakCheckDate || getLocalDateKey(new Date()),
  };
  saveStreakState();
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
    enableReflectionForm: Boolean(merged.enableReflectionForm),
    currencyCode: normalizeCurrencyCode(merged.currencyCode),
    hourlyWage: Math.max(0, Number(merged.hourlyWage) || 0),
    language: normalizeLanguage(merged.language),
    monthlyBudgetLimit: Math.max(0, Number(merged.monthlyBudgetLimit) || 0),
    budgetResetDay: normalizeBudgetResetDay(merged.budgetResetDay),
    regretSurveyDays: normalizeRegretSurveyDays(merged.regretSurveyDays),
    timeRules: (Array.isArray(merged.timeRules) ? merged.timeRules : DEFAULT_SETTINGS.timeRules)
      .map((rule, index) => ({
        min: Number(rule.min) || 0,
        max: rule.max === null || rule.max === "Infinity" ? Infinity : Number(rule.max),
        hours: Number(rule.hours) || DEFAULT_SETTINGS.timeRules[index]?.hours || 12,
      }))
      .filter((rule) => Number.isFinite(rule.min) && rule.hours > 0),
  };
}

function clampPenaltyMultiplier(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(1.6, n);
}

/** @returns {{ q1: string, q2: string, q3: string } | null} */
function normalizeReflectionAnswers(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (raw.q1 && raw.q2 && raw.q3) {
    const q1 = ["need", "desire"].includes(raw.q1) ? raw.q1 : null;
    const q2 = ["yes", "no"].includes(raw.q2) ? raw.q2 : null;
    const q3 = ["certain", "unsure"].includes(raw.q3) ? raw.q3 : null;
    if (q1 && q2 && q3) return { q1, q2, q3 };
  }
  if ("isNeed" in raw && "hasSimilar" in raw && "willUse" in raw) {
    return {
      q1: raw.isNeed ? "need" : "desire",
      q2: raw.hasSimilar ? "yes" : "no",
      q3: raw.willUse ? "certain" : "unsure",
    };
  }
  return null;
}

function normalizeReflectionTableRow(raw) {
  if (!raw || typeof raw !== "object" || !raw.itemId) return null;
  const ra = normalizeReflectionAnswers(raw);
  if (!ra) return null;
  const recordedAt = raw.recordedAt && !Number.isNaN(Date.parse(raw.recordedAt)) ? raw.recordedAt : new Date().toISOString();
  return {
    id: raw.id || createId(),
    itemId: String(raw.itemId),
    recordedAt,
    productName: String(raw.productName ?? ""),
    price: Math.max(0, Number(raw.price) || 0),
    q1: ra.q1,
    q2: ra.q2,
    q3: ra.q3,
    penaltyMultiplier: clampPenaltyMultiplier(raw.penaltyMultiplier),
  };
}

function saveReflectionTable() {
  localStorage.setItem(STORAGE_KEYS.reflectionTable, JSON.stringify(state.reflectionTable));
}

function ensureReflectionRowsFromItems() {
  const seen = new Set(state.reflectionTable.map((r) => r.itemId));
  let changed = false;
  for (const item of state.items) {
    const ra = normalizeReflectionAnswers(item.reflectionAnswers);
    if (!ra || seen.has(item.id)) continue;
    state.reflectionTable.push({
      id: createId(),
      itemId: item.id,
      recordedAt: item.dateAdded,
      productName: item.productName,
      price: item.price,
      q1: ra.q1,
      q2: ra.q2,
      q3: ra.q3,
      penaltyMultiplier: clampPenaltyMultiplier(item.penaltyMultiplier),
    });
    seen.add(item.id);
    changed = true;
  }
  if (changed) {
    state.reflectionTable.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
    saveReflectionTable();
  }
}

function appendReflectionTableRow(row) {
  const normalized = normalizeReflectionTableRow(row);
  if (!normalized) return;
  state.reflectionTable.unshift(normalized);
  saveReflectionTable();
}

function normalizeItem(item) {
  const price = Number(item.price) || 0;
  const rulesBase = getWaitHours(price);

  let baseWaitHours = Number(item.baseWaitHours);
  if (!Number.isFinite(baseWaitHours) || baseWaitHours <= 0) {
    baseWaitHours = rulesBase;
  }

  let penaltyMultiplier = clampPenaltyMultiplier(item.penaltyMultiplier);
  const computedAssigned = Math.max(0.01, baseWaitHours * penaltyMultiplier);

  let assignedWaitHours = Number(item.assignedWaitHours);
  if (!Number.isFinite(assignedWaitHours) || assignedWaitHours <= 0) {
    assignedWaitHours = computedAssigned;
  }

  const reflectionAnswers = normalizeReflectionAnswers(item.reflectionAnswers);

  const dateAdded = item.dateAdded || new Date().toISOString();
  const status = item.status || "waiting";
  const boughtDate = status === "bought" ? item.boughtDate || item.statusChangedDate || dateAdded : item.boughtDate || null;
  const regretStatus = ["pending", "happy", "regretted"].includes(item.regretStatus) ? item.regretStatus : "pending";

  const expireDate =
    item.expireDate && !Number.isNaN(Date.parse(item.expireDate))
      ? item.expireDate
      : new Date(new Date(dateAdded).getTime() + assignedWaitHours * 60 * 60 * 1000).toISOString();

  return {
    id: item.id || createId(),
    productName: item.productName || t("unnamedProduct"),
    price,
    hasImage: Boolean(item.hasImage),
    dateAdded,
    baseWaitHours,
    penaltyMultiplier,
    assignedWaitHours,
    reflectionAnswers,
    expireDate,
    status,
    statusChangedDate: item.statusChangedDate || (status !== "waiting" ? dateAdded : null),
    boughtDate,
    regretStatus,
  };
}

function saveSettings() {
  localStorage.setItem(
    STORAGE_KEYS.settings,
    JSON.stringify({
      allowEarlyCancel: state.settings.allowEarlyCancel,
      enableReflectionForm: state.settings.enableReflectionForm,
      currencyCode: state.settings.currencyCode,
      hourlyWage: state.settings.hourlyWage,
      language: state.settings.language,
      monthlyBudgetLimit: state.settings.monthlyBudgetLimit,
      budgetResetDay: state.settings.budgetResetDay,
      regretSurveyDays: state.settings.regretSurveyDays,
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

function normalizeGoal(raw) {
  const merged = { ...DEFAULT_GOAL, ...raw };
  const targetAmount = Math.max(0, Number(merged.targetAmount) || 0);
  let currentAmount = Math.max(0, Number(merged.currentAmount) || 0);
  let goalTrackingSince = null;
  if (
    merged.goalTrackingSince &&
    typeof merged.goalTrackingSince === "string" &&
    !Number.isNaN(Date.parse(merged.goalTrackingSince))
  ) {
    goalTrackingSince = merged.goalTrackingSince;
  }
  if (targetAmount <= 0) {
    goalTrackingSince = null;
    currentAmount = 0;
  }
  return {
    goalName: String(merged.goalName ?? "").trim(),
    targetAmount,
    currentAmount,
    goalTrackingSince,
  };
}

function saveGoal() {
  localStorage.setItem(
    STORAGE_KEYS.goal,
    JSON.stringify({
      goalName: state.goal.goalName,
      targetAmount: state.goal.targetAmount,
      currentAmount: state.goal.currentAmount,
      goalTrackingSince: state.goal.goalTrackingSince,
    }),
  );
}

function recomputeGoalCurrentFromItems() {
  const { goalTrackingSince, targetAmount } = state.goal;
  if (!goalTrackingSince || targetAmount <= 0) {
    state.goal.currentAmount = 0;
    return;
  }
  const t0 = Date.parse(goalTrackingSince);
  if (!Number.isFinite(t0)) {
    state.goal.currentAmount = 0;
    return;
  }
  let sum = 0;
  for (const item of state.items) {
    if (item.status !== "saved_full" && item.status !== "saved_early") continue;
    const d = item.statusChangedDate ? Date.parse(item.statusChangedDate) : NaN;
    if (!Number.isFinite(d) || d < t0) continue;
    sum += Number(item.price) || 0;
  }
  state.goal.currentAmount = Math.max(0, sum);
}

function migrateGoalBaselineIfNeeded() {
  if (state.goal.targetAmount <= 0 || state.goal.goalTrackingSince) return;
  state.goal.goalTrackingSince = new Date().toISOString();
  recomputeGoalCurrentFromItems();
}

function addToGoalAndGetToastMessage(addedAmount, decisionAtIso) {
  const delta = Math.max(0, Number(addedAmount) || 0);
  const { goalName, targetAmount, goalTrackingSince } = state.goal;
  if (targetAmount <= 0 || !goalTrackingSince) return null;

  const baselineMs = Date.parse(goalTrackingSince);
  const decisionMs = Date.parse(decisionAtIso);
  if (!Number.isFinite(decisionMs) || !Number.isFinite(baselineMs) || decisionMs < baselineMs) {
    return null;
  }

  state.goal.currentAmount = Math.max(0, state.goal.currentAmount + delta);
  saveGoal();

  const slicePct = Math.min(100, (delta / targetAmount) * 100);
  const displayName = goalName.trim() || t("goalDefaultName");

  return t("goalProgressToast", {
    goalName: displayName,
    percent: formatNumber(slicePct),
  });
}

function renderGoalProgress() {
  if (!elements.goalProgressSection) return;

  const { goalName, targetAmount, currentAmount } = state.goal;
  const hasTarget = targetAmount > 0;
  const displayName = goalName.trim() || t("goalDefaultName");
  const show = hasTarget;

  elements.goalProgressSection.hidden = !show;
  if (!show) return;

  const overallPct = Math.min(100, Math.round((currentAmount / targetAmount) * 100));
  elements.goalProgressTitle.textContent = displayName;
  elements.goalProgressBadge.textContent = `%${overallPct} ${t("goalPercentDone")}`;
  const targetFmt = formatCurrency(targetAmount);
  elements.goalProgressStats.textContent = `${t("goalAccumulatedLabel")}: ${formatCurrency(currentAmount)} / ${targetFmt}`;
  elements.goalProgressFill.style.width = `${overallPct}%`;

  const track = elements.goalProgressSection.querySelector(".goal-progress-track");
  if (track) {
    track.setAttribute("aria-valuenow", String(overallPct));
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "100");
    track.setAttribute("aria-label", `${displayName}: %${overallPct}`);
    track.removeAttribute("aria-hidden");
  }
}

function showGoalSnackbar(message) {
  if (!elements.goalSnackbar) return;
  elements.goalSnackbar.textContent = message;
  elements.goalSnackbar.hidden = false;
  window.requestAnimationFrame(() => {
    elements.goalSnackbar.classList.add("is-visible");
  });

  window.clearTimeout(goalSnackbarTimer);
  goalSnackbarTimer = window.setTimeout(() => {
    elements.goalSnackbar.classList.remove("is-visible");
    goalSnackbarTimer = window.setTimeout(() => {
      elements.goalSnackbar.hidden = true;
      elements.goalSnackbar.textContent = "";
    }, 300);
  }, 5200);
}

function fireGoalConfetti() {
  const canvas = elements.goalConfettiCanvas;
  if (!canvas?.getContext) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;

  const durationMs = 2100;
  const colors = ["#818cf8", "#34d399", "#fbbf24", "#f472b6", "#38bdf8", "#fb923c"];
  const particles = Array.from({ length: 130 }, () => ({
    x: w * (0.4 + Math.random() * 0.2),
    y: h * (0.12 + Math.random() * 0.08),
    vx: (Math.random() - 0.5) * 12,
    vy: -(Math.random() * 16 + 4),
    g: 0.2 + Math.random() * 0.12,
    r: 2 + Math.random() * 3,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.22,
    c: colors[Math.floor(Math.random() * colors.length)],
  }));

  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      const alpha = Math.max(0, 1 - elapsed / durationMs);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = alpha;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r * 2, p.r * 3);
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.g;
      p.rot += p.vr;
    }

    if (elapsed < durationMs) {
      window.requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, w, h);
      canvas.width = 0;
      canvas.height = 0;
    }
  }

  window.requestAnimationFrame(frame);
}

function saveStreakState() {
  localStorage.setItem(
    STORAGE_KEYS.streak,
    JSON.stringify({
      lastPurchaseDate: state.streak.lastPurchaseDate,
      currentStreak: state.streak.currentStreak,
      longestStreak: state.streak.longestStreak,
      lastStreakCheckDate: state.streak.lastStreakCheckDate,
    }),
  );
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
  elements.imageSourceCloseButton.addEventListener("click", hideImageSourceModal);
  elements.imageLightboxClose.addEventListener("click", hideImageLightbox);
  elements.imageLightbox.addEventListener("click", (event) => {
    if (event.target === elements.imageLightbox) {
      hideImageLightbox();
    }
  });
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

  if (elements.enableReflectionForm) {
    elements.enableReflectionForm.addEventListener("change", () => {
      state.settings.enableReflectionForm = elements.enableReflectionForm.checked;
      saveSettings();
    });
  }

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

  elements.regretSurveyDays.addEventListener("change", () => {
    state.settings.regretSurveyDays = normalizeRegretSurveyDays(elements.regretSurveyDays.value);
    saveSettings();
    renderSettings();
    checkRegretSurveys();
  });

  elements.monthlyBudgetLimit.addEventListener("change", () => {
    state.settings.monthlyBudgetLimit = Math.max(0, parseCurrencyInput(elements.monthlyBudgetLimit.value));
    saveSettings();
    renderAll();
  });

  elements.budgetResetDay.addEventListener("change", () => {
    state.settings.budgetResetDay = normalizeBudgetResetDay(elements.budgetResetDay.value);
    saveSettings();
    renderAll();
  });

  if (elements.goalName && elements.goalTargetAmount) {
    elements.goalName.addEventListener("change", () => {
      state.goal.goalName = elements.goalName.value.trim();
      saveGoal();
      renderGoalProgress();
      if (elements.goalCurrentHelp && elements.goalCurrentDisplay) {
        elements.goalCurrentDisplay.textContent = formatCurrency(state.goal.currentAmount);
      }
    });
    elements.goalTargetAmount.addEventListener("change", () => {
      const prevTarget = state.goal.targetAmount;
      const nextTarget = Math.max(0, parseCurrencyInput(elements.goalTargetAmount.value));
      state.goal.targetAmount = nextTarget;
      if (prevTarget <= 0 && nextTarget > 0) {
        state.goal.goalTrackingSince = new Date().toISOString();
        recomputeGoalCurrentFromItems();
      } else if (nextTarget <= 0) {
        state.goal.goalTrackingSince = null;
        state.goal.currentAmount = 0;
      }
      saveGoal();
      renderGoalProgress();
      if (elements.goalCurrentDisplay) {
        elements.goalCurrentDisplay.textContent = formatCurrency(state.goal.currentAmount);
      }
      if (elements.goalCurrentHelp) {
        elements.goalCurrentHelp.hidden = state.goal.currentAmount <= 0;
      }
    });
  }

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
      if (!elements.imageLightbox.hidden) {
        hideImageLightbox();
        return;
      }
      if (!elements.extendDurationModal.hidden) {
        hideExtendDurationModal();
        return;
      }
      if (elements.reflectionModal && !elements.reflectionModal.hidden) {
        cancelReflectionModal();
        return;
      }
      closeOpenDrawers();
    }
  });
  elements.signInForm.addEventListener("submit", (event) => handleAuthSubmit(event, "signin"));
  elements.signUpForm.addEventListener("submit", (event) => handleAuthSubmit(event, "signup"));
  elements.signOutButton.addEventListener("click", handleSignOut);
  elements.regretHappyButton.addEventListener("click", () => answerRegretSurvey("happy"));
  elements.regretRegrettedButton.addEventListener("click", () => answerRegretSurvey("regretted"));
  elements.modalCloseButton.addEventListener("click", hideFeedbackModal);
  elements.modalCancelButton.addEventListener("click", hideFeedbackModal);

  elements.extendDurationCloseButton.addEventListener("click", hideExtendDurationModal);
  elements.extendDurationCancelButton.addEventListener("click", hideExtendDurationModal);
  elements.extendDurationModal.addEventListener("click", (event) => {
    if (event.target === elements.extendDurationModal) {
      hideExtendDurationModal();
    }
  });
  elements.extendDurationMinus.addEventListener("click", () => adjustExtendModalAmount(-1));
  elements.extendDurationPlus.addEventListener("click", () => adjustExtendModalAmount(1));
  elements.extendDurationUnitHour.addEventListener("click", () => setExtendModalUnit("hour"));
  elements.extendDurationUnitDay.addEventListener("click", () => setExtendModalUnit("day"));
  elements.extendDurationConfirmButton.addEventListener("click", commitExtendDuration);

  if (elements.reflectionForm) {
    elements.reflectionForm.addEventListener("click", (event) => {
      const btn = event.target.closest(".reflection-choice");
      if (!btn || !elements.reflectionForm.contains(btn)) return;
      const group = btn.closest(".reflection-radios");
      if (!group) return;
      group.querySelectorAll(".reflection-choice").forEach((b) => {
        b.classList.remove("is-selected");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-selected");
      btn.setAttribute("aria-pressed", "true");
    });
    elements.reflectionForm.addEventListener("submit", (event) => {
      event.preventDefault();
      submitReflectionModal();
    });
  }
  elements.reflectionSubmitButton?.addEventListener("click", () => submitReflectionModal());
  elements.reflectionDismissButton?.addEventListener("click", cancelReflectionModal);
  elements.reflectionCloseButton?.addEventListener("click", cancelReflectionModal);
  elements.reflectionModal?.addEventListener("click", (event) => {
    if (event.target === elements.reflectionModal) {
      cancelReflectionModal();
    }
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
    elements.installButton.hidden = false;
  });

  elements.installButton.addEventListener("click", async () => {
    if (!state.deferredInstallPrompt) {
      if (isIosDevice()) {
        showIosInstallInstructions();
      }
      return;
    }

    state.deferredInstallPrompt.prompt();
    await state.deferredInstallPrompt.userChoice;
    state.deferredInstallPrompt = null;
    elements.installButton.hidden = true;
  });
}

function configureInstallButton() {
  if (isIosDevice() && !isStandaloneApp()) {
    elements.installButton.hidden = false;
  }
}

function showIosInstallInstructions() {
  showInfoModal({
    eyebrow: t("iosInstallEyebrow"),
    title: t("iosInstallTitle"),
    message: t("iosInstallMessage"),
    success: true,
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

  const budget = getBudgetHealth();
  if (state.settings.monthlyBudgetLimit > 0 && price > budget.remaining) {
    showConfirmModal({
      eyebrow: t("budgetOverdraftEyebrow"),
      title: t("budgetOverdraftTitle"),
      message: t("budgetOverdraftMessage", { amount: formatCurrency(price) }),
      confirmText: t("budgetOverdraftAction"),
      onConfirm: () => startWishAddFlow(productName, price),
    });
    return;
  }

  await startWishAddFlow(productName, price);
}

function computeReflectionPenalty(answers) {
  const n = normalizeReflectionAnswers(answers);
  if (!n) return 1;
  let m = 1;
  if (n.q1 === "desire") m += 0.2;
  if (n.q2 === "yes") m += 0.2;
  if (n.q3 === "unsure") m += 0.2;
  return clampPenaltyMultiplier(m);
}

async function startWishAddFlow(productName, price) {
  if (!state.settings.enableReflectionForm) {
    await addWaitingItem(productName, price, null);
    return;
  }
  state.pendingWish = { productName, price };
  openReflectionModal();
}

function resetReflectionForm() {
  if (!elements.reflectionForm) return;
  elements.reflectionForm.querySelectorAll(".reflection-choice").forEach((btn) => {
    btn.classList.remove("is-selected");
    btn.setAttribute("aria-pressed", "false");
  });
}

function parseReflectionFormAnswers() {
  const form = elements.reflectionForm;
  if (!form) return null;
  function selectedValue(field) {
    const selected = form.querySelector(`[data-reflection-field="${field}"] .reflection-choice.is-selected`);
    return selected?.dataset?.value ?? null;
  }
  const q1 = selectedValue("q1");
  const q2 = selectedValue("q2");
  const q3 = selectedValue("q3");
  if (!q1 || !q2 || !q3) return null;
  if (!["need", "desire"].includes(q1) || !["yes", "no"].includes(q2) || !["certain", "unsure"].includes(q3)) {
    return null;
  }
  return { q1, q2, q3 };
}

function openReflectionModal() {
  if (!elements.reflectionModal) return;
  resetReflectionForm();
  elements.reflectionModal.hidden = false;
  elements.reflectionSubmitButton?.focus();
}

function hideReflectionModal() {
  if (!elements.reflectionModal) return;
  elements.reflectionModal.hidden = true;
  state.pendingWish = null;
}

async function submitReflectionModal() {
  const answers = parseReflectionFormAnswers();
  if (!answers) {
    showInfoModal({
      eyebrow: t("reflectionModalEyebrow"),
      title: t("reflectionModalTitle"),
      message: t("reflectionIncomplete"),
    });
    return;
  }

  const pending = state.pendingWish;
  if (!pending) {
    hideReflectionModal();
    return;
  }

  const penaltyMultiplier = computeReflectionPenalty(answers);
  const { productName, price } = pending;
  state.pendingWish = null;
  if (elements.reflectionModal) {
    elements.reflectionModal.hidden = true;
  }

  await addWaitingItem(productName, price, { reflectionAnswers: answers, penaltyMultiplier });
}

function cancelReflectionModal() {
  hideReflectionModal();
}

async function addWaitingItem(productName, price, reflectionOptions) {
  const baseWaitHours = getWaitHours(price);
  let penaltyMultiplier = 1;
  let reflectionAnswers = null;

  if (reflectionOptions?.reflectionAnswers) {
    reflectionAnswers = normalizeReflectionAnswers(reflectionOptions.reflectionAnswers);
    if (reflectionAnswers) {
      penaltyMultiplier = clampPenaltyMultiplier(
        reflectionOptions.penaltyMultiplier ?? computeReflectionPenalty(reflectionAnswers),
      );
    }
  }

  const assignedWaitHours = Math.max(0.01, baseWaitHours * penaltyMultiplier);
  const dateAdded = new Date();
  const item = {
    id: createId(),
    productName,
    price,
    hasImage: Boolean(state.selectedImage),
    dateAdded: dateAdded.toISOString(),
    baseWaitHours,
    penaltyMultiplier,
    assignedWaitHours,
    reflectionAnswers,
    expireDate: new Date(dateAdded.getTime() + assignedWaitHours * 60 * 60 * 1000).toISOString(),
    status: "waiting",
    statusChangedDate: null,
    boughtDate: null,
    regretStatus: "pending",
  };

  if (state.selectedImage) {
    await saveImageToOpfs(item.id, state.selectedImage);
  }

  state.items.unshift(item);
  if (reflectionAnswers) {
    appendReflectionTableRow({
      id: createId(),
      itemId: item.id,
      recordedAt: item.dateAdded,
      productName: item.productName,
      price: item.price,
      q1: reflectionAnswers.q1,
      q2: reflectionAnswers.q2,
      q3: reflectionAnswers.q3,
      penaltyMultiplier: item.penaltyMultiplier,
    });
  }
  saveItems();
  resetForm();
  renderAll();
  showTab("waiting");

  if (reflectionAnswers) {
    if (penaltyMultiplier > 1) {
      showGoalSnackbar(t("reflectionPenaltyToast", { percent: formatNumber((penaltyMultiplier - 1) * 100) }));
    } else {
      showGoalSnackbar(t("reflectionNoPenaltyToast"));
    }
  }
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

function normalizeRegretSurveyDays(value) {
  const days = Number(value);
  return Number.isFinite(days) ? Math.round(days) : DEFAULT_SETTINGS.regretSurveyDays;
}

function normalizeBudgetResetDay(value) {
  const day = Math.round(Number(value) || DEFAULT_SETTINGS.budgetResetDay);
  return Math.min(31, Math.max(1, day));
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

function renderNoSpendStreak() {
  const current = state.streak.currentStreak;
  const longest = state.streak.longestStreak;
  const showStreak = current > 0 || longest > 0;
  elements.heroStreakPill.hidden = !showStreak;
  elements.heroStreak.textContent = t("streakLabel", { days: current });
  elements.heroLongestStreak.textContent = t("longestStreakLabel", { days: longest });
}

function renderBudgetHealth() {
  const limit = state.settings.monthlyBudgetLimit;
  if (limit <= 0) {
    elements.budgetHealthCards.forEach((card) => {
      card.hidden = true;
    });
    return;
  }

  elements.budgetHealthCards.forEach((card) => {
    card.hidden = false;
  });

  const budget = getBudgetHealth();

  elements.budgetHealthCards.forEach((card) => {
    const status = card.querySelector("[data-budget-health-status]");
    const copy = card.querySelector("[data-budget-health-copy]");
    const fill = card.querySelector("[data-budget-health-fill]");
    const ghost = card.querySelector("[data-budget-health-ghost]");

    card.classList.remove("is-safe", "is-caution", "is-critical", "is-over", "is-disabled");
    card.classList.add(`is-${budget.state}`);
    status.textContent = budget.statusText;
    copy.textContent = budget.copyText;
    fill.style.width = `${budget.healthPercent}%`;
    ghost.style.left = `${budget.ghostLeftPercent}%`;
    ghost.style.width = `${budget.ghostWidthPercent}%`;
    ghost.hidden = budget.ghostWidthPercent <= 0;
  });
}

function getBudgetHealth(extraPendingAmount = 0) {
  const limit = state.settings.monthlyBudgetLimit;
  if (limit <= 0) {
    return {
      state: "disabled",
      statusText: t("budgetHealthTitle"),
      copyText: t("budgetHealthSetup"),
      remaining: 0,
      projectedRemaining: 0,
      healthPercent: 0,
      ghostLeftPercent: 0,
      ghostWidthPercent: 0,
    };
  }

  const cycle = getCurrentBudgetCycle();
  const spent = state.items
    .filter((item) => item.status === "bought" && isDateInRange(item.boughtDate || item.statusChangedDate, cycle.start, cycle.end))
    .reduce((sum, item) => sum + item.price, 0);
  const pending = state.items
    .filter((item) => item.status === "waiting")
    .reduce((sum, item) => sum + item.price, 0) + extraPendingAmount;
  const remaining = limit - spent;
  const projectedRemaining = remaining - pending;
  const healthPercent = Math.max(0, Math.min(100, (remaining / limit) * 100));
  const projectedHealthPercent = Math.max(0, Math.min(100, (projectedRemaining / limit) * 100));
  const ghostWidthPercent = Math.max(0, healthPercent - projectedHealthPercent);
  const stateName = getBudgetHealthState(remaining, limit);

  return {
    state: stateName,
    statusText: t(stateName === "over" ? "budgetHealthOver" : stateName === "critical" ? "budgetHealthCritical" : stateName === "caution" ? "budgetHealthCaution" : "budgetHealthSafe"),
    copyText: pending > 0
      ? `${t("budgetHealthCopy", { remaining: formatCurrency(remaining), limit: formatCurrency(limit) })}\n${t("budgetHealthGhostCopy", { projected: formatCurrency(projectedRemaining) })}`
      : t("budgetHealthCopy", { remaining: formatCurrency(remaining), limit: formatCurrency(limit) }),
    remaining,
    projectedRemaining,
    healthPercent,
    ghostLeftPercent: projectedHealthPercent,
    ghostWidthPercent,
  };
}

function getBudgetHealthState(remaining, limit) {
  const percent = (remaining / limit) * 100;
  if (remaining <= 0) return "over";
  if (percent < 20) return "critical";
  if (percent < 50) return "caution";
  return "safe";
}

function getCurrentBudgetCycle(referenceDate = new Date()) {
  const resetThisMonth = getBudgetResetDate(referenceDate.getFullYear(), referenceDate.getMonth());
  const start = referenceDate >= resetThisMonth ? resetThisMonth : getBudgetResetDate(referenceDate.getFullYear(), referenceDate.getMonth() - 1);
  const nextReset = getBudgetResetDate(start.getFullYear(), start.getMonth() + 1);
  const end = new Date(nextReset.getTime() - 1);
  return { start, end };
}

function getBudgetResetDate(year, monthIndex) {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const day = Math.min(state.settings.budgetResetDay, daysInMonth);
  return new Date(year, monthIndex, day, 0, 0, 0, 0);
}

function isDateInRange(dateString, start, end) {
  const timestamp = dateString ? new Date(dateString).getTime() : NaN;
  return Number.isFinite(timestamp) && timestamp >= start.getTime() && timestamp <= end.getTime();
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

function isStandaloneApp() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
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
  updateNoSpendStreak();
  renderNoSpendStreak();
  showPendingStreakCelebration();
  notifyExpiredWhileAway();
  checkRegretSurveys();
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

function checkRegretSurveys() {
  if (!elements.regretSurveyModal.hidden || state.regretSurveyQueue.length) {
    return;
  }

  const now = Date.now();
  state.regretSurveyQueue = state.items
    .filter((item) => isRegretSurveyDue(item, now))
    .sort((first, second) => new Date(first.boughtDate).getTime() - new Date(second.boughtDate).getTime())
    .map((item) => item.id);

  showNextRegretSurvey();
}

function isRegretSurveyDue(item, now = Date.now()) {
  if (item.status !== "bought" || item.regretStatus !== "pending" || !item.boughtDate) {
    return false;
  }

  const boughtMs = new Date(item.boughtDate).getTime();
  if (!Number.isFinite(boughtMs)) {
    return false;
  }

  return now - boughtMs >= state.settings.regretSurveyDays * DAY_MS;
}

async function showNextRegretSurvey() {
  const itemId = state.regretSurveyQueue.shift();
  const item = state.items.find((candidate) => candidate.id === itemId);
  if (!item) {
    state.activeRegretSurveyItemId = null;
    elements.regretSurveyModal.hidden = true;
    if (state.regretSurveyQueue.length) {
      showNextRegretSurvey();
    }
    return;
  }

  state.activeRegretSurveyItemId = item.id;
  elements.regretSurveyProductName.textContent = item.productName;
  elements.regretSurveyPrice.textContent = formatRegretSurveyPrice(item.price);
  elements.regretSurveyQuestion.textContent = t("regretSurveyQuestion", { days: getDaysSince(item.boughtDate) });
  elements.regretSurveyImage.alt = t("imageAlt", { name: item.productName });
  elements.regretSurveyImage.hidden = true;
  elements.regretSurveyImage.removeAttribute("src");
  elements.regretSurveyImagePlaceholder.hidden = false;
  elements.regretSurveyImagePlaceholder.textContent = item.productName;

  if (item.hasImage) {
    const imageUrl = await loadImageUrl(item.id);
    if (state.activeRegretSurveyItemId === item.id && imageUrl) {
      elements.regretSurveyImage.src = imageUrl;
      elements.regretSurveyImage.hidden = false;
      elements.regretSurveyImagePlaceholder.hidden = true;
    }
  }

  elements.regretSurveyModal.hidden = false;
  elements.regretHappyButton.focus();
}

function answerRegretSurvey(regretStatus) {
  const item = state.items.find((candidate) => candidate.id === state.activeRegretSurveyItemId);
  if (!item) {
    showNextRegretSurvey();
    return;
  }

  item.regretStatus = regretStatus;
  saveItems();
  renderWallet();
  showNextRegretSurvey();
}

function getDaysSince(dateString) {
  const timestamp = new Date(dateString).getTime();
  if (!Number.isFinite(timestamp)) {
    return state.settings.regretSurveyDays;
  }

  return Math.max(1, Math.floor((Date.now() - timestamp) / DAY_MS));
}

function formatRegretSurveyPrice(value) {
  return `${Number(value || 0).toFixed(2).replace(".", ",")} ${state.settings.currencyCode}`;
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

function updateNoSpendStreak() {
  const today = startOfLocalDay(new Date());
  const yesterday = addDays(today, -1);
  let lastChecked = parseLocalDateKey(state.streak.lastStreakCheckDate) || today;

  if (lastChecked >= today) {
    return;
  }

  const purchaseDates = getPurchaseDateKeys();
  let streakIncreased = false;
  let cursor = new Date(lastChecked);
  while (cursor <= yesterday) {
    if (purchaseDates.has(getLocalDateKey(cursor))) {
      state.streak.currentStreak = 0;
    } else {
      state.streak.currentStreak += 1;
      streakIncreased = true;
      state.streak.longestStreak = Math.max(state.streak.longestStreak, state.streak.currentStreak);
    }
    cursor = addDays(cursor, 1);
  }

  state.streak.lastStreakCheckDate = getLocalDateKey(today);
  state.pendingStreakCelebrationDays = streakIncreased ? state.streak.currentStreak : null;
  saveStreakState();
}

function showPendingStreakCelebration() {
  if (!state.pendingStreakCelebrationDays) {
    return;
  }

  const days = state.pendingStreakCelebrationDays;
  state.pendingStreakCelebrationDays = null;
  showInfoModal({
    eyebrow: t("streakCelebrationEyebrow"),
    title: t("streakCelebrationTitle", { days }),
    message: t("streakCelebrationMessage"),
    success: true,
  });
}

function recordPurchaseForStreak(dateString) {
  state.streak.lastPurchaseDate = dateString;
  state.streak.currentStreak = 0;
  state.pendingStreakCelebrationDays = null;
  saveStreakState();
}

function getPurchaseDateKeys() {
  return new Set(
    state.items
      .filter((item) => item.status === "bought")
      .map((item) => item.boughtDate || item.statusChangedDate)
      .filter(Boolean)
      .filter((dateString) => Number.isFinite(new Date(dateString).getTime()))
      .map((dateString) => getLocalDateKey(new Date(dateString))),
  );
}

function getLatestPurchaseDate() {
  return state.items
    .filter((item) => item.status === "bought")
    .map((item) => item.boughtDate || item.statusChangedDate)
    .filter(Boolean)
    .sort((first, second) => new Date(second).getTime() - new Date(first).getTime())[0] || null;
}

function getLaterDateString(firstDate, secondDate) {
  const firstMs = firstDate ? new Date(firstDate).getTime() : 0;
  const secondMs = secondDate ? new Date(secondDate).getTime() : 0;
  const hasFirst = Number.isFinite(firstMs) && firstMs > 0;
  const hasSecond = Number.isFinite(secondMs) && secondMs > 0;

  if (!hasFirst && !hasSecond) return null;
  if (!hasSecond) return firstDate || null;
  if (!hasFirst) return secondDate || null;
  return firstMs >= secondMs ? firstDate : secondDate;
}

function startOfLocalDay(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseLocalDateKey(dateKey) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey || "")) {
    return null;
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
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
  renderNoSpendStreak();
  renderBudgetHealth();
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
  if (elements.enableReflectionForm) {
    elements.enableReflectionForm.checked = state.settings.enableReflectionForm;
  }
  elements.languageSelect.value = state.settings.language;
  elements.currencyCode.value = state.settings.currencyCode;
  elements.hourlyWage.value = state.settings.hourlyWage > 0 ? formatNumber(state.settings.hourlyWage) : "";
  elements.regretSurveyDays.value = state.settings.regretSurveyDays;
  elements.monthlyBudgetLimit.value = state.settings.monthlyBudgetLimit > 0 ? formatNumber(state.settings.monthlyBudgetLimit) : "";
  elements.budgetResetDay.value = state.settings.budgetResetDay;
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

  if (elements.goalName && elements.goalTargetAmount && elements.goalCurrentDisplay && elements.goalCurrentHelp) {
    elements.goalName.value = state.goal.goalName;
    elements.goalTargetAmount.value = state.goal.targetAmount > 0 ? formatNumber(state.goal.targetAmount) : "";
    elements.goalCurrentDisplay.textContent = formatCurrency(state.goal.currentAmount);
    elements.goalCurrentHelp.hidden = state.goal.currentAmount <= 0;
  }
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
  const totalBought = boughtItems.reduce((sum, item) => sum + item.price, 0);
  const completedDecisions = completedItems.length;
  const success = completedDecisions ? Math.round((savedItems.length / completedDecisions) * 100) : 0;
  const answeredRegretItems = boughtItems.filter((item) => item.regretStatus === "happy" || item.regretStatus === "regretted");
  const regrettedCount = answeredRegretItems.filter((item) => item.regretStatus === "regretted").length;
  const regretRate = answeredRegretItems.length ? Math.round((regrettedCount / answeredRegretItems.length) * 100) : null;

  elements.totalSaved.textContent = formatCurrency(totalSaved);
  elements.totalBought.textContent = formatCurrency(totalBought);
  elements.successRate.textContent = `%${success}`;
  elements.successBar.style.width = `${success}%`;
  elements.regretRate.textContent = regretRate === null ? t("regretNoData") : `%${regretRate}`;
  elements.heroSavedTotal.textContent = formatCurrency(totalSaved);
  elements.heroSuccessRate.textContent = t("heroSuccess", { success });
  renderGoalProgress();
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
      image.classList.add("is-zoomable");
      image.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openImageLightbox(imageUrl, image.alt);
      });
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
    if (isExpired) {
      const extendBtn = document.createElement("button");
      extendBtn.type = "button";
      extendBtn.className = "extend-duration-button";
      extendBtn.textContent = t("extendDurationButton");
      extendBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        showExtendDurationModal(item.id);
      });
      imageWrap.append(extendBtn);
    }
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
    if (item.status === "bought") {
      const regretVoteBadge = createRegretVoteBadge(item);
      if (regretVoteBadge) {
        imageWrap.append(regretVoteBadge);
      }
    }
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

function createRegretVoteBadge(item) {
  const vote = getRegretVoteCopy(item);
  if (!vote) {
    return null;
  }

  const badge = document.createElement("span");
  badge.className = `regret-vote-badge ${vote.className}`;
  badge.textContent = vote.icon;
  badge.title = vote.label;
  badge.setAttribute("aria-label", vote.label);
  return badge;
}

function getRegretVoteCopy(item) {
  if (item.regretStatus === "happy") {
    return {
      className: "happy",
      icon: "👍",
      label: t("regretVoteHappy"),
    };
  }

  if (item.regretStatus === "regretted") {
    return {
      className: "regretted",
      icon: "👎",
      label: t("regretVoteRegretted"),
    };
  }

  return null;
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
  const result = updateItemStatus(id, status);

  if (status === "bought") {
    showStreakResetModal();
    return;
  }

  const isCancelSaved = status === "saved_full" || status === "saved_early";
  if (!isCancelSaved) return;

  fireGoalConfetti();

  const msg = result?.goalToastMessage;
  const showSnack = () => {
    if (msg) {
      showGoalSnackbar(msg);
    }
  };

  if (isEarlyDecision) {
    showEarlyDecisionModal(item, status, showSnack);
  } else {
    showSnack();
  }
}

function updateItemStatus(id, status) {
  const item = state.items.find((candidate) => candidate.id === id);
  if (!item) return null;
  const changedAt = new Date().toISOString();

  item.status = status;
  item.statusChangedDate = changedAt;
  let goalToastMessage = null;
  if (status === "bought") {
    item.boughtDate = changedAt;
    item.regretStatus = "pending";
    recordPurchaseForStreak(changedAt);
  } else if (status === "saved_full" || status === "saved_early") {
    goalToastMessage = addToGoalAndGetToastMessage(item.price, changedAt);
  }

  saveItems();
  renderAll();
  return { goalToastMessage };
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

function showEarlyDecisionModal(item, status, onDismiss) {
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
  elements.modalOkButton.onclick = () => {
    hideFeedbackModal();
    onDismiss?.();
  };
  elements.modalOkButton.focus();
}

function showStreakResetModal() {
  showInfoModal({
    eyebrow: t("streakResetEyebrow"),
    title: t("streakResetTitle"),
    message: t("streakResetMessage"),
  });
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

function resetExtendModalForm() {
  state.extendModal.amount = 1;
  state.extendModal.unit = "hour";
}

function syncExtendModalUi() {
  elements.extendDurationAmount.textContent = String(state.extendModal.amount);
  const isHour = state.extendModal.unit === "hour";
  elements.extendDurationUnitHour.setAttribute("aria-checked", String(isHour));
  elements.extendDurationUnitDay.setAttribute("aria-checked", String(!isHour));
  elements.extendDurationUnitsGroup.setAttribute("aria-label", t("extendDurationTitle"));
}

function adjustExtendModalAmount(delta) {
  state.extendModal.amount = Math.max(1, state.extendModal.amount + delta);
  syncExtendModalUi();
}

function setExtendModalUnit(unit) {
  state.extendModal.unit = unit === "day" ? "day" : "hour";
  syncExtendModalUi();
}

function showExtendDurationModal(itemId) {
  const item = state.items.find((candidate) => candidate.id === itemId);
  if (!item || item.status !== "waiting" || getRemainingMs(item) > 0) {
    return;
  }

  state.extendModal.itemId = itemId;
  resetExtendModalForm();
  syncExtendModalUi();
  elements.extendDurationModal.hidden = false;
  elements.extendDurationConfirmButton.focus();
}

function hideExtendDurationModal() {
  state.extendModal.itemId = null;
  elements.extendDurationModal.hidden = true;
}

function commitExtendDuration() {
  const itemId = state.extendModal.itemId;
  if (!itemId) {
    return;
  }

  const item = state.items.find((candidate) => candidate.id === itemId);
  if (!item || item.status !== "waiting") {
    hideExtendDurationModal();
    return;
  }

  const amount = state.extendModal.amount;
  const extendMs = amount * (state.extendModal.unit === "day" ? DAY_MS : 60 * 60 * 1000);
  const base = Math.max(Date.now(), new Date(item.expireDate).getTime());
  item.expireDate = new Date(base + extendMs).toISOString();
  const totalMs = new Date(item.expireDate).getTime() - new Date(item.dateAdded).getTime();
  item.assignedWaitHours = Math.max(0.01, totalMs / (60 * 60 * 1000));

  hideExtendDurationModal();
  saveItems();
  renderAll();
}

function openImageLightbox(src, altText) {
  if (!src) {
    return;
  }

  elements.imageLightboxImg.src = src;
  elements.imageLightboxImg.alt = altText || "";
  elements.imageLightbox.hidden = false;
  elements.imageLightboxClose.focus();
}

function hideImageLightbox() {
  elements.imageLightbox.hidden = true;
  elements.imageLightboxImg.removeAttribute("src");
  elements.imageLightboxImg.alt = "";
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
  state.goal = structuredClone(DEFAULT_GOAL);
  state.reflectionTable = [];
  saveReflectionTable();
  saveItems();
  saveSettings();
  saveGoal();
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
