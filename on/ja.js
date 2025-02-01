(function () {
    'use strict';

    const USER_AGENTS = {
        MOBILE: "Mozilla/5.0 (Linux; Android 11; M2007J3SC Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045714 Mobile Safari/537.36",
        PC: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36",
        DEFAULT: "Mozilla/5.0",
        UC: "Mozilla/5.0 (Linux; U; Android 9; zh-CN; MI 9 Build/PKQ1.181121.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.5.5.1035 Mobile Safari/537.36",
        IOS: "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
    };

    const FAVORITE_RADIOS_KEY = 'favorite_jaja';
    const CORS_PROXY = 'https://api.allorigins.win/get?url=';

    function getFavorites() {
        return JSON.parse(localStorage.getItem(FAVORITE_RADIOS_KEY)) || [];
    }

    function saveFavorite(el) {
        const favorites = getFavorites();
        favorites.push(el);
        localStorage.setItem(FAVORITE_RADIOS_KEY, JSON.stringify(favorites));
    }

    function removeFavorite(el) {
        const updatedFavorites = getFavorites().filter(item => item.url !== el.url);
        localStorage.setItem(FAVORITE_RADIOS_KEY, JSON.stringify(updatedFavorites));
    }

    function isFavorite(el) {
        return getFavorites().some(item => item.url === el);
    }

    function jaja(object) {
        const network = new Lampa.Reguest();
        const scroll = new Lampa.Scroll({ mask: true, over: true, step: 250 });
        const items = [];
        const html = $('');
        const body = $('');
        let info, last, waitload, total_pages;

        const activity = {
            url: '',
            title: `${object.setup.title} - Коллекция`,
            component: 'jaja',
            quantity: '',
            setup: object.setup,
            type: 'fav',
            page: 1
        };

        this.create = function () {
            this.activity.loader(true);
            if (object.setup.datatype !== 'json') CORS_PROXY = '';
            if (object.type === 'fav') {
                const data = this.cardfavor(getFavorites());
                this.build(data);
            } else {
                network["native"](CORS_PROXY + object.url, str => {
                    const data = this.card(str);
                    this.build(data);
                }, (a, c) => Lampa.Noty.show(network.errorDecode(a, c)), false, { dataType: object.setup.datatype });
            }
            return this.render();
        };

        this.next = function (page) {
            if (total_pages <= 1 || waitload) return;
            waitload = true;
            object.page++;
            const regex = /page=(\d+)/;
            const match = page.match(regex);
            const nextPage = match ? page.replace('page=' + match[1], `page=${object.page}`) : page.replace(/(\d+)([^0-9].*)?$/, `${object.page}$2`) + '?lang=en';
            network["native"](CORS_PROXY + nextPage, result => {
                const data = this.card(result);
                this.append(data, true);
                if (data.card.length) waitload = false;
                this.activity.loader(false);
            }, (a, c) => Lampa.Noty.show(network.errorDecode(a, c)), false, {
                dataType: object.setup.datatype,
                headers: object.use_referer && {
                    Referer: object.url.match(/(http|https):\/\/(www.)?(\w+(\.)?)+/)[0] + '/',
                    'User-Agent': USER_AGENTS.MOBILE
                }
            });
        };

        this.card = function (str) {
            const balanser = Lampa.Storage.get('online_jaja_balanser');
            const catalog = catalogs.find(fp => fp.title === balanser);
            const host = object.url.startsWith('http') ? object.url.match(/(http|https):\/\/(www.)?(\w+(\.)?)+/)[0] : '';
            const videos = $(catalog.list.videoscontainer.selector, str).map((i, el) => {
                const title = $(el).find(catalog.list.title.selector).text().trim();
                const link = $(el).find(catalog.list.link.selector).attr('href').startsWith('http') ? $(el).find(catalog.list.link.selector).attr('href') : host + $(el).find(catalog.list.link.selector).attr('href');
                const thumb = $(el).find(catalog.list.thumb.selector).attr('src') || $(el).find(catalog.list.thumb.selector).attr('data-src');
                const mnumber = $(el).find(catalog.list.mnumber.selector).text().trim();
                return { title, url: link, img: thumb, episodes_info: mnumber.toUpperCase() };
            }).get();
            const page = $(catalog.list.page.selector, str).find('a').last().attr('href') || object.url;
            total_pages = $(catalog.list.page.selector, str).find('a').length || 1;
            return { card: videos, page, total_pages };
        };

        this.cardfavor = function (json) {
            const favorites = json.filter(fp => fp.website === object.setup.title);
            return { card: favorites.reverse(), page: 'undefined', total_pages: 1 };
        };

        this.append = function (data, append) {
            data.card.forEach(element => {
                const card = Lampa.Template.get('card', { title: element.title, release_year: '' });
                card.addClass('card--collection');
                const img = card.find('.card__img')[0];
                img.onload = () => card.addClass('card--loaded');
                img.onerror = () => {
                    const hex = (Lampa.Utils.hash(element.title) * 1).toString(16).padEnd(6, '0').substring(0, 6);
                    const color = `#${hex}`;
                    const textColor = parseInt(hex.slice(0, 2), 16) * 0.299 + parseInt(hex.slice(2, 4), 16) * 0.587 + parseInt(hex.slice(4, 6), 16) * 0.114 > 186 ? '#000000' : '#FFFFFF';
                    card.find('.card__img').replaceWith(element.title.replace('-', ' '));
                    card.find('.card__view').css({ 'background-color': color, color: textColor });
                    card.addClass('card--loaded');
                };
                if (element.img) img.src = element.img; else img.onerror();
                body.append(card);
                if (append) Lampa.Controller.collectionAppend(card);
                items.push(card);
            });
        };

        this.build = function (data) {
            info = Lampa.Template.get('info_web');
            const btn = Lampa.Template.get('button_category');
            info.find('#web_filtr').append(btn);
            info.find('.open--favorite').on('hover:enter hover:click', () => {
                Lampa.Activity.push({ url: '', title: `${object.setup.title} - Коллекция`, component: 'jaja', quantity: '', setup: object.setup, type: 'fav', page: 1 });
            });
            scroll.render().addClass('layer--wheight').data('mheight', info);
            if (data.card.length) {
                html.append(info);
                scroll.minus();
                html.append(scroll.render());
                this.append(data);
                scroll.append(body);
                this.activity.loader(false);
                this.activity.toggle();
            } else {
                this.empty();
            }
        };

        this.empty = function () {
            const empty = new Lampa.Empty();
            scroll.append(empty.render());
            this.start = empty.start;
            this.activity.loader(false);
            this.activity.toggle();
        };

        this.start = function () {
            if (Lampa.Activity.active().activity !== this.activity) return;
            Lampa.Controller.add('content', {
                toggle: () => { Lampa.Controller.collectionSet(scroll.render()); Lampa.Controller.collectionFocus(last || false, scroll.render()); },
                left: () => Navigator.canmove('left') ? Navigator.move('left') : Lampa.Controller.toggle('menu'),
                right: () => Navigator.canmove('right') ? Navigator.move('right') : this.selectGroup(),
                up: () => Navigator.canmove('up') ? Navigator.move('up') : info ? (!info.find('.view--category').hasClass('focus') ? (Lampa.Controller.collectionSet(info), Navigator.move('right')) : Lampa.Controller.toggle('head')) : Lampa.Controller.toggle('head'),
                down: () => Navigator.canmove('down') ? Navigator.move('down') : info && info.find('.view--category').hasClass('focus') && Lampa.Controller.toggle('content'),
                back: () => Lampa.Activity.backward()
            });
            Lampa.Controller.toggle('content');
        };

        this.pause = this.stop = function () { };
        this.render = function () { return html; };
        this.destroy = function () { network.clear(); scroll.destroy(); info?.remove(); html.remove(); body.remove(); };
    }

    const catalogs = [
        {
            title: "Jable.tv",
            link: "https://jable.tv",
            show: "portrait",
            next: "search",
            datasort: "",
            use_referer: true,
            datatype: "text",
            category: [
                { title: 'Недавно обновленное', url: 'https://jable.tv/latest-updates/?lang=en', quantity: '' },
                { title: 'Новое', url: 'https://jable.tv/new-release/?lang=en', quantity: '' },
                { title: 'Популярные за неделю', url: 'https://jable.tv/hot/?lang=en', quantity: '' }
            ],
            list: {
                page: { selector: ".pagination" },
                videoscontainer: { selector: "div.video-img-box", attrName: "", filter: "" },
                title: { selector: "h6.title a", attrName: "text", filter: "" },
                thumb: { selector: "img", attrName: "data-src", filter: "" },
                link: { selector: "h6.title a", attrName: "href", filter: "" },
                mnumber: { selector: "h6.title a", attrName: "href", filter: "\/([a-zA-Z0-9-]+)\/?$" },
                m_time: { selector: ".label", attrName: "", filter: "" }
            },
            search: { url: 'https://jable.tv/search/?q=#msearchword&from_videos=1' }
        },
        {
            title: "NJAV.tv",
            link: "https://njav.tv",
            show: "portrait",
            next: "search",
            datasort: "",
            use_referer: true,
            datatype: "json",
            category: [
                { title: 'Главная', url: 'https://njav.tv/en/', quantity: ':gt(9)' },
                { title: 'Недавно обновленное', url: 'https://njav.tv/en/recent-update', quantity: '' },
                { title: 'Новое', url: 'https://njav.tv/en/new-release', quantity: '' },
                { title: 'Популярное', url: 'https://njav.tv/en/trending', quantity: '' },
                { title: 'Рекомендуемое', url: 'https://njav.tv/en/recommended', quantity: '' },
                { title: 'Лучшее за день', url: 'https://njav.tv/en/today-hot', quantity: '' },
                { title: 'Лучшее за неделю', url: 'https://njav.tv/en/weekly-hot', quantity: '' },
                { title: 'Лучшее за месяц', url: 'https://njav.tv/en/monthly-hot', quantity: '' }
            ],
            list: {
                page: { selector: ".pagination" },
                videoscontainer: { selector: "div.box-item", attrName: "", filter: "" },
                title: { selector: ".detail a", attrName: "text", filter: "" },
                thumb: { selector: "img", attrName: "data-src", filter: "" },
                link: { selector: ".detail a", attrName: "href", filter: "" },
                mnumber: { selector: "img", attrName: "alt", filter: "" },
                m_time: { selector: ".duration", attrName: "", filter: "" }
            },
            search: { url: 'https://njav.tv/en/search?keyword=#msearchword' }
        }
    ];

    function listNavigation(catalogsList) {
        const balanser = Lampa.Storage.get('online_jaja_balanser') || catalogsList[0].title;
        const catalog = catalogsList.find(fp => fp.title === balanser) || catalogsList[0];
        Lampa.Storage.set('online_jaja_balanser', catalog.title);
        Lampa.Select.show({
            title: catalog.title,
            items: catalog.category,
            onSelect: a => Lampa.Activity.push({ url: a.url, title: `${catalog.title} - ${a.title}`, quantity: a.quantity, component: 'jaja', setup: catalog, page: 1 }),
            onBack: () => Lampa.Controller.toggle('content')
        });
    }

    function startjaja() {
        window.plugin_jaja_ready = true;
        Lampa.Component.add('jaja', jaja);
        const addSettingsjaja = () => {
            const menu_item = $('<div>JaJa 18+</div>').on('hover:enter', () => listNavigation(catalogs));
            $('.menu .menu__list').eq(0).append(menu_item);
        };
        window.appready ? addSettingsjaja() : Lampa.Listener.follow('app', e => e.type === 'ready' && addSettingsjaja());
    }

    if (!window.plugin_jaja_ready) startjaja();
})();
