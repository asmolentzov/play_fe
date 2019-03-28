// This file is in the entry point in your webpack config.
import './styles.scss';
let trackObjArray = [];

const DOMstrings = {
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
  addPlaylistForm: '#playlist-title'
}

function Track(id, trackName, trackRating, artistName) {
  this.id = id;
  this.trackName = trackName;
  this.trackRating = trackRating || 0;
  this.artistName = artistName;
}

document.querySelector(DOMstrings.searchButton).addEventListener('click', function(event) {
  event.preventDefault();
  clearSearchResults();
  const artist = document.querySelector(DOMstrings.searchField).value;
  const url = `https://api.musixmatch.com/ws/1.1/track.search?apikey=${process.env.MUSIXMATCH_API_KEY}&q_artist=${artist}`
  $.ajax({
    data: {
      format: 'jsonp',
      callback: 'jsonp_callback'
    },
    url: url,
    dataType: 'jsonp',
    jsonpCallback: 'jsonp_callback',
    success: function(data) {
      const tracks = data.message.body.track_list
      const artistHtml = `<h3>${artist.toUpperCase()}</h3>`
      const trackHtml = `<li>%trackName% <img src="./empty-star.png" alt="favorite" class="favorite-star"></li>`
      document.querySelector(DOMstrings.searchedArtist).insertAdjacentHTML('beforeend', artistHtml)
      makeTrackArray(tracks, artist);
      trackObjArray.forEach(track => {
        let newTrackHtml = trackHtml.replace('%trackName%', track.trackName)
        document.querySelector(DOMstrings.searchResults).insertAdjacentHTML('beforeend', newTrackHtml)
      })
    }
  })
  resetSearchField();
});

function makeTrackArray(trackData, artistData) {
  trackData.forEach(track => {
    trackObjArray.push(new Track(track.track.track_id, track.track.track_name, track.track.track_rating, artistData))
  });
  return trackObjArray;
}

document.querySelector(DOMstrings.searchResults).addEventListener('click', function(event) {
    event.target.src = "./filled-star.png";
    var songTitle = event.path[1];
    var listOfSongs = Array.from(event.path[2].children);
    var chosenSongIndex = listOfSongs.findIndex(k => k == songTitle);
    fetch(`http://localhost:3000/api/v1/favorites`, {
      method: 'POST',
      headers: { 'Content-Type':
        'application/json'},
      body: JSON.stringify({
        favorites:{
            id: trackObjArray[chosenSongIndex].id,
            name: trackObjArray[chosenSongIndex].trackName,
            rating: trackObjArray[chosenSongIndex].trackRating,
            artist_name: trackObjArray[chosenSongIndex].artistName,
            genre: 'pop'}
          })
        })
        .then(res => res.json())
        .then(response => appendFavorites(response[0]))
        .catch(error => console.error({ error }));
});

function appendFavorites(favorite) {
  const favoriteHtml = `<li id="${favorite.id}">${favorite.name} <br> By: ${favorite.artist_name}<br> Rating: ${favorite.rating}<button class="add-btn btn" id="add-${favorite.id}">Add to Playlist</button> <button class="remove-btn btn" id="remove-${favorite.id}">Remove</button></li>`
  document.querySelector(DOMstrings.favoritesList).insertAdjacentHTML('beforeend', favoriteHtml)
}

(function() {
  fetch('http://localhost:3000/api/v1/favorites')
    .then((response) => response.json())
    .then((favorites) => postFavorites(favorites))
    .catch((error) => console.error({ error }));
})();

function postFavorites(favorites) {
  favorites.forEach(favorite => {
    const favoriteHtml = `<li id="${favorite.id}">${favorite.name} <br> By: ${favorite.artist_name}<br> Rating: ${favorite.rating}<button class="add-btn btn" id="add-${favorite.id}">Add to Playlist</button> <button class="remove-btn btn" id="remove-${favorite.id}">Remove</button></li>`
    document.querySelector(DOMstrings.favoritesList).insertAdjacentHTML('beforeend', favoriteHtml)
  })
};

(function() {
  fetch('http://localhost:3000/api/v1/playlists')
    .then((response) => response.json())
    .then(playlists => listPlaylists(playlists))
    .catch(error => console.error({ error }));
})();

function playlistTotalRating(playlist) {
  return playlist.favorites.reduce((accumulator, favorite) => {
    return accumulator + favorite.rating
  }, 0)
};

function listPlaylists(playlists) {
  const sortedPlaylists = playlists.sort((playlist1, playlist2) => {
    const songTotal1 = playlistTotalRating(playlist1)
    const songTotal2 = playlistTotalRating(playlist2)
    return (songTotal1 / playlist1.favorites.length) - (songTotal2 / playlist2.favorites.length)
  }).reverse();
  sortedPlaylists.forEach((playlist, index) => {
    const playlistHtml = `<button class="remove-btn btn" id="remove-${playlist.id}">Remove</button><button class="accordion" id="playlist-${playlist.id}">${playlist.playlist_name}</button><div class="panel" id="songs-panel-${playlist.id}"></div>`
    document.querySelector(DOMstrings.playlistsList).insertAdjacentHTML('beforeend', playlistHtml)
    listSongs(playlist.favorites, playlist.id)
  })
};

function listSongs(songs, playlist) {
  songs.forEach(song => {
    const songHtml = `<div id="${song.id}">Track Title: ${song.name} Artist: ${song.artist_name} Rating: ${song.rating}</div>`
    document.getElementById('songs-panel-'+playlist).insertAdjacentHTML('beforeend', songHtml)
  })
}

document.querySelector(DOMstrings.favoritesList).addEventListener('click', function(event) {
  if (event.target.className === 'add-btn btn' && document.querySelector('.active')) {
    const rawHtml = event.path[1].innerHTML;
    const favoriteId = parseInt(event.path[1].id);
    const playlistId = document.querySelector('.active').id
    getCleanFavorite(favoriteId, rawHtml, playlistId);
  }
})

document.querySelector(DOMstrings.addPlaylistBtn).addEventListener('click', function(event) {
  let newPlaylistTitle = document.querySelector(DOMstrings.addPlaylistForm).value;

  fetch(`http://localhost:3000/api/v1/playlists`, {
    method: 'POST',
    headers: { 'Content-Type':
      'application/json'},
    body: JSON.stringify({
      playlists:{
          playlist_name: newPlaylistTitle
          }
        })
      })
      .then(res => res.json())
      .then(response => appendPlaylistList(response[0]))
      .catch(error => console.error({ error }));

})

function appendPlaylistList(playlist) {
  const playlistHtml = `<button class="remove-btn btn" id="remove-${playlist.id}">Remove</button><button class="accordion" id="playlist-${playlist.id}">${playlist.playlist_name}</button><div class="panel" id="songs-panel-${playlist.id}"></div>`
  document.querySelector(DOMstrings.playlistsList).insertAdjacentHTML('beforeend', playlistHtml)
}

function getCleanFavorite(id, rawHtml, playlistId) {
  let songRaw, newSongRaw, cleanPlaylistId;
  songRaw = rawHtml.split('<');
  newSongRaw = songRaw[0] + songRaw[1] + songRaw[2];
  newSongRaw = newSongRaw.replace(' br> By: ', ',');
  newSongRaw = newSongRaw.replace('br> Rating: ', ',');
  newSongRaw = newSongRaw.split(',');
  cleanPlaylistId = parseInt(playlistId.split('-')[1]);
  appendPlaylist(id, newSongRaw[0], newSongRaw[1], newSongRaw[2], cleanPlaylistId)
}

function appendPlaylist(id, name, artistName, rating, playlistId) {
  const newSongHtml = `<div id="${id}">Track Title: ${name} Artist: ${artistName} Rating: ${rating}</div>`
  document.getElementById('songs-panel-'+playlistId).insertAdjacentHTML('beforeend', newSongHtml)
  postFavoriteToPlaylist(id, playlistId);
}

function postFavoriteToPlaylist(favoriteSongId, playlistId) {
  fetch(`http://localhost:3000/api/v1/playlists/${playlistId}/favorites/${favoriteSongId}`, {
    method: 'POST',
    headers: { 'Content-Type':
      'application/json'},
    body: JSON.stringify({
      playlist_favorites:{
          playlist_id: playlistId,
          favorite_id: favoriteSongId
          }
        })
      })
      .then(() => console.log('Song has been added'))
      .catch(error => console.error({ error }));
}

document.querySelector(DOMstrings.playlistsList).addEventListener('click', function(event) {
    if (event.target.className === 'accordion' || event.target.className === 'accordion active') {
      if (document.querySelector('.active')) {
        var oldSelection = document.querySelector('.active');
        oldSelection.classList.remove("active");
        oldSelection.nextElementSibling.style.display = "none";
        event.target.classList.toggle("active");
      }else  {
        event.target.classList.toggle("active");
      }

      let panel = event.target.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
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
    trackObjArray = []
  }
}

document.getElementById('favorites-list').addEventListener('click', removeFavorite);

function removeFavorite(event) {
  if(event.target.innerHTML === "Remove") {
    const favoriteId = event.target.id.split('-')[1];
    fetch('http://localhost:3000/api/v1/favorites/' + favoriteId, {
      method: 'DELETE'
    })
    .then()
    .catch(error => {
      console.error({ error })
    });
    event.target.parentElement.remove();
  };
};
