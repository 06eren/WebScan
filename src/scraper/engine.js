/**
 * WebScan - Selenium Tarama Motoru
 * Headless Chrome ile web sitelerini tarar
 * Deep Crawl: alt sayfalara girerek tarama
 */

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const fs = require('fs');
const Parser = require('./parser');
const { sleep } = require('../utils/helpers');

class ScanEngine {
    constructor() {
        this.driver = null;
        this.isRunning = false;
        this.aborted = false;
        this.onProgress = null;
        // Ayarlar (main.js'den override edilebilir)
        this.settings = {
            timeout: 30000,
            delay: 1500,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
            headless: true,
            proxy: '',
            maxResults: 50,
            deepCrawl: false,
            maxPages: 10,
            crawlDepth: 2
        };

        // ===== ASAR PATH FIX =====
        this.fixSeleniumPath();
    }

    /**
     * Selenium Manager yolunu paketlenmiş uygulama için düzeltir
     */
    fixSeleniumPath() {
        try {
            // selenium-manager binary yolunu bul
            let managerPath = path.join(
                __dirname,
                '../../node_modules/selenium-webdriver/bin/windows/selenium-manager.exe'
            );

            // Eğer uygulama paketlenmişse (asar içindeyse), yolu .unpacked klasörüne yönlendir
            if (managerPath.includes('app.asar')) {
                managerPath = managerPath.replace('app.asar', 'app.asar.unpacked');

                // Yolun doğruluğunu kontrol et
                if (fs.existsSync(managerPath)) {
                    process.env.SE_MANAGER_PATH = managerPath;
                    console.log('Selenium Manager yolu düzeltildi:', managerPath);
                } else {
                    console.warn('Uyarı: Unpacked Selenium Manager bulunamadı:', managerPath);
                }
            }
        } catch (err) {
            console.error('Selenium yol düzeltme hatası:', err);
        }
    }

    /**
     * Chrome tarayıcısını başlat
     */
    async initialize() {
        const options = new chrome.Options();

        if (this.settings.headless) {
            options.addArguments('--headless=new');
        }
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-gpu');
        options.addArguments('--window-size=1920,1080');
        options.addArguments('--disable-extensions');
        options.addArguments('--disable-notifications');
        options.addArguments(`--user-agent=${this.settings.userAgent}`);

        if (this.settings.proxy) {
            options.addArguments(`--proxy-server=${this.settings.proxy}`);
        }

        try {
            this.driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(options)
                .build();

            await this.driver.manage().setTimeouts({
                pageLoad: this.settings.timeout,
                implicit: 5000
            });

            return true;
        } catch (error) {
            console.error('Chrome başlatılamadı:', error.message);
            throw new Error(`Chrome başlatılamadı: ${error.message}`);
        }
    }

    /**
     * Çoklu siteleri tara
     */
    async scan(sites, keyword) {
        if (this.isRunning) {
            throw new Error('Zaten bir tarama devam ediyor!');
        }

        this.isRunning = true;
        this.aborted = false;
        const allResults = [];

        try {
            await this.initialize();

            for (let i = 0; i < sites.length; i++) {
                if (this.aborted) {
                    this.emitProgress({
                        type: 'aborted',
                        message: 'Tarama kullanıcı tarafından durduruldu'
                    });
                    break;
                }

                const site = sites[i];
                this.emitProgress({
                    type: 'scanning',
                    current: i + 1,
                    total: sites.length,
                    siteName: site.name || site.url,
                    siteUrl: site.url,
                    message: `Taranıyor: ${site.name || site.url}`
                });

                try {
                    let results;
                    if (this.settings.deepCrawl) {
                        results = await this.deepScanSite(site.url, keyword);
                    } else {
                        results = await this.scanSite(site.url, keyword);
                    }
                    allResults.push(...results);

                    this.emitProgress({
                        type: 'site_done',
                        current: i + 1,
                        total: sites.length,
                        siteName: site.name || site.url,
                        resultCount: results.length,
                        totalResults: allResults.length,
                        message: `${site.name || site.url} - ${results.length} sonuç bulundu`
                    });
                } catch (error) {
                    console.error(`Site tarama hatası (${site.url}):`, error.message);
                    this.emitProgress({
                        type: 'site_error',
                        current: i + 1,
                        total: sites.length,
                        siteName: site.name || site.url,
                        error: error.message,
                        message: `Hata: ${site.name || site.url} - ${error.message}`
                    });
                }

                // Siteler arası bekleme
                if (i < sites.length - 1 && !this.aborted) {
                    await sleep(this.settings.delay);
                }
            }
        } finally {
            await this.cleanup();
            this.isRunning = false;
        }

        allResults.sort((a, b) => b.score - a.score);

        this.emitProgress({
            type: 'completed',
            totalResults: allResults.length,
            message: `Tarama tamamlandı! Toplam ${allResults.length} sonuç bulundu.`
        });

        return allResults;
    }

    /**
     * Tek bir siteyi tara (klasik mod — yalnızca verilen URL)
     */
    async scanSite(url, keyword) {
        try {
            await this.driver.get(url);
            await this.driver.wait(until.elementLocated(By.css('body')), 10000);
            await sleep(2000);
            await this.scrollPage();

            const pageSource = await this.driver.getPageSource();
            return Parser.parse(pageSource, keyword, url);
        } catch (error) {
            console.error(`Sayfa yüklenemedi (${url}):`, error.message);
            throw error;
        }
    }

    /**
     * Derin tarama: Ana sayfa + alt sayfaları tara
     * Sayfadaki tüm internal linkleri bulup onları da ziyaret eder
     */
    async deepScanSite(baseUrl, keyword) {
        const allResults = [];
        const visited = new Set();
        const toVisit = [{ url: baseUrl, depth: 0 }];
        const baseDomain = this.extractDomain(baseUrl);
        let pagesScanned = 0;
        const maxPages = this.settings.maxPages || 10;
        const maxDepth = this.settings.crawlDepth || 2;

        while (toVisit.length > 0 && pagesScanned < maxPages && !this.aborted) {
            const { url, depth } = toVisit.shift();

            // URL normalize et ve skip kontrolü
            const normalizedUrl = this.normalizeUrl(url);
            if (visited.has(normalizedUrl)) continue;
            if (!this.isSameDomain(normalizedUrl, baseDomain)) continue;
            if (this.shouldSkipUrl(normalizedUrl)) continue;

            visited.add(normalizedUrl);
            pagesScanned++;

            this.emitProgress({
                type: 'crawling',
                message: `Alt sayfa taranıyor (${pagesScanned}/${maxPages}): ${this.truncateUrl(normalizedUrl, 60)}`,
                pagesScanned,
                maxPages,
                queueSize: toVisit.length
            });

            try {
                await this.driver.get(normalizedUrl);
                await this.driver.wait(until.elementLocated(By.css('body')), 10000);
                await sleep(1500);
                await this.scrollPage();

                const pageSource = await this.driver.getPageSource();

                // Sonuçları ayrıştır
                const results = Parser.parse(pageSource, keyword, normalizedUrl);
                allResults.push(...results);

                // Alt sayfaların linklerini topla (derinlik limiti dahilinde)
                if (depth < maxDepth) {
                    const links = await this.extractInternalLinks(baseDomain);
                    for (const link of links) {
                        const normLink = this.normalizeUrl(link);
                        if (!visited.has(normLink) && !this.shouldSkipUrl(normLink)) {
                            toVisit.push({ url: normLink, depth: depth + 1 });
                        }
                    }
                }

                // Sayfalar arası kısa bekleme
                await sleep(800);
            } catch (err) {
                console.warn(`Alt sayfa yüklenemedi (${normalizedUrl}):`, err.message);
            }
        }

        return allResults;
    }

    /**
     * Sayfadaki tüm internal (aynı domain) linkleri çıkar
     */
    async extractInternalLinks(baseDomain) {
        try {
            const links = await this.driver.executeScript(`
                const anchors = document.querySelectorAll('a[href]');
                const hrefs = [];
                for (const a of anchors) {
                    try {
                        const href = a.href;
                        if (href && href.startsWith('http')) {
                            hrefs.push(href);
                        }
                    } catch(e) {}
                }
                return hrefs;
            `);
            // Sadece aynı domain linkleri döndür
            return [...new Set(links)].filter(link => this.isSameDomain(link, baseDomain));
        } catch (err) {
            console.warn('Link çıkarma hatası:', err.message);
            return [];
        }
    }

    /**
     * URL'den domain çıkar
     */
    extractDomain(url) {
        try { return new URL(url).hostname.replace('www.', ''); } catch { return ''; }
    }

    /**
     * İki URL aynı domain mi kontrol et
     */
    isSameDomain(url, baseDomain) {
        const domain = this.extractDomain(url);
        return domain === baseDomain || domain === 'www.' + baseDomain;
    }

    /**
     * URL'yi normalize et (hash, trailing slash temizle)
     */
    normalizeUrl(url) {
        try {
            const u = new URL(url);
            u.hash = '';
            // Trailing slash sil (root hariç)
            let path = u.pathname;
            if (path.length > 1 && path.endsWith('/')) {
                path = path.slice(0, -1);
            }
            return u.origin + path + u.search;
        } catch { return url; }
    }

    /**
     * Atlanması gereken URL'leri filtrele (resimler, dosyalar, api vs.)
     */
    shouldSkipUrl(url) {
        const skipExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico',
            '.pdf', '.zip', '.rar', '.mp3', '.mp4', '.avi', '.mov',
            '.css', '.js', '.xml', '.json', '.woff', '.woff2', '.ttf', '.eot'];
        const skipPatterns = ['mailto:', 'tel:', 'javascript:', '#', 'data:',
            '/api/', '/wp-json/', '/feed', '/rss', 'login', 'logout',
            'signup', 'register', '/cart', '/checkout'];
        const lower = url.toLowerCase();
        for (const ext of skipExtensions) {
            if (lower.includes(ext)) return true;
        }
        for (const pat of skipPatterns) {
            if (lower.includes(pat)) return true;
        }
        return false;
    }

    /**
     * URL'yi kısalt (UI gösterimi için)
     */
    truncateUrl(url, max) {
        return url.length > max ? url.substring(0, max) + '...' : url;
    }

    /**
     * Sayfayı kademeli olarak aşağı kaydır
     */
    async scrollPage() {
        try {
            const totalHeight = await this.driver.executeScript('return document.body.scrollHeight');
            const viewportHeight = await this.driver.executeScript('return window.innerHeight');
            let scrolled = 0;

            while (scrolled < totalHeight && scrolled < 5000) {
                scrolled += viewportHeight;
                await this.driver.executeScript(`window.scrollTo(0, ${scrolled})`);
                await sleep(500);
            }

            await this.driver.executeScript('window.scrollTo(0, 0)');
        } catch (error) {
            console.warn('Sayfa kaydırma hatası:', error.message);
        }
    }

    emitProgress(progress) {
        if (this.onProgress) {
            this.onProgress(progress);
        }
    }

    abort() {
        this.aborted = true;
    }

    async cleanup() {
        if (this.driver) {
            try {
                await this.driver.quit();
            } catch (error) {
                console.warn('Driver kapatma hatası:', error.message);
            }
            this.driver = null;
        }
    }
}

module.exports = ScanEngine;
