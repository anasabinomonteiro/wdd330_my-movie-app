const TMDB_API_KEY = '55d6f7a56945cb0906b10816ff8b13d1';
const OMDB_API_KEY = 'a0bd8ce7';
const BASE_URL_TMDB = 'https://api.themoviedb.org/3';
const BASE_URL_OMDB = 'http://www.omdbapi.com';

//function to search for movies/series by title
export async function fetchMovies(query) {
    const response = await fetch(`${BASE_URL_TMDB}/search/movie?api_key=${TMDB_API_KEY}&query=${query}`);
    const data = await response.json();
    return data.results;
}

//Function for search movie/series details by Id
export async function fetchMovieDetails(movieId) {
    const response = await fetch(`${BASE_URL_TMDB}/movie/${movieId}?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    return data; // return the movie details
}

// Search popular movies
export const fetchPopularMovies = async () => {
    try {
        const url = `${BASE_URL_TMDB}/movie/popular?api_key=${TMDB_API_KEY}`;
        const response = await fetch(url);

        //Check if response ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching popular movies', error);
        throw error;
    }
}

// Fetch ratings from TMDB
export async function fetchTMDBRatings(movieId) {
    try {
        const response = await fetch(`${BASE_URL_TMDB}/movie/${movieId}/release_dates?api_key=${TMDB_API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return {
            rating: data.vote_average,
            voteCount: data.vote_count
        };
    } catch (error) {
        console.error('Error fetching ratings', error);
        return null;
    }
}

// Fetch ratings from OMDB (IMDB)
export async function fetchOMDBRatings(imdbId) {
    try {
        const response = await fetch(`${BASE_URL_OMDB}/?i=${imdbId}&apikey=${OMDB_API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.Ratings || [];
    } catch (error) {
        console.error('Error fetching ratings', error);
        return null;
    }
}

// Search recommendations based on a movie that the user was viewing
export async function fetchSimilarMovies(movieId) {
    try {
        const response = await fetch(`${BASE_URL_TMDB}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching similar movies', error);
        return null;
    }
}

export async function fetchWhereToWatch(movieId) {
    try {
        const response = await fetch(`${BASE_URL_TMDB}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.results?.US?.flatrate || [];

    } catch (error) {
        console.error('Error fetching where to watch', error);
        return [];
    }
}

// Function to search for movies with filters
export async function fetchMoviesWithFilters(query, genre, year, sort) {
    let url = `${BASE_URL_TMDB}/discover/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;

    // Add filters to the URL
    if (genre) url += `&with_genres=${genre}`;
    if (year) url += `&primary_release_year=${year}`;
    if (sort) url += `&sort_by=${sort}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching movies with filters', error);
        return [];
    }
}