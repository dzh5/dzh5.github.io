(function () {
    'use strict';
	Lampa.Listener.follow('app', function(e) {
		if(e.type == 'ready') {
			$('#app > div.head > div > div.head__actions > .open--premium').remove();
			$('#app > div.head > div > div.head__actions > .open--feed').remove();
			$('#app > div.head > div > div.head__actions').append('<div id="reboot" class="head__action selector reload-screen"><svg fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.4800000000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4,12a1,1,0,0,1-2,0A9.983,9.983,0,0,1,18.242,4.206V2.758a1,1,0,1,1,2,0v4a1,1,0,0,1-1,1h-4a1,1,0,0,1,0-2h1.743A7.986,7.986,0,0,0,4,12Zm17-1a1,1,0,0,0-1,1A7.986,7.986,0,0,1,7.015,18.242H8.757a1,1,0,1,0,0-2h-4a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V19.794A9.984,9.984,0,0,0,22,12,1,1,0,0,0,21,11Z" fill="currentColor"></path></g></svg></div>');
			$('#reboot').on('hover:enter hover:click hover:touch', function() {
				location.reload();
			});
			
			$('#app > div.settings > div > div.settings__body > div > div > div > div > div[data-component="filmix"]').remove();
			
			Lampa.Template.add('stlico_css', "\n    <style>\n    .menu__list li[data-type='book'] .menu__ico {color: red;}\n .menu__list li[data-action='mytorrents'] .menu__ico {color: green;}\n    </style>\n"); 
    			$('body').append(Lampa.Template.get('stlico_css', {}, true));
		}
	});

})();
