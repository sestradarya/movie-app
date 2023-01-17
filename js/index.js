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
  return moviesFullData.filter((movie) => favMovies.indexOf(movie.id) === -1);
}

// function renderPlaceholder(){
//     document.getElementById('cards').innerHTML = `
//         <div class="placeholder">
//                 <img src="/images/Icon.png" alt="">
//                 <h2>Start exploring</h2>
//         </div>
//     `
// }

// renderPlaceholder()

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
                        ${
                          fav
                            ? '<i class="fa-solid fa-plus"></i>'
                            : ' <i class="<i class="fa-solid fa-minus"></i>'
                        }
                    </div>
                    <p>Watchlist</p>
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
  renderMovies();
});

async function renderMovies() {
  cardsEl.innerHTML = "";
  const movieName = searchInput.value;
  let fullData;
  await getMovieData(movieName).then((data) => {
    fullData = data;
  });
  for (let el of fullData) {
    cardsEl.innerHTML += getCardHtml(el);
    cardsEl.innerHTML += getSeparatorHtml();
  }
  document.querySelectorAll(".fa-plus").forEach((btn) => {
    btn.addEventListener("click", () => {
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

// document.addEventListener("click", (event) => {
//   if (event.target.className === "add-button-image") {
//     const targetId = event.target.parentElement.dataset.add;
//     const targetMovie = moviesFullData.filter((movie) => movie.id === targetId);
//     if (getFromLs().indexOf(targetId) > -1) {
//       setToLs(targetMovie[0]);
//       targetMovie[0].fav = true;
//     }
//   }
// });

// localStorage.setItem('favMovies', JSON.stringify([]))

function setToLs(movie) {
  const list = getFromLs();
  localStorage.setItem("favMovies", JSON.stringify([...list, movie.id]));
}

function getFromLs() {
  const movies = JSON.parse(localStorage.getItem("favMovies"));
  return movies === null ? [] : movies;
}

// localStorage.removeItem('favMovies')

// Все фильмы которые появляются записывать в сешн сторедж, потом их рендерить, дальше при нажатии кнопки удалять их из сешн сторедж и снова рендерить
// фильмы из сторедж
// и баг при слишком большом колличестве запросов. Он перестает выводить фильмы
// возможно подключить реакт роутер

// при нажатии на название фильма получать его айди используя дата-..., доставать из локалстореджа по айди и рендерить зановоновую карточку на полные экран
// но если доступна дополнительная информаця

// do smth with let on moviefulldata
