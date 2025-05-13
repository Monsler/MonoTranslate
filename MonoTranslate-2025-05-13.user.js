// ==UserScript==
// @name         MonoTranslate
// @namespace    http://github.com/Monsler
// @version      2025-05-13
// @description  Быстрый перевод страниц
// @author       Monsler
// @match        *://*/*
// @icon         https://github.com/Monsler/MonoTranslate/blob/main/3253af41-d65b-4566-bc8d-d1be6338cd54_removalai_preview(1).png?raw=true
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addLogoButton() {
        if (document.getElementById('translateLogo')) return;

        const btn = document.createElement('img');
        btn.id = 'translateLogo';
        btn.src = 'https://github.com/Monsler/MonoTranslate/blob/main/3253af41-d65b-4566-bc8d-d1be6338cd54_removalai_preview.png?raw=true';
        btn.alt = 'Перевести';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '9999';
        btn.style.width = '60px';     // Размер иконки (можно менять)
        btn.style.height = '60px';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '50%';  // Круглая кнопка
        btn.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';

        // По клику — действие
        btn.addEventListener('click', () => {
            alert('Button clicked!');
        });

        document.body.appendChild(btn);
    }

    const observer = new MutationObserver(() => {
        addLogoButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Первый запуск
    addLogoButton();
})();
