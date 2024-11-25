// Configuration de la clé API et des en-têtes
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOTkxOGM2ODNjNWRiMjA1ZTE5MzJiMjk0MDkxZmMwMyIsIm5iZiI6MTczMTA3MjY3Ny41NzQ0OTg3LCJzdWIiOiI2NzI4YzhjNWMwOTAxMDk1ODBmYTA3MTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Ljvx6E0tkOA4F6h-Vd-3qQalnVQNVeFp8cJCRlODppc'
  }
};

// Récupérer les éléments dans le DOM
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const searchContainer = document.getElementById('search');
const latestContainer = document.getElementById('latest');

// Fonction pour récupérer les films depuis l'API en fonction de la recherche
    async function fetchMovies(query) {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}`, options); // Ajout de 'await' ici
        const data = await response.json(); // Convertir en JSON pour récupérer les résultats
        return data.results;
    }


// Fonction pour gérer la recherche
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return; // Assurez-vous qu'il y a une valeur de recherche
    const movies = await fetchMovies(query); // Récupère les films en fonction de la recherche
    displayResultsInSwiper(movies); // Affiche les résultats dans le Swiper
}

// Fonction pour afficher les résultats dans le Swiper
function displayResultsInSwiper(movies) {
    if (movies.length === 0) {
        searchContainer.innerHTML = `<p>Aucun résultat trouvé pour "${searchInput.value}".</p>`;
        return;
    }
    searchContainer.innerHTML = `
        <h2>Résultats pour "${searchInput.value}"</h2>
        <swiper-container class="image-container" navigation="true" space-between="20" slides-per-view="4" mousewheel="true">
            ${movies.map(movie => `
                <swiper-slide>
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                </swiper-slide>
            `).join('')}
        </swiper-container>
    `;
}

// Ajouter un écouteur d'événement sur le bouton de recherche
searchButton.addEventListener('click', handleSearch);

    async function LatestSearch() {
            const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing`, options);
            const data = await response.json(); // Convertir en JSON pour récupérer les résultats
            return data.results;
        } 


// Fonction pour afficher les derniers films dans le Swiper
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
                </swiper-slide>
            `).join('')}
        </swiper-container>
    `;

}

// Appel de displayUpcomingInSwiper au chargement de la page pour afficher les derniers films à venir
displayUpcomingInSwiper();

// un display selon un genre 
async function genreSearch() {
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}`, options);
    const data = await response.json(); // Convertir en JSON pour récupérer les résultats
    return data.results;
} 

