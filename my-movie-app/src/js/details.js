import { fetchMovieDetails, fetchTMDBRatings, fetchOMDBRatings } from "./api.js";
import { saveSearchHistory } from "./search.js";

export async function viewDetails(movieId) {
    console.log('Movie Id', movieId)
    if (!movieId) {
        console.error('Error: movieId invalid!');
        return;
    }

    try {
        const details = await fetchMovieDetails(movieId);
        console.log(details); // to see what is returning

        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalRating_TMDB = document.getElementById('modal-rating-tmdb');
        const modalRating_IMDB = document.getElementById('modal-rating-imdb');
        const modalWhereToWatch = document.getElementById('modal-where-to-watch');
        const modalPoster = document.getElementById('modal-poster');
        const modalTrailer = document.getElementById('modal-trailer');
        const modal = document.getElementById('details-modal');

        if (!modalTitle || !modalDescription || !modalRating_TMDB || !modalRating_IMDB || !modalWhereToWatch || !modalPoster || !modalTrailer || !modal) {
            console.error('Error: Missing required elements in the modal');
            return;
        }

        // Show details in the modal
        modalTitle.textContent = details.title || 'No title available';
        modalDescription.textContent = details.overview || 'No description available';
        modalRating_TMDB.textContent = `Rating: ${details.vote_average || 'N/A'}`;
        modalRating_IMDB.textContent = `IMDB ID: ${details.imdb_id || 'N/A'}`;
        modalWhereToWatch.textContent = 'Available on: ' + (details.homepage || 'No information available');

        // Show Poster img  
        modalPoster.src = details.poster_path
            ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
            : 'https://via.placeholder.com/200x300?text=No+Image';

        // Show trailer
        if (details.videos?.results.length > 0) {
            modalTrailer.innerHTML = `<iframe src='https://www.youtube.com/embed/${details.videos.results[0].key}' frameborder='0'></iframe>`;
        } else {
            modalTrailer.innerHTML = 'No trailer available';
        }

        // Search and display TMDb evaluations
        const tmdbRatings = await fetchTMDBRatings(movieId);
        document.getElementById('modal-rating-tmdb').textContent =
            (tmdbRatings && tmdbRatings.rating && tmdbRatings.voteCount)
                ? `TMDB Rating: ${tmdbRatings.rating} (${tmdbRatings.voteCount} votes)`
                : 'No TMDB rating available';

        // Search and display OMDB evaluations
        const omdbRatings = await fetchOMDBRatings(details.imdb_id);
        document.getElementById('modal-rating-imdb').innerHTML = omdbRatings.length > 0
            ? omdbRatings.map(rating => `<p>${rating.Source}: ${rating.Value}</p>`).join('')
            : 'No ratings available';

        // Comments area
        function loadComments(movieId) {
            const comments = JSON.parse(localStorage.getItem(`comments_${movieId}`)) || [];
            const commentsList = document.getElementById('comments-list');
            commentsList.innerHTML = comments.map(comment => `<li>${comment}</li>`).join('');
        }

        function addComment(movieId, comment) {
            const comments = JSON.parse(localStorage.getItem(`comments_${movieId}`)) || [];
            comments.push(comment);
            localStorage.setItem(`comments_${movieId}`, JSON.stringify(comments));
            loadComments(movieId);
        }

        // Load comments when opening the modal
        loadComments(movieId);

        // Event listener for add comment button
        const submitButton = document.getElementById('submit-comment');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                const commentInput = document.getElementById('comment-input');
                const comment = commentInput.value.trim();

                if (comment) {
                    addComment(movieId, comment);
                    commentInput.value = '';
                }
            });
        }

        // Save search history
        saveSearchHistory(movieId);

        // Open Modal   
        modal.style.display = 'flex';

    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Close modal with click button "❌"
document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.querySelector('.close-button');
    const modal = document.getElementById('details-modal');

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Close modal with click outside modal
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
