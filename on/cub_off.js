(function () {
    'use strict';
	
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

	 $(document).ready(function () {
		var date = new Date(),
		time = date.getTime()
		localStorage.setItem("region", '{"code":"uk","time":' + time + '}')
	 })

	setTimeout(function(){
              $('.open--feed').remove();
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
                   /* setTimeout(function(){
			$('.button--subscribe').remove();
		   },0); */
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

}	
if(window.appready) cub_off();
	/* else {
		Lampa.Listener.follow('app', function(e) {
			if(e.type == 'ready') {
				cub_off(); hideIT();
				$("[data-action=feed]").eq(0).remove();
                                $("[data-action=subscribes]").eq(0).remove();
				
			}
		});
	} */

})();
