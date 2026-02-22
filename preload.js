/**
 * WebScan - Preload Script
 * Main Process ile Renderer arasında güvenli köprü
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // ===== Tarama İşlemleri =====
    scan: (keyword) => ipcRenderer.invoke('scan:start', keyword),
    stopScan: () => ipcRenderer.invoke('scan:stop'),
    onScanProgress: (callback) => {
        ipcRenderer.on('scan:progress', (_event, data) => callback(data));
    },

    // ===== Site İşlemleri =====
    addSite: (site) => ipcRenderer.invoke('sites:add', site),
    removeSite: (id) => ipcRenderer.invoke('sites:remove', id),
    getSites: () => ipcRenderer.invoke('sites:list'),

    // ===== Geçmiş İşlemleri =====
    getHistory: () => ipcRenderer.invoke('history:get'),
    getRecentResults: () => ipcRenderer.invoke('results:recent'),

    // ===== Favori İşlemleri =====
    addFavorite: (fav) => ipcRenderer.invoke('favorites:add', fav),
    removeFavorite: (id) => ipcRenderer.invoke('favorites:remove', id),
    getFavorites: () => ipcRenderer.invoke('favorites:list'),

    // ===== Ayarlar =====
    getSettings: () => ipcRenderer.invoke('settings:get'),
    saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),

    // ===== Harici Link =====
    openExternal: (url) => ipcRenderer.invoke('open:external', url)
});
