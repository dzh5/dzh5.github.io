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
        var total_pages; // Эта переменная будет использоваться для хранения общего количества страниц
        var cors = 'https://api.allorigins.win/get?url=';
        var MOBILE_UA = "Mozilla/5.0 (Linux; Android 11; M2007J3SC Build/RKQ1.200826.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045714 Mobile Safari/537.36";
        // PC_UA, UA, UC_UA, IOS_UA и другие неиспользуемые UA удалены для краткости, если они были

        var activity = {
            url: '', // Будет установлено в create
            title: '', // Будет установлено в create
            component: 'jaja',
            quantity: object.quantity || '', // Из вашего оригинального кода
            setup: object.setup,
            type: object.type || 'movie', // Добавим тип по умолчанию
            page: 1 // Начинаем с первой страницы
        };
        
        // Переменная для хранения URL следующей страницы, полученного от парсера
        var next_page_url_from_parser; 

        this.create = function () {
            var _this = this;
            activity.url = object.url; // Устанавливаем URL из переданного объекта
            activity.title = (object.setup ? object.setup.title : "JaJa") + ' - ' + (object.title_suffix || "Коллекция");


            this.activity.loader(true);
            waitload = true; // Блокируем загрузку, пока первая не завершится

            // Сброс состояния пагинации для нового Activity
            activity.page = 1;
            total_pages = 0; // Сбрасываем общее количество страниц
            next_page_url_from_parser = undefined;

            var current_cors = cors;
            if (object.setup && object.setup.datatype !== 'json') {
                current_cors = '';
            }

            if (object.type == 'fav') { 
                var favData = _this.cardfavor(getFavoriteRadios());
                _this.build(favData); // favData уже содержит {card, page, total_pages}
                waitload = false;
                this.activity.loader(false);
            } else {
                var initial_url = object.url;
                // Для Jable, если это первая страница и нет page=, добавляем page=1 и lang=en
                if (initial_url.includes('jable.tv') && initial_url.indexOf('page=') === -1) {
                    if (initial_url.includes('?')) {
                        initial_url += '&page=1';
                    } else {
                        initial_url += '?page=1';
                    }
                    if (initial_url.indexOf('lang=en') === -1) {
                        initial_url += (initial_url.includes('?') ? '&' : '?') + 'lang=en';
                    }
                }

                network["native"](current_cors + initial_url, function (str) {
                    var parsedData = _this.card(str); // this.card должен вернуть {card, page, total_pages}
                    total_pages = parsedData.total_pages;
                    next_page_url_from_parser = parsedData.page; // Сохраняем URL для следующей страницы
                    _this.build(parsedData);
                    waitload = false;
                    _this.activity.loader(false);
                }, function (a, c) {
                    Lampa.Noty.show(network.errorDecode(a, c));
                    _this.activity.loader(false);
                    waitload = false;
                    _this.empty();
                }, false, {
                    dataType: object.setup ? object.setup.datatype : 'text',
                });
            }
            
            return this.render();
        };

        // Используем версию next из вашего оригинального кода с небольшими адаптациями
        this.next = function () { // Убираем параметр 'page', т.к. URL берем из next_page_url_from_parser или формируем
            var _this2 = this;

            // Проверяем, есть ли URL для следующей страницы от парсера
            // или можем ли мы сформировать URL на основе activity.page
            var url_to_request = next_page_url_from_parser;

            if (!url_to_request) {
                // Если парсер не дал URL, пытаемся сформировать его, если не достигли total_pages
                if (total_pages > 0 && activity.page >= total_pages) {
                    return; // Достигли конца
                }
                // Формируем URL для следующей страницы (activity.page + 1)
                var next_page_num = activity.page + 1;
                var base_url_for_next = object.url.replace(/&?page=\d+/, '');
                if (base_url_for_next.endsWith('?')) { 
                    base_url_for_next = base_url_for_next.slice(0, -1);
                }
                if (base_url_for_next.includes('?')) {
                    url_to_request = base_url_for_next + '&page=' + next_page_num;
                } else {
                    url_to_request = base_url_for_next + '?page=' + next_page_num;
                }
                if (url_to_request.indexOf('jable.tv') !== -1 && url_to_request.indexOf('lang=en') === -1) {
                    var q_mark_present = url_to_request.includes('?');
                    var existing_params = q_mark_present ? url_to_request.split('?')[1] : '';
                    var param_separator = (q_mark_present && existing_params !== '') ? '&' : (q_mark_present ? '' : '?');
                    url_to_request += param_separator + 'lang=en';
                }
            }
            
            if (!url_to_request || waitload) return;


            waitload = true;
            // this.activity.loader(true); // Анимацию для next убрали

            var current_cors_to_use = cors;
            if (object.setup && object.setup.datatype !== 'json') {
                current_cors_to_use = '';
            }
            
            network.clear();
            network.timeout(1000 * 40);

            var headers = { 'User-Agent': MOBILE_UA };
             if (object.setup && object.setup.use_referer && object.url) {
                try {
                    // Для Referer используем URL текущей (уже загруженной) страницы
                    var referer_url = object.url; // Базовый
                    if (activity.page > 1) { // Если это не первая страница, которую мы запрашивали
                         var prev_page_url = object.url.replace(/&?page=\d+/, '');
                         if (prev_page_url.endsWith('?')) prev_page_url = prev_page_url.slice(0, -1);
                         if (prev_page_url.includes('?')) { prev_page_url += '&page=' + (activity.page); }
                         else { prev_page_url += '?page=' + (activity.page); }
                          if (prev_page_url.indexOf('jable.tv') !== -1 && prev_page_url.indexOf('lang=en') === -1) {
                           var q_mark_prev = prev_page_url.includes('?');
                           var existing_params_prev = q_mark_prev ? prev_page_url.split('?')[1] : '';
                           var param_sep_prev = (q_mark_prev && existing_params_prev !== '') ? '&' : (q_mark_prev ? '' : '?');
                           prev_page_url += param_sep_prev + 'lang=en';
                        }
                        referer_url = prev_page_url;
                    } else if (activity.page === 1 && url_to_request.includes('page=2')) { // Если грузим вторую страницу, реферер - первая
                        referer_url = object.url; // Тот, с которым зашли
                        if (referer_url.indexOf('jable.tv') !== -1 && referer_url.indexOf('page=') === -1) {
                             if (referer_url.includes('?')) { referer_url += '&page=1';} else { referer_url += '?page=1';}
                             if (referer_url.indexOf('lang=en') === -1) { referer_url += (referer_url.includes('&page=1') ? '&' : '?') + 'lang=en';}
                        }
                    }
                    headers['Referer'] = referer_url;
                } catch (e) {}
            }
            
            network["native"](current_cors_to_use + url_to_request, function (result) {
                var parsedData = _this2.card(result); 
                
                if (parsedData.card.length > 0) {
                    activity.page++; // Увеличиваем счетчик загруженных страниц
                    total_pages = parsedData.total_pages; 
                    next_page_url_from_parser = parsedData.page; 
                    _this2.append(parsedData, true);
                    waitload = false;
                } else {
                    // Lampa.Noty.show('Больше элементов не найдено.');
                    next_page_url_from_parser = undefined; // Следующей страницы нет
                    total_pages = activity.page; // Считаем текущую последней
                    waitload = true; 
                }
                // this.activity.loader(false); 
            }, function (a, c) {
                if (a.status == 404) {
                    // Lampa.Noty.show('Страница не найдена (404).');
                    total_pages = activity.page; 
                    next_page_url_from_parser = undefined;
                } else {
                    Lampa.Noty.show(network.errorDecode(a, c));
                }
                // this.activity.loader(false); 
                waitload = false; 
            }, false, {
                dataType: object.setup ? object.setup.datatype : 'text',
                headers: headers
            });
        };

        this.card = function (str_data_from_network) { // Убрали currentPageNumberForParsing
            var card_list = []; 
            var next_page_url_parsed; 
            var total_pages_parsed = activity.page; // Используем текущую страницу из activity как базу

            var current_setup = object.setup; 
            if (!current_setup) {
                Lampa.Noty.show("Ошибка: Конфигурация источника (setup) отсутствует.");
                return { card: [], page: undefined, total_pages: 0 };
            }
            var response_content = str_data_from_network;
            // ... (обработка JSON и allorigins - без изменений)
            if (current_setup.datatype == 'json' && typeof response_content === 'string') { try { var parsed_json = JSON.parse(response_content); response_content = parsed_json.contents ? parsed_json.contents : parsed_json; if(typeof response_content === 'string' && (response_content.startsWith('{') || response_content.startsWith('['))) { response_content = JSON.parse(response_content);}} catch (e) {}}
            if (typeof response_content === 'object' && current_setup.datatype == 'json' && response_content.contents) { response_content = response_content.contents; try { if(typeof response_content === 'string') response_content = JSON.parse(response_content); } catch(e){}}
            if (current_setup.datatype == 'text' && typeof response_content === 'object' && response_content.contents) { response_content = response_content.contents; }
            
            var html_content_str = typeof response_content === 'string' ? response_content.replace(/\n/g, '') : '';

            var v_selector = current_setup.list.videoscontainer.selector;
            var t_selector = current_setup.list.title.selector;
            var th_selector = current_setup.list.thumb.selector; // Селектор для <img>
            var l_selector = current_setup.list.link.selector;
            var p_selector = current_setup.list.page.selector; 
            var m_selector = current_setup.list.mnumber.selector;
            var base_url = current_setup.link; 

            var pagination_elements = $(p_selector, html_content_str);
            if (pagination_elements.length > 0) {
                var page_links = pagination_elements.find('a.page-link[href]:not([href="#"]):not([href="javascript:;"])');
                var current_page_span = pagination_elements.find('span.page-link.active.disabled, span.page-numbers.current').first();
                var next_link_element;

                if (current_page_span.length) { // Если есть активный элемент (span)
                    next_link_element = current_page_span.parent().nextAll('li.page-item').find('a.page-link').first();
                } else { // Если активного нет, ищем ссылку на следующую страницу по номеру или тексту "Next"
                     var current_activity_page = activity.page; // Берем текущую страницу из activity
                     page_links.each(function() {
                        var $this = $(this);
                        var link_text = $this.text().trim();
                        var link_page_num = parseInt(link_text, 10);

                        if (link_text.toLowerCase().includes('next') || link_text.includes('»') || $this.is('[rel="next"]')) {
                            next_link_element = $this;
                            return false; // Нашли "Next", выходим
                        }
                        if ($.isNumeric(link_page_num) && link_page_num === current_activity_page + 1) {
                             next_link_element = $this; 
                             // Не выходим, т.к. "Next" может быть дальше
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
                        } else { // Если из "Last" не смогли извлечь, смотрим на текущую + есть ли "Next"
                            total_pages_parsed = (next_link_element && next_link_element.length) ? activity.page + 1 : activity.page;
                        }
                    }
                } else if (current_page_span.length && (!next_link_element || !next_link_element.length)) { // Есть активная, но нет следующей
                     var current_text_num = parseInt(current_page_span.text().trim(), 10);
                     total_pages_parsed = $.isNumeric(current_text_num) ? current_text_num : activity.page;
                } else { // Пагинация есть, но ничего не поняли
                     total_pages_parsed = activity.page; // Предполагаем, что текущая - последняя
                }
                 total_pages_parsed = Math.max(total_pages_parsed, activity.page); 

                if (next_page_url_parsed && next_page_url_parsed.indexOf('http') === -1) {
                    next_page_url_parsed = base_url + (next_page_url_parsed.startsWith('/') ? next_page_url_parsed : '/' + next_page_url_parsed);
                }
                if (next_page_url_parsed && (next_page_url_parsed.indexOf('#') !== -1 || next_page_url_parsed.startsWith('javascript:'))) { 
                    next_page_url_parsed = undefined; 
                }
            } else { 
                 total_pages_parsed = activity.page; // Если блока пагинации нет
            }
            
            var items_on_page = $(v_selector, html_content_str);
            if (items_on_page.length === 0 && activity.page > 1) { // Если это не первая страница и мы не нашли на ней карточек
                next_page_url_parsed = undefined; // Значит, следующей точно нет
                total_pages_parsed = activity.page -1; // Предыдущая была последней
            }


            items_on_page.each(function (i, html_item_el) {
                var $html_item = $(html_item_el); 
                var t1_el = t_selector ? $html_item.find(t_selector) : $html_item;
                var u1_el = l_selector ? $html_item.find(l_selector) : $html_item;
                var i1_el = th_selector ? $html_item.find(th_selector) : $html_item; // Это элемент <img>
                var m1_el = m_selector ? $html_item.find(m_selector) : $html_item;
                var tt, uu, ii, mm, pp = ''; // pp для data-preview

                // Парсинг title, link, episodes_info (mm)
                switch (current_setup.list.title.attrName) { case 'text': tt = t1_el.text(); break; case 'html': tt = t1_el.html(); break; default: tt = t1_el.attr(current_setup.list.title.attrName); }
                if (typeof tt === 'undefined') return true; tt = tt.trim();
                if (current_setup.list.title.filter) { var title_match = tt.match(new RegExp(current_setup.list.title.filter)); tt = title_match ? (title_match[1] !== undefined ? title_match[1] : title_match[0]) : tt; }
                switch (current_setup.list.link.attrName) { case 'text': uu = u1_el.text(); break; case 'html': uu = u1_el.html(); break; default: uu = u1_el.attr(current_setup.list.link.attrName); }
                uu = (uu || "").trim(); if (uu.indexOf('http') === -1 && uu) { uu = base_url + (uu.startsWith('/') ? uu : '/' + uu); }
                if (current_setup.list.link.filter) { var link_match = uu.match(new RegExp(current_setup.list.link.filter)); uu = link_match ? (link_match[1] !== undefined ? link_match[1] : link_match[0]) : uu; }
                
                // Парсинг thumb (img src) и data-preview из элемента <img>
                if (i1_el.length) { // Убедимся, что элемент img найден
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
            var page; 
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
                var original_img_html = card_img_container.html(); // Сохраняем исходный HTML с <img>

                var showImage = function() {
                    if (card_img_container.find('video').length) {
                        card_img_container.html(original_img_html); // Восстанавливаем оригинальный img
                        // Переназначаем обработчики, если нужно, но Lampa.Template должен это делать
                        var img_tag = card_img_container.find('img')[0];
                        if (img_tag) { // Если img был восстановлен
                           img_tag.onload = function () { card_element.addClass('card--loaded'); };
                           img_tag.onerror = function (e) {
                                var hex = (Lampa.Utils.hash(element.title) * 1).toString(16); while (hex.length < 6) hex += hex; hex = hex.substring(0, 6);
                                var r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
                                var hexText = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
                                card_img_container.empty().append('<div class="card__img-placeholder" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; text-align: center; padding: 5px; box-sizing: border-box; overflow: hidden;">' + Lampa.Utils.subText(element.title, 50) + '</div>'); 
                                if(card_element.find('.card__view').length) card_element.find('.card__view').css({ 'background-color': '#' + hex, 'color': hexText });
                                card_element.addClass('card--loaded');
                            };
                           if (element.img) img_tag.src = element.img; else img_tag.onerror(); // Устанавливаем src
                        }
                    }
                };
                
                // Начальное отображение картинки (шаблон Lampa уже должен это сделать)
                var initial_img_tag = card_img_container.find('img')[0];
                if(initial_img_tag){
                    initial_img_tag.onload = function () { card_element.addClass('card--loaded');};
                    initial_img_tag.onerror = function (e) {
                        var hex = (Lampa.Utils.hash(element.title) * 1).toString(16); while (hex.length < 6) hex += hex; hex = hex.substring(0, 6);
                        var r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
                        var hexText = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
                        card_img_container.empty().append('<div class="card__img-placeholder" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; text-align: center; padding: 5px; box-sizing: border-box; overflow: hidden;">' + Lampa.Utils.subText(element.title, 50) + '</div>'); 
                        if(card_element.find('.card__view').length) card_element.find('.card__view').css({ 'background-color': '#' + hex, 'color': hexText });
                        card_element.addClass('card--loaded');
                    };
                    if (element.img) initial_img_tag.src = element.img; else initial_img_tag.onerror();
                }


                if (element.rate) { card_element.find('.card__view').append('<div class="card__type"></div>'); card_element.find('.card__type').text(element.rate); }
                if (element.quantity) { card_element.find('.card__icons-inner').text(element.quantity).css({ 'padding': '0.4em 0.4em' }); }
                if (element.update) { card_element.find('.card__view').append('<div class="card__quality"></div>'); card_element.find('.card__quality').text(element.update); }

                card_element.on('hover:focus', function () {
                    last = card_element[0];
                    // Восстанавливаем img на предыдущем focused элементе, если там было видео
                    if (window.jaja_last_focused_card && window.jaja_last_focused_card !== card_element) {
                        var prev_card_img_container = window.jaja_last_focused_card.find('.card__img');
                        if (prev_card_img_container.find('video').length) {
                            // Вызываем функцию восстановления для предыдущей карточки (нужно передать её element.img)
                            // Это усложнение, пока оставим так. Lampa должна сама убирать hover-эффекты.
                        }
                    }
                    window.jaja_last_focused_card = card_element;


                    scroll.update(card_element, true);
                    if(info) { 
                        info.find('.info__title').text(element.episodes_info || element.title); 
                        info.find('.info__title-original').text(element.original_title || '');
                        info.find('.info__rate span').text(element.rate || '');
                        info.find('.info__create').text(element.year || ''); 
                        info.find('.info__rate').toggleClass('hide', !(element.rate));
                    }
                    
                    if (element.preview) {
                        card_img_container.empty(); 
                        var video_preview = $('<video autoplay loop muted playsinline class="card__video-preview" style="width: 100%; height: 100%; object-fit: cover;"></video>');
                        video_preview.attr('src', element.preview);
                        video_preview.on('error', function() { showImage(); }); 
                        video_preview.on('canplay', function() { this.play().catch(function(e){ /* console.log("Play error:",e) */ }); }); 
                        card_img_container.append(video_preview);
                    } else if (element.img) { 
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
                    showImage(); 
                });
                
                card_element.on('hover:enter', function () { /* ... как было ... */ });
                card_element.on('hover:long', function () { /* ... как было ... */ });
                
                body.append(card_element);
                if (is_append_operation) Lampa.Controller.collectionAppend(card_element);
                items.push(card_element);
            });
        };

        this.build = function (data_for_build) {
            var _this2 = this;
            var viewsort = '<div class="full-start__button selector view--sort"><svg style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="info"/><g id="icons"><g id="menu"><path d="M20,10H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2C22,10.9,21.1,10,20,10z" fill="currentColor"/><path d="M4,8h12c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2H4C2.9,4,2,4.9,2,6C2,7.1,2.9,8,4,8z" fill="currentColor"/><path d="M16,16H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2C18,16.9,17.1,16,16,16z" fill="currentColor"/></g></g></svg>   <span>Сортировать</span></div>';
            var viewcategory = '<div class="full-start__button selector view--category"><svg style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="info"/><g id="icons"><g id="menu"><path d="M20,10H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2C22,10.9,21.1,10,20,10z" fill="currentColor"/><path d="M4,8h12c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2H4C2.9,4,2,4.9,2,6C2,7.1,2.9,8,4,8z" fill="currentColor"/><path d="M16,16H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2C18,16.9,17.1,16,16,16z" fill="currentColor"/></g></g></svg>   <span>Категории</span></div>';
            var viewtags = '<div class="full-start__button selector view--tags"><svg style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="info"/><g id="icons"><g id="menu"><path d="M20,10H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2C22,10.9,21.1,10,20,10z" fill="currentColor"/><path d="M4,8h12c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2H4C2.9,4,2,4.9,2,6C2,7.1,2.9,8,4,8z" fill="currentColor"/><path d="M16,16H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2C18,16.9,17.1,16,16,16z" fill="currentColor"/></g></g></svg>   <span>Теги</span></div>';
            var channelbutton = '<div class="full-start__button selector view--channel"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.5 3.588c-.733 0-1.764.175-2.448.311a.191.191 0 0 0-.153.153c-.136.684-.31 1.715-.31 2.448 0 .733.174 1.764.31 2.448a.191.191 0 0 0 .153.153c.684.136 1.715.31 2.448.31.733 0 1.764-.174 2.448-.31a.191.191 0 0 0 .153-.153c.136-.684.31-1.715.31-2.448 0-.733-.174-1.764-.31-2.448a.191.191 0 0 0-.153-.153c-.684-.136-1.715-.31-2.448-.31ZM3.741 2.342C4.427 2.205 5.595 2 6.5 2c.905 0 2.073.205 2.759.342a1.78 1.78 0 0 1 1.4 1.4c.136.685.341 1.853.341 2.758s-.205 2.073-.342 2.759a1.78 1.78 0 0 1-1.4 1.4C8.574 10.794 7.406 11 6.5 11s-2.073-.205-2.759-.342a1.78 1.78 0 0 1-1.4-1.4C2.206 8.574 2 7.406 2 6.5s.205-2.073.342-2.759a1.78 1.78 0 0 1 1.4-1.4ZM6.5 14.588c-.733 0-1.764.175-2.448.311a.191.191 0 0 0-.153.153c-.136.684-.31 1.715-.31 2.448 0 .733.174 1.764.31 2.448a.191.191 0 0 0 .153.153c.684.136 1.715.31 2.448.31.733 0 1.764-.174 2.448-.31a.191.191 0 0 0 .153-.153c.136-.684.31-1.715.31-2.448 0-.733-.174-1.764-.31-2.448a.191.191 0 0 0-.153-.153c-.684-.136-1.715-.31-2.448-.31Zm-2.759-1.246C4.427 13.205 5.595 13 6.5 13c.905 0 2.073.205 2.759.342a1.78 1.78 0 0 1 1.4 1.4c.136.685.341 1.853.341 2.758s-.205 2.073-.342 2.759a1.78 1.78 0 0 1-1.4 1.4C8.574 21.794 7.406 22 6.5 22s-2.073-.205-2.759-.342a1.78 1.78 0 0 1-1.4-1.4C2.206 19.574 2 18.406 2 17.5s.205-2.073.342-2.759a1.78 1.78 0 0 1 1.4-1.4ZM17.5 3.588c-.733 0-1.764.175-2.448.311a.191.191 0 0 0-.153.153c-.136.684-.31 1.715-.31 2.448 0 .733.174 1.764.31 2.448a.191.191 0 0 0 .153.153c.684.136 1.715.31 2.448.31.733 0 1.764-.174 2.448-.31a.191.191 0 0 0 .153-.153c.136-.684.31-1.715.31-2.448 0-.733-.174-1.764-.31-2.448a.191.191 0 0 0-.153-.153c-.684-.136-1.715-.31-2.448-.31Zm-2.759-1.246C15.427 2.205 16.595 2 17.5 2c.905 0 2.073.205 2.759.342a1.78 1.78 0 0 1 1.4 1.4c.136.685.341 1.853.341 2.758s-.205 2.073-.342 2.759a1.78 1.78 0 0 1-1.4 1.4c-.685.136-1.853.341-2.758.341s-2.073-.205-2.759-.342a1.78 1.78 0 0 1-1.4-1.4C13.206 8.574 13 7.406 13 6.5s.205-2.073.342-2.759a1.78 1.78 0 0 1 1.4-1.4ZM17.5 14.588c-.733 0-1.764.175-2.448.311a.191.191 0 0 0-.153.153c-.136.684-.31 1.715-.31 2.448 0 .733.174 1.764.31 2.448a.191.191 0 0 0 .153.153c.684.136 1.715.31 2.448.31.733 0 1.764-.174 2.448-.31a.191.191 0 0 0 .153-.153c.136-.684.31-1.715.31-2.448 0-.733-.174-1.764-.31-2.448a.191.191 0 0 0-.153-.153c-.684-.136-1.715-.31-2.448-.31Zm-2.759-1.246c.686-.137 1.854-.342 2.759-.342.905 0 2.073.205 2.759.342a1.78 1.78 0 0 1 1.4 1.4c.136.685.341 1.853.341 2.758s-.205 2.073-.342 2.759a1.78 1.78 0 0 1-1.4 1.4c-.685.136-1.853.341-2.758.341s-2.073-.205-2.759-.342a1.78 1.78 0 0 1-1.4-1.4C13.206 19.574 13 18.406 13 17.5s.205-2.073.342-2.759a1.78 1.78 0 0 1 1.4-1.4Z" fill="currentColor"/></svg>   <span>Источник</span></div>';
            var findbutton = '<div class="full-start__button selector open--find"><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5122 4.43902C7.60446 4.43902 4.43902 7.60283 4.43902 11.5026C4.43902 15.4024 7.60446 18.5662 11.5122 18.5662C13.4618 18.5662 15.225 17.7801 16.5055 16.5055C17.7918 15.2251 18.5854 13.4574 18.5854 11.5026C18.5854 7.60283 15.4199 4.43902 11.5122 4.43902ZM2 11.5026C2 6.25314 6.26008 2 11.5122 2C16.7643 2 21.0244 6.25314 21.0244 11.5026C21.0244 13.6919 20.2822 15.7095 19.0374 17.3157L21.6423 19.9177C22.1188 20.3936 22.1193 21.1658 21.6433 21.6423C21.1673 22.1188 20.3952 22.1193 19.9187 21.6433L17.3094 19.037C15.7048 20.2706 13.6935 21.0052 11.5122 21.0052C6.26008 21.0052 2 16.7521 2 11.5026Z" fill="currentColor"/> </svg></div>';
            var favoritebutton = '<div class="full-start__button selector open--favorite"><svg fill="Currentcolor" width="24px" height="24px" viewBox="0 0 0.72 0.72" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24"><path d="M0.66 0.303c0.003 -0.015 -0.009 -0.033 -0.024 -0.033l-0.171 -0.024L0.387 0.09c-0.003 -0.006 -0.006 -0.009 -0.012 -0.012 -0.015 -0.009 -0.033 -0.003 -0.042 0.012L0.258 0.246 0.087 0.27c-0.009 0 -0.015 0.003 -0.018 0.009 -0.012 0.012 -0.012 0.03 0 0.042l0.123 0.12 -0.03 0.171c0 0.006 0 0.012 0.003 0.018 0.009 0.015 0.027 0.021 0.042 0.012l0.153 -0.081 0.153 0.081c0.003 0.003 0.009 0.003 0.015 0.003h0.006c0.015 -0.003 0.027 -0.018 0.024 -0.036l-0.03 -0.171 0.123 -0.12c0.006 -0.003 0.009 -0.009 0.009 -0.015z"/></svg>   <span>Коллекция</span></div>';
            Lampa.Template.add('button_category_jaja', "<style>.freetv_jaja.category-full .card__icons {top: 0.3em;right: 0.3em;justify-content: center !important;}.freetv_jaja.category-full{ padding-bottom:8em;margin-top: -1.5em;} .freetv_jaja div.card__view{ position:relative; background-color:#353535; background-color:#353535a6; border-radius:1em; cursor:pointer; padding-bottom: 56%; } .freetv_jaja.square_icons div.card__view{ padding-bottom:100% } .freetv_jaja.category-full .card__icons { top:0.3em; right:0.3em; justify-content:right; }.freetv_jaja div.card__title {white-space: nowrap;text-overflow: ellipsis;display: block;}.info_jaja div.info__right{padding-top:0;}.info_jaja .info.layer--width{height:auto;font-size:0.7em;} @media screen and (max-width: 385px) { .card--collection { width: 33.3%!important; } .info_jaja div.info__right{display:block!important;} .info_jaja .info.layer--width {overflow: scroll;}  } </style><div class=\"full-start__buttons\">" + viewsort + viewcategory + viewtags + channelbutton + favoritebutton + findbutton  + "</div>");
            Lampa.Template.add('info_web_jaja', '<div class="info layer--width"><div class="info__left"><div class="info__title"></div><div class="info__title-original"></div><div class="info__create"></div><div class="info__rate"><span></span></div></div><div class="info__right">  <div id="web_filtr_jaja"></div></div></div>');
            var btn_panel = Lampa.Template.get('button_category_jaja');
            info = Lampa.Template.get('info_web_jaja');
            info.find('#web_filtr_jaja').append(btn_panel);
            info.find('.view--channel').on('hover:enter hover:click', function () { _this2.selectGroup(); });
            info.find('.view--sort').on('hover:enter hover:click', function () { showSourceCategorySelection(catalogs[0], "Сортировка"); }); 
            info.find('.view--category').on('hover:enter hover:click', function () { showSourceCategorySelection(catalogs2[0], "Категории"); }); 
            info.find('.view--tags').on('hover:enter hover:click', function () { showSourceCategorySelection(catalogs3[0], "Теги"); }); 
            info.find('.open--favorite').on('hover:enter hover:click', function () { Lampa.Activity.push({ url: '', title: (object.setup ? object.setup.title : 'JaJa') + ' - Коллекция', component: 'jaja', quantity: '', setup: object.setup, type: 'fav', page: 1 }); });
            info.find('.open--find').on('hover:enter hover:click', function () { Lampa.Input.edit({ title: (object.setup ? object.setup.title : 'JaJa') + ' - Поиск видео', value: '', free: true, nosave: true }, function (new_value) { if (new_value && object.setup && object.setup.search) { var searchurl = object.setup.search.url.replace('#msearchword', encodeURIComponent(new_value)); Lampa.Activity.push({ url: searchurl, title: object.setup.title + ' - Поиск: "' + new_value + '"', component: 'jaja', quantity: '', setup: object.setup, page: 1, title_suffix: 'Поиск: "' + new_value + '"' }); } else Lampa.Controller.toggle('content'); }); });
            this.selectGroup = function () { var currentSourceConfig = catalogs[0]; Lampa.Select.show({ title: 'Источник', items: [ { title: currentSourceConfig.title, selected: true, category: currentSourceConfig.category, config: currentSourceConfig } ], onSelect: function onSelect(a) { Lampa.Activity.push({ url: a.config.category[0].url, title_suffix: a.config.category[0].title, component: 'jaja', quantity: a.config.category[0].quantity || '', setup: a.config, page: 1 }); }, onBack: function onBack() { Lampa.Controller.toggle('content'); } }); };

            scroll.render().addClass('layer--wheight').data('mheight', info);
            
            if (data_for_build && data_for_build.card && data_for_build.card.length) { 
                html.append(info);
                scroll.minus(); 
                html.append(scroll.render());
                this.append(data_for_build, false); 
                scroll.append(body);
                
                var scroll_component = scroll; 
                var scroll_element = scroll_component.render();
                scroll_element.off('scroll.jaja_autonext wheel.jaja_autonext'); 
                
                var scroll_timeout;
                var scrollHandler = function(event) { 
                    clearTimeout(scroll_timeout);
                    scroll_timeout = setTimeout(function() { 
                        if (waitload) return;

                        var isWheelScrollDown = event && event.type === 'wheel' && event.originalEvent && event.originalEvent.deltaY > 0;
                        var isRegularScroll = event && event.type === 'scroll';
                        
                        if (isWheelScrollDown || isRegularScroll) { 
                            var el = scroll_element[0];
                            if (el.scrollHeight - el.scrollTop - el.clientHeight < 250 ) { 
                               _this2.next(); 
                            }
                        }
                    }, 150); 
                };
                
                scroll_element.on('scroll.jaja_autonext', scrollHandler);
                scroll_element.on('wheel.jaja_autonext', scrollHandler); 


                // this.activity.loader(false); // Лоадер скрывается в create после первой загрузки
                this.activity.toggle();
            } else { 
                html.append(scroll.render()); 
                _this2.empty(); 
            }
        };
        
        this.empty = function () { 
            var empty_html = Lampa.Template.get('empty', {descr: 'Здесь ничего нет'});
            if (scroll && scroll.render().length) {
                scroll.render().find('.empty').remove(); 
                scroll.append(empty_html); 
                scroll.render().find('.empty__img').remove(); 
            } else {
                html.find('.empty').remove();
                html.append(empty_html);
                html.find('.empty__img').remove();
            }
            this.activity.loader(false); 
            if (Lampa.Activity.active() && Lampa.Activity.active().activity === this.activity) {
                this.activity.toggle();
            }
        };

        var FAVORITE_RADIOS_KEY = 'favorite_jaja'; 
        function getFavoriteRadios() { var favorites = localStorage.getItem(FAVORITE_RADIOS_KEY); return favorites ? JSON.parse(favorites) : []; }
        function saveFavoriteRadio(el) { var favoriteRadios = getFavoriteRadios(); if (!favoriteRadios.find(function(r) { return r.url === el.url; })) { favoriteRadios.push(el); localStorage.setItem(FAVORITE_RADIOS_KEY, JSON.stringify(favoriteRadios)); } }
        function removeFavorite(el_to_remove) { var updatedHistory = getFavoriteRadios().filter(function (obj) { return obj.url !== el_to_remove.url; }); localStorage.setItem(FAVORITE_RADIOS_KEY, JSON.stringify(updatedHistory)); }
        function isFavorite(url_to_check) { return getFavoriteRadios().some(function (a) { return a.url === url_to_check; }); }
        function cardImgBackground(card_img_url) { if (Lampa.Storage.field('background')) { return Lampa.Storage.get('background_type', 'complex') === 'poster' && card_img_url ? card_img_url : card_img_url; } return ''; }
        
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
            datatype: "text",    
            use_referer: true,   
            category: [
                { title: 'Недавно обновленное', url: 'https://jable.tv/latest-updates/', quantity: '' },
                { title: 'Новое', url: 'https://jable.tv/new-release/', quantity: '' },
                { title: 'Популярные за неделю', url: 'https://jable.tv/hot/', quantity: '' }
            ],
            list: { 
                page: { selector: ".pagination" }, 
                videoscontainer: { selector: "div.video-img-box" },
                title: { selector: "h6.title a", attrName: "text" },
                thumb: { selector: "img", attrName: "data-src" }, // Для Jable это `data-src` у `<img>`
                link: { selector: "h6.title a", attrName: "href" },
                mnumber: { selector: "h6.title a", attrName: "href", filter: "\/([a-zA-Z0-9-]+)\/?$" }, 
                m_time: { selector: ".meta-data .duration, .video-duration, .label", attrName: "text" } 
            },
            search: {
                url: 'https://jable.tv/search/?q=#msearchword&from_videos=1' 
            }
        }
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
	
    function showSourceCategorySelection(sourceConfig, navigationTitle) {
        if (!sourceConfig) {
            Lampa.Noty.show("Ошибка: Конфигурация источника не найдена.");
            Lampa.Controller.toggle('content');
            return;
        }

        Lampa.Select.show({
            title: navigationTitle + ' - ' + sourceConfig.title,
            items: sourceConfig.category.map(function(cat) { 
                return {
                    title: cat.title,
                    url: cat.url,
                    quantity: cat.quantity || '', 
                    setup: sourceConfig,
                    title_suffix: cat.title 
                };
            }),
            onSelect: function (selected_item) {
                Lampa.Activity.push({
                    url: selected_item.url,
                    title_suffix: selected_item.title_suffix, 
                    component: 'jaja',
                    quantity: selected_item.quantity || '',
                    setup: selected_item.setup, 
                    page: 1 
                });
            },
            onBack: function () { Lampa.Controller.toggle('content'); }
        });
    }

    function startjaja() {
        window.plugin_jaja_ready = true;
        Lampa.Component.add('jaja', jaja);

        function addSettingsjaja() {
            var ico = '<svg width="800px" height="800px" viewBox="20 50 115 115" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M120.69 101.68C114.53 101.68 110.33 97.91 110.16 92.51C110.03 88.1 112.58 84.29 116.64 84.29C121.81 84.29 123.93 89.44 120.86 92.48L116.37 89.26C114.99 90.77 115.48 96.19 120.14 96.19C124.21 96.19 126.14 93.36 126.14 88.92C126.14 84 123.06 80.06 114.73 80.06C107.31 80.06 103.5 86.06 103.5 94.71C103.5 99.24 106.09 102.87 109.02 106.51C114.36 105.51 119.48 112.89 116.27 117.41C116.932 119.172 117.271 121.038 117.27 122.92C117.267 123.857 117.17 124.792 116.98 125.71C121.82 130.96 113.98 140.37 107.98 136.29C105.07 137.594 101.919 138.275 98.73 138.29C95.56 143.71 85.15 140.96 85.73 134.44C83.709 133.184 81.5645 132.138 79.33 131.32C79.43 137.13 71.18 140.81 66.73 137.54C64.8991 140.142 62.5541 142.34 59.84 144C59.84 144.19 59.84 144.38 59.84 144.58C60.02 154.52 43.12 154.76 42.94 145.06C42.94 144.92 42.94 144.8 42.94 144.67C40.0878 143.796 37.3889 142.483 34.94 140.78C27.28 145.35 18.48 133.22 24.79 127.39C23.5874 123.872 22.9823 120.178 23 116.46C14.28 113.63 18.09 98.69 26.8 100.06C28.4235 97.1054 30.6398 94.5181 33.31 92.46C31.77 83.58 46.16 80 49.41 87.69C51.7941 87.7882 54.1517 88.2294 56.41 89L56.61 88.81C63.07 83.23 72.5 94.16 66.36 99.67C67.67 105.19 65.73 110.94 61.99 112.96C56.99 105.56 46.49 107.96 46.49 117.06C46.49 123.42 50.99 125.85 55.84 125.85C61.84 125.85 65.47 114.53 73.73 114.53C85.95 114.53 93.05 126.21 98.44 126.21C102.7 126.21 103.82 124.3 103.82 121.48C103.82 112.99 94.6 108.32 94.6 94.93C94.6 82.63 102.6 72.6 114.6 72.6C125.74 72.6 131.96 79.43 131.96 87.85C131.96 96.27 127.74 101.68 120.69 101.68ZM63.6 96.91C66.08 94.77 61.6 89.57 59.07 91.76C56.54 93.95 60.88 99.26 63.6 96.91ZM43.68 135.45C47.38 133.26 43.11 125.64 39.18 127.97C35.58 130.1 40 137.62 43.68 135.45ZM26.57 104.58C22.9 103.64 20.9 111.32 24.66 112.28C28.42 113.24 30.6 105.62 26.57 104.58ZM28.37 130.32C25.29 132.54 29.91 138.99 33.06 136.72C36.21 134.45 31.74 127.89 28.37 130.32ZM35.49 111.21C31.41 109.63 28.07 118.21 32.26 119.78C36.45 121.35 40 112.94 35.49 111.21ZM45.49 90.09C44.63 86.39 36.89 88.16 37.77 91.95C38.65 95.74 46.43 94.14 45.49 90.09ZM46.49 99.73C45.09 95.79 36.86 98.73 38.28 102.73C39.7 106.73 48 104 46.47 99.73H46.49ZM47.49 144.81C47.56 148.61 55.49 148.49 55.42 144.6C55.35 140.71 47.4 140.66 47.47 144.81H47.49ZM52.84 135.61C53.33 139.76 62.01 138.76 61.5 134.51C60.99 130.26 52.29 131.07 52.82 135.61H52.84ZM68.38 133.11C69.68 136.31 76.38 133.61 75.03 130.33C73.68 127.05 66.93 129.61 68.36 133.11H68.38ZM72.93 122.57C72.41 126.33 80.26 127.46 80.8 123.57C81.34 119.68 73.49 118.45 72.91 122.57H72.93ZM89.48 134.21C88.77 137.21 95.15 138.76 95.88 135.63C96.61 132.5 90.23 130.86 89.46 134.21H89.48ZM109.82 133C112.26 135 116.41 129.9 113.92 127.87C111.43 125.84 107.16 130.86 109.82 133ZM112.6 115.82C115.12 113.94 111.22 108.67 108.6 110.59C105.98 112.51 109.85 117.9 112.6 115.85V115.82Z" fill="currentcolor"/></svg>';
            var menu_item = $('<li class="menu__item selector" data-action="jaja"><div class="menu__ico">' + ico + '</div><div class="menu__text">JaJa 18+</div></li>');
            menu_item.on('hover:enter', function () {
                var jableConfig = catalogs[0]; 
                showSourceCategorySelection(jableConfig, "Сортировка");
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
