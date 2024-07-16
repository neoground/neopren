import {createContext, h} from '../../node_modules/preact/dist/preact.module.js'
import {useContext, useEffect, useState} from '../../node_modules/preact/hooks/dist/hooks.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'

const html = htm.bind(h)

const LocalizationContext = createContext();

class Translator {
    constructor(language = window.neopren.app_language) {
        this.language = language;
        this.translations = {};
    }

    async loadSection(section) {
        if (this.translations[section]) return this.translations[section];
        const path = window.neopren.baseUrl + '/assets/neopren/locales/' + this.language + '/' + section + '.json';
        try {
            const response = await fetch(path);
            this.translations[section] = await response.json();
            return this.translations[section];
        } catch (error) {
            console.error(`Failed to load ${section} translations:`, error);
            return {};
        }
    }
}

/**
 * Translation Provider
 *
 * Providing translations defined in ../../locales/$lang/$section.json
 */
export function LocalizationProvider({children, language = window.neopren.app_language, sections = []}) {
    const [translator, setTranslator] = useState(new Translator(language));
    const [translations, setTranslations] = useState({});

    useEffect(() => {
        async function loadInitialTranslations() {
            const initialSections = ['main', ...sections]; // Define initial sections to load
            for (let section of initialSections) {
                const sectionTranslations = await translator.loadSection(section);
                setTranslations(prev => ({...prev, ...sectionTranslations}));
            }
        }

        loadInitialTranslations();
    }, [language]);

    const translate = (key) => {
        const [section, path] = key.split(':');
        const pathParts = path.split('.');
        let result = translations;
        for (let part of pathParts) {
            result = result && result[part] !== undefined ? result[part] : key; // Fallback to key
        }
        return result;
    };

    return html`
        <${LocalizationContext.Provider} value=${translate}>
            ${children}
        </EXTERNAL_FRAGMENT>
    `;
}

export function useTranslation() {
    return useContext(LocalizationContext);
}
