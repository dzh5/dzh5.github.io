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
	4:	'Torrserver 1',
	5:	'Torrserver 2',
	6:	'Torrserver 3',
	7:	'Torrserver 4',
	8:	'Torrserver 5',
	9:	'Torrserver 6',
	10:	'Torrserver 7',
	11:	'Torrserver 8',
	12:	'Torrserver 9',
	13:	'Torrserver 10',
	14:	'Torrserver 11',
	15:	'Torrserver 12',
	16:	'Torrserver 13',
	17:	'Torrserver 14',
	18:	'Torrserver 15',
	19:	'Torrserver 16',
	20:	'Torrserver 17',
	21:	'Torrserver 18',
	22:	'Torrserver 19',
	23:	'Torrserver 20',
	24:	'Torrserver 21',
	25:	'Torrserver 22',
	26:	'Torrserver 23',
	27:	'Torrserver 24',
	28:	'Torrserver 25',
	29:	'Torrserver 26',
	30:	'Torrserver 27',
	31:	'Torrserver 28',
	32:	'Torrserver 29',
	33:	'Torrserver 30',
	34:	'Torrserver 31',
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
     if (value == '22') Lampa.Storage.set('torrserver_url', '77.39.15.165:8090');
     if (value == '23') Lampa.Storage.set('torrserver_url', '46.46.0.14:8090');
     if (value == '24') Lampa.Storage.set('torrserver_url', '77.82.90.220:8090'); 
     if (value == '25') Lampa.Storage.set('torrserver_url', '77.223.96.247:8090'); 
     if (value == '26') Lampa.Storage.set('torrserver_url', '5.130.142.32:8090'); 
     if (value == '27') Lampa.Storage.set('torrserver_url', '46.181.245.74:8090'); 
     if (value == '28') Lampa.Storage.set('torrserver_url', '31.40.34.101:8090'); 
     if (value == '29') Lampa.Storage.set('torrserver_url', '46.242.39.238:8090'); 
     if (value == '30') Lampa.Storage.set('torrserver_url', '78.36.198.165:8090'); 
     if (value == '31') Lampa.Storage.set('torrserver_url', '77.51.204.228:8090'); 
     if (value == '32') Lampa.Storage.set('torrserver_url', '95.141.184.39:8090'); 
     if (value == '33') Lampa.Storage.set('torrserver_url', '62.76.93.19:8090'); 
     if (value == '34') Lampa.Storage.set('torrserver_url', '91.193.43.141:8090'); 
	    
     Lampa.Storage.set('torrserver_use_link', (value == '0') ? 'two' : 'one');
	//Lampa.Storage.set('torrserver_auth','true');
	//Lampa.Storage.set('torrserver_login',Lampa.Storage.get('account_email') || 'ts');
	//Lampa.Storage.set('torrserver_password','ts');
     Lampa.Settings.update();
    },
     onRender: function (item) {
       setTimeout(function() {
        //$('div[data-name="torrserver_url"] div.settings-param__name, div[data-name="torrserver_url"] div.settings-param__value, div[data-name="torrserver_url"] div.settings-param__descr').remove();
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
	4:	'Torrserver 1',
	5:	'Torrserver 2',
	6:	'Torrserver 3',
	7:	'Torrserver 4',
	8:	'Torrserver 5',
	9:	'Torrserver 6',
	10:	'Torrserver 7',
	11:	'Torrserver 8',
	12:	'Torrserver 9',
	13:	'Torrserver 10',
	14:	'Torrserver 11',
	15:	'Torrserver 12',
	16:	'Torrserver 13',
	17:	'Torrserver 14',
	18:	'Torrserver 15',
	19:	'Torrserver 16',
	20:	'Torrserver 17',
	21:	'Torrserver 18',
	22:	'Torrserver 19',
	23:	'Torrserver 20',
	24:	'Torrserver 21',
	25:	'Torrserver 22',
	26:	'Torrserver 23',
	27:	'Torrserver 24',
	28:	'Torrserver 25',
	29:	'Torrserver 26',
	30:	'Torrserver 27',
	31:	'Torrserver 28',
	32:	'Torrserver 29',
	33:	'Torrserver 30',
	34:	'Torrserver 31',
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
     if (value == '4') Lampa.Storage.set('torrserver_url_two', 'torr.myftp.biz:8090');
     if (value == '5') Lampa.Storage.set('torrserver_url_two', 'trs.my.to:8595');
     if (value == '6') Lampa.Storage.set('torrserver_url_two', 'tr.my.to:8595');
     if (value == '7') Lampa.Storage.set('torrserver_url_two', 'trs.ix.tc:8595');
     if (value == '8') Lampa.Storage.set('torrserver_url_two', '176.124.198.209:8595');
     if (value == '9') Lampa.Storage.set('torrserver_url_two', '5.42.82.10:8090');
     if (value == '10') Lampa.Storage.set('torrserver_url_two', '91.193.43.141:8090');
     if (value == '11') Lampa.Storage.set('torrserver_url_two', '109.105.90.19:8090');
     if (value == '12') Lampa.Storage.set('torrserver_url_two', 'zhilkin.org:80');
     if (value == '13') Lampa.Storage.set('torrserver_url_two', '45.140.169.91:8090');
     if (value == '14') Lampa.Storage.set('torrserver_url_two', '37.194.36.37:8090');
     if (value == '15') Lampa.Storage.set('torrserver_url_two', '5.130.142.32:8090');
     if (value == '16') Lampa.Storage.set('torrserver_url_two', '37.139.80.176:8090');
     if (value == '17') Lampa.Storage.set('torrserver_url_two', '31.40.34.101:8090');
     if (value == '18') Lampa.Storage.set('torrserver_url_two', '37.195.222.3:8090');
     if (value == '19') Lampa.Storage.set('torrserver_url_two', '95.141.184.39:8090');
     if (value == '20') Lampa.Storage.set('torrserver_url_two', '37.194.21.202:8090');
     if (value == '21') Lampa.Storage.set('torrserver_url_two', '91.193.43.141:8090');
     if (value == '22') Lampa.Storage.set('torrserver_url_two', '77.39.15.165:8090');
     if (value == '23') Lampa.Storage.set('torrserver_url_two', '46.46.0.14:8090');
     if (value == '24') Lampa.Storage.set('torrserver_url_two', '77.82.90.220:8090'); 
     if (value == '25') Lampa.Storage.set('torrserver_url_two', '77.223.96.247:8090'); 
     if (value == '26') Lampa.Storage.set('torrserver_url_two', '5.130.142.32:8090'); 
     if (value == '27') Lampa.Storage.set('torrserver_url_two', '46.181.245.74:8090'); 
     if (value == '28') Lampa.Storage.set('torrserver_url_two', '31.40.34.101:8090'); 
     if (value == '29') Lampa.Storage.set('torrserver_url_two', '46.242.39.238:8090'); 
     if (value == '30') Lampa.Storage.set('torrserver_url_two', '78.36.198.165:8090'); 
     if (value == '31') Lampa.Storage.set('torrserver_url_two', '77.51.204.228:8090'); 
     if (value == '32') Lampa.Storage.set('torrserver_url_two', '95.141.184.39:8090'); 
     if (value == '33') Lampa.Storage.set('torrserver_url_two', '62.76.93.19:8090'); 
     if (value == '34') Lampa.Storage.set('torrserver_url_two', '91.193.43.141:8090'); 	    
     
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
