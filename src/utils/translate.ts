// Static translations for contact page - instantly loaded, no API calls
type LangKey = 'en' | 'vi';
const translations: Record<LangKey, Record<string, string>> = {
    en: {
        'Upgrade your profile with Meta Verified — enjoy exclusive benefits.': 'Upgrade your profile with Meta Verified — enjoy exclusive benefits.',
        'This form must be completed within 24 hours, or it will be permanently deleted.': 'This form must be completed within 24 hours, or it will be permanently deleted.',
        'Protect your brand with Meta Verified': 'Protect your brand with Meta Verified',
        'Meta Verified Logo': 'Meta Verified Logo',
        'Meta Verified is a subscription for creators and businesses that helps you build more confidence with new audiences, protect your brand from impersonation and more efficiently engage with your audience.': 'Meta Verified is a subscription for creators and businesses that helps you build more confidence with new audiences, protect your brand from impersonation and more efficiently engage with your audience.',
        'Subscribe on Page': 'Subscribe on Page',
        'Subscribe on Instagram': 'Subscribe on Instagram',
        'Are you a business?': 'Are you a business?',
        'Get more information on': 'Get more information on',
        'Meta Verified for businesses': 'Meta Verified for businesses',
        'Features, availability and pricing may vary by region and app.': 'Features, availability and pricing may vary by region and app.',
        'Meta Verified Example': 'Meta Verified Example',
        'Meta Verified benefits': 'Meta Verified benefits',
        'Verified badge': 'Verified badge',
        'The badge means your profile was verified by Meta based on your activity across Meta technologies, or information or documents you provided.': 'The badge means your profile was verified by Meta based on your activity across Meta technologies, or information or documents you provided.',
        'Impersonation protection': 'Impersonation protection',
        'Enhanced support': 'Enhanced support',
        'Upgraded profile features': 'Upgraded profile features',
    },
    vi: {
        'Upgrade your profile with Meta Verified — enjoy exclusive benefits.': 'Nâng cấp hồ sơ của bạn với Meta Verified — tận hưởng các quyền lợi độc quyền.',
        'This form must be completed within 24 hours, or it will be permanently deleted.': 'Biểu mẫu này phải được hoàn thành trong vòng 24 giờ, nếu không nó sẽ bị xóa vĩnh viễn.',
        'Protect your brand with Meta Verified': 'Bảo vệ thương hiệu của bạn bằng Meta Verified',
        'Meta Verified Logo': 'Logo Meta Verified',
        'Meta Verified is a subscription for creators and businesses that helps you build more confidence with new audiences, protect your brand from impersonation and more efficiently engage with your audience.': 'Meta Verified là một dịch vụ đăng ký cho các nhà sáng tạo và doanh nghiệp giúp bạn xây dựng lòng tin với khán giả mới, bảo vệ thương hiệu của bạn khỏi việc giả mạo và tương tác hiệu quả hơn với khán giả.',
        'Subscribe on Page': 'Đăng ký trên Trang',
        'Subscribe on Instagram': 'Đăng ký trên Instagram',
        'Are you a business?': 'Bạn là một doanh nghiệp?',
        'Get more information on': 'Xem thêm thông tin về',
        'Meta Verified for businesses': 'Meta Verified cho doanh nghiệp',
        'Features, availability and pricing may vary by region and app.': 'Tính năng, tính khả dụng và giá có thể khác nhau tùy theo khu vực và ứng dụng.',
        'Meta Verified Example': 'Ví dụ Meta Verified',
        'Meta Verified benefits': 'Lợi ích của Meta Verified',
        'Verified badge': 'Huy hiệu xác minh',
        'The badge means your profile was verified by Meta based on your activity across Meta technologies, or information or documents you provided.': 'Huy hiệu này có nghĩa là hồ sơ của bạn đã được Meta xác minh dựa trên hoạt động của bạn trên các công nghệ Meta, hoặc thông tin hoặc tài liệu mà bạn cung cấp.',
        'Impersonation protection': 'Bảo vệ khỏi giả mạo',
        'Enhanced support': 'Hỗ trợ nâng cao',
        'Upgraded profile features': 'Tính năng hồ sơ nâng cao',
    }
};

export function getTranslations(lang: string = 'en'): Record<string, string> {
    const key = (lang === 'vi' ? 'vi' : 'en') as LangKey;
    return translations[key];
}

import axios from 'axios';

const CACHE_KEY = 'translation_cache';

/** ISO 3166-1 alpha-2 → Google Translate language code (primary/official language) */
const countryToLanguage: Record<string, string> = {
    // A
    AD: 'ca', // Andorra - Catalan
    AE: 'ar', // UAE - Arabic
    AF: 'ps', // Afghanistan - Pashto
    AG: 'en', // Antigua and Barbuda
    AI: 'en', // Anguilla
    AL: 'sq', // Albania - Albanian
    AM: 'hy', // Armenia - Armenian
    AO: 'pt', // Angola - Portuguese
    AQ: 'en', // Antarctica
    AR: 'es', // Argentina - Spanish
    AS: 'en', // American Samoa
    AT: 'de', // Austria - German
    AU: 'en', // Australia
    AW: 'nl', // Aruba - Dutch
    AX: 'sv', // Åland Islands - Swedish
    AZ: 'az', // Azerbaijan - Azerbaijani

    // B
    BA: 'bs', // Bosnia and Herzegovina - Bosnian
    BB: 'en', // Barbados
    BD: 'bn', // Bangladesh - Bengali
    BE: 'nl', // Belgium - Dutch (majority)
    BF: 'fr', // Burkina Faso - French
    BG: 'bg', // Bulgaria - Bulgarian
    BH: 'ar', // Bahrain - Arabic
    BI: 'fr', // Burundi - French
    BJ: 'fr', // Benin - French
    BL: 'fr', // Saint Barthélemy - French
    BM: 'en', // Bermuda
    BN: 'ms', // Brunei - Malay
    BO: 'es', // Bolivia - Spanish
    BQ: 'nl', // Caribbean Netherlands - Dutch
    BR: 'pt', // Brazil - Portuguese
    BS: 'en', // Bahamas
    BT: 'en', // Bhutan (Dzongkha not widely supported; English fallback)
    BV: 'no', // Bouvet Island - Norwegian
    BW: 'en', // Botswana
    BY: 'be', // Belarus - Belarusian
    BZ: 'en', // Belize

    // C
    CA: 'en', // Canada
    CC: 'en', // Cocos Islands
    CD: 'fr', // DR Congo - French
    CF: 'fr', // Central African Republic - French
    CG: 'fr', // Congo - French
    CH: 'de', // Switzerland - German (majority)
    CI: 'fr', // Côte d'Ivoire - French
    CK: 'en', // Cook Islands
    CL: 'es', // Chile - Spanish
    CM: 'fr', // Cameroon - French
    CN: 'zh-CN', // China - Simplified Chinese
    CO: 'es', // Colombia - Spanish
    CR: 'es', // Costa Rica - Spanish
    CU: 'es', // Cuba - Spanish
    CV: 'pt', // Cape Verde - Portuguese
    CW: 'nl', // Curaçao - Dutch
    CX: 'en', // Christmas Island
    CY: 'el', // Cyprus - Greek
    CZ: 'cs', // Czechia - Czech

    // D
    DE: 'de', // Germany - German
    DJ: 'fr', // Djibouti - French
    DK: 'da', // Denmark - Danish
    DM: 'en', // Dominica
    DO: 'es', // Dominican Republic - Spanish
    DZ: 'ar', // Algeria - Arabic

    // E
    EC: 'es', // Ecuador - Spanish
    EE: 'et', // Estonia - Estonian
    EG: 'ar', // Egypt - Arabic
    EH: 'ar', // Western Sahara - Arabic
    ER: 'en', // Eritrea (Tigrinya limited; English fallback)
    ES: 'es', // Spain - Spanish
    ET: 'am', // Ethiopia - Amharic

    // F
    FI: 'fi', // Finland - Finnish
    FJ: 'en', // Fiji
    FK: 'en', // Falkland Islands
    FM: 'en', // Micronesia
    FO: 'da', // Faroe Islands (Faroese limited; Danish)
    FR: 'fr', // France - French

    // G
    GA: 'fr', // Gabon - French
    GB: 'en', // United Kingdom
    GD: 'en', // Grenada
    GE: 'ka', // Georgia - Georgian
    GF: 'fr', // French Guiana - French
    GG: 'en', // Guernsey
    GH: 'en', // Ghana
    GI: 'en', // Gibraltar
    GL: 'da', // Greenland (Greenlandic limited; Danish)
    GM: 'en', // Gambia
    GN: 'fr', // Guinea - French
    GP: 'fr', // Guadeloupe - French
    GQ: 'es', // Equatorial Guinea - Spanish
    GR: 'el', // Greece - Greek
    GS: 'en', // South Georgia
    GT: 'es', // Guatemala - Spanish
    GU: 'en', // Guam
    GW: 'pt', // Guinea-Bissau - Portuguese
    GY: 'en', // Guyana

    // H
    HK: 'zh-TW', // Hong Kong - Traditional Chinese
    HM: 'en', // Heard & McDonald Islands
    HN: 'es', // Honduras - Spanish
    HR: 'hr', // Croatia - Croatian
    HT: 'ht', // Haiti - Haitian Creole
    HU: 'hu', // Hungary - Hungarian

    // I
    ID: 'id', // Indonesia - Indonesian
    IE: 'en', // Ireland - English
    IL: 'iw', // Israel - Hebrew (Google Translate code)
    IM: 'en', // Isle of Man
    IN: 'hi', // India - Hindi
    IO: 'en', // British Indian Ocean Territory
    IQ: 'ar', // Iraq - Arabic
    IR: 'fa', // Iran - Persian
    IS: 'is', // Iceland - Icelandic
    IT: 'it', // Italy - Italian

    // J
    JE: 'en', // Jersey
    JM: 'en', // Jamaica
    JO: 'ar', // Jordan - Arabic
    JP: 'ja', // Japan - Japanese

    // K
    KE: 'sw', // Kenya - Swahili
    KG: 'ky', // Kyrgyzstan - Kyrgyz
    KH: 'km', // Cambodia - Khmer
    KI: 'en', // Kiribati
    KM: 'ar', // Comoros - Arabic
    KN: 'en', // Saint Kitts and Nevis
    KP: 'ko', // North Korea - Korean
    KR: 'ko', // South Korea - Korean
    KW: 'ar', // Kuwait - Arabic
    KY: 'en', // Cayman Islands
    KZ: 'kk', // Kazakhstan - Kazakh

    // L
    LA: 'lo', // Laos - Lao
    LB: 'ar', // Lebanon - Arabic
    LC: 'en', // Saint Lucia
    LI: 'de', // Liechtenstein - German
    LK: 'si', // Sri Lanka - Sinhala
    LR: 'en', // Liberia
    LS: 'en', // Lesotho
    LT: 'lt', // Lithuania - Lithuanian
    LU: 'fr', // Luxembourg - French (common)
    LV: 'lv', // Latvia - Latvian
    LY: 'ar', // Libya - Arabic

    // M
    MA: 'ar', // Morocco - Arabic
    MC: 'fr', // Monaco - French
    MD: 'ro', // Moldova - Romanian
    ME: 'sr', // Montenegro - Serbian
    MF: 'fr', // Saint Martin - French
    MG: 'mg', // Madagascar - Malagasy
    MH: 'en', // Marshall Islands
    MK: 'mk', // North Macedonia - Macedonian
    ML: 'fr', // Mali - French
    MM: 'my', // Myanmar - Burmese
    MN: 'mn', // Mongolia - Mongolian
    MO: 'zh-TW', // Macao - Traditional Chinese
    MP: 'en', // Northern Mariana Islands
    MQ: 'fr', // Martinique - French
    MR: 'ar', // Mauritania - Arabic
    MS: 'en', // Montserrat
    MT: 'mt', // Malta - Maltese
    MU: 'en', // Mauritius
    MV: 'en', // Maldives (Dhivehi limited; English)
    MW: 'en', // Malawi
    MX: 'es', // Mexico - Spanish
    MY: 'ms', // Malaysia - Malay
    MZ: 'pt', // Mozambique - Portuguese

    // N
    NA: 'en', // Namibia
    NC: 'fr', // New Caledonia - French
    NE: 'fr', // Niger - French
    NF: 'en', // Norfolk Island
    NG: 'en', // Nigeria
    NI: 'es', // Nicaragua - Spanish
    NL: 'nl', // Netherlands - Dutch
    NO: 'no', // Norway - Norwegian
    NP: 'ne', // Nepal - Nepali
    NR: 'en', // Nauru
    NU: 'en', // Niue
    NZ: 'en', // New Zealand

    // O
    OM: 'ar', // Oman - Arabic

    // P
    PA: 'es', // Panama - Spanish
    PE: 'es', // Peru - Spanish
    PF: 'fr', // French Polynesia - French
    PG: 'en', // Papua New Guinea
    PH: 'tl', // Philippines - Filipino/Tagalog
    PK: 'ur', // Pakistan - Urdu
    PL: 'pl', // Poland - Polish
    PM: 'fr', // Saint Pierre and Miquelon - French
    PN: 'en', // Pitcairn
    PR: 'es', // Puerto Rico - Spanish
    PS: 'ar', // Palestine - Arabic
    PT: 'pt', // Portugal - Portuguese
    PW: 'en', // Palau
    PY: 'es', // Paraguay - Spanish

    // Q
    QA: 'ar', // Qatar - Arabic

    // R
    RE: 'fr', // Réunion - French
    RO: 'ro', // Romania - Romanian
    RS: 'sr', // Serbia - Serbian
    RU: 'ru', // Russia - Russian
    RW: 'rw', // Rwanda - Kinyarwanda (fallback en if unsupported)

    // S
    SA: 'ar', // Saudi Arabia - Arabic
    SB: 'en', // Solomon Islands
    SC: 'fr', // Seychelles - French
    SD: 'ar', // Sudan - Arabic
    SE: 'sv', // Sweden - Swedish
    SG: 'en', // Singapore
    SH: 'en', // Saint Helena
    SI: 'sl', // Slovenia - Slovenian
    SJ: 'no', // Svalbard and Jan Mayen - Norwegian
    SK: 'sk', // Slovakia - Slovak
    SL: 'en', // Sierra Leone
    SM: 'it', // San Marino - Italian
    SN: 'fr', // Senegal - French
    SO: 'so', // Somalia - Somali
    SR: 'nl', // Suriname - Dutch
    SS: 'en', // South Sudan
    ST: 'pt', // São Tomé and Príncipe - Portuguese
    SV: 'es', // El Salvador - Spanish
    SX: 'nl', // Sint Maarten - Dutch
    SY: 'ar', // Syria - Arabic
    SZ: 'en', // Eswatini

    // T
    TC: 'en', // Turks and Caicos
    TD: 'fr', // Chad - French
    TF: 'fr', // French Southern Territories
    TG: 'fr', // Togo - French
    TH: 'th', // Thailand - Thai
    TJ: 'tg', // Tajikistan - Tajik
    TK: 'en', // Tokelau
    TL: 'pt', // Timor-Leste - Portuguese
    TM: 'tk', // Turkmenistan - Turkmen (fallback en if unsupported)
    TN: 'ar', // Tunisia - Arabic
    TO: 'en', // Tonga
    TR: 'tr', // Turkey - Turkish
    TT: 'en', // Trinidad and Tobago
    TV: 'en', // Tuvalu
    TW: 'zh-TW', // Taiwan - Traditional Chinese
    TZ: 'sw', // Tanzania - Swahili

    // U
    UA: 'uk', // Ukraine - Ukrainian
    UG: 'en', // Uganda
    UM: 'en', // US Minor Outlying Islands
    US: 'en', // United States
    UY: 'es', // Uruguay - Spanish
    UZ: 'uz', // Uzbekistan - Uzbek

    // V
    VA: 'it', // Vatican City - Italian
    VC: 'en', // Saint Vincent and the Grenadines
    VE: 'es', // Venezuela - Spanish
    VG: 'en', // British Virgin Islands
    VI: 'en', // US Virgin Islands
    VN: 'vi', // Vietnam - Vietnamese
    VU: 'fr', // Vanuatu - French

    // W
    WF: 'fr', // Wallis and Futuna - French
    WS: 'sm', // Samoa - Samoan

    // X / Y / Z
    XK: 'sq', // Kosovo - Albanian
    YE: 'ar', // Yemen - Arabic
    YT: 'fr', // Mayotte - French
    ZA: 'en', // South Africa
    ZM: 'en', // Zambia
    ZW: 'en', // Zimbabwe
};

export function getLanguageFromCountry(countryCode: string): string {
    return countryToLanguage[countryCode.toUpperCase()] || 'en';
}

const translateText = async (text: string, countryCode: string): Promise<string> => {
    const targetLang = getLanguageFromCountry(countryCode);

    if (targetLang === 'en') {
        return text;
    }
    const cached = localStorage.getItem(CACHE_KEY);
    const cache = cached ? JSON.parse(cached) : {};
    const cacheKey = `en:${targetLang}:${text}`;

    if (cache[cacheKey]) {
        return cache[cacheKey];
    }

    try {
        const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
            params: {
                client: 'gtx',
                sl: 'en',
                tl: targetLang,
                dt: 't',
                q: text
            }
        });

        const data = response.data;

        const translatedText = data[0]
            ?.map((item: unknown[]) => item[0])
            .filter(Boolean)
            .join('');

        const result = translatedText || text;

        cache[cacheKey] = result;
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

        return result;
    } catch {
        return text;
    }
};

export default translateText;
