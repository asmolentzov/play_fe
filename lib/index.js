// This file is in the entry point in your webpack config.
import './styles.scss';

const DOMstrings = {
  searchButton: '#search-btn',
  searchField: '#search-field',
  searchResults: '#search-results',
  searchedArtist: '#searched-artist',
}
document.querySelector(DOMstrings.searchButton).addEventListener('click', function(event) {
  clearSearch();
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
        const trackHtml = `<li>${track.track.track_name}</li>`
        document.querySelector(DOMstrings.searchResults).insertAdjacentHTML('beforeend', trackHtml)
      })
    }
  })
})

function clearSearch() {
  document.querySelector(DOMstrings.searchResults).innerHTML = "";
  document.querySelector(DOMstrings.searchedArtist).innerHTML = "";
}
