// This file is in the entry point in your webpack config.
import './styles.scss';

const DOMstrings = {
  searchButton: '#search-btn',
  searchField: '#search-field'
}
document.querySelector(DOMstrings.searchButton).addEventListener('click', function(event) {
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
      tracks.forEach(track => {
        const trackHtml = `<li>${track.track.track_name}</li>`
        document.getElementById('search-results').insertAdjacentHTML('beforeend', trackHtml)
      })
    }
  })
})
