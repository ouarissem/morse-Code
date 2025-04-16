// قاموس شفرة مورس للحروف العربية والأرقام العالمية فقط
const arabicToMorse = {
    'ا': '.-',     'ب': '-...',   'ت': '-',      'ث': '-.-.',
    'ج': '.---',   'ح': '....',   'خ': '--.-',   'د': '-..',
    'ذ': '--..',   'ر': '.-.',    'ز': '---',    'س': '...',
    'ش': '----',   'ص': '-.-.',   'ض': '...-',   'ط': '..-',
    'ظ': '-.-..',  'ع': '.-.-',   'غ': '--.',    'ف': '..-.',
    'ق': '--.-',   'ك': '-.-',    'ل': '.-..',   'م': '--',
    'ن': '-.',     'ه': '..-..',  'و': '.--',    'ي': '..',
    'ء': '.',      'ئ': '..-',    'ة': '-.--',   'ى': '--..--',
    '0': '-----',  '1': '.----',  '2': '..---',  '3': '...--',
    '4': '....-',  '5': '.....',  '6': '-....',  '7': '--...',
    '8': '---..',  '9': '----.',  ' ': '/',      '\n': '\n'
};

// إنشاء قاموس عكسي (مورس إلى عربي)
const morseToArabic = {};
for (const [key, value] of Object.entries(arabicToMorse)) {
    morseToArabic[value] = key;
}

// إنشاء جدول الحروف والأرقام العالمية فقط
function createMorseChart() {
    const chartElement = document.getElementById('chart');
    chartElement.innerHTML = '';
    
    // ترتيب الحروف العربية
    const arabicLetters = ['ا','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي','ء','ئ','ة','ى'];
    
    // إضافة الحروف العربية
    arabicLetters.forEach(char => {
        if (arabicToMorse[char]) {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${char}</strong><br>${arabicToMorse[char]}`;
            chartElement.appendChild(div);
        }
    });
    
    // إضافة الأرقام العالمية فقط
    for (let i = 0; i <= 9; i++) {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${i}</strong><br>${arabicToMorse[i.toString()]}`;
        chartElement.appendChild(div);
    }
}

// تحديد نوع النص المدخل (مورس أو عربي أو أرقام)
function detectInputType(text) {
    if (text.trim() === '') return 'empty';
    
    // تحقق إذا كان النص يحتوي على حروف عربية
    const arabicRegex = /[\u0600-\u06FF]/;
    if (arabicRegex.test(text)) {
        return 'arabic';
    }
    
    // تحقق إذا كان النص يحتوي على شفرة مورس صالحة
    const morseChars = text.replace(/[^\s\.\-\/]/g, '');
    if (morseChars.length > 0 && isValidMorse(text)) {
        return 'morse';
    }
    
    // تحقق إذا كان النص يحتوي على أرقام عالمية فقط
    const englishNumbersRegex = /^[0-9\s]+$/;
    if (englishNumbersRegex.test(text.replace(/ /g, ''))) {
        return 'numbers';
    }
    
    return 'unknown';
}

// التحقق من صحة شفرة مورس
function isValidMorse(text) {
    if (text.trim() === '') return true;
    
    const validMorseChars = new Set(['.', '-', ' ', '/', '\n']);
    const morseChars = text.split('');
    
    for (const char of morseChars) {
        if (!validMorseChars.has(char)) {
            return false;
        }
    }
    
    return true;
}

// التحويل التلقائي حسب نوع المدخلات
function autoConvert() {
    const inputText = document.getElementById('inputText').value;
    const outputTextElement = document.getElementById('outputText');
    const errorElement = document.getElementById('errorMessage');
    const inputTypeLabel = document.getElementById('inputTypeLabel');
    const outputTypeLabel = document.getElementById('outputTypeLabel');
    
    errorElement.style.display = 'none';
    
    const inputType = detectInputType(inputText);
    
    if (inputType === 'empty') {
        outputTextElement.value = '';
        inputTypeLabel.textContent = 'كتابة عربية';
        outputTypeLabel.textContent = 'شفرة مورس';
        return;
    }
    
    if (inputType === 'arabic') {
        inputTypeLabel.textContent = 'كتابة عربية';
        outputTypeLabel.textContent = 'شفرة مورس';
        convertToMorse();
    } 
    else if (inputType === 'morse') {
        inputTypeLabel.textContent = 'شفرة مورس';
        outputTypeLabel.textContent = 'كتابة عربية';
        convertToArabic();
    }
    else if (inputType === 'numbers') {
        inputTypeLabel.textContent = 'أرقام';
        outputTypeLabel.textContent = 'شفرة مورس';
        convertNumbersToMorse();
    }
    else {
        errorElement.textContent = 'النص المدخل غير معروف! يرجى إدخال نص عربي أو شفرة مورس صحيحة أو أرقام';
        errorElement.style.display = 'block';
        outputTextElement.value = '';
    }
}

// تحويل النص العربي إلى مورس
function convertToMorse() {
    const inputText = document.getElementById('inputText').value;
    let output = '';
    
    for (const char of inputText) {
        const lowerChar = char.toLowerCase();
        if (arabicToMorse.hasOwnProperty(lowerChar)) {
            output += arabicToMorse[lowerChar] + ' ';
        } else if (arabicToMorse.hasOwnProperty(char)) {
            output += arabicToMorse[char] + ' ';
        } else {
            output += char;
        }
    }
    
    document.getElementById('outputText').value = output.trim();
}

// تحويل الأرقام إلى شفرة مورس
function convertNumbersToMorse() {
    const inputText = document.getElementById('inputText').value;
    let output = '';
    
    for (const char of inputText) {
        if (char >= '0' && char <= '9') {
            output += arabicToMorse[char] + ' ';
        } else if (char === ' ') {
            output += '/ ';
        } else {
            output += char;
        }
    }
    
    document.getElementById('outputText').value = output.trim();
}

// تحويل شفرة مورس إلى عربي
function convertToArabic() {
    const inputText = document.getElementById('inputText').value.trim();
    const outputTextElement = document.getElementById('outputText');
    const errorElement = document.getElementById('errorMessage');
    
    if (!isValidMorse(inputText)) {
        errorElement.textContent = 'تحذير: النص يحتوي على رموز غير صالحة لشفرة مورس!';
        errorElement.style.display = 'block';
        outputTextElement.value = '';
        return;
    }
    
    errorElement.style.display = 'none';
    
    const morseWords = inputText.split(' / ');
    let arabicText = '';
    
    for (const morseWord of morseWords) {
        const morseChars = morseWord.split(' ');
        for (const morseChar of morseChars) {
            if (morseToArabic.hasOwnProperty(morseChar)) {
                arabicText += morseToArabic[morseChar];
            } else if (morseChar === '') {
                arabicText += ' ';
            }
        }
        arabicText += ' ';
    }
    
    outputTextElement.value = arabicText.trim();
}

// تبديل النص بين المربعين
function swapText() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    
    const temp = inputText.value;
    inputText.value = outputText.value;
    outputText.value = temp;
    
    autoConvert();
}

// تشغيل الصوت لشفرة مورس
function playMorseSound() {
    let morseCode = '';
    const inputType = detectInputType(document.getElementById('inputText').value);
    
    if (inputType === 'arabic' || inputType === 'numbers') {
        morseCode = document.getElementById('outputText').value;
    } 
    else if (inputType === 'morse') {
        morseCode = document.getElementById('inputText').value;
    }
    else {
        document.getElementById('errorMessage').textContent = 'لا يوجد شفرة مورس لتشغيلها';
        document.getElementById('errorMessage').style.display = 'block';
        return;
    }
    
    if (!morseCode) return;
    
    if (!isValidMorse(morseCode)) {
        document.getElementById('errorMessage').textContent = 'لا يمكن تشغيل شفرة مورس غير صالحة';
        document.getElementById('errorMessage').style.display = 'block';
        return;
    }
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const dotDuration = 0.1;
    const dashDuration = dotDuration * 3;
    const spaceDuration = dotDuration * 7;
    
    let time = audioContext.currentTime;
    
    for (const symbol of morseCode) {
        switch (symbol) {
            case '.':
                playBeep(audioContext, time, dotDuration, 600);
                time += dotDuration;
                break;
            case '-':
                playBeep(audioContext, time, dashDuration, 600);
                time += dashDuration;
                break;
            case ' ':
                time += dotDuration * 3;
                break;
            case '/':
                time += spaceDuration;
                break;
        }
        
        time += dotDuration;
    }
}

function playBeep(audioContext, startTime, duration, frequency) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(1, startTime + 0.001);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

// نسخ الناتج
function copyOutput() {
    const outputText = document.getElementById('outputText');
    outputText.select();
    document.execCommand('copy');
    
    const copyBtn = document.getElementById('copyBtn');
    const originalIcon = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
        copyBtn.innerHTML = originalIcon;
    }, 2000);
}

// مسح النص
function clearText(elementId) {
    document.getElementById(elementId).value = '';
    if (elementId === 'inputText') {
        document.getElementById('outputText').value = '';
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('inputTypeLabel').textContent = 'كتابة عربية';
        document.getElementById('outputTypeLabel').textContent = 'شفرة مورس';
    }
}

// تبديل وضع الليل/النهار
function setupThemeSwitcher() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // تحقق من التفضيل المحفوظ
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        updateThemeButton();
    }
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const currentTheme = body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
        localStorage.setItem('theme', currentTheme);
        updateThemeButton();
    });
    
    function updateThemeButton() {
        const isDark = body.classList.contains('dark-mode');
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');
        
        if (isDark) {
            icon.classList.replace('fa-moon', 'fa-sun');
            text.textContent = 'وضع النهار';
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            text.textContent = 'وضع الليل';
        }
    }
}

// تهيئة الأحداث
document.addEventListener('DOMContentLoaded', () => {
    createMorseChart();
    setupThemeSwitcher();
    
    document.getElementById('inputText').addEventListener('input', autoConvert);
    document.getElementById('swapBtn').addEventListener('click', swapText);
    document.getElementById('playBtn').addEventListener('click', playMorseSound);
    document.getElementById('copyBtn').addEventListener('click', copyOutput);
    document.getElementById('clearInput').addEventListener('click', () => clearText('inputText'));
    document.getElementById('clearOutput').addEventListener('click', () => clearText('outputText'));
    
    // إضافة تأثير عند النقر على الأزرار
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 500);
        });
    });
});