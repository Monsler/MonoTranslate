// ==UserScript==
// @name         MonoTranslate
// @namespace    http://github.com/Monsler
// @version      2025-05-13
// @description  Быстрый перевод страниц
// @author       Monsler
// @match        *://*/*
// @icon         https://github.com/Monsler/MonoTranslate/blob/main/ic.png?raw=true
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let current = '';
    let translateBtn;

    function removeElements() {
        const elements = document.querySelectorAll('.tr-stripe__main-row');
        elements.forEach(el => el.remove());
    }

    function addLogoButton() {
        if (document.getElementById('translateLogo')) { return; }
        if (!document.location.href.includes('https://translated.turbopages.org')) {
            const btn = document.createElement('img');
            btn.id = 'translateLogo';
            btn.src = 'https://github.com/Monsler/MonoTranslate/blob/main/icon.png?raw=true';
            btn.alt = 'Перевести';
            btn.style.position = 'fixed';
            btn.style.bottom = '20px';
            btn.style.right = '20px';
            btn.style.zIndex = '9999';
            btn.style.width = '60px'; // Размер иконки (можно менять)
            btn.style.height = '60px';
            btn.style.cursor = 'pointer';
            btn.style.borderRadius = '50%'; // Круглая кнопка
            btn.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';

            // По клику — действие
            btn.addEventListener('click', () => {
                current = window.location.href;
                let currentURL = current.replace('https://', '');
                let newURL = 'https://translated.turbopages.org/proxy_u/en-ru.ru/' + currentURL;
                window.location.href = newURL;
                const elements = document.querySelectorAll('.tr-stripe__main-row');
                elements.forEach(el => el.remove());
                history.pushState(null, '', current);
            });

            document.body.appendChild(btn);
        }
    }

    function addTranslateSelectionButton() {
        if (document.getSelection().toString().trim() === '') {
            if (translateBtn) {
                translateBtn.remove();
                translateBtn = null;
            }
            return;
        }

        if (!translateBtn) {
            translateBtn = document.createElement('button');
            translateBtn.textContent = 'Перевести выделенное';
            translateBtn.style.position = 'absolute';
            translateBtn.style.zIndex = '9999';
            translateBtn.style.top = `${window.getSelection().getRangeAt(0).getBoundingClientRect().top + window.scrollY + 40}px`;
            translateBtn.style.left = `${window.getSelection().getRangeAt(0).getBoundingClientRect().left + window.scrollX + 120}px`;
            translateBtn.style.padding = '10px 15px';
            translateBtn.style.fontSize = '14px';
            translateBtn.style.cursor = 'pointer';
            translateBtn.style.backgroundColor = '#000000';
            translateBtn.style.color = 'white';
            translateBtn.style.border = 'none';
            translateBtn.style.borderRadius = '5px';
            translateBtn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            translateBtn.style.transition = 'background-color 0.3s';
            translateBtn.addEventListener('click', () => {
                let selectedText = document.getSelection().toString();
                let encodedText = encodeURIComponent(selectedText);
                let newURL = 'https://translate.yandex.ru/?source_lang=en&target_lang=ru&text='+ encodedText;
                window.location.href = newURL;
            });

            document.body.appendChild(translateBtn);
        }
    }

    // Обработчик события для выделения текста
    document.addEventListener('mouseup', () => {
        addTranslateSelectionButton();
    });

    // Отслеживание изменений на странице
    const observer = new MutationObserver(() => {
        addLogoButton();
        removeElements();
        history.pushState(null, '', current);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    addLogoButton();
})();
