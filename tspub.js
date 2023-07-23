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
      	2:	'Torrserver 5',
      	3:	'Torrserver 5',
      	4:	'Torrserver 6',
      	5:	'Torrserver 7',
      	6:	'Torrserver 8',
      	7:	'Torrserver 9',
      	8:	'Torrserver 10',
      	9:	'Torrserver 11',
      	10:	'Torrserver 12',
      	11:	'Torrserver 13',
      	12:	'Torrserver 14',
      	13:	'Torrserver 15',
      	14:	'Torrserver 16',
      	15:	'Torrserver 17',
      	16:	'Torrserver 18',
      	17:	'Torrserver 19',
      	18:	'Torrserver 20',
      	19:	'Torrserver 21',
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
     if (value == '2') Lampa.Storage.set('torrserver_url', 'torr.myftp.biz:8090');
     if (value == '3') Lampa.Storage.set('torrserver_url', 'trs.my.to:8595');
     if (value == '4') Lampa.Storage.set('torrserver_url', 'tr.my.to:8595');
     if (value == '5') Lampa.Storage.set('torrserver_url', 'trs.ix.tc:8595');
     if (value == '6') Lampa.Storage.set('torrserver_url', '176.124.198.209:8595');
     if (value == '7') Lampa.Storage.set('torrserver_url', '5.42.82.10:8090');
     if (value == '8') Lampa.Storage.set('torrserver_url', '91.193.43.141:8090');
     if (value == '9') Lampa.Storage.set('torrserver_url', '109.105.90.19:8090');
     if (value == '10') Lampa.Storage.set('torrserver_url', 'zhilkin.org:80');
     if (value == '11') Lampa.Storage.set('torrserver_url', '45.140.169.91:8090');
     if (value == '12') Lampa.Storage.set('torrserver_url', '37.194.36.37:8090');
     if (value == '13') Lampa.Storage.set('torrserver_url', '5.130.142.32:8090');
     if (value == '14') Lampa.Storage.set('torrserver_url', '37.139.80.176:8090');
     if (value == '15') Lampa.Storage.set('torrserver_url', '31.40.34.101:8090');
     if (value == '16') Lampa.Storage.set('torrserver_url', '37.195.222.3:8090');
     if (value == '17') Lampa.Storage.set('torrserver_url', '95.141.184.39:8090');
     if (value == '18') Lampa.Storage.set('torrserver_url', '37.194.21.202:8090');
     if (value == '19') Lampa.Storage.set('torrserver_url', '91.193.43.141:8090');
     Lampa.Storage.set('torrserver_use_link', (value == '0') ? 'two' : 'one');
  	//Lampa.Storage.set('torrserver_auth','true');
  	//Lampa.Storage.set('torrserver_login',Lampa.Storage.get('account_email') || 'ts');
  	//Lampa.Storage.set('torrserver_password','ts');
     Lampa.Settings.update();
    },
     onRender: function (item) {
       setTimeout(function() {
        if(Lampa.Storage.field('server')) item.show()&$('.settings-param__name', item).css('color','f3d900')&$('div[data-name="torrserver_use_link2"]').insertAfter('div[data-name="torrserver_url"]');
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
      	2:	'Torrserver 5',
      	3:	'Torrserver 5',
      	4:	'Torrserver 6',
      	5:	'Torrserver 7',
      	6:	'Torrserver 8',
      	7:	'Torrserver 9',
      	8:	'Torrserver 10',
      	9:	'Torrserver 11',
      	10:	'Torrserver 12',
      	11:	'Torrserver 13',
      	12:	'Torrserver 14',
      	13:	'Torrserver 15',
      	14:	'Torrserver 16',
      	15:	'Torrserver 17',
      	16:	'Torrserver 18',
      	17:	'Torrserver 19',
      	18:	'Torrserver 20',
      	19:	'Torrserver 21',
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
     if (value == '2') Lampa.Storage.set('torrserver_url_two', 'torr.myftp.biz:8090');
     if (value == '3') Lampa.Storage.set('torrserver_url_two', 'trs.my.to:8595');
     if (value == '4') Lampa.Storage.set('torrserver_url_two', 'tr.my.to:8595');
     if (value == '5') Lampa.Storage.set('torrserver_url_two', 'trs.ix.tc:8595');
     if (value == '6') Lampa.Storage.set('torrserver_url_two', '176.124.198.209:8595');
     if (value == '7') Lampa.Storage.set('torrserver_url_two', '5.42.82.10:8090');
     if (value == '8') Lampa.Storage.set('torrserver_url_two', '91.193.43.141:8090');
     if (value == '9') Lampa.Storage.set('torrserver_url_two', '109.105.90.19:8090');
     if (value == '10') Lampa.Storage.set('torrserver_url_two', 'zhilkin.org:80');
     if (value == '11') Lampa.Storage.set('torrserver_url_two', '45.140.169.91:8090');
     if (value == '12') Lampa.Storage.set('torrserver_url_two', '37.194.36.37:8090');
     if (value == '13') Lampa.Storage.set('torrserver_url_two', '5.130.142.32:8090');
     if (value == '14') Lampa.Storage.set('torrserver_url_two', '37.139.80.176:8090');
     if (value == '15') Lampa.Storage.set('torrserver_url_two', '31.40.34.101:8090');
     if (value == '16') Lampa.Storage.set('torrserver_url_two', '37.195.222.3:8090');
     if (value == '17') Lampa.Storage.set('torrserver_url_two', '95.141.184.39:8090');
     if (value == '18') Lampa.Storage.set('torrserver_url_two', '37.194.21.202:8090');
     if (value == '19') Lampa.Storage.set('torrserver_url_two', '91.193.43.141:8090');
     Lampa.Storage.set('torrserver_use_link', (value == '0') ? 'one' : 'two');
  	//Lampa.Storage.set('torrserver_auth','true');
  	//Lampa.Storage.set('torrserver_login',Lampa.Storage.get('account_email') || 'ts');
  	//Lampa.Storage.set('torrserver_password','ts');
     Lampa.Settings.update();
    },
     onRender: function (item) {
       setTimeout(function() {
        if(Lampa.Storage.field('server')) item.show()&$('.settings-param__name', item).css('color','f3d900')&$('div[data-name="torrserver_use_link3"]').insertAfter('div[data-name="torrserver_url_two"]');
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
