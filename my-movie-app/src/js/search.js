import { fetchMoviesWithFilters } from './api.js';
import { displaySearchResults } from './ui.js';

const searchForm = document.getElementById('search-form');
const filtersForm = document.getElementById('filters-form');

if (searchForm) {
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    const query = searchInput.value.trim();
    if (!query) return;

    const movies = await fetchMoviesWithFilters(query);
    displaySearchResults(movies);
  });
}

// Filter and order
if (filtersForm) {
  filtersForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    const genre = document.getElementById('genre-filter').value;
    const year = document.getElementById('year-filter').value;
    const sort = document.getElementById('sort-filter').value;

    const movies = await fetchMoviesWithFilters(query, genre, year, sort);
    displaySearchResults(movies);
  });
}

// Register the search history whenever a user views the details of a movie
export function saveSearchHistory(movieId) {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];;

  //Verify if the movieId is already in the searchHistory
  if (!searchHistory.includes(movieId)) {
    searchHistory.push(movieId);

    // Limit the search history to 5 items
    if (searchHistory.length > 5) {
      searchHistory.shift(); //Remove oldest item
    }

    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }
}