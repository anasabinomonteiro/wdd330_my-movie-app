// Import modules and configure events
import './search.js';
import './details.js';
import './favorites.js';
import { displaySearchResults, displayRecommendations } from './ui.js'; // imported function to show results
import { fetchPopularMovies } from './api.js'; // imported funtion to search for poplar movies

// When the page load, search for and show popular films
document.addEventListener('DOMContentLoaded', async () => {
    // Verify if is the homepage
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        try {
            const movies = await fetchPopularMovies();
            displaySearchResults(movies);

            // Display recommendations based on the search history
            displayRecommendations();
        } catch (error) {
        console.error('Error to search popular movies:', error);
    }
  }
})

function updateCurrentYear() {
    const year = document.getElementById('currentYear');
    if (year) {
        const currentYear = new Date().getFullYear();
        year.textContent = currentYear;
    }
}

document.addEventListener('DOMContentLoaded', updateCurrentYear);
