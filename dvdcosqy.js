// APP VIDÉO + API

// 1) Faire le HTML / CSS 

// 2) Récup les éléments depuis JS

// 3) Faire la recherche de film (on recup ce qu'il y a dans l'input 
// et on fait une requete http)

// 4) On affiche les films 

// 5) On crée un bouton pour les favoris 

// 6) On récupère le film liké pour l'ajouter à un tableau de favoris (par exemple)

// On veut pouvoir préserver les favoris meme après fermeture du navigateur 
// On veut pouvoir supprimer un film de la liste et ne pas ajouter 2 fois le meme

// Pusher sur guthub une fois fini !! 

// Good luck

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const movieList = document.getElementById('movieList');
    const favorites = document.getElementById('favorites');

    // Fonction pour faire une requête HTTP à l'API OMDB
    async function searchMovie(query) {
        const apiKey = '905f57b3';
        const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.Search) {
                displayMovies(data.Search);
            } else {
                console.error('No movies found');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Fonction pour afficher les films
    function displayMovies(movies) {
        movieList.innerHTML = '';
        movies.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.classList.add('movie');
            movieItem.innerHTML = `
                <h3>${movie.Title}</h3>
                <p>${movie.Year}</p>
                <img src="${movie.Poster}" alt="${movie.Title} Poster">
                <button class="favorite-button">Add to Favorites</button>
            `;
            const favoriteButton = movieItem.querySelector('.favorite-button');
            favoriteButton.addEventListener('click', () => addToFavorites(movie));
            movieList.appendChild(movieItem);
        });
    }

    // Fonction pour ajouter un film aux favoris
    function addToFavorites(movie) {
        const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
        if (!favoriteMovies.some(fav => fav.imdbID === movie.imdbID)) {
            favoriteMovies.push(movie);
            localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));

            const favoriteItem = document.createElement('div');
            favoriteItem.classList.add('favorite-item');
            favoriteItem.innerHTML = `
                <span>${movie.Title}</span>
                <button class="remove-favorite-button">Remove</button>
            `;
            const removeFavoriteButton = favoriteItem.querySelector('.remove-favorite-button');
            removeFavoriteButton.addEventListener('click', () => removeFavorite(movie));
            favorites.appendChild(favoriteItem);
        }
    }

    // Fonction pour supprimer un film des favoris
    function removeFavorite(movie) {
        const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
        const updatedFavorites = favoriteMovies.filter(fav => fav.imdbID !== movie.imdbID);
        localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
        displayFavorites(updatedFavorites);
    }

    // Fonction pour afficher les films favoris
    function displayFavorites(favoriteMovies) {
        favorites.innerHTML = '<h2>Favorites</h2>';
        favoriteMovies.forEach(movie => {
            const favoriteItem = document.createElement('div');
            favoriteItem.classList.add('favorite-item');
            favoriteItem.innerHTML = `
                <span>${movie.Title}</span>
                <button class="remove-favorite-button">Remove</button>
            `;
            const removeFavoriteButton = favoriteItem.querySelector('.remove-favorite-button');
            removeFavoriteButton.addEventListener('click', () => removeFavorite(movie));
            favorites.appendChild(favoriteItem);
        });
    }

    // Événement de clic sur le bouton de recherche
    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        searchMovie(query);
    });

    // Affichage initial des films favoris
    const initialFavorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    displayFavorites(initialFavorites);
});