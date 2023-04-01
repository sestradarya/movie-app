const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const cardsEl = document.getElementById("cards");
let moviesFullData = [];
const moviesId = [];
let addButton;

async function getMovieData(name) {
  moviesFullData = [];
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=c286dd4c&s=${name}`
  );
  const moviesData = await response.json();
  const favMovies = getFromLs();

  try {
    for (let movie of moviesData.Search) {
      const movieId = movie.imdbID;
      moviesId.push(movieId);
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=c286dd4c&i=${movieId}`
      );
      const fullData = await res.json();

      let isFav = false;

      for (let movie of favMovies) {
        if (movie.id === movieId) {
          isFav = true;
        }
      }

      moviesFullData.push({
        id: movieId,
        title: fullData.Title,
        rate: fullData.imdbRating,
        runtime: fullData.Runtime,
        genre: fullData.Genre,
        plot: fullData.Plot,
        image: fullData.Poster,
        fav: isFav,
      });
    }
  } catch (error) {
    cardsEl.innerHTML = `
        <p class='message'>Nothing found <br> Specify your request, please</p>
    `;
  }

  return moviesFullData.filter((movie) => favMovies.indexOf(movie.id) === -1);
}

function renderPlaceholder() {
  document.getElementById("cards").innerHTML = `
        <div class="placeholder">
                <img src="/images/Icon.png" alt="">
                <h2>Start exploring</h2>
        </div>
    `;
}
renderPlaceholder();

function getCardHtml(data) {
  const { id, image, title, rate, runtime, genre, plot, fav } = data;
  return `
    <div class="card" data-id=${id}>
        <img src=${image} class="movie-image" alt="">
        <div class="card-description">
            <div class="card-title">
                <p class="movie-name">${title}</p>
                <p class="movie-rate">${rate}</p>
            </div>
            <div class="card-captions">
                <p class="movie-time">${runtime}</p>
                <p class="movie-genre">${genre}</p>
                <div class="movie-add">
                    <div class="add-button" data-add=${id}>
                        <i class="fa-solid fa-plus" ></i>
                    </div>
                    <p>Add</p>
                </div>
            </div>
            <div class="card-text">
                <p class="movie-description">${plot}</p>
            </div>
        </div
    </div>
    
    `;
}

function getSeparatorHtml() {
  return `<div class="separator"></div>`;
}

searchButton.addEventListener("click", () => {
  cardsEl.innerHTML = `
        <p class='message'>Searching for movies...</p>
    `;
  renderMovies();
});

async function renderMovies() {
  
  const movieName = searchInput.value;
  let fullData;
  await getMovieData(movieName).then((data) => {
    fullData = data;
  });
  cardsEl.innerHTML = "";
  for (let el of fullData) {
    cardsEl.innerHTML += getCardHtml(el);
    cardsEl.innerHTML += getSeparatorHtml();
  }
  document.querySelectorAll(".fa-plus").forEach((btn) => {
    btn.addEventListener("click", () => {
      cardsEl.innerHTML = `
      <p class='message'>Adding a movie to your watchlist...</p>
      `
      targetId = btn.parentElement.dataset.add;
      const targetMovie = moviesFullData.filter(
        (movie) => movie.id === targetId
      );
      console.log(targetMovie);
      setToLs(targetMovie[0]);
      //   targetMovie[0].fav = true;

      moviesFullData = moviesFullData.filter((movie) => movie.id !== targetId);
      renderMovies();
    });
  });
}

function setToLs(movie) {
  const list = getFromLs();
  localStorage.setItem("favMovies", JSON.stringify([...list, movie.id]));
}

function getFromLs() {
  const movies = JSON.parse(localStorage.getItem("favMovies"));
  return movies === null ? [] : movies;
}

searchInput.addEventListener("click", () => {
  searchInput.value = "";
});


// и баг при слишком большом колличестве запросов. Он перестает выводить фильмы
// возможно подключить реакт роутер


