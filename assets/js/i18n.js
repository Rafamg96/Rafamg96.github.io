class I18n {
    constructor() {
        this.translations = {};
        this.currentLang = localStorage.getItem('language') || 'en';
        this.isPostPage = window.location.pathname.includes('/posts/');
    }

    async init() {
        await this.loadTranslations('en');
        await this.loadTranslations('es');
        this.updateLanguage(this.currentLang);
        this.addLanguageSwitcher();
    }

    async loadTranslations(lang) {
        try {
            const basePath = this.isPostPage ? '../../assets/i18n/' : 'assets/i18n/';
            const response = await fetch(`${basePath}${lang}.json`);
            this.translations[lang] = await response.json();
        } catch (error) {
            console.error(`Failed to load ${lang} translations:`, error);
        }
    }

    addLanguageSwitcher() {
        const nav = document.querySelector('.nav-links');
        const switcher = document.createElement('li');
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <button id="langButton">${this.currentLang.toUpperCase()}</button>
        `;
        nav.appendChild(switcher);

        document.getElementById('langButton').addEventListener('click', () => {
            this.toggleLanguage();
        });
    }

    toggleLanguage() {
        const newLang = this.currentLang === 'en' ? 'es' : 'en';
        this.updateLanguage(newLang);
        document.getElementById('langButton').textContent = newLang.toUpperCase();
        
        if (this.isPostPage) {
            this.switchPostLanguage(newLang);
        } else {
            this.updatePostLinks(newLang);
        }
    }

    switchPostLanguage(lang) {
        const currentPath = window.location.pathname;
        const postPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        const newPath = `${postPath}/${lang}.html`;
        window.location.href = newPath;
    }

    updatePostLinks(lang) {
        const postLinks = document.querySelectorAll('.read-more');
        postLinks.forEach(link => {
            const href = link.getAttribute('href');
            const postPath = href.substring(0, href.lastIndexOf('/'));
            link.setAttribute('href', `${postPath}/${lang}.html`);
        });
    }

    updateLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.updateContent();
    }

    updateContent() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Handle placeholder translations
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getTranslation(key);
            element.placeholder = translation;
        });
    }

    getTranslation(key) {
        return key.split('.').reduce((obj, k) => obj && obj[k], this.translations[this.currentLang]) || key;
    }
}

// Initialize translations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const i18n = new I18n();
    i18n.init();
});