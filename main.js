/**
 * WebScan - Electron Ana İşlem (Main Process)
 */

const { app, BrowserWindow, ipcMain, shell, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const Database = require('./src/database/db');
const ScanEngine = require('./src/scraper/engine');

let mainWindow;
let db;
let scanEngine;

// ==================== PENCERE OLUŞTURMA ====================

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 820,
        minWidth: 900,
        minHeight: 600,
        backgroundColor: '#0a0e1a',
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#0a0e1a',
            symbolColor: '#8b5cf6',
            height: 36
        },
        icon: path.join(__dirname, 'Uygulamaİkon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'src', 'renderer', 'index.html'));

    // Development modunda DevTools aç
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// ==================== TEK ÖRNEK KİLİDİ ====================

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    // Zaten bir örnek çalışıyor, bu örneği kapat
    app.quit();
} else {
    // İkinci bir örnek açılmaya çalışıldığında mevcut pencereyi öne getir
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    // ==================== UYGULAMA YAŞAM DÖNGÜSÜ ====================

    app.whenReady().then(() => {
        // Veritabanı dizinini ayarla (Paketlenmiş uygulamada userData'yı kullan)
        const dataDir = app.isPackaged
            ? path.join(app.getPath('userData'), 'data')
            : path.join(__dirname, 'data');

        // Klasör yoksa oluştur
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        db = new Database(dataDir);

        // Tarama motorunu oluştur
        scanEngine = new ScanEngine();

        // Pencereyi oluştur
        createWindow();

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    });
}

app.on('window-all-closed', async () => {
    // Tarama motorunu temizle
    if (scanEngine) {
        await scanEngine.cleanup();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// ==================== IPC HANDLER'LARI ====================

// ----- Tarama İşlemleri -----

ipcMain.handle('scan:start', async (_event, keyword) => {
    if (!keyword || keyword.trim().length === 0) {
        throw new Error('Anahtar kelime boş olamaz!');
    }

    const sites = await db.getSites();
    if (sites.length === 0) {
        throw new Error('Taranacak site eklenmemiş! Önce sol panelden site ekleyin.');
    }

    // Ayarları yükle ve motora uygula
    const savedSettings = await db.getSettings();
    if (savedSettings) {
        Object.assign(scanEngine.settings, savedSettings);
    }

    // Tarama kaydı oluştur
    const scan = await db.createScan({
        keyword: keyword.trim(),
        siteCount: sites.length
    });

    // İlerleme callback'i ayarla
    scanEngine.onProgress = (progress) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('scan:progress', progress);
        }
    };

    try {
        // Taramayı başlat
        const results = await scanEngine.scan(sites, keyword.trim());

        // Sonuçları veritabanına kaydet
        if (results.length > 0) {
            await db.saveResults(results);
        }

        // Tarama kaydını güncelle
        await db.updateScan(scan._id, {
            resultCount: results.length,
            status: 'completed',
            completedAt: new Date().toISOString()
        });

        // Masaüstü bildirimi gönder
        if (Notification.isSupported()) {
            new Notification({
                title: 'WebScan - Tarama Tamamlandı!',
                body: `"${keyword.trim()}" için ${results.length} sonuç bulundu.`,
                icon: null
            }).show();
        }

        return results;
    } catch (error) {
        // Hata durumunda tarama kaydını güncelle
        await db.updateScan(scan._id, {
            status: 'error',
            error: error.message,
            completedAt: new Date().toISOString()
        });

        // Hata bildirimi
        if (Notification.isSupported()) {
            new Notification({
                title: 'WebScan - Tarama Hatası',
                body: `Hata: ${error.message}`,
                icon: null
            }).show();
        }

        throw error;
    }
});

ipcMain.handle('scan:stop', async () => {
    if (scanEngine) {
        scanEngine.abort();
    }
    return true;
});

// ----- Site İşlemleri -----

ipcMain.handle('sites:add', async (_event, site) => {
    return await db.addSite(site);
});

ipcMain.handle('sites:remove', async (_event, id) => {
    return await db.removeSite(id);
});

ipcMain.handle('sites:list', async () => {
    return await db.getSites();
});

// ----- Geçmiş İşlemleri -----

ipcMain.handle('history:get', async () => {
    return await db.getScanHistory();
});

ipcMain.handle('results:recent', async () => {
    return await db.getRecentResults();
});

// ----- Favori İşlemleri -----

ipcMain.handle('favorites:add', async (_event, fav) => {
    return await db.addFavorite(fav);
});

ipcMain.handle('favorites:remove', async (_event, id) => {
    return await db.removeFavorite(id);
});

ipcMain.handle('favorites:list', async () => {
    return await db.getFavorites();
});

// ----- Ayarlar -----

ipcMain.handle('settings:get', async () => {
    return await db.getSettings();
});

ipcMain.handle('settings:save', async (_event, settings) => {
    return await db.saveSettings(settings);
});

// ----- Harici Link -----

ipcMain.handle('open:external', async (_event, url) => {
    await shell.openExternal(url);
});
