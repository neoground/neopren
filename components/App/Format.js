import {h} from '../../node_modules/preact/dist/preact.module.js'
import htm from '../../node_modules/htm/dist/htm.module.js'
import '../../node_modules/dayjs/dayjs.min.js'
import '../../node_modules/dayjs/locale/de.js'

const html = htm.bind(h)

/**
 * Components for formatting texts and stuff
 */
export default class Format {

    static Money = (number, currency = 'EUR') => {
        return new Intl.NumberFormat('de-DE', {style: 'currency', currency: currency}).format(number)
    }

    static CurrencySymbol = (currencyCode = 'EUR') => {
        try {
            // Use Intl.NumberFormat to format a number with the given currency
            const formatter = new Intl.NumberFormat('en', { style: 'currency', currency: currencyCode })

            // Extract the currency symbol from the formatted string
            const parts = formatter.formatToParts(1)
            const symbol = parts.find(part => part.type === 'currency')?.value

            return symbol || null // Return the symbol or null if not found
        } catch (error) {
            return null; // Return null for invalid codes
        }
    }

    static Frequency = freq => {
        // If freq is a number, convert it to a string
        if (typeof freq === 'number') {
            freq = freq.toString()
        }

        // Replace the decimal point with a comma if it exists
        freq = freq.replace('.', ',')

        // Destructure the string into its whole and decimal parts
        const [whole, decimal] = freq.split(',')

        // Format the whole part with periods as thousands separators
        const formattedWhole = parseInt(whole).toLocaleString('de-DE')

        // If there's no decimal part, return just the formatted whole number
        if (!decimal || decimal == 0) {
            return formattedWhole
        }

        // Otherwise, return the formatted whole and decimal parts, separated by a comma
        return `${formattedWhole},${decimal}`
    }

    static Day = (date) => {
        return dayjs(date).locale('de')
    }

    static DayFromTimestamp = (timestamp) => {
        return dayjs.unix(timestamp).locale('de')
    }

    static Today = () => {
        return dayjs().locale('de')
    }

    static Date = (date) => {
        return this.Day(date).format('DD. MMM YY')
    }

    static DateLong = (date) => {
        return this.Day(date).format('DD. MMMM YYYY')
    }

    static DateShort = (date) => {
        return this.Day(date).format('D. MMM')
    }

    static Time = (date) => {
        return this.Day(date).format('HH:mm')
    }

    static DateTime = (date) => {
        return this.Day(date).format('DD. MMM YYYY HH:mm')
    }

    static DateTimeShort = (date) => {
        return this.Day(date).format('DD.MM.YY HH:mm')
    }

    static DateDiff = (date) => {
        if (this.Today().diff(date, 'day') < 366) {
            let months = this.Today().diff(date, 'month')
            let days = this.Today().diff(date.add(months, 'month'), 'day')

            return months + 'm, ' + days + 'd'
        }

        let years = this.Today().diff(date, 'year')
        date = date.add(years, 'year')

        let months = this.Today().diff(date, 'month')
        date = date.add(months, 'month')

        let day = this.Today().diff(date, 'day')

        return years + 'y, ' + months + 'm, ' + day + 'd'
    }

    static DateForHumans = (date, output = 'full') => {
        // Get date + today but ignore time for comparison
        date = this.Day(date)
            .set('hour', 0)
            .set('minute', 0)
            .set('second', 0)
        let now = this.Today()
            .set('hour', 0)
            .set('minute', 0)
            .set('second', 0)
        let isFuture = true

        let strings = {
            today: 'Heute',
            tomorrow: 'Morgen',
            yesterday: 'Gestern',
            tomorrow2: 'Übermorgen',
            yesterday2: 'Vorgestern',
            days: 'Tagen',
            in: 'in',
            ago: 'vor',
            weeks: 'Wochen'
        }
        if (output == 'short') {
            strings = {
                ...strings,
                days: 'Tg.',
                weeks: 'Wo.'
            }
        }

        if (date.isSame(now, 'day')) {
            return strings.today
        }

        let daydiff = date.diff(now, 'day', true)
        daydiff = Math.ceil(daydiff)

        if (daydiff < 0) {
            isFuture = false
            daydiff *= -1
        }

        if (daydiff == 1) {
            return isFuture ? strings.tomorrow : strings.yesterday
        }
        if (daydiff == 2) {
            return isFuture ? strings.tomorrow2 : strings.yesterday2
        }

        if (daydiff < 14) {
            return isFuture ? strings.in + ' ' + daydiff + ' ' + strings.days : strings.ago + ' ' + daydiff + ' ' + strings.days
        }

        let weekdiff = date.diff(now, 'week')
        if (weekdiff < 0) {
            weekdiff *= -1
        }

        if (daydiff < 60) {
            return isFuture ? strings.in + ' ' + weekdiff + ' ' + strings.weeks : strings.ago + ' ' + weekdiff + ' ' + strings.weeks
        }

        return this.Date(date)
    }

    static Stars = (props, state, context) => {
        // Rating must be number 0-10 -> 0-5 stars
        let rating = parseInt(props.rating)

        let full_stars = 0
        let empty_stars = 0
        let half_stars = 0

        let stars = []
        switch (rating) {
            case 1:
                stars = ['half', 'empty', 'empty', 'empty', 'empty']
                break
            case 2:
                stars = ['full', 'empty', 'empty', 'empty', 'empty']
                empty_stars = 4
                break
            case 3:
                stars = ['full', 'half', 'empty', 'empty', 'empty']
                break
            case 4:
                stars = ['full', 'full', 'empty', 'empty', 'empty']
                break
            case 5:
                stars = ['full', 'full', 'half', 'empty', 'empty']
                break
            case 6:
                stars = ['full', 'full', 'full', 'empty', 'empty']
                break
            case 7:
                stars = ['full', 'full', 'full', 'half', 'empty']
                break
            case 8:
                stars = ['full', 'full', 'full', 'full', 'empty']
                break
            case 9:
                stars = ['full', 'full', 'full', 'full', 'half']
                break
            case 10:
                stars = ['full', 'full', 'full', 'full', 'full']
                break
        }

        let fontSize = "2rem"
        if (props.fontsize) {
            fontSize = props.fontsize
        }

        return html`
            <span class="text-center">
                ${Object.values(stars).map(star => html`
                    ${star === 'empty' && html`<span class="material-symbols-outlined opacity-25 me-1 d-inline"
                                                     style=${"font-size: " + fontSize}>star</span>`}
                    ${star === 'half' && html`<span class="material-symbols-outlined me-1 d-inline"
                                                    style=${"font-size: " + fontSize}>star_half</span>`}
                    ${star === 'full' && html`<span class="material-symbols-outlined me-1 d-inline"
                                                    style=${"font-size: " + fontSize}>star</span>`}
                `)}
            </span>
        `
    }

    static MarkdownToHtml = (content) => {
        if (typeof content == 'undefined' || content == null) {
            // Empty content
            return ''
        }

        let html = marked.parse(content)

        // HTML adjustments for neopren UI
        let replacements = {
            '<h1': '<h1 class="h1"',
            '<h2': '<h2 class="h2"',
            '<h3': '<h3 class="h3"',
            '<h4': '<h4 class="h4"',
            '<h5': '<h5 class="h5"',
            '<h6': '<h6 class="h6"',
            '<table': '<table class="table table-striped"',
            '<hr': '<hr class="mt-2 mb-3"',
            '<img': '<img class="img-fluid"',
            '(?)': '<span class="material-symbols-outlined mx-1">help_outline</span>',
            '(X)': '<span class="material-symbols-outlined mx-1">disabled_by_default</span>',
            '(x)': '<span class="material-symbols-outlined mx-1">disabled_by_default</span>',
            '(V)': '<span class="material-symbols-outlined mx-1">check_box</span>',
            '(v)': '<span class="material-symbols-outlined mx-1">check_box</span>',
            '(+)': '<span class="material-symbols-outlined mx-1">add_box</span>',
            '-- ': '— ',
            '<pre>': '<pre class="line-numbers">',
            '<code>': '<code class="language-shell">',
            '--&gt;': '<span class="material-symbols-outlined mx-1">east</span>',
            '&lt;--': '<span class="material-symbols-outlined mx-1">west</span>'
        }
        for (const [search, replace] of Object.entries(replacements)) {
            html = html.replaceAll(search, replace)
        }

        html = this.addIdsToHeadings(html)

        return html
    }

    static addIdsToHeadings = htmlStr => {
        // Use DOMParser to parse the HTML string
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlStr, 'text/html')

        // Select all heading elements (h1, h2, h3, etc.)
        const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')

        // Iterate through each heading and set the id attribute
        headings.forEach(heading => {
            // Generate an ID based on the heading's content
            const id = this.Slugify(heading.textContent)

            // Set the id attribute
            heading.id = id
        })

        // Serialize the document back to a string
        // The outerHTML of the body element will include all your changes
        return doc.body.innerHTML
    }

    static Slugify = text => {
        // Slugify a text - this is based on C::Formatter()->slugify().
        text = text.trim()

        // Lowercase
        text = text.toLowerCase()

        // Replace umlaute etc.
        // Character map (partial for demonstration fill in as needed)
        const charMap = {
            // Latin
            'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE', 'Ç': 'C',
            'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
            'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ő': 'O',
            'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U', 'Ű': 'U', 'Ý': 'Y', 'Þ': 'TH',
            'ß': 'ss',
            'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c',
            'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
            'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ő': 'o',
            'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ű': 'u', 'ý': 'y', 'þ': 'th',
            'ÿ': 'y',
            // Latin symbols
            '©': '(c)',
            // Greek
            'Α': 'A', 'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'H', 'Θ': '8',
            'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': '3', 'Ο': 'O', 'Π': 'P',
            'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'X', 'Ψ': 'PS', 'Ω': 'W',
            'Ά': 'A', 'Έ': 'E', 'Ί': 'I', 'Ό': 'O', 'Ύ': 'Y', 'Ή': 'H', 'Ώ': 'W', 'Ϊ': 'I',
            'Ϋ': 'Y',
            'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'h', 'θ': '8',
            'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': '3', 'ο': 'o', 'π': 'p',
            'ρ': 'r', 'σ': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'x', 'ψ': 'ps', 'ω': 'w',
            'ά': 'a', 'έ': 'e', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ή': 'h', 'ώ': 'w', 'ς': 's',
            'ϊ': 'i', 'ΰ': 'y', 'ϋ': 'y', 'ΐ': 'i',
            // Russian
            'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
            'З': 'Z', 'И': 'I', 'Й': 'J', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
            'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C',
            'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sh', 'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu',
            'Я': 'Ya',
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
            'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
            'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
            'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
            'я': 'ya',
            // Ukrainian
            'Є': 'Ye', 'І': 'I', 'Ї': 'Yi', 'Ґ': 'G',
            'є': 'ye', 'і': 'i', 'ї': 'yi', 'ґ': 'g',
            // Czech
            'Č': 'C', 'Ď': 'D', 'Ě': 'E', 'Ň': 'N', 'Ř': 'R', 'Š': 'S', 'Ť': 'T', 'Ů': 'U',
            'Ž': 'Z',
            'č': 'c', 'ď': 'd', 'ě': 'e', 'ň': 'n', 'ř': 'r', 'š': 's', 'ť': 't', 'ů': 'u',
            'ž': 'z',
            // Polish
            'Ą': 'A', 'Ć': 'C', 'Ę': 'e', 'Ł': 'L', 'Ń': 'N', 'Ś': 'S', 'Ź': 'Z',
            'Ż': 'Z',
            'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ś': 's', 'ź': 'z',
            'ż': 'z',
            // Latvian
            'Ā': 'A', 'Ē': 'E', 'Ģ': 'G', 'Ī': 'i', 'Ķ': 'k', 'Ļ': 'L', 'Ņ': 'N', 'Ū': 'u',
            'ā': 'a', 'ē': 'e', 'ģ': 'g', 'ī': 'i', 'ķ': 'k', 'ļ': 'l', 'ņ': 'n',
            'ū': 'u'
        }

        // Iterate over the character map and replace characters
        Object.keys(charMap).forEach(char => {
            const regex = new RegExp(char, 'g')
            text = text.replace(regex, charMap[char])
        })

        // Replace non letter or digits by "-"
        text = text.replace(/[^a-z0-9]+/gi, '-')

        // Transliterate if possible (here, we approximate transliteration by removing diacritics)
        text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

        // Remove unwanted characters
        text = text.replace(/[^-\w]+/g, '')

        // Trim "-"
        text = text.replace(/^[-_]+|[-_]+$/g, '')

        // Remove duplicate "-"
        text = text.replace(/-+/g, '-')

        // Lowercase again (optional if you want to ensure lowercase after other replacements)
        return text.toLowerCase()
    }

    static NumberForDisplay = (num) => {
        let base = 1
        let suffix = ''

        if (num >= 1e9) {
            base = 1e9
            suffix = 'B'
        } else if (num >= 1e6) {
            base = 1e6
            suffix = 'M'
        } else if (num >= 1e3) {
            base = 1e3
            suffix = 'K'
        }

        if (base > 1) {
            return (num / base).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    .replace('.00', '')
                + suffix
        }

        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    static SecondsToDuration(duration) {
        const hours = Math.floor(duration / 3600)
        duration %= 3600
        const minutes = Math.floor(duration / 60)
        const seconds = duration % 60

        const formatTwoDigits = (number) => String(number).padStart(2, '0')

        let durationString = `${formatTwoDigits(minutes)}:${formatTwoDigits(seconds)}`
        if (hours) {
            durationString = `${formatTwoDigits(hours)}:${durationString}`
        }
        return durationString
    }

    /**
     * Replace line breaks with <br />, like PHP's "nl2br" does
     *
     * @param {string} str Input text
     * @param {boolean} replaceMode Use replace instead of insert
     * @return {string} Filtered text
     */
    static nl2br = (str, replaceMode) => {
        let breakTag = '<br />'
        let replaceStr = (replaceMode) ? '$1' + breakTag : '$1' + breakTag + '$2'
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr)
    }

    /**
     * Format bytes to B / KB / MB / GB / ...
     *
     * @return string
     * @param bytes input bytes
     * @param precision precision of return value
     */
    static Bytes = (bytes, precision = 0) => {
        const size = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const factor = Math.floor((bytes.toString().length - 1) / 3);
        return `${(bytes / Math.pow(1024, factor)).toFixed(precision)} ${size[factor]}`;
    }

    static Domain = url => {
        try {
            // Create a URL object
            const parsedUrl = new URL(url);
            // Get the hostname (e.g., www.google.co.uk)
            return parsedUrl.hostname;
        } catch (error) {
            return url; // Return input for invalid URLs
        }
    }

}