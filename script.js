let translations = {};
let currentLang = localStorage.getItem('lang') || 'pl';
let currentTheme = localStorage.getItem('theme') || 'dark';

// Load translations
async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        translations = await response.json();
        updateLanguage();
    } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback translations if file can't be loaded
        translations = {
            pl: {
                title: "Konwerter Triggerów",
                lightTheme: "Jasny",
                darkTheme: "Ciemny",
                inputLabel: "Wprowadź ciąg(i):",
                inputPlaceholder: "Wklej TriggerServerEvent lub event_name | [payload] tutaj...",
                processBtn: "Przetwórz",
                copyBtn: "Kopiuj",
                clearBtn: "Wyczyść",
                outputLabel: "Wynik:",
                statusSuccess: "✔ Przetworzono %s eventów pomyślnie",
                statusError: "⚠ Przetworzono z %s błędami",
                statusNoInput: "Brak danych wejściowych!",
                statusCopySuccess: "✔ Skopiowano do schowka!",
                statusCopyError: "Brak wyników do skopiowania!",
                statusClear: "✔ Pola wyczyszczone",
                statusProcessingError: "✘ Nieoczekiwany błąd: %s",
                statusInvalidTrigger: "✘ Nieprawidłowy format TriggerServerEvent",
                statusInvalidPayload: "✘ Nieprawidłowy format event_name | [payload]",
                statusPayloadArray: "✘ Payload musi być tablicą",
                statusUnknownFormat: "✘ Nie rozpoznano formatu ciągu",
                instructions: 'Wklej ciągi <code>TriggerServerEvent(...)</code> lub <code>event_name | [payload]</code>.<br>Przykłady:<br>- <code>TriggerServerEvent("esx:test", 123, {time=60, reason="test"})</code><br>- <code>esx:test | [123, {\'time\': 60, \'reason\': \'test\'}]</code><br><br><strong>Obsługiwane formaty:</strong> wieloliniowe bloki, zagnieżdżone tablice, funkcje callback, komentarze',
                copied: "Skopiowano!"
            },
            en: {
                title: "Trigger Converter",
                lightTheme: "Light",
                darkTheme: "Dark",
                inputLabel: "Enter string(s):",
                inputPlaceholder: "Paste TriggerServerEvent or event_name | [payload] here...",
                processBtn: "Process",
                copyBtn: "Copy",
                clearBtn: "Clear",
                outputLabel: "Result:",
                statusSuccess: "✔ Successfully processed %s events",
                statusError: "⚠ Processed with %s errors",
                statusNoInput: "No input data!",
                statusCopySuccess: "✔ Copied to clipboard!",
                statusCopyError: "No results to copy!",
                statusClear: "✔ Fields cleared",
                statusProcessingError: "✘ Unexpected error: %s",
                statusInvalidTrigger: "✘ Invalid TriggerServerEvent format",
                statusInvalidPayload: "✘ Invalid event_name | [payload] format",
                statusPayloadArray: "✘ Payload must be an array",
                statusUnknownFormat: "✘ Unrecognized string format",
                instructions: 'Paste <code>TriggerServerEvent(...)</code> or <code>event_name | [payload]</code> strings.<br>Examples:<br>- <code>TriggerServerEvent("esx:test", 123, {time=60, reason="test"})</code><br>- <code>esx:test | [123, {\'time\': 60, \'reason\': \'test\'}]</code><br><br><strong>Supported formats:</strong> multiline blocks, nested arrays, callback functions, comments',
                copied: "Copied!"
            }
        };
        updateLanguage();
    }
}

function updateLanguage() {
    const langData = translations[currentLang];
    if (!langData) return;
    
    document.getElementById('app-title').textContent = langData.title;
    document.getElementById('header-title').textContent = langData.title;
    
    document.getElementById('theme-text').textContent = currentTheme === 'light' ? langData.darkTheme : langData.lightTheme;
    document.getElementById('input-label').textContent = langData.inputLabel;
    document.getElementById('input-area').placeholder = langData.inputPlaceholder;
    document.getElementById('process-btn-text').textContent = langData.processBtn;
    document.getElementById('copy-btn-text').textContent = langData.copyBtn;
    document.getElementById('clear-btn-text').textContent = langData.clearBtn;
    document.getElementById('output-label').textContent = langData.outputLabel;
    document.getElementById('instructions').innerHTML = langData.instructions;

    document.querySelectorAll('.lang-toggle').forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function updateTheme() {
    const langData = translations[currentLang];
    if (!langData) return;
    
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    body.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'light') {
        themeIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
        `;
        themeText.textContent = langData.darkTheme;
    } else {
        themeIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
            </svg>
        `;
        themeText.textContent = langData.lightTheme;
    }
}

// Enhanced Lua parser with better regex patterns
const LUA_PATTERNS = {
    triggerEvent: /TriggerServerEvent\s*\(\s*["']([^"']+)["']\s*(?:,\s*(.*?))?\s*\)$/gm,
    eventPayload: /^([^|]+)\s*\|\s*(.*)$/gm,
    string: /^["'](.*)["']$/,
    number: /^-?\d+\.?\d*$/,
    boolean: /^(true|false)$/,
    nil: /^nil$/,
    table: /^\{(.*)\}$/s,
    comment: /--.*$/gm,
    multilineString: /\[\[(.*?)\]\]/gs
};

function advancedSplitLua(str, delimiter = ',', maxSplit = -1) {
    if (!str.trim()) return [];
    
    const results = [];
    let current = '';
    let depth = 0;
    let inString = false;
    let stringChar = '';
    let inMultilineString = false;
    let escapeNext = false;
    let splits = 0;

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const nextChar = str[i + 1] || '';

        if (escapeNext) {
            current += char;
            escapeNext = false;
            continue;
        }

        if (char === '\\' && inString) {
            escapeNext = true;
            current += char;
            continue;
        }

        if (char === '[' && nextChar === '[' && !inString) {
            inMultilineString = true;
            current += char;
            continue;
        }

        if (char === ']' && nextChar === ']' && inMultilineString) {
            inMultilineString = false;
            current += char + nextChar;
            i++;
            continue;
        }

        if (inMultilineString) {
            current += char;
            continue;
        }

        if ((char === '"' || char === "'") && !inString) {
            inString = true;
            stringChar = char;
            current += char;
            continue;
        }

        if (char === stringChar && inString) {
            inString = false;
            stringChar = '';
            current += char;
            continue;
        }

        if (inString) {
            current += char;
            continue;
        }

        if (['{', '[', '('].includes(char)) {
            depth++;
        } else if (['}', ']', ')'].includes(char)) {
            depth--;
        }

        if (char === delimiter && depth === 0 && !inString) {
            results.push(current.trim());
            current = '';
            splits++;
            
            if (maxSplit > 0 && splits >= maxSplit) {
                results.push(str.substring(i + 1).trim());
                break;
            }
            continue;
        }

        current += char;
    }

    if (current.trim()) {
        results.push(current.trim());
    }

    return results;
}

function enhancedParseLuaValue(str) {
    if (!str || typeof str !== 'string') return str;
    
    str = str.trim();
    str = str.replace(LUA_PATTERNS.comment, '').trim();
    
    if (!str) return null;

    const multilineMatch = str.match(LUA_PATTERNS.multilineString);
    if (multilineMatch) {
        return { value: multilineMatch[1], type: 'string' };
    }

    if (LUA_PATTERNS.string.test(str)) {
        return { value: str.slice(1, -1), type: 'string' };
    }

    if (LUA_PATTERNS.number.test(str)) {
        return { value: str.includes('.') ? parseFloat(str) : parseInt(str, 10), type: 'number' };
    }

    if (LUA_PATTERNS.boolean.test(str)) {
        return { value: str === 'true', type: 'boolean' };
    }

    if (LUA_PATTERNS.nil.test(str)) {
        return { value: null, type: 'nil' };
    }

    const tableMatch = str.match(LUA_PATTERNS.table);
    if (tableMatch) {
        const inner = tableMatch[1].trim();
        if (!inner) return { value: {}, type: 'object' };

        const parts = advancedSplitLua(inner, ',');
        const hasKeyValuePairs = parts.some(part => 
            part.includes('=') && !part.includes('==') && !part.includes('!=') && !part.includes('<=') && !part.includes('>=')
        );

        if (hasKeyValuePairs) {
            const result = {};
            for (const part of parts) {
                if (!part.includes('=')) continue;
                
                const kvParts = advancedSplitLua(part, '=', 1);
                if (kvParts.length !== 2) continue;

                let key = kvParts[0].trim();
                const value = enhancedParseLuaValue(kvParts[1]);

                if (key.startsWith('[') && key.endsWith(']')) {
                    key = enhancedParseLuaValue(key.slice(1, -1)).value;
                }

                result[key] = value.value;
            }
            return { value: result, type: 'object' };
        } else {
            return { value: parts.map(part => enhancedParseLuaValue(part).value), type: 'array' };
        }
    }

    if (str.includes('(') && str.includes(')')) {
        return { value: `<function_call: ${str}>`, type: 'string' };
    }
    
    // Handle bare variables like 'id'
    return { value: str, type: 'variable' };
}

function enhancedFormatLuaValue(val, type) {
    if (type === 'nil' || val === null || val === undefined) return 'nil';
    
    if (type === 'string' && val.startsWith('<function_call:')) {
        return val.replace('<function_call: ', '').replace('>', '');
    }
    
    if (type === 'string') {
        return `"${val.replace(/"/g, '\\"')}"`;
    }
    
    if (type === 'variable' || type === 'number' || type === 'boolean') {
        return String(val);
    }
    
    if (type === 'array') {
        const items = val.map(v => {
            const parsed = enhancedParseLuaValue(String(v));
            return enhancedFormatLuaValue(parsed.value, parsed.type);
        }).join(', ');
        return `${items}`;
    }
    
    if (type === 'object') {
        const pairs = Object.entries(val).map(([k, v]) => {
            let keyStr;
            if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k) && !k.includes(' ')) {
                keyStr = k;
            } else {
                keyStr = `["${k.replace(/"/g, '\\"')}"]`;
            }
            const parsedValue = enhancedParseLuaValue(String(v));
            return `${keyStr} = ${enhancedFormatLuaValue(parsedValue.value, parsedValue.type)}`;
        }).join(', ');
        return `{${pairs}}`;
    }
    
    return String(val);
}

function triggerToEventPayload(input) {
    try {
        // Extract comment if present
        let comment = '';
        const commentMatch = input.match(/\/\/.*$/);
        if (commentMatch) {
            comment = ' ' + commentMatch[0];
        }
        
        // Clean input but keep original for parsing
        const cleanInput = input.replace(/\/\/.*$/, '').trim();
        
        // Find TriggerServerEvent pattern
        const triggerMatch = cleanInput.match(/TriggerServerEvent\s*\(\s*["']([^"']+)["']\s*(?:,\s*(.*?))?\s*\)$/);
        if (!triggerMatch) {
            return [translations[currentLang].statusInvalidTrigger, true];
        }
        
        const eventName = triggerMatch[1];
        const argsStr = triggerMatch[2]?.trim();
        
        if (!argsStr) {
            return [`${eventName} | []${comment}`, false];
        }
        
        // Split arguments respecting quotes and brackets
        const args = [];
        let current = '';
        let inQuotes = false;
        let depth = 0;
        let quoteChar = '';
        
        for (let i = 0; i < argsStr.length; i++) {
            const char = argsStr[i];
            
            if ((char === '"' || char === "'") && (i === 0 || argsStr[i-1] !== '\\')) {
                if (!inQuotes) {
                    inQuotes = true;
                    quoteChar = char;
                } else if (char === quoteChar) {
                    inQuotes = false;
                    quoteChar = '';
                }
                current += char;
            } else if (!inQuotes && (char === '{' || char === '[' || char === '(')) {
                depth++;
                current += char;
            } else if (!inQuotes && (char === '}' || char === ']' || char === ')')) {
                depth--;
                current += char;
            } else if (!inQuotes && char === ',' && depth === 0) {
                args.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        if (current.trim()) {
            args.push(current.trim());
        }
        
        // Convert args to JSON format
        const jsonArgs = args.map(arg => {
            arg = arg.trim();
            
            // Already quoted string
            if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
                return arg.slice(1, -1); // Remove quotes for JSON
            }
            // Number
            if (/^-?\d+(\.\d+)?$/.test(arg)) {
                return parseFloat(arg);
            }
            // Boolean
            if (arg === 'true') {
                return true;
            }
            if (arg === 'false') {
                return false;
            }
            // Nil
            if (arg === 'nil') {
                return null;
            }
            // Object/Array - keep as string for now
            if (arg.startsWith('{') || arg.startsWith('[')) {
                return arg;
            }
            // Unquoted variable - keep as string
            return arg;
        });
        
        return [`${eventName} | ${JSON.stringify(jsonArgs)}${comment}`, false];
        
    } catch (e) {
        console.error('Error in triggerToEventPayload:', e);
        return [`${translations[currentLang].statusProcessingError.replace('%s', e.message)}`, true];
    }
}

function eventPayloadToTrigger(input) {
    try {
        // Remove comments
        let cleanInput = input.replace(/\/\/.*$/, '').trim();
        
        // Split event name and payload
        const pipeIndex = cleanInput.indexOf('|');
        if (pipeIndex === -1) {
            return [translations[currentLang].statusInvalidPayload, true];
        }
        
        const eventName = cleanInput.substring(0, pipeIndex).trim();
        const payloadStr = cleanInput.substring(pipeIndex + 1).trim();
        
        // Must be array format
        if (!payloadStr.startsWith('[') || !payloadStr.endsWith(']')) {
            return [translations[currentLang].statusPayloadArray, true];
        }
        
        const arrayContent = payloadStr.slice(1, -1).trim();
        
        if (!arrayContent) {
            return [`TriggerServerEvent("${eventName}")`, false];
        }
        
        // Simple split by comma, respecting quotes
        const items = [];
        let current = '';
        let inQuotes = false;
        let depth = 0;
        
        for (let i = 0; i < arrayContent.length; i++) {
            const char = arrayContent[i];
            
            if (char === '"' && (i === 0 || arrayContent[i-1] !== '\\')) {
                inQuotes = !inQuotes;
                current += char;
            } else if (!inQuotes && (char === '{' || char === '[')) {
                depth++;
                current += char;
            } else if (!inQuotes && (char === '}' || char === ']')) {
                depth--;
                current += char;
            } else if (!inQuotes && char === ',' && depth === 0) {
                items.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        if (current.trim()) {
            items.push(current.trim());
        }
        
        // Convert items to Lua format
        const luaItems = items.map(item => {
            item = item.trim();
            
            // Already quoted string - keep as is
            if (item.startsWith('"') && item.endsWith('"')) {
                return item;
            }
            // Number
            if (/^-?\d+(\.\d+)?$/.test(item)) {
                return item;
            }
            // Boolean
            if (item === 'true' || item === 'false') {
                return item;
            }
            // Null
            if (item === 'null') {
                return 'nil';
            }
            // Object/Array
            if (item.startsWith('{') || item.startsWith('[')) {
                return item;
            }
            // Everything else is unquoted variable
            return item;
        });

        return [`TriggerServerEvent("${eventName}", ${luaItems.join(', ')})`, false];
        
    } catch (e) {
        console.error('Error in eventPayloadToTrigger:', e);
        return [`${translations[currentLang].statusProcessingError.replace('%s', e.message)}`, true];
    }
}

async function processInput() {
    const inputArea = document.getElementById('input-area');
    const outputArea = document.getElementById('output-area');
    const processBtn = document.getElementById('process-btn');
    const processSpinner = document.getElementById('process-spinner');
    
    const inputText = inputArea.value.trim();
    
    if (!inputText) {
        showStatus(translations[currentLang].statusNoInput, 'error');
        return;
    }

    processBtn.disabled = true;
    processSpinner.style.display = 'inline-block';
    processBtn.querySelector('span').style.display = 'none';

    if (inputText.length > 10000) {
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    try {
        const lines = inputText.split('\n').filter(line => line.trim());
        let errorCount = 0;
        let outputLines = [];
        let processedEvents = 0;

        for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith('--')) continue;

            let result, isError;
            
            if (trimmedLine.includes('TriggerServerEvent')) {
                [result, isError] = triggerToEventPayload(trimmedLine);
                if (!isError) processedEvents++;
            } else if (trimmedLine.includes('|')) {
                [result, isError] = eventPayloadToTrigger(trimmedLine);
                if (!isError) processedEvents++;
            } else {
                [result, isError] = [`${translations[currentLang].statusUnknownFormat}`, true];
            }
            
            outputLines.push(result);
            if (isError) errorCount++;
        }

        outputArea.value = outputLines.join('\n');

        if (errorCount === 0) {
            showStatus(translations[currentLang].statusSuccess.replace('%s', processedEvents), 'success');
        } else {
            showStatus(translations[currentLang].statusError.replace('%s', errorCount), 'error');
        }

    } catch (e) {
        console.error('Processing error:', e);
        showStatus(`${translations[currentLang].statusProcessingError.replace('%s', e.message)}`, 'error');
    } finally {
        processBtn.disabled = false;
        processSpinner.style.display = 'none';
        processBtn.querySelector('span').style.display = 'inline';
    }
}

function showStatus(message, type) {
    const statusMessage = document.getElementById('status-message');
    statusMessage.textContent = message;
    statusMessage.className = `status ${type} fade-in`;
    statusMessage.style.display = 'block';
    
    if (type !== 'error') {
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, 3000);
    }
}

async function copyToClipboard() {
    const outputArea = document.getElementById('output-area');
    const copyBtn = document.getElementById('copy-btn');
    const outputText = outputArea.value.trim();
    
    if (!outputText) {
        showStatus(translations[currentLang].statusCopyError, 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(outputText);
        showStatus(translations[currentLang].statusCopySuccess, 'success');
        
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span id="copy-btn-text">${translations[currentLang].copied}</span>
        `;
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 1500);
    } catch (err) {
        console.error('Copy error:', err);
        showStatus(`${translations[currentLang].statusProcessingError.replace('%s', err.message)}`, 'error');
    }
}

function clearFields() {
    const inputArea = document.getElementById('input-area');
    const outputArea = document.getElementById('output-area');
    
    inputArea.value = "";
    outputArea.value = "";
    showStatus(translations[currentLang].statusClear, 'info');
}

function autoResize(element) {
    element.style.height = 'auto';
    element.style.height = Math.min(element.scrollHeight, 400) + 'px';
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Load translations first
    loadTranslations();
    
    // Language toggle handlers
    const langTogglePl = document.getElementById('lang-toggle-pl');
    const langToggleEn = document.getElementById('lang-toggle-en');

    langTogglePl.addEventListener('click', () => {
        currentLang = 'pl';
        updateLanguage();
        localStorage.setItem('lang', currentLang);
    });

    langToggleEn.addEventListener('click', () => {
        currentLang = 'en';
        updateLanguage();
        localStorage.setItem('lang', currentLang);
    });

    // Theme toggle handler
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        updateTheme();
        localStorage.setItem('theme', currentTheme);
    });

    // Main button handlers
    const processBtn = document.getElementById('process-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const inputArea = document.getElementById('input-area');

    processBtn.addEventListener('click', processInput);
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', clearFields);

    // Auto-resize textarea
    inputArea.addEventListener('input', () => autoResize(inputArea));
    
    // Initialize theme
    updateTheme();
});