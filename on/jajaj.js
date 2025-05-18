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
        // Остальные UA строки оставлены, как в оригинале
        var PC_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36";
        var UA = "Mozilla/5.0";
        var UC_UA = "Mozilla/5.0 (Linux; U; Android 9; zh-CN; MI 9 Build/PKQ1.181121.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.5.5.1035 Mobile Safari/537.36";
        var IOS_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1";;
        
        var activity = {
            url: '',
            title: object.setup.title + ' - Коллекция',
            component: 'jaja',
            quantity: object.quantity || '', // Добавил || '' на всякий случай
            setup: object.setup,
            type: object.type || 'fav', // type из object или 'fav' по умолчанию
            page: 1
        };
        
        // Переменная для хранения URL следующей страницы, полученного от парсера
        // В оригинальном коде она не использовалась глобально, а передавалась через data.page
        // Оставим пока так, как было в оригинале this.next

        this.create = function () {
            var _this = this;
            this.activity.loader(true);

            var current_cors = cors; // Используем локальную переменную для CORS в этом запросе
            if (object.setup.datatype !== 'json') {
                 current_cors = '';
            }


            if (object.type == 'fav') { 
                var favData = _this.cardfavor(getFavoriteRadios());
                _this.build(favData); // favData содержит {card, page, total_pages}
                // this.activity.loader(false); // loader(false) вызывается в build или empty
            } else {
                 // Для Jable, если это первая страница и нет page=, добавляем page=1 и lang=en
                var initial_url_to_load = object.url;
                if (initial_url_to_load.includes('jable.tv') && initial_url_to_load.indexOf('page=') === -1 && activity.page === 1) {
                    if (initial_url_to_load.includes('?')) {
                        initial_url_to_load += '&page=1';
                    } else {
                        initial_url_to_load += '?page=1';
                    }
                    if (initial_url_to_load.indexOf('lang=en') === -1) {
                         var q_mark_present = initial_url_to_load.includes('?');
                         var existing_params = q_mark_present ? initial_url_to_load.split('?')[1] : '';
                         var param_separator = (q_mark_present && existing_params !== '' && existing_params !== 'page=1') ? '&' : (q_mark_present && existing_params === 'page=1' ? '&' :(q_mark_present ? '' : '?'));
                         if(initial_url_to_load.endsWith('page=1') && param_separator === '?') param_separator = '&'; 
                         initial_url_to_load += param_separator + 'lang=en';
                     }
                }


                network["native"](current_cors + initial_url_to_load, function (str) {
                    var parsedData = _(str);
                    _this.build(parsedData); // parsedData содержит {card, page, total_pages}
                }, function (a, c) {
                    Lampa.Noty.show(network.errorDecode(a, c));
                    _this.activity.loader(false); // Убедимся, что лоадер скрыт при ошибке
                    _this.empty(); // Показываем пустое, если первая загрузка не удалась
                }, false, {
                    dataType: object.setup.datatype,
                });
            }
            
            return this.render();
        };

        this.next = function (page_url_from_data) { // page_url_from_data - это data.page из 
            var _this2 = this;
            // total_pages устанавливается в  и используется здесь
            if (total_pages == 1 || total_pages == 0 || (activity.page >= total_pages && total_pages > 0) ) waitload = true; // Блокируем, если это последняя страница
            
            if (waitload) return;

            var current_cors_to_use = cors;
            if (object.setup.datatype !== 'json') {
                current_cors_to_use = '';
            }
            
            waitload = true;
            // activity.page инкрементируется после успешной загрузки
            
            network.clear();
            network.timeout(1000 * 40);

            var url_to_fetch = page_url_from_data;

            if (typeof url_to_fetch == 'undefined' || url_to_fetch.indexOf('undefined') != -1) {
                 waitload = false; // Разблокируем, если нет URL
                 return;
            }
            
            // Оригинальная логика формирования URL, если page_url_from_data не содержит page=N
            // Эта логика может быть специфична для Jable и должна быть проверена
            if (url_to_fetch.indexOf('before=') === -1) { // Не before-пагинация
                var regex = /page=(\d+)/;
                var match = url_to_fetch.match(regex);
                if (match && match[1]) { // Если есть page=N
                    // URL уже должен быть правильным для следующей страницы, если его вернул парсер
                    // Если мы хотим инкрементировать номер в существующем URL:
                    // var nextPageNum = parseInt(match[1], 10) + 1; // Это если URL от парсера - текущий, а не следующий
                    // url_to_fetch = url_to_fetch.replace('page=' + match[1], 'page=' + nextPageNum);
                    // НО! Если page_url_from_data - это УЖЕ URL СЛЕДУЮЩЕЙ страницы, то ничего менять не надо.
                    // В вашем оригинальном  'page' - это URL следующей страницы.
                } else { // Если нет page=N, пытаемся сформировать на основе activity.page + 1
                    var nextPageForConstruct = activity.page + 1;
                    // Пытаемся заменить последнее число в URL или добавить /page/N или ?page=N
                    // Эта логика из вашего оригинала, она довольно сложная:
                    try {
                        var currentNumMatch = url_to_fetch.match(/[0-9]+(?=[^0-9]*$)(.*)/);
                        if (currentNumMatch && currentNumMatch[0]) {
                             url_to_fetch = url_to_fetch.replace(currentNumMatch[0], '') + nextPageForConstruct + (currentNumMatch[1] ? currentNumMatch[1] : '');
                        } else if (object.url.includes('?')) { // Если базовый URL уже с параметрами
                            url_to_fetch = object.url + '&page=' + nextPageForConstruct;
                        } else {
                            url_to_fetch = object.url + '?page=' + nextPageForConstruct;
                        }
                        // Всегда добавляем lang=en для Jable
                        if (url_to_fetch.indexOf('jable.tv') !== -1 && url_to_fetch.indexOf('lang=en') === -1) {
                             url_to_fetch += (url_to_fetch.includes('?') ? '&' : '?') + 'lang=en';
                        }
                    } catch (e) {
                        // console.error("Error constructing next page URL:", e);
                        waitload = false;
                        // this.activity.loader(false); // Если лоадер был включен
                        return;
                    }
                }
            }


            var headers = {};
            if (object.setup.use_referer) { // В вашем оригинале object.use_referer, а не object.setup.use_referer
                 headers['User-Agent'] = MOBILE_UA;
                 try {
                    headers['Referer'] = object.url.match(/(http|https):\/\/(www.)?(\w+(\.)?)+/)[0] + '/';
                 } catch(e){}
            }


            network["native"](current_cors_to_use + url_to_fetch, function (result) {
                var parsedData = _this2.card(result); //  должен вернуть {card, page, total_pages}
                
                if (parsedData.card.length) {
                    activity.page++; // Инкрементируем только если успешно загрузили и есть карточки
                    total_pages = parsedData.total_pages; // Обновляем общее количество страниц
                    next_page_url_from_parser = parsedData.page; // Сохраняем URL для следующего вызова
                    _this2.append(parsedData,true);
                    waitload = false;
                } else {
                    // Если карточек нет, считаем, что это конец
                    waitload = true; 
                    total_pages = activity.page; // Фиксируем текущую как последнюю
                    next_page_url_from_parser = undefined;
                }
                _this2.activity.loader(false); // Скрываем лоадер после обработки
            }, function (a, c) {
                _this2.activity.loader(false); // Скрываем лоадер при ошибке
                waitload = false; // Разблокируем для возможности повторной попытки (если это не 404)
                if (a.status == 404) {
                    // Lampa.Noty.show('Это последняя страница (404)');
                    total_pages = activity.page; // Фиксируем текущую как последнюю
                    next_page_url_from_parser = undefined;
                    waitload = true; // Блокируем дальнейшие попытки
                } else {
                    Lampa.Noty.show(network.errorDecode(a, c));
                }
            }, false, {
                dataType: object.setup.datatype,
                headers: headers
            });
        };

this.card = function (str_data_from_network, currentPageNumberForParsing) {
            var card_list = []; 
            var next_page_url_parsed; 
            var total_pages_parsed = currentPageNumberForParsing; 

            var current_setup = object.setup; 
            if (!current_setup) {
                Lampa.Noty.show("Ошибка: Конфигурация источника (setup) отсутствует.");
                return { card: [], page: undefined, total_pages: 0 };
            }
            var response_content = str_data_from_network;
            // ... (обработка JSON и allorigins)
            if (current_setup.datatype == 'json' && typeof response_content === 'string') { try { var parsed_json = JSON.parse(response_content); response_content = parsed_json.contents ? parsed_json.contents : parsed_json; if(typeof response_content === 'string' && (response_content.startsWith('{') || response_content.startsWith('['))) { response_content = JSON.parse(response_content);}} catch (e) {}}
            if (typeof response_content === 'object' && current_setup.datatype == 'json' && response_content.contents) { response_content = response_content.contents; try { if(typeof response_content === 'string') response_content = JSON.parse(response_content); } catch(e){}}
            if (current_setup.datatype == 'text' && typeof response_content === 'object' && response_content.contents) { response_content = response_content.contents; }
            
            var html_content_str = typeof response_content === 'string' ? response_content.replace(/\n/g, '') : '';

            // Здесь имена переменных должны совпадать с теми, что используются ниже
            var v = current_setup.list.videoscontainer.selector; // Используем 'v'
            var t = current_setup.list.title.selector;
            var th = current_setup.list.thumb.selector; 
            var l = current_setup.list.link.selector;
            var p_selector = current_setup.list.page.selector; 
            var m = current_setup.list.mnumber.selector;
            var base_url = current_setup.link; 

            // ... (логика пагинации остается прежней) ...
            var pagination_elements = $(p_selector, html_content_str);
            if (pagination_elements.length > 0) {
                var page_links = pagination_elements.find('a.page-link[href]:not([href="#"]):not([href="javascript:;"])');
                var current_page_span = pagination_elements.find('span.page-link.active.disabled, span.page-numbers.current').first();
                var next_link_element;
                if (current_page_span.length) {
                    next_link_element = current_page_span.parent().nextAll('li.page-item').find('a.page-link').first();
                } else { 
                    page_links.each(function() {
                        var $this = $(this);
                        var link_text = $this.text().trim().toLowerCase();
                        var link_page_num = parseInt(link_text, 10);
                        if (link_text.includes('next') || link_text.includes('далее') || link_text === '»' || $this.is('[rel="next"]')) {
                            next_link_element = $this;
                            return false;
                        }
                        if ($.isNumeric(link_page_num) && link_page_num === currentPageNumberForParsing + 1) {
                             next_link_element = $this;
                        }
                    });
                }
                if (next_link_element && next_link_element.length) {
                    next_page_url_parsed = next_link_element.attr('href');
                }
                var last_page_link = page_links.filter(function() { return $(this).text().trim().toLowerCase().includes('last') || $.isNumeric($(this).text().trim()); }).last();
                if (last_page_link.length) {
                    var last_page_text = last_page_link.text().trim();
                    var last_page_num_from_text = parseInt(last_page_text, 10);
                    if ($.isNumeric(last_page_num_from_text)) {
                        total_pages_parsed = last_page_num_from_text;
                    } else { 
                        var href_last = last_page_link.attr('href');
                        var match_page_num = href_last ? href_last.match(/\/(\d+)\/?$/) : null; 
                        if (match_page_num && match_page_num[1]) {
                            total_pages_parsed = parseInt(match_page_num[1], 10);
                        } else if (current_page_span.length && (!next_link_element || !next_link_element.length)) { 
                             var current_text_num = parseInt(current_page_span.text().trim(), 10);
                             total_pages_parsed = $.isNumeric(current_text_num) ? current_text_num : currentPageNumberForParsing;
                        } else {
                             total_pages_parsed = currentPageNumberForParsing; 
                        }
                    }
                } else if (current_page_span.length && (!next_link_element || !next_link_element.length)) {
                     var current_text_num = parseInt(current_page_span.text().trim(), 10);
                     total_pages_parsed = $.isNumeric(current_text_num) ? current_text_num : currentPageNumberForParsing;
                } else {
                     total_pages_parsed = currentPageNumberForParsing;
                }
                 total_pages_parsed = Math.max(total_pages_parsed, currentPageNumberForParsing); 
                if (next_page_url_parsed && next_page_url_parsed.indexOf('http') === -1) {
                    next_page_url_parsed = base_url + (next_page_url_parsed.startsWith('/') ? next_page_url_parsed : '/' + next_page_url_parsed);
                }
                if (next_page_url_parsed && (next_page_url_parsed.indexOf('#') !== -1 || next_page_url_parsed.startsWith('javascript:'))) { 
                    next_page_url_parsed = undefined; 
                }
            } else { 
                 total_pages_parsed = currentPageNumberForParsing;
            }
            
            // ИСПРАВЛЕНИЕ ЗДЕСЬ: используем 'v' вместо 'v_selector'
            var items_on_page = $(v, html_content_str); 
            if (items_on_page.length === 0 && currentPageNumberForParsing > 1) { 
                next_page_url_parsed = undefined;
                total_pages_parsed = currentPageNumberForParsing -1; 
            }

            items_on_page.each(function (i, html_item_el) {
                var $html_item = $(html_item_el); 
                // И здесь используем правильные имена переменных 't', 'l', 'th', 'm'
                var t1_el = t ? $html_item.find(t) : $html_item; 
                var u1_el = l ? $html_item.find(l) : $html_item; 
                var i1_el = th ? $html_item.find(th) : $html_item; 
                var m1_el = m ? $html_item.find(m) : $html_item; 
                var tt, uu, ii, mm, pp = ''; 
                switch (current_setup.list.title.attrName) { case 'text': tt = t1_el.text(); break; case 'html': tt = t1_el.html(); break; default: tt = t1_el.attr(current_setup.list.title.attrName); }
                if (typeof tt === 'undefined') return true; tt = tt.trim();
                if (current_setup.list.title.filter) { var title_match = tt.match(new RegExp(current_setup.list.title.filter)); tt = title_match ? (title_match[1] !== undefined ? title_match[1] : title_match[0]) : tt; }
                switch (current_setup.list.link.attrName) { case 'text': uu = u1_el.text(); break; case 'html': uu = u1_el.html(); break; default: uu = u1_el.attr(current_setup.list.link.attrName); }
                uu = (uu || "").trim(); if (uu.indexOf('http') === -1 && uu) { uu = base_url + (uu.startsWith('/') ? uu : '/' + uu); }
                if (current_setup.list.link.filter) { var link_match = uu.match(new RegExp(current_setup.list.link.filter)); uu = link_match ? (link_match[1] !== undefined ? link_match[1] : link_match[0]) : uu; }
                if (i1_el.length) { 
                    ii = i1_el.attr(current_setup.list.thumb.attrName); 
                    pp = i1_el.attr('data-preview'); 
                }
                ii = (ii || "").trim(); if (ii.startsWith('//')) ii = 'https:' + ii; if (ii.indexOf('http') === -1 && ii) { ii = base_url + (ii.startsWith('/') ? ii : '/' + ii); }
                if (current_setup.list.thumb.filter && ii) { var thumb_match = ii.match(new RegExp(current_setup.list.thumb.filter)); ii = thumb_match ? (thumb_match[1] !== undefined ? thumb_match[1] : thumb_match[0]) : ii; }
                if (!ii) ii = './img/img_broken.svg'; 
                pp = (pp || "").trim(); if (pp.startsWith('//')) pp = 'https:' + pp; if (pp.indexOf('http') === -1 && pp && base_url) { pp = base_url + (pp.startsWith('/') ? pp : '/' + pp); }
                switch (current_setup.list.mnumber.attrName) { case 'text': mm = m1_el.text(); break; case 'html': mm = m1_el.html(); break; default: mm = m1_el.attr(current_setup.list.mnumber.attrName); }
                mm = (mm || "").trim(); if (current_setup.list.mnumber.filter) { var mnumber_match = mm.match(new RegExp(current_setup.list.mnumber.filter)); mm = mnumber_match ? (mnumber_match[1] !== undefined ? mnumber_match[1] : mnumber_match[0]) : mm; }
                card_list.push({ title: tt, original_title: '', url: uu, img: ii, preview: pp, quantity: '', year: '', rate: $html_item.find(current_setup.list.m_time.selector).first().text().trim().replace(/\n/g, '').replace(/\s+/g, ' '), episodes_info: mm.toUpperCase(), update: '', score: '', });
            });
            return { card: card_list, page: next_page_url_parsed, total_pages: total_pages_parsed };
        };
        
    // --- КОНЕЦ ЧАСТИ 1 ---
    // --- НАЧАЛО ЧАСТИ 2 ---
        this.cardfavor = function (json) {
            var page = undefined; 
            var total_pages = 1;
            var fav_cards = [];
            if (object.setup && object.setup.title) {
                 fav_cards = json.filter(function (fp) {
                    return fp.website === object.setup.title;
                });
            } else {
                fav_cards = json; 
            }
            return {
                card: fav_cards.reverse(),
                page: page, 
                total_pages: total_pages
            };
        };

        this.append = function (data_to_append, is_append_operation) { 
            var _this3 = this;
            
            if (!data_to_append || !data_to_append.card) {
                return;
            }

            data_to_append.card.forEach(function (element) {
                var card_element = Lampa.Template.get('card', { 
                    title: element.title,
                    release_year: element.year || ''
                });
                card_element.addClass('card--collection');
                var card_img_container = card_element.find('.card__img'); 
                
                // Функция для отображения/восстановления изображения
                var showImage = function() {
                    var video_player = card_img_container.find('video.card__video-preview');
                    if (video_player.length) {
                        video_player.remove();
                    }
                    if (card_img_container.find('img').length === 0 && card_img_container.find('.card__img-placeholder').length === 0) {
                        var img_tag_jq = $('<img>');
                        card_img_container.append(img_tag_jq);
                        var img_tag = img_tag_jq[0];

                        img_tag.onload = function () { card_element.addClass('card--loaded'); };
                        img_tag.onerror = function (e) {
                            var hex = (Lampa.Utils.hash(element.title) * 1).toString(16); while (hex.length < 6) hex += hex; hex = hex.substring(0, 6);
                            var r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
                            var hexText = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
                            card_img_container.empty().append('<div class="card__img-placeholder" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; text-align: center; padding: 5px; box-sizing: border-box; overflow: hidden;">' + Lampa.Utils.subText(element.title, 50) + '</div>'); 
                            if(card_element.find('.card__view').length) card_element.find('.card__view').css({ 'background-color': '#' + hex, 'color': hexText });
                            card_element.addClass('card--loaded');
                        };
                        if (element.img) img_tag.src = element.img; else img_tag.onerror();
                    } else if (card_img_container.find('img').length > 0) { 
                        var existing_img = card_img_container.find('img')[0];
                        if (element.img && existing_img.src !== element.img) {
                             existing_img.src = element.img; // Обновляем src, если он изменился
                        } else if (!element.img && typeof existing_img.onerror === 'function') {
                            existing_img.onerror(); // Вызываем onerror, если картинки нет
                        }
                    }
                };
                
                showImage(); 

                if (element.rate) { card_element.find('.card__view').append('<div class="card__type"></div>'); card_element.find('.card__type').text(element.rate); }
                if (element.quantity) { card_element.find('.card__icons-inner').text(element.quantity).css({ 'padding': '0.4em 0.4em' }); }
                if (element.update) { card_element.find('.card__view').append('<div class="card__quality"></div>'); card_element.find('.card__quality').text(element.update); }

                var preview_timeout;

                card_element.on('hover:focus', function () {
                    last = card_element[0];
                    scroll.update(card_element, true);
                    if(info) { 
                        info.find('.info__title').text(element.episodes_info || element.title); 
                        info.find('.info__title-original').text(element.original_title || '');
                        info.find('.info__rate span').text(element.rate || '');
                        info.find('.info__create').text(element.year || ''); 
                        info.find('.info__rate').toggleClass('hide', !(element.rate && parseFloat(element.rate) > 0));
                    }
                    
                    clearTimeout(preview_timeout);
                    preview_timeout = setTimeout(function() {
                        if (card_element.hasClass('focus') && element.preview) { 
                            card_img_container.empty(); 
                            var video_preview = $('<video autoplay loop muted playsinline class="card__video-preview" style="width: 100%; height: 100%; object-fit: cover;"></video>');
                            video_preview.attr('src', element.preview);
                            video_preview.on('error', function() { showImage(); }); 
                            video_preview.on('canplaythrough', function() { this.play().catch(function(e){}); }); 
                            card_img_container.append(video_preview);
                        }
                    }, 300); 

                    if (!element.preview && element.img) { 
                         Lampa.Background.change(cardImgBackground(element.img)); 
                    }

                    var card_width_with_margin = card_element.outerWidth(true);
                    if (card_width_with_margin > 0) { 
                        var scroll_width = scroll.render().width();
                        var items_per_row = Math.max(1, Math.floor(scroll_width / card_width_with_margin));
                        var current_card_index = items.indexOf(card_element);
                        
                        if (current_card_index >= items.length - (items_per_row * 1.5) && !waitload) {
                           _this3.next(); 
                        }
                    }
                    if (Lampa.Helper) Lampa.Helper.show('jaja_detail', 'Нажмите (ОК) для просмотра или удерживайте (ОК) для доп. опций.', card_element);
                });

                card_element.on('hover:lost', function() {
                    clearTimeout(preview_timeout); 
                    showImage(); 
                });
                
                card_element.on('hover:enter', function (target, card_data) {
                    var current_cors_enter = cors;
                    if (object.setup && object.setup.datatype !== 'json') current_cors_enter = '';
                    last = card_element[0];
                    Lampa.Modal.open({
                        title: '', html: Lampa.Template.get('modal_loading'), size: 'small', align: 'center', mask: true,
                        onBack: function onBack() { Lampa.Modal.close(); Lampa.Api.clear(); Lampa.Controller.toggle('content'); }
                    });
                    if (element.url.indexOf('jable.tv') !== -1) {
                        network["native"](current_cors_enter + element.url, function (str) {
                            Lampa.Modal.close();
                            var response_text = str;
                            if (object.setup && object.setup.datatype == 'json' && typeof str === 'object' && str.contents) { response_text = str.contents; }
                            else if (typeof str === 'object' && str.contents) { response_text = str.contents; } // Для allorigins text

                            var v = response_text.replace(/\n|\r/g, '').replace(/\\/g, '').match(/https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|](.mp4|.m3u8)/);
                            var videolink = v ? v[0] : '';
                            if (videolink) {
                                var video = { title: element.title, url: videolink, tv: false };
                                Lampa.Player.play(video); Lampa.Player.playlist([video]);
                            } else { Lampa.Noty.show('Подходящих видео не найдено.'); }
                        }, function (a, c) { Lampa.Modal.close(); Lampa.Noty.show(network.errorDecode(a, c)); }, false, { dataType: object.setup ? object.setup.datatype : 'text' });
                    } else {
                         Lampa.Modal.close(); Lampa.Noty.show("Неизвестный тип ссылки для просмотра.");
                    }
                });

                card_element.on('hover:long', function (target, card_data) {
                    var current_cors_long = cors;
                    if (object.setup && object.setup.datatype !== 'json') current_cors_long = '';
                    Lampa.Modal.open({
                        title: '', html: Lampa.Template.get('modal_loading'), size: 'small', align: 'center', mask: true,
                        onBack: function onBack() { Lampa.Modal.close(); Lampa.Api.clear(); Lampa.Controller.toggle('content'); }
                    });

                    if (element.url.indexOf('jable.tv') !== -1) {
                        network["native"](current_cors_long + element.url, function (str) {
                            var response_text_long = str;
                            if (object.setup && object.setup.datatype == 'json' && typeof str === 'object' && str.contents) { response_text_long = str.contents; }
                            else if (typeof str === 'object' && str.contents) { response_text_long = str.contents; }
                            Lampa.Modal.close();
                            var archiveMenu = [];
                            var favtext = isFavorite(element.url) ? 'Удалить из коллекции' : 'Добавить в коллекцию';
                            archiveMenu.push({ title: favtext, url: '', type: 'fav' });
                            if(element.episodes_info && element.episodes_info.split('-')[0]) {
                                archiveMenu.push({ title: element.episodes_info.split('-')[0] + ' - Все видео', url: 'https://jable.tv/search/?q='+encodeURIComponent(element.episodes_info.split('-')[0])+'&from_videos=1', type: 'list' });
                            }
                            $('.models a.model', response_text_long).each(function (i, html_el) { archiveMenu.push({ title: ($('.placeholder,img', html_el).attr('title') || $(html_el).text().trim()) + ' - Все видео', url: $(html_el).attr('href'), type: 'list' }); });
                            Lampa.Select.show({
                                title: 'Связанный контент', items: archiveMenu,
                                onSelect: function (sel) {
                                    element.website = object.setup.title;
                                    if (sel.type == 'fav') {
                                        var notify_text_fav = isFavorite(element.url) ? (removeFavorite(element), 'Удалено из коллекции') : (saveFavoriteRadio(element), 'Добавлено в коллекцию');
                                        if (object.type == 'fav') { Lampa.Activity.replace(activity); }
                                        else { Lampa.Noty.show(notify_text_fav); Lampa.Controller.toggle('content'); }
                                    } else { Lampa.Activity.push({ url: sel.url, title_suffix: sel.title.replace(' - Все видео','').replace(' (поиск)',''), component: 'jaja', quantity: '', setup: object.setup, page: 1 });}
                                },
                                onBack: function () { Lampa.Controller.toggle('content'); }
                            });
                        }, function (a, c) {Lampa.Modal.close(); Lampa.Noty.show(network.errorDecode(a, c)); }, false, { dataType: object.setup ? object.setup.datatype : 'text' });
                    } else {
                        Lampa.Modal.close(); Lampa.Noty.show("Дополнительные опции для этой ссылки не определены.");
                    }
                });
                
                body.append(card_element);
                if (is_append_operation) Lampa.Controller.collectionAppend(card_element);
                items.push(card_element);
            });
        };

        this.build = function (data_for_build) {
            var _this2 = this;
            var viewsort = '<div class=\"full-start__button selector view--sort\"><svg style=\"enable-background:new 0 0 512 512;\" version=\"1.1\" viewBox=\"0 0 24 24\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g id=\"info\"/><g id=\"icons\"><g id=\"menu\"><path d=\"M20,10H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2C22,10.9,21.1,10,20,10z\" fill=\"currentColor\"/><path d=\"M4,8h12c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2H4C2.9,4,2,4.9,2,6C2,7.1,2.9,8,4,8z\" fill=\"currentColor\"/><path d=\"M16,16H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2C18,16.9,17.1,16,16,16z\" fill=\"currentColor\"/></g></g></svg>   <span>Сортировать</span>\n    </div>'
			var  viewcategory = '<div class=\"full-start__button selector view--category\"><svg style=\"enable-background:new 0 0 512 512;\" version=\"1.1\" viewBox=\"0 0 24 24\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g id=\"info\"/><g id=\"icons\"><g id=\"menu\"><path d=\"M20,10H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2C22,10.9,21.1,10,20,10z\" fill=\"currentColor\"/><path d=\"M4,8h12c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2H4C2.9,4,2,4.9,2,6C2,7.1,2.9,8,4,8z\" fill=\"currentColor\"/><path d=\"M16,16H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2C18,16.9,17.1,16,16,16z\" fill=\"currentColor\"/></g></g></svg>   <span>Категории</span>\n    </div>'
			var  viewtags = '<div class=\"full-start__button selector view--tags\"><svg style=\"enable-background:new 0 0 512 512;\" version=\"1.1\" viewBox=\"0 0 24 24\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g id=\"info\"/><g id=\"icons\"><g id=\"menu\"><path d=\"M20,10H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2C22,10.9,21.1,10,20,10z\" fill=\"currentColor\"/><path d=\"M4,8h12c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2H4C2.9,4,2,4.9,2,6C2,7.1,2.9,8,4,8z\" fill=\"currentColor\"/><path d=\"M16,16H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2C18,16.9,17.1,16,16,16z\" fill=\"currentColor\"/></g></g></svg>   <span>Теги</span>\n    </div>'
            var channelbutton = '<div class=\"full-start__button selector view--channel\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M6.5 3.588c-.733 0-1.764.175-2.448.311a.191.191 0 0 0-.153.153c-.136.684-.31 1.715-.31 2.448 0 .733.174 1.764.31 2.448a.191.191 0 0 0 .153.153c.684.136 1.715.31 2.448.31.733 0 1.764-.174 2.448-.31a.191.191 0 0 0 .153-.153c.136-.684.31-1.715.31-2.448 0-.733-.174-1.764-.31-2.448a.191.191 0 0 0-.153-.153c-.684-.136-1.715-.31-2.448-.31ZM3.741 2.342C4.427 2.205 5.595 2 6.5 2c.905 0 2.073.205 2.759.342a1.78 1.78 0 0 1 1.4 1.4c.136.685.341 1.853.341 2.758s-.205 2.073-.342 2.759a1.78 1.78 0 0 1-1.4 1.4C8.574 10.794 7.406 11 6.5 11s-2.073-.205-2.759-.342a1.78 1.78 0 0 1-1.4-1.4C2.206 8.574 2 7.406 2 6.5s.205-2.073.342-2.759a1.78 1.78 0 0 1 1.4-1.4ZM6.5 14.588c-.733 0-1.764.175-2.448.311a.191.191 0 0 0-.153.153c-.136.684-.31 1.715-.31 2.448 0 .733.174 1.764.31 2.448a.191.191 0 0 0 .153.153c.684.136 1.715.31 2.448.31.733 0 1.764-.174 2.448-.31a.191.191 0 0 0 .153-.153c.136-.684.31-1.715.31-2.448 0-.733-.174-1.764-.31-2.448a.191.191 0 0 0-.153-.153c-.684-.136-1.715-.31-2.448-.31Zm-2.759-1.246C4.427 13.205 5.595 13 6.5 13c.905 0 2.073.205 2.759.342a1.78 1.78 0 0 1 1.4 1.4c.136.685.341 1.853.341 2.758s-.205 2.073-.342 2.759a1.78 1.78 0 0 1-1.4 1.4C8.574 21.794 7.406 22 6.5 22s-2.073-.205-2.759-.342a1.78 1.78 0 0 1-1.4-1.4C2.206 19.574 2 18.406 2 17.5s.205-2.073.342-2.759a1.78 1.78 0 0 1 1.4-1.4ZM17.5 3.588c-.733 0-1.764.175-2.448.311a.191.191 0 0 0-.153.153c-.136.684-.31 1.715-.31 2.448 0 .733.174 1.764.31 2.448a.191.191 0 0 0 .153.153c.684.136 1.715.31 2.448.31.733 0 1.764-.174 2.448-.31a.191.191 0 0 0 .153-.153c.136-.684.31-1.715.31-2.448 0-.733-.174-1.764-.31-2.448a.191.191 0 0 0-.153-.153c-.684-.136-1.715-.31-2.448-.31Zm-2.759-1.246C15.427 2.205 16.595 2 17.5 2c.905 0 2.073.205 2.759.342a1.78 1.78 0 0 1 1.4 1.4c.136.685.341 1.853.341 2.758s-.205 2.073-.342 2.759a1.78 1.78 0 0 1-1.4 1.4c-.685.136-1.853.341-2.758.341s-2.073-.205-2.759-.342a1.78 1.78 0 0 1-1.4-1.4C13.206 8.574 13 7.406 13 6.5s.205-2.073.342-2.759a1.78 1.78 0 0 1 1.4-1.4ZM17.5 14.588c-.733 0-1.764.175-2.448.311a.191.191 0 0 0-.153.153c-.136.684-.31 1.715-.31 2.448 0 .733.174 1.764.31 2.448a.191.191 0 0 0 .153.153c.684.136 1.715.31 2.448.31.733 0 1.764-.174 2.448-.31a.191.191 0 0 0 .153-.153c.136-.684.31-1.715.31-2.448 0-.733-.174-1.764-.31-2.448a.191.191 0 0 0-.153-.153c-.684-.136-1.715-.31-2.448-.31Zm-2.759-1.246c.686-.137 1.854-.342 2.759-.342.905 0 2.073.205 2.759.342a1.78 1.78 0 0 1 1.4 1.4c.136.685.341 1.853.341 2.758s-.205 2.073-.342 2.759a1.78 1.78 0 0 1-1.4 1.4c-.685.136-1.853.341-2.758.341s-2.073-.205-2.759-.342a1.78 1.78 0 0 1-1.4-1.4C13.206 19.574 13 18.406 13 17.5s.205-2.073.342-2.759a1.78 1.78 0 0 1 1.4-1.4Z" fill="currentColor"/></svg>   <span>Источник</span>\n    </div>'
            var findbutton = '<div class=\"full-start__button selector open--find\"><svg width=\"24px\" height=\"24px\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"> <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.5122 4.43902C7.60446 4.43902 4.43902 7.60283 4.43902 11.5026C4.43902 15.4024 7.60446 18.5662 11.5122 18.5662C13.4618 18.5662 15.225 17.7801 16.5055 16.5055C17.7918 15.2251 18.5854 13.4574 18.5854 11.5026C18.5854 7.60283 15.4199 4.43902 11.5122 4.43902ZM2 11.5026C2 6.25314 6.26008 2 11.5122 2C16.7643 2 21.0244 6.25314 21.0244 11.5026C21.0244 13.6919 20.2822 15.7095 19.0374 17.3157L21.6423 19.9177C22.1188 20.3936 22.1193 21.1658 21.6433 21.6423C21.1673 22.1188 20.3952 22.1193 19.9187 21.6433L17.3094 19.037C15.7048 20.2706 13.6935 21.0052 11.5122 21.0052C6.26008 21.0052 2 16.7521 2 11.5026Z" fill="currentColor"/> </svg></div>'
            var favoritebutton = '<div class=\"full-start__button selector open--favorite\"><svg fill=\"Currentcolor\" width=\"24px\" height=\"24px\" viewBox=\"0 0 0.72 0.72\" xmlns=\"http://www.w3.org/2000/svg\" enable-background=\"new 0 0 24 24\"><path d=\"M0.66 0.303c0.003 -0.015 -0.009 -0.033 -0.024 -0.033l-0.171 -0.024L0.387 0.09c-0.003 -0.006 -0.006 -0.009 -0.012 -0.012 -0.015 -0.009 -0.033 -0.003 -0.042 0.012L0.258 0.246 0.087 0.27c-0.009 0 -0.015 0.003 -0.018 0.009 -0.012 0.012 -0.012 0.03 0 0.042l0.123 0.12 -0.03 0.171c0 0.006 0 0.012 0.003 0.018 0.009 0.015 0.027 0.021 0.042 0.012l0.153 -0.081 0.153 0.081c0.003 0.003 0.009 0.003 0.015 0.003h0.006c0.015 -0.003 0.027 -0.018 0.024 -0.036l-0.03 -0.171 0.123 -0.12c0.006 -0.003 0.009 -0.009 0.009 -0.015z\"/></svg>   <span>Коллекция</span>\n    </div>';
            Lampa.Template.add('button_category', "<style>.freetv_jaja.category-full .card__icons {top: 0.3em;right: 0.3em;justify-content: center !important;}.freetv_jaja.category-full{ padding-bottom:8em;margin-top: -1.5em;} .freetv_jaja div.card__view{ position:relative; background-color:#353535; background-color:#353535a6; border-radius:1em; cursor:pointer; padding-bottom: 56%; } .freetv_jaja.square_icons div.card__view{ padding-bottom:100% } .freetv_jaja.category-full .card__icons { top:0.3em; right:0.3em; justify-content:right; }.freetv_jaja div.card__title {white-space: nowrap;text-overflow: ellipsis;display: block;}.info_jaja div.info__right{padding-top:0;}.info_jaja .info.layer--width{height:auto;font-size:0.7em;} @media screen and (max-width: 385px) { .card--collection { width: 33.3%!important; } .info_jaja div.info__right{display:block!important;} .info_jaja .info.layer--width {overflow: scroll;}  } </style><div class=\"full-start__buttons\">" + viewsort + viewcategory + viewtags + channelbutton + favoritebutton + findbutton  + "  </div>");
            Lampa.Template.add('info_web', '<div class="info layer--width"><div class="info__left"><div class="info__title"></div></div><div class="info__right">  <div id="web_filtr"></div></div></div>');
            var btn = Lampa.Template.get('button_category');
            info = Lampa.Template.get('info_web');
            info.find('#web_filtr').append(btn);
            info.find('.view--channel').on('hover:enter hover:click', function () { _this2.selectGroup(); });
			info.find('.view--sort').on('hover:enter hover:click', function () { listNavigation(); });
            info.find('.view--category').on('hover:enter hover:click', function () { listNavigation2(); });
			info.find('.view--tags').on('hover:enter hover:click', function () { listNavigation3(); });
            info.find('.open--favorite').on('hover:enter hover:click', function () { Lampa.Activity.push({ url: '', title: object.setup.title + ' - Коллекция', component: 'jaja', quantity: '', setup: object.setup, type: 'fav', page: 1 }); });
            info.find('.open--find').on('hover:enter hover:click', function () { Lampa.Input.edit({ title: object.setup.title + ' - Поиск видео', value: '', free: true, nosave: true }, function (new_value) { if (new_value) { var searchurl = object.setup.search.url.replace('#msearchword', encodeURIComponent(new_value)); Lampa.Activity.push({ url: searchurl, title: object.setup.title + ' - Поисковый запрос: "' + new_value + '"', component: 'jaja', quantity: '', setup: object.setup, page: 1, title_suffix: 'Поиск: "' + new_value + '"'}); } else Lampa.Controller.toggle('content'); }) });
            this.selectGroup = function () { var balanser_ = Lampa.Storage.get('online_jaja_balanser'); Lampa.Select.show({ title: 'Источник', items: catalogs.map(function (elem) { elem.selected = (balanser_ == elem.title); return elem; }), onSelect: function onSelect(a) { Lampa.Storage.set('online_jaja_balanser', a.title); var catalogs1 = catalogs.filter(function (fp) { return fp.title === a.title }); Lampa.Activity.push({ url: a.category[0].url, title: a.title + ' - ' + a.category[0].title, quantity: a.category[0].quantity, component: 'jaja', setup: catalogs1[0], page: 1, title_suffix: a.category[0].title }); }, onBack: function onBack() { Lampa.Controller.toggle('content'); } }); };
            
            scroll.render().addClass('layer--wheight').data('mheight', info);
            if (data_for_build.card.length) { 
                html.append(info);
                scroll.minus();
                html.append(scroll.render());
                this.append(data_for_build, false); 
                scroll.append(body);

                var scroll_element = scroll.render();
                scroll_element.off('scroll.jaja_autonext wheel.jaja_autonext'); 
                
                var scroll_timeout_debounce;
                var scrollHandler = function(event) {
                    clearTimeout(scroll_timeout_debounce);
                    scroll_timeout_debounce = setTimeout(function() {
                        if (waitload) return;
                        var el = scroll_element[0];
                        if (el.scrollHeight - el.scrollTop - el.clientHeight < 250) { 
                           _this2.next(); 
                        }
                    }, 150);
                };
                scroll_element.on('scroll.jaja_autonext', scrollHandler);
                // Для ПК, если Lampa.Scroll не обрабатывает wheel для вызова scroll события,
                // можно добавить отдельный listener на wheel, но это может привести к двойной проверке.
                // Попробуем пока так, полагаясь на то, что 'scroll' сработает.
                // scroll_element.on('wheel.jaja_autonext', scrollHandler); 


                // this.activity.loader(false); // Уже вызван в create
                this.activity.toggle();
            } else {
                html.append(scroll.render());
                _this2.empty();
            }
        };

        this.empty = function () {
            var empty = new Lampa.Empty(); 
            scroll.append(empty.render());
            this.activity.loader(false);
            this.activity.toggle();
        };

        var FAVORITE_RADIOS_KEY = 'favorite_jaja';
        function getFavoriteRadios() { return JSON.parse(localStorage.getItem(FAVORITE_RADIOS_KEY)) || []; }
        function saveFavoriteRadio(el) { var favoriteRadios = getFavoriteRadios(); if (!favoriteRadios.find(function(r) { return r.url === el.url; })) { favoriteRadios.push(el); localStorage.setItem(FAVORITE_RADIOS_KEY, JSON.stringify(favoriteRadios)); } }
        function removeFavorite(el) { var updatedHistory = getFavoriteRadios().filter(function (obj) { return obj.url !== el.url }); localStorage.setItem(FAVORITE_RADIOS_KEY, JSON.stringify(updatedHistory));} 
        function isFavorite(el_url) { return getFavoriteRadios().some(function (a) { return a.url === el_url; }); } 
        function cardImgBackground(card_data_img) { if (Lampa.Storage.field('background')) { return Lampa.Storage.get('background_type', 'complex') == 'poster' && card_data_img ? card_data_img : card_data_img; } return ''; };
        
        this.start = function () { 
            if (!this.activity || !Lampa.Activity.active() || Lampa.Activity.active().activity !== this.activity) {
                 if (Lampa.Activity.active() && Lampa.Activity.active().component === this.activity.component) {
                    this.activity = Lampa.Activity.active().activity;
                 } else { return; }
            }
            var _this = this; Lampa.Controller.add('content', { toggle: function () { Lampa.Controller.collectionSet(scroll.render()); Lampa.Controller.collectionFocus(last || false, scroll.render()); }, left: function () { if (Navigator.canmove('left')) Navigator.move('left'); else Lampa.Controller.toggle('menu'); }, right: function () { if (Navigator.canmove('right')) Navigator.move('right'); else if (info && info.find('.selector').length > 0) { var firstButton = info.find('.selector:visible:first'); if (firstButton.length) { Lampa.Controller.collectionSet(info); Navigator.move('left'); } } else _this.selectGroup(); }, up: function () { if (Navigator.canmove('up')) { Navigator.move('up'); } else { if (info && info.find('.selector').length > 0) { var focused_button_in_info = info.find('.selector.focus'); if (focused_button_in_info.length === 0) { Lampa.Controller.collectionSet(info); Navigator.move('right'); } else { Lampa.Controller.toggle('head'); } } else Lampa.Controller.toggle('head'); } }, down: function () { if (Navigator.canmove('down')) Navigator.move('down'); else if (info && info.find('.selector.focus').length > 0) { Lampa.Controller.collectionSet(scroll.render()); Lampa.Controller.collectionFocus(last || items[0] || false, scroll.render()); } }, back: function () { Lampa.Activity.backward(); } }); Lampa.Controller.toggle('content'); 
        };
        this.pause = function () { }; this.stop = function () { }; this.render = function () { return html; };
        this.destroy = function () { network.clear(); if (scroll && scroll.render()){ scroll.render().off('scroll.jaja_autonext wheel.jaja_autonext'); } if (scroll) scroll.destroy(); if (info) info.remove(); if (html) html.remove(); if (body) body.remove(); network = null; items = null; html = null; body = null; info = null; last = null; };
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
                { title: 'Недавно обновленное', url: 'https://jable.tv/latest-updates/', quantity: '' },
                { title: 'Новое', url: 'https://jable.tv/new-release/', quantity: '' },
                { title: 'Популярные за неделю', url: 'https://jable.tv/hot/', quantity: '' }
            ],
            list: { 
                page: { selector: ".pagination" }, 
                videoscontainer: { selector: "div.video-img-box" },
                title: { selector: "h6.title a", attrName: "text" },
                thumb: { selector: "img", attrName: "data-src" }, 
                link: { selector: "h6.title a", attrName: "href" },
                mnumber: { selector: "h6.title a", attrName: "href", filter: "\/([a-zA-Z0-9-]+)\/?$" }, 
                m_time: { selector: ".label", attrName: "text" } 
            },
            search: {
                url: 'https://jable.tv/search/?q=#msearchword&from_videos=1' 
            }
        }
        // NJAV удален
    ];

    var catalogs2 = [
        {
            title: "Jable.tv", 
            link: "https://jable.tv",
            datatype: "text",
            use_referer: true,
            category: [ 
                { title: 'BDSM', url: 'https://jable.tv/categories/bdsm/' },
                { title: 'Только секс', url: 'https://jable.tv/categories/sex-only/' },
                { title: 'Китайские субтитры', url: 'https://jable.tv/categories/chinese-subtitle/' },
                { title: 'Насилие', url: 'https://jable.tv/categories/insult/' },
                { title: 'Униформа', url: 'https://jable.tv/categories/uniform/' },
                { title: 'Ролевые игры', url: 'https://jable.tv/categories/roleplay/' },
                { title: 'Скрытая камера', url: 'https://jable.tv/categories/hidden-cam/' },
                { title: 'Без цензуры', url: 'https://jable.tv/categories/uncensored/' },
                { title: 'От первого лица', url: 'https://jable.tv/categories/pov/' },
                { title: 'Групповой секс', url: 'https://jable.tv/categories/groupsex/' },
                { title: 'В чулках', url: 'https://jable.tv/categories/pantyhose/' },
                { title: 'Лесби', url: 'https://jable.tv/categories/lesbian/' }
            ],
            list: catalogs[0].list, 
            search: catalogs[0].search 
        }
    ];
	
	var catalogs3 = [
        {
            title: "Jable.tv",
            link: "https://jable.tv",
            datatype: "text",
            use_referer: true,
            category: [
                { url: 'https://jable.tv/tags/wedding-dress/', title: '# Свадебное платье', quantity: '' },
                { url: 'https://jable.tv/tags/swimsuit/', title: '# Купальник', quantity: '' },
                { url: 'https://jable.tv/tags/stockings/', title: '# Чулки', quantity: '' },
                { url: 'https://jable.tv/tags/sportswear/', title: '# Спортивная одежда', quantity: '' },
                { url: 'https://jable.tv/tags/school-uniform/', title: '# Школьная форма', quantity: '' },
                { url: 'https://jable.tv/tags/pantyhose/', title: '# Колготки', quantity: '' },
                { url: 'https://jable.tv/tags/maid/', title: '# Служанка', quantity: '' },
                { url: 'https://jable.tv/tags/knee-socks/', title: '# Гольфы', quantity: '' },
                { url: 'https://jable.tv/tags/kimono/', title: '# Кимоно', quantity: '' },
                { url: 'https://jable.tv/tags/kemonomimi/', title: '# Кэмономими', quantity: '' },
                { url: 'https://jable.tv/tags/glasses/', title: '# Очки', quantity: '' },
                { url: 'https://jable.tv/tags/flesh-toned-pantyhose/', title: '# Колготки телесного цвета', quantity: '' },
                { url: 'https://jable.tv/tags/fishnets/', title: '# Рыболовные сети', quantity: '' },
                { url: 'https://jable.tv/tags/cheongsam/', title: '# Платье Чонсам', quantity: '' },
                { url: 'https://jable.tv/tags/bunny-girl/', title: '# Девочка-кролик', quantity: '' },
                { url: 'https://jable.tv/tags/black-pantyhose/', title: '# Черные колготки', quantity: '' },
                { url: 'https://jable.tv/tags/Cosplay/', title: '# Персонаж аниме', quantity: '' },
                { url: 'https://jable.tv/tags/tall/', title: '# Высокие', quantity: '' },
                { url: 'https://jable.tv/tags/tattoo/', title: '# Татуировка', quantity: '' },
                { url: 'https://jable.tv/tags/suntan/', title: '# Загар', quantity: '' },
                { url: 'https://jable.tv/tags/small-tits/', title: '# Маленькие сиськи', quantity: '' },
                { url: 'https://jable.tv/tags/short-hair/', title: '# Короткие волосы', quantity: '' },
                { url: 'https://jable.tv/tags/mature-woman/', title: '# Зрелая женщина', quantity: '' },
                { url: 'https://jable.tv/tags/hairless-pussy/', title: '# Безволосая киска', quantity: '' },
                { url: 'https://jable.tv/tags/girl/', title: '# Девочка', quantity: '' },
                { url: 'https://jable.tv/tags/flexible-body/', title: '# Гибкое тело', quantity: '' },
                { url: 'https://jable.tv/tags/dainty/', title: '# Изысканность', quantity: '' },
                { url: 'https://jable.tv/tags/big-tits/', title: '# Большие сиськи', quantity: '' },
                { url: 'https://jable.tv/tags/beautiful-leg/', title: '# Красивые ноги', quantity: '' },
                { url: 'https://jable.tv/tags/beautiful-butt/', title: '# Красивая задница', quantity: '' },
                { url: 'https://jable.tv/tags/tit-wank/', title: '# Между сисек', quantity: '' },
                { url: 'https://jable.tv/tags/squirting/', title: '# Брызги', quantity: '' },
                { url: 'https://jable.tv/tags/spasms/', title: '# Спазмы', quantity: '' },
                { url: 'https://jable.tv/tags/kiss/', title: '# Поцелуй', quantity: '' },
                { url: 'https://jable.tv/tags/footjob/', title: '# Дрочка ногами', quantity: '' },
                { url: 'https://jable.tv/tags/facial/', title: '# Уход за лицом', quantity: '' },
                { url: 'https://jable.tv/tags/deep-throat/', title: '# Глубокая глотка', quantity: '' },
                { url: 'https://jable.tv/tags/cum-in-mouth/', title: '# Кончить в рот', quantity: '' },
                { url: 'https://jable.tv/tags/creampie/', title: '# Кремовый пирог', quantity: '' },
                { url: 'https://jable.tv/tags/blowjob/', title: '# Минет', quantity: '' },
                { url: 'https://jable.tv/tags/anal-sex/', title: '# Анальный секс', quantity: '' },
                { url: 'https://jable.tv/tags/tune/', title: '# Мелодия', quantity: '' },
                { url: 'https://jable.tv/tags/torture/', title: '# Пытка', quantity: '' },
                { url: 'https://jable.tv/tags/soapland/', title: '# Мыльная страна', quantity: '' },
                { url: 'https://jable.tv/tags/quickie/', title: '# Быстро', quantity: '' },
                { url: 'https://jable.tv/tags/piss/', title: '# Писс', quantity: '' },
                { url: 'https://jable.tv/tags/outdoor/', title: '# На открытом воздухе', quantity: '' },
                { url: 'https://jable.tv/tags/massage/', title: '# Массаж', quantity: '' },
                { url: 'https://jable.tv/tags/masochism-guy/', title: '# Мазохистский парень', quantity: '' },
                { url: 'https://jable.tv/tags/groupsex/', title: '# Групповуха', quantity: '' },
                { url: 'https://jable.tv/tags/gang-r__e/', title: '# Банда R**e', quantity: '' },
                { url: 'https://jable.tv/tags/crapulence/', title: '# Похмелье', quantity: '' },
                { url: 'https://jable.tv/tags/chizyo/', title: '# Шлюха', quantity: '' },
                { url: 'https://jable.tv/tags/chikan/', title: '# Приставание', quantity: '' },
                { url: 'https://jable.tv/tags/breast-milk/', title: '# Грудное молоко', quantity: '' },
                { url: 'https://jable.tv/tags/bondage/', title: '# Бондаж', quantity: '' },
                { url: 'https://jable.tv/tags/3p/', title: '# 3P', quantity: '' },
                { url: 'https://jable.tv/tags/10-times-a-day/', title: '# 10 раз в день', quantity: '' },
                { url: 'https://jable.tv/tags/virginity/', title: '# Девственность', quantity: '' },
                { url: 'https://jable.tv/tags/ugly-man/', title: '# Уродливый человек', quantity: '' },
                { url: 'https://jable.tv/tags/time-stop/', title: '# Остановка времени', quantity: '' },
                { url: 'https://jable.tv/tags/temptation/', title: '# Искушение', quantity: '' },
                { url: 'https://jable.tv/tags/sex-beside-husband/', title: '# Секс рядом с мужем', quantity: '' },
                { url: 'https://jable.tv/tags/rainy-day/', title: '# Дождливый день', quantity: '' },
                { url: 'https://jable.tv/tags/ntr/', title: '# Измена', quantity: '' }, 
                { url: 'https://jable.tv/tags/love-potion/', title: '# Любовное зелье', quantity: '' },
                { url: 'https://jable.tv/tags/hidden-cam/', title: '# Скрытая камера', quantity: '' }, 
                { url: 'https://jable.tv/tags/incest/', title: '# Инцест', quantity: '' }, 
                { url: 'https://jable.tv/tags/hypnosis/', title: '# Гипноз', quantity: '' },
                { url: 'https://jable.tv/tags/giant/', title: '# Гигант', quantity: '' },
                { url: 'https://jable.tv/tags/black/', title: '# Черный', quantity: '' },
                { url: 'https://jable.tv/tags/avenge/', title: '# Месть', quantity: '' },
                { url: 'https://jable.tv/tags/age-difference/', title: '# Разница в возрасте', quantity: '' },
                { url: 'https://jable.tv/tags/affair/', title: '# Обман', quantity: '' },
                { url: 'https://jable.tv/tags/wife/', title: '# Замужняя женщина', quantity: '' },
                { url: 'https://jable.tv/tags/widow/', title: '# Вдова', quantity: '' },
                { url: 'https://jable.tv/tags/team-manager/', title: '# Менеджер команды', quantity: '' },
                { url: 'https://jable.tv/tags/teacher/', title: '# Учитель', quantity: '' },
                { url: 'https://jable.tv/tags/club-hostess-and-sex-worker/', title: '# Секс-работница', quantity: '' },
                { url: 'https://jable.tv/tags/private-teacher/', title: '# Частный учитель', quantity: '' },
                { url: 'https://jable.tv/tags/ol/', title: '# ОЛ', quantity: '' },
                { url: 'https://jable.tv/tags/nurse/', title: '# Медсестра', quantity: '' }, 
                { url: 'https://jable.tv/tags/idol/', title: '# Идол', quantity: '' },
                { url: 'https://jable.tv/tags/housewife/', title: '# Домохозяйка', quantity: '' },
                { url: 'https://jable.tv/tags/fugitive/', title: '# Беглец', quantity: '' },
                { url: 'https://jable.tv/tags/flight-attendant/', title: '# Бортпроводник', quantity: '' },
                { url: 'https://jable.tv/tags/female-anchor/', title: '# Женщина-ведущая', quantity: '' },
                { url: 'https://jable.tv/tags/doctor/', title: '# Доктор', quantity: '' },
                { url: 'https://jable.tv/tags/detective/', title: '# Детектив', quantity: '' },
                { url: 'https://jable.tv/tags/couple/', title: '# Пара', quantity: '' },
                { url: 'https://jable.tv/tags/tram/', title: '# Трамвай', quantity: '' },
                { url: 'https://jable.tv/tags/toilet/', title: '# Туалет', quantity: '' },
                { url: 'https://jable.tv/tags/swimming-pool/', title: '# Бассейн', quantity: '' },
                { url: 'https://jable.tv/tags/store/', title: '# Магазин', quantity: '' },
                { url: 'https://jable.tv/tags/school/', title: '# Школа', quantity: '' },
                { url: 'https://jable.tv/tags/prison/', title: '# Тюрьма', quantity: '' },
                { url: 'https://jable.tv/tags/magic-mirror/', title: '# Волшебное зеркало', quantity: '' },
                { url: 'https://jable.tv/tags/library/', title: '# Библиотека', quantity: '' },
                { url: 'https://jable.tv/tags/hot-spring/', title: '# Горячий источник', quantity: '' },
                { url: 'https://jable.tv/tags/gym-room/', title: '# Спортзал', quantity: '' },
                { url: 'https://jable.tv/tags/first-night/', title: '# Первая ночь', quantity: '' },
                { url: 'https://jable.tv/tags/car/', title: '# Автомобиль', quantity: '' },
                { url: 'https://jable.tv/tags/bathing-place/', title: '# Место для купания', quantity: '' },
                { url: 'https://jable.tv/tags/video-recording/', title: '# Видеозапись', quantity: '' },
                { url: 'https://jable.tv/tags/variety-show/', title: '# Варьете (Шоу)', quantity: '' },
                { url: 'https://jable.tv/tags/thanksgiving/', title: '# День благодарения', quantity: '' },
                { url: 'https://jable.tv/tags/more-than-4-hours/', title: '# Более 4 часов', quantity: '' },
                { url: 'https://jable.tv/tags/festival/', title: '# Фестиваль', quantity: '' },
                { url: 'https://jable.tv/tags/debut-retires/', title: '# Дебют / Уходит в отставку', quantity: '' }
            ],
            list: catalogs[0].list,
            search: catalogs[0].search
        }
    ];
	
    function listNavigation() {
        if (!Lampa.Storage.get('online_jaja_balanser') && catalogs.length > 0) {
            Lampa.Storage.set('online_jaja_balanser', catalogs[0].title);
        }
        var balanser = Lampa.Storage.get('online_jaja_balanser');
        var catalogs1 = catalogs.filter(function (fp) { return fp.title === balanser; });
        if (catalogs1.length === 0 && catalogs.length > 0) { catalogs1 = [catalogs[0]]; Lampa.Storage.set('online_jaja_balanser', catalogs[0].title); }
        if (catalogs1.length === 0) { Lampa.Noty.show('Нет доступных источников.'); return; }

        Lampa.Select.show({
            title: catalogs1[0].title, items: catalogs1[0].category,
            onSelect: function onSelect(a) { Lampa.Activity.push({ url: a.url, title_suffix: a.title, component: 'jaja', quantity: a.quantity, setup: catalogs1[0], page: 1 }); },
            onBack: function onBack() { Lampa.Controller.toggle('content'); }
        });
    };
	function listNavigation2() {
        if (!Lampa.Storage.get('online_jaja_balanser') && catalogs2.length > 0) { Lampa.Storage.set('online_jaja_balanser', catalogs2[0].title); }
        var balanser = Lampa.Storage.get('online_jaja_balanser');
        var catalogs1 = catalogs2.filter(function (fp) { return fp.title === balanser; });
        if (catalogs1.length === 0 && catalogs2.length > 0) { catalogs1 = [catalogs2[0]]; Lampa.Storage.set('online_jaja_balanser', catalogs2[0].title); }
        if (catalogs1.length === 0) { Lampa.Noty.show('Нет доступных источников для категорий.'); return; }
        Lampa.Select.show({
            title: catalogs1[0].title, items: catalogs1[0].category,
            onSelect: function onSelect(a) { Lampa.Activity.push({ url: a.url, title_suffix: a.title, component: 'jaja', quantity: a.quantity, setup: catalogs1[0], page: 1 }); },
            onBack: function onBack() { Lampa.Controller.toggle('content'); }
        });
    };
	function listNavigation3() {
        if (!Lampa.Storage.get('online_jaja_balanser') && catalogs3.length > 0) { Lampa.Storage.set('online_jaja_balanser', catalogs3[0].title); }
        var balanser = Lampa.Storage.get('online_jaja_balanser');
        var catalogs1 = catalogs3.filter(function (fp) { return fp.title === balanser; });
        if (catalogs1.length === 0 && catalogs3.length > 0) { catalogs1 = [catalogs3[0]]; Lampa.Storage.set('online_jaja_balanser', catalogs3[0].title); }
        if (catalogs1.length === 0) { Lampa.Noty.show('Нет доступных источников для тегов.'); return; }
        Lampa.Select.show({
            title: catalogs1[0].title, items: catalogs1[0].category,
            onSelect: function onSelect(a) { Lampa.Activity.push({ url: a.url, title_suffix: a.title, component: 'jaja', quantity: a.quantity, setup: catalogs1[0], page: 1 }); },
            onBack: function onBack() { Lampa.Controller.toggle('content'); }
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
        }

        if (window.appready) addSettingsjaja();
        else {
            Lampa.Listener.follow('app', function (e) {
                if (e.type == 'ready') addSettingsjaja();
            });
        }
    }

    if (!window.plugin_jaja_ready) startjaja();

})();
    // --- КОНЕЦ ЧАСТИ 2 ---
