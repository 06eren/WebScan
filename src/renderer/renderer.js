/**
 * WebScan - Renderer (UI Mantığı) — Faz 3
 * SVG ikonlar, filtreleme, sıralama, kategoriler, favoriler,
 * çoklu anahtar kelime, ayarlar, sidebar toggle, detay paneli
 */

// ==================== SVG İKON KÜTÜPHANESİ ====================

const ICONS = {
    globe: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    briefcase: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    linkedin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
    clipboard: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>',
    door: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/></svg>',
    shoppingCart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    shoppingBag: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    package: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    home: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    tag: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
    catIs: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    catEticaret: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
    catHaber: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>',
    catEgitim: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    catDiger: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
    star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    starFilled: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    checkCircle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    xCircle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    alertTriangle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    externalLink: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    barChart: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
};

const SITE_ICON_MAP = {
    'kariyer.net': 'briefcase', 'linkedin.com': 'linkedin', 'indeed.com': 'clipboard',
    'glassdoor.com': 'door', 'hepsiburada.com': 'shoppingCart', 'trendyol.com': 'shoppingBag',
    'amazon.com': 'package', 'n11.com': 'tag', 'sahibinden.com': 'home',
};

const CATEGORIES = {
    is: { label: 'İş & Kariyer', icon: 'catIs', color: '#6366f1' },
    eticaret: { label: 'E-Ticaret', icon: 'catEticaret', color: '#ec4899' },
    haber: { label: 'Haber', icon: 'catHaber', color: '#f59e0b' },
    egitim: { label: 'Eğitim', icon: 'catEgitim', color: '#10b981' },
    diger: { label: 'Diğer', icon: 'catDiger', color: '#64748b' },
};

// ==================== DOM REFERANSLARI ====================

const DOM = {
    keywordInput: document.getElementById('keywordInput'),
    scanBtn: document.getElementById('scanBtn'),
    stopBtn: document.getElementById('stopBtn'),
    siteCount: document.getElementById('siteCount'),
    resultCount: document.getElementById('resultCount'),

    siteUrlInput: document.getElementById('siteUrlInput'),
    siteNameInput: document.getElementById('siteNameInput'),
    siteCategorySelect: document.getElementById('siteCategorySelect'),
    addSiteBtn: document.getElementById('addSiteBtn'),
    siteList: document.getElementById('siteList'),
    emptySites: document.getElementById('emptySites'),

    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    sidebarContent: document.getElementById('sidebarContent'),

    welcomeState: document.getElementById('welcomeState'),
    scanProgress: document.getElementById('scanProgress'),
    progressText: document.getElementById('progressText'),
    progressBarFill: document.getElementById('progressBarFill'),
    progressDetail: document.getElementById('progressDetail'),
    resultsGrid: document.getElementById('resultsGrid'),

    filterToolbar: document.getElementById('filterToolbar'),
    filterSite: document.getElementById('filterSite'),
    filterCategory: document.getElementById('filterCategory'),
    sortBy: document.getElementById('sortBy'),
    filterCount: document.getElementById('filterCount'),

    tabResults: document.getElementById('tabResults'),
    tabFavorites: document.getElementById('tabFavorites'),
    tabHistory: document.getElementById('tabHistory'),
    resultsPanel: document.getElementById('resultsPanel'),
    favoritesPanel: document.getElementById('favoritesPanel'),
    historyPanel: document.getElementById('historyPanel'),
    historyList: document.getElementById('historyList'),
    favoritesGrid: document.getElementById('favoritesGrid'),

    // Detail panel
    detailPanel: document.getElementById('detailPanel'),
    detailBody: document.getElementById('detailBody'),
    detailClose: document.getElementById('detailClose'),

    // Settings
    settingsBtn: document.getElementById('settingsBtn'),
    settingsOverlay: document.getElementById('settingsOverlay'),
    settingsClose: document.getElementById('settingsClose'),
    settingsSave: document.getElementById('settingsSave'),
    settingTimeout: document.getElementById('settingTimeout'),
    settingDelay: document.getElementById('settingDelay'),
    settingUserAgent: document.getElementById('settingUserAgent'),
    settingHeadless: document.getElementById('settingHeadless'),
    settingProxy: document.getElementById('settingProxy'),
    settingMaxResults: document.getElementById('settingMaxResults'),
    settingLanguage: document.getElementById('settingLanguage'),
    settingDeepCrawl: document.getElementById('settingDeepCrawl'),
    settingMaxPages: document.getElementById('settingMaxPages'),
    settingCrawlDepth: document.getElementById('settingCrawlDepth'),
    deepCrawlText: document.getElementById('deepCrawlText'),
    headlessText: document.getElementById('headlessText'),

    toastContainer: document.getElementById('toastContainer')
};

// ==================== DURUM YÖNETİMİ ====================

let isScanning = false;
let sites = [];
let allResults = [];
let favorites = [];
let appSettings = {};

// ==================== BAŞLANGIÇ ====================

async function init() {
    await loadSites();
    await loadFavorites();
    await loadSettings();
    setupEventListeners();
    setupQuickAddButtons();
    setupKeyboardShortcuts();
}

// ==================== OLAY DİNLEYİCİLERİ ====================

function setupEventListeners() {
    DOM.scanBtn.addEventListener('click', startScan);
    DOM.stopBtn.addEventListener('click', stopScan);
    DOM.keywordInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') startScan(); });
    DOM.addSiteBtn.addEventListener('click', addSite);
    DOM.siteUrlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addSite(); });

    // Tabs
    DOM.tabResults.addEventListener('click', () => switchTab('results'));
    DOM.tabFavorites.addEventListener('click', () => switchTab('favorites'));
    DOM.tabHistory.addEventListener('click', () => switchTab('history'));

    // Filters
    DOM.filterSite.addEventListener('change', applyFilters);
    DOM.filterCategory.addEventListener('change', applyFilters);
    DOM.sortBy.addEventListener('change', applyFilters);

    // Sidebar toggle
    DOM.sidebarToggle.addEventListener('click', toggleSidebar);

    // Detail panel close
    DOM.detailClose.addEventListener('click', closeDetailPanel);

    // Settings
    DOM.settingsBtn.addEventListener('click', openSettings);
    DOM.settingsClose.addEventListener('click', closeSettings);
    DOM.settingsOverlay.addEventListener('click', (e) => { if (e.target === DOM.settingsOverlay) closeSettings(); });
    DOM.settingsSave.addEventListener('click', saveSettings);
    DOM.settingHeadless.addEventListener('change', () => {
        DOM.headlessText.textContent = DOM.settingHeadless.checked
            ? 'Açık (arka planda çalışır)' : 'Kapalı (tarayıcı görünür)';
    });
    DOM.settingDeepCrawl.addEventListener('change', () => {
        DOM.deepCrawlText.textContent = DOM.settingDeepCrawl.checked
            ? 'Açık (alt sayfalar taranır)' : 'Kapalı (sadece ana sayfa)';
    });

    // Progress
    window.api.onScanProgress(handleProgress);
}

function setupQuickAddButtons() {
    document.querySelectorAll('.btn-quick').forEach(btn => {
        btn.addEventListener('click', async () => {
            const url = btn.dataset.url;
            const name = btn.dataset.name;
            const category = btn.dataset.category || 'diger';
            if (sites.some(s => s.url === url)) { showToast('Bu site zaten eklenmiş!', 'info'); return; }
            try {
                await window.api.addSite({ url, name, category });
                btn.classList.add('added');
                btn.innerHTML = `${ICONS.check} ${name}`;
                showToast(`${name} eklendi!`, 'success');
                await loadSites();
            } catch (error) { showToast(`Hata: ${error.message}`, 'error'); }
        });
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); startScan(); }
        if (e.key === 'Escape') {
            if (isScanning) { e.preventDefault(); stopScan(); }
            else if (!DOM.settingsOverlay.classList.contains('hidden')) { closeSettings(); }
            else if (DOM.detailPanel.classList.contains('open')) { closeDetailPanel(); }
        }
    });
}

// ==================== SİTE İŞLEMLERİ ====================

async function loadSites() {
    try {
        sites = await window.api.getSites();
        renderSites();
        DOM.siteCount.textContent = sites.length;
        document.querySelectorAll('.btn-quick').forEach(btn => {
            const url = btn.dataset.url;
            const name = btn.dataset.name;
            if (sites.some(s => s.url === url)) {
                btn.classList.add('added');
                btn.innerHTML = `${ICONS.check} ${name}`;
            } else {
                btn.classList.remove('added');
                btn.textContent = name;
            }
        });
    } catch (error) { showToast('Siteler yüklenemedi!', 'error'); }
}

function renderSites() {
    if (sites.length === 0) {
        DOM.emptySites.classList.remove('hidden');
        DOM.siteList.querySelectorAll('.site-item').forEach(el => el.remove());
        return;
    }
    DOM.emptySites.classList.add('hidden');
    DOM.siteList.querySelectorAll('.site-item').forEach(el => el.remove());

    sites.forEach(site => {
        const el = document.createElement('div');
        el.className = 'site-item';
        const cat = CATEGORIES[site.category] || CATEGORIES.diger;
        const siteIcon = getSiteIcon(site.url);
        el.innerHTML = `
      <div class="site-favicon">${siteIcon}</div>
      <div class="site-info">
        <div class="site-name">${escapeHtml(site.name || extractDomain(site.url))}</div>
        <div class="site-url">${escapeHtml(site.url)}</div>
        <span class="category-badge" style="--cat-color: ${cat.color}">${ICONS[cat.icon]} ${cat.label}</span>
      </div>
      <button class="btn-icon" title="Siteyi sil" data-id="${site._id}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`;
        el.querySelector('.btn-icon').addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
                await window.api.removeSite(e.currentTarget.dataset.id);
                showToast('Site silindi', 'info');
                await loadSites();
            } catch (error) { showToast(`Hata: ${error.message}`, 'error'); }
        });
        DOM.siteList.appendChild(el);
    });
}

async function addSite() {
    const rawUrl = DOM.siteUrlInput.value.trim();
    const name = DOM.siteNameInput.value.trim();
    const category = DOM.siteCategorySelect.value;

    // Boş URL kontrolü
    if (!rawUrl) {
        showToast('Lütfen bir URL girin!', 'error');
        DOM.siteUrlInput.focus();
        return;
    }

    // URL formatla
    let formattedUrl = rawUrl;
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
        formattedUrl = 'https://' + rawUrl;
    }

    // URL geçerlilik kontrolü
    try {
        new URL(formattedUrl);
    } catch {
        showToast('Geçersiz URL formatı! Örnek: https://www.example.com', 'error');
        DOM.siteUrlInput.focus();
        return;
    }

    // Zaten eklenmiş mi kontrolü (hem tam URL hem de domain bazlı)
    const newDomain = extractDomain(formattedUrl);
    if (sites.some(s => s.url === formattedUrl || extractDomain(s.url) === newDomain)) {
        showToast('Bu site (veya aynı domain) zaten eklenmiş!', 'info');
        return;
    }

    // Double-click önleme
    DOM.addSiteBtn.disabled = true;

    try {
        await window.api.addSite({ url: formattedUrl, name, category });
        // Formu temizle
        DOM.siteUrlInput.value = '';
        DOM.siteNameInput.value = '';
        DOM.siteCategorySelect.selectedIndex = 0;
        showToast(`${name || extractDomain(formattedUrl)} eklendi!`, 'success');
        await loadSites();
    } catch (error) {
        // NeDB unique constraint hatası
        if (error.message && error.message.includes('unique')) {
            showToast('Bu URL zaten veritabanında kayıtlı!', 'info');
        } else {
            showToast(`Hata: ${error.message}`, 'error');
        }
    } finally {
        DOM.addSiteBtn.disabled = false;
    }
}

// ==================== SIDEBAR TOGGLE ====================

function toggleSidebar() {
    DOM.sidebar.classList.toggle('collapsed');
}

// ==================== TARAMA İŞLEMLERİ ====================

async function startScan() {
    const rawInput = DOM.keywordInput.value.trim();
    if (!rawInput) { showToast('Lütfen bir anahtar kelime girin!', 'error'); DOM.keywordInput.focus(); return; }
    if (sites.length === 0) { showToast('Önce sol panelden site ekleyin!', 'error'); return; }
    if (isScanning) return;

    // Çoklu anahtar kelime: virgülle ayır
    const keywords = rawInput.split(',').map(k => k.trim()).filter(k => k.length > 0);
    if (keywords.length === 0) { showToast('Geçerli anahtar kelime yok!', 'error'); return; }

    isScanning = true;
    DOM.scanBtn.classList.add('hidden');
    DOM.stopBtn.classList.remove('hidden');
    DOM.welcomeState.classList.add('hidden');
    DOM.resultsGrid.classList.add('hidden');
    DOM.filterToolbar.classList.add('hidden');
    DOM.scanProgress.classList.remove('hidden');
    DOM.progressBarFill.style.width = '0%';
    DOM.progressDetail.textContent = '';
    closeDetailPanel();
    switchTab('results');

    // Birden fazla kelime varsa sırayla tara
    let allScanResults = [];

    try {
        for (let i = 0; i < keywords.length; i++) {
            const kw = keywords[i];
            DOM.progressText.textContent = keywords.length > 1
                ? `"${kw}" taranıyor... (${i + 1}/${keywords.length} kelime)`
                : `"${kw}" taranıyor...`;

            const results = await window.api.scan(kw);
            allScanResults = allScanResults.concat(results);
        }

        // Tekrarlayan sonuçları link'e göre filtrele
        const seen = new Set();
        allResults = allScanResults.filter(r => {
            if (seen.has(r.link)) return false;
            seen.add(r.link);
            return true;
        });

        updateFilterOptions();
        applyFilters();
        DOM.resultCount.textContent = allResults.length;

        if (allResults.length === 0) {
            showToast('Sonuç bulunamadı. Farklı bir anahtar kelime deneyin.', 'info');
        } else {
            const kwLabel = keywords.length > 1 ? keywords.join(', ') : keywords[0];
            showToast(`Tarama tamamlandı! "${kwLabel}" için ${allResults.length} sonuç.`, 'success');
        }
    } catch (error) {
        showToast(`Tarama hatası: ${error.message}`, 'error');
        DOM.welcomeState.classList.remove('hidden');
    } finally {
        isScanning = false;
        DOM.scanBtn.classList.remove('hidden');
        DOM.stopBtn.classList.add('hidden');
        DOM.scanProgress.classList.add('hidden');
    }
}

async function stopScan() {
    try { await window.api.stopScan(); showToast('Tarama durduruldu', 'info'); }
    catch (error) { showToast(`Hata: ${error.message}`, 'error'); }
}

function handleProgress(data) {
    if (!data) return;
    DOM.progressText.textContent = data.message || '';
    if (data.current && data.total) {
        DOM.progressBarFill.style.width = Math.round((data.current / data.total) * 100) + '%';
    }
    if (data.type === 'site_done' || data.type === 'site_error') {
        DOM.progressDetail.textContent = `${data.current}/${data.total} site — Toplam ${data.totalResults || 0} sonuç`;
    }
    if (data.type === 'crawling') {
        DOM.progressDetail.textContent = data.message;
        // Crawling sırasında barı hafifçe oynat (opsiyonel görsel zenginlik)
    }
    if (data.type === 'completed') DOM.progressBarFill.style.width = '100%';
}

// ==================== FİLTRELEME & SIRALAMA ====================

function updateFilterOptions() {
    DOM.filterSite.innerHTML = '<option value="all">Tüm Siteler</option>';
    [...new Set(allResults.map(r => extractDomain(r.source || r.link)))].forEach(d => {
        const opt = document.createElement('option');
        opt.value = d; opt.textContent = d;
        DOM.filterSite.appendChild(opt);
    });
}

function applyFilters() {
    if (allResults.length === 0) return;
    let filtered = [...allResults];

    const siteFilter = DOM.filterSite.value;
    if (siteFilter !== 'all') filtered = filtered.filter(r => extractDomain(r.source || r.link) === siteFilter);

    const catFilter = DOM.filterCategory.value;
    if (catFilter !== 'all') {
        const sitesInCat = sites.filter(s => s.category === catFilter).map(s => extractDomain(s.url));
        filtered = filtered.filter(r => {
            const rd = extractDomain(r.source || r.link);
            return sitesInCat.some(sd => rd.includes(sd) || sd.includes(rd));
        });
    }

    const sortVal = DOM.sortBy.value;
    switch (sortVal) {
        case 'score-desc': filtered.sort((a, b) => b.score - a.score); break;
        case 'score-asc': filtered.sort((a, b) => a.score - b.score); break;
        case 'title-asc': filtered.sort((a, b) => (a.title || '').localeCompare(b.title || '')); break;
        case 'title-desc': filtered.sort((a, b) => (b.title || '').localeCompare(a.title || '')); break;
    }

    DOM.filterCount.textContent = `${filtered.length} / ${allResults.length} sonuç`;
    renderResults(filtered);
    DOM.filterToolbar.classList.remove('hidden');
}

// ==================== SONUÇ GÖSTERİMİ ====================

function renderResults(results) {
    DOM.resultsGrid.innerHTML = '';
    DOM.resultsGrid.classList.remove('hidden');
    if (results.length === 0) {
        DOM.resultsGrid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><p>Filtreye uygun sonuç bulunamadı</p></div>`;
        return;
    }

    results.forEach((result, index) => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.animationDelay = `${index * 0.04}s`;
        const scoreClass = result.score >= 60 ? 'high' : result.score >= 30 ? 'medium' : '';
        const domain = extractDomain(result.source || result.link);
        const siteIcon = getSiteIcon(result.source || result.link);
        const isFav = favorites.some(f => f.link === result.link);

        card.innerHTML = `
      <div class="result-card-header">
        <div class="result-title">${escapeHtml(result.title)}</div>
        <div class="result-card-actions">
          <button class="btn-fav ${isFav ? 'active' : ''}" title="${isFav ? 'Favorilerden çıkar' : 'Favorilere ekle'}" data-link="${escapeHtml(result.link)}">${isFav ? ICONS.starFilled : ICONS.star}</button>
          <span class="result-score ${scoreClass}">${result.score}%</span>
        </div>
      </div>
      <div class="result-snippet">${escapeHtml(result.snippet || '')}</div>
      <div class="result-meta">
        <span class="result-source">${siteIcon} ${escapeHtml(domain)}</span>
        <a class="result-link" href="#" data-url="${escapeHtml(result.link)}">Aç ${ICONS.externalLink}</a>
      </div>`;

        card.querySelector('.btn-fav').addEventListener('click', (e) => { e.stopPropagation(); toggleFavorite(result); });
        card.querySelector('.result-link').addEventListener('click', (e) => { e.preventDefault(); window.api.openExternal(e.currentTarget.dataset.url); });
        card.addEventListener('click', (e) => {
            if (e.target.closest('.result-link') || e.target.closest('.btn-fav')) return;
            openDetailPanel(result);
        });

        DOM.resultsGrid.appendChild(card);
    });
}

// ==================== DETAY PANELİ ====================

function openDetailPanel(result) {
    const domain = extractDomain(result.source || result.link);
    const siteIcon = getSiteIcon(result.source || result.link);
    const scoreClass = result.score >= 60 ? 'high' : result.score >= 30 ? 'medium' : '';
    const isFav = favorites.some(f => f.link === result.link);

    DOM.detailBody.innerHTML = `
    <div class="detail-score-bar">
      <span class="result-score ${scoreClass}" style="font-size:14px;padding:5px 14px;">Skor: ${result.score}%</span>
      <button class="btn-fav ${isFav ? 'active' : ''}" id="detailFavBtn" style="width:32px;height:32px;">${isFav ? ICONS.starFilled : ICONS.star}</button>
    </div>
    <h2 class="detail-result-title">${escapeHtml(result.title)}</h2>
    <div class="detail-source">
      ${siteIcon} <span>${escapeHtml(domain)}</span>
    </div>
    <div class="detail-link-row">
      <a href="#" class="detail-open-link" id="detailOpenLink">${escapeHtml(result.link)} ${ICONS.externalLink}</a>
    </div>
    ${result.snippet ? `
    <div class="detail-section">
      <h4 class="detail-section-title">Özet</h4>
      <p class="detail-text">${escapeHtml(result.snippet)}</p>
    </div>` : ''}
    ${result.keyword ? `
    <div class="detail-section">
      <h4 class="detail-section-title">Anahtar Kelime</h4>
      <span class="detail-keyword-chip">${ICONS.search} ${escapeHtml(result.keyword)}</span>
    </div>` : ''}
    <div class="detail-section">
      <h4 class="detail-section-title">Bilgiler</h4>
      <div class="detail-info-grid">
        <div class="detail-info-item"><span class="detail-info-label">Kaynak</span><span>${escapeHtml(domain)}</span></div>
        ${result.foundAt ? `<div class="detail-info-item"><span class="detail-info-label">Bulunma</span><span>${formatDate(result.foundAt)}</span></div>` : ''}
        <div class="detail-info-item"><span class="detail-info-label">Eşleşme</span><span>${result.score}%</span></div>
      </div>
    </div>
    <button class="btn btn-scan" id="detailOpenBtn" style="width:100%;margin-top:16px;">
      ${ICONS.externalLink} Tarayıcıda Aç
    </button>`;

    document.getElementById('detailFavBtn').addEventListener('click', () => toggleFavorite(result));
    document.getElementById('detailOpenLink').addEventListener('click', (e) => { e.preventDefault(); window.api.openExternal(result.link); });
    document.getElementById('detailOpenBtn').addEventListener('click', () => window.api.openExternal(result.link));

    DOM.detailPanel.classList.add('open');
}

function closeDetailPanel() {
    DOM.detailPanel.classList.remove('open');
}

// ==================== FAVORİ İŞLEMLERİ ====================

async function loadFavorites() {
    try { favorites = await window.api.getFavorites(); } catch { favorites = []; }
}

async function toggleFavorite(result) {
    try {
        const idx = favorites.findIndex(f => f.link === result.link);
        if (idx >= 0) {
            await window.api.removeFavorite(favorites[idx]._id);
            favorites.splice(idx, 1);
            showToast('Favorilerden çıkarıldı', 'info');
        } else {
            const fav = await window.api.addFavorite({ title: result.title, link: result.link, snippet: result.snippet, score: result.score, source: result.source });
            favorites.push(fav);
            showToast('Favorilere eklendi!', 'success');
        }
        if (allResults.length > 0) applyFilters();
        if (DOM.favoritesPanel.classList.contains('active')) renderFavorites();
        // Detay paneli açıksa güncelle
        if (DOM.detailPanel.classList.contains('open')) openDetailPanel(result);
    } catch (error) { showToast(`Hata: ${error.message}`, 'error'); }
}

function renderFavorites() {
    DOM.favoritesGrid.innerHTML = '';
    if (favorites.length === 0) {
        DOM.favoritesGrid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><p>Henüz favori eklenmedi</p><span>Sonuç kartlarındaki yıldız ikonuna tıklayarak favorilerinize ekleyin</span></div>`;
        return;
    }
    favorites.forEach((fav, index) => {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.style.animationDelay = `${index * 0.04}s`;
        const scoreClass = fav.score >= 60 ? 'high' : fav.score >= 30 ? 'medium' : '';
        const domain = extractDomain(fav.source || fav.link);
        const siteIcon = getSiteIcon(fav.source || fav.link);
        card.innerHTML = `
      <div class="result-card-header">
        <div class="result-title">${escapeHtml(fav.title)}</div>
        <div class="result-card-actions">
          <button class="btn-fav active" title="Favorilerden çıkar">${ICONS.starFilled}</button>
          <span class="result-score ${scoreClass}">${fav.score}%</span>
        </div>
      </div>
      <div class="result-snippet">${escapeHtml(fav.snippet || '')}</div>
      <div class="result-meta"><span class="result-source">${siteIcon} ${escapeHtml(domain)}</span><a class="result-link" href="#" data-url="${escapeHtml(fav.link)}">Aç ${ICONS.externalLink}</a></div>`;
        card.querySelector('.btn-fav').addEventListener('click', (e) => { e.stopPropagation(); toggleFavorite(fav); });
        card.querySelector('.result-link').addEventListener('click', (e) => { e.preventDefault(); window.api.openExternal(e.currentTarget.dataset.url); });
        card.addEventListener('click', (e) => { if (e.target.closest('.result-link') || e.target.closest('.btn-fav')) return; openDetailPanel(fav); });
        DOM.favoritesGrid.appendChild(card);
    });
}

// ==================== TAB YÖNETİMİ ====================

function switchTab(tab) {
    [DOM.tabResults, DOM.tabFavorites, DOM.tabHistory].forEach(t => t.classList.remove('active'));
    [DOM.resultsPanel, DOM.favoritesPanel, DOM.historyPanel].forEach(p => p.classList.remove('active'));
    if (tab === 'results') { DOM.tabResults.classList.add('active'); DOM.resultsPanel.classList.add('active'); }
    else if (tab === 'favorites') { DOM.tabFavorites.classList.add('active'); DOM.favoritesPanel.classList.add('active'); renderFavorites(); }
    else { DOM.tabHistory.classList.add('active'); DOM.historyPanel.classList.add('active'); loadHistory(); }
}

async function loadHistory() {
    try { renderHistory(await window.api.getHistory()); } catch { showToast('Geçmiş yüklenemedi!', 'error'); }
}

function renderHistory(history) {
    if (!history || history.length === 0) {
        DOM.historyList.innerHTML = `<div class="empty-state"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><p>Henüz tarama yapılmadı</p></div>`;
        return;
    }
    DOM.historyList.innerHTML = '';
    history.forEach(scan => {
        const el = document.createElement('div');
        el.className = 'history-item';
        const statusIcon = scan.status === 'completed' ? ICONS.checkCircle : scan.status === 'error' ? ICONS.xCircle : ICONS.clock;
        const statusText = scan.status === 'completed' ? 'Tamamlandı' : scan.status === 'error' ? 'Hata' : scan.status === 'running' ? 'Devam Ediyor' : 'Tamamlandı';
        el.innerHTML = `
      <span class="history-keyword">${ICONS.search} ${escapeHtml(scan.keyword)}</span>
      <span class="history-stat">${ICONS.globe} ${scan.siteCount} site</span>
      <span class="history-stat">${ICONS.barChart} ${scan.resultCount} sonuç</span>
      <span class="history-stat">${ICONS.clock} ${formatDate(scan.startedAt)}</span>
      <span class="history-status ${scan.status || 'completed'}">${statusIcon} ${statusText}</span>`;
        DOM.historyList.appendChild(el);
    });
}

// ==================== AYARLAR ====================

const DEFAULT_SETTINGS = {
    timeout: 30000,
    delay: 1500,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/145.0.0.0 Safari/537.36',
    headless: true,
    proxy: '',
    maxResults: 50,
    language: 'tr',
    deepCrawl: false,
    maxPages: 10,
    crawlDepth: 2
};

async function loadSettings() {
    try {
        const saved = await window.api.getSettings();
        appSettings = { ...DEFAULT_SETTINGS, ...saved };
    } catch {
        appSettings = { ...DEFAULT_SETTINGS };
    }
    applySettingsToUI();
}

function applySettingsToUI() {
    DOM.settingTimeout.value = appSettings.timeout;
    DOM.settingDelay.value = appSettings.delay;
    DOM.settingUserAgent.value = appSettings.userAgent;
    DOM.settingHeadless.checked = appSettings.headless;
    DOM.settingProxy.value = appSettings.proxy;
    DOM.settingMaxResults.value = appSettings.maxResults;
    DOM.settingLanguage.value = appSettings.language;
    DOM.settingDeepCrawl.checked = appSettings.deepCrawl;
    DOM.settingMaxPages.value = appSettings.maxPages;
    DOM.settingCrawlDepth.value = appSettings.crawlDepth;

    DOM.headlessText.textContent = appSettings.headless
        ? 'Açık (arka planda çalışır)' : 'Kapalı (tarayıcı görünür)';
    DOM.deepCrawlText.textContent = appSettings.deepCrawl
        ? 'Açık (alt sayfalar taranır)' : 'Kapalı (sadece ana sayfa)';
}

function openSettings() {
    applySettingsToUI();
    DOM.settingsOverlay.classList.remove('hidden');
}

function closeSettings() {
    DOM.settingsOverlay.classList.add('hidden');
}

async function saveSettings() {
    appSettings = {
        timeout: parseInt(DOM.settingTimeout.value, 10) || 30000,
        delay: parseInt(DOM.settingDelay.value, 10) || 1500,
        userAgent: DOM.settingUserAgent.value.trim() || DEFAULT_SETTINGS.userAgent,
        headless: DOM.settingHeadless.checked,
        proxy: DOM.settingProxy.value.trim(),
        maxResults: parseInt(DOM.settingMaxResults.value, 10) || 50,
        language: DOM.settingLanguage.value,
        deepCrawl: DOM.settingDeepCrawl.checked,
        maxPages: parseInt(DOM.settingMaxPages.value, 10) || 10,
        crawlDepth: parseInt(DOM.settingCrawlDepth.value, 10) || 2
    };
    try {
        await window.api.saveSettings(appSettings);
        showToast('Ayarlar kaydedildi!', 'success');
        closeSettings();
    } catch (error) {
        showToast(`Hata: ${error.message}`, 'error');
    }
}

// ==================== TOAST BİLDİRİMLERİ ====================

function showToast(message, type = 'info') {
    const icons = { success: ICONS.checkCircle, error: ICONS.xCircle, info: ICONS.info, warning: ICONS.alertTriangle };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span>${escapeHtml(message)}</span>`;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'toastOut 0.3s ease forwards'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ==================== YARDIMCI FONKSİYONLAR ====================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function extractDomain(url) {
    try { return new URL(url).hostname.replace('www.', ''); } catch { return url; }
}

function getSiteIcon(url) {
    const domain = extractDomain(url).toLowerCase();
    for (const [key, iconName] of Object.entries(SITE_ICON_MAP)) {
        if (domain.includes(key)) return ICONS[iconName] || ICONS.globe;
    }
    return ICONS.globe;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ==================== BAŞLAT ====================

document.addEventListener('DOMContentLoaded', init);
