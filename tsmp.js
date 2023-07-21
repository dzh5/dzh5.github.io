(function () {
'use strict';
	$("[data-action=anime]").eq(0).hide();
	$("#app > div.settings > div.settings__content.layer--height > div.settings__body > div > div > div > div > div:nth-child(4)").remove;
	Lampa.Storage.set('torrserver_url','192.168.1.43:8090');
	
    	if (Lampa.Platform.is('browser')) {
		
		Lampa.Storage.set('torrserver_url','5.42.82.10:8090');
	}

    //Lampa.Storage.set('torrserver_auth','true');
    //Lampa.Storage.set('torrserver_login',Lampa.Storage.get('account_email') || 'ts');
    //Lampa.Storage.set('torrserver_password','ts');
	
})();
