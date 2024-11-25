(function () {
    'use strict';

    var Defined = {
        use_api: 'http',
        localhost: 'https://vi.sisi.am',
        framework: ''
    };

    var network = new Lampa.Reguest();
    var preview_timer, preview_video;

    function sourceTitle(title) {
        return Lampa.Utils.capitalizeFirstLetter(title.split('.')[0]);
    }

    function qualityDefault(qualitys) {
        var preferably = Lampa.Storage.get('video_quality_default', '1080') + 'p';
        var url;

        if (qualitys) {
            for (var q in qualitys) {
                if (q.indexOf(preferably) == 0) url = qualitys[q];
            }
            if (!url) url = qualitys[Lampa.Arrays.getKeys(qualitys)[0]];
        }

        return url;
    }

    function play(element) {
        var controller_enabled = Lampa.Controller.enabled().name;

        if (element.json) {
            Lampa.Loading.start(function () {
                network.clear();
                Lampa.Loading.stop();
            });
            
            Api.qualitys(element.video, function (data) {
                if (data.error) {
                    Lampa.Noty.show(Lampa.Lang.translate('torrent_parser_nofiles'));
                    Lampa.Loading.stop();
                    return;
                }

                var qualitys = data.qualitys || data;
                var recomends = data.recomends || [];
                Lampa.Loading.stop();

                for (var i in qualitys) {
                    qualitys[i] = qualitys[i];
                }

                var video = {
                    title: element.name,
                    url: qualityDefault(qualitys),
                    quality: qualitys
                };

                Lampa.Player.play(video);

                if (recomends.length) {
                    recomends.forEach(function (a) {
                        a.title = Lampa.Utils.shortText(a.name, 50);
                        a.icon = '<img class="size-youtube" src="' + a.picture + '" />';
                        a.template = 'selectbox_icon';

                        a.url = function (call) {
                            if (a.json) {
                                Api.qualitys(a.video, function (data) {
                                    a.quality = data.qualitys;
                                    a.url = qualityDefault(data.qualitys);
                                    call();
                                });
                            } else {
                                a.url = a.video;
                                call();
                            }
                        };
                    });
                    Lampa.Player.playlist(recomends);
                } else {
                    Lampa.Player.playlist([video]);
                }

                Lampa.Player.callback(function () {
                    Lampa.Controller.toggle(controller_enabled);
                });
            }, function () {
                Lampa.Noty.show(Lampa.Lang.translate('torrent_parser_nofiles'));
                Lampa.Loading.stop();
            });
        } else {
            if (element.qualitys) {
                for (var i in element.qualitys) {
                    element.qualitys[i] = element.qualitys[i];
                }
            }

            var video = {
                title: element.name,
                url: qualityDefault(element.qualitys) || element.video,
                quality: element.qualitys
            };
            
            Lampa.Player.play(video);
            Lampa.Player.playlist([video]);
            
            Lampa.Player.callback(function () {
                Lampa.Controller.toggle(controller_enabled);
            });
        }
    }

    function fixCards(json) {
        json.forEach(function (m) {
            m.background_image = m.picture;
            m.poster = m.picture;
            m.img = m.picture;
            m.name = Lampa.Utils.capitalizeFirstLetter(m.name).replace(/\&(.*?);/g, '');
        });
    }

    function hidePreview() {
        clearTimeout(preview_timer);

        if (preview_video) {
            preview_video.find('video').pause();
            preview_video.addClass('hide');
            preview_video = false;
        }
    }

    function preview(target, element) {
        hidePreview();
        preview_timer = setTimeout(function () {
            if (!element.preview || !Lampa.Storage.field('sisi_preview')) return;
            var video = target.find('video');
            var container = target.find('.sisi-video-preview');

            if (!video) {
                video = document.createElement('video');
                container = document.createElement('div');
                container.addClass('sisi-video-preview');
                container.style.position = 'absolute';
                container.style.width = '100%';
                container.style.height = '100%';
                container.style.left = '0';
                container.style.top = '0';
                container.style.overflow = 'hidden';
                container.style.borderRadius = '1em';
                video.style.position = 'absolute';
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.left = '0';
                video.style.top = '0';
                video.style.objectFit = 'cover';
                container.append(video);
                target.find('.card__view').append(container);
                video.src = element.preview;
                video.load();
            }

            preview_video = container;
            video.play();
            container.removeClass('hide');
        }, 2000);
    }

    function fixList(list) {
        list.forEach(function (a) {
            if (!a.quality && a.time) a.quality = a.time;
        });
        return list;
    }

    function menu$2(target, card_data) {
        var cm = [];

        if (card_data.related) {
            cm.push({
                title: 'Похожие',
                related: true
            });
        }

        if (card_data.model) {
            cm.push({
                title: card_data.model.name,
                model: true
            });
        }

        Lampa.Select.show({
            title: 'Меню',
            items: cm,
            onSelect: function onSelect(m) {
                if (m.model) {
                    Lampa.Activity.push({
                        url: Defined.localhost + '/' + card_data.model.uri,
                        title: 'Модель - ' + card_data.model.name,
                        component: 'sisi_view_' + Defined.use_api,
                        page: 1
                    });
                } else if (m.related) {
                    Lampa.Activity.push({
                        url: card_data.video + '&related=true',
                        title: 'Похожие - ' + card_data.title,
                        component: 'sisi_view_' + Defined.use_api,
                        page: 1
                    });
                }
            },
            onBack: function onBack() {
                Lampa.Controller.toggle('content');
            }
        });
    }

    var Utils = {
        sourceTitle: sourceTitle,
        play: play,
        fixCards: fixCards,
        preview: preview,
        hidePreview: hidePreview,
        fixList: fixList,
        menu: menu$2
    };

    function ApiHttp() {
        var _this = this;
        var network = new Lampa.Reguest();

        this.view = function (params, success, error) {
            var u = Lampa.Utils.addUrlComponent(params.url, 'pg=' + (params.page || 1));
            network.silent(u, function (json) {
                if (json.list) {
                    json.results = Utils.fixList(json.list);
                    json.collection = true;
                    json.total_pages = json.total_pages || 30;
                    Utils.fixCards(json.results);
                    delete json.list;
                    success(json);
                } else {
                    error();
                }
            }, error);
        };

        this.playlist = function (add_url_query, oncomplite, error) {
            var status = new Lampa.Status();
            oncomplite([]);
        };

        this.main = function (params, oncomplite, error) {
            this.playlist('', oncomplite, error);
        };

        this.qualitys = function (video_url, oncomplite, error) {
            network.silent(video_url + '&json=true', oncomplite, error);
        };

        this.clear = function () {
            network.clear();
        };
    }

    var Api = new ApiHttp();

    function Sisi(object) {
        var comp = new Lampa.InteractionMain(object);

        comp.create = function () {
            this.activity.loader(true);
            Api.main(object, this.build.bind(this), this.empty.bind(this));
            return this.render();
        };

        comp.empty = function (er) {
            var _this = this;
            var empty = new Lampa.Empty({
                descr: typeof er == 'string' ? er : Lampa.Lang.translate('empty_text_two')
            });
            Lampa.Activity.all().forEach(function (active) {
                if (_this.activity == active.activity) active.activity.render().find('.activity__body > div')[0].appendChild(empty.render(true));
            });
            this.start = empty.start;
            this.activity.loader(false);
            this.activity.toggle();
        };

        return comp;
    }

    function View(object) {
        var comp = new Lampa.InteractionCategory(object);

        comp.create = function () {
            var _this = this;
            this.activity.loader(true);
            Api.view(object, function (data) {
                _this.build(data);
            }, this.empty.bind(this));
        };

        comp.nextPageReuest = function (object, resolve, reject) {
            Api.view(object, resolve.bind(this), reject.bind(this));
        };

        comp.cardRender = function (object, element, card) {
            card.onMenu = function (target, card_data) {
                return Utils.menu(target, card_data);
            };

            card.onEnter = function () {
                Utils.hidePreview();
                Utils.play(element);
            };

            var origFocus = card.onFocus;
            card.onFocus = function (target, card_data) {
                origFocus(target, card_data);
                Utils.preview(target, element);
            };
        };

        return comp;
    }

    function startPlugin() {
        window['plugin_sisi_' + Defined.use_api + '_ready'] = true;
        
        Lampa.Component.add('sisi_' + Defined.use_api, Sisi);
        Lampa.Component.add('sisi_view_' + Defined.use_api, View);

        function addSettings() {
            if (window.sisi_add_param_ready) return;
            window.sisi_add_param_ready = true;
            
            Lampa.SettingsApi.addComponent({
                component: 'sisi',
                name: 'Video Player',
                icon: "..."  // Your icon SVG here
            });
            
            Lampa.SettingsApi.addParam({
                component: 'sisi',
                param: {
                    name: 'sisi_preview',
                    type: 'trigger',
                    values: '',
                    default: true
                },
                field: {
                    name: 'Preview',
                    description: 'Show preview when hovering over card'
                }
            });
        }

        function add() {
            var button = $(`<li class="menu__item selector">
                <div class="menu__ico">[Your SVG Icon]</div>
                <div class="menu__text">Video Player</div>
            </li>`);

            button.on('hover:enter', function () {
                Lampa.Activity.push({
                    url: '',
                    title: 'Video Player',
                    component: 'sisi_' + Defined.use_api,
                    page: 1
                });
            });

            $('.menu .menu__list').eq(0).append(button);
            addSettings();
        }

        if (window.appready) add();
        else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type == 'ready') add();
            });
        }
    }

    if (!window['plugin_sisi_' + Defined.use_api + '_ready']) {
        startPlugin();
    }
})();
