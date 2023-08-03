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
        var cors = 'https://api.allorigins.win/get?url=';
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
        // if (Lampa.Platform.is('android')) {
        //     cors = '';
        // } else {
        //     cors = 'https://cors.eu.org/';
        // }

        this.create = function () {
            // console.log(object)
            var _this = this;

            this.activity.loader(true);

            if (object.setup.datatype !== 'json') cors = '';

            if (object.type == 'fav') { 
                var data = _this.cardfavor(getFavoriteRadios());
                _this.build(data);
            } else {
                network["native"](cors + object.url, function (str) {
                    //this.build.bind(this)

                    var data = _this.card(str);
                    _this.build(data);


                    // var empty = new Lampa.Empty();
                    // html.append(empty.render());
                    // _this.start = empty.start;

                    // _this.activity.loader(false);

                    //_this.activity.toggle();
                }, function (a, c) {
                    Lampa.Noty.show(network.errorDecode(a, c));
                }, false, {
                    dataType: object.setup.datatype,
                    // headers: {
                    //     'User-Agent': PC_UA
                    // }
                });
            }
            
            return this.render();
        };

        // this.next = function () {
        //     var _this2 = this;
        //     if (waitload) return;
        //     if (object.setup.datatype !== 'json') cors = '';
        //     // if (object.gotopage) {
        //     // var postdata = {
        //     //     before: object.gotopage[0],
        //     // };
        //     waitload = true;
        //     object.page++;
        //     network.silent(cors + object.url + '?page=' + object.page, function (str) {
        //         var result = _this2.card(str);
        //         _this2.append(result, true);
        //         if (result.card.length) waitload = false;
        //         Lampa.Controller.enable('content');
        //     }, function (a, c) {
        //         Lampa.Noty.show(network.errorDecode(a, c));
        //     }, false, {
        //         dataType: 'json'
        //     });
        //     // }
        // };

        this.next = function (page) {
            var _this2 = this;
            if (total_pages == 1 || total_pages == 0) waitload = true;
            
            if (waitload) return;
            if (object.setup.datatype !== 'json') cors = '';
            waitload = true;
            object.page++;
            //console.log(object.page);
            network.clear();
            network.timeout(1000 * 40);
            if (typeof page == 'undefined') return;
            if (page.indexOf('undefined') != -1) return;
            
            if (page.indexOf('before=') !== -1) {
            } else {
                var regex = /page=(\d+)/;
                var match = page.match(regex);
                if (match) {
                    page = page.replace('page=' + match[1], 'page=' + match[1]++)
                } else {
                    page = page.replace(page.match(/[0-9]+(?=[^0-9]*$)(.*)/)[0], '') + object.page + (page.match(/[0-9]+(?=[^0-9]*$)(.*)/)[1] ? page.match(/[0-9]+(?=[^0-9]*$)(.*)/)[1] : '');

                }
            }

            if (object.use_referer) {
                network["native"](cors + page, function (result) {
                    var data = _this2.card(result);
                    object.data = data;
                    _this2.append(data,true);
                    if (data.card.length) waitload = false;
                    // Lampa.Controller.toggle('content');
                    _this2.activity.loader(false);
                }, function (a, c) {
                    if (a.status == 404) {
                        // Lampa.Noty.show('ohh,это последняя страница');
                    } else {
                        Lampa.Noty.show(network.errorDecode(a, c));
                    }
                }, false, {
                    dataType: object.setup.datatype,
                    headers: {
                        'Referer': object.url.match(/(http|https):\/\/(www.)?(\w+(\.)?)+/)[0] + '/',
                        'User-Agent': MOBILE_UA,
                        // 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                        // 'Accept-Language': 'en,zh-CN;q=0.9,zh;q=0.8',
                        // 'Origin': object.url.match(/(http|https):\/\/(www.)?(\w+(\.)?)+/)[0]
                    }
                });
            } else {
                network["native"](cors + page, function (result) {
                    var data = _this2.card(result);
                    object.data = data;
                    _this2.append(data,true);
                    if (data.card.length) waitload = false;
                    // Lampa.Controller.toggle('content');
                    _this2.activity.loader(false);
                }, function (a, c) {
                    if (a.status == 404) {
                        // Lampa.Noty.show('ohh, это последняя страница');
                    } else {
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

            // console.log(catalogs1[0])
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

            //console.log(object.search)
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
                    // console.log(/[0-9]+(?=[^0-9]*$)(.*)/i.test(page))
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
                    update: '',//$('span.pic-text', html).text().indexOf('/' != -1) ? $('span.pic-text', html).text().split('/')[0].replace('Законченный','') : $('span.pic-text', html).text().replace('Законченный',''),
                    score: '',//$('span.pic-tag', html).text()
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
            //console.log(data)
            data.card.forEach(function (element) {
                //console.log(element)
                var mytitle = element.title.replace('/', ' ');
                if (mytitle.indexOf(' ' != -1)) mytitle = mytitle.split(' ')[0]
                var card = Lampa.Template.get('card', {
                    title: element.title,
                    release_year: ''
                });
                //card.addClass('card--category');
                card.addClass('card--collection');
                var img = card.find('.card__img')[0];
                img.onload = function () {
                    card.addClass('card--loaded');
                };
                img.onerror = function (e) {
                    // img.src = './img/img_broken.svg';
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
                // card.find('.card__img').attr('src', element.img);
                if (element.rate) {
                    card.find('.card__view').append('<div class="card__type"></div>');
                    card.find('.card__type').text(element.rate);
                };
                // console.log(element.quantity.length)
                if (element.quantity) {
                    // var icon = document.createElement('div');
                    // icon.classList.add('card__icon');
                    // icon.classList.add('icon--sport');
                    // card.find('.card__icons-inner').append(icon);
                    card.find('.card__icons-inner').text(element.quantity)
                    card.find('.card__icons-inner').css({ 'padding': '0.4em 0.4em' })
                    // card.find('.card__view').append('<div class="card__icons"></div>');
                    // card.find('.card__icons-inner').text(element.quantity);
                }
                /*card.find('.card__view').append('<div class="card__quality"></div>');
                card.find('.card__quality').text(element.score);*/
                if (element.update) {
                    card.find('.card__view').append('<div class="card__quality"></div>');
                    card.find('.card__quality').text(element.update);
                };

                card.on('hover:focus', function () {
                    last = card[0];
                    // var match = element.url.match(/\/([a-zA-Z0-9-]+)\/?$/);

                    // if (match) {
                    //     element.episodes_info = match[1].toUpperCase();
                    // } else {
                    //     element.episodes_info = element.title;
                    // }

                    scroll.update(card, true);
                    info.find('.info__title').text(element.episodes_info);
                    info.find('.info__title-original').text(element.quantity);
                    info.find('.info__rate span').text(element.rate);
                    info.find('.info__create').text(element.episodes_info);
                    info.find('.info__rate').toggleClass('hide', !(element.rate > 0));
                    var maxrow = Math.ceil(items.length / 7) - 1;
                    if (Math.ceil(items.indexOf(card) / 7) >= maxrow) _this3.next(data.page);
                    // if (scroll.isEnd()) _this3.next();
                    // if (element.img) Lampa.Background.change(cardImgBackground(element.img));
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
                        network["native"](cors + element.url.replace('/v/', '/zh/v/'), function (str) {
                            var regex = /Video\({id:\s*'(\d+)'\}\)/;
                            var match = str.contents.match(regex);
                            var id = match && match[1];
                            if (id) {
                                network["native"](cors + 'https://njav.tv/zh/api/v/' + id + '/videos?r=' + Math.random(), function (str) {
                                    Lampa.Modal.close();
                                    str = JSON.parse(str.contents)
                                    if (str.status == 200) {
                                        // console.log(str.data[0].url)
                                        Lampa.Iframe.show({
                                            //url: $('.embed-responsive-item', str).attr('src'),
                                            url: str.data[0].url,
                                            onBack: function onBack() {
                                                Lampa.Controller.toggle('content');
                                            }
                                        });
                                        $('.iframe__body iframe').removeClass('iframe__window');
                                        $('.iframe__body iframe').addClass('screensaver-chrome__iframe');
                                        // Lampa.Iframe.show({
                                        //     url: str.data[0].url,
                                        //     onBack: function onBack() { Lampa.Controller.toggle('content'); }
                                        // });
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
                            // console.log(element,object)
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
                                url: 'https://jable.tv/search/?q='+element.episodes_info.split('-')[0]+'&from_videos=1',
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
                                            // var indexToRemove = getFavoriteRadios().findIndex(function (radio) {
                                            //     return radio.url === element.url;
                                            // });
                                            // if (indexToRemove !== -1) {
                                            //     removeFavoriteRadio(indexToRemove);
                                            //     favtext = 'Удалено из коллекции'
                                            // }
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
                        network["native"](cors + element.url.replace('/v/', '/zh/v/'), function (str) {
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
                                    url: 'https://njav.tv/zh/' + $(html).attr('href'),
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
                                            // var indexToRemove = getFavoriteRadios().findIndex(function (radio) {
                                            //     return radio.url === element.url;
                                            // });
                                            // if (indexToRemove !== -1) {
                                            //     removeFavoriteRadio(indexToRemove);
                                                
                                            //     favtext = 'Удалено из коллекции'
                                            // }
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
            //info = Lampa.Template.get('info');style="height:5em"
            var channelbutton = '<div class=\"full-start__button selector view--channel\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M6.5 3.588c-.733 0-1.764.175-2.448.311a.191.191 0 0 0-.153.153c-.136.684-.31 1.715-.31 2.448 0 .733.174 1.764.31 2.448a.191.191 0 0 0 .153.153c.684.136 1.715.31 2.448.31.733 0 1.764-.174 2.448-.31a.191.191 0 0 0 .153-.153c.136-.684.31-1.715.31-2.448 0-.733-.174-1.764-.31-2.448a.191.191 0 0 0-.153-.153c-.684-.136-1.715-.31-2.448-.31ZM3.741 2.342C4.427 2.205 5.595 2 6.5 2c.905 0 2.073.205 2.759.342a1.78 1.78 0 0 1 1.4 1.4c.136.685.341 1.853.341 2.758s-.205 2.073-.342 2.759a1.78 1.78 0 0 1-1.4 1.4C8.574 10.794 7.406 11 6.5 11s-2.073-.205-2.759-.342a1.78 1.78 0 0 1-1.4-1.4C2.206 8.574 2 7.406 2 6.5s.205-2.073.342-2.759a1.78 1.78 0 0 1 1.4-1.4ZM6.5 14.588c-.733 0-1.764.175-2.448.311a.191.191 0 0 0-.153.153c-.136.684-.31 1.715-.31 2.448 0 .733.174 1.764.31 2.448a.191.191 0 0 0 .153.153c.684.136 1.715.31 2.448.31.733 0 1.764-.174 2.448-.31a.191.191 0 0 0 .153-.153c.136-.684.31-1.715.31-2.448 0-.733-.174-1.764-.31-2.448a.191.191 0 0 0-.153-.153c-.684-.136-1.715-.31-2.448-.31Zm-2.759-1.246C4.427 13.205 5.595 13 6.5 13c.905 0 2.073.205 2.759.342a1.78 1.78 0 0 1 1.4 1.4c.136.685.341 1.853.341 2.758s-.205 2.073-.342 2.759a1.78 1.78 0 0 1-1.4 1.4C8.574 21.794 7.406 22 6.5 22s-2.073-.205-2.759-.342a1.78 1.78 0 0 1-1.4-1.4C2.206 19.574 2 18.406 2 17.5s.205-2.073.342-2.759a1.78 1.78 0 0 1 1.4-1.4ZM17.5 3.588c-.733 0-1.764.175-2.448.311a.191.191 0 0 0-.153.153c-.136.684-.31 1.715-.31 2.448 0 .733.174 1.764.31 2.448a.191.191 0 0 0 .153.153c.684.136 1.715.31 2.448.31.733 0 1.764-.174 2.448-.31a.191.191 0 0 0 .153-.153c.136-.684.31-1.715.31-2.448 0-.733-.174-1.764-.31-2.448a.191.191 0 0 0-.153-.153c-.684-.136-1.715-.31-2.448-.31Zm-2.759-1.246C15.427 2.205 16.595 2 17.5 2c.905 0 2.073.205 2.759.342a1.78 1.78 0 0 1 1.4 1.4c.136.685.341 1.853.341 2.758s-.205 2.073-.342 2.759a1.78 1.78 0 0 1-1.4 1.4c-.685.136-1.853.341-2.758.341s-2.073-.205-2.759-.342a1.78 1.78 0 0 1-1.4-1.4C13.206 8.574 13 7.406 13 6.5s.205-2.073.342-2.759a1.78 1.78 0 0 1 1.4-1.4ZM17.5 14.588c-.733 0-1.764.175-2.448.311a.191.191 0 0 0-.153.153c-.136.684-.31 1.715-.31 2.448 0 .733.174 1.764.31 2.448a.191.191 0 0 0 .153.153c.684.136 1.715.31 2.448.31.733 0 1.764-.174 2.448-.31a.191.191 0 0 0 .153-.153c.136-.684.31-1.715.31-2.448 0-.733-.174-1.764-.31-2.448a.191.191 0 0 0-.153-.153c-.684-.136-1.715-.31-2.448-.31Zm-2.759-1.246c.686-.137 1.854-.342 2.759-.342.905 0 2.073.205 2.759.342a1.78 1.78 0 0 1 1.4 1.4c.136.685.341 1.853.341 2.758s-.205 2.073-.342 2.759a1.78 1.78 0 0 1-1.4 1.4c-.685.136-1.853.341-2.758.341s-2.073-.205-2.759-.342a1.78 1.78 0 0 1-1.4-1.4C13.206 19.574 13 18.406 13 17.5s.205-2.073.342-2.759a1.78 1.78 0 0 1 1.4-1.4Z\" fill=\"currentColor\"/></svg>   <span>Источник</span>\n    </div>'
            var findbutton = '<div class=\"full-start__button selector open--find\"><svg width=\"24px\" height=\"24px\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"> <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.5122 4.43902C7.60446 4.43902 4.43902 7.60283 4.43902 11.5026C4.43902 15.4024 7.60446 18.5662 11.5122 18.5662C13.4618 18.5662 15.225 17.7801 16.5055 16.5055C17.7918 15.2251 18.5854 13.4574 18.5854 11.5026C18.5854 7.60283 15.4199 4.43902 11.5122 4.43902ZM2 11.5026C2 6.25314 6.26008 2 11.5122 2C16.7643 2 21.0244 6.25314 21.0244 11.5026C21.0244 13.6919 20.2822 15.7095 19.0374 17.3157L21.6423 19.9177C22.1188 20.3936 22.1193 21.1658 21.6433 21.6423C21.1673 22.1188 20.3952 22.1193 19.9187 21.6433L17.3094 19.037C15.7048 20.2706 13.6935 21.0052 11.5122 21.0052C6.26008 21.0052 2 16.7521 2 11.5026Z\" fill=\"currentColor\"/> </svg></div>'
            var favoritebutton = '<div class=\"full-start__button selector open--favorite\"><svg fill=\"Currentcolor\" width=\"24px\" height=\"24px\" viewBox=\"0 0 0.72 0.72\" xmlns=\"http://www.w3.org/2000/svg\" enable-background=\"new 0 0 24 24\"><path d=\"M0.66 0.303c0.003 -0.015 -0.009 -0.033 -0.024 -0.033l-0.171 -0.024L0.387 0.09c-0.003 -0.006 -0.006 -0.009 -0.012 -0.012 -0.015 -0.009 -0.033 -0.003 -0.042 0.012L0.258 0.246 0.087 0.27c-0.009 0 -0.015 0.003 -0.018 0.009 -0.012 0.012 -0.012 0.03 0 0.042l0.123 0.12 -0.03 0.171c0 0.006 0 0.012 0.003 0.018 0.009 0.015 0.027 0.021 0.042 0.012l0.153 -0.081 0.153 0.081c0.003 0.003 0.009 0.003 0.015 0.003h0.006c0.015 -0.003 0.027 -0.018 0.024 -0.036l-0.03 -0.171 0.123 -0.12c0.006 -0.003 0.009 -0.009 0.009 -0.015z\"/></svg>   <span>Коллекция</span>\n    </div>';
            Lampa.Template.add('button_category', "<style>.freetv_jaja.category-full .card__icons {top: 0.3em;right: 0.3em;justify-content: center !important;}.freetv_jaja.category-full{ padding-bottom:8em;margin-top: -1.5em;} .freetv_jaja div.card__view{ position:relative; background-color:#353535; background-color:#353535a6; border-radius:1em; cursor:pointer; padding-bottom: 56%; } .freetv_jaja.square_icons div.card__view{ padding-bottom:100% } .freetv_jaja.category-full .card__icons { top:0.3em; right:0.3em; justify-content:right; }.freetv_jaja div.card__title {white-space: nowrap;text-overflow: ellipsis;display: block;}.info_jaja div.info__right{padding-top:0;}.info_jaja .info.layer--width{height:auto;font-size:0.7em;} @media screen and (max-width: 385px) { .card--collection { width: 33.3%!important; } } </style><div class=\"full-start__buttons\"><div class=\"full-start__button selector view--category\"><svg style=\"enable-background:new 0 0 512 512;\" version=\"1.1\" viewBox=\"0 0 24 24\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g id=\"info\"/><g id=\"icons\"><g id=\"menu\"><path d=\"M20,10H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2C22,10.9,21.1,10,20,10z\" fill=\"currentColor\"/><path d=\"M4,8h12c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2H4C2.9,4,2,4.9,2,6C2,7.1,2.9,8,4,8z\" fill=\"currentColor\"/><path d=\"M16,16H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2C18,16.9,17.1,16,16,16z\" fill=\"currentColor\"/></g></g></svg>   <span>Сортировать</span>\n    </div>" + channelbutton + favoritebutton + findbutton  + "  </div>");
            Lampa.Template.add('info_web', '<div class="info layer--width"><div class="info__left"><div class="info__title"></div></div><div class="info__right">  <div id="web_filtr"></div></div></div>');
            var btn = Lampa.Template.get('button_category');
            info = Lampa.Template.get('info_web');
            info.find('#web_filtr').append(btn);
            info.find('.view--channel').on('hover:enter hover:click', function () {
                _this2.selectGroup();
            });
            info.find('.view--category').on('hover:enter hover:click', function () {
                listNavigation();
            });
            info.find('.open--favorite').on('hover:enter hover:click', function () {
                Lampa.Activity.push({
                    //	url: cors + a.url,
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
                        //console.log(new_value)
                        var searchurl = object.setup.search.url.replace('#msearchword', encodeURIComponent(new_value));
                        Lampa.Activity.push({
                            //	url: cors + a.url,
                            url: searchurl,
                            title: object.setup.title + ' - Поисковый запрос: "' + new_value + '"',
                            component: 'jaja',
                            quantity: '',
                            setup: object.setup,
                            page: 1
                        });
                    }
                    else Lampa.Controller.toggle('content');
                })
            });

            this.selectGroup = function () {

                var balanser_ = Lampa.Storage.get('online_jaja_balanser')
                
                Lampa.Select.show({
                    title: 'Источник',
                    // items: catalogs,
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
                            //	url: cors + a.url,
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
            //info.find('.info__rate,.info__right').remove();
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

        function removeFavoriteRadio(index) {
            var favoriteRadios = getFavoriteRadios();
            favoriteRadios.splice(index, 1);
            localStorage.setItem(FAVORITE_RADIOS_KEY, JSON.stringify(favoriteRadios));
        }

        function removeFavorite(el) {
            // var favoriteRadios = getFavoriteRadios();
            // favoriteRadios.splice(index, 1);
            // localStorage.setItem(FAVORITE_RADIOS_KEY, JSON.stringify(favoriteRadios));
            var updatedHistory = getFavoriteRadios().filter(function (obj) { return obj.url !== el.url });
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
                    // Navigator.move('right');
                    if (Navigator.canmove('right')) Navigator.move('right');
                    else _this.selectGroup();
                },
                up: function up() {
                    // if (Navigator.canmove('up')) Navigator.move('up');
                    // else Lampa.Controller.toggle('head');
                    if (Navigator.canmove('up')) {
                        Navigator.move('up');
                    } else {
                        if (info) {
                            if (!info.find('.view--category').hasClass('focus')) {
                                Lampa.Controller.collectionSet(info);
                                Navigator.move('right')
                            } else Lampa.Controller.toggle('head');
                        } else Lampa.Controller.toggle('head');
                    }
                },
                down: function down() {
                    // if (Navigator.canmove('down')) Navigator.move('down');
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

        this.pause = function () { };

        this.stop = function () { };

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
            //doubanitem = null;
        };
    }

    var catalogs = [
        {
            title: "Jable.tv",
            link: "https://jable.tv",
            show: "portrait",
            next: "search",
            datasort: "",
            use_referer: true,
            datatype: "text",
            category: [
                {
                    title: 'Новые релизы',
                    url: 'https://jable.tv/new-release/',
                    quantity: ''
                }, {
                    title: 'Недавно обновленные',
                    url: 'https://jable.tv/latest-updates/',
                    quantity: ''
                },{
                    title: 'Популярные за неделю',
                    url: 'https://jable.tv/hot/',
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
                    filter: "\/([a-zA-Z0-9-]+)\/?$"
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
                url: 'https://jable.tv/search/?q=#msearchword&from_videos=1'
            }
        },
        {
            title: "NJAV.tv",
            link: "https://njav.tv",
            show: "portrait",
            next: "search",
            datasort: "",
            use_referer: true,
            datatype: "json",
            category: [{
                title: 'Главная',
                url: 'https://njav.tv/zh/',
                quantity: ':gt(9)'
            }, {
                title: 'Новые релизы',
                url: 'https://njav.tv/zh/new-release',
                quantity: ''
            }, {
                title: 'Недавно обновленные',
                url: 'https://njav.tv/zh/recent-update',
                quantity: ''
            }, {
                title: 'Популярное',
                url: 'https://njav.tv/zh/trending',
                quantity: ''
            }, {
                title: 'Рекомендуемое',
                url: 'https://njav.tv/zh/recommended',
                quantity: ''
            }, {
                title: 'Лучшее за день',
                url: 'https://njav.tv/zh/today-hot',
                quantity: ''
            }, {
                title: 'Лучшее за неделю',
                url: 'https://njav.tv/zh/weekly-hot',
                quantity: ''
            }, {
                title: 'Лучшее за месяц',
                url: 'https://njav.tv/zh/monthly-hot',
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
                url: 'https://njav.tv/zh/search?keyword=#msearchword'
            }
        },
    ];

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
                // Lampa.Controller.toggle('menu');
                Lampa.Controller.toggle('content');
            }
        });

    };

    function startjaja() {
        window.plugin_jaja_ready = true;
        Lampa.Component.add('jaja', jaja);

        function addSettingsjaja() {
            var ico = '<svg width="800px" height="800px" viewBox="20 50 115 115" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M120.69 101.68C114.53 101.68 110.33 97.91 110.16 92.51C110.03 88.1 112.58 84.29 116.64 84.29C121.81 84.29 123.93 89.44 120.86 92.48L116.37 89.26C114.99 90.77 115.48 96.19 120.14 96.19C124.21 96.19 126.14 93.36 126.14 88.92C126.14 84 123.06 80.06 114.73 80.06C107.31 80.06 103.5 86.06 103.5 94.71C103.5 99.24 106.09 102.87 109.02 106.51C114.36 105.51 119.48 112.89 116.27 117.41C116.932 119.172 117.271 121.038 117.27 122.92C117.267 123.857 117.17 124.792 116.98 125.71C121.82 130.96 113.98 140.37 107.98 136.29C105.07 137.594 101.919 138.275 98.73 138.29C95.56 143.71 85.15 140.96 85.73 134.44C83.709 133.184 81.5645 132.138 79.33 131.32C79.43 137.13 71.18 140.81 66.73 137.54C64.8991 140.142 62.5541 142.34 59.84 144C59.84 144.19 59.84 144.38 59.84 144.58C60.02 154.52 43.12 154.76 42.94 145.06C42.94 144.92 42.94 144.8 42.94 144.67C40.0878 143.796 37.3889 142.483 34.94 140.78C27.28 145.35 18.48 133.22 24.79 127.39C23.5874 123.872 22.9823 120.178 23 116.46C14.28 113.63 18.09 98.69 26.8 100.06C28.4235 97.1054 30.6398 94.5181 33.31 92.46C31.77 83.58 46.16 80 49.41 87.69C51.7941 87.7882 54.1517 88.2294 56.41 89L56.61 88.81C63.07 83.23 72.5 94.16 66.36 99.67C67.67 105.19 65.73 110.94 61.99 112.96C56.99 105.56 46.49 107.96 46.49 117.06C46.49 123.42 50.99 125.85 55.84 125.85C61.84 125.85 65.47 114.53 73.73 114.53C85.95 114.53 93.05 126.21 98.44 126.21C102.7 126.21 103.82 124.3 103.82 121.48C103.82 112.99 94.6 108.32 94.6 94.93C94.6 82.63 102.6 72.6 114.6 72.6C125.74 72.6 131.96 79.43 131.96 87.85C131.96 96.27 127.74 101.68 120.69 101.68ZM63.6 96.91C66.08 94.77 61.6 89.57 59.07 91.76C56.54 93.95 60.88 99.26 63.6 96.91ZM43.68 135.45C47.38 133.26 43.11 125.64 39.18 127.97C35.58 130.1 40 137.62 43.68 135.45ZM26.57 104.58C22.9 103.64 20.9 111.32 24.66 112.28C28.42 113.24 30.6 105.62 26.57 104.58ZM28.37 130.32C25.29 132.54 29.91 138.99 33.06 136.72C36.21 134.45 31.74 127.89 28.37 130.32ZM35.49 111.21C31.41 109.63 28.07 118.21 32.26 119.78C36.45 121.35 40 112.94 35.49 111.21ZM45.49 90.09C44.63 86.39 36.89 88.16 37.77 91.95C38.65 95.74 46.43 94.14 45.49 90.09ZM46.49 99.73C45.09 95.79 36.86 98.73 38.28 102.73C39.7 106.73 48 104 46.47 99.73H46.49ZM47.49 144.81C47.56 148.61 55.49 148.49 55.42 144.6C55.35 140.71 47.4 140.66 47.47 144.81H47.49ZM52.84 135.61C53.33 139.76 62.01 138.76 61.5 134.51C60.99 130.26 52.29 131.07 52.82 135.61H52.84ZM68.38 133.11C69.68 136.31 76.38 133.61 75.03 130.33C73.68 127.05 66.93 129.61 68.36 133.11H68.38ZM72.93 122.57C72.41 126.33 80.26 127.46 80.8 123.57C81.34 119.68 73.49 118.45 72.91 122.57H72.93ZM89.48 134.21C88.77 137.21 95.15 138.76 95.88 135.63C96.61 132.5 90.23 130.86 89.46 134.21H89.48ZM109.82 133C112.26 135 116.41 129.9 113.92 127.87C111.43 125.84 107.16 130.86 109.82 133ZM112.6 115.82C115.12 113.94 111.22 108.67 108.6 110.59C105.98 112.51 109.85 117.9 112.6 115.85V115.82Z" fill="currentcolor"/></svg>';
            var menu_item = $('<li class="menu__item selector" data-action="jaja"><div class="menu__ico">' + ico + '</div><div class="menu__text">JaJa 18+</div></li>');
            menu_item.on('hover:enter', function () {
                listNavigation();
            });
            $('.menu .menu__list').eq(0).append(menu_item);
            //$('.menu .menu__list .menu__item.selector').eq(1).after(menu_item);
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
