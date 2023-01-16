
const searchInput = document.getElementById('search-input')
const searchButton = document.getElementById('search-button')
const cardsEl = document.getElementById('cards')
const moviesFullData = []
const moviesId = []
let addButton

async function getMovieData(name) {

    const response = await fetch(`https://www.omdbapi.com/?apikey=c286dd4c&s=${name}`)
    const moviesData = await response.json()


    for (let movie of moviesData.Search) {
        const movieId = movie.imdbID
        moviesId.push(movieId)
        const res = await fetch(`https://www.omdbapi.com/?apikey=c286dd4c&i=${movieId}`)
        const fullData = await res.json()

        let isFav = false
        const favMovies = getFromLs()
        for (let movie of favMovies) {
            if (movie.id === movieId) {
                isFav = true
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
            fav: isFav
        })
    }
    return moviesFullData
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
    const { id, image, title, rate, runtime, genre, plot, fav } = data
    return `
    <div class="card">
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
                        <img class="add-button-image" src=${fav ? "/images/Icon3.png" : "/images/Icon2.png"} alt="">
                    </div>
                    <p>Watchlist</p>
                </div>
            </div>
            <div class="card-text">
                <p class="movie-description">${plot}</p>
            </div>
        </div
    </div>
    
    `
}



function getSeparatorHtml() {
    return `<div class="separator"></div>`
}


searchButton.addEventListener('click', async () => {
    cardsEl.innerHTML = ''
    const movieName = searchInput.value
    let fullData
    await getMovieData(movieName).then(data => { fullData = data })
    for (let el of fullData) {
        cardsEl.innerHTML += getCardHtml(el)
        cardsEl.innerHTML += getSeparatorHtml()
    }
})

document.addEventListener('click', (event) => {
    if (event.target.className === 'add-button-image') {
        const targetId = event.target.parentElement.dataset.add
        const targetMovie = moviesFullData.filter(movie => movie.id === targetId)
        if (getFromLs().indexOf(targetId) > -1) {
            setToLs(targetMovie[0])
            targetMovie[0].fav = true
        }
        
    }
})

// localStorage.setItem('favMovies', JSON.stringify([]))


function setToLs(movie) {
    const list = getFromLs()
    localStorage.setItem('favMovies', JSON.stringify([...list, movie.id]))
}

function getFromLs() {
    const movies = JSON.parse(localStorage.getItem('favMovies'))
    return movies === null ? [] : movies
}


// localStorage.removeItem('favMovies')






