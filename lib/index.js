// This file is in the entry point in your webpack config.
import './styles.scss';

const DOMstrings = {
  searchButton: '#search-btn',
  searchField: '#search-field'
}
document.querySelector(DOMstrings.searchButton).addEventListener('click', function(event) {
  const artist = document.querySelector(DOMstrings.searchField).value;
  fetch('https://api.musixmatch.com/ws/1.1/track.search')
})