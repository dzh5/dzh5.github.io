(function () {
'use strict';
Lampa.Platform.tv();

// Аккаунт
Lampa.Storage.set('account_use', 'true');

// Интерфейс
Lampa.Storage.set('glass_style', 'true');
Lampa.Storage.set('glass_opacity', 'blacked');

// Плеер
Lampa.Storage.set('player_timecode', 'ask');
Lampa.Storage.set('video_quality_default', '2160');
Lampa.Storage.set('torrserver_preload', 'true');

// TMDB
Lampa.Storage.set('poster_size', 'w300');

// Парсер
Lampa.Storage.set('parser_use', 'true');
Lampa.Storage.set('jackett_url', 'jac.lampa32.ru');
Lampa.Storage.set('jackett_interview', 'all');
Lampa.Storage.set('parse_lang', 'lg');
Lampa.Storage.set('parse_in_search', 'true');

// Остальное
Lampa.Storage.set('start_page', 'main');
Lampa.Storage.set('source', 'cub');
Lampa.Storage.set('pva_sources', 'true');
Lampa.Storage.set('keyboard_type', 'integrate');
Lampa.Storage.set('pva_timeline', 'true');
Lampa.Storage.set('nc_concert', 'true');
Lampa.Storage.set('nc_cartoon', 'true');
Lampa.Storage.set('nc_documentary', 'true');

// Меню
Lampa.Storage.set('menu_sort', '["Главная","Источник","Торренты","Фильмы","Сериалы","Избранное","Коллекции","Фильтр","История","Телевизор","LampaTV","Каталог","Релизы","Мультфильмы","Аниме","Подписки","Расписание","Лента","JaJa 18+","Клубничка"]');
Lampa.Storage.set('menu_hide', '["JaJa 18+","Клубничка"]');

// Вкл. TorrServer на TV
window.lampa_settings.torrents_use = true;
window.lampa_settings.demo = false;
window.lampa_settings.read_only = false;

// Плагины
Lampa.Storage.set('plugins', []);
//TMDB Proxy
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/tmdb-proxy.js'], function () {});
//Источник в меню
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/sources.js'], function () {});
//Коллекции
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/collections.js'], function () {});
//TorServer из списка
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/torrserver.js'], function () {});
//Синхронизация тайм-кодов 
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/timecode.js'], function () {});
//Горячие кнопки в плеере
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/hotkeys.js'], function () {});
//КиноПоиск, Filmix источник
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/kp.js'], function () {});
//Рейтинг IMDB и Кинопоиск
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/rating.js'], function () {});
//Аудио-дорожки и субтитры в плеере
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/track.js'], function () {});
//Стильный интерфейс
//Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/interface.js'], function () {});
//JaJa 18+
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/jajaj.js'], function () {});
//Сиси клубничка
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/sisis.js'], function () {});
//Онлайн Lampa
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/online.js'], function () {});
//Мультфильмы
//Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/mult.js'], function () {});
//Телевизор
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/iptv.js'], function () {});
//Документалки, Мультики, Концерты
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/new-cat.js'], function () {});
//Клуюничка BWA
//Lampa.Utils.putScriptAsync(['https://bwa.to/s'], function () {});
//Клуюничка SISI
//Lampa.Utils.putScriptAsync(['http://sisi.am/nyam.serv.js?v21'], function () {});
//Онлайн BWA
//Lampa.Utils.putScriptAsync(['https://bwa.to/f'], function () {});
//Выбор парсера
//Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/jackett.js'], function () {});
//Онлайн Mod
//Lampa.Utils.putScriptAsync(['https://nb557.github.io/plugins/online_mod.js'], function () {});
//Твикер
//Lampa.Utils.putScriptAsync(['https://lampatv.site/tricks.js'], function () {});
//Визуализация предзагрузки торрента
//Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/ts-preload.js'], function () {});


// Кастомизация
Lampa.Listener.follow('full', function (e) {
	if (e.type == 'complite')
		$('.hide.buttons--container > div').prependTo('.full-start-new__buttons');
		$('.full-start__button.selector.button--play').remove();	
});

Lampa.Controller.listener.follow('toggle', function(e) {
	if(e.name == 'select') {
		setTimeout(function() {
			if($('.selectbox .selectbox-item').length && Lampa.Activity.active().component == 'full');
			$('div.selectbox__body > div > div > div > div:contains("Ukraine"), div.selectbox__body > div > div > div > div:contains("Türkiye"), div.selectbox__body > div > div > div > div:contains("Azerbaijan"), div.selectbox__body > div > div > div > div:contains("Uzbekistan")').remove();
		}, 10);
	}
});

Lampa.Listener.follow('app', function(e) {
	if(e.type == 'ready') {
		//Удалить кнопку Премиум в шапке
		$('#app > div.head > div > div.head__actions > .open--premium').remove();
		//Удалить кнопку Лента в шапке
		$('#app > div.head > div > div.head__actions > .open--feed').remove();
		//Добавить кнопку перезагрузки
		$('#app > div.head > div > div.head__actions').append('<div id="reboot" class="head__action selector reload-screen"><svg fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.4800000000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4,12a1,1,0,0,1-2,0A9.983,9.983,0,0,1,18.242,4.206V2.758a1,1,0,1,1,2,0v4a1,1,0,0,1-1,1h-4a1,1,0,0,1,0-2h1.743A7.986,7.986,0,0,0,4,12Zm17-1a1,1,0,0,0-1,1A7.986,7.986,0,0,1,7.015,18.242H8.757a1,1,0,1,0,0-2h-4a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V19.794A9.984,9.984,0,0,0,22,12,1,1,0,0,0,21,11Z" fill="currentColor"></path></g></svg></div>');
		$('#reboot').on('hover:enter hover:click hover:touch', function() {location.reload();});
		
		//Свои цвета/стили
		Lampa.Template.add('stlico_css', "\n    <style>\n .menu__list li[data-action='soursehome'] {color:#ff2d7b;}\n .menu__list li[data-type='history'] {color:#ff9b00;}\n .menu__list li[data-type='book'] {color: red;}\n .menu__list li[data-action='mytorrents'] {color:#66cf0e;}\n .menu__list li[data-action='movie'] {color:#00c2ff;}\n .menu__list li[data-action='tv'] {color:#ffee00;}\n .menu__list li[data-action='filter'] {color:#c700bf;}\n .full-start-new__buttons .full-start__button:nth-child(-n+3):not(.focus) span{display:block;}\n .full-start__button.selector.view--trailer svg {color:#bb3030;}\n .full-start__button.selector.view--online svg{color:#36a9ef;}\n .full-start__button.view--torrent.selector svg{color:#76b83f;}\n .menu__item.focus, .menu__item.traverse, .menu__item.hover {color:#000!important;}\n .menu__item.focus .menu__ico [stroke], .menu__item.traverse .menu__ico [stroke], .menu__item.hover .menu__ico [stroke] {stroke: currentColor;}\n .menu__item.focus[data-action='soursehome'] .menu__ico path[fill], .menu__item.traverse[data-action='soursehome'] .menu__ico path[fill], .menu__item.hover[data-action='soursehome'] .menu__ico path[fill], .menu__item.focus[data-type='history'] .menu__ico svg [fill], .menu__item.traverse[data-type='history'] .menu__ico svg [fill], .menu__item.hover[data-type='history'] .menu__ico svg [fill], .menu__item.focus[data-type='book'] .menu__ico path[fill], .menu__item.traverse[data-type='book'] .menu__ico path[fill], .menu__item.hover[data-type='book'] .menu__ico path[fill], .menu__item.focus[data-action='mytorrents'] .menu__ico svg [fill], .menu__item.traverse[data-action='mytorrents'] .menu__ico svg [fill], .menu__item.hover[data-action='mytorrents'] .menu__ico svg [fill], .menu__item.focus[data-action='movie'] .menu__ico path[fill], .menu__item.traverse[data-action='movie'] .menu__ico path[fill], .menu__item.hover[data-action='movie'] .menu__ico path[fill], .menu__item.focus[data-action='filter'] .menu__ico svg [fill], .menu__item.traverse[data-action='filter'] .menu__ico svg [fill], .menu__item.hover[data-action='filter'] .menu__ico svg [fill], .menu__item.focus[data-action='tvtv_r'] .menu__ico svg [fill], .menu__item.traverse[data-action='tvtv_r'] .menu__ico svg [fill], .menu__item.hover[data-action='tvtv_r'] .menu__ico svg [fill] {fill: #fff!important;stroke: #fff!important;}\n .menu__item.focus[data-action='soursehome'], .menu__item.traverse[data-action='soursehome'], .menu__item.hover[data-action='soursehome'] {color:#fff!important;background-color:#ff2d7b!important;}\n  .menu__item.focus[data-type='history'], .menu__item.traverse[data-type='history'], .menu__item.hover[data-type='history'] {color:#fff!important;background-color:#ff9b00!important;}\n .menu__item.focus[data-type='book'], .menu__item.traverse[data-type='book'], .menu__item.hover[data-type='book'] {color:#fff!important;background-color:red!important;}\n .menu__item.focus[data-action='mytorrents'], .menu__item.traverse[data-action='mytorrents'], .menu__item.hover[data-action='mytorrents'] {color:#fff!important;background-color:#66cf0e!important;}\n .menu__item.focus[data-action='movie'], .menu__item.traverse[data-action='movie'], .menu__item.hover[data-action='movie'] {color:#fff!important;background-color:#00c2ff!important;}\n .menu__item.focus[data-action='tv'], .menu__item.traverse[data-action='tv'], .menu__item.hover[data-action='tv'] {background-color:#ffee00!important;}\n .menu__item.focus[data-action='filter'], .menu__item.traverse[data-action='filter'], .menu__item.hover[data-action='filter'] {color:#fff!important;background-color:#c700bf!important;}\n .menu__list li[data-action='tvtv_r'] {color:#00ffbb;}\n .menu__item.focus[data-action='tvtv_r'], .menu__item.traverse[data-action='tvtv_r'], .menu__item.hover[data-action='tvtv_r'] {color:#fff!important;background-color:#00ffbb!important;}\n .menu__list li.js-my_iptv-menu0 {color:#00f3ff;}\n .js-my_iptv-menu0.focus, .js-my_iptv-menu0.traverse, .js-my_iptv-menu0.hover {color:#000!important;background-color:#00f3ff!important;}\n body.glass--style-opacity--blacked .player-panel, body.glass--style-opacity--blacked .player-info, body.glass--style-opacity--blacked .player-video__paused, body.glass--style-opacity--blacked .player-video__loader, body.glass--style-opacity--blacked .normalization{background-color: rgba(0, 0, 0, 0.3);} body.platform--browser .player-info, body.platform--nw .player-info, body.platform--browser .player-panel, body.platform--nw .player-panel, body.platform--browser .player-video__paused, body.platform--nw .player-video__paused {background-color: rgba(0, 0, 0, 0.3);-webkit-backdrop-filter: blur(0em);backdrop-filter: blur(0em);} .player-info__name {white-space: nowrap;text-overflow: ellipsis;overflow: hidden;} \n </style>\n"); 
			$('body').append(Lampa.Template.get('stlico_css', {}, true));
	}
});

/* //Телевидение
Lampa.Keypad.listener.follow('keydown', function (e) {
  		var next = e.code === 427 || e.code === 33;
  		var prev = e.code === 428 || e.code === 34;
  		var stp = e.code === 32;
  		// Lampa.Noty.show('code_ '+ code);
  		if (Lampa.Player.opened()) {
  			if (prev) {
  				Lampa.PlayerPlaylist.prev();
  			}
  			if (next) {
  				Lampa.PlayerPlaylist.next();
  			}
  			if (stp) {
  				Lampa.Player.play;
  			}
  		}
  	});

	function kanals_n(object) {
		var network = new Lampa.Reguest();
		var scroll = new Lampa.Scroll({
			mask: true,
			over: true,
			step: 250
		});
		var items = [];
		var html = $('<div></div>');
		var body = $('<div class="kanals_n category-full"></div>');
		var info;
		var last;
		var catalogs = [{
        title: 'Спортивные',
        url: 'https://dzh5.github.io/tv/sport.json'
      },
          {
        title: 'Фильмы и сериалы',
        url: 'https://dzh5.github.io/tv/films.json'
      },
          {
        title: 'Детские',
        url: 'https://dzh5.github.io/tv/kids.json'
      },
          {
        title: 'Познавательные',
        url: 'https://dzh5.github.io/tv/cognitive.json'
      },
          {
        title: 'Музыкальные',
        url: 'https://dzh5.github.io/tv/music.json'
      },
          {
        title: 'Федеральные',
        url: 'https://dzh5.github.io/tv/federals.json'
      }];
		this.create = function() {
			var _this = this;
			this.activity.loader(true);
			network.silent(object.url, this.build.bind(this), function() {
				var empty = new Lampa.Empty();
				html.append(empty.render());
				_this.start = empty.start;
				_this.activity.loader(false);
				_this.activity.toggle();
			});
			return this.render();
		};
		this.append = function (data) {
			var _this3 = this;
			data.forEach(function (element) {
				var card = Lampa.Template.get('card', {
					title: element.name,
					release_year: element.time ? element.time + (element.epg ? ' / ' + element.epg : '') : ''
				});
				card.addClass('card--collection');
				card.find('.card__img').css({
					'cursor': 'pointer',
					'background-color': '#353535a6'
				});
				var img = card.find('.card__img')[0];
				img.onload = function () {
					card.addClass('card--loaded');
				};
				img.onerror = function (e) {
					img.src = './img/img_broken.svg';
				};
				img.src = element.picture;
				card.on('hover:focus', function () {
					last = card[0];
					scroll.update(card, true);
					info.find('.info__title').text(element.name);
					info.find('.info__title-original').text(element.group);
				});
				card.on('hover:enter', function () {
					var video = {
						title: element.name,
						url: element.video
					};
					Lampa.Player.play(video);
					var playlist = [];
					var i = 1;
					data.forEach(function (elem) {
						playlist.push({
							title: i + ' - ' + elem.name,
							url: elem.video
						});
						i++;
					});
					Lampa.Player.playlist(playlist);
				});
				body.append(card);
				items.push(card);
			});
		};
		this.build = function(data) {
			var _this2 = this;
			Lampa.Background.change('');
			Lampa.Template.add('button_category', "<style>@media screen and (max-width: 2560px) {.kanals_n .card--collection {width: 14.2%!important;}.scroll__content {padding:1.5em 0!important;}.info {height:9em!important;}.info__title-original {font-size:1.2em;}}@media screen and (max-width: 385px) {.info__right {display:contents!important;}.kanals_n .card--collection {width: 33.3%!important;}}@media screen and (max-width: 580px) {.info__right {display:contents!important;}.kanals_n .card--collection {width: 25%!important;}}</style><div class=\"full-start__button selector view--category\"><svg style=\"enable-background:new 0 0 512 512;\" version=\"1.1\" viewBox=\"0 0 24 24\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><g id=\"info\"/><g id=\"icons\"><g id=\"menu\"><path d=\"M20,10H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2C22,10.9,21.1,10,20,10z\" fill=\"currentColor\"/><path d=\"M4,8h12c1.1,0,2-0.9,2-2c0-1.1-0.9-2-2-2H4C2.9,4,2,4.9,2,6C2,7.1,2.9,8,4,8z\" fill=\"currentColor\"/><path d=\"M16,16H4c-1.1,0-2,0.9-2,2c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2C18,16.9,17.1,16,16,16z\" fill=\"currentColor\"/></g></g></svg>   <span>Категории</span>\n    </div>");
			Lampa.Template.add('info_tvtv', '<div class="info layer--width"><div class="info__left"><div class="info__title"></div><div class="info__title-original"></div><div class="info__create"></div></div><div class="info__right">  <div id="stantion_filtr"></div></div></div>');
			var btn = Lampa.Template.get('button_category');
			info = Lampa.Template.get('info_tvtv');
		  info.find('#stantion_filtr').append(btn);
			info.find('.view--category').on('hover:enter hover:click', function () {
				_this2.selectGroup();
			});
			scroll.render().addClass('layer--wheight').data('mheight', info);
			html.append(info.append());
			html.append(scroll.render());
			this.append(data);
			scroll.append(body);
                        var spacer = '<div id="spacer" style="height: 450px;"></div>';
                        $('.kanals_n').append(spacer);
			this.activity.loader(false);
			this.activity.toggle();
		};
		this.selectGroup = function () {
		  Lampa.Select.show({
				title: 'Категории',
				items: catalogs,
				onSelect: function onSelect(a) {
					Lampa.Activity.push({
					//	url: cors + a.url,
						url: a.url,
						title: a.title,
						component: 'kanals_n',
						page: 1
					});
				},
				onBack: function onBack() {
					Lampa.Controller.toggle('content');
				}
			});
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
					if (Navigator.canmove('right')) Navigator.move('right');
					else _this.selectGroup();
				},
				up: function up() {
					if (Navigator.canmove('up')) {
						Navigator.move('up');
					} else {
					 	if (!info.find('.view--category').hasClass('focus')) {
							if (!info.find('.view--category').hasClass('focus')) {
								Lampa.Controller.collectionSet(info);
					  		Navigator.move('right')
							}
						} else Lampa.Controller.toggle('head');
					}
				},
				down: function down() {
					if (Navigator.canmove('down')) Navigator.move('down');
					else if (info.find('.view--category').hasClass('focus')) {
						 Lampa.Controller.toggle('content');
					}
				},
				back: function back() {
					Lampa.Activity.backward();
				}
			});
			Lampa.Controller.toggle('content');
		};
		this.pause = function() {};
		this.stop = function() {};
		this.render = function() {
			return html;
		};
		this.destroy = function() {
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

	function startkanals_n() {
		window.plugin_kanals_N_ready = true;
		Lampa.Component.add('kanals_n', kanals_n);
		Lampa.Listener.follow('app', function(r) {
			if (r.type == 'ready') {
				var ico = '<svg height=\"244\" viewBox=\"0 0 260 244\" xmlns=\"http://www.w3.org/2000/svg\" style=\"fill-rule:evenodd;\" fill=\"currentColor\"><path d=\"M259.5 47.5v114c-1.709 14.556-9.375 24.723-23 30.5a2934.377 2934.377 0 0 1-107 1.5c-35.704.15-71.37-.35-107-1.5-13.625-5.777-21.291-15.944-23-30.5v-115c1.943-15.785 10.61-25.951 26-30.5a10815.71 10815.71 0 0 1 208 0c15.857 4.68 24.523 15.18 26 31.5zm-230-13a4963.403 4963.403 0 0 0 199 0c5.628 1.128 9.128 4.462 10.5 10 .667 40 .667 80 0 120-1.285 5.618-4.785 8.785-10.5 9.5-66 .667-132 .667-198 0-5.715-.715-9.215-3.882-10.5-9.5-.667-40-.667-80 0-120 1.35-5.18 4.517-8.514 9.5-10z\"/><path d=\"M70.5 71.5c17.07-.457 34.07.043 51 1.5 5.44 5.442 5.107 10.442-1 15-5.991.5-11.991.666-18 .5.167 14.337 0 28.671-.5 43-3.013 5.035-7.18 6.202-12.5 3.5a11.529 11.529 0 0 1-3.5-4.5 882.407 882.407 0 0 1-.5-42c-5.676.166-11.343 0-17-.5-4.569-2.541-6.069-6.375-4.5-11.5 1.805-2.326 3.972-3.992 6.5-5zM137.5 73.5c4.409-.882 7.909.452 10.5 4a321.009 321.009 0 0 0 16 30 322.123 322.123 0 0 0 16-30c2.602-3.712 6.102-4.879 10.5-3.5 5.148 3.334 6.314 7.834 3.5 13.5a1306.032 1306.032 0 0 0-22 43c-5.381 6.652-10.715 6.652-16 0a1424.647 1424.647 0 0 0-23-45c-1.691-5.369-.191-9.369 4.5-12zM57.5 207.5h144c7.788 2.242 10.288 7.242 7.5 15a11.532 11.532 0 0 1-4.5 3.5c-50 .667-100 .667-150 0-6.163-3.463-7.496-8.297-4-14.5 2.025-2.064 4.358-3.398 7-4z\"/></svg>';
                                var menu_items = $('<li class="menu__item selector" data-action="tvtv_r"><div class="menu__ico">' + ico + '</div><div class="menu__text">LampaTV</div></li>');
				menu_items.on('hover:enter', function() {
					Lampa.Activity.push({
						url: 'http://l92732ix.beget.tech/tv/federals.json',
						title: 'Федеральные',
						component: 'kanals_n',
						page: 1
					});
				});
				$('.menu .menu__list').eq(0).append(menu_items);
			}
		});
	}
	if (!window.plugin_kanals_n_ready) startkanals_n(); */

})();


