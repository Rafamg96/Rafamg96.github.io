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
        const existingSwitcher = document.querySelector('.language-switcher');
        if (existingSwitcher) {
            // If switcher already exists in HTML, just add event listeners
            const langButtons = document.querySelectorAll('.lang-btn');
            langButtons.forEach(btn => {
                if (btn.getAttribute('data-lang') === this.currentLang) {
                    btn.classList.add('active');
                }
                btn.addEventListener('click', () => {
                    const lang = btn.getAttribute('data-lang');
                    this.updateLanguage(lang);
                    this.updateActiveButton(lang);
                    
                    if (this.isPostPage) {
                        this.switchPostLanguage(lang);
                    } else {
                        this.updatePostLinks(lang);
                    }
                });
            });
            return;
        }

        // Fallback: create switcher if not in HTML
        const nav = document.querySelector('.nav-links');
        const switcher = document.createElement('li');
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <button class="lang-btn" data-lang="es" title="Español">🇪🇸 ES</button>
            <button class="lang-btn" data-lang="en" title="English">🇬🇧 EN</button>
        `;
        nav.appendChild(switcher);
        
        this.addLanguageSwitcher();
    }

    updateActiveButton(lang) {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
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