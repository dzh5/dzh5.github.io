(function () {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  
  var plugins = ["o.js"];
  
  if (window.bwainit && !window.bwafullinit)
  {
    if (plugins.length == 2)
      window.bwafullinit = true;
	  
    Lampa.Utils.putScriptAsync(plugins.map(function (u) {
      return host + '/plugins/' + u;
    }), function () {});
  }
  else if (typeof window.bwainit == 'undefined' && typeof WebAssembly !== 'undefined') 
  {
    window.bwainit = true;
    if (plugins.length == 2)
      window.bwafullinit = true;
	
    var host = 'https://bwa.to';
    var s = document.createElement('script');
    s.onload = function () 
    {
      Blazor.start({
        loadBootResource: function loadBootResource(type, name, defaultUri, integrity){
          return host + '/_framework/' + name;
        }
      }).then(function () 
      {
        var net = new Lampa.Reguest();
        window.httpReq = function (url, post, params) {
          return new Promise(function (resolve, reject) {
            net["native"](url, function (result) {
              //console.log('BWA', 'result type', _typeof(result));
              //console.log('BWA', 'result', result);
              if (_typeof(result) == 'object') resolve(JSON.stringify(result));else resolve(result);
            }, reject, post, params);
          });
        };
        var check = function check(good) 
        {
          var initial = false;
          try {
            DotNet.invokeMethodAsync("JinEnergy", 'initial');
            initial = true;
          } catch (e) {}
			
          if (initial) 
          {
            console.log('BWA', 'check cors:', good);
            var type = Lampa.Platform.is('android') ? 'apk' : good ? 'cors' : 'web';
            var conf = host + '/settings/' + type + '.json?v=22062023';
            DotNet.invokeMethodAsync("JinEnergy", 'oninit', type, conf);
            Lampa.Utils.putScriptAsync(plugins.map(function (u) {
              return host + '/plugins/' + u;
            }), function () {});
          } 
          else if (trys < 8) {
            trys++;
            console.log('BWA', 'try load:', trys);
            setTimeout(function () {
              check(good);
            }, 1000);
          } 
          else {
            console.log('BWA', 'no initial');
          }
        };
        if (Lampa.Platform.is('android')) check(true);else {
          net.silent('https://github.com/', function () {
            check(true);
          }, function () {
            check(false);
          }, false, {
            dataType: 'text'
          });
        }
      })["catch"](function (e) {
        console.log('BWA', 'error:', e);
      });
    };
    s.setAttribute('autostart', 'false');
    s.setAttribute('src', host + '/_framework/blazor.webassembly.js');
    document.body.appendChild(s);
  }

})();
