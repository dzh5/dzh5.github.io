(function () {
    'use strict';

    function startsWith(str, searchString) {
      return str.lastIndexOf(searchString, 0) === 0;
    }

    var network = new Lampa.Reguest();
    var cache = {};
    var total_cnt = 0;
    var proxy_cnt = 0;
    var good_cnt = 0;
    var menu_list = [];
    var genres_map = {};
    var countries_map = {};
    var CACHE_SIZE = 100;
    var CACHE_TIME = 1000 * 60 * 60;
    var SOURCE_NAME = 'KP';
    var SOURCE_TITLE = 'KP';

    function get(method, oncomplite, onerror) {
      var use_proxy = total_cnt >= 10 && good_cnt > total_cnt / 2;
      if (!use_proxy) total_cnt++;
      var kp_prox = 'https://cors.kp556.workers.dev/';
      var url = 'https://kinopoiskapiunofficial.tech/';
      url += method;
      network.timeout(15000);
      network.silent((use_proxy ? kp_prox : '') + url, function (json) {
        oncomplite(json);
      }, function (a, c) {
        use_proxy = !use_proxy && (proxy_cnt < 10 || good_cnt > proxy_cnt / 2);

        if (use_proxy && (a.status == 429 || a.status == 0 && a.statusText !== 'timeout')) {
          proxy_cnt++;
          network.timeout(15000);
          network.silent(kp_prox + url, function (json) {
            good_cnt++;
            oncomplite(json);
          }, onerror, false, {
            headers: {
              'X-API-KEY': '2a4a0808-81a3-40ae-b0d3-e11335ede616'
            }
          });
        } else onerror(a, c);
      }, false, {
        headers: {
          'X-API-KEY': '2a4a0808-81a3-40ae-b0d3-e11335ede616'
        }
      });
    }

    function getComplite(method, oncomplite) {
      get(method, oncomplite, function () {
        oncomplite(null);
      });
    }

    function getCompliteIf(condition, method, oncomplite) {
      if (condition) getComplite(method, oncomplite);else {
        setTimeout(function () {
          oncomplite(null);
        }, 10);
      }
    }

    function getCache(key) {
      var res = cache[key];

      if (res) {
        var cache_timestamp = new Date().getTime() - CACHE_TIME;
        if (res.timestamp > cache_timestamp) return res.value;

        for (var ID in cache) {
          var node = cache[ID];
          if (!(node && node.timestamp > cache_timestamp)) delete cache[ID];
        }
      }

      return null;
    }

    function setCache(key, value) {
      var timestamp = new Date().getTime();
      var size = Object.keys(cache).length;

      if (size >= CACHE_SIZE) {
        var cache_timestamp = timestamp - CACHE_TIME;

        for (var ID in cache) {
          var node = cache[ID];
          if (!(node && node.timestamp > cache_timestamp)) delete cache[ID];
        }

        size = Object.keys(cache).length;

        if (size >= CACHE_SIZE) {
          var timestamps = [];

          for (var _ID in cache) {
            var _node = cache[_ID];
            timestamps.push(_node && _node.timestamp || 0);
          }

          timestamps.sort(function (a, b) {
            return a - b;
          });
          cache_timestamp = timestamps[Math.floor(timestamps.length / 2)];

          for (var _ID2 in cache) {
            var _node2 = cache[_ID2];
            if (!(_node2 && _node2.timestamp > cache_timestamp)) delete cache[_ID2];
          }
        }
      }

      cache[key] = {
        timestamp: timestamp,
        value: value
      };
    }

    function getFromCache(method, oncomplite, onerror) {
      var json = getCache(method);

      if (json) {
        setTimeout(function () {
          oncomplite(json, true);
        }, 10);
      } else get(method, oncomplite, onerror);
    }

    function clear() {
      network.clear();
    }

    function convertElem(elem) {
      var type = !elem.type || elem.type === 'FILM' || elem.type === 'VIDEO' ? 'movie' : 'tv';
      var kinopoisk_id = elem.kinopoiskId || elem.filmId || 0;
      var kp_rating = +elem.rating || +elem.ratingKinopoisk || 0;
      var title = elem.nameRu || elem.nameEn || elem.nameOriginal || '';
      var original_title = elem.nameOriginal || elem.nameEn || elem.nameRu || '';
      var adult = false;
      var result = {
        "source": SOURCE_NAME,
        "type": type,
        "adult": false,
        "id": SOURCE_NAME + '_' + kinopoisk_id,
        "title": title,
        "original_title": original_title,
        "overview": elem.description || elem.shortDescription || '',
        "img": elem.posterUrlPreview || elem.posterUrl || '',
        "background_image": elem.coverUrl || elem.posterUrl || elem.posterUrlPreview || '',
        "genres": elem.genres && elem.genres.map(function (e) {
          if (e.genre === 'для взрослых') {
            adult = true;
          }

          return {
            "id": e.genre && genres_map[e.genre] || 0,
            "name": e.genre,
            "url": ''
          };
        }) || [],
        "production_companies": [],
        "production_countries": elem.countries && elem.countries.map(function (e) {
          return {
            "name": e.country
          };
        }) || [],
        "vote_average": kp_rating,
        "vote_count": elem.ratingVoteCount || elem.ratingKinopoiskVoteCount || 0,
        "kinopoisk_id": kinopoisk_id,
        "kp_rating": kp_rating,
        "imdb_id": elem.imdbId || '',
        "imdb_rating": elem.ratingImdb || 0
      };
      result.adult = adult;
      var first_air_date = elem.year && elem.year !== 'null' ? elem.year : '';
      var last_air_date = '';

      if (type === 'tv') {
        if (elem.startYear && elem.startYear !== 'null') first_air_date = elem.startYear;
        if (elem.endYear && elem.endYear !== 'null') last_air_date = elem.endYear;
      }

      if (elem.distributions_obj) {
        var distributions = elem.distributions_obj.items || [];
        var year_timestamp = Date.parse(first_air_date);
        var min = null;
        distributions.forEach(function (d) {
          if (d.date && (d.type === 'WORLD_PREMIER' || d.type === 'ALL')) {
            var timestamp = Date.parse(d.date);

            if (!isNaN(timestamp) && (min == null || timestamp < min) && (isNaN(year_timestamp) || timestamp >= year_timestamp)) {
              min = timestamp;
              first_air_date = d.date;
            }
          }
        });
      }

      if (type === 'tv') {
        result.name = title;
        result.original_name = original_title;
        result.first_air_date = first_air_date;
        if (last_air_date) result.last_air_date = last_air_date;
      } else {
        result.release_date = first_air_date;
      }

      if (elem.seasons_obj) {
        var _seasons = elem.seasons_obj.items || [];

        result.number_of_seasons = elem.seasons_obj.total || _seasons.length || 1;
        result.seasons = _seasons.map(function (s) {
          return convertSeason(s);
        });
        var number_of_episodes = 0;
        result.seasons.forEach(function (s) {
          number_of_episodes += s.episode_count;
        });
        result.number_of_episodes = number_of_episodes;
      }

      if (elem.staff_obj) {
        var staff = elem.staff_obj || [];
        var cast = [];
        var crew = [];
        staff.forEach(function (s) {
          var person = convertPerson(s);
          if (s.professionKey === 'ACTOR') cast.push(person);else crew.push(person);
        });
        result.persons = {
          "cast": cast,
          "crew": crew
        };
      }

      if (elem.sequels_obj) {
        var sequels = elem.sequels_obj || [];
        result.collection = {
          "results": sequels.map(function (s) {
            return convertElem(s);
          })
        };
      }

      if (elem.similars_obj) {
        var similars = elem.similars_obj.items || [];
        result.simular = {
          "results": similars.map(function (s) {
            return convertElem(s);
          })
        };
      }

      return result;
    }

    function convertSeason(season) {
      var episodes = season.episodes || [];
      episodes = episodes.map(function (e) {
        return {
          "season_number": e.seasonNumber,
          "episode_number": e.episodeNumber,
          "name": e.nameRu || e.nameEn || 'S' + e.seasonNumber + ' / ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + e.episodeNumber,
          "overview": e.synopsis || '',
          "air_date": e.releaseDate
        };
      });
      return {
        "season_number": season.number,
        "episode_count": episodes.length,
        "episodes": episodes,
        "name": Lampa.Lang.translate('torrent_serial_season') + ' ' + season.number,
        "overview": ''
      };
    }

    function convertPerson(person) {
      return {
        "id": person.staffId,
        "name": person.nameRu || person.nameEn || '',
        "url": '',
        "img": person.posterUrl || '',
        "character": person.description || '',
        "job": Lampa.Utils.capitalizeFirstLetter((person.professionKey || '').toLowerCase())
      };
    }

    function cleanTitle(str) {
      return str.replace(/[\s.,:;’'`!?]+/g, ' ').trim();
    }

    function kpCleanTitle(str) {
      return cleanTitle(str).replace(/^[ \/\\]+/, '').replace(/[ \/\\]+$/, '').replace(/\+( *[+\/\\])+/g, '+').replace(/([+\/\\] *)+\+/g, '+').replace(/( *[\/\\]+ *)+/g, '+');
    }

    function normalizeTitle(str) {
      return cleanTitle(str.toLowerCase().replace(/[\-\u2010-\u2015\u2E3A\u2E3B\uFE58\uFE63\uFF0D]+/g, '-').replace(/ё/g, 'е'));
    }

    function containsTitle(str, title) {
      return typeof str === 'string' && typeof title === 'string' && normalizeTitle(str).indexOf(normalizeTitle(title)) !== -1;
    }

    function getList(method) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
      var onerror = arguments.length > 3 ? arguments[3] : undefined;
      var url = method;

      if (params.query) {
        var clean_title = params.query && kpCleanTitle(decodeURIComponent(params.query));

        if (!clean_title) {
          onerror();
          return;
        }

        url = Lampa.Utils.addUrlComponent(url, 'keyword=' + encodeURIComponent(clean_title));
      }

      var page = params.page || 1;
      url = Lampa.Utils.addUrlComponent(url, 'page=' + page);
      getFromCache(url, function (json, cached) {
        var items = [];
        if (json.items && json.items.length) items = json.items;else if (json.films && json.films.length) items = json.films;else if (json.releases && json.releases.length) items = json.releases;
        if (!cached && items.length) setCache(url, json);
        var results = items.map(function (elem) {
          return convertElem(elem);
        });
        results = results.filter(function (elem) {
          return !elem.adult;
        });
        var total_pages = json.pagesCount || json.totalPages || 1;
        var res = {
          "results": results,
          "url": method,
          "page": page,
          "total_pages": total_pages,
          "total_results": 0,
          "more": total_pages > page
        };
        oncomplite(res);
      }, onerror);
    }

    function _getById(id) {
      var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
      var onerror = arguments.length > 3 ? arguments[3] : undefined;
      var url = 'api/v2.2/films/' + id;
      var film = getCache(url);

      if (film) {
        setTimeout(function () {
          oncomplite(convertElem(film));
        }, 10);
      } else {
        get(url, function (film) {
          if (film.kinopoiskId) {
            var type = !film.type || film.type === 'FILM' || film.type === 'VIDEO' ? 'movie' : 'tv';
            getCompliteIf(type == 'tv', 'api/v2.2/films/' + id + '/seasons', function (seasons) {
              film.seasons_obj = seasons;
              getComplite('api/v2.2/films/' + id + '/distributions', function (distributions) {
                film.distributions_obj = distributions;
                getComplite('/api/v1/staff?filmId=' + id, function (staff) {
                  film.staff_obj = staff;
                  getComplite('api/v2.1/films/' + id + '/sequels_and_prequels', function (sequels) {
                    film.sequels_obj = sequels;
                    getComplite('api/v2.2/films/' + id + '/similars', function (similars) {
                      film.similars_obj = similars;
                      setCache(url, film);
                      oncomplite(convertElem(film));
                    });
                  });
                });
              });
            });
          } else onerror();
        }, onerror);
      }
    }

    function getById(id) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
      var onerror = arguments.length > 3 ? arguments[3] : undefined;
      menu({}, function () {
        return _getById(id, params, oncomplite, onerror);
      });
    }

    function main() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;
      var parts_limit = 5;
      var parts_data = [function (call) {
        getList('api/v2.2/films/top?type=TOP_100_POPULAR_FILMS', params, function (json) {
          json.title = Lampa.Lang.translate('title_now_watch');
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films/top?type=TOP_250_BEST_FILMS', params, function (json) {
          json.title = Lampa.Lang.translate('title_top_movie');
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films?order=NUM_VOTE&type=FILM', params, function (json) {
          json.title = 'Популярные фильмы';
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films?order=NUM_VOTE&type=TV_SERIES', params, function (json) {
          json.title = 'Популярные сериалы';
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films?order=NUM_VOTE&type=MINI_SERIES', params, function (json) {
          json.title = 'Популярные мини-сериалы';
          call(json);
        }, call);
      }, function (call) {
        getList('api/v2.2/films?order=NUM_VOTE&type=TV_SHOW', params, function (json) {
          json.title = 'Популярные телешоу';
          call(json);
        }, call);
      }];

      function loadPart(partLoaded, partEmpty) {
        Lampa.Api.partNext(parts_data, parts_limit, partLoaded, partEmpty);
      }

      menu({}, function () {
        var rus_id = countries_map['Россия'];

        if (rus_id) {
          parts_data.splice(3, 0, function (call) {
            getList('api/v2.2/films?order=NUM_VOTE&countries=' + rus_id + '&type=FILM', params, function (json) {
              json.title = 'Популярные российские фильмы';
              call(json);
            }, call);
          });
          parts_data.splice(5, 0, function (call) {
            getList('api/v2.2/films?order=NUM_VOTE&countries=' + rus_id + '&type=TV_SERIES', params, function (json) {
              json.title = 'Популярные российские сериалы';
              call(json);
            }, call);
          });
          parts_data.splice(7, 0, function (call) {
            getList('api/v2.2/films?order=NUM_VOTE&countries=' + rus_id + '&type=MINI_SERIES', params, function (json) {
              json.title = 'Популярные российские мини-сериалы';
              call(json);
            }, call);
          });
        }

        loadPart(oncomplite, onerror);
      });
      return loadPart;
    }

    function category() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;
      var show = ['movie', 'tv'].indexOf(params.url) > -1 && !params.genres;
      var books = show ? Lampa.Favorite.continues(params.url) : [];
      books.forEach(function (elem) {
        if (!elem.source) elem.source = 'tmdb';
      });
      books = books.filter(function (elem) {
        return [SOURCE_NAME, 'tmdb', 'cub'].indexOf(elem.source) !== -1;
      });
      var recomend = show ? Lampa.Arrays.shuffle(Lampa.Recomends.get(params.url)).slice(0, 19) : [];
      recomend.forEach(function (elem) {
        if (!elem.source) elem.source = 'tmdb';
      });
      recomend = recomend.filter(function (elem) {
        return [SOURCE_NAME, 'tmdb', 'cub'].indexOf(elem.source) !== -1;
      });
      var parts_limit = 5;
      var parts_data = [function (call) {
        call({
          results: books,
          title: params.url == 'tv' ? Lampa.Lang.translate('title_continue') : Lampa.Lang.translate('title_watched')
        });
      }, function (call) {
        call({
          results: recomend,
          title: Lampa.Lang.translate('title_recomend_watch')
        });
      }];

      function loadPart(partLoaded, partEmpty) {
        Lampa.Api.partNext(parts_data, parts_limit, partLoaded, partEmpty);
      }

      menu({}, function () {
        var priority_list = ['семейный', 'детский', 'короткометражка', 'мультфильм', 'аниме'];
        priority_list.forEach(function (g) {
          var id = genres_map[g];

          if (id) {
            parts_data.push(function (call) {
              getList('api/v2.2/films?order=NUM_VOTE&genres=' + id + '&type=' + (params.url == 'tv' ? 'TV_SERIES' : 'FILM'), params, function (json) {
                json.title = Lampa.Utils.capitalizeFirstLetter(g);
                call(json);
              }, call);
            });
          }
        });
        menu_list.forEach(function (g) {
          if (!g.hide && !g.separator && priority_list.indexOf(g.title) == -1) {
            parts_data.push(function (call) {
              getList('api/v2.2/films?order=NUM_VOTE&genres=' + g.id + '&type=' + (params.url == 'tv' ? 'TV_SERIES' : 'FILM'), params, function (json) {
                json.title = Lampa.Utils.capitalizeFirstLetter(g.title);
                call(json);
              }, call);
            });
          }
        });
        loadPart(oncomplite, onerror);
      });
      return loadPart;
    }

    function full() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;
      var kinopoisk_id = '';

      if (params.card && params.card.source === SOURCE_NAME) {
        if (params.card.kinopoisk_id) {
          kinopoisk_id = params.card.kinopoisk_id;
        } else if (startsWith(params.card.id + '', SOURCE_NAME + '_')) {
          kinopoisk_id = (params.card.id + '').substring(SOURCE_NAME.length + 1);
          params.card.kinopoisk_id = kinopoisk_id;
        }
      }

      if (kinopoisk_id) {
        getById(kinopoisk_id, params, function (json) {
          var status = new Lampa.Status(4);
          status.onComplite = oncomplite;
          status.append('movie', json);
          status.append('persons', json && json.persons);
          status.append('collection', json && json.collection);
          status.append('simular', json && json.simular);
        }, onerror);
      } else onerror();
    }

    function list() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var onerror = arguments.length > 2 ? arguments[2] : undefined;
      var method = params.url;

      if (method === '' && params.genres) {
        method = 'api/v2.2/films?order=NUM_VOTE&genres=' + params.genres;
      }

      getList(method, params, oncomplite, onerror);
    }

    function search() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var title = decodeURIComponent(params.query || '');
      var status = new Lampa.Status(1);

      status.onComplite = function (data) {
        var items = [];

        if (data.query && data.query.results) {
          var tmp = data.query.results.filter(function (elem) {
            return containsTitle(elem.title, title) || containsTitle(elem.original_title, title);
          });

          if (tmp.length && tmp.length !== data.query.results.length) {
            data.query.results = tmp;
            data.query.more = true;
          }

          var movie = Object.assign({}, data.query);
          movie.results = data.query.results.filter(function (elem) {
            return elem.type === 'movie';
          });
          movie.title = Lampa.Lang.translate('menu_movies');
          movie.type = 'movie';
          if (movie.results.length) items.push(movie);
          var tv = Object.assign({}, data.query);
          tv.results = data.query.results.filter(function (elem) {
            return elem.type === 'tv';
          });
          tv.title = Lampa.Lang.translate('menu_tv');
          tv.type = 'tv';
          if (tv.results.length) items.push(tv);
        }

        oncomplite(items);
      };

      getList('api/v2.1/films/search-by-keyword', params, function (json) {
        status.append('query', json);
      }, status.error.bind(status));
    }

    function discovery() {
      return {
        title: SOURCE_TITLE,
        search: search,
        params: {
          align_left: true,
          object: {
            source: SOURCE_NAME
          }
        },
        onMore: function onMore(params) {
          Lampa.Activity.push({
            url: 'api/v2.1/films/search-by-keyword',
            title: Lampa.Lang.translate('search') + ' - ' + params.query,
            component: 'category_full',
            page: 1,
            query: encodeURIComponent(params.query),
            source: SOURCE_NAME
          });
        },
        onCancel: network.clear.bind(network)
      };
    }

    function person() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      var status = new Lampa.Status(1);

      status.onComplite = function (data) {
        var result = {};

        if (data.query) {
          var p = data.query;
          result.person = {
            "id": p.personId,
            "name": p.nameRu || p.nameEn || '',
            "url": '',
            "img": p.posterUrl || '',
            "gender": p.sex === 'MALE' ? 2 : p.sex === 'FEMALE' ? 1 : 0,
            "birthday": p.birthday,
            "place_of_birth": p.birthplace,
            "deathday": p.death,
            "place_of_death": p.deathplace,
            "known_for_department": p.profession || '',
            "biography": (p.facts || []).join(' ')
          };
          var director_films = [];
          var director_map = {};
          var actor_films = [];
          var actor_map = {};

          if (p.films) {
            p.films.forEach(function (f) {
              if (f.professionKey === 'DIRECTOR' && !director_map[f.filmId]) {
                director_map[f.filmId] = true;
                director_films.push(convertElem(f));
              } else if (f.professionKey === 'ACTOR' && !actor_map[f.filmId]) {
                actor_map[f.filmId] = true;
                actor_films.push(convertElem(f));
              }
            });
          }

          var knownFor = [];

          if (director_films.length) {
            director_films.sort(function (a, b) {
              var res = b.vote_average - a.vote_average;
              if (res) return res;
              return a.id - b.id;
            });
            knownFor.push({
              "name": Lampa.Lang.translate('title_producer'),
              "credits": director_films
            });
          }

          if (actor_films.length) {
            actor_films.sort(function (a, b) {
              var res = b.vote_average - a.vote_average;
              if (res) return res;
              return a.id - b.id;
            });
            knownFor.push({
              "name": Lampa.Lang.translate(p.sex === 'FEMALE' ? 'title_actress' : 'title_actor'),
              "credits": actor_films
            });
          }

          result.credits = {
            "knownFor": knownFor
          };
        }

        oncomplite(result);
      };

      var url = 'api/v1/staff/' + params.id;
      getFromCache(url, function (json, cached) {
        if (!cached && json.personId) setCache(url, json);
        status.append('query', json);
      }, status.error.bind(status));
    }

    function menu() {
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      if (menu_list.length) oncomplite(menu_list);else {
        get('api/v2.2/films/filters', function (j) {
          if (j.genres) {
            j.genres.forEach(function (g) {
              menu_list.push({
                "id": g.id,
                "title": g.genre,
                "url": '',
                "hide": g.genre === 'для взрослых',
                "separator": !g.genre
              });
              genres_map[g.genre] = g.id;
            });
          }

          if (j.countries) {
            j.countries.forEach(function (c) {
              countries_map[c.country] = c.id;
            });
          }

          oncomplite(menu_list);
        }, function () {
          oncomplite([]);
        });
      }
    }

    function menuCategory(params, oncomplite) {
      oncomplite([]);
    }

    function seasons(tv, from, oncomplite) {
      var status = new Lampa.Status(from.length);
      status.onComplite = oncomplite;
      from.forEach(function (season) {
        var seasons = tv.seasons || [];
        seasons = seasons.filter(function (s) {
          return s.season_number === season;
        });

        if (seasons.length) {
          status.append('' + season, seasons[0]);
        } else {
          status.error();
        }
      });
    }

    var KP = {
      SOURCE_NAME: SOURCE_NAME,
      SOURCE_TITLE: SOURCE_TITLE,
      main: main,
      menu: menu,
      full: full,
      list: list,
      category: category,
      clear: clear,
      person: person,
      seasons: seasons,
      menuCategory: menuCategory,
      discovery: discovery
    };

    var ALL_SOURCES = [{
      name: 'tmdb',
      title: 'TMDB'
    }, {
      name: 'cub',
      title: 'CUB'
    }, {
      name: 'pub',
      title: 'PUB'
    }, {
      name: 'filmix',
      title: 'FILMIX'
    }, {
      name: KP.SOURCE_NAME,
      title: KP.SOURCE_TITLE
    }];

    function startPlugin() {
      window.kp_source_plugin = true;

      function addPlugin() {
        if (Lampa.Api.sources[KP.SOURCE_NAME]) {
          Lampa.Noty.show('Установлен плагин несовместимый с kp_source');
          return;
        }

        Lampa.Api.sources[KP.SOURCE_NAME] = KP;
        Object.defineProperty(Lampa.Api.sources, KP.SOURCE_NAME, {
          get: function get() {
            return KP;
          }
        });
        var sources;

        if (Lampa.Params.values && Lampa.Params.values['source']) {
          sources = Object.assign({}, Lampa.Params.values['source']);
          sources[KP.SOURCE_NAME] = KP.SOURCE_TITLE;
        } else {
          sources = {};
          ALL_SOURCES.forEach(function (s) {
            if (Lampa.Api.sources[s.name]) sources[s.name] = s.title;
          });
        }

        Lampa.Params.select('source', sources, 'tmdb');
      }

      if (window.appready) addPlugin();else {
        Lampa.Listener.follow('app', function (e) {
          if (e.type == 'ready') addPlugin();
        });
      }
    }

    if (!window.kp_source_plugin) startPlugin();

	var Protocol = function Protocol() {
		return window.location.protocol == 'https:' ? 'https://' : 'http://';
	}
	var API = '', cards, manifest, menu_list = [], uid = '';
		console.log('App', 'protocol:', Protocol());

	var Lmp = {
		init: function () {
			this.sources();
   	if (!window.FX) {
  			window.FX = {
  				max_qualitie: 720,
  				is_max_qualitie: true, 
  				auth: false
  			};
  		}

},
  sources: function () {
			var sources;
			if (Lampa.Params.values && Lampa.Params.values['source']) {
        sources = Object.assign({}, Lampa.Params.values['source']);
        sources.filmix = 'FILMIX';
      } else {
        sources = {
          'tmdb': 'TMDB',
          'cub': 'CUB',
          'filmix': 'FILMIX'
        };
      }

      Lampa.Params.select('source', sources, 'tmdb');
		},
		
    setCache: function(key, data) {
			var timestamp = new Date().getTime();
			var cache = Lampa.Storage.cache(key, 1, {}); //500 это лимит ключей
			if (!cache[key]) {
				cache[key] = data;
				Lampa.Storage.set(key, cache);
			} else {
				if ((timestamp - cache[key].timestamp) > this.CACHE_TIME) {
					data.timestamp = timestamp;
					cache[key] = data;
					Lampa.Storage.set(key, cache);
				} else data = cache[key];
			}
			return data;
		}
	}; 
	var Filmix = {
  	network: new Lampa.Reguest(),
  	api_url: 'http://filmixapp.cyou/api/v2/',
  	token: Lampa.Storage.get('filmix_token', ''),
  	user_dev: 'app_lang=ru_RU&user_dev_apk=2.1.2&user_dev_id=' + Lampa.Utils.uid(16) + '&user_dev_name=Xiaomi&user_dev_os=11&user_dev_vendor=Xiaomi&user_dev_token=',
  	add_new: function () {
  		var user_code = '';
  		var user_token = '';
  		var modal = $('<div><div class="broadcast__text">' + Lampa.Lang.translate('filmix_modal_text') + '</div><div class="broadcast__device selector" style="text-align: center">Ожидаем код...</div><br><div class="broadcast__scan"><div></div></div></div></div>');
  		Lampa.Modal.open({
  			title: '',
  			html: modal,
  			onBack: function onBack() {
  				Lampa.Modal.close();
  				Lampa.Controller.toggle('settings_component');
  				clearInterval(ping_auth);
  			},
  			onSelect: function onSelect() {
  				Lampa.Utils.copyTextToClipboard(user_code, function () {
  					Lampa.Noty.show(Lampa.Lang.translate('filmix_copy_secuses'));
  				}, function () {
  					Lampa.Noty.show(Lampa.Lang.translate('filmix_copy_fail'));
  				});
  			}
  		});
  		ping_auth = setInterval(function () {
  			Filmix.checkPro(user_token, function (json) {
  				if (json && json.user_data) {
  					Lampa.Modal.close();
  					clearInterval(ping_auth);
  					Lampa.Storage.set("filmix_token", user_token);
  					Filmix.token = user_token;
  					$('[data-name="filmix_token"] .settings-param__value').text(user_token);
  					Lampa.Controller.toggle('settings_component');
  				}
  			});
  		}, 2000);
  		this.network.clear();
  		this.network.timeout(10000);
  		this.network.quiet(this.api_url + 'token_request?' + this.user_dev, function (found) {
  			if (found.status == 'ok') {
  				user_token = found.code;
  				user_code = found.user_code;
  				modal.find('.selector').text(user_code);
  			} else {
  				Lampa.Noty.show(found);
  			}
  		}, function (a, c) {
  			Lampa.Noty.show(Filmix.network.errorDecode(a, c));
  		});
  	}  };
	var Pub = {
  	network: new Lampa.Reguest(),
    };
  	
  var proxyInitialized = false;
  var proxyWindow;
  var proxyCalls = {};
  
	
	function collection(object) {
  	var network = new Lampa.Reguest();
  	var scroll = new Lampa.Scroll({
  		mask: true,
  		over: true,
  		step: 250
  	});
  	var items = [];
  	var html = $('<div></div>');
  	var body = $('<div class="category-full"></div>');
  	var cors = object.sour == 'rezka' || object.sourc == 'rezka' ? Lampa.Utils.protocol() + 'prox.lampa.stream/' : object.sour == 'filmix' || object.sourc == 'filmix' ? 'http://corsanywhere.herokuapp.com/' : '';
  	var cache = Lampa.Storage.cache('my_col', 5000, {});
  	var info;
  	var last;
  	var waitload = false;
  	var relises = [];
  	var total_pages;
  	var _this1 = this;
 this.create = function () {
    var _this = this;
    var url;
    object.sourc = object.sourc || 'pub'; // Установка 'pub' в качестве источника по умолчанию

    if (object.sourc == 'my_coll') {
        _this.build({
            card: cache
        });
    } else {
        if (object.card && isNaN(object.id)) url = object.id;
        else url = object.url + (object.sourc == 'pub' ? '?sort=' + (object.sort ? object.sort : 'views-') + '&access_token=' + Pub.token : '?filter=last');

        this.activity.loader(true);
        network.silent(cors + url, function (str) {
            var data = _this.card(str);
            _this.build(data);
            if (object.card) $('.head__title').append(' - ' + data.card.length);
        }, function (a, c) {
            _this.empty(network.errorDecode(a, c));
        }, false, {
            dataType: 'text'
        });
    }
    return this.render();
};

  	this.append = function (data, append) {
  		var _this1 = this;
  		var datas = Lampa.Arrays.isArray(data.card) ? data.card : Lampa.Arrays.getValues(data.card).reverse();
  		datas.forEach(function (element) {
  			var card = new Lampa.Card(element, {
  				card_category: object.sourc == 'pub' || object.sourc == 'filmix' || !object.card_cat || object.cards ? true : false,
  				card_collection: object.sourc == 'pub' || object.sourc == 'filmix' || !object.card_cat || object.cards ? false : true,
  				object: object
  			});
  			card.create();
  			if(object.category && (element.watch || element.quantity)) card.render().find('.card__view').append('<div style="background-color: rgba(0,0,0, 0.7);padding:.5em;position:absolute;border-radius:.3em;right:3;bottom:3">' + (element.watch || element.quantity) + '</div>');
  			card.onFocus = function (target, card_data) {
  				last = target;
  				scroll.update(card.render(), true);
  				Lampa.Background.change(card_data.img);
  				if (scroll.isEnd()) _this1.next(data.page);
  				if (!Lampa.Platform.tv() || !Lampa.Storage.field('light_version')) {
  					var maxrow = Math.ceil(items.length / 7) - 1;
  					//if (Math.ceil(items.indexOf(card) / 7) >= maxrow) _this1.next(data.page);
  				}
  			};
  			card.onEnter = function (target, card_data) {
  				last = target;
  				if (object.sour == 'rezka' || object.sour == 'filmix' || (Lampa.Storage.field('light_version') && !object.cards) && !object.card_cat || object.cards) {
  					Lampa.Api.search({
  						query: encodeURIComponent(element.title_org)
  					}, function (find) {
  						var finded = _this1.finds(element, find);
  						if (finded) {
  							Lampa.Activity.push({
  								url: '',
  								component: 'full',
  								id: finded.id,
  								method: finded.name ? 'tv' : 'movie',
  								card: finded
  							});
  						} else {
  							Lampa.Noty.show(Lampa.Lang.translate('nofind_movie'));
  							Lampa.Controller.toggle('content');
  						}
  					}, function () {
  						Lampa.Noty.show(Lampa.Lang.translate('nofind_movie'));
  						Lampa.Controller.toggle('content');
  					});
  				} else if (object.sourc == 'pub' || object.sourc == 'my_coll') {
  					Lampa.Activity.push({
  						title: element.title,
  						url: object.url + '/view?id=' + (object.sourc == 'my_coll' ? element.id : element.url) + '&access_token=' + Pub.token,
  						sourc: 'pub',
  						sour: element.source,
  						source: 'pub',
  						id: element.url,
  						card: element,
  						card_cat: true,
  						component: !object.category ? 'full' : 'collection',
  						page: 1
  					});
  				} else {
  					Lampa.Activity.push({
  						title: element.title,
  						url: element.url,
  						component: 'collection',
  						cards: true,
  						sourc: object.sourc,
  						source: object.source,
  						page: 1
  					});
  				}
  			};
  			card.onMenu = function (target, data) {
  				var _this2 = this;
  				var enabled = Lampa.Controller.enabled().name;
  				var status = Lampa.Favorite.check(data);
  				var items = [];
  				if (object.category) {
  					items.push({
  						title: cache['id_' + data.id] ? Lampa.Lang.translate('card_my_clear') : Lampa.Lang.translate('card_my_add'),
  						subtitle: Lampa.Lang.translate('card_my_descr'),
  						where: 'book'
  					});
  				} else {
  					items.push({
  						title: status.book ? Lampa.Lang.translate('card_book_remove') : Lampa.Lang.translate('card_book_add'),
  						subtitle: Lampa.Lang.translate('card_book_descr'),
  						where: 'book'
  					}, {
  						title: status.like ? Lampa.Lang.translate('card_like_remove') : Lampa.Lang.translate('card_like_add'),
  						subtitle: Lampa.Lang.translate('card_like_descr'),
  						where: 'like'
  					}, {
  						title: status.wath ? Lampa.Lang.translate('card_wath_remove') : Lampa.Lang.translate('card_wath_add'),
  						subtitle: Lampa.Lang.translate('card_wath_descr'),
  						where: 'wath'
  					}, {
  						title: status.history ? Lampa.Lang.translate('card_history_remove') : Lampa.Lang.translate('card_history_add'),
  						subtitle: Lampa.Lang.translate('card_history_descr'),
  						where: 'history'
  					});
  				}
  				Lampa.Select.show({
  					title: Lampa.Lang.translate('title_action'),
  					items: items,
  					onBack: function onBack() {
  						Lampa.Controller.toggle(enabled);
  					},
  					onSelect: function onSelect(a) {
  						if (a.where == 'clear') {
  							Lampa.Storage.set('my_col', '');
  							Lampa.Activity.push({
  								url: object.url,
  								sourc: object.sourc,
  								source: object.source,
  								title: object.title,
  								card_cat: true,
  								category: true,
  								component: 'collection',
  								page: 1
  							});
  							Lampa.Noty.show(Lampa.Lang.translate('saved_collections_clears'));
  						} else if (object.category) {
  							data.source = object.sourc;
  							_this1.favorite(data, card.render());
  						} else {
  							if (object.sour == 'filmix' || object.sour == 'rezka' || object.sourc == 'rezka' || object.sourc == 'filmix') {
  								Lampa.Api.search({
  									query: encodeURIComponent(data.title_org)
  								}, function (find) {
  									var finded = _this1.finds(data, find);
  									if (finded) {
  										finded.url = (finded.name ? 'tv' : 'movie') + '/' + finded.id;
  										Lampa.Favorite.toggle(a.where, finded);
  									} else {
  										Lampa.Noty.show(Lampa.Lang.translate('nofind_movie'));
  										Lampa.Controller.toggle('content');
  									}
  								}, function () {
  									Lampa.Noty.show(Lampa.Lang.translate('nofind_movie'));
  									Lampa.Controller.toggle('content');
  								});
  							} else {
  								data.source = object.source;
  								Lampa.Favorite.toggle(a.where, data);
  							}
  							_this2.favorite();
  						}
  						Lampa.Controller.toggle(enabled);
  					}
  				});
  			};
  			card.visible();
  			body.append(card.render());
  			if (cache['id_' + element.id]) _this1.addicon('book', card.render());
  			if (append) Lampa.Controller.collectionAppend(card.render());
  			items.push(card);
  		});
  	};
  	this.addicon = function (name, card) {
  		card.find('.card__icons-inner').append('<div class="card__icon icon--' + name + '"></div>');
  	};
  	this.favorite = function (data, card) {
  		var _this = this;
  		if (!cache['id_' + data.id]) {
  			cache['id_' + data.id] = data;
  			Lampa.Storage.set('my_col', cache);
  		} else {
  			delete cache['id_' + data.id];
  			Lampa.Storage.set('my_col', cache);
  			Lampa.Activity.push({
  				url: object.url,
  				sourc: object.sourc,
  				source: object.source,
  				title: object.title,
  				card_cat: true,
  				category: true,
  				component: 'collection',
  				page: 1
  			});
  		}
  		card.find('.card__icon').remove();
  		if (cache['id_' + data.id]) _this.addicon('book', card);
  	};
  	this.build = function (data) {
  		var _this1 = this;
  		if (data.card.length || Lampa.Arrays.getKeys(data.card).length) {

  			scroll.render().addClass('layer--wheight').data('mheight', info);
  			if (object.sourc == 'pub' && object.category) html.append(info);
  			html.append(scroll.render());
  			scroll.onEnd = function(){
  			  _this1.next(data.page);
  			}
  			this.append(data);
  	
  		//	if (Lampa.Platform.tv() && Lampa.Storage.field('light_version')) this.more(data);
  			scroll.append(body);
  			this.activity.loader(false);
  			this.activity.toggle();
  		} else {
  			html.append(scroll.render());
  			this.empty(object.search ? Lampa.Lang.translate('online_query_start') + ' (' + object.search + ') ' + Lampa.Lang.translate('online_query_end') : '');
  		}
  	};
  	this.empty = function (msg) {
  		var empty = msg == undefined ? new Lampa.Empty() : new Lampa.Empty({
  		  title: '',
  			descr: msg
  		});
  		html.append(empty.render());
  		_this1.start = empty.start;
  		_this1.activity.loader(false);
  		_this1.activity.toggle();
  	};
  	this.more = function (data) {
  		var _this = this;
  	//	var more = $('<div class="category-full__more selector"><span>' + Lampa.Lang.translate('show_more') + '</span></div>');
  	//	more.on('hover:focus hover:touch', function (e) {
  			Lampa.Controller.collectionFocus(last || false, scroll.render());
  			var next = Lampa.Arrays.clone(object);
  			if (data.total_pages == 0 || data.total_pages == undefined) {
  				more.remove();
  				return;
  			}
  			network.clear();
  			network.timeout(1000 * 20);
  			var url;
  			if (object.sourc == 'pub') url = object.url + '?page=' + data.page + '&sort=' + (object.sort ? object.sort : 'views-') + '&access_token=' + Pub.token;
  			else url = data.page;
  			network.silent(cors + url, function (result) {
  				var card = _this.card(result);
  				next.data = card;
  				if (object.cards) next.cards = false;
  				delete next.activity;
  				next.page++;
  				if (card.card.length == 0) more.remove();
  				else Lampa.Activity.push(next);
  			}, function (a, c) {
  				Lampa.Noty.show(network.errorDecode(a, c));
  			}, false, {
  				dataType: 'text'
  			});
  	//	});
  		body.append(more);
  	};
  	this.back = function () {
  		last = items[0].render()[0];
  		var more = $('<div class="selector" style="width: 100%; height: 5px"></div>');
  		more.on('hover:focus', function (e) {
  			if (object.page > 1) {
  				Lampa.Activity.backward();
  			} else {
  				Lampa.Controller.toggle('head');
  			}
  		});
  		body.prepend(more);
  	};
  	this.card = function (str) {
  		var card = [];
  		var page;
  		if (object.sourc != 'pub') str = str.replace(/\n/g, '');
		else if (object.card && object.card.source == 'filmix' || object.sourc == 'filmix') {
  			var d = $('.playlist-articles', str);
  			var str = d.length ? d.html() : $('.m-list-movie', str).html();
  			$(str).each(function (i, html) {
  				if (html.tagName == 'DIV') {
  					page = $(html).find('.next').attr('href');
  					total_pages = $(html).find('a:last-child').length;
  				}
  				if (html.tagName == 'ARTICLE') card.push({
  					id: $('a', html).attr('href').split('-')[0].split('/').pop(),
  					title: $('.m-movie-title', html).text() || ($('.poster', html).attr('alt') && $('.poster', html).attr('alt').split(',').shift()),
  					title_org: $('.m-movie-original', html).text() || $('.origin-name', html).text(),
  					url: $('a', html).attr('href'),
  					img: $('img', html).attr('src'),
  					quantity: $('.m-movie-quantity', html).text() || $('.count', html).text(),
  					year: $('.grid-item', html).text() || ($('.poster', html).attr('alt') && $('.poster', html).attr('alt').split(',').pop())
  				});
  			});
  		} else if (object.card && object.card.source == 'pub' || object.sourc == 'pub') {
  			str = JSON.parse(str);
  			if (str.pagination) {
  				total_pages = str.pagination.total + 1;
  				page = str.pagination.current + 1;
  			}
  			if (str.items) str.items.forEach(function (element) {
  				card.push({
  					url: element.id,
  					id: element.id,
  				
  					title: element.title.split('/')[0],
  					original_title: element.title.split('/')[1] || element.title,
  					release_date: (element.year ? element.year + '' : element.years ? element.years[0] + '' : '0000'),
  					first_air_date: element.type && (element.type.match('serial|docuserial|tvshow') ? 'tv' : '') || '',
  					vote_average: element.imdb_rating || 0,
  					img: element.posters.big,
  					year: element.year,
  					years: element.years
  				});
  			});
  		}
  		return {
  			card: card,
  			page: page,
  			total_pages: total_pages
  		};
  	};
  	this.finds = function (element, find) {
  		var finded;
  		var filtred = function filtred(items) {
  			for (var i = 0; i < items.length; i++) {
  				var item = items[i];
  				if ((element.title_org == (item.original_title || item.original_name) || element.title == (item.title || item.name)) && (item.first_air_date || item.release_date) && parseInt(element.year) == (item.first_air_date || item.release_date).split('-').shift()) {
  					finded = item;
  					break;
  				}
  			}
  		};
  		if (find.movie && find.movie.results.length) filtred(find.movie.results);
  		if (find.tv && find.tv.results.length && !finded) filtred(find.tv.results);
  		return finded;
  	};
  	this.start = function () {
  		Lampa.Controller.add('content', {
  			toggle: function toggle() {
  				Lampa.Controller.collectionSet(scroll.render(), info);
  				Lampa.Controller.collectionFocus(last || false, scroll.render());
  			},
  			left: function left() {
  				if (Navigator.canmove('left')) Navigator.move('left');
  				else Lampa.Controller.toggle('menu');
  			},
  			right: function right() {
  				Navigator.move('right');
  			},
  			up: function up() {
  				if (Navigator.canmove('up')) Navigator.move('up');
  				else Lampa.Controller.toggle('head');
  			},
  			down: function down() {
  				if (Navigator.canmove('down')) Navigator.move('down');
  			},
  			back: function back() {
  				Lampa.Activity.backward();
  			}
  		});
  		Lampa.Controller.toggle('content');
  	};
  	this.pause = function () {};
  	this.stop = function () {};
  	this.render = function () {
  		return html;
  	};
  	this.destroy = function () {
  		network.clear();
  		Lampa.Arrays.destroy(items);
  		scroll.destroy();
  		html.remove();
  		body.remove();
  		network = null;
  		items = null;
  		html = null;
  		body = null;
  		info = null;
  	};
  }
	
	
	function startFilmixPlugin() {
		window.plugin_lmp = true;
        manifest = {};
    	Lampa.Manifest.plugins = manifest;
    	if (!Lampa.Lang) {
			var lang_data = {};
			Lampa.Lang = {
				add: function (data) {
					lang_data = data;
				},
				translate: function (key) {
					return lang_data[key] ? lang_data[key].ru : key;
				}
			}
		}
		Lampa.Lang.add({
	pub_sort_views: {
    		ru: 'По просмотрам',
    	},
    	pub_sort_watchers: {
    		ru: 'По подпискам',
    	},
    	pub_sort_updated: {
    		ru: 'По обновлению',
    	},
    	pub_sort_created: {
    		ru: 'По дате добавления',
    	},
    	pub_search_coll: {
    		ru: 'Поиск по подборкам',
    	},
    	pub_title_all: {
    		ru: 'Все',
    	},
    	pub_title_popular: {
    		ru: 'Популярные',
    	},
    	pub_title_new: {
    		ru: 'Новые',
    	},
    	pub_title_hot: {
    		ru: 'Горячие',
    	},
    	pub_title_fresh: {
    		ru: 'Свежие',
    	},
    	pub_title_rating: {
    		ru: 'Рейтинговые',
    	},
    	pub_title_allingenre: {
    		ru: 'Всё в жанре',
    	},
    	pub_title_popularfilm: {
    		ru: 'Популярные фильмы',
    	},
    	pub_title_popularserial: {
    		ru: 'Популярные сериалы',
    	},
    	pub_title_newfilm: {
    		ru: 'Новые фильмы',
    	},
    	pub_title_newserial: {
    		ru: 'Новые сериалы',
    	},
    	pub_title_newconcert: {
    		ru: 'Новые концерты',
    	},
    	pub_title_newdocfilm: {
    		ru: 'Новые док. фильмы',
    	},
    	pub_title_newdocserial: {
    		ru: 'Новые док. сериалы',
    	},
    	pub_title_newtvshow: {
    		ru: 'Новое ТВ шоу',
    	},
    	
    });
	 
		function add() {
			Lmp.init();
			
		}
		
		if (window.appready) add();else {
			Lampa.Listener.follow('app', function (e) {
				if (e.type == 'ready') add();
			});
    	}
		
		function url$2(u) {
			var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			u = (u == 'undefined' ? '' : u)
			if (params.genres) u = 'catalog' +add$5(u, 'orderby=date&orderdir=desc&filter=s996-' + params.genres.replace('f','g'));
			if (params.page) u = add$5(u, 'page=' + params.page);
			if (params.query) u = add$5(u, 'story=' + params.query);
			if (params.type) u = add$5(u, 'type=' + params.type);
			if (params.field) u = add$5(u, 'field=' + params.field);
			if (params.perpage) u = add$5(u, 'perpage=' + params.perpage);
			u = add$5(u, Filmix.user_dev + Lampa.Storage.get('filmix_token', 'aaaabbbbccccddddeeeeffffaaaabbbb'));
			if (params.filter) {
				for (var i in params.filter) {
					u = add$5(u, i + '=' + params.filter[i]);
				}
			}
			return Filmix.api_url + u;
		}
		function add$5(u, params) {
			return u + (/\?/.test(u) ? '&' : '?') + params;
		}
		function get$7(method, call) {
			var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			var oncomplite = arguments.length > 2 ? arguments[2] : undefined;
			var onerror = arguments.length > 3 ? arguments[3] : undefined;
			var u = url$2(method, params);
			Filmix.network["native"](u, function (json) {
				json.url = method;
				oncomplite(json);
			}, onerror);
		}
		function tocardf(element, type) {
			return {
				url: '',
				id: element.id,
				type: type || (((element.serial_stats && element.serial_stats.post_id) || (element.last_episode && element.last_episode.post_id)) ? 'tv' : 'movie'),
				source: 'filmix',
				quality: element.quality && element.quality.split(' ').shift() || '',
				title: element.title,
				original_title: element.original_title || element.title,
				release_date: (element.year || element.date && element.date.split(' ')[2] || '0000'),
				first_air_date: (type == 'tv' || ((element.serial_stats && element.serial_stats.post_id) || (element.last_episode && element.last_episode.post_id))) ? element.year : '',
				img: element.poster,
				cover: element.poster,
				background_image: element.poster,
        vote_average: parseFloat(element.kp_rating || '0.0').toFixed(1),
        imdb_rating: parseFloat(element.imdb_rating || '0.0').toFixed(1),
        kp_rating: parseFloat(element.kp_rating || '0.0').toFixed(1),
				year: element.year
			};
		}
		function list$3(params, oncomplite, onerror) {
			var page = 2;
			var url = url$2(params.url, params);
			Filmix.network["native"](url, function (json) {
				var items = [];
				if (json) {
					json.forEach(function (element) {
						items.push(tocardf(element));
					});
				}
				oncomplite({
					results: items,
					page: page,
					total_pages: 50
				});
				page++
			}, onerror);
		}
		function main$1(params, oncomplite, onerror) {
		  var source = [{
		    title: 'title_now_watch',
		    url: 'top_views'
		  }, {
		    title: 'title_new', 
		    url: 'catalog?orderby=date&orderdir=desc'
		  }, {
		    title: 'title_new_this_year', 
		    url: 'catalog?orderby=year&orderdir=desc'
		  }, {
		    title: 'pub_title_newfilm', 
		    url: 'catalog?orderby=date&orderdir=desc&filter=s0'
		  }, {
		    title: '4K', 
		    url: 'catalog?orderby=date&orderdir=desc&filter=s0-q4'
		  }, {
		    title: 'pub_title_popularfilm', 
		    url: 'popular'
		  }, {
		    title: 'pub_title_popularserial', 
		    url: 'popular?section=7'
		  }, {
		    title: 'title_in_top', 
		    url: 'catalog?orderby=rating&orderdir=desc'
		  }];
			var status = new Lampa.Status(Lampa.Arrays.getKeys(source).length);
			status.onComplite = function () {
				var fulldata = [];
				var data = status.data;
				source.forEach(function (q) {
          if (status.data[q.title] && status.data[q.title].results.length) {
            fulldata.push(status.data[q.title]);
          }
        });
				if (fulldata.length) oncomplite(fulldata);
				else onerror();
			};
			var append = function append(title, name, json) {
				json.title = title;
				var data = [];
				json.forEach(function (element) {
					data.push(tocardf(element));
				});
      	json.results = data;
				status.append(name, json);
			};
      source.forEach(function (q) {
			  get$7(q.url, params, function (json) {
          append(Lampa.Lang.translate(q.title), q.title, json);
        }, status.error.bind(status));
      });
		}
		function category$2(params, oncomplite, onerror) {
			var books = Lampa.Favorite.continues(params.url);
			var type = params.url == 'tv' ? 7 : 0;
			var source = [{
		    title: 'title_new_this_year',
		    url: 'catalog?orderby=year&orderdir=desc&filter=s'+type
		  }, {
		    title: 'title_new', 
		    url: 'catalog?orderby=date&orderdir=desc&filter=s'+type
		  }, {
		    title: 'title_popular', 
		    url: 'popular?section='+type
		  }, {
		    title: 'title_in_top', 
		    url: 'catalog?orderby=rating&orderdir=desc&filter=s'+type
		  }];
			var status = new Lampa.Status(Lampa.Arrays.getKeys(source).length);
			status.onComplite = function () {
				var fulldata = [];
				var data = status.data;
				if (books.length) fulldata.push({
					results: books,
					title: params.url == 'tv' ? Lampa.Lang.translate('title_continue') : Lampa.Lang.translate('title_watched')
				});
				source.forEach(function (q) {
          if (data[q.title] && data[q.title].results.length) {
            fulldata.push(data[q.title]);
          }
        });
				if (fulldata.length) oncomplite(fulldata);
				else onerror();
			};
			var append = function append(title, name, json) {
				json.title = title;
				var data = [];
				json.forEach(function (element) {
					data.push(tocardf(element, params.url));
				});
				json.results = data;
				status.append(name, json);
			};
      source.forEach(function (q) {
			  get$7(q.url, params, function (json) {
          append(Lampa.Lang.translate(q.title), q.title, json);
        }, status.error.bind(status));
      });
		}
		function full$2(params, oncomplite, onerror) {
			var status = new Lampa.Status(5);
			status.onComplite = oncomplite;
			var url = 'post/' + params.id;
			get$7(url, params, function (json) {
				json.source = 'filmix';
				var data = {};
				var element = json;
			
				var similars = [];
				if (json.relates) {
					for (var i in json.relates) {
						var item = json.relates[i];
						similars.push(tocardf(item));
					}
					status.append('simular', {
						results: similars
					});
				}
			
				data.movie = {
					id: element.id,
					url: url,
					type: Lampa.Arrays.getValues(element.player_links.playlist).length ? 'tv' : 'movie',
					source: 'filmix',
					title: element.title,
					original_title: element.original_title,
					name: Lampa.Arrays.getValues(element.player_links.playlist).length ? element.title : '',
					original_name: Lampa.Arrays.getValues(element.player_links.playlist).length ? element.original_title : '',
					overview: element.short_story.replace(/\[n|r|t]/g, ''),
					img: element.poster,
					runtime: (element.duration || 0),
					genres: genres$2(element),
					vote_average: parseFloat(element.imdb_rating || element.kp_rating || '0'),
					production_companies: [],
					production_countries: countries2(element.countries),
					budget: element.budget || 0,
					release_date: element.year || element.date.split(' ')[2] || '0000',
					seasons: Lampa.Arrays.getValues(element.player_links.playlist).filter(function (el){
					  el.episode_count = 1;
					  return el
					}),
					quality: element.rip && element.rip.split(' ').shift() || '',
					number_of_seasons: Lampa.Arrays.getValues(element.player_links.playlist).length || '',
					number_of_episodes: element.last_episode && element.last_episode.episode || '',
					first_air_date: Lampa.Arrays.getValues(element.player_links.playlist).length ? element.year || element.date_atom || '0000' : '', 
					background_image: element.poster,
          imdb_rating: parseFloat(element.imdb_rating || '0.0').toFixed(1),
          kp_rating: parseFloat(element.kp_rating || '0.0').toFixed(1),
     		};
				get$7('comments/' + element.id, params, function (json) {
					var comments = [];
					if (json) {
						json.forEach(function(com) {
							com.text = com.text.replace(/\[n|r|t]/g, '');
							com.like_count = '';
							comments.push(com);
						});
						status.append('comments', comments);
						$('.full-review__footer', Lampa.Activity.active().activity.render()).hide();
					}
				}, onerror);
     		status.append('persons', persons2(json));
				status.append('movie', data.movie);
				status.append('videos', videos2(element.player_links));			
			}, onerror);
		}
		function menu$2(params, oncomplite) {
  		var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
      if (menu_list.length) oncomplite(menu_list);else {
        var us = url$2('filter_list', params);
        var u = url$2('category_list', params);
        Filmix.network["native"](u, function (j) {
          Lampa.Arrays.getKeys(j).forEach(function (g) {
            menu_list.push({
              title: j[g],
              id: g
            });
          });
          console.log (menu_list)
          oncomplite(menu_list);
        });
      }
		}
		function seasons$1(tv, from, oncomplite) {
			Lampa.Api.sources.tmdb.seasons(tv, from, oncomplite);
		}
		function formatDate(dateString) {
      var months = [
        { name: 'января', number: '01' },
        { name: 'февраля', number: '02' },
        { name: 'марта', number: '03' },
        { name: 'апреля', number: '04' },
        { name: 'мая', number: '05' },
        { name: 'июня', number: '06' },
        { name: 'июля', number: '07' },
        { name: 'августа', number: '08' },
        { name: 'сентября', number: '09' },
        { name: 'октября', number: '10' },
        { name: 'ноября', number: '11' },
        { name: 'декабря', number: '12' }
      ];
    
      var parts = dateString.split(' ');
      var day = parts[0];
      var monthName = parts[1];
      var year = parts[2];
      
      var monthNumber;
      for (var i = 0; i < months.length; i++) {
        if (months[i].name === monthName) {
          monthNumber = months[i].number;
          break;
        }
      }
      
      var formattedDate = year + '-' + monthNumber + '-' + day;
      return formattedDate;
    }
		function person$3(params, oncomplite, onerror) {
			var u = url$2('person/'+params.id, params);
			Filmix.network["native"](u, function (json, all) {
				var data = {};
				if (json) {
					data.person = {
						id: params.id,
						name: json.name,
						biography: json.about,
						img: json.poster,
						place_of_birth: json.birth_place,
						birthday: formatDate(json.birth)
					};
					var similars = [];
					for (var i in json.movies) {
						var item = json.movies[i];
						similars.push(tocardf(item));
					}
					data.credits = {
						movie: similars,
						knownFor: [{
						  name: json.career, 
						  credits: similars
						}]
					};
				}
				oncomplite(data);
			}, onerror);
		}
		function clear$4() {
			Filmix.network.clear();
		}
		function videos2(element) {
			var data = [];
			if (element.trailer.length) {
				element.trailer.forEach(function (el){
  				var qualities = el.link.match(/\[(.*?)\]/);
  			  qualities = qualities[1].split(',').filter(function (quality){
            if (quality === '') return false
            return true
          }).sort(function (a, b) {
            return b - a
          }).map(function (quality) {
            data.push({
    					name: el.translation+' '+quality+'p',
    					url: el.link.replace(/\[(.*?)\]/, quality),
    					player: true
    				});
          });
				});
			}
			return data.length ? {
				results: data
			} : false;
		}
		function persons2(json) {
			var data = [];
			if (json.actors) {
				json.found_actors.filter(function (act){
					data.push({
						name: act.name,
						id: act.id,
						character: Lampa.Lang.translate('title_actor'),
					});
				});
			}
			return data.length ? {
				cast: data
			} : false;
		}
		function genres$2(element) {
			var data = [];
			var u = url$2('category_list');
      Filmix.network["native"](u, function (j) {
  			element.categories.forEach(function (name, i) {
  				if (name) {
            var _id = Object.entries(j).find(function (g) {
              return g[1] == name
            });
  				 	data.push({
  						id: _id && _id[0] || '',
  						name: name
  					});
  				}
  			});
      });
			return data;
		}
		function countries2(element) {
			var data = [];
			if (element) {
				element.forEach(function (el) {
  				data.push({
  					name: el
  				});
				});
			}
			return data;
		}
		function search$4() {
			var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			var oncomplite = arguments.length > 1 ? arguments[1] : undefined;
			var status = new Lampa.Status(2);
			status.onComplite = function (data) {
				var items = [];
				if (data.movie && data.movie.results.length) items.push(data.movie);
				if (data.tv && data.tv.results.length) items.push(data.tv);
				oncomplite(items);
			};
			get$7('search', params, function (json) {
				var items = [];
				var itemss = [];
				if (json) {
					json.forEach(function (element) {
						if(element, element.last_episode && element.last_episode.season || element.serial_stats && element.serial_stats.status) itemss.push(tocardf(element, element.last_episode && element.last_episode.season || element.serial_stats && element.serial_stats.status ? 'tv' : 'movie'));
						else items.push(tocardf(element, element.last_episode && element.last_episode.season || element.serial_stats && element.serial_stats.status ? 'tv' : 'movie'));
					});
					var movie = {
						results: items,
						page: 1,
						total_pages: 1,
						total_results: json.length,
						title: Lampa.Lang.translate('menu_movies') +' ('+items.length+')',
						type: 'movie'
					};
					status.append('movie', movie);
					var tv = {
						results: itemss,
						page: 1,
						total_pages: 1,
						total_results: json.length,
						title: Lampa.Lang.translate('menu_tv') +' ('+itemss.length+')',
						type: 'tv'
					};
					status.append('tv', tv);
				}
			}, status.error.bind(status));
		}
		function discovery$1() {
			return {
				title: 'FILMIX',
				search: search$4,
				params: {
					align_left: true,
					object: {
						source: 'filmix'
					}
				},
				onMore: function onMore(params) {
					Lampa.Activity.push({
						url: 'search',
						title: Lampa.Lang.translate('search') + ' - ' + params.query,
						component: 'category_full',
						query: encodeURIComponent(params.query),
						source: 'filmix'
					});
				},
				onCancel: Pub.network.clear.bind(Pub.network)
			};
		}
		var FILMIX = {
			main: main$1,
			menu: menu$2,
			full: full$2,
			search: search$4,
			person: person$3,
			list: list$3,
			seasons: seasons$1,
			category: category$2,
			clear: clear$4,
			discovery: discovery$1
		};
		Lampa.Api.sources.filmix = FILMIX;
		
	
		
	}
	if (!window.plugin_lmp) startFilmixPlugin();
	
})();


