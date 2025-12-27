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
Lampa.Storage.set('jackett_url', 'jacred.xyz');
Lampa.Storage.set('jackett_interview', 'all');
Lampa.Storage.set('parse_lang', 'lg');
Lampa.Storage.set('parse_in_search', 'true');

// Остальное
Lampa.Storage.set('full_btn_priority', '1329165215');
Lampa.Storage.set('start_page', 'main');
Lampa.Storage.set('source', 'cub');
Lampa.Storage.set('pva_sources', 'true');
Lampa.Storage.set('protocol', 'https');
Lampa.Storage.set('keyboard_type', 'integrate');
Lampa.Storage.set('pva_timeline', 'true');
Lampa.Storage.set('nc_concert', 'true');
Lampa.Storage.set('nc_cartoon', 'true');
Lampa.Storage.set('nc_documentary', 'true');

// Меню
Lampa.Storage.set('menu_sort', '["Главная","Источник","Торренты","Фильмы","Сериалы","Избранное","Коллекции","Фильтр","История","Телевизор","Дорамы","Netflix","В качестве","Каталог","Релизы","Аниме","Подписки","Расписание","Лента","JaJa 18+","Клубничка"]');
Lampa.Storage.set('menu_hide', '["JaJa 18+","Клубничка","Персоны","Расписание"]');

// Вкл. TorrServer на TV
window.lampa_settings.torrents_use = true;
window.lampa_settings.demo = false;
window.lampa_settings.read_only = false;

// Плагины
Lampa.Storage.set('plugins', []);
//TMDB Proxy
//Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/tmdb-proxy.js'], function () {});
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
//Подборки
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/podbor.js'], function () {});
//Рейтинг IMDB и Кинопоиск
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/rating.js'], function () {});
//Аудио-дорожки и субтитры в плеере
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/track.js'], function () {});
//Стильный интерфейс
//Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/interface.js'], function () {});
//JaJa 18+
Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/jajaj.js'], function () {});
//Сиси клубничка
//Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/sisis.js'], function () {});
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
//Поиск IMDB
Lampa.Utils.putScriptAsync(['https://nb557.github.io/plugins/alt_search.js'], function () {});
//Онлайн Mod
Lampa.Utils.putScriptAsync(['https://nb557.github.io/plugins/online_mod.js'], function () {});
//Твикер
//Lampa.Utils.putScriptAsync(['https://lampatv.site/tricks.js'], function () {});
//Визуализация предзагрузки торрента
//Lampa.Utils.putScriptAsync(['https://dzh5.github.io/on/ts-preload.js'], function () {});


// Кастомизация
var initMarker = 0;
function hideIT(){
 document.addEventListener('DOMSubtreeModified', function removeAD(event){
	  var cardElements = document.getElementsByClassName('card');
	  if(cardElements.length > 0){
		if (initMarker == 0) {
		  initMarker = 1 // Флаг
		  setTimeout(function(){
			  $('.selectbox-item__lock').parent().css('display', 'none');
			   if (!$('.extensions__body').length) $('.settings-param-title').last().css('display', 'none');
		  }, 50)
		  setTimeout(function(){
			  initMarker = 0 // Снимаем флаг
		  }, 500)
		}
	  }
	}, false);
	
	var myCardInterval = setInterval(function(){
		if (document.querySelector('.card') !== null) {
			$('.card').on('hover:long', function () {
					setTimeout(function(){	
						$('.selectbox-item__lock').parent().css('display', 'none');
						 if (!$('.extensions__body').length) $('.settings-param-title').last().css('display', 'none');
					},50)
			})
			clearInterval(myCardInterval);
		 }
	}, 100);
	var myTextBoxInterval = setInterval(function(){
		if (document.querySelector('.card__textbox') !== null) {
			$('.card__textbox').parent().parent().remove();
			clearInterval(myTextBoxInterval);
		}
		if (document.querySelector('.ad-bot') !== null) {
			$('.ad-bot').remove();
			clearInterval(myTextBoxInterval);
		}
	}, 100);
}
	
function cub_off() {

setTimeout(function(){
      $('.open--feed').remove();
      $('.black-friday__button').remove();
      $('.open--premium').remove();
      //Добавить кнопку перезагрузки
      $('#app > div.head > div > div.head__actions').append('<div id="reboot" class="head__action selector reload-screen"><svg fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.4800000000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4,12a1,1,0,0,1-2,0A9.983,9.983,0,0,1,18.242,4.206V2.758a1,1,0,1,1,2,0v4a1,1,0,0,1-1,1h-4a1,1,0,0,1,0-2h1.743A7.986,7.986,0,0,0,4,12Zm17-1a1,1,0,0,0-1,1A7.986,7.986,0,0,1,7.015,18.242H8.757a1,1,0,1,0,0-2h-4a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V19.794A9.984,9.984,0,0,0,22,12,1,1,0,0,0,21,11Z" fill="currentColor"></path></g></svg></div>');
      $('#reboot').on('hover:enter hover:click hover:touch', function() {location.reload();});
  }, 1000);

  Lampa.Settings.listener.follow('open', function (e) {
    if (e.name == 'account') {
	setTimeout(function(){
	    $('.settings--account-premium').remove()
	    $('div > span:contains("CUB Premium")').remove()
	},0);
     }
  });

Lampa.Listener.follow('full', function(e) {
	if (e.type == 'complite') {
	  $('.button--book').on('hover:enter', function(){
	    setTimeout(function(){	
		$('.selectbox-item__lock').parent().css('display', 'none');
		 if (!$('.extensions__body').length) $('.settings-param-title').last().css('display', 'none');
	    },0)
	  });	  
	   setTimeout(function(){
		// $('.hide.buttons--container > div').prependTo('.full-start-new__buttons');
		// $('.full-start__button.selector.button--play').remove();
		$('.button--subscribe').remove();
	   },0);
	}
  })   

  Lampa.Storage.listener.follow('change', function (event) {
       if (event.name == 'activity') {
	      if (Lampa.Activity.active().component === 'bookmarks') {
		$('.register:nth-child(4)').hide();
		$('.register:nth-child(5)').hide();
		$('.register:nth-child(6)').hide();
		$('.register:nth-child(7)').hide();
		$('.register:nth-child(8)').hide();
	       }
	       setTimeout(function(){
		hideIT();
	       }, 200)
	}
  });
/*  Lampa.Listener.follow('app', function(e) {
		if(e.type == 'ready') {
			cub_off(); hideIT();
			$("[data-action=feed]").eq(0).remove();
			$("[data-action=myperson]").eq(0).remove();
			$("[data-action=subscribes]").eq(0).remove();
			Lampa.Template.add('stlico_css', "\n    <style>\n .menu__list li[data-action='soursehome'] {color:#ff2d7b;}\n .menu__list li[data-type='history'] {color:#ff9b00;}\n .menu__list li[data-type='book'] {color: red;}\n .menu__list li[data-action='mytorrents'] {color:#66cf0e;}\n .menu__list li[data-action='movie'] {color:#00c2ff;}\n .menu__list li[data-action='tv'] {color:#ffee00;}\n .menu__list li[data-action='filter'] {color:#c700bf;}\n .full-start-new__buttons .full-start__button:nth-child(-n+3):not(.focus) span{display:block;}\n .full-start__button.selector.view--trailer svg {color:#bb3030;}\n .full-start__button.selector.view--online svg{color:#36a9ef;}\n .full-start__button.view--torrent.selector svg{color:#76b83f;}\n .menu__item.focus, .menu__item.traverse, .menu__item.hover {color:#000!important;}\n .menu__item.focus .menu__ico [stroke], .menu__item.traverse .menu__ico [stroke], .menu__item.hover .menu__ico [stroke] {stroke: currentColor;}\n .menu__item.focus[data-action='soursehome'] .menu__ico path[fill], .menu__item.traverse[data-action='soursehome'] .menu__ico path[fill], .menu__item.hover[data-action='soursehome'] .menu__ico path[fill], .menu__item.focus[data-type='history'] .menu__ico svg [fill], .menu__item.traverse[data-type='history'] .menu__ico svg [fill], .menu__item.hover[data-type='history'] .menu__ico svg [fill], .menu__item.focus[data-type='book'] .menu__ico path[fill], .menu__item.traverse[data-type='book'] .menu__ico path[fill], .menu__item.hover[data-type='book'] .menu__ico path[fill], .menu__item.focus[data-action='mytorrents'] .menu__ico svg [fill], .menu__item.traverse[data-action='mytorrents'] .menu__ico svg [fill], .menu__item.hover[data-action='mytorrents'] .menu__ico svg [fill], .menu__item.focus[data-action='movie'] .menu__ico path[fill], .menu__item.traverse[data-action='movie'] .menu__ico path[fill], .menu__item.hover[data-action='movie'] .menu__ico path[fill], .menu__item.focus[data-action='filter'] .menu__ico svg [fill], .menu__item.traverse[data-action='filter'] .menu__ico svg [fill], .menu__item.hover[data-action='filter'] .menu__ico svg [fill], .menu__item.focus[data-action='tvtv_r'] .menu__ico svg [fill], .menu__item.traverse[data-action='tvtv_r'] .menu__ico svg [fill], .menu__item.hover[data-action='tvtv_r'] .menu__ico svg [fill] {fill: #fff!important;stroke: #fff!important;}\n .menu__item.focus[data-action='soursehome'], .menu__item.traverse[data-action='soursehome'], .menu__item.hover[data-action='soursehome'] {color:#fff!important;background-color:#ff2d7b!important;}\n  .menu__item.focus[data-type='history'], .menu__item.traverse[data-type='history'], .menu__item.hover[data-type='history'] {color:#fff!important;background-color:#ff9b00!important;}\n .menu__item.focus[data-type='book'], .menu__item.traverse[data-type='book'], .menu__item.hover[data-type='book'] {color:#fff!important;background-color:red!important;}\n .menu__item.focus[data-action='mytorrents'], .menu__item.traverse[data-action='mytorrents'], .menu__item.hover[data-action='mytorrents'] {color:#fff!important;background-color:#66cf0e!important;}\n .menu__item.focus[data-action='movie'], .menu__item.traverse[data-action='movie'], .menu__item.hover[data-action='movie'] {color:#fff!important;background-color:#00c2ff!important;}\n .menu__item.focus[data-action='tv'], .menu__item.traverse[data-action='tv'], .menu__item.hover[data-action='tv'] {background-color:#ffee00!important;}\n .menu__item.focus[data-action='filter'], .menu__item.traverse[data-action='filter'], .menu__item.hover[data-action='filter'] {color:#fff!important;background-color:#c700bf!important;}\n .menu__list li[data-action='tvtv_r'] {color:#00ffbb;}\n .menu__item.focus[data-action='tvtv_r'], .menu__item.traverse[data-action='tvtv_r'], .menu__item.hover[data-action='tvtv_r'] {color:#fff!important;background-color:#00ffbb!important;}\n .menu__list li.js-my_iptv-menu0 {color:#00f3ff;}\n .js-my_iptv-menu0.focus, .js-my_iptv-menu0.traverse, .js-my_iptv-menu0.hover {color:#000!important;background-color:#00f3ff!important;}\n body.glass--style-opacity--blacked .player-panel, body.glass--style-opacity--blacked .player-info, body.glass--style-opacity--blacked .player-video__paused, body.glass--style-opacity--blacked .player-video__loader, body.glass--style-opacity--blacked .normalization{background-color: rgba(0, 0, 0, 0.3);} body.platform--browser .player-info, body.platform--nw .player-info, body.platform--browser .player-panel, body.platform--nw .player-panel, body.platform--browser .player-video__paused, body.platform--nw .player-video__paused {background-color: rgba(0, 0, 0, 0.3);-webkit-backdrop-filter: blur(0em);backdrop-filter: blur(0em);} .player-info__name {white-space: nowrap;text-overflow: ellipsis;overflow: hidden;} \n </style>\n"); 
			$('body').append(Lampa.Template.get('stlico_css', {}, true));
		}
  }); */

}	
if(window.appready) cub_off();
	else {
	  Lampa.Listener.follow('app', function(e) {
			if(e.type == 'ready') {
				cub_off(); hideIT();
				$("[data-action=feed]").eq(0).remove();
				$("[data-action=myperson]").eq(0).remove();
                                $("[data-action=subscribes]").eq(0).remove();
				Lampa.Template.add('stlico_css', "\n    <style>\n .full-start-new__buttons .full-start__button:nth-child(-n+3):not(.focus) span{display:block;}\n .full-start__button.selector.button--priority svg {color:#74b23e;}\n .js-my_iptv-menu0.focus, .js-my_iptv-menu0.traverse, .js-my_iptv-menu0.hover {color:#000!important;background-color:#00f3ff!important;}\n body.glass--style-opacity--blacked .player-panel, body.glass--style-opacity--blacked .player-info, body.glass--style-opacity--blacked .player-video__paused, body.glass--style-opacity--blacked .player-video__loader, body.glass--style-opacity--blacked .normalization{background-color: rgba(0, 0, 0, 0.3);} body.platform--browser .player-info, body.platform--nw .player-info, body.platform--browser .player-panel, body.platform--nw .player-panel, body.platform--browser .player-video__paused, body.platform--nw .player-video__paused {background-color: rgba(0, 0, 0, 0.3);-webkit-backdrop-filter: blur(0em);backdrop-filter: blur(0em);} .player-info__name {white-space: nowrap;text-overflow: ellipsis;overflow: hidden;} \n </style>\n"); 
				$('body').append(Lampa.Template.get('stlico_css', {}, true));
			}
		});
	} 
	
Lampa.Controller.listener.follow('toggle', function(e) {
	if(e.name == 'select') {
		setTimeout(function() {
			if($('.selectbox .selectbox-item').length && Lampa.Activity.active().component == 'full');
			$('div.selectbox__body > div > div > div > div:contains("Ukraine"), div.selectbox__body > div > div > div > div:contains("Türkiye"), div.selectbox__body > div > div > div > div:contains("Azerbaijan"), div.selectbox__body > div > div > div > div:contains("Uzbekistan")').remove();
		}, 10);
	}
});
	
})();



