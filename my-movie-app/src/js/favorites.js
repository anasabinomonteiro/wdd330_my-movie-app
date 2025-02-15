// Get favorites from local storage
export function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

//Add a movie /serie to favorites
export function addFavorite(movie) {
    let favorites = getFavorites();

    //Avoid duplicates
    if (!favorites.some(fav => fav.id === movie.id)) {
        favorites.push(movie);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

// Remove a movie /serie from favorites
export function removeFavorite(movieId) {
    let favorites = getFavorites();
    favorites = favorites.filter(movie => movie.id !== movieId);
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Update the exhibition of the favorites
    if (document.getElementById('favorites-container')) {
        displayFavorites();
    }
}

// Display favorites
export function displayFavorites() {
    const container = document.getElementById('favorites-container');

    if (!container) {
        console.error('Favorites container not found');
        return;
    }

    const favorites = getFavorites();
    container.innerHTML = '';

    if (favorites.length === 0) {
        container.innerHTML = '<p>You have no favorites yet</p>';
        return;
    }

    favorites.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('favorite');
        movieElement.innerHTML = `
            <img src="${movie.poster_path ? 'https://image.tmdb.org/t/p/w185' + movie.poster_path : 'https://via.placeholder.com/200x300'}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.release_date || 'No release date available'}</p>
            <p>Rating: ${movie.vote_average || 'N/A'}</p>
            <button class="remove-button" data-id="${movie.id}">Remove</button>
            `;
        container.appendChild(movieElement);
    });

    // Add event listener to remove buttons
    document.querySelectorAll('.remove-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const movieId = parseInt(event.target.getAttribute('data-id'));
            removeFavorite(movieId);
        });
    });
}

// Run if the favorites page is loaded
if (window.location.pathname.includes('favorites.html')) {
    document.addEventListener('DOMContentLoaded', displayFavorites);
}
