(function () {
    'use strict';
    function jaja(object) {
        var network = new Lampa.Reguest();
        var scroll = new Lampa.Scroll({
            mask: true,
            over: true,
            step: 250
        });
        var items = [];
        var html = $('<div class="info_jaja"></div>');
        var body = $('<div class="freetv_jaja category-full"></div>');
        var info;
        var last;
        var waitload;
        var total_pages;
        var cors = 'https://api.allorigins.win/get?url= ';
        var MOBILE_UA = "Mozilla/5.0 (Linux; Android 11; M2007J3SC Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045714 Mobile Safari/537.36";
        var PC_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36";
        var UA = "Mozilla/5.0";
        var UC_UA = "Mozilla/5.0 (Linux; U; Android 9; zh-CN; MI 9 Build/PKQ1.181121.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.5.5.1035 Mobile Safari/537.36";
        var IOS_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1";;

        var activity = {
            url: '',
            title: object.setup.title + ' - Коллекция',
            component: 'jaja',
            quantity: '',
            setup: object.setup,
            type: 'fav',
            page: 1
        };

        this.create = function () {
            var _this = this;
            this.activity.loader(true);
            if (object.setup.datatype !== 'json') cors = '';
            if (object.type == 'fav') {
                var data = _this.cardfavor(getFavoriteRadios());
                _this.build(data);
            } else {
                network["native"](cors + object.url, function (str) {
                    var data = _this.card(str);
                    _this.build(data);
                }, function (a, c) {
                    Lampa.Noty.show(network.errorDecode(a, c));
                }, false, {
                    dataType: object.setup.datatype
                });
            }
            return this.render();
        };

        this.next = function (page) {
            var _this2 = this;
            if (total_pages == 1 || total_pages == 0) waitload = true;
            if (waitload) return;
            if (object.setup.datatype !== 'json') cors = '';
            waitload = true;
            object.page++;
            network.clear();
            network.timeout(1000 * 40);
            if (typeof page == 'undefined') return;
            if (page.indexOf('undefined') != -1) return;
            if (page.indexOf('before=') !== -1) {} else {
                var regex = /page=(\d+)/;
                var match = page.match(regex);
                if (match) {
                    page = page.replace('page=' + match[1], 'page=' + match[1]++)
                } else {
                    page = page.replace(page.match(/[0-9]+(?=[^0-9]*$)(.*)/)[0], '') + object.page + (page.match(/[0-9]+(?=[^0-9]*$)(.*)/)[1] ? page.match(/[0-9]+(?=[^0-9]*$)(.*)/)[1] : '') + '?lang=en';
                }
            }
            if (object.use_referer) {
                network["native"](cors + page, function (result) {
                    var data = _this2.card(result);
                    object.data = data;
                    _this2.append(data, true);
                    if (data.card.length) waitload = false;
                    _this2.activity.loader(false);
                }, function (a, c) {
                    if (a.status == 404) {} else {
                        Lampa.Noty.show(network.errorDecode(a, c));
                    }
                }, false, {
                    dataType: object.setup.datatype,
                    headers: {
                        'Referer': object.url.match(/(http|https):\/\/(www.)?(\w+(\.)?)+/)[0] + '/',
                        'User-Agent': MOBILE_UA
                    }
                });
            } else {
                network["native"](cors + page, function (result) {
                    var data = _this2.card(result);
                    object.data = data;
                    _this2.append(data, true);
                    if (data.card.length) waitload = false;
                    _this2.activity.loader(false);
                }, function (a, c) {
                    if (a.status == 404) {} else {
                        Lampa.Noty.show(network.errorDecode(a, c));
                    }
                }, false, {
                    dataType: object.setup.datatype
                });
            };
        };

        this.card = function (str) {
            var _this5 = this;
            var card = [];
            var page;
            var balanser = Lampa.Storage.get('online_jaja_balanser');
            var catalogs1 = catalogs.filter(function (fp) {
                return fp.title === balanser
            });
            if (catalogs1[0].datatype == 'json') {
                str = str.contents
            }
            str = str.replace(/\n/g, '');
            var v = catalogs1[0].list.videoscontainer.selector;
            var t = catalogs1[0].list.title.selector;
            var th = catalogs1[0].list.thumb.selector;
            var l = catalogs1[0].list.link.selector;
            var p = catalogs1[0].list.page.selector;
            var m = catalogs1[0].list.mnumber.selector;
            var host = object.url.indexOf('http') == -1 ? '' : object.url.match(/(http|https):\/\/(www.)?(\w+(\.)?)+/)[0];
            total_pages = $(p, str).find('a').last().attr('href') ? $(p, str).find('a').length : $(p, str).length;
            page = $(p, str).find('a').last().attr('href') ? $(p, str).find('a').last().attr('href') : $(p, str).attr('href');
            if (page) {
                if (page.indexOf('http') == -1) {
                    page = host + (page.startsWith('/') ? page : '/' + page);
                };
                if (page.indexOf('#') !== -1) {
                    page = object.url;
                };
            } else {
                page = object.url;
                if (page.indexOf('/1') !== -1) {
                    total_pages = 2;
                } else {
                    if (/[0-9]+(?=[^0-9]*$)(.*)/i.test(page) && object.url !== object.url.match(/(http|https):\/\/(www.)?(\w+(\.)?)+/)[0]) {
                        total_pages = 1;
                    };
                };
            };
            var position = object.url.indexOf('http');
            var count = 0;
            while (position !== -1) {
                count++;
                position = object.url.indexOf('http', position + 1);
            };
            var host, host_img;
            if (count == 0) {
                host = '';
            } else {
                if (count == 1) {
                    host = object.url.match(/(http|https):\/\/(www.)?(\w+(\.)?)+/)[0];
                    host_img = host;
                } else {
                    var last_host = object.url.match(/(http|https):\/\/(www.)?(\w+(\.)?)+/g)[count - 1];
                    host_img = last_host;
                    host = object.url.substring(0, object.url.indexOf(last_host)) + last_host;
                }
            };
            var t1, u1, i1, m1, tt, uu, ii, mm
            $(v + object.quantity, str).each(function (i, html) {
                t1 = t ? $(html).find(t) : $(html);
                u1 = l ? $(html).find(l) : $(html);
                i1 = th ? $(html).find(th) : $(html);
                m1 = m ? $(html).find(m) : $(html);
                switch (catalogs1[0].list.title.attrName) {
                    case 'text':
                        tt = t1.text();
                        break;
                    case 'html':
                        tt = t1.html();
                        break;
                    default:
                        tt = t1.attr(catalogs1[0].list.title.attrName);
                };
                if (typeof tt === 'undefined') return;
                tt = catalogs1[0].list.title.filter !== '' ? (tt.match(new RegExp(catalogs1[0].list.title.filter)) ? tt.match(new RegExp(catalogs1[0].list.title.filter))[1] : tt) : tt;
                switch (catalogs1[0].list.link.attrName) {
                    case 'text':
                        uu = u1.text().indexOf('http') == -1 ? host + u1.text() : u1.text();
                        break;
                    case 'html':
                        uu = u1.html();
                        break;
                    default:
                        uu = u1.attr(catalogs1[0].list.link.attrName).indexOf('http') == -1 ? host + (u1.attr(catalogs1[0].list.link.attrName).startsWith('/') ? u1.attr(catalogs1[0].list.link.attrName) : '/' + u1.attr(catalogs1[0].list.link.attrName)) : u1.attr(catalogs1[0].list.link.attrName);
                };
                uu = catalogs1[0].list.link.filter !== '' ? (uu.match(new RegExp(catalogs1[0].list.link.filter)) ? uu.match(new RegExp(catalogs1[0].list.link.filter))[1] : uu) : uu;
                switch (catalogs1[0].list.thumb.attrName) {
                    case 'text':
                        ii = i1.text().indexOf('http') == -1 ? host_img + i1.text() : i1.text();
                        break;
                    case 'html':
                        ii = i1.html();
                        break;
                    default:
                        ii = i1.attr(catalogs1[0].list.thumb.attrName) ? (i1.attr(catalogs1[0].list.thumb.attrName).indexOf('http') == -1 ? host_img + (i1.attr(catalogs1[0].list.thumb.attrName).startsWith('/') ? i1.attr(catalogs1[0].list.thumb.attrName) : '/' + i1.attr(catalogs1[0].list.thumb.attrName)) : i1.attr(catalogs1[0].list.thumb.attrName)) : '';
                };
                switch (catalogs1[0].list.mnumber.attrName) {
                    case 'text':
                        uu = u1.text().indexOf('http') == -1 ? host + u1.text() : u1.text();
                        break;
                    case 'html':
                        uu = u1.html();
                        break;
                    default:
                        uu = u1.attr(catalogs1[0].list.link.attrName).indexOf('http') == -1 ? host + (u1.attr(catalogs1[0].list.link.attrName).startsWith('/') ? u1.attr(catalogs1[0].list.link.attrName) : '/' + u1.attr(catalogs1[0].list.link.attrName)) : u1.attr(catalogs1[0].list.link.attrName);
                };
                switch (catalogs1[0].list.mnumber.attrName) {
                    case 'text':
                        mm = m1.text();
                        break;
                    case 'html':
                        mm = m1.html();
                        break;
                    default:
                        mm = m1.attr(catalogs1[0].list.mnumber.attrName);
                };
                mm = catalogs1[0].list.mnumber.filter !== '' ? (mm.match(new RegExp(catalogs1[0].list.mnumber.filter)) ? mm.match(new RegExp(catalogs1[0].list.mnumber.filter))[1] : mm) : mm;
                switch (catalogs1[0].list.thumb.attrName) {
                    case 'text':
                        ii = i1.text().indexOf('http') == -1 ? host_img + i1.text() : i1.text();
                        break;
                    case 'html':
                        ii = i1.html();
                        break;
                    default:
                        ii = i1.attr(catalogs1[0].list.thumb.attrName) ? (i1.attr(catalogs1[0].list.thumb.attrName).indexOf('http') == -1 ? host_img + (i1.attr(catalogs1[0].list.thumb.attrName).startsWith('/') ? i1.attr(catalogs1[0].list.thumb.attrName) : '/' + i1.attr(catalogs1[0].list.thumb.attrName)) : i1.attr(catalogs1[0].list.thumb.attrName)) : '';
                };
                ii = catalogs1[0].list.thumb.filter !== '' ? (ii.match(new RegExp(catalogs1[0].list.thumb.filter)) ? ii.match(new RegExp(catalogs1[0].list.thumb.filter))[1] : './img/img_broken.svg') : ii;
                if (ii !== undefined && ii.startsWith('/')) ii = catalogs1[0].link + ii;
                // Обновляем элементы карточки
                card.push({
                    title: tt,
                    original_title: '',
                    title_org: '',
                    url: uu,
                    img: ii,
                    quantity: '',
                    year: '',
                    rate: $(catalogs1[0].list.m_time.selector, html).text().trim().replace(/\n/g, '').replace(/\S+\s+/g, ''),
                    episodes_info: mm.toUpperCase(),
                    update: '',
                    score: '',
                    // Добавляем preview URL для превью
                    preview_url: ii.includes('.mp4') ? ii : ''
                });
            });
            return {
                card: card,
                page: page,
                total_pages: total_pages
            };
        };

        this.cardfavor = function (json) {
            var page = 'undefined';
            var total_pages = 1;
            var catalogs = json.filter(function (fp) {
                return fp.website === object.setup.title;
            });
            return {
                card: catalogs.reverse(),
                page: page,
                total_pages: total_pages
            };
        };

        this.append = function (data, append) {
            var _this3 = this;
            data.card.forEach(function (element) {
                var mytitle = element.title.replace('/', ' ');
                if (mytitle.indexOf(' ') != -1) mytitle = mytitle.split(' ')[0]
                var card = Lampa.Template.get('card', {
                    title: element.title,
                    release_year: ''
                });
                card.addClass('card--collection');
                var img = card.find('.card__img')[0];
                img.onload = function () {
                    card.addClass('card--loaded');
                };
                img.onerror = function (e) {
                    var hex = (Lampa.Utils.hash(element.title) * 1).toString(16);
                    while (hex.length < 6) hex += hex;
                    hex = hex.substring(0, 6);
                    var r = parseInt(hex.slice(0, 2), 16),
                        g = parseInt(hex.slice(2, 4), 16),
                        b = parseInt(hex.slice(4, 6), 16);
                    var hexText = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
                    card.find('.card__img').replaceWith('<div class="card__img">' + element.title.replace("-", " ") + '</div>');
                    card.find('.card__view').css({ 'background-color': '#' + hex, 'color': hexText });
                    card.addClass('card--loaded');
                };
                if (element.img) img.src = element.img; else img.onerror();

                if (element.rate) {
                    card.find('.card__view').append('<div class="card__type"></div>');
                    card.find('.card__type').text(element.rate);
                };

                card.on('hover:focus', function () {
console.log('Hover/Focus событие сработало');
    console.log('Элемент:', element);
                    
                    last = card[0];
                    scroll.update(card, true);
                    
                    let previewUrl = element.preview_url ? element.preview_url : element.img;
 console.log('Используется превью:', previewUrl);
                    let videoEl = $('<video autoplay loop muted playsinline style="position: absolute; top: 0; left: 0; width: 100%; height: auto; display: none;"></video>');
                    let sourceEl = $('<source src="' + previewUrl + '" type="video/mp4">');
                    videoEl.append(sourceEl);

                    card.css('position', 'relative');
                    card.append(videoEl);

                    videoEl.show().get(0).play();

                    card.off('mouseleave blur').on('mouseleave blur', function () {
                        videoEl.get(0).pause();
                        videoEl.remove();
                    });

                    if (element.img) Lampa.Background.change(cardImgBackground(element.img));
                    if (Lampa.Helper) Lampa.Helper.show('jaja_detail', 'Нажмите и удерживайте клавишу (ОК), чтобы просмотреть больше связанного контента', card);
                });

                card.on('hover:enter', function (target, card_data) {
                    if (object.setup.datatype !== 'json') cors = '';
                    last = card[0];
                    Lampa.Modal.open({
                        title: '',
                        html: Lampa.Template.get('modal_loading'),
                        size: 'small',
                        align: 'center',
                        mask: true,
                        onBack: function onBack() {
                            Lampa.Modal.close();
                            Lampa.Api.clear();
                            Lampa.Controller.toggle('content');
                        }
                    });
                    if (element.url.indexOf('jable') !== -1) {
                        network["native"](cors + element.url, function (str) {
                            Lampa.Modal.close();
                            if (object.setup.datatype == 'json') {
                                str = str.contents
                            };
                            var v = str.replace(/\n|\r/g, '').replace(/\\/g, '').match(/https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|](.mp4|.m3u8)/);
                            var videolink = v ? v[0] : '';
                            if (videolink) {
                                var video = {
                                    title: element.title,
                                    url: videolink,
                                    tv: false
                                };
                                Lampa.Player.play(video);
                                Lampa.Player.playlist([video]);
                            } else {
                                Lampa.Noty.show('Подходящих видео не найдено.');
                            };
                        }, function (a, c) {
                            Lampa.Noty.show(network.errorDecode(a, c));
                        }, false, {
                            dataType: object.setup.datatype
                        });
                        Lampa.Controller.toggle('content');
                    } else if (element.url.indexOf('njav') !== -1) {
                        network["native"](cors + element.url.replace('/v/', '/en/v/'), function (str) {
                            var regex = /Movie\({id:\s*'(\d+)'\}\)/;
                            var match = str.contents.match(regex);
                            var id = match && match[1];
                            if (id) {
                                network["native"](cors + 'https://njav.tv/zh/ajax/v/ ' + id + '/videos?r=' + Math.random(), function (str) {
                                    Lampa.Modal.close();
                                    str = JSON.parse(str.contents)
                                    if (str.status == 200) {
                                        Lampa.Iframe.show({
                                            url: str.data[0].url,
                                            onBack: function onBack() {
                                                Lampa.Controller.toggle('content');
                                            }
                                        });
                                        $('.iframe__body iframe').removeClass('iframe__window');
                                        $('.iframe__body iframe').addClass('screensaver-chrome__iframe');
                                    }
                                }, function (a, c) {
                                    Lampa.Noty.show(network.errorDecode(a, c));
                                }, false, {
                                    dataType: 'json'
                                });
                            }
                        }, function (a, c) {
                            Lampa.Noty.show(network.errorDecode(a, c));
                        }, false, {
                            dataType: object.setup.datatype
                        });
                    }
                });

                card.on('hover:long', function (target, card_data) {
                    if (object.setup.datatype !== 'json') cors = '';
                    Lampa.Modal.open({
                        title: '',
                        html: Lampa.Template.get('modal_loading'),
                        size: 'small',
                        align: 'center',
                        mask: true,
                        onBack: function onBack() {
                            Lampa.Modal.close();
                            Lampa.Api.clear();
                            Lampa.Controller.toggle('content');
                        }
                    });
                    if (element.url.indexOf('jable') !== -1) {
                        network["native"](cors + element.url, function (str) {
                            if (object.setup.datatype == 'json') {
                                str = str.contents
                            };
                            Lampa.Modal.close();
                            var archiveMenu = [];
                            var favtext = 'Добавить в коллекцию';
                            var isRadioFavorite = isFavorite(element.url);
                            if (isRadioFavorite) {
                                favtext = 'Удалить из коллекции'
                            };
                            archiveMenu.push({
                                title: favtext,
                                url: '',
                                type: 'fav'
                            });
                            archiveMenu.push({
                                title: element.episodes_info.split('-')[0] + ' - Все видео',
                                url: 'https://jable.tv/search/?q= '+element.episodes_info.split('-')[0]+'&from_videos=1',
                                type: 'list'
                            });
                            $('.models a.model', str).each(function (i, html) {
                                archiveMenu.push({
                                    title: $('.placeholder,img', html).attr('title') + ' - Все видео',
                                    url: $(html).attr('href'),
                                    type: 'list'
                                });
                            });
                            Lampa.Select.show({
                                title: 'Связанный контент',
                                items: archiveMenu,
                                onSelect: function (sel) {
                                    element.website = object.setup.title;
                                    var favtext = 'Добавлено в коллекцию';
                                    if (sel.type == 'fav') {
                                        var isRadioFavorite = isFavorite(element.url);
                                        if (isRadioFavorite) {
                                            removeFavorite(element);
                                            favtext = 'Удалено из коллекции'
                                        } else {
                                            saveFavoriteRadio(element);
                                        }
                                        if (object.type == 'fav') {
                                            Lampa.Activity.replace(activity);
                                        } else {
                                            Lampa.Noty.show(favtext)
                                            Lampa.Controller.toggle('content');
                                        }
                                    } else {
                                        Lampa.Activity.push({
                                            url: sel.url,
                                            title: 'Jable.tv - ' + sel.title,
                                            component: 'jaja',
                                            quantity: '',
                                            setup: object.setup,
                                            page: 1
                                        });
                                    }
                                },
                                onBack: function () {
                                    Lampa.Controller.toggle('content');
                                }
                            })
                        }, function (a, c) {
                            Lampa.Noty.show(network.errorDecode(a, c));
                        }, false, {
                            dataType: object.setup.datatype
                        });
                    } else if (element.url.indexOf('njav') !== -1) {
                        network["native"](cors + element.url.replace('/v/', '/en/v/'), function (str) {
                            if (object.setup.datatype == 'json') {
                                str = str.contents
                            };
                            Lampa.Modal.close();
                            var archiveMenu = [];
                            var favtext = 'Добавить в коллекцию';
                            var isRadioFavorite = isFavorite(element.url);
                            if (isRadioFavorite) {
                                favtext = 'Удалить из коллекции'
                            };
                            archiveMenu.push({
                                title: favtext,
                                url: '',
                                type: 'fav'
                            });
                            $('.detail-item a[href*="actresses/"],.detail-item a[href*="labels/"],.detail-item a[href*="tags/"]', str).each(function (i, html) {
                                archiveMenu.push({
                                    title: $(html).text() + ' - Все видео',
                                    url: 'https://njav.tv/en/ ' + $(html).attr('href'),
                                });
                            });
                            Lampa.Select.show({
                                title: 'Связанный контент',
                                items: archiveMenu,
                                onSelect: function (sel) {
                                    element.website = object.setup.title;
                                    var favtext = 'Добавлено в коллекцию';
                                    if (sel.type == 'fav') {
                                        var isRadioFavorite = isFavorite(element.url);
                                        if (isRadioFavorite) {
                                            removeFavorite(element);
                                            favtext = 'Удалено из коллекции'
                                        } else {
                                            saveFavoriteRadio(element);
                                        }
                                        if (object.type == 'fav') {
                                            Lampa.Activity.replace(activity);
                                        } else {
                                            Lampa.Noty.show(favtext)
                                            Lampa.Controller.toggle('content');
                                        }
                                    } else {
                                        Lampa.Activity.push({
                                            url: sel.url,
                                            title: 'NJAV.tv - ' + sel.title,
                                            component: 'jaja',
                                            quantity: '',
                                            setup: object.setup,
                                            page: 1
                                        });
                                    }
                                },
                                onBack: function () {
                                    Lampa.Controller.toggle('content');
                                }
                            })
                        }, function (a, c) {
                            Lampa.Noty.show(network.errorDecode(a, c));
                        }, false, {
                            dataType: object.setup.datatype
                        });
                    }
                });

                body.append(card);
                if (append) Lampa.Controller.collectionAppend(card);
                items.push(card);
            });
        };

        this.build = function (data) {
            var _this2 = this;
            var viewsort = '<div class=\"full-start__button selector view--sort\"><svg style=\"enable-background:new 0 0 512 512;\" version=\"1.1\" viewBox=\"0 0 24 24\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g id=\"info\"/><g id=\"icons\"><g id=\"menu\"><path d=\"M20,10H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2C22,10.9,21.1,10,20,10z\" fill=\"currentColor\"/><path d=\"M4,8h12c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2H4C2.9,4,2,4.9,2,6C2,7.1,2.9,8,4,8z\" fill=\"currentColor\"/><path d=\"M16,16H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2C18,16.9,17.1,16,16,16z\" fill=\"currentColor\"/></g></g></svg>   <span>Сортировать</span></div>';
            var viewcategory = '<div class=\"full-start__button selector view--category\"><svg style=\"enable-background:new 0 0 512 512;\" version=\"1.1\" viewBox=\"0 0 24 24\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g id=\"info\"/><g id=\"icons\"><g id=\"menu\"><path d=\"M20,10H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2C22,10.9,21.1,10,20,10z\" fill=\"currentColor\"/><path d=\"M4,8h12c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2H4C2.9,4,2,4.9,2,6C2,7.1,2.9,8,4,8z\" fill=\"currentColor\"/><path d=\"M16,16H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2C18,16.9,17.1,16,16,16z\" fill=\"currentColor\"/></g></g></svg>   <span>Категории</span></div>';
            var viewtags = '<div class=\"full-start__button selector view--tags\"><svg style=\"enable-background:new 0 0 512 512;\" version=\"1.1\" viewBox=\"0 0 24 24\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g id=\"info\"/><g id=\"icons\"><g id=\"menu\"><path d=\"M20,10H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2C22,10.9,21.1,10,20,10z\" fill=\"currentColor\"/><path d=\"M4,8h12c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2H4C2.9,4,2,4.9,2,6C2,7.1,2.9,8,4,8z\" fill=\"currentColor\"/><path d=\"M16,16H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2C18,16.9,17.1,16,16,16z\" fill=\"currentColor\"/></g></g></svg>   <span>Теги</span></div>';
            var channelbutton = '<div class=\"full-start__button selector view--channel\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 0.72 0.72\" xmlns=\"http://www.w3.org/2000/svg\" enable-background=\"new 0 0 24 24\"><path d=\"M0.66 0.303c0.003 -0.015 -0.009 -0.033 -0.024 -0.033l-0.171 -0.024L0.387 0.09c-0.003 -0.006 -0.006 -0.009 -0.012 -0.012 -0.015 -0.009 -0.033 -0.003 -0.042 0.012L0.258 0.246 0.087 0.27c-0.009 0 -0.015 0.003 -0.018 0.009 -0.012 0.012 -0.012 0.03 0 0.042l0.123 0.12 -0.03 0.171c0 0.006 0 0.012 0.003 0.018 0.009 0.015 0.027 0.021 0.042 0.012l0.153 -0.081 0.153 0.081c0.003 0.003 0.009 0.003 0.015 0.003h0.006c0.015 -0.003 0.027 -0.018 0.024 -0.036l-0.03 -0.171 0.123 -0.12c0.006 -0.003 0.009 -0.009 0.009 -0.015z\"/></svg>   <span>Источник</span></div>';
            var findbutton = '<div class=\"full-start__button selector open--find\"><svg width=\"24px\" height=\"24px\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"> <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.5122 4.43902C7.60446 4.43902 4.43902 7.60283 4.43902 11.5026C4.43902 15.4024 7.60446 18.5662 11.5122 18.5662C13.4618 18.5662 15.225 17.7801 16.5055 16.5055C17.7918 15.2251 18.5854 13.4574 18.5854 11.5026C18.5854 7.60283 15.4199 4.43902 11.5122 4.43902ZM2 11.5026C2 6.25314 6.26008 2 11.5122 2C16.7643 2 21.0244 6.25314 21.0244 11.5026C21.0244 13.6919 20.2822 15.7095 19.0374 17.3157L21.6423 19.9177C22.1188 20.3936 22.1193 21.1658 21.6433 21.6423C21.1673 22.1188 20.3952 22.1193 19.9187 21.6433L17.3094 19.037C15.7048 20.2706 13.6935 21.0052 11.5122 21.0052C6.26008 21.0052 2 16.7521 2 11.5026Z\" fill=\"currentColor\"/> </svg></div>';
            var favoritebutton = '<div class=\"full-start__button selector open--favorite\"><svg fill=\"Currentcolor\" width=\"24px\" height=\"24px\" viewBox=\"0 0 0.72 0.72\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0.66 0.303c0.003 -0.015 -0.009 -0.033 -0.024 -0.033l-0.171 -0.024L0.387 0.09c-0.003 -0.006 -0.006 -0.009 -0.012 -0.012 -0.015 -0.009 -0.033 -0.003 -0.042 0.012L0.258 0.246 0.087 0.27c-0.009 0 -0.015 0.003 -0.018 0.009 -0.012 0.012 -0.012 0.03 0 0.042l0.123 0.12 -0.03 0.171c0 0.006 0 0.012 0.003 0.018 0.009 0.015 0.027 0.021 0.042 0.012l0.153 -0.081 0.153 0.081c0.003 0.003 0.009 0.003 0.015 0.003h0.006c0.015 -0.003 0.027 -0.018 0.024 -0.036l-0.03 -0.171 0.123 -0.12c0.006 -0.003 0.009 -0.009 0.009 -0.015z\"/></svg>   <span>Коллекция</span></div>';

            Lampa.Template.add('button_category', "<style>.freetv_jaja.category-full .card__icons {top: 0.3em;right: 0.3em;justify-content: center !important;}.freetv_jaja.category-full{ padding-bottom:8em;margin-top: -1.5em;} .freetv_jaja div.card__view{ position:relative; background-color:#353535; background-color:#353535a6; border-radius:1em; cursor:pointer; padding-bottom: 56%; } .freetv_jaja.square_icons div.card__view{ padding-bottom:100% } .freetv_jaja.category-full .card__icons { top:0.3em; right:0.3em; justify-content:right; }.freetv_jaja div.card__title {white-space: nowrap;text-overflow: ellipsis;display: block;}.info_jaja div.info__right{padding-top:0;}.info_jaja .info.layer--width{height:auto;font-size:0.7em;} @media screen and (max-width: 385px) { .card--collection { width: 33.3%!important; } .info_jaja div.info__right{display:block!important;} .info_jaja .info.layer--width {overflow: scroll;} }</style><div class=\"full-start__buttons\">" + viewsort + viewcategory + viewtags + channelbutton + favoritebutton + findbutton + "</div>");
            Lampa.Template.add('info_web', '<div class="info layer--width"><div class="info__left"><div class="info__title"></div></div><div class="info__right">  <div id="web_filtr"></div></div></div>');
            var btn = Lampa.Template.get('button_category');
            info = Lampa.Template.get('info_web');
            info.find('#web_filtr').append(btn);
            info.find('.view--channel').on('hover:enter hover:click', function () {
                _this2.selectGroup();
            });
            info.find('.view--sort').on('hover:enter hover:click', function () {
                listNavigation();
            });
            info.find('.view--category').on('hover:enter hover:click', function () {
                listNavigation2();
            });
            info.find('.view--tags').on('hover:enter hover:click', function () {
                listNavigation3();
            });
            info.find('.open--favorite').on('hover:enter hover:click', function () {
                Lampa.Activity.push({
                    url: '',
                    title: object.setup.title + ' - Коллекция',
                    component: 'jaja',
                    quantity: '',
                    setup: object.setup,
                    type: 'fav',
                    page: 1
                });
            });
            info.find('.open--find').on('hover:enter hover:click', function () {
                Lampa.Input.edit({
                    title: object.setup.title + ' - Поиск видео',
                    value: '',
                    free: true,
                    nosave: true
                }, function (new_value) {
                    if (new_value) {
                        var searchurl = object.setup.search.url.replace('#msearchword', encodeURIComponent(new_value));
                        Lampa.Activity.push({
                            url: searchurl,
                            title: object.setup.title + ' - Поисковый запрос: \"' + new_value + '\"',
                            component: 'jaja',
                            quantity: '',
                            setup: object.setup,
                            page: 1
                        });
                    } else {
                        Lampa.Controller.toggle('content');
                    }
                })
            });
            this.selectGroup = function () {
                var balanser_ = Lampa.Storage.get('online_jaja_balanser')
                Lampa.Select.show({
                    title: 'Источник',
                    items: catalogs.map(function (elem, index) {
                        elem.selected = (balanser_ == elem.title);
                        return elem;
                    }),
                    onSelect: function onSelect(a) {
                        Lampa.Storage.set('online_jaja_balanser', a.title);
                        var catalogs1 = catalogs.filter(function (fp) {
                            return fp.title === a.title
                        });
                        Lampa.Activity.push({
                            url: a.category[0].url,
                            title: a.title + ' - ' + a.category[0].title,
                            quantity: a.category[0].quantity,
                            component: 'jaja',
                            setup: catalogs1[0],
                            page: 1
                        });
                    },
                    onBack: function onBack() {
                        Lampa.Controller.toggle('content');
                    }
                });
            };
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
                html.append(scroll.render());
                _this2.empty();
            }
        };

        this.empty = function () {
            var empty = new Lampa.Empty();
            scroll.append(empty.render());
            this.start = empty.start;
            this.activity.loader(false);
            this.activity.toggle();
        };

        var FAVORITE_RADIOS_KEY = 'favorite_jaja';

        function getFavoriteRadios() {
            return JSON.parse(localStorage.getItem(FAVORITE_RADIOS_KEY)) || [];
        }

        function saveFavoriteRadio(el) {
            var favoriteRadios = getFavoriteRadios();
            favoriteRadios.push(el);
            localStorage.setItem(FAVORITE_RADIOS_KEY, JSON.stringify(favoriteRadios));
        }

        function removeFavorite(el) {
            var updatedHistory = getFavoriteRadios().filter(function (obj) {
                return obj.url !== el.url;
            });
            Lampa.Storage.set(FAVORITE_RADIOS_KEY, updatedHistory);
        }

        function isFavorite(el) {
            var favoriteRadios = getFavoriteRadios();
            return favoriteRadios.some(function (a) {
                return a.url === el;
            });
        }

        function cardImgBackground(card_data) {
            if (Lampa.Storage.field('background')) {
                return Lampa.Storage.get('background_type', 'complex') == 'poster' && card_data ? card_data : card_data;
            }
            return '';
        };

        this.start = function () {
            if (Lampa.Activity.active().activity !== this.activity) return;
            var _this = this;
            Lampa.Controller.add('content', {
                toggle: function toggle() {
                    Lampa.Controller.collectionSet(scroll.render());
                    Lampa.Controller.collectionFocus(last || false, scroll.render());
                },
                left: function left() {
                    if (Navigator.canmove('left')) Navigator.move('left');
                    else Lampa.Controller.toggle('menu');
                },
                right: function right() {
                    if (Navigator.canmove('right')) Navigator.move('right');
                    else _this.selectGroup();
                },
                up: function up() {
                    if (Navigator.canmove('up')) Navigator.move('up');
                    else if (info) {
                        if (!info.find('.view--category').hasClass('focus')) {
                            Lampa.Controller.collectionSet(info);
                            Navigator.move('right')
                        } else Lampa.Controller.toggle('head');
                    } else Lampa.Controller.toggle('head');
                },
                down: function down() {
                    if (Navigator.canmove('down')) Navigator.move('down');
                    else if (info) {
                        if (info.find('.view--category').hasClass('focus')) {
                            Lampa.Controller.toggle('content');
                        }
                    }
                },
                back: function back() {
                    Lampa.Activity.backward();
                }
            });
            Lampa.Controller.toggle('content');
        };

        this.pause = function () {};
        this.stop = function () {};
        this.render = function () {
            return html;
        };
        this.destroy = function () {
            network.clear();
            scroll.destroy();
            if (info) info.remove();
            html.remove();
            body.remove();
            network = null;
            items = null;
            html = null;
            body = null;
            info = null;
        };
    }

    // Каталоги остаются без изменений
    var catalogs = [
        {
            title: "Jable.tv",
            link: "https://jable.tv ",
            show: "portrait",
            next: "search",
            datasort: "",
            use_referer: true,
            datatype: "text",
            category: [{
                title: 'Недавно обновленное',
                url: 'https://jable.tv/latest-updates/?lang=en ',
                quantity: ''
            }, {
                title: 'Новое',
                url: 'https://jable.tv/new-release/?lang=en ',
                quantity: ''
            }, {
                title: 'Популярные за неделю',
                url: 'https://jable.tv/hot/?lang=en ',
                quantity: ''
            }],
            list: {
                page: {
                    selector: ".pagination"
                },
                videoscontainer: {
                    selector: "div.video-img-box",
                    attrName: "",
                    filter: ""
                },
                title: {
                    selector: "h6.title a",
                    attrName: "text",
                    filter: ""
                },
                thumb: {
                    selector: "img",
                    attrName: "data-src",
                    filter: ""
                },
                link: {
                    selector: "h6.title a",
                    attrName: "href",
                    filter: ""
                },
                game_status: {
                    selector: ".pay-btn",
                    attrName: "",
                    filter: ""
                },
                mnumber: {
                    selector: "h6.title a",
                    attrName: "href",
                    filter: "\\/([a-zA-Z0-9-]+)\\/?$"
                },
                m_time: {
                    selector: ".label",
                    attrName: "",
                    filter: ""
                },
                team_home: {
                    selector: ".text-right",
                    attrName: "",
                    filter: ""
                },
                team_away: {
                    selector: ".text-left",
                    attrName: "",
                    filter: ""
                },
            },
            detail: {
                videoscontainer: {
                    selector: '',
                    attrName: '',
                    filter: ''
                },
                title: {
                    selector: 'a',
                    attrName: 'text',
                    filter: ''
                },
                link: {
                    selector: 'a',
                    attrName: 'href',
                    filter: ''
                }
            },
            search: {
                url: 'https://jable.tv/search/?q= #msearchword&from_videos=1'
            }
        },
        {
            title: "NJAV.tv",
            link: "https://njav.tv ",
            show: "portrait",
            next: "search",
            datasort: "",
            use_referer: true,
            datatype: "json",
            category: [{
                title: 'Главная',
                url: 'https://njav.tv/en/ ',
                quantity: ':gt(9)'
            }, {
                title: 'Недавно обновленное',
                url: 'https://njav.tv/en/recent-update ',
                quantity: ''
            }, {
                title: 'Новое',
                url: 'https://njav.tv/en/new-release ',
                quantity: ''
            }, {
                title: 'Популярное',
                url: 'https://njav.tv/en/trending ',
                quantity: ''
            }, {
                title: 'Рекомендуемое',
                url: 'https://njav.tv/en/recommended ',
                quantity: ''
            }, {
                title: 'Лучшее за день',
                url: 'https://njav.tv/en/today-hot ',
                quantity: ''
            }, {
                title: 'Лучшее за неделю',
                url: 'https://njav.tv/en/weekly-hot ',
                quantity: ''
            }, {
                title: 'Лучшее за месяц',
                url: 'https://njav.tv/en/monthly-hot ',
                quantity: ''
            }],
            list: {
                page: {
                    selector: ".pagination"
                },
                videoscontainer: {
                    selector: "div.box-item",
                    attrName: "",
                    filter: ""
                },
                title: {
                    selector: ".detail a",
                    attrName: "text",
                    filter: ""
                },
                thumb: {
                    selector: "img",
                    attrName: "data-src",
                    filter: ""
                },
                link: {
                    selector: ".detail a",
                    attrName: "href",
                    filter: ""
                },
                game_status: {
                    selector: ".pay-btn",
                    attrName: "",
                    filter: ""
                },
                mnumber: {
                    selector: "img",
                    attrName: "alt",
                    filter: ""
                },
                m_time: {
                    selector: ".duration",
                    attrName: "",
                    filter: ""
                },
                team_home: {
                    selector: ".text-right",
                    attrName: "",
                    filter: ""
                },
                team_away: {
                    selector: ".text-left",
                    attrName: "",
                    filter: ""
                },
            },
            detail: {
                videoscontainer: {
                    selector: '',
                    attrName: '',
                    filter: ''
                },
                title: {
                    selector: 'a',
                    attrName: 'text',
                    filter: ''
                },
                link: {
                    selector: 'a',
                    attrName: 'href',
                    filter: ''
                }
            },
            search: {
                url: 'https://njav.tv/en/search?keyword= #msearchword'
            }
        }
    ];

    var catalogs2 = [{
        title: "Jable.tv",
        link: "https://jable.tv ",
        show: "portrait",
        next: "search",
        datasort: "",
        use_referer: true,
        datatype: "text",
        category: [{
            title: 'BDSM',
            url: 'https://jable.tv/categories/bdsm/?lang=en ',
            quantity: ''
        }, {
            title: 'Только секс',
            url: 'https://jable.tv/categories/sex-only/?lang=en ',
            quantity: ''
        }, {
            title: 'Китайские субтитры',
            url: 'https://jable.tv/categories/chinese-subtitle/?lang=en ',
            quantity: ''
        }, {
            title: 'Насилие',
            url: 'https://jable.tv/categories/insult/?lang=en ',
            quantity: ''
        }, {
            title: 'Униформа',
            url: 'https://jable.tv/categories/uniform/?lang=en ',
            quantity: ''
        }, {
            title: 'Ролевые игры',
            url: 'https://jable.tv/categories/roleplay/?lang=en ',
            quantity: ''
        }, {
            title: 'Скрытая камера',
            url: 'https://jable.tv/categories/hidden-cam/?lang=en ',
            quantity: ''
        }, {
            title: 'Без цензуры',
            url: 'https://jable.tv/categories/uncensored/?lang=en ',
            quantity: ''
        }, {
            title: 'От первого лица',
            url: 'https://jable.tv/categories/pov/?lang=en ',
            quantity: ''
        }, {
            title: 'Групповой секс',
            url: 'https://jable.tv/categories/groupsex/?lang=en ',
            quantity: ''
        }, {
            title: 'В чулках',
            url: 'https://jable.tv/categories/pantyhose/?lang=en ',
            quantity: ''
        }, {
            title: 'Лесби',
            url: 'https://jable.tv/categories/lesbian/?lang=en ',
            quantity: ''
        }],
        list: {
            page: {
                selector: ".pagination"
            },
            videoscontainer: {
                selector: "div.video-img-box",
                attrName: "",
                filter: ""
            },
            title: {
                selector: "h6.title a",
                attrName: "text",
                filter: ""
            },
            thumb: {
                selector: "img",
                attrName: "data-src",
                filter: ""
            },
            link: {
                selector: "h6.title a",
                attrName: "href",
                filter: ""
            },
            game_status: {
                selector: ".pay-btn",
                attrName: "",
                filter: ""
            },
            mnumber: {
                selector: "h6.title a",
                attrName: "href",
                filter: "\\/([a-zA-Z0-9-]+)\\/?$"
            },
            m_time: {
                selector: ".label",
                attrName: "",
                filter: ""
            },
            team_home: {
                selector: ".text-right",
                attrName: "",
                filter: ""
            },
            team_away: {
                selector: ".text-left",
                attrName: "",
                filter: ""
            },
        },
        detail: {
            videoscontainer: {
                selector: '',
                attrName: '',
                filter: ''
            },
            title: {
                selector: 'a',
                attrName: 'text',
                filter: ''
            },
            link: {
                selector: 'a',
                attrName: 'href',
                filter: ''
            }
        },
        search: {
            url: 'https://jable.tv/search/?q= #msearchword&from_videos=1'
        }
    }];

    var catalogs3 = [{
        title: "Jable.tv",
        link: "https://jable.tv ",
        show: "portrait",
        next: "search",
        datasort: "most_favourited",
        use_referer: true,
        datatype: "text",
        category: [{
            url: 'https://jable.tv/tags/wedding-dress/?lang=en ',
            title: '# Свадебное платье',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/swimsuit/?lang=en ',
            title: '# Купальник',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/stockings/?lang=en ',
            title: '# Чулки',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/sportswear/?lang=en ',
            title: '# Спортивная одежда',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/school-uniform/?lang=en ',
            title: '# Школьная форма',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/pantyhose/?lang=en ',
            title: '# Колготки',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/maid/?lang=en ',
            title: '# Служанка',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/knee-socks/?lang=en ',
            title: '# Гольфы',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/kimono/?lang=en ',
            title: '# Кимоно',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/kemonomimi/?lang=en ',
            title: '# Кэмономими',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/glasses/?lang=en ',
            title: '# Очки',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/flesh-toned-pantyhose/?lang=en ',
            title: '# Колготки телесного цвета',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/fishnets/?lang=en ',
            title: '# Рыболовные сети',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/cheongsam/?lang=en ',
            title: '# Платье Чонсам',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/bunny-girl/?lang=en ',
            title: '# Девочка-кролик',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/black-pantyhose/?lang=en ',
            title: '# Черные колготки',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/Cosplay/?lang=en ',
            title: '# Персонаж аниме',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/tall/?lang=en ',
            title: '# Высокие',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/tattoo/?lang=en ',
            title: '# Татуировка',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/suntan/?lang=en ',
            title: '# Загар',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/small-tits/?lang=en ',
            title: '# Маленькие сиськи',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/short-hair/?lang=en ',
            title: '# Короткие волосы',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/mature-woman/?lang=en ',
            title: '# Зрелая женщина',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/hairless-pussy/?lang=en ',
            title: '# Безволосая киска',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/girl/?lang=en ',
            title: '# Девочка',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/flexible-body/?lang=en ',
            title: '# Гибкое тело',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/dainty/?lang=en ',
            title: '# Изысканность',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/big-tits/?lang=en ',
            title: '# Большие сиськи',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/beautiful-leg/?lang=en ',
            title: '# Красивые ноги',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/beautiful-butt/?lang=en ',
            title: '# Красивая задница',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/tit-wank/?lang=en ',
            title: '# Между сисек',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/squirting/?lang=en ',
            title: '# Брызги',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/spasms/?lang=en ',
            title: '# Спазмы',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/kiss/?lang=en ',
            title: '# Поцелуй',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/footjob/?lang=en ',
            title: '# Дрочка ногами',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/facial/?lang=en ',
            title: '# Уход за лицом',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/deep-throat/?lang=en ',
            title: '# Глубокая глотка',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/cum-in-mouth/?lang=en ',
            title: '# Кончить в рот',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/creampie/?lang=en ',
            title: '# Кремовый пирог',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/blowjob/?lang=en ',
            title: '# Минет',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/anal-sex/?lang=en ',
            title: '# Анальный секс',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/tune/?lang=en ',
            title: '# Мелодия',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/torture/?lang=en ',
            title: '# Пытка',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/soapland/?lang=en ',
            title: '# Мыльная страна',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/quickie/?lang=en ',
            title: '# Быстро',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/piss/?lang=en ',
            title: '# Писс',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/outdoor/?lang=en ',
            title: '# На открытом воздухе',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/massage/?lang=en ',
            title: '# Массаж',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/masochism-guy/?lang=en ',
            title: '# Мазохистский парень',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/groupsex/?lang=en ',
            title: '# Групповуха',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/gang-r__e/?lang=en ',
            title: '# Банда R**e',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/crapulence/?lang=en ',
            title: '# Похмелье',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/chizyo/?lang=en ',
            title: '# Шлюха',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/chikan/?lang=en ',
            title: '# Приставание',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/breast-milk/?lang=en ',
            title: '# Грудное молоко',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/bondage/?lang=en ',
            title: '# Бондаж',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/3p/?lang=en ',
            title: '# 3P',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/10-times-a-day/?lang=en ',
            title: '# 10 раз в день',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/10-times-a-day/?lang=en ',
            title: '# 10 раз в день',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/virginity/?lang=en ',
            title: '# Девственность',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/ugly-man/?lang=en ',
            title: '# Уродливый человек',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/time-stop/?lang=en ',
            title: '# Остановка времени',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/temptation/?lang=en ',
            title: '# Искушение',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/sex-beside-husband/?lang=en ',
            title: '# Секс рядом с мужем',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/rainy-day/?lang=en ',
            title: '# Дождливый день',
            quantity: ''
        }, {
            url: 'https://jable.tv/tagstr/?lang=en ',
            title: '# Измена',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/love-potion/?lang=en ',
            title: '# Любовное зелье',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/hidden-cam/?lang=en ',
            title: '# Утечка',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/kinship/?lang=en ',
            title: '# Инцест',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/hypnosis/?lang=en ',
            title: '# Гипноз',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/giant/?lang=en ',
            title: '# Гигант',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/black/?lang=en ',
            title: '# Черный',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/avenge/?lang=en ',
            title: '# Месть',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/age-difference/?lang=en ',
            title: '# Разница в возрасте',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/affair/?lang=en ',
            title: '# Обман',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/wife/?lang=en ',
            title: '# Замужняя женщина',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/widow/?lang=en ',
            title: '# Вдова',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/team-manager/?lang=en ',
            title: '# Менеджер команды',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/teacher/?lang=en ',
            title: '# Учитель',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/club-hostess-and-sex-worker/?lang=en ',
            title: '# Секс-работница',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/private-teacher/?lang=en ',
            title: '# Частный учитель',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/ol/?lang=en ',
            title: '# ОЛ',
            quantity: ''
        }, {
            url: 'https://jable.tv/tagsurse/?lang=en ',
            title: '# Медсестра',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/idol/?lang=en ',
            title: '# Идол',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/housewife/?lang=en ',
            title: '# Домохозяйка',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/fugitive/?lang=en ',
            title: '# Беглец',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/flight-attendant/?lang=en ',
            title: '# Бортпроводник',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/female-anchor/?lang=en ',
            title: '# Женщина-ведущая',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/doctor/?lang=en ',
            title: '# Доктор',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/detective/?lang=en ',
            title: '# Детектив',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/couple/?lang=en ',
            title: '# Пара',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/tram/?lang=en ',
            title: '# Трамвай',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/toilet/?lang=en ',
            title: '# Туалет',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/swimming-pool/?lang=en ',
            title: '# Бассейн',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/store/?lang=en ',
            title: '# Магазин',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/school/?lang=en ',
            title: '# Школа',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/prison/?lang=en ',
            title: '# Тюрьма',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/magic-mirror/?lang=en ',
            title: '# Волшебное зеркало',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/library/?lang=en ',
            title: '# Библиотека',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/hot-spring/?lang=en ',
            title: '# Горячий источник',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/gym-room/?lang=en ',
            title: '# Спортзал',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/first-night/?lang=en ',
            title: '# Первая ночь',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/car/?lang=en ',
            title: '# Автомобиль',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/bathing-place/?lang=en ',
            title: '# Место для купания',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/video-recording/?lang=en ',
            title: '# Видеозапись',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/variety-show/?lang=en ',
            title: '# Варьете (Шоу)',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/thanksgiving/?lang=en ',
            title: '# День благодарения',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/more-than-4-hours/?lang=en ',
            title: '# Более 4 часов',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/festival/?lang=en ',
            title: '# Фестиваль',
            quantity: ''
        }, {
            url: 'https://jable.tv/tags/debut-retires/?lang=en ',
            title: '# Дебют / Уходит в отставку',
            quantity: ''
        }],
        list: {
            page: {
                selector: ".pagination"
            },
            videoscontainer: {
                selector: "div.video-img-box",
                attrName: "",
                filter: ""
            },
            title: {
                selector: "h6.title a",
                attrName: "text",
                filter: ""
            },
            thumb: {
                selector: "img",
                attrName: "data-src",
                filter: ""
            },
            link: {
                selector: "h6.title a",
                attrName: "href",
                filter: ""
            },
            game_status: {
                selector: ".pay-btn",
                attrName: "",
                filter: ""
            },
            mnumber: {
                selector: "h6.title a",
                attrName: "href",
                filter: "\\/([a-zA-Z0-9-]+)\\/?$"
            },
            m_time: {
                selector: ".label",
                attrName: "",
                filter: ""
            },
            team_home: {
                selector: ".text-right",
                attrName: "",
                filter: ""
            },
            team_away: {
                selector: ".text-left",
                attrName: "",
                filter: ""
            },
        },
        detail: {
            videoscontainer: {
                selector: '',
                attrName: '',
                filter: ''
            },
            title: {
                selector: 'a',
                attrName: 'text',
                filter: ''
            },
            link: {
                selector: 'a',
                attrName: 'href',
                filter: ''
            }
        },
        search: {
            url: 'https://jable.tv/search/?q= #msearchword&from_videos=1'
        }
    }];

    function listNavigation() {
        if (Lampa.Storage.get('online_jaja_balanser') == '') {
            Lampa.Storage.set('online_jaja_balanser', catalogs[0].title);
        }
        var balanser = Lampa.Storage.get('online_jaja_balanser');
        var catalogs1 = catalogs.filter(function (fp) {
            return fp.title === balanser
        });
        if (catalogs1.length === 0) {
            catalogs1[0] = catalogs[0];
            Lampa.Storage.set('online_jaja_balanser', catalogs[0].title);
        };
        Lampa.Select.show({
            title: catalogs1[0].title,
            items: catalogs1[0].category,
            onSelect: function onSelect(a) {
                Lampa.Activity.push({
                    url: a.url,
                    title: catalogs1[0].title + ' - ' + a.title,
                    quantity: a.quantity,
                    component: 'jaja',
                    setup: catalogs1[0],
                    page: 1
                });
            },
            onBack: function onBack() {
                Lampa.Controller.toggle('content');
            }
        });
    }

    function listNavigation2() {
        if (Lampa.Storage.get('online_jaja_balanser') == '') {
            Lampa.Storage.set('online_jaja_balanser', catalogs2[0].title);
        }
        var balanser = Lampa.Storage.get('online_jaja_balanser');
        var catalogs1 = catalogs2.filter(function (fp) {
            return fp.title === balanser
        });
        if (catalogs1.length === 0) {
            catalogs1[0] = catalogs2[0];
            Lampa.Storage.set('online_jaja_balanser', catalogs2[0].title);
        };
        Lampa.Select.show({
            title: catalogs1[0].title,
            items: catalogs1[0].category,
            onSelect: function onSelect(a) {
                Lampa.Activity.push({
                    url: a.url,
                    title: catalogs1[0].title + ' - ' + a.title,
                    quantity: a.quantity,
                    component: 'jaja',
                    setup: catalogs1[0],
                    page: 1
                });
            },
            onBack: function onBack() {
                Lampa.Controller.toggle('content');
            }
        });
    }

    function listNavigation3() {
        if (Lampa.Storage.get('online_jaja_balanser') == '') {
            Lampa.Storage.set('online_jaja_balanser', catalogs3[0].title);
        }
        var balanser = Lampa.Storage.get('online_jaja_balanser');
        var catalogs1 = catalogs3.filter(function (fp) {
            return fp.title === balanser
        });
        if (catalogs1.length === 0) {
            catalogs1[0] = catalogs3[0];
            Lampa.Storage.set('online_jaja_balanser', catalogs3[0].title);
        };
        Lampa.Select.show({
            title: catalogs1[0].title,
            items: catalogs1[0].category,
            onSelect: function onSelect(a) {
                Lampa.Activity.push({
                    url: a.url,
                    title: catalogs1[0].title + ' - ' + a.title,
                    quantity: a.quantity,
                    component: 'jaja',
                    setup: catalogs1[0],
                    page: 1
                });
            },
            onBack: function onBack() {
                Lampa.Controller.toggle('content');
            }
        });
    }

    function startjaja() {
        window.plugin_jaja_ready = true;
        Lampa.Component.add('jaja', jaja);
        function addSettingsjaja() {
            var ico = '<svg width="800px" height="800px" viewBox="20 50 115 115" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M120.69 101.68C114.53 101.68 110.33 97.91 110.16 92.51C110.03 88.1 112.58 84.29 116.64 84.29C121.81 84.29 123.93 89.44 120.86 92.48L116.37 89.26C114.99 90.77 115.48 96.19 120.14 96.19C124.21 96.19 126.14 93.36 126.14 88.92C126.14 84 123.06 80.06 114.73 80.06C107.31 80.06 103.5 86.06 103.5 94.71C103.5 99.24 106.09 102.81 110.16 102.81C114.21 102.81 116.14 99.98 116.14 95.54C116.14 95.54 114.21 92.71 110.16 92.71C106.11 92.71 103.5 95.54 103.5 99.98 107.41 102.81C111.33 102.81 113.26 99.98 113.26 95.54C113.26 91.1 111.33 88.27 107.31 88.27C103.26 88.27 100.67 91.1 100.67 95.54C100.67 99.98 103.26 102.81 107.31 102.81C111.33 102.81 113.26 99.98 113.26 95.54C113.26 91.1 111.33 88.27 107.31 88.27C103.26 88.27 100.67 91.1 100.67 95.54C100.67 104.98 108.26 107.81 112.31 107.81C116.33 107.81 118.26 104.98 118.26 100.54C118.26 96.1 115.67 93.27 111.62 93.27C107.57 93.27 105.64 96.1 105.64 100.54C105.64 104.98 108.26 107.81 112.31 107.81C116.33 107.81 118.26 104.98 118.26 100.54C118.26 96.1 115.67 93.27 111.62 93.27C107.57 93.27 105.64 96.1 105.64 100.54C105.64 105.77 106.48 111.19 111.14 111.19C115.21 111.19 117.14 108.36 117.14 103.92C117.14 99.48 115.21 96.65 111.14 96.65C107.09 96.65 105.16 99.48 105.16 103.92C105.16 108.36 107.09 111.19 111.14 111.19C115.21 111.19 117.14 108.36 117.14 103.92C117.14 99.48 115.21 96.65 111.14 96.65C107.09 96.65 95.16 99.48 95.16 103.92C95.16 108.36 97.09 111.19 111.14 111.19C115.21 111.19 117.14 108.36 117.14 103.92C117.14 99.48 115.21 96.65 111.14 96.65C107.09 96.65 105.16 99.48 105.16 103.92C105.16 108.36 107.09 111.19 111.14 111.19C115.21 111.19 117.14 108.36 117.14 103.92C117.14 99.48 115.21 96.65 111.14 96.65ZM63.6 96.91C66.08 94.77 61.6 89.57 59.07 91.76C56.54 93.95 60.88 99.26 63.6 96.91ZM43.68 135.45C47.38 133.26 43.11 125.64 39.18 127.97C35.58 130.1 40 137.62 43.68 135.45ZM26.57 104.58C22.9 103.64 20.9 111.32 24.66 112.28C28.42 113.24 30.6 105.62 26.57 104.58ZM28.37 130.32C25.29 132.54 29.91 139 33.06 136.73C36.21 134.45 31.74 127.89 28.37 130.32ZM35.49 111.21C31.41 109.63 28.07 118.21 32.26 119.78C36.45 121.35 40.6 112.94 40.6 108.5C40.6 104.58 36.45 102.94 32.26 104.58C28.07 106.21 28.07 114.79 32.26 116.36C36.45 117.93 40.6 109.51 40.6 104.58C40.6 100.64 36.45 98.01 32.26 98.01C28.07 98.01 28.07 106.59 32.26 108.16ZM46.49 99.73C45.09 95.32 36.86 97.23 36.86 101.68C36.86 106.13 45.09 108.04 46.49 104.58ZM47.49 144.81C47.56 148.61 55.49 148.49 55.42 144.6C55.35 140.71 47.4 140.66 47.47 144.81ZM52.84 135.61C53.33 139.76 62.01 138.76 61.5 134.51C60.99 130.26 52.29 131.07 52.82 135.61ZM68.38 133.11C69.68 136.31 76.38 133.61 75.03 130.33C73.68 127.05 66.93 129.61 68.36 133.11ZM72.93 122.57C72.41 126.33 80.26 127.46 80.8 123.57C81.34 119.68 72.95 120.8 72.93 122.57ZM89.48 134.21C88.77 137.21 95.15 135.76 95.88 132.48C96.61 129.3 88.46 130.43 89.48 134.21ZM109.82 133C112.26 135 116.41 129.93 113.92 127.9C111.43 125.87 109.82 129.87 109.82 133ZM120.69 101.68C114.53 101.68 110.33 97.91 110.16 92.51C109.03 88.1 111.58 84.29 116.64 84.29C121.81 84.29 123.93 89.44 120.86 92.48C117.79 95.51 119.91 92.71 119.91 97.15C119.91 101.6 124.41 105.44 120.69 101.68ZM117.27 122.92C117.267 123.857 117.27 124.792 117.27 125.71C122.11 130.96 114.27 140.37 108.27 136.29C105.36 137.594 102.41 138.27 99.23 138.27C96.06 138.27 93.21 137.594 90.73 136.29C87.91 134.99 85.77 132.4 85.73 129.21C85.7 125.1 81.55 127.93 77.4 125.71C73.25 123.49 73.25 117.87 73.25 112.43C73.25 107.98 75.84 104.15 79.9 104.15C83.96 104.15 86.81 106.98 86.81 111.43C86.81 115.88 90.21 118.71 94.36 118.71C98.51 118.71 100.44 115.88 100.44 111.43C100.44 107.28 98.51 104.45 94.36 104.45C90.21 104.45 87.38 101.62 87.38 97.21C87.38 92.8 90.21 89.97 94.36 89.97C98.51 89.97 100.44 92.8 100.44 97.21C100.44 92.76 98.51 90.03 94.36 90.03C89.21 90.03 87.28 92.86 87.28 97.21C87.28 101.56 90.06 104.39 94.21 104.39C98.36 104.39 100.29 101.56 100.29 97.21C100.29 92.86 98.36 89.97 94.21 89.97C90.06 89.97 87.28 92.76 87.28 97.21Z\" fill=\"currentcolor\"/></svg>';
            var menu_item = $('<li class="menu__item selector" data-action="jaja"><div class="menu__ico">' + ico + '</div><div class="menu__text">JaJa 18+</div></li>');
            menu_item.on('hover:enter', function () {
                listNavigation();
            });
            $('.menu .menu__list').eq(0).append(menu_item);
        }
        if (window.appready) addSettingsjaja()
        else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type == 'ready') addSettingsjaja()
            })
        }
    }
    if (!window.plugin_jaja_ready) startjaja();
})();
