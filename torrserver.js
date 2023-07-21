(function() {
'use strict';
Lampa.Platform.tv();
Lampa.SettingsApi.addParam({
    component: 'server',
    param: {
     name: 'torrserver_use_link2',
     type: 'select',
     values: {
        0:	'Не выбран',
        1:	'localhost:8090',
	2:	'192.168.1.72:8090',
	3:	'192.168.1.43:8090',
	4:	'Torrserver 5',
	5:	'Torrserver 5',
	6:	'Torrserver 6',
	7:	'Torrserver 7',
	8:	'Torrserver 8',
	9:	'Torrserver 9',
	10:	'Torrserver 10',
	11:	'Torrserver 11',
	12:	'Torrserver 12',
	13:	'Torrserver 13',
	14:	'Torrserver 14',
	15:	'Torrserver 15',
	16:	'Torrserver 16',
	17:	'Torrserver 17',
	18:	'Torrserver 18',
	19:	'Torrserver 19',
	20:	'Torrserver 20',
	21:	'Torrserver 21',
     },
     default: '0'
    },
    field: {
     name: 'Осн. ссылка из списка',
     description: 'Основная ссылка TorrServer из списка'
    },
    onChange: function (value) {
     if (value == '0') Lampa.Storage.set('torrserver_url', '');
     if (value == '1') Lampa.Storage.set('torrserver_url', 'localhost:8090');
     if (value == '2') Lampa.Storage.set('torrserver_url', '192.168.1.72:8090');
     if (value == '3') Lampa.Storage.set('torrserver_url', '192.168.1.43:8090');
     if (value == '4') Lampa.Storage.set('torrserver_url', 'torr.myftp.biz:8090');
     if (value == '5') Lampa.Storage.set('torrserver_url', 'trs.my.to:8595');
     if (value == '6') Lampa.Storage.set('torrserver_url', 'tr.my.to:8595');
     if (value == '7') Lampa.Storage.set('torrserver_url', 'trs.ix.tc:8595');
     if (value == '8') Lampa.Storage.set('torrserver_url', '176.124.198.209:8595');
     if (value == '9') Lampa.Storage.set('torrserver_url', '5.42.82.10:8090');
     if (value == '10') Lampa.Storage.set('torrserver_url', '91.193.43.141:8090');
     if (value == '11') Lampa.Storage.set('torrserver_url', '109.105.90.19:8090');
     if (value == '12') Lampa.Storage.set('torrserver_url', 'zhilkin.org:80');
     if (value == '13') Lampa.Storage.set('torrserver_url', '45.140.169.91:8090');
     if (value == '14') Lampa.Storage.set('torrserver_url', '37.194.36.37:8090');
     if (value == '15') Lampa.Storage.set('torrserver_url', '5.130.142.32:8090');
     if (value == '16') Lampa.Storage.set('torrserver_url', '37.139.80.176:8090');
     if (value == '17') Lampa.Storage.set('torrserver_url', '31.40.34.101:8090');
     if (value == '18') Lampa.Storage.set('torrserver_url', '37.195.222.3:8090');
     if (value == '19') Lampa.Storage.set('torrserver_url', '95.141.184.39:8090');
     if (value == '20') Lampa.Storage.set('torrserver_url', '37.194.21.202:8090');
     if (value == '21') Lampa.Storage.set('torrserver_url', '91.193.43.141:8090');
     Lampa.Storage.set('torrserver_use_link', (value == '0') ? 'two' : 'one');
	//Lampa.Storage.set('torrserver_auth','true');
	//Lampa.Storage.set('torrserver_login',Lampa.Storage.get('account_email') || 'ts');
	//Lampa.Storage.set('torrserver_password','ts');
     Lampa.Settings.update();
    },
     onRender: function (item) {
       setTimeout(function() {
        //$('div[data-name="torrserver_url"] div.settings-param__name, div[data-name="torrserver_url"] div.settings-param__value, div[data-name="torrserver_url"] div.settings-param__descr').remove();
        if(Lampa.Storage.field('torrserver_use_link')) item.show()&$('.settings-param__name', item).css('color','f3d900')&$('div[data-name="torrserver_use_link2"]').insertAfter('div[data-name="torrserver_url"]');
        else item.hide();
          }, 0);
        }
   });
	
Lampa.SettingsApi.addParam({
    component: 'server',
    param: {
     name: 'torrserver_use_link3',
     type: 'select',
     values: {
        0:	'Не выбран',
        1:	'localhost:8090',
	2:	'192.168.1.72:8090',
	3:	'192.168.1.43:8090',
	4:	'Torrserver 5',
	5:	'Torrserver 5',
	6:	'Torrserver 6',
	7:	'Torrserver 7',
	8:	'Torrserver 8',
	9:	'Torrserver 9',
	10:	'Torrserver 10',
	11:	'Torrserver 11',
	12:	'Torrserver 12',
	13:	'Torrserver 13',
	14:	'Torrserver 14',
	15:	'Torrserver 15',
	16:	'Torrserver 16',
	17:	'Torrserver 17',
	18:	'Torrserver 18',
	19:	'Torrserver 19',
	20:	'Torrserver 20',
	21:	'Torrserver 21',
     },
     default: '0'
    },
    field: {
     name: 'Доп. ссылка из списка',
     description: 'Дополнительная ссылка TorrServer из списка'
    },
    onChange: function (value) {
     if (value == '0') Lampa.Storage.set('torrserver_url', '');
     if (value == '1') Lampa.Storage.set('torrserver_url', 'localhost:8090');
     if (value == '2') Lampa.Storage.set('torrserver_url', '192.168.1.72:8090');
     if (value == '3') Lampa.Storage.set('torrserver_url', '192.168.1.43:8090');
     if (value == '4') Lampa.Storage.set('torrserver_url', 'torr.myftp.biz:8090');
     if (value == '5') Lampa.Storage.set('torrserver_url', 'trs.my.to:8595');
     if (value == '6') Lampa.Storage.set('torrserver_url', 'tr.my.to:8595');
     if (value == '7') Lampa.Storage.set('torrserver_url', 'trs.ix.tc:8595');
     if (value == '8') Lampa.Storage.set('torrserver_url', '176.124.198.209:8595');
     if (value == '9') Lampa.Storage.set('torrserver_url', '5.42.82.10:8090');
     if (value == '10') Lampa.Storage.set('torrserver_url', '91.193.43.141:8090');
     if (value == '11') Lampa.Storage.set('torrserver_url', '109.105.90.19:8090');
     if (value == '12') Lampa.Storage.set('torrserver_url', 'zhilkin.org:80');
     if (value == '13') Lampa.Storage.set('torrserver_url', '45.140.169.91:8090');
     if (value == '14') Lampa.Storage.set('torrserver_url', '37.194.36.37:8090');
     if (value == '15') Lampa.Storage.set('torrserver_url', '5.130.142.32:8090');
     if (value == '16') Lampa.Storage.set('torrserver_url', '37.139.80.176:8090');
     if (value == '17') Lampa.Storage.set('torrserver_url', '31.40.34.101:8090');
     if (value == '18') Lampa.Storage.set('torrserver_url', '37.195.222.3:8090');
     if (value == '19') Lampa.Storage.set('torrserver_url', '95.141.184.39:8090');
     if (value == '20') Lampa.Storage.set('torrserver_url', '37.194.21.202:8090');
     if (value == '21') Lampa.Storage.set('torrserver_url', '91.193.43.141:8090');
     Lampa.Storage.set('torrserver_use_link', (value == '0') ? 'one' : 'two');
	//Lampa.Storage.set('torrserver_auth','true');
	//Lampa.Storage.set('torrserver_login',Lampa.Storage.get('account_email') || 'ts');
	//Lampa.Storage.set('torrserver_password','ts');
     Lampa.Settings.update();
    },
     onRender: function (item) {
       setTimeout(function() {
       // $('div[data-name="torrserver_url_two"] div.settings-param__name, div[data-name="torrserver_url_two"] div.settings-param__value, div[data-name="torrserver_url_two"] div.settings-param__descr').remove();
        if(Lampa.Storage.field('torrserver_use_link')) item.show()&$('.settings-param__name', item).css('color','f3d900')&$('div[data-name="torrserver_use_link3"]').insertAfter('div[data-name="torrserver_url_two"]');
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

//Lampa.Template.add('torserv1_css', "\n    <style>\n	div.settings-param[data-name='torrserver_url'], div.settings-param[data-name='torrserver_url_two'] {padding:0;}\n	div.settings-param[data-name='torrserver_url'] .settings-param__status, div.settings-param[data-name='torrserver_url_two'] .settings-param__status {top:3.7em;z-index:9;}\n	</style>\n"); 
//$('body').append(Lampa.Template.get('torserv1_css', {}, true));
 
})();
