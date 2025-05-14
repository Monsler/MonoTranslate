// ==UserScript==
// @name         MonoTranslate
// @namespace    http://github.com/Monsler
// @version      2025-05-14
// @description  Быстрый перевод страниц
// @author       Monsler
// @match        *://*/*
// @icon         https://github.com/Monsler/MonoTranslate/blob/main/ic.png?raw=true
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let current = window.location.href;
    let translateBtn;
    let mutationTimeout;

    function removeElements() {
        document.querySelectorAll('.tr-stripe__main-row').forEach(el => el.remove());
    }

    function addLogoButton() {
        if (document.getElementById('translateLogo')) return;
        if (location.href.includes('translated.turbopages.org')) return;

        const btn = document.createElement('img');
        btn.id = 'translateLogo';
        btn.src = 'https://github.com/Monsler/MonoTranslate/blob/main/icon.png?raw=true';
        btn.alt = 'Перевести';
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: '9999',
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            borderRadius: '50%',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)'
        });
        btn.addEventListener('click', () => {
            const current = window.location.href;
            const urlPart = current.replace(/^https?:\/\//, '');
            history.replaceState(null, '', current);
            window.location.href = 'https://translated.turbopages.org/proxy_u/en-ru.ru/' + urlPart;
        });

        document.body.appendChild(btn);
    }

    function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }

    function addTranslateSelectionButton() {
        const sel = document.getSelection();
        const text = sel.toString().trim();

        if (!text) {
            if (translateBtn) {
                translateBtn.remove();
                translateBtn = null;
            }
            return;
        }

        let range = sel.getRangeAt(0);
        let rect = range.getBoundingClientRect();

        let top = rect.top + window.scrollY + 40;
        let left = rect.left + window.scrollX + 110;
        if (rect.width > window.innerWidth) {
            left = window.scrollX + window.innerWidth / 2 - 75;
        }
        top = clamp(top, window.scrollY + 10, window.scrollY + window.innerHeight - 50);
        left = clamp(left, window.scrollX + 10, window.scrollX + window.innerWidth - 150);

        if (!translateBtn) {
            translateBtn = document.createElement('button');
            translateBtn.textContent = 'Перевести выделенное';
            Object.assign(translateBtn.style, {
                position: 'absolute',
                zIndex: '9999',
                padding: '10px 15px',
                fontSize: '14px',
                cursor: 'pointer',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'background-color 0.3s'
            });
            translateBtn.addEventListener('click', () => {
                let encoded = encodeURIComponent(text);
                window.location.href = `https://translate.yandex.ru/?source_lang=en&target_lang=ru&text=${encoded}`;
            });
            document.body.appendChild(translateBtn);
        }

        translateBtn.style.top = `${top}px`;
        translateBtn.style.left = `${left}px`;
    }

    const observer = new MutationObserver(() => {
        clearTimeout(mutationTimeout);
        mutationTimeout = setTimeout(() => {
            addLogoButton();
            removeElements();
            history.replaceState(null, '', current);
        }, 200);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mouseup', addTranslateSelectionButton);
    document.addEventListener('click', () => {
        if (document.getSelection().toString().trim() === '' && translateBtn) {
            translateBtn.remove();
            translateBtn = null;
        }
    });

    addLogoButton();
    removeElements();
})();
