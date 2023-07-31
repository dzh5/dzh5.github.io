(function ( backendhost, backendver ) {
    'use strict';
    // backendhost = 'http://192.168.1.100:3333';

    var Source = function () {
      this.network = new Lampa.Reguest();

      this.add = function (u, params) {
        return u + (/\?/.test(u) ? '&' : '?') + params;
      }

      this.url = function (u) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        if (this.source) u = this.add(u, 'source=' + this.source);
        if (params.id) u = this.add(u, 'id=' + params.id);
        if (params.genres) u = this.add(u, 'genre=' + params.genres);
        if (params.page) u = this.add(u, 'page=' + params.page);
        if (params.query) u = this.add(u, 'title=' + params.query);

        if (params.filter) {
          for (var i in params.filter) {
            u = this.add(u, i + '=' + params.filter[i]);
          }
        }

        return this.baseurl + u;
      }

      this.get = function (method) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
        var onerror = arguments.length > 3 ? arguments[3] : undefined;
        var u = this.url(method, params);
        this.network.silent(u, function (json) {
          json.url = method;
          oncomplite(json);
        }, onerror);
      }

      // this.main = function () { }
      // this.menu = function () { }

      // this.search = function () { }

      this.full =  function (params, oncomplite, onerror) {
        this.get('getSources', params, function (json) {
          if (json && json.movie && json.movie.source == 'tmdb') {
            params.id = json.movie.tmdb_id;
            params.method = json.movie.type;
            Lampa.Api.sources.tmdb.full(params, oncomplite, onerror);
          } else {
            var status = new Lampa.Status(2);
            status.onComplite = oncomplite;
            status.append('movie', (json && json.movie ? json.movie : []));
            status.append('videos', (json && json.movie && json.movie.trailers ? json.movie.trailers : {results: []}));
          }
        }, onerror);
      };

      this.list =  function () {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
        var onerror = arguments.length > 2 ? arguments[2] : undefined;
        var u = this.url(params.url, params);
        this.network.silent(u, oncomplite, onerror);
      };

      // this.category = function () { }

      this.clear = function () {
        this.network.clear();
      };

      this.person = function (params, oncomplite, onerror) {
        Lampa.Api.sources.tmdb.person(params, oncomplite, onerror);
      }

      this.seasons = function (tv, from, oncomplite) {
        Lampa.Api.sources.tmdb.seasons(tv, from, oncomplite);
      }

      // this.menuCategory = function (params, oncomplite) { }

      this.discovery = function () {
        // this.title = 'title';
        this.params = {
          align_left: true,
          object: {
            source: this.source
          }
        // this.search: search,
        };
        this.onMore = function onMore(params) {
          Lampa.Activity.push({
            url: 'getSources?type=' + params.data.type,
            title: Lampa.Lang.translate('search') + ' - ' + params.query,
            component: 'category_full',
            page: 2,
            query: encodeURIComponent(params.query),
            source: this.source
          });
        };
        this.onCancel = this.network.clear.bind(this.network)
        return this;
      };

      return this;
    }

    var SourceKP = function () {
      Source.call(this);
      this.title = 'KP';
      this.source = 'kp';
      this.baseurl = backendhost + '/lampa/';  

      this.search = function () {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
        var status = new Lampa.Status(2);

        status.onComplite = function (data) {
          var items = [];
          if (data.movie && data.movie.results.length) items.push(data.movie);
          if (data.tv && data.tv.results.length) items.push(data.tv);
          if (data.anime && data.anime.results.length) items.push(data.anime);
          oncomplite(items);
        };

        this.get('getSources', params, function (json) {
          var movie = {};
          movie.results = json.results.filter(function (elem) { return elem.type == 'movie' });
          movie.title = Lampa.Lang.translate('menu_movies');
          movie.type = 'movie';
          status.append('movie', movie);
          var tv = {};
          tv.results = json.results.filter(function (elem) { return elem.type == 'tv' });
          tv.title = Lampa.Lang.translate('menu_tv');
          tv.type = 'tv';
          status.append('tv', tv);
        }, status.error.bind(status));
      }

      if (Lampa.Storage.get('pva_sources_kp', false) == false) this.discovery = false;

    }

    var SourceHDRezka = function () {
      Source.call(this);
      this.title = 'HDRezka';
      this.source = 'hdrezka';
      this.baseurl = backendhost + '/lampa/';  
      this.categoryurl = 'getSources?ext=releases&type=new';

      this.search = function () {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
        var status = new Lampa.Status(2);

        status.onComplite = function (data) {
          var items = [];
          if (data.movie && data.movie.results.length) items.push(data.movie);
          if (data.tv && data.tv.results.length) items.push(data.tv);
          if (data.anime && data.anime.results.length) items.push(data.anime);
          oncomplite(items);
        };

        this.get('getSources', params, function (json) {
          var movie = {};
          movie.results = json.results.filter(function (elem) { return elem.type == 'movie' });
          movie.title = Lampa.Lang.translate('menu_movies');
          movie.type = 'movie';
          status.append('movie', movie);
          var tv = {};
          tv.results = json.results.filter(function (elem) { return elem.type == 'tv' });
          tv.title = Lampa.Lang.translate('menu_tv');
          tv.type = 'tv';
          status.append('tv', tv);
        }, status.error.bind(status));
      }

      this.main = function () {
        var owner = this;
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
        var onerror = arguments.length > 2 ? arguments[2] : undefined;
        var parts_limit = 4;
        var parts_data = [
          function (call) {
            owner.get('getSources?type=films_watching', params, function (json) {
              json.title = Lampa.Lang.translate('menu_movies') + ' ' + Lampa.Lang.translate('title_now_watch');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?type=films_last', params, function (json) {
              json.title = Lampa.Lang.translate('menu_movies') + ' ' + Lampa.Lang.translate('title_new');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?type=serials_watching', params, function (json) {
              json.title = Lampa.Lang.translate('menu_tv') + ' ' + Lampa.Lang.translate('title_now_watch');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?type=serials_last', params, function (json) {
              json.title = Lampa.Lang.translate('menu_tv') + ' ' + Lampa.Lang.translate('title_new');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?type=cartoons_watching', params, function (json) {
              json.title = Lampa.Lang.translate('menu_multmovie') + ' ' + Lampa.Lang.translate('title_now_watch');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?type=cartoons_last', params, function (json) {
              json.title = Lampa.Lang.translate('menu_multmovie') + ' ' + Lampa.Lang.translate('title_new');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?type=animation_watching', params, function (json) {
              json.title = Lampa.Lang.translate('menu_anime') + ' ' + Lampa.Lang.translate('title_now_watch');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?type=animation_last', params, function (json) {
              json.title = Lampa.Lang.translate('menu_anime') + ' ' + Lampa.Lang.translate('title_new');
              call(json);
            }, call);
          },
        ];

        function loadPart(partLoaded, partEmpty) {
          Lampa.Api.partNext(parts_data, parts_limit, partLoaded, partEmpty);
        }

        loadPart(oncomplite, onerror);
        return loadPart;
      }

      this.category = function () {
        var owner = this;
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
        var onerror = arguments.length > 2 ? arguments[2] : undefined;

        owner.get(this.categoryurl, params, function (json) {
          json.title = Lampa.Lang.translate('menu_movies');
          oncomplite([json]);
        }, onerror);

      }

      if (Lampa.Storage.get('pva_sources_hdrezka', false) == false) this.discovery = false;

    }

    var SourceKinoVOD = function () {
      Source.call(this);
      this.title = 'KinoVOD';
      this.source = 'kinovod';
      this.baseurl = backendhost + '/lampa/';  

      this.search = function () {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
        var status = new Lampa.Status(2);

        status.onComplite = function (data) {
          var items = [];
          if (data.movie && data.movie.results.length) items.push(data.movie);
          if (data.tv && data.tv.results.length) items.push(data.tv);
          if (data.anime && data.anime.results.length) items.push(data.anime);
          oncomplite(items);
        };

        this.get('getSources', params, function (json) {
          var movie = {};
          movie.results = json.results.filter(function (elem) { return elem.type == 'movie' });
          movie.title = Lampa.Lang.translate('menu_movies');
          movie.type = 'movie';
          status.append('movie', movie);
          var tv = {};
          tv.results = json.results.filter(function (elem) { return elem.type == 'tv' });
          tv.title = Lampa.Lang.translate('menu_tv');
          tv.type = 'tv';
          status.append('tv', tv);
        }, status.error.bind(status));
      }

      this.main = function () {
        var owner = this;
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
        var onerror = arguments.length > 2 ? arguments[2] : undefined;
        var parts_limit = 4;
        var parts_data = [
          function (call) {
            owner.get('getSources?type=films_viewed_day', params, function (json) {
              json.title = Lampa.Lang.translate('menu_movies') + ' ' + Lampa.Lang.translate('title_trend_day');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?type=films_viewed_week', params, function (json) {
              json.title = Lampa.Lang.translate('menu_movies') + ' ' + Lampa.Lang.translate('title_trend_week');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?type=films_new', params, function (json) {
              json.title = Lampa.Lang.translate('menu_movies') + ' ' + Lampa.Lang.translate('title_new');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?type=serials_viewed_day', params, function (json) {
              json.title = Lampa.Lang.translate('menu_tv') + ' ' + Lampa.Lang.translate('title_trend_day');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?type=serials_viewed_week', params, function (json) {
              json.title = Lampa.Lang.translate('menu_tv') + ' ' + Lampa.Lang.translate('title_trend_week');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?type=serials_new', params, function (json) {
              json.title = Lampa.Lang.translate('menu_tv') + ' ' + Lampa.Lang.translate('title_new');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?type=animation_viewed_week', params, function (json) {
              json.title = Lampa.Lang.translate('menu_anime') + ' ' + Lampa.Lang.translate('title_trend_week');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?type=tv_viewed_week', params, function (json) {
              json.title = 'TV' + ' ' + Lampa.Lang.translate('title_trend_week');
              call(json);
            }, call);
          },
        ];

        function loadPart(partLoaded, partEmpty) {
          Lampa.Api.partNext(parts_data, parts_limit, partLoaded, partEmpty);
        }

        loadPart(oncomplite, onerror);
        return loadPart;
      }

      this.category = function () {
        var owner = this;
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
        var onerror = arguments.length > 2 ? arguments[2] : undefined;
        var parts_limit = 3;
        var parts_data = [
          function (call) {
            owner.get('getSources?ext=num&type=movies_id', params, function (json) {
              json.title = Lampa.Lang.translate('menu_movies');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?ext=num&type=movies_4k', params, function (json) {
              json.title = '4K';
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?ext=num&type=tv', params, function (json) {
              json.title = Lampa.Lang.translate('menu_tv');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?ext=num&type=cartoons', params, function (json) {
              json.title = Lampa.Lang.translate('menu_multmovie');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?ext=num&type=cartoons_tv', params, function (json) {
              json.title = Lampa.Lang.translate('menu_multtv');
              call(json);
            }, call);
          },
          function (call) {
            owner.get('getSources?ext=num&type=legends', params, function (json) {
              json.title = Lampa.Lang.translate('title_in_top');
              call(json);
            }, call);
          },
        ];

        function loadPart(partLoaded, partEmpty) {
          Lampa.Api.partNext(parts_data, parts_limit, partLoaded, partEmpty);
        }

        loadPart(oncomplite, onerror);
        return loadPart;
      }

      /*if (Lampa.Storage.get('pva_sources_kinovod', false) == false)*/ this.discovery = false;

    }

    function startPlugin() {
      window.plugin_sources_ready = true;
      if (Lampa.Storage.get('pva_sources', false) == false) return;

      function add() {

        var kp = new SourceKP;
        Lampa.Api.sources.kp = kp;
        Object.defineProperty(Lampa.Api.sources, 'kp', {
          get: function get() {
            return kp;
          }
        });

        var hdrezka = new SourceHDRezka;
        Lampa.Api.sources.hdrezka = hdrezka;
        Object.defineProperty(Lampa.Api.sources, 'hdrezka', {
          get: function get() {
            return hdrezka;
          }
        });

        var kinovod = new SourceKinoVOD;
        Lampa.Api.sources.kinovod = kinovod;
        Object.defineProperty(Lampa.Api.sources, 'kinovod', {
          get: function get() {
            return kinovod;
          }
        });
        
        // Lampa.Params.select('source', {
        //   'tmdb': 'TMDB',
        //   'cub': 'CUB',
        //   // 'pub': 'PUB',
        //   // 'filmix': 'FILMIX',
        //   'hdrezka': 'HDRezka',
        //   'kinovod': 'KinoVOD',
        // }, 'tmdb');  

        var button = $("<li class=\"menu__item selector\" data-action=\"soursehome\">\n            <div class=\"menu__ico\">\n                <svg width=\"800\" height=\"800\" viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M29.753.049L16.533 3.63c-.336.09-1.066.089-1.4-.005L2.253.056C1.104-.261-.01.568-.01 1.752v24.316c0 1.003.76 1.962 1.728 2.232l12.88 3.57c.345.096.788.149 1.248.149.315 0 .781-.024 1.21-.142l13.22-3.581c.971-.262 1.734-1.22 1.734-2.227V1.752C32.011.569 30.897-.262 29.752.049zM15 29.904L2.221 26.371c-.096-.026-.232-.203-.232-.303V2.067l12.608 3.486c.122.034.259.061.402.083v24.269zm15.01-3.836c0 .099-.162.27-.258.297l-12.753 3.454V5.572c.018-.005.038-.007.056-.012l12.954-3.504v24.012zm-9.948-14.621a.98.98 0 00.272-.037l6.998-1.97a1 1 0 10-.542-1.926l-6.998 1.97a1 1 0 00.27 1.963zm.001 6c.09 0 .182-.012.272-.037l6.998-1.97a1 1 0 10-.542-1.927l-6.998 1.97a1 1 0 00.27 1.963zm0 6c.09 0 .182-.012.272-.037l6.998-1.97a1 1 0 00-.542-1.926l-6.998 1.97a1 1 0 00.27 1.964zM12.332 9.484l-6.998-1.97a1.001 1.001 0 00-.542 1.926l6.998 1.97a1 1 0 10.54-1.926zm0 6l-6.998-1.97a1 1 0 00-.542 1.927l6.998 1.97a1 1 0 10.54-1.927zm0 6l-6.998-1.97a1.001 1.001 0 00-.542 1.926l6.998 1.97a1 1 0 10.54-1.927z\" fill=\"white\"/></svg>\n            </div>\n            <div class=\"menu__text\">".concat(Lampa.Lang.translate('settings_rest_source'), "</div>\n        </li>"));
        button.on('hover:enter', function () {        
            var items = [ 
              { title: Lampa.Lang.translate('title_main')+' - TMDB', source: 'tmdb' }, 
              { title: Lampa.Lang.translate('title_main')+' - CUB', source: 'cub' },
              { title: Lampa.Lang.translate('title_main')+' - NUM', source: 'kinovod', component: 'category' }, 
              { title: Lampa.Lang.translate('title_main')+' - Releases', source: 'hdrezka', component: 'category_full', url: hdrezka.categoryurl  }, 
              { title: Lampa.Lang.translate('title_main')+' - HDRezka', source: 'hdrezka' },
              { title: Lampa.Lang.translate('title_main')+' - KinoVOD', source: 'kinovod' } 
            ];
            if (Lampa.Api.sources.KP  != undefined) items.push( { title: Lampa.Lang.translate('title_main')+' - KP', source: 'KP' }  );
            if (Lampa.Api.sources.pub  != undefined) items.push( { title: Lampa.Lang.translate('title_main')+' - PUB', source: 'pub' }  );
            if (Lampa.Api.sources.filmix  != undefined) items.push( { title: Lampa.Lang.translate('title_main')+' - Filmix', source: 'filmix' }  );
            Lampa.Select.show({
              title: Lampa.Lang.translate('settings_rest_source'),
              items: items,
              onSelect: function onSelect(a) {
                Lampa.Activity.push({
                  title: a.title,
                  url: a.url,
                  component: a.component || 'main',
                  source: a.source,
                  page: 1
                });
              },
              onBack: function onBack() {
                Lampa.Controller.toggle('menu');
              }
            });
        });
        $('.menu .menu__list').eq(0).append(button);    
      }

      if (window.appready) add(); else {
        Lampa.Listener.follow('app', function (e) {
          if (e.type == 'ready') add();
        });
      }
    }

    if (!window.plugin_sources_ready) startPlugin();

})( 'http://back.freebie.tom.ru', 'v=0' );
