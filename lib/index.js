// This file is in the entry point in your webpack config.
import './styles.scss';

const DOMstrings = {
  searchButton: '#search-btn',
  searchField: '#search-field',
  searchResults: '#search-results',
  searchedArtist: '#searched-artist',
  favoriteStar: '.favorite-star',
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
      tracks.forEach(track => {
        const trackHtml = `<li>${track.track.track_name} <img src="./empty-star.png" alt="favorite" class="favorite-star"></li>`
        document.querySelector(DOMstrings.searchResults).insertAdjacentHTML('beforeend', trackHtml)
      })
    }
  })
  resetSearchField();
});

document.querySelector(DOMstrings.searchResults).addEventListener('click', function(event) {
    event.target.src = "./filled-star.png";
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
}
