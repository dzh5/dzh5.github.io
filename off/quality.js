(function () {
	'use strict';
 Lampa.Listener.follow('full', function(e) {
        if (e.type == 'complite') { 
var qu = data.quality || data.release_quality;

if (qu && Storage.field('card_quality')) {
  var quality = document.createElement('div');
  quality.classList.add('card__quality');
  var quality_inner = document.createElement('div');
  quality_inner.innerText = qu;
  quality.appendChild(quality_inner);
  $('.full-start-new__poster').appendChild(quality);
}
  }
    })
 })();