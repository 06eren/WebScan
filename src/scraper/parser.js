/**
 * WebScan - Sonuç Ayrıştırıcı (Parser)
 * Sayfadan anahtar kelimeye göre sonuçları çıkarır
 */

class Parser {
    /**
     * Sayfa kaynağından sonuçları ayrıştır
     * @param {string} pageSource - Sayfanın HTML kaynağı
     * @param {string} keyword - Aranacak anahtar kelime
     * @param {string} siteUrl - Kaynak site URL'si
     * @returns {Array} Bulunan sonuçlar
     */
    static parse(pageSource, keyword, siteUrl) {
        const results = [];
        const keywordLower = keyword.toLowerCase();
        const keywordWords = keywordLower.split(/\s+/);

        // <a> etiketlerini bul
        const linkRegex = /<a\s[^>]*href=["']([^"'#][^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
        let match;

        while ((match = linkRegex.exec(pageSource)) !== null) {
            const href = match[1];
            const innerHtml = match[2];
            const innerText = Parser.stripHtml(innerHtml).trim();

            // Boş veya çok kısa linkleri atla
            if (!innerText || innerText.length < 3) continue;

            // Anahtar kelime kontrolü
            const textLower = innerText.toLowerCase();
            const hrefLower = href.toLowerCase();

            const matchesText = keywordWords.some(w => textLower.includes(w));
            const matchesHref = keywordWords.some(w => hrefLower.includes(w));

            if (!matchesText && !matchesHref) continue;

            // URL'yi tam yap
            const fullUrl = Parser.resolveUrl(href, siteUrl);
            if (!fullUrl) continue;

            // Skor hesapla
            const score = Parser.calculateScore(innerText, href, keyword);

            // Snippet oluştur
            const snippet = Parser.extractSnippet(pageSource, match.index, keyword);

            results.push({
                title: Parser.cleanText(innerText),
                link: fullUrl,
                snippet: snippet,
                source: siteUrl,
                keyword: keyword,
                score: score
            });
        }

        // Tekrarlananları kaldır ve skora göre sırala
        const unique = Parser.removeDuplicates(results);
        return unique.sort((a, b) => b.score - a.score);
    }

    /**
     * HTML etiketlerini temizle
     * @param {string} html 
     * @returns {string}
     */
    static stripHtml(html) {
        return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }

    /**
     * Metni temizle
     * @param {string} text 
     * @returns {string}
     */
    static cleanText(text) {
        return text
            .replace(/[\r\n\t]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 200);
    }

    /**
     * Göreceli URL'yi tam URL'ye çevir
     * @param {string} href 
     * @param {string} baseUrl 
     * @returns {string|null}
     */
    static resolveUrl(href, baseUrl) {
        try {
            // javascript: ve mailto: linklerini atla
            if (href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return null;
            }
            const resolved = new URL(href, baseUrl);
            return resolved.href;
        } catch {
            return null;
        }
    }

    /**
     * Anahtar kelime eşleşme skoru hesapla
     * @param {string} title 
     * @param {string} href 
     * @param {string} keyword 
     * @returns {number} 0-100 arası skor
     */
    static calculateScore(title, href, keyword) {
        let score = 0;
        const keywordLower = keyword.toLowerCase();
        const titleLower = title.toLowerCase();
        const hrefLower = href.toLowerCase();
        const words = keywordLower.split(/\s+/);

        // Başlıkta tam eşleşme (en yüksek puan)
        if (titleLower.includes(keywordLower)) {
            score += 50;
        }

        // Başlıkta kelime bazlı eşleşme
        words.forEach(word => {
            if (titleLower.includes(word)) score += 15;
        });

        // URL'de eşleşme
        if (hrefLower.includes(keywordLower)) {
            score += 20;
        }
        words.forEach(word => {
            if (hrefLower.includes(word)) score += 5;
        });

        // Başlık uzunluğuna göre bonus (çok kısa değilse)
        if (title.length > 10 && title.length < 150) {
            score += 10;
        }

        return Math.min(score, 100);
    }

    /**
     * Bağlamdan snippet oluştur
     * @param {string} pageSource 
     * @param {number} matchIndex 
     * @param {string} keyword 
     * @returns {string}
     */
    static extractSnippet(pageSource, matchIndex, keyword) {
        // Link etrafındaki metni al
        const start = Math.max(0, matchIndex - 200);
        const end = Math.min(pageSource.length, matchIndex + 400);
        let context = pageSource.substring(start, end);

        // HTML etiketlerini temizle
        context = Parser.stripHtml(context);

        // Anahtar kelime etrafındaki bölümü bul
        const keywordIndex = context.toLowerCase().indexOf(keyword.toLowerCase());
        if (keywordIndex !== -1) {
            const snippetStart = Math.max(0, keywordIndex - 50);
            const snippetEnd = Math.min(context.length, keywordIndex + keyword.length + 100);
            return '...' + context.substring(snippetStart, snippetEnd).trim() + '...';
        }

        // Kelime bulunamadıysa ilk 150 karakteri döndür
        return context.substring(0, 150).trim() + '...';
    }

    /**
     * Tekrarlanan sonuçları kaldır (URL bazlı)
     * @param {Array} results 
     * @returns {Array}
     */
    static removeDuplicates(results) {
        const seen = new Set();
        return results.filter(r => {
            // URL'nin normalize edilmiş halini kullan
            const normalizedUrl = r.link.replace(/\/+$/, '').toLowerCase();
            if (seen.has(normalizedUrl)) return false;
            seen.add(normalizedUrl);
            return true;
        });
    }
}

module.exports = Parser;
