import { fetchWhereToWatch } from './api.js';
const TMDB_API_KEY = '55d6f7a56945cb0906b10816ff8b13d1';

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('watch-search-form');
    const searchInput = document.getElementById('watch-search-input');
    const whereWatchContainer = document.getElementById('where-watch-container');

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const query = searchInput.value.trim();
        if (!query) return;

        whereWatchContainer.innerHTML = '<p>Loading...</p>';

        const searchResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
        const searchData = await searchResponse.json();
         
        if(searchData.results.length === 0) {
            whereWatchContainer.innerHTML = '<p>No results found for this Title</p>';
            return;
        }

        const movieId = searchData.results[0].id;
        const platforms = await fetchWhereToWatch(movieId);

        whereWatchContainer.innerHTML = ''; // Clear previous results
        
        if (platforms.length === 0) {
            whereWatchContainer.innerHTML = '<p>No streaming platforms found for this title</p>';
            return;
        }

        platforms.forEach((platform) => {
            const platformElement = document.createElement('div');
            platformElement.classList.add('platform-card');
            platformElement.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w200${platform.logo_path}" alt="${platform.provider_name}" />
                <p>${platform.provider_name}</p>
            `;
            whereWatchContainer.appendChild(platformElement);
        });
    });
});