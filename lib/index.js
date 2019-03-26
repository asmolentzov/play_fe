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
  playlistsList: '#playlists-list'
}

function Track(id, trackName, trackRating, artistName) {
  this.id = id;
  this.trackName = trackName;
  this.trackRating = trackRating;
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
  const favoriteHtml = `<li id="${favorite.id}">${favorite.name} <br> By: ${favorite.artist_name} <button class="add-btn btn" id="add-${favorite.id}">Add to Playlist</button> <button class="remove-btn btn" id="remove-${favorite.id}">Remove</button></li>`
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
    const favoriteHtml = `<li id="${favorite.id}">${favorite.name} <br> By: ${favorite.artist_name} <button class="add-btn btn" id="add-${favorite.id}">Add to Playlist</button> <button class="remove-btn btn" id="remove-${favorite.id}">Remove</button></li>`
    document.querySelector(DOMstrings.favoritesList).insertAdjacentHTML('beforeend', favoriteHtml)
  })
};

(function() {
  fetch('http://localhost:3000/api/v1/playlists')
    .then((response) => response.json())
    .then(playlists => listPlaylists(playlists))
    .catch(error => console.error({ error }));
})();

function listPlaylists(playlists) {
  playlists.forEach(playlist => {
    const playlistHtml = `<li id="${playlist.id}">Playlist Name: ${playlist.playlist_name}</li>`
    document.querySelector(DOMstrings.playlistsList).insertAdjacentHTML('beforeend', playlistHtml)
  })
};

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
