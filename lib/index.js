// This file is in the entry point in your webpack config.
import './styles.scss';

const DOMstrings = {
  searchButton: '#search-btn',
  searchField: '#search-field'
}
document.querySelector(DOMstrings.searchButton).addEventListener('click', function(event) {
  event.preventDefault();
  const artist = document.querySelector(DOMstrings.searchField).value;
  fetch(`https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?apikey=${process.env.MUSIXMATCH_API_KEY}&q_artist=${artist}`)
  .then(response => response.json())
  .then(songs => console.log(songs))
  .catch(error => console.log(error))
})