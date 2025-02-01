(function() {
    'use strict';

    const PLUGIN_NAME = 'jaja';
    const FAVORITE_KEY = 'favorite_jaja';
    const CORS_PROXY = 'https://cors.eu.org/';
    const SITE_CONFIG = {
        jable: {
            title: 'Jable.tv',
            baseUrl: 'https://jable.tv',
            selectors: {
                list: {
                    container: 'div.grid div.video-img-box',
                    item: {
                        title: 'h6.title a@text',
                        url: 'h6.title a@href',
                        image: 'img@data-src',
                        duration: '.label@text',
                        id: 'h6.title a@href | /([^/]+)/$'
                    }
                },
                pagination: '.pagination a@href'
            },
            categories: [
                { title: 'Новинки', url: '/latest-updates/' },
                { title: 'Популярное', url: '/hot/' },
                { title: 'Рекомендуемое', url: '/recommended/' }
            ]
        },
        njav: {
            title: 'NJAV.tv',
            baseUrl: 'https://njav.tv',
            selectors: {
                list: {
                    container: 'div.box-item',
                    item: {
                        title: '.detail a@text',
                        url: '.detail a@href',
                        image: 'img@data-src',
                        duration: '.duration@text',
                        id: 'img@alt'
                    }
                },
                pagination: '.pagination a@href'
            },
            categories: [
                { title: 'Новинки', url: '/en/new-release' },
                { title: 'Тренды', url: '/en/trending' },
                { title: 'Рекомендуемое', url: '/en/recommended' }
            ]
        }
    };

    class JajaCore {
        constructor(object) {
            this.activity = object.activity;
            this.config = object;
            this.currentSite = this.detectSite();
            this.network = new Lampa.Reguest();
            this.scroll = new Lampa.Scroll({ mask: true, over: true, step: 250 });
            this.items = [];
            this.page = 1;
            this.hasMore = true;
            this.initUI();
        }

        initUI() {
            this.html = $('<div class="info_jaja"></div>');
            this.body = $('<div class="freetv_jaja category-full"></div>');
            this.infoPanel = this.createInfoPanel();
        }

        detectSite() {
            return this.config.url.includes('jable') ? 'jable' : 'njav';
        }

        async create() {
            this.activity.loader(true);
            await this.loadData();
            return this.render();
        }

        async loadData() {
            try {
                const url = this.buildRequestUrl();
                const response = await this.fetchData(url);
                const data = this.parseData(response);
                
                if (data.items.length === 0) {
                    this.showEmptyState();
                } else {
                    this.createCards(data.items);
                    this.setupPagination(data.nextPage);
                }
            } catch (error) {
                this.handleError(error);
            } finally {
                this.activity.loader(false);
            }
        }

        buildRequestUrl() {
            const { baseUrl, categories } = SITE_CONFIG[this.currentSite];
            const path = this.config.type === 'category' 
                ? categories.find(c => c.title === this.config.category).url
                : '/search/?q=' + encodeURIComponent(this.config.query);
            
            return CORS_PROXY + encodeURIComponent(baseUrl + path + `?page=${this.page}`);
        }

        async fetchData(url) {
            const response = await this.network.native(url, {
                headers: { 'User-Agent': UA.DESKTOP },
                dataType: 'text'
            });
            return this.currentSite === 'njav' ? JSON.parse(response.contents) : response;
        }

        parseData(response) {
            const $html = $(response);
            const items = [];
            
            $html.find(SITE_CONFIG[this.currentSite].selectors.list.container).each((i, el) => {
                const $el = $(el);
                const item = {};
                
                for (const [key, selector] of Object.entries(SITE_CONFIG[this.currentSite].selectors.list.item)) {
                    const [elem, attr] = selector.split('@');
                    const value = attr === 'text' 
                        ? $el.find(elem).text().trim()
                        : $el.find(elem).attr(attr);
                    
                    item[key] = this.applyFilters(value, selector);
                }
                items.push(item);
            });

            const nextPage = $html.find(SITE_CONFIG[this.currentSite].selectors.pagination).last().attr('href');
            
            return {
                items,
                nextPage: nextPage ? SITE_CONFIG[this.currentSite].baseUrl + nextPage : null
            };
        }

        applyFilters(value, selector) {
            if (selector.includes('|')) {
                const [_, regex] = selector.split('|');
                const match = value.match(new RegExp(regex));
                return match ? match[1] : value;
            }
            return value;
        }

        createCards(items) {
            items.forEach(item => {
                const card = this.createCard(item);
                this.setupCardEvents(card, item);
                this.body.append(card);
                this.items.push(card);
            });
        }

        createCard(item) {
            const card = Lampa.Template.get('card', {
                title: item.title,
                release_year: item.duration
            });

            card.addClass('card--collection');
            this.setCardImage(card, item.image);
            this.addCardBadges(card, item);
            
            return card;
        }

        setCardImage(card, imageUrl) {
            const img = card.find('.card__img')[0];
            img.onload = () => card.addClass('card--loaded');
            img.onerror = () => this.handleImageError(card, item.title);
            img.src = imageUrl || './img/img_broken.svg';
        }

        handleImageError(card, title) {
            const color = this.generateTitleColor(title);
            card.find('.card__img').replaceWith(`
                <div class="card__img" 
                     style="background-color: ${color.bg}; color: ${color.text}">
                    ${title}
                </div>
            `);
            card.addClass('card--loaded');
        }

        generateTitleColor(title) {
            const hash = Lampa.Utils.hash(title);
            const hex = (hash * 0xFFFFFF).toString(16).slice(0,6);
            const brightness = parseInt(hex, 16) > 0xAAAAAA;
            return {
                bg: `#${hex}`,
                text: brightness ? '#000' : '#fff'
            };
        }

        addCardBadges(card, item) {
            if (item.duration) {
                card.find('.card__view').append(`
                    <div class="card__quality">${item.duration}</div>
                `);
            }
        }

        setupCardEvents(card, item) {
            card.on('hover:focus', () => this.handleCardFocus(card, item))
                .on('hover:enter', () => this.playVideo(item))
                .on('hover:long', () => this.showContextMenu(item));
        }

        handleCardFocus(card, item) {
            this.lastFocused = card;
            this.updateInfoPanel(item);
            this.checkLoadMore();
            Lampa.Background.change(item.image);
        }

        updateInfoPanel(item) {
            this.infoPanel.find('.info__title').text(item.title);
            this.infoPanel.find('.info__title-original').text(item.id);
        }

        checkLoadMore() {
            const visibleItems = Math.floor(this.scroll.height() / 300) * 6;
            if (this.items.length - this.scroll.position() < visibleItems) {
                this.loadNextPage();
            }
        }

        async loadNextPage() {
            if (!this.hasMore || this.isLoading) return;
            
            this.isLoading = true;
            this.page++;
            
            try {
                const data = await this.loadData();
                this.hasMore = !!data.nextPage;
            } catch (error) {
                Lampa.Noty.show('Ошибка загрузки следующей страницы');
            } finally {
                this.isLoading = false;
            }
        }

        async playVideo(item) {
            Lampa.Modal.show({ 
                title: item.title, 
                html: Lampa.Template.get('modal_loading'), 
                size: 'small' 
            });

            try {
                const videoUrl = await this.fetchVideoUrl(item);
                Lampa.Player.play({
                    title: item.title,
                    url: videoUrl,
                    tv: false
                });
            } catch (error) {
                Lampa.Noty.show('Ошибка загрузки видео');
            } finally {
                Lampa.Modal.close();
            }
        }

        async fetchVideoUrl(item) {
            const response = await this.network.native(
                CORS_PROXY + encodeURIComponent(item.url),
                { headers: { 'User-Agent': UA.MOBILE } }
            );
            
            const $page = $(response);
            return this.currentSite === 'jable'
                ? $page.find('script:contains("https://")').text().match(/https?:\/\/[^'"]+/)[0]
                : $page.find('iframe').attr('src');
        }

        showContextMenu(item) {
            const menuItems = [
                {
                    title: FavoriteManager.has(item.url) ? 'Удалить из избранного' : 'Добавить в избранное',
                    action: () => this.toggleFavorite(item)
                },
                {
                    title: 'Похожие видео',
                    action: () => this.showSimilar(item)
                },
                {
                    title: 'Информация',
                    action: () => this.showInfo(item)
                }
            ];

            Lampa.Select.show({
                title: item.title,
                items: menuItems.map(i => ({ title: i.title })),
                onSelect: (_, index) => menuItems[index].action()
            });
        }

        toggleFavorite(item) {
            if (FavoriteManager.has(item.url)) {
                FavoriteManager.remove(item.url);
                Lampa.Noty.show('Удалено из избранного');
            } else {
                FavoriteManager.add(item);
                Lampa.Noty.show('Добавлено в избранное');
            }
        }

        render() {
            this.html.append(this.infoPanel, this.scroll.render());
            this.scroll.append(this.body);
            this.setupControls();
            return this.html;
        }

        setupControls() {
            Lampa.Controller.add('content', {
                toggle: () => this.scroll.toggle(),
                up: () => Navigator.move('up'),
                down: () => Navigator.move('down'),
                back: () => Lampa.Activity.backward()
            });
        }

        destroy() {
            this.network.clear();
            this.scroll.destroy();
            this.html.remove();
            Lampa.Controller.remove('content');
        }
    }

    class FavoriteManager {
        static get() {
            return JSON.parse(localStorage.getItem(FAVORITE_KEY)) || [];
        }

        static add(item) {
            const favorites = this.get();
            if (!favorites.some(f => f.url === item.url)) {
                favorites.push(item);
                localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
            }
        }

        static remove(url) {
            const favorites = this.get().filter(f => f.url !== url);
            localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
        }

        static has(url) {
            return this.get().some(f => f.url === url);
        }
    }

    // Инициализация плагина
    function initPlugin() {
    console.log('[Jaja] Plugin initialization started');
    Lampa.Component.add(PLUGIN_NAME, JajaCore);
    addMenuEntry();
    addStyles();
    console.log('[Jaja] Plugin initialized');
    }

function addMenuEntry() {
    console.log('[Jaja] Adding menu entry');
    const menuHtml = `
        <li class="menu__item selector" data-action="${PLUGIN_NAME}">
            <div class="menu__ico">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.18 5 4.05 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
            </div>
            <div class="menu__text">18+ Контент</div>
        </li>
    `;
    
    const $menuList = $('.menu .menu__list:first');
    console.log('[Jaja] Menu list element:', $menuList.length);
    
    if ($menuList.length) {
        $menuList.append(menuHtml);
        console.log('[Jaja] Menu item added successfully');
    } else {
        console.error('[Jaja] Menu list not found!');
        Lampa.Listener.follow('app', e => {
            if (e.type === 'ready') {
                $('.menu .menu__list:first').append(menuHtml);
                console.log('[Jaja] Menu item added after app ready');
            }
        });
    }
}

    function addStyles() {
        const styles = `
            .freetv_jaja .card__img {
                border-radius: 12px;
                overflow: hidden;
            }
            .freetv_jaja .card__quality {
                position: absolute;
                bottom: 8px;
                right: 8px;
                background: rgba(0,0,0,0.7);
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 12px;
            }
            .info_jaja .info__title {
                font-size: 1.4em;
                margin-bottom: 8px;
            }
        `;
        $('<style>').html(styles).appendTo('head');
    }

    function showMainScreen() {
        Lampa.Activity.push({
            title: '18+ Контент',
            component: PLUGIN_NAME,
            url: SITE_CONFIG.jable.baseUrl + '/latest-updates/',
            setup: { type: 'category', category: 'Новинки' }
        });
    }

    if (!window.jajaPluginInitialized) {
        window.jajaPluginInitialized = true;
        initPlugin();
    }

})();
