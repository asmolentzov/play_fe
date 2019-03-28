/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	var trackObjArray = []; // This file is in the entry point in your webpack config.


	var DOMstrings = {
	  searchButton: '#search-btn',
	  searchField: '#search-field',
	  searchResults: '#search-results',
	  searchedArtist: '#searched-artist',
	  favoriteStar: '.favorite-star',
	  favoritesList: '#favorites-list',
	  favoriteRemove: '.remove-btn',
	  playlistsList: '#playlists-list',
	  playlistsSongsList: '#playlists-songs-list',
	  accordion: '.accordion',
	  addPlaylistBtn: '#add-playlist',
	  addPlaylistForm: '#playlist-title',
	  updatePlaylistBtn: '#update-playlist',
	  updatePlaylistForm: '#update-playlist-title'
	};

	function Track(id, trackName, trackRating, artistName) {
	  this.id = id;
	  this.trackName = trackName;
	  this.trackRating = trackRating || 0;
	  this.artistName = artistName;
	}

	document.querySelector(DOMstrings.searchButton).addEventListener('click', function (event) {
	  event.preventDefault();
	  clearSearchResults();
	  var artist = document.querySelector(DOMstrings.searchField).value;
	  var url = 'https://api.musixmatch.com/ws/1.1/track.search?apikey=' + ("9302d850b2e7482086fc55e45817a515") + '&q_artist=' + artist;
	  $.ajax({
	    data: {
	      format: 'jsonp',
	      callback: 'jsonp_callback'
	    },
	    url: url,
	    dataType: 'jsonp',
	    jsonpCallback: 'jsonp_callback',
	    success: function success(data) {
	      var tracks = data.message.body.track_list;
	      var artistHtml = '<h3>' + artist.toUpperCase() + '</h3>';
	      var trackHtml = '<li>%trackName% <img src="./empty-star.png" alt="favorite" class="favorite-star"></li>';
	      document.querySelector(DOMstrings.searchedArtist).insertAdjacentHTML('beforeend', artistHtml);
	      makeTrackArray(tracks, artist);
	      trackObjArray.forEach(function (track) {
	        var newTrackHtml = trackHtml.replace('%trackName%', track.trackName);
	        document.querySelector(DOMstrings.searchResults).insertAdjacentHTML('beforeend', newTrackHtml);
	      });
	    }
	  });
	  resetSearchField();
	});

	function makeTrackArray(trackData, artistData) {
	  trackData.forEach(function (track) {
	    trackObjArray.push(new Track(track.track.track_id, track.track.track_name, track.track.track_rating, artistData));
	  });
	  return trackObjArray;
	}

	document.querySelector(DOMstrings.searchResults).addEventListener('click', function (event) {
	  event.target.src = "./filled-star.png";
	  var songTitle = event.path[1];
	  var listOfSongs = Array.from(event.path[2].children);
	  var chosenSongIndex = listOfSongs.findIndex(function (k) {
	    return k == songTitle;
	  });
	  fetch('https://morning-island-25788.herokuapp.com/api/v1/favorites', {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({
	      favorites: {
	        id: trackObjArray[chosenSongIndex].id,
	        name: trackObjArray[chosenSongIndex].trackName,
	        rating: trackObjArray[chosenSongIndex].trackRating,
	        artist_name: trackObjArray[chosenSongIndex].artistName,
	        genre: 'pop' }
	    })
	  }).then(function (res) {
	    return res.json();
	  }).then(function (response) {
	    return appendFavorites(response[0]);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	});

	function appendFavorites(favorite) {
	  var favoriteHtml = '<li id="' + favorite.id + '">' + favorite.name + ' <br> By: ' + favorite.artist_name + '<br> Rating: ' + favorite.rating + '<button class="add-btn btn" id="add-' + favorite.id + '">Add to Playlist</button> <button class="remove-btn btn" id="remove-' + favorite.id + '">Remove</button></li>';
	  document.querySelector(DOMstrings.favoritesList).insertAdjacentHTML('beforeend', favoriteHtml);
	}

	(function () {
	  fetch('https://morning-island-25788.herokuapp.com/api/v1/favorites').then(function (response) {
	    return response.json();
	  }).then(function (favorites) {
	    return postFavorites(favorites);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	})();

	function postFavorites(favorites) {
	  favorites.forEach(function (favorite) {
	    var favoriteHtml = '<li id="' + favorite.id + '">' + favorite.name + ' <br> By: ' + favorite.artist_name + '<br> Rating: ' + favorite.rating + '<button class="add-btn btn" id="add-' + favorite.id + '">Add to Playlist</button> <button class="remove-btn btn" id="remove-' + favorite.id + '">Remove</button></li>';
	    document.querySelector(DOMstrings.favoritesList).insertAdjacentHTML('beforeend', favoriteHtml);
	  });
	};

	(function () {
	  fetch('https://morning-island-25788.herokuapp.com/api/v1/playlists').then(function (response) {
	    return response.json();
	  }).then(function (playlists) {
	    return listPlaylists(playlists);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	})();

	function playlistTotalRating(playlist) {
	  return playlist.favorites.reduce(function (accumulator, favorite) {
	    return accumulator + favorite.rating;
	  }, 0);
	};

	function listPlaylists(playlists) {
	  var sortedPlaylists = playlists.sort(function (playlist1, playlist2) {
	    var songTotal1 = playlistTotalRating(playlist1);
	    var songTotal2 = playlistTotalRating(playlist2);
	    return songTotal1 / playlist1.favorites.length - songTotal2 / playlist2.favorites.length;
	  }).reverse();
	  sortedPlaylists.forEach(function (playlist, index) {
	    var playlistHtml = '<button class="remove-btn btn" id="remove-' + playlist.playlist_name + '">Remove</button><button class="accordion" id="playlist-' + playlist.id + '">' + playlist.playlist_name + '</button><div class="panel" id="songs-panel-' + playlist.id + '"></div>';
	    document.querySelector(DOMstrings.playlistsList).insertAdjacentHTML('beforeend', playlistHtml);
	    listSongs(playlist.favorites, playlist.id);
	  });
	};

	function listSongs(songs, playlist) {
	  songs.forEach(function (song) {
	    var songHtml = '<div class="playlist-song" id="' + song.id + '">' + song.name + '<br>Artist: ' + song.artist_name + '<br>Rating: ' + song.rating + '</div>';
	    document.getElementById('songs-panel-' + playlist).insertAdjacentHTML('beforeend', songHtml);
	  });
	}

	document.querySelector(DOMstrings.favoritesList).addEventListener('click', function (event) {
	  if (event.target.className === 'add-btn btn' && document.querySelector('.active')) {
	    var rawHtml = event.path[1].innerHTML;
	    var favoriteId = parseInt(event.path[1].id);
	    var playlistId = document.querySelector('.active').id;
	    getCleanFavorite(favoriteId, rawHtml, playlistId);
	  }
	});

	document.querySelector(DOMstrings.addPlaylistBtn).addEventListener('click', function (event) {
	  var newPlaylistTitle = document.querySelector(DOMstrings.addPlaylistForm).value;
	  if (newPlaylistTitle) {
	    fetch('https://morning-island-25788.herokuapp.com/api/v1/playlists', {
	      method: 'POST',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify({
	        playlists: {
	          playlist_name: newPlaylistTitle
	        }
	      })
	    }).then(function (res) {
	      return res.json();
	    }).then(function (response) {
	      return appendPlaylistList(response[0]);
	    }).catch(function (error) {
	      return console.error({ error: error });
	    });
	  }
	});

	document.querySelector(DOMstrings.updatePlaylistBtn).addEventListener('click', function (event) {
	  var activePlaylistRaw = document.querySelector('.active');
	  var activePlaylistId = activePlaylistRaw.id.split('-');
	  var newPlaylistTitle = document.querySelector(DOMstrings.updatePlaylistForm).value;

	  if (newPlaylistTitle) {
	    fetch('http://localhost:3000/api/v1/playlists/' + activePlaylistId[1], {
	      method: 'PUT',
	      headers: { 'Content-Type': 'application/json' },
	      body: JSON.stringify({
	        playlists: {
	          playlist_name: newPlaylistTitle
	        }
	      })
	    }).then(function (res) {
	      return res.json();
	    }).then(function (response) {
	      return appendPlaylistList(response[0]);
	    }).catch(function (error) {
	      return console.error({ error: error });
	    });
	  }
	});

	function appendPlaylistList(playlist) {
	  var playlistHtml = '<button class="remove-btn btn" id="remove-' + playlist.playlist_name + '">Remove</button><button class="accordion" id="playlist-' + playlist.id + '">' + playlist.playlist_name + '</button><div class="panel" id="songs-panel-' + playlist.id + '"></div>';
	  document.querySelector(DOMstrings.playlistsList).insertAdjacentHTML('beforeend', playlistHtml);
	}

	function getCleanFavorite(id, rawHtml, playlistId) {
	  var songRaw = void 0,
	      newSongRaw = void 0,
	      cleanPlaylistId = void 0;
	  songRaw = rawHtml.split('<');
	  newSongRaw = songRaw[0] + songRaw[1] + songRaw[2];
	  newSongRaw = newSongRaw.replace(' br> By: ', ',');
	  newSongRaw = newSongRaw.replace('br> Rating: ', ',');
	  newSongRaw = newSongRaw.split(',');
	  cleanPlaylistId = parseInt(playlistId.split('-')[1]);
	  appendPlaylist(id, newSongRaw[0], newSongRaw[1], newSongRaw[2], cleanPlaylistId);
	}

	function appendPlaylist(id, name, artistName, rating, playlistId) {
	  var newSongHtml = '<div class="playlist-song" id="' + id + '">' + name + '<br>Artist: ' + artistName + '<br>Rating: ' + rating + '</div>';
	  document.getElementById('songs-panel-' + playlistId).insertAdjacentHTML('beforeend', newSongHtml);
	  postFavoriteToPlaylist(id, playlistId);
	}

	function postFavoriteToPlaylist(favoriteSongId, playlistId) {
	  fetch('https://morning-island-25788.herokuapp.com/api/v1/playlists/' + playlistId + '/favorites/' + favoriteSongId, {
	    method: 'POST',
	    headers: { 'Content-Type': 'application/json' },
	    body: JSON.stringify({
	      playlist_favorites: {
	        playlist_id: playlistId,
	        favorite_id: favoriteSongId
	      }
	    })
	  }).then(function () {
	    return console.log('Song has been added');
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	}

	document.querySelector(DOMstrings.playlistsList).addEventListener('click', function (event) {
	  if (event.target.className === 'accordion' || event.target.className === 'accordion active') {
	    if (document.querySelector('.active')) {
	      var oldSelection = document.querySelector('.active');
	      oldSelection.classList.remove("active");
	      oldSelection.nextElementSibling.style.display = "none";
	      event.target.classList.toggle("active");
	    } else {
	      event.target.classList.toggle("active");
	    }

	    var panel = event.target.nextElementSibling;
	    if (panel.style.display === "block") {
	      panel.style.display = "none";
	    } else {
	      panel.style.display = "block";
	    }
	  } else if (event.target.className === "remove-btn btn") {
	    var playlistRaw = event.target.nextElementSibling;
	    var playlistId = playlistRaw.id.split('-');

	    if (playlistId) {
	      fetch('http://localhost:3000/api/v1/playlists/' + playlistId[1], {
	        method: 'DELETE',
	        headers: { 'Content-Type': 'application/json' }
	      }).catch(function (error) {
	        return console.error({ error: error });
	      });
	    }
	  }
	});

	function resetSearchField() {
	  document.querySelector(DOMstrings.searchField).value = "";
	  document.querySelector(DOMstrings.searchField).focus();
	}

	function clearSearchResults() {
	  document.querySelector(DOMstrings.searchResults).innerHTML = "";
	  document.querySelector(DOMstrings.searchedArtist).innerHTML = "";
	  if (trackObjArray !== undefined) {
	    trackObjArray = [];
	  }
	}

	document.getElementById('favorites-list').addEventListener('click', removeFavorite);

	function removeFavorite(event) {
	  if (event.target.innerHTML === "Remove") {
	    var favoriteId = event.target.id.split('-')[1];
	    fetch('https://morning-island-25788.herokuapp.com/api/v1/favorites/' + favoriteId, {
	      method: 'DELETE'
	    }).then().catch(function (error) {
	      console.error({ error: error });
	    });
	    event.target.parentElement.remove();
	  };
	};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/index.js!./styles.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/index.js!./styles.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box; }\n\nbody {\n  font-family: 'Fira Sans', sans-serif;\n  color: #131b23;\n  background-image: linear-gradient(#e9f1f7, #2274a5);\n  min-height: 100vh; }\n\nul {\n  list-style: none; }\n\nli {\n  padding: 0.5rem; }\n\n.favorite-star {\n  height: 5vh; }\n\n.search-form {\n  min-height: 10rem;\n  padding: 6rem;\n  display: flex;\n  flex-direction: column; }\n  .search-form h3, .search-form form {\n    margin: 0 auto; }\n\n.playlist-fields {\n  display: flex;\n  justify-content: flex-end;\n  margin: 0 2rem 1rem 0; }\n\n.playlist-field-holder {\n  display: flex;\n  flex-direction: column; }\n\n.new-playlist, .update-active-playlist {\n  display: flex;\n  padding: 10px; }\n  .new-playlist input, .update-active-playlist input {\n    margin-right: 10px;\n    width: 12rem; }\n\n.info-container {\n  display: flex;\n  justify-content: space-around; }\n\n.box {\n  min-height: 50vh;\n  width: 30vw;\n  background: rgba(19, 27, 35, 0.8);\n  color: #e9f1f7;\n  padding: 2rem; }\n  .box h2 {\n    color: #e7dfc6; }\n\n#search-results {\n  overflow: auto;\n  scroll-behavior: smooth; }\n\n.accordion {\n  background-color: #e7dfc6;\n  color: #black;\n  cursor: pointer;\n  padding: 18px;\n  width: 100%;\n  text-align: left;\n  border: none;\n  outline: none;\n  transition: 0.4s; }\n\n.active, .accordion:hover {\n  background-color: #816c61; }\n\n.panel {\n  padding: 0 18px;\n  background-color: #e9f1f7;\n  display: none;\n  overflow: hidden;\n  color: #131b23; }\n\n.playlist-song {\n  padding: 10px; }\n\n.btn {\n  margin: 3px;\n  padding: 3px;\n  float: right;\n  font-size: xx-small;\n  background-color: #e7dfe6;\n  border: none; }\n\n#playlists-list {\n  overflow: auto;\n  scroll-behavior: smooth; }\n", ""]);

	// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ })
/******/ ]);