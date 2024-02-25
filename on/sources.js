(function () {
    'use strict';
	Lampa.SettingsApi.addParam({
        component: 'more',
        param: {
			name: 'pva_sources',
			type: 'trigger', //доступно select,input,trigger,title,static
			default: false
        },
        field: {
			name: 'Включить в меню "Источник"',
			description: 'Для изменений требуется перезапуск'
        },
        onChange: function (value) {	
        },
		
		onRender: function (item) {
			setTimeout(function() {
				if(Lampa.Storage.field('more')) item.show()&$('.settings-param__name', item).css('color','f3d900')&$('div[data-name="pva_sources"]').insertAfter('div[data-name="source"]');
					else item.hide();
			}, 0);
        }
    });


function startPlugin() {
	window.plugin_sources_ready = true;
	if (Lampa.Storage.get('pva_sources', false) == false) return;
	function add() {

			var ico = '<svg width=\"800\" height=\"800\" viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M29.753.049L16.533 3.63c-.336.09-1.066.089-1.4-.005L2.253.056C1.104-.261-.01.568-.01 1.752v24.316c0 1.003.76 1.962 1.728 2.232l12.88 3.57c.345.096.788.149 1.248.149.315 0 .781-.024 1.21-.142l13.22-3.581c.971-.262 1.734-1.22 1.734-2.227V1.752C32.011.569 30.897-.262 29.752.049zM15 29.904L2.221 26.371c-.096-.026-.232-.203-.232-.303V2.067l12.608 3.486c.122.034.259.061.402.083v24.269zm15.01-3.836c0 .099-.162.27-.258.297l-12.753 3.454V5.572c.018-.005.038-.007.056-.012l12.954-3.504v24.012zm-9.948-14.621a.98.98 0 00.272-.037l6.998-1.97a1 1 0 10-.542-1.926l-6.998 1.97a1 1 0 00.27 1.963zm.001 6c.09 0 .182-.012.272-.037l6.998-1.97a1 1 0 10-.542-1.927l-6.998 1.97a1 1 0 00.27 1.963zm0 6c.09 0 .182-.012.272-.037l6.998-1.97a1 1 0 00-.542-1.926l-6.998 1.97a1 1 0 00.27 1.964zM12.332 9.484l-6.998-1.97a1.001 1.001 0 00-.542 1.926l6.998 1.97a1 1 0 10.54-1.926zm0 6l-6.998-1.97a1 1 0 00-.542 1.927l6.998 1.97a1 1 0 10.54-1.927zm0 6l-6.998-1.97a1.001 1.001 0 00-.542 1.926l6.998 1.97a1 1 0 10.54-1.927z\" fill=\"currentcolor\"/></svg>';
			var menu_item = $('<li class="menu__item selector" data-action="soursehome"><div class="menu__ico">' + ico + '</div><div class="menu__text">' + Lampa.Lang.translate('settings_rest_source') + '</div></li>');
			menu_item.on('hover:enter', function () {        
            var items = [ 
              { title: Lampa.Lang.translate('title_main')+' - TMDB', source: 'tmdb' }, 
              { title: Lampa.Lang.translate('title_main')+' - CUB', source: 'cub' },
            //{ title: Lampa.Lang.translate('title_main')+' - NUM', source: 'kinovod', component: 'category' }, 
            //{ title: Lampa.Lang.translate('title_main')+' - Releases', source: 'hdrezka', component: 'category_full', url: hdrezka.categoryurl  }, 
            //{ title: Lampa.Lang.translate('title_main')+' - HDRezka', source: 'hdrezka' },
            //{ title: Lampa.Lang.translate('title_main')+' - KinoVOD', source: 'kinovod' } 
            ];
            if (Lampa.Api.sources.KP  != undefined) items.push( { title: Lampa.Lang.translate('title_main')+' - КиноПоиск', source: 'KP' }  );
            if (Lampa.Api.sources.pub  != undefined) items.push( { title: Lampa.Lang.translate('title_main')+' - KinoPUB', source: 'pub' }  );
            if (Lampa.Api.sources.filmix  != undefined) items.push( { title: Lampa.Lang.translate('title_main')+' - Filmix', source: 'filmix' }  );
            Lampa.Select.show({
              title: Lampa.Lang.translate('settings_rest_source'),
              items: items,
              onSelect: function onSelect(a) {
                Lampa.Activity.push({
                  title: a.title,
                  url: a.url,
                  component: a.component || 'main',
                  source: a.source,
                  page: 1
                });
              },
              onBack: function onBack() {
                Lampa.Controller.toggle('menu');
              }
            });
        });
		if (Lampa.Storage.get('pva_sources')) $('body').find('.menu .menu__list').eq(0).append(menu_item);
		else $('body').find('[data-action="soursehome"]').remove();	
			
	}
	if (window.appready) add();else {
      Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') add();
      });
    }
}
if (!window.plugin_sources_ready) startPlugin();

})();
