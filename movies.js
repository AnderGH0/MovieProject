//////////////Configuration de la clé 
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOTkxOGM2ODNjNWRiMjA1ZTE5MzJiMjk0MDkxZmMwMyIsIm5iZiI6MTczMTA3MjY3Ny41NzQ0OTg3LCJzdWIiOiI2NzI4YzhjNWMwOTAxMDk1ODBmYTA3MTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Ljvx6E0tkOA4F6h-Vd-3qQalnVQNVeFp8cJCRlODppc'
  }
};

///////////// éléments du DOM 
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const searchContainer = document.getElementById('search');
const latestContainer = document.getElementById('latest');
const genreList = document.querySelectorAll('.movies-by-genre ul li');
const displayGenreContainer = document.querySelector('.display-genre');

//////// stocker les genre ID / NOM 

let genreListMap = {};

// récupérer la liste des genres
async function fetchGenres() {
    const response = await fetch('https://api.themoviedb.org/3/genre/movie/list', options);
    const data = await response.json();
    
    // Créer un objet pour lier les ID avec les noms 
    genreListMap = data.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
    }, {});
}

// Appeler la fonction 
fetchGenres();



/////// fonction pour la recherche 

// récupérer les données dans l'api 
async function fetchMovies(query) {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}`, options);
    const data = await response.json();
    return data.results;
}

// gère la recherche avec la valeur entrée et la place dans L'api 
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    const movies = await fetchMovies(query);
    displayResultsInSwiper(movies);
}

// afficher les résultats dans le Swiper
function displayResultsInSwiper(movies) {
    if (movies.length === 0) {
        searchContainer.innerHTML = `<p>Aucun résultat trouvé pour "${searchInput.value}".</p>`;
        return;
    }
    // ajout ce que doit contenir le container avec le swiper et le hover 
    searchContainer.innerHTML = `
        <h2>Résultats pour "${searchInput.value}"</h2>
        <swiper-container class="image-container" navigation="true" space-between="20" slides-per-view="4" mousewheel="true">
            ${movies.map(movie => `
                <swiper-slide>
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">

                    <div class="hover-info">
                        <div class="hover-title">${movie.title}</div>
                        <div class="hover-year">${movie.release_date.split('-')[0]}</div>
                        <div class="hover-genres">${movie.genre_ids.map(id => genreListMap[id]).join(' / ')}</div>
                        <img src="img/star.png" alt="Rating">
                        <div class="hover-rating">${movie.vote_average.toFixed(1)}</div>
                    </div>
                </swiper-slide>
            `).join('')}
        </swiper-container>
    `;
    // ajout des pop up directement sinon n'attendant pas la fin du telechargement et donc ne s'affiche pas 
    addMoviePopupListeners(movies);
}

// afficher cela que on clique pour lancer la recherche 
searchButton.addEventListener('click', handleSearch);

//////////// Fonction pour récupérer les derniers films
// API 
async function LatestSearch() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing`, options);
    const data = await response.json();
    return data.results;
}

//  le Swiper , affichage , hover, pop-up 
async function displayUpcomingInSwiper() {
    const movies = await LatestSearch();
    if (movies.length === 0) {
        latestContainer.innerHTML = `<p>Aucun film à venir trouvé.</p>`;
        return;
    }
    latestContainer.innerHTML = `
        <h2>Latest releases</h2>
        <swiper-container class="image-container" navigation="true" space-between="20" slides-per-view="4" mousewheel="true">
            ${movies.map(movie => `
                <swiper-slide>
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                    <div class="hover-info">
                        <div class="hover-title">${movie.title}</div>
                        <div class="hover-year">${movie.release_date.split('-')[0]}</div>
                        <div class="hover-genres">${movie.genre_ids.map(id => genreListMap[id]).join(' / ')}</div>
                        <img src="img/star.png" alt="Rating">
                        <div class="hover-rating">${movie.vote_average.toFixed(1)}</div>
                    </div>
                </swiper-slide>
            `).join('')}
        </swiper-container>
    `;
    addMoviePopupListeners(movies);
}

// appel pour afficher 
displayUpcomingInSwiper();


///////////// fonction pour la recherche de genre 
// API 
async function genreSearch(genreId) {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}`, options);
    const data = await response.json();
    return data.results;
}
// affichage , swiper, hover , pop-UP 
function displayMoviesGenre(movies) {
    if (movies.length === 0) {
        displayGenreContainer.innerHTML = `<p>Aucun film trouvé pour ce genre.</p>`;
        return;
    }

    displayGenreContainer.innerHTML = `
        <swiper-container class="image-container" navigation="true" space-between="20" slides-per-view="4" mousewheel="true">
            ${movies.map(movie => `
                <swiper-slide>
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                    <div class="hover-info">
                        <div class="hover-title">${movie.title}</div>
                        <div class="hover-year">${movie.release_date.split('-')[0]}</div>
                        <div class="hover-genres">${movie.genre_ids.map(id => genreListMap[id]).join(' / ')}</div>
                        <img src="img/star.png" alt="Rating">
                        <div class="hover-rating">${movie.vote_average.toFixed(1)}</div>
                    </div>
                </swiper-slide>
            `).join('')}
        </swiper-container>
    `;
    addMoviePopupListeners(movies);
}
// ajout de l'event sur chaque li 
genreList.forEach((li, index) => {
    li.addEventListener('click', async () => {
        const genreId = Object.keys(genreListMap)[index];
        if (genreId) {
            const movies = await genreSearch(genreId);
            displayMoviesGenre(movies);
        }
    });
});






/////////////// POP-UP FILM 
//DOM 
const popupFilm = document.querySelector('.movie-popup');
const closeFilm = document.querySelector('.movie-popup .cross');
// recherche des données du film par API 
function openFilm(movie) {
    popupFilm.querySelector('.movie-img img').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    popupFilm.querySelector('.movie-title').textContent = movie.title;
    popupFilm.querySelector('.movie-year').textContent = movie.release_date.split('-')[0];
    popupFilm.querySelector('.movie-rating').textContent = movie.vote_average.toFixed(1);
    // Convertir les IDs en genres 
    const genreNames = movie.genre_ids.map(id => genreListMap[id] || 'Unknown').join(' / ');
    popupFilm.querySelector('.movie-genres').textContent = genreNames;
    popupFilm.querySelector('.movie-synopsis').textContent = movie.overview;
    popupFilm.style.display = 'block';
}





// fermer quand on clique sur la croix 
function closeFilmFunction() {
    popupFilm.style.display = 'none';
}

// ajout de l'ouverture des pop-ups pour chaque slide 
function addMoviePopupListeners(movies) {
    const imageFilms = document.querySelectorAll("swiper-slide");
    
    imageFilms.forEach((slide, index) => {
        slide.addEventListener('click', () => openFilm(movies[index]));
    });
}

closeFilm.addEventListener('click', closeFilmFunction);

////////////// POP-UP LOGIN 
// DOM 
const loginPopup = document.querySelector('.login-popup');
const openSignin = document.getElementById('openSignin');
const openRegister = document.getElementById('openRegister');
const closeLoginPopup = loginPopup.querySelector('.cross');
 
// ouvrir
function openLoginPopup() {
    loginPopup.style.display = 'block';
}
//fermer
function closeLoginPopupFunction() {
    loginPopup.style.display = 'none';
}
// event autant sur REGISTER que SIGNIN 
openSignin.addEventListener('click', openLoginPopup);
openRegister.addEventListener('click', openLoginPopup);
closeLoginPopup.addEventListener('click', closeLoginPopupFunction);