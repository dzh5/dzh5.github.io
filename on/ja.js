(function() {
    'use strict';

    const PLUGIN_NAME = 'jaja';
    const CORS_PROXY = 'https://cors.eu.org/';
    const MENU_ITEM_ID = 'jaja-plugin-menu-item';
class JajaCore {
    constructor(data) {
        this.activity = data.activity;
        this.html = $('<div class="jaja-container"></div>');
        console.log('[Jaja] Activity created');
    }

    // Обязательные методы для компонента Lampa
    start() {
        console.log('[Jaja] Component started');
        Lampa.Controller.toggle('content');
        this.loadContent();
    }

    pause() {}

    stop() {}

    destroy() {
        this.html.remove();
    }

    create() {
        console.log('[Jaja] Creating component');
        return this.html;
    }

    async loadContent() {
        try {
            const data = await this.fetchData('https://jable.tv/latest-updates/');
            this.displayContent(data);
        } catch (error) {
            Lampa.Noty.show('Ошибка загрузки контента');
            console.error('[Jaja] Error:', error);
        }
    }

    async fetchData(url) {
        const response = await fetch(`https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(url)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36'
            }
        });
        return await response.text();
    }

    displayContent(data) {
        // Обработка и отображение данных
        this.html.html('<h2>Загруженный контент:</h2>' + data);
    }
}
   if (window.jajaPluginInitialized) return;
    window.jajaPluginInitialized = true;

    class JajaCore {
        constructor(data) {
            this.activity = data.activity;
            console.log('[Jaja] Activity created');
        }

        create() {
            console.log('[Jaja] Creating component');
            return $('<div>Тестовый контент плагина</div>');
        }
    }

    if (window.jajaPluginInitialized) return;
    window.jajaPluginInitialized = true;

    function initPlugin() {
        console.log('[Jaja] Initializing plugin...');

        // Регистрация компонента
        Lampa.Component.add(PLUGIN_NAME, JajaCore);

        // Добавление пункта меню
        const menuItem = $(`
            <li id="${MENU_ITEM_ID}" class="menu__item selector">
                <div class="menu__ico">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.18 5 4.05 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                </div>
                <div class="menu__text">18+ Контент</div>
            </li>
        `).on('hover:enter', () => {
            Lampa.Activity.push({
                title: '18+ Контент',
                component: PLUGIN_NAME,
                url: 'https://jable.tv/latest-updates/'
            });
        });

        function tryAddToMenu() {
            const $menu = $('.menu .menu__list, .menu__body .menu__list').first();
            if ($menu.length) {
                $menu.append(menuItem);
                console.log('[Jaja] Menu item added');
                return true;
            }
            return false;
        }

        if (!tryAddToMenu()) {
            Lampa.Listener.follow('app', e => {
                if (e.type === 'ready') tryAddToMenu();
            });
        }

        console.log('[Jaja] Plugin initialized');
    }

    // Старт плагина при готовности приложения
    if (window.appready) {
        initPlugin();
    } else {
        Lampa.Listener.follow('app', e => {
            if (e.type === 'ready') initPlugin();
        });
    }

})();
    
