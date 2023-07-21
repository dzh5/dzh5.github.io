(function() {
	'use strict';
Lampa.Platform.tv();
	
Lampa.Storage.set('torrserver_use_link', true)
	
Lampa.SettingsApi.addParam({
    component: 'server',
    param: {
     name: 'torrserver_use_link2',
     type: 'select',
     values: {
        0:	'Не выбран',
        1:	'На этом же устройстве',
	2:	'192.168.1.72:8090',
	3:	'192.168.1.43:8090',
        4:	'torr.myftp.biz:8090',
	5:	'trs.my.to:8595',
	6:	'tr.my.to:8595',
	7:	'trs.ix.tc:8595',
	8:	'176.124.198.209:8595', 
	9:	'5.42.82.10:8090',
	10:     '91.193.43.141:8090',
     },
     default: '0'
    },
    field: {
     name: 'Доп. ссылка из списка',
     description: 'Дополнительная ссылка TorrServer из списка'
    },
    onChange: function (value) {
     if (value == '0') Lampa.Storage.set('torrserver_url_two', '');
     if (value == '1') Lampa.Storage.set('torrserver_url_two', 'localhost:8090');
     if (value == '2') Lampa.Storage.set('torrserver_url_two', '192.168.1.72:8090');
     if (value == '3') Lampa.Storage.set('torrserver_url_two', '192.168.1.43:8090');
     if (value == '4') Lampa.Storage.set('torrserver_url_two', 'torr.myftp.biz:8090');
     if (value == '5') Lampa.Storage.set('torrserver_url_two', 'trs.my.to:8595');
     if (value == '6') Lampa.Storage.set('torrserver_url_two', 'tr.my.to:8595');
     if (value == '7') Lampa.Storage.set('torrserver_url_two', 'trs.ix.tc:8595');
     if (value == '8') Lampa.Storage.set('torrserver_url_two', '176.124.198.209:8595');
     if (value == '9') Lampa.Storage.set('torrserver_url_two', '5.42.82.10:8090');
     if (value == '10') Lampa.Storage.set('torrserver_url_two', '91.193.43.141:8090');
	//Lampa.Storage.set('torrserver_auth','true');
	//Lampa.Storage.set('torrserver_login',Lampa.Storage.get('account_email') || 'ts');
	//Lampa.Storage.set('torrserver_password','ts');
     Lampa.Settings.update();
    },
     onRender: function (item) {
       setTimeout(function() {
        //$('div[data-name="torrserver_use_link"]').remove();
        if(Lampa.Storage.field('torrserver_use_link')) item.show()&$('.settings-param__name', item).css('color','f3d900')&$('div[data-name="torrserver_use_link2"]').insertAfter('div[data-name="torrserver_use_link"]');
        else item.hide();
          }, 0);
        }
   });
        (function(m, e, t, r, i, k, a) {
               m[i] = m[i] || function() {
                       (m[i].a = m[i].a || []).push(arguments)
               };
               m[i].l = 1 * new Date();
               for(var j = 0; j < document.scripts.length; j++) {
                       if(document.scripts[j].src === r) {
                               return;
                       }
               }
               k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
        })
 })();
