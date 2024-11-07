const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");
const searchResults = document.querySelector(".search-results");
//search button
searchButton.addEventListener("click", ()=>{
    const words = searchInput.value.trim();
    if(words){
        searchResults.innerHTML = "";
        searchMovies(words)
    };
    searchInput.value = "";
})
//Enter key when searching
searchInput.addEventListener("keyup", (e)=> {
    const words = searchInput.value.trim();
    if(words && e.code === "Enter"){
        searchResults.innerHTML = "";
        searchMovies(words);
        searchInput.value = "";
    }
});
//API authorization
const options = {
    method: 'GET',
    headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTVlNTMyMzU2NDVjMDhmZThkMjk4ZGNlMzYzNjcwYSIsIm5iZiI6MTczMDkwMzAwNC44MTA5ODEsInN1YiI6IjY3MjhjOTg5NTkxODEzN2NmYzM5YmQzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dUbXWDEJReBdEZeqZygnCo9Xp2qq0xp1tjBDZG1H-bA'
    }
};
//Search button function
const searchMovies = async (str) => {
    const response  = await fetch(`https://api.themoviedb.org/3/search/movie?query=${str}&include_adult=false&language=en-US&page=1`, options)
    const myObj = await response.json();
    const posterArray = getPosterURL(myObj.results); 
    displaySearchResult(posterArray, str);
}
//return anarray of poster paths 
const getPosterURL = (arr) => {
    const postersURL = [];
    arr.forEach(movie => postersURL.push(movie.poster_path));
    console.log(postersURL);
    return postersURL;
}

const displaySearchResult = (arr, str) => {
    const h2 = document.createElement("h2");
    h2.textContent = "Search results for: " + str;
    searchResults.appendChild(h2);
    //swiper container
    const swiperContainer = document.createElement("swiper-container");
    swiperContainer.setAttribute("navigation","true");
    swiperContainer.setAttribute("space-between","20");
    swiperContainer.setAttribute("slides-per-view","4");
    swiperContainer.setAttribute("mousewheel","true");
    swiperContainer.classList.add("image-container");
    searchResults.appendChild(swiperContainer);
    //images
    for(let i = 0; i < 20; i++){
        const slide = document.createElement("swiper-slide");
        const img = document.createElement("img");
        img.setAttribute("src", `https://image.tmdb.org/t/p/w500${arr[i]}`)
        slide.appendChild(img);
        swiperContainer.appendChild(slide);
    }
}

// call api for poster image
// ex: https://image.tmdb.org/t/p/w500/yUTzpRHEWHSZerpKcozoA9NlvQR.jpg

