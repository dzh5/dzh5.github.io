(function () {
'use strict';
	if (Lampa.Platform.is('android')) {
		Lampa.Storage.set('torrserver_url','192.168.1.43:8090');
		Lampa.Storage.set('torrserver_url_two','localhost:8090');
	}
    	if (Lampa.Platform.is('browser')) {
		Lampa.Storage.set('torrserver_url','5.42.80.114:6799');
		Lampa.Storage.set('torrserver_url_two','torr.myftp.biz:8090');
	}
    //Lampa.Storage.set('torrserver_auth','true');
    //Lampa.Storage.set('torrserver_login',Lampa.Storage.get('account_email') || 'ts');
    //Lampa.Storage.set('torrserver_password','ts');
	
})();
