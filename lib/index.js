// This file is in the entry point in your webpack config.
import './styles.scss';

const DOMstrings = {
  searchButton: '#search-btn',
  searchField: '#search-field',
  searchResults: '#search-results',
  searchedArtist: '#searched-artist',
  favoriteStar: '.favorite-star',
}

function Track(trackName, trackRating, artistName) {
  this.trackName = trackName;
  this.trackRating = trackRating;
  this.artistName = artistName;
}

document.querySelector(DOMstrings.searchButton).addEventListener('click', function(event) {
  clearSearchResults();
  event.preventDefault();
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
      document.querySelector(DOMstrings.searchedArtist).insertAdjacentHTML('beforeend', artistHtml)
      const trackHtml = `<li>%trackName% <img src="./empty-star.png" alt="favorite" class="favorite-star"></li>`
      let trackObjArray = []
      tracks.forEach(track => {
        trackObjArray.push(new Track(track.track.track_name, track.track.track_rating, artist))
      })
      console.log(trackObjArray);
      trackObjArray.forEach(track => {
        let newTrackHtml = trackHtml.replace('%trackName%', track.trackName)
        document.querySelector(DOMstrings.searchResults).insertAdjacentHTML('beforeend', newTrackHtml)
      })
    }
  })
  resetSearchField();
});



document.querySelector(DOMstrings.searchResults).addEventListener('click', function(event) {
    event.target.src = "./filled-star.png";
    // fetch('http://localhost:3000/api/v1/favorites', {
    //   method: 'post',
    //   body: JSON.stringify({
    //         name: document.getElementById('name').value,
    //         hoglets: document.getElementById('hoglets').value,
    //         allergies: document.getElementById('allergies').value
    //       })
    //
    // })
    // .then(function() {
    //
    // })
})

(function() {
  fetch('http://localhost:3000/api/v1/favorites')
    .then((response) => response.json())
    .then((favorites) => postFavorites(favorites))
    .catch((error) => console.error({ error }));
})();

function postFavorites(favorites) {
  favorites.forEach(favorite => {
    const favoriteHtml = `<li id="${favorite.id}">${favorite.name} By: ${favorite.artist_name}</li>`
    document.getElementById('favorites-list').insertAdjacentHTML('beforeend', favoriteHtml)
  })
};

function resetSearchField() {
  document.querySelector(DOMstrings.searchField).value = "";
  document.querySelector(DOMstrings.searchField).focus();
}

function clearSearchResults() {
  document.querySelector(DOMstrings.searchResults).innerHTML = "";
  document.querySelector(DOMstrings.searchedArtist).innerHTML = "";
  trackObjArray = []
}
