import { viewDetails } from "./details.js";
import { addFavorite } from "./favorites.js";
import { fetchSimilarMovies } from "./api.js";

export function displaySearchResults(movies) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // clear previous results before displaying new ones

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('result-item');
        movieElement.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" />
        <h3>${movie.title}</h3>
        <p>${movie.release_date}</p>
        <button class='details-button' data-id ='${movie.id}'>View Details</button>
        <button class='favorite-button' data-id='${movie.id}'>Add to Favorites</button>
    `;
        resultsContainer.appendChild(movieElement);
    });

    //Button listener for 'View details'
    document.querySelectorAll('.details-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const movieId = event.target.getAttribute('data-id');
            if (movieId) {
                viewDetails(movieId);
            } else {
                console.error('Error, movieId is null or undefined!');
            }
        });
    });

    //Button listener for 'Add to favorites'
    document.querySelectorAll('.favorite-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const movieId = event.target.getAttribute('data-id');
                        
            if (!movieId) {
                console.error('Error, movieId is null or undefined!');
                return;
            }

            const movieData = movies.find(movie => movie.id == movieId);
            console.log('Movie found', movieData);

            if (movieData) {
                addFavorite(movieData);
                console.log(`Movie added to favorites : ${movieData.title}`);

                const message = document.createElement('div');
                message.textContent = `${movieData.title} added to favorites!`;
                message.classList.add('favorite-message');
                document.body.appendChild(message);

                // Remove after 3 seconds
                setTimeout(() => {
                    message.remove();
                }, 3000);
                
            } else {
                console.error(`Error, movie data not found! ${movieId}`);
            }
        });
    })
}

export async function displayRecommendations() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const recommendationsContainer = document.getElementById('rec-container');

    if (!recommendationsContainer) {
        console.warn('Warning: Recommendations container not found!');
        return;
    }

    recommendationsContainer.innerHTML = ''; // clear previous results before displaying new ones

    for (let movieId of searchHistory) {
        const similarMovies = await fetchSimilarMovies(movieId);

        similarMovies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}" />
            <h3>${movie.title}</h3>
            <p>${movie.release_date}</p>
            `;

            recommendationsContainer.appendChild(movieCard);
        });
    }
}
