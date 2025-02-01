(function() {
    'use strict';

    const PLUGIN_NAME = 'jaja';
    const MENU_ITEM_ID = 'jaja-menu-item';
    const CORS_PROXY = 'https://corsproxy.io/?';
    const SITES = {
        jable: {
            title: 'Jable.tv',
            baseUrl: 'https://jable.tv',
            parse: $ => {
                return $('.grid .video-img-box').map((i, el) => {
                    const $el = $(el);
                    return {
                        title: $el.find('h6.title').text(),
                        image: $el.find('img').data('src'),
                        url: $el.find('a').attr('href'),
                        duration: $el.find('.label').text(),
                        id: $el.find('a').attr('href').split('/').filter(Boolean).pop()
                    };
                }).get();
            }
        },
        njav: {
            title: 'NJAV.tv',
            baseUrl: 'https://njav.tv',
            parse: $ => {
                return $('.box-item').map((i, el) => {
                    const $el = $(el);
                    return {
                        title: $el.find('.detail a').text(),
                        image: $el.find('img').data('src'),
                        url: $el.find('a').attr('href'),
                        duration: $el.find('.duration').text(),
                        id: $el.find('img').attr('alt')
                    };
                }).get();
            }
        }
    };

    if (window.jajaPluginInitialized) return;
    window.jajaPluginInitialized = true;

    class JajaCore {
        constructor(data) {
            this.activity = data.activity;
            this.config = data;
            this.currentSite = this.detectSite();
            this.page = 1;
            this.hasMore = true;
            this.initUI();
        }

        initUI() {
            this.html = $('<div class="jaja-container"></div>');
            this.scroll = new Lampa.Scroll({ mask: true, over: true, step: 250 });
            this.setupControls();
        }

        detectSite() {
            return this.config.url.includes('jable') ? 'jable' : 'njav';
        }

        // Основные методы компонента
        start() {
            this.loadContent();
            Lampa.Controller.toggle('content');
        }

        create() {
            return this.html;
        }

        destroy() {
            this.scroll.destroy();
            this.html.remove();
        }

        async loadContent() {
            try {
                const { items, nextPage } = await this.fetchData();
                this.renderItems(items);
                this.hasMore = !!nextPage;
            } catch (error) {
                Lampa.Noty.show('Ошибка загрузки');
                console.error(error);
            }
        }

        async fetchData() {
            const url = this.buildUrl();
            const response = await fetch(CORS_PROXY + encodeURIComponent(url));
            const text = await response.text();
            const $html = $(text);
            
            return {
                items: SITES[this.currentSite].parse($html),
                nextPage: $html.find('.pagination a').last().attr('href')
            };
        }

        buildUrl() {
            const site = SITES[this.currentSite];
            return this.config.url || site.baseUrl + `/latest-updates/?page=${this.page}`;
        }

        renderItems(items) {
            const cards = items.map(item => this.createCard(item));
            this.html.append(cards);
            this.scroll.append(this.html);
        }

        createCard(item) {
            const card = $(`
                <div class="card card--collection">
                    <div class="card__img"></div>
                    <div class="card__title">${item.title}</div>
                    <div class="card__quality">${item.duration}</div>
                </div>
            `);

            this.loadImage(card, item);
            this.setupCardEvents(card, item);
            
            return card;
        }

        loadImage(card, item) {
            const img = new Image();
            img.src = item.image;
            img.onload = () => card.addClass('card--loaded');
            img.onerror = () => this.handleImageError(card, item.title);
            card.find('.card__img').replaceWith(img);
        }

        handleImageError(card, title) {
            const color = this.generateColor(title);
            card.find('.card__img').css({
                backgroundColor: color.background,
                color: color.text
            }).text(title.substring(0, 2));
        }

        generateColor(title) {
            const hash = Lampa.Utils.hash(title);
            const hex = (hash * 0xFFFFFF).toString(16).slice(0,6);
            const brightness = parseInt(hex, 16) > 0xAAAAAA;
            return {
                background: `#${hex}`,
                text: brightness ? '#000' : '#fff'
            };
        }

        setupCardEvents(card, item) {
            card.on('hover:focus', () => this.handleFocus(card, item))
                .on('hover:enter', () => this.playVideo(item))
                .on('hover:long', () => this.showContextMenu(item));
        }

        async playVideo(item) {
            Lampa.Modal.show({ title: 'Загрузка...', html: Lampa.Template.get('modal_loading') });
            
            try {
                const videoUrl = await this.fetchVideoUrl(item.url);
                Lampa.Player.play({ url: videoUrl, title: item.title });
            } catch (error) {
                Lampa.Noty.show('Ошибка воспроизведения');
            }
            
            Lampa.Modal.close();
        }

        async fetchVideoUrl(url) {
            const response = await fetch(CORS_PROXY + encodeURIComponent(url));
            const text = await response.text();
            const $page = $(text);
            
            return this.currentSite === 'jable'
                ? $page.find('script:contains("http")').text().match(/https?:\/\/[^'"]+/)[0]
                : $page.find('iframe').attr('src');
        }

        showContextMenu(item) {
            Lampa.Select.show({
                title: item.title,
                items: [
                    { title: FavoriteManager.has(item.url) ? 'Удалить из избранного' : 'Добавить в избранное' },
                    { title: 'Похожие видео' },
                    { title: 'Информация' }
                ],
                onSelect: (_, index) => {
                    if (index === 0) this.toggleFavorite(item);
                    if (index === 1) this.showSimilar(item);
                }
            });
        }

        toggleFavorite(item) {
            FavoriteManager.toggle(item);
            Lampa.Noty.show(FavoriteManager.has(item.url) 
                ? 'Добавлено в избранное' 
                : 'Удалено из избранного'
            );
        }

        setupControls() {
            Lampa.Controller.add('content', {
                toggle: () => this.scroll.toggle(),
                up: () => Navigator.move('up'),
                down: () => Navigator.move('down'),
                back: () => Lampa.Activity.backward()
            });
        }
    }

    class FavoriteManager {
        static get() {
            return JSON.parse(localStorage.getItem('jaja_favorites') || '[]');
        }

        static toggle(item) {
            const favorites = this.get();
            const index = favorites.findIndex(f => f.url === item.url);
            
            if (index === -1) {
                favorites.push(item);
            } else {
                favorites.splice(index, 1);
            }
            
            localStorage.setItem('jaja_favorites', JSON.stringify(favorites));
        }

        static has(url) {
            return this.get().some(f => f.url === url);
        }
    }

    // Инициализация плагина
    function initPlugin() {
        Lampa.Component.add(PLUGIN_NAME, JajaCore);
        addMenuEntry();
        addStyles();
    }

    function addMenuEntry() {
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
                url: SITES.jable.baseUrl + '/latest-updates/'
            });
        });

        const tryAdd = () => $(document).find('.menu__list').first().append(menuItem);
        tryAdd() || Lampa.Listener.follow('app', e => e.type === 'ready' && tryAdd());
    }

    function addStyles() {
        const styles = `
            .jaja-container {
                padding: 20px;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
            }
            #${MENU_ITEM_ID} .menu__ico svg {
                width: 24px;
                height: 24px;
            }
            .card--collection .card__quality {
                background: rgba(0,0,0,0.7);
                padding: 2px 8px;
                border-radius: 4px;
                position: absolute;
                bottom: 8px;
                right: 8px;
            }
        `;
        $('<style>').html(styles).appendTo('head');
    }

    if (window.appready) {
        initPlugin();
    } else {
        Lampa.Listener.follow('app', e => e.type === 'ready' && initPlugin());
    }

})();
