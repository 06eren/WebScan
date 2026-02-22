/**
 * WebScan - NeDB Veritabanı Modülü
 */

const Datastore = require('nedb-promises');
const path = require('path');

class Database {
    constructor(dataDir) {
        this.dataDir = dataDir;

        // Koleksiyonları oluştur
        this.sites = Datastore.create({
            filename: path.join(dataDir, 'sites.db'),
            autoload: true
        });

        this.results = Datastore.create({
            filename: path.join(dataDir, 'results.db'),
            autoload: true
        });

        this.scans = Datastore.create({
            filename: path.join(dataDir, 'scans.db'),
            autoload: true
        });

        this.favorites = Datastore.create({
            filename: path.join(dataDir, 'favorites.db'),
            autoload: true
        });

        this.settings = Datastore.create({
            filename: path.join(dataDir, 'settings.db'),
            autoload: true
        });

        // Index oluştur
        this.sites.ensureIndex({ fieldName: 'url', unique: true });
        this.results.ensureIndex({ fieldName: 'link' });
        this.scans.ensureIndex({ fieldName: 'startedAt' });
        this.favorites.ensureIndex({ fieldName: 'link', unique: true });
    }

    // ==================== SITE İŞLEMLERİ ====================

    /**
     * Yeni site ekle
     * @param {Object} site - { url, name, category }
     * @returns {Promise<Object>}
     */
    async addSite(site) {
        const doc = {
            url: site.url,
            name: site.name || '',
            category: site.category || 'genel',
            addedAt: new Date().toISOString()
        };
        return await this.sites.insert(doc);
    }

    /**
     * Site sil
     * @param {string} id 
     * @returns {Promise<number>}
     */
    async removeSite(id) {
        return await this.sites.remove({ _id: id });
    }

    /**
     * Tüm siteleri getir
     * @returns {Promise<Array>}
     */
    async getSites() {
        return await this.sites.find({}).sort({ addedAt: -1 });
    }

    // ==================== SONUÇ İŞLEMLERİ ====================

    /**
     * Tarama sonuçlarını kaydet
     * @param {Array} results - Sonuç dizisi
     * @returns {Promise<Array>}
     */
    async saveResults(results) {
        const docs = results.map(r => ({
            ...r,
            foundAt: new Date().toISOString()
        }));
        return await this.results.insert(docs);
    }

    /**
     * Anahtar kelimeye göre sonuçları getir
     * @param {string} keyword 
     * @param {number} limit 
     * @returns {Promise<Array>}
     */
    async getResultsByKeyword(keyword, limit = 100) {
        return await this.results
            .find({ keyword: new RegExp(keyword, 'i') })
            .sort({ score: -1, foundAt: -1 })
            .limit(limit);
    }

    /**
     * Son sonuçları getir
     * @param {number} limit 
     * @returns {Promise<Array>}
     */
    async getRecentResults(limit = 50) {
        return await this.results
            .find({})
            .sort({ foundAt: -1 })
            .limit(limit);
    }

    // ==================== TARAMA GEÇMİŞİ ====================

    /**
     * Tarama kaydı oluştur
     * @param {Object} scan - { keyword, siteCount }
     * @returns {Promise<Object>}
     */
    async createScan(scan) {
        const doc = {
            keyword: scan.keyword,
            siteCount: scan.siteCount,
            resultCount: 0,
            status: 'running',
            startedAt: new Date().toISOString(),
            completedAt: null
        };
        return await this.scans.insert(doc);
    }

    /**
     * Tarama kaydını güncelle
     * @param {string} id 
     * @param {Object} update 
     * @returns {Promise<number>}
     */
    async updateScan(id, update) {
        return await this.scans.update({ _id: id }, { $set: update });
    }

    /**
     * Tarama geçmişini getir
     * @param {number} limit 
     * @returns {Promise<Array>}
     */
    async getScanHistory(limit = 20) {
        return await this.scans
            .find({})
            .sort({ startedAt: -1 })
            .limit(limit);
    }

    // ==================== FAVORİ İŞLEMLERİ ====================

    async addFavorite(fav) {
        const doc = {
            title: fav.title,
            link: fav.link,
            snippet: fav.snippet || '',
            score: fav.score || 0,
            source: fav.source || '',
            addedAt: new Date().toISOString()
        };
        return await this.favorites.insert(doc);
    }

    async removeFavorite(id) {
        return await this.favorites.remove({ _id: id });
    }

    async getFavorites() {
        return await this.favorites.find({}).sort({ addedAt: -1 });
    }

    // ==================== AYAR İŞLEMLERİ ====================

    async getSettings() {
        const doc = await this.settings.findOne({ _type: 'appSettings' });
        return doc || {};
    }

    async saveSettings(settings) {
        const existing = await this.settings.findOne({ _type: 'appSettings' });
        if (existing) {
            await this.settings.update({ _type: 'appSettings' }, { $set: settings });
        } else {
            await this.settings.insert({ _type: 'appSettings', ...settings });
        }
        return settings;
    }
}

module.exports = Database;
